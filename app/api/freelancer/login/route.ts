import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"
import { isAdminUser } from "@/lib/requestAuth"

type LoginBody = {
  email?: string
  password?: string
}

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const supabaseServiceRole = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LoginBody

    if (!isNonEmptyString(body.email) || !isNonEmptyString(body.password)) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const normalizedEmail = body.email.trim().toLowerCase()

    // Step 1: Authenticate user with Supabase
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: normalizedEmail,
      password: body.password,
    })

    if (error || !data.session || !data.user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Step 2: Verify user role - ONLY freelancers allowed here
    // Check if user is admin (by email or app_metadata)
    if (isAdminUser(data.user)) {
      return NextResponse.json(
        { error: "Invalid freelancer account" },
        { status: 403 }
      )
    }

    // Step 3: Verify user has a freelancer profile
    const { data: freelancerProfile, error: freelancerError } = await supabaseServiceRole
      .from("freelancers")
      .select("id, user_id, email")
      .eq("email", normalizedEmail)
      .maybeSingle()

    if (freelancerError) {
      return NextResponse.json({ error: "Failed to verify freelancer account" }, { status: 500 })
    }

    if (!freelancerProfile) {
      return NextResponse.json(
        { error: "Invalid freelancer account" },
        { status: 403 }
      )
    }

    // Step 4: Return session token (only if all validations pass)
    return NextResponse.json({
      success: true,
      accessToken: data.session.access_token,
      userId: data.user.id,
    })
  } catch {
    return NextResponse.json({ error: "Failed to login" }, { status: 500 })
  }
}
