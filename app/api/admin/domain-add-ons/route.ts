import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { requireAdminFromRequest } from "@/lib/adminAuth"

type AddOnId = "ssl" | "hosting" | "email"

type AddOnItem = {
  id: AddOnId
  price: number
  enabled: boolean
  updated_at?: string
}

const ADD_ON_IDS: AddOnId[] = ["ssl", "hosting", "email"]

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function normalizeRows(rows: Array<Partial<AddOnItem>>): AddOnItem[] {
  const byId = new Map(rows.map((row) => [row.id, row]))

  return ADD_ON_IDS.map((id) => {
    const row = byId.get(id)
    const parsedPrice = Number(row?.price)

    return {
      id,
      price: Number.isFinite(parsedPrice) && parsedPrice >= 0 ? Number(parsedPrice.toFixed(2)) : 0,
      enabled: typeof row?.enabled === "boolean" ? row.enabled : true,
      updated_at: typeof row?.updated_at === "string" ? row.updated_at : undefined,
    }
  })
}

export async function GET(req: NextRequest) {
  const adminCheck = await requireAdminFromRequest(req)
  if (!adminCheck.ok) {
    return adminCheck.response
  }

  try {
    const { data, error } = await supabase
      .from("domain_add_ons")
      .select("id, price, enabled, updated_at")
      .in("id", ADD_ON_IDS)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: normalizeRows((data ?? []) as Array<Partial<AddOnItem>>) })
  } catch {
    return NextResponse.json({ error: "Failed to fetch domain add-ons" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const adminCheck = await requireAdminFromRequest(req)
  if (!adminCheck.ok) {
    return adminCheck.response
  }

  try {
    const body = (await req.json()) as {
      items?: Array<Partial<AddOnItem>>
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "items array is required" }, { status: 400 })
    }

    const nowIso = new Date().toISOString()

    const sanitized = body.items.map((item) => {
      const id = item.id
      const price = Number(item.price)

      if (!id || !ADD_ON_IDS.includes(id)) {
        throw new Error("Invalid add-on id")
      }

      if (!Number.isFinite(price) || price < 0) {
        throw new Error("Invalid add-on price")
      }

      return {
        id,
        price: Number(price.toFixed(2)),
        enabled: item.enabled === true,
        updated_at: nowIso,
      }
    })

    const { error } = await supabase
      .from("domain_add_ons")
      .upsert(sanitized, { onConflict: "id" })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data, error: fetchError } = await supabase
      .from("domain_add_ons")
      .select("id, price, enabled, updated_at")
      .in("id", ADD_ON_IDS)

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    return NextResponse.json({ data: normalizeRows((data ?? []) as Array<Partial<AddOnItem>>) })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update domain add-ons"
    const status = message.startsWith("Invalid") ? 400 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
