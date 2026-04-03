import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { requireAdminFromRequest } from "@/lib/adminAuth"
import type { Database } from "@/lib/database.types"

type ApproveBody = {
  id?: number | string
  title_en?: string
  title_so?: string
  title_ar?: string
  bio_en?: string
  bio_so?: string
  bio_ar?: string
}

type FreelancerUpdate = Database["public"]["Tables"]["freelancers"]["Update"]

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
    const body = (await req.json()) as ApproveBody
    const id = typeof body.id === "string" ? Number(body.id) : body.id

    if (typeof id !== "number" || Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid application id" }, { status: 400 })
    }

    const { data: freelancer, error: fetchError } = await supabase
      .from("freelancers")
      .select("id, role, bio, message, status")
      .eq("id", id)
      .single()

    if (fetchError || !freelancer) {
      return NextResponse.json({ error: "Freelancer not found" }, { status: 404 })
    }

    if (freelancer.status === "approved") {
      return NextResponse.json({ success: true, alreadyApproved: true })
    }

    const baseRole = freelancer.role?.trim() || "pending-profile"
    const baseBio = freelancer.bio?.trim() || freelancer.message
    const titleEn = typeof body.title_en === "string" && body.title_en.trim().length > 0
      ? body.title_en.trim()
      : baseRole
    const titleSo = typeof body.title_so === "string" ? body.title_so.trim() : ""
    const titleAr = typeof body.title_ar === "string" ? body.title_ar.trim() : ""
    const bioEn = typeof body.bio_en === "string" && body.bio_en.trim().length > 0
      ? body.bio_en.trim()
      : baseBio
    const bioSo = typeof body.bio_so === "string" ? body.bio_so.trim() : ""
    const bioAr = typeof body.bio_ar === "string" ? body.bio_ar.trim() : ""

    const freelancerPayload: FreelancerUpdate = {
      status: "approved",
      role: baseRole,
      bio: baseBio,
      title_en: titleEn,
      title_so: titleSo,
      title_ar: titleAr,
      bio_en: bioEn,
      bio_so: bioSo,
      bio_ar: bioAr,
    }

    const { error: updateError } = await supabase
      .from("freelancers")
      .update(freelancerPayload)
      .eq("id", id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Failed to approve freelancer application" },
      { status: 500 }
    )
  }
}
