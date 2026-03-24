import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { requireAdminFromRequest } from "@/lib/adminAuth"
import type { Database } from "@/lib/database.types"

type ApproveBody = {
  id?: number | string
}

type FreelancerInsert = Database["public"]["Tables"]["freelancers"]["Insert"]
const DEFAULT_AVATAR_URL = "https://cdn.creativefabrica.com/2021/12/25/Freelancer-avatar-icon-Graphics-22319749-2-580x387.jpg"

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

    const { data: application, error: fetchError } = await supabase
      .from("freelancer_applications")
      .select("id, name, email, role, message, linkedin_url, image_url, status")
      .eq("id", id)
      .single()

    if (fetchError || !application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    if (application.status === "approved") {
      return NextResponse.json({ success: true, alreadyApproved: true })
    }

    const normalizedEmail = application.email.trim().toLowerCase()
    const normalizedImageUrl = application.image_url?.trim() || DEFAULT_AVATAR_URL
    const freelancerPayload: FreelancerInsert = {
      name: application.name,
      email: normalizedEmail,
      role: application.role,
      message: application.message,
      image_url: normalizedImageUrl,
      linkedin_url: application.linkedin_url,
    }

    const { data: existingFreelancer, error: existingError } = await supabase
      .from("freelancers")
      .select("id")
      .eq("email", normalizedEmail)
      .limit(1)
      .maybeSingle()

    if (existingError) {
      return NextResponse.json({ error: existingError.message }, { status: 500 })
    }

    if (!existingFreelancer) {
      const { error: insertFreelancerError } = await supabase
        .from("freelancers")
        .insert(freelancerPayload)

      if (insertFreelancerError) {
        return NextResponse.json(
          { error: insertFreelancerError.message },
          { status: 500 }
        )
      }
    } else {
      const { error: updateFreelancerError } = await supabase
        .from("freelancers")
        .update(freelancerPayload)
        .eq("id", existingFreelancer.id)

      if (updateFreelancerError) {
        return NextResponse.json(
          { error: updateFreelancerError.message },
          { status: 500 }
        )
      }
    }

    const { error: updateError } = await supabase
      .from("freelancer_applications")
      .update({ status: "approved" })
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
