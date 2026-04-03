import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { requireAdminFromRequest } from "@/lib/adminAuth"
import type { Database } from "@/lib/database.types"

type FreelancerApplicationBody = {
  name?: string
  email?: string
  role?: string
  message?: string
}

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export async function GET(req: NextRequest) {
  const adminCheck = await requireAdminFromRequest(req)
  if (!adminCheck.ok) {
    return adminCheck.response
  }

  try {
    const { data, error } = await supabase
      .from("freelancers")
      .select("id, user_id, name, email, role, bio, profile_image, phone, github, message, status, created_at, title_en, title_so, title_ar, bio_en, bio_so, bio_ar")
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: data ?? [] })
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch freelancer applications" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as FreelancerApplicationBody

    if (
      !isNonEmptyString(body.name) ||
      !isNonEmptyString(body.email) ||
      !isNonEmptyString(body.role) ||
      !isNonEmptyString(body.message)
    ) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, role, message" },
        { status: 400 }
      )
    }

    const email = body.email.trim().toLowerCase()
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    const { data: existingFreelancer, error: existingFreelancerError } = await supabase
      .from("freelancers")
      .select("id")
      .eq("email", email)
      .limit(1)
      .maybeSingle()

    if (existingFreelancerError) {
      return NextResponse.json({ error: existingFreelancerError.message }, { status: 500 })
    }

    if (existingFreelancer) {
      return NextResponse.json(
        { error: "This email already exists. Use another email." },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: "Create account first, then complete your profile in freelancer dashboard." },
      { status: 400 }
    )
  } catch {
    return NextResponse.json(
      { error: "Failed to submit freelancer application" },
      { status: 500 }
    )
  }
}
