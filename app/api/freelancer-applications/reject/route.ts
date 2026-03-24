import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { requireAdminFromRequest } from "@/lib/adminAuth"
import type { Database } from "@/lib/database.types"

type RejectBody = {
  id?: number | string
}

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const adminCheck = await requireAdminFromRequest(req)
  if (!adminCheck.ok) {
    return adminCheck.response
  }

  try {
    const body = (await req.json()) as RejectBody
    const id = typeof body.id === "string" ? Number(body.id) : body.id

    if (typeof id !== "number" || Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid application id" }, { status: 400 })
    }

    const { data: application, error: fetchError } = await supabase
      .from("freelancer_applications")
      .select("id")
      .eq("id", id)
      .single()

    if (fetchError || !application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    const { error: updateError } = await supabase
      .from("freelancer_applications")
      .update({ status: "rejected" })
      .eq("id", id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Failed to reject freelancer application" },
      { status: 500 }
    )
  }
}
