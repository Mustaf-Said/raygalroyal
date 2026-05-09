import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { isAdminUser } from "@/lib/requestAuth"

type LoginBody = {
  email?: string
  password?: string
}

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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

    // Step 2: Verify user role - ONLY admins allowed here
    // Check if user is admin (by ADMIN_EMAILS or app_metadata.role)
    if (!isAdminUser(data.user)) {
      return NextResponse.json(
        { error: "Invalid admin account" },
        { status: 403 }
      )
    }

    // Step 3: Create session response with cookie
    const response = NextResponse.json({
      success: true,
      accessToken: data.session.access_token,
      userId: data.user.id,
    })

    // Set HTTP-only cookie for session (accessed by middleware)
    response.cookies.set("admin_session", data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    // Also set a flag cookie to indicate admin is logged in
    response.cookies.set("admin_logged_in", "true", {
      httpOnly: false, // Can be read by frontend
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return response
  } catch {
    return NextResponse.json({ error: "Failed to login" }, { status: 500 })
  }
}
