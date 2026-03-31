import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { requireAdminFromRequest } from "@/lib/adminAuth"
import type { Database } from "@/lib/database.types"

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const adminCheck = await requireAdminFromRequest(req)
  if (!adminCheck.ok) {
    return adminCheck.response
  }

  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("id, name, message, message_en, message_so, message_ar, rating, admin_response, status, created_at")
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: data ?? [] })
  } catch {
    return NextResponse.json({ error: "Failed to fetch admin reviews" }, { status: 500 })
  }
}
