import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/server/supabaseAdmin"

type AddOnId = "ssl" | "hosting" | "email"

type AddOnRow = {
  id: AddOnId
  price: number | null
  enabled: boolean | null
}

const DEFAULT_ADD_ONS: Array<{ id: AddOnId; price: number; enabled: boolean }> = [
  { id: "ssl", price: 9.99, enabled: true },
  { id: "hosting", price: 24.99, enabled: true },
  { id: "email", price: 14.99, enabled: true },
]

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("domain_add_ons")
      .select("id, price, enabled")
      .in("id", ["ssl", "hosting", "email"])

    if (error || !Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ data: DEFAULT_ADD_ONS, source: "fallback" })
    }

    const byId = new Map((data as AddOnRow[]).map((item) => [item.id, item]))

    const normalized = DEFAULT_ADD_ONS.map((fallbackItem) => {
      const row = byId.get(fallbackItem.id)
      const price = Number(row?.price)
      const enabled = row?.enabled

      return {
        id: fallbackItem.id,
        price: Number.isFinite(price) && price >= 0 ? Number(price.toFixed(2)) : fallbackItem.price,
        enabled: typeof enabled === "boolean" ? enabled : fallbackItem.enabled,
      }
    })

    return NextResponse.json({ data: normalized, source: "supabase" })
  } catch (error) {
    console.error("[DomainAddOns] Failed to load add-ons", error)
    return NextResponse.json({ data: DEFAULT_ADD_ONS, source: "fallback" })
  }
}
