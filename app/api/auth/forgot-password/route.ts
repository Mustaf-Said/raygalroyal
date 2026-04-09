import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

type ForgotPasswordBody = {
  email?: string
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
      flowType: "implicit",
    },
  }
)

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ForgotPasswordBody

    if (!isNonEmptyString(body.email)) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const email = body.email.trim().toLowerCase()
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    const redirectTo = new URL("/reset-password", req.url).toString()
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })

    if (error) {
      console.error("Failed to send freelancer password reset email", error)
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Unexpected forgot-password error", error)
    return NextResponse.json({ error: "Failed to request password reset" }, { status: 500 })
  }
}