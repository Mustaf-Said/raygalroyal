import { NextResponse } from "next/server"
import { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"
import { requireUserFromRequest, isAdminUser } from "@/lib/requestAuth"

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  try {
    const isAdminView = req.nextUrl.searchParams.get("admin") === "1"

    if (isAdminView) {
      const auth = await requireUserFromRequest(req)
      if (!auth.ok) {
        return auth.response
      }

      if (!isAdminUser(auth.user)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }

      const { data, error } = await supabase
        .from("freelancers")
        .select("id, user_id, name, role, bio, profile_image, phone, github, email, message, status, created_at")
        .order("created_at", { ascending: false })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ data: data ?? [] })
    }

    const { data, error } = await supabase
      .from("freelancers")
      .select("id, name, role, bio, bio_en, bio_so, bio_ar, profile_image, title_en, title_so, title_ar")
      .eq("status", "approved")
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data ?? [])
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch freelancers" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireUserFromRequest(req)
  if (!auth.ok) {
    return auth.response
  }

  if (!isAdminUser(auth.user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = (await req.json()) as { id?: number | string; status?: "approved" | "rejected" }
    const id = typeof body.id === "string" ? Number(body.id) : body.id

    if (typeof id !== "number" || Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid freelancer id" }, { status: 400 })
    }

    if (body.status !== "approved" && body.status !== "rejected") {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const { error } = await supabase
      .from("freelancers")
      .update({ status: body.status })
      .eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to update freelancer" }, { status: 500 })
  }
}
