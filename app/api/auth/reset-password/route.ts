import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

type ResetPasswordBody = {
  token?: string
  password?: string
}

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
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

const isLikelyJwt = (value: string) => value.split(".").length === 3

async function resolveResetUser(token: string) {
  if (isLikelyJwt(token)) {
    const { data, error } = await supabase.auth.getUser(token)
    if (error || !data.user) {
      return { error: error ?? new Error("Invalid token") }
    }

    return { user: data.user }
  }

  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: token,
    type: "recovery",
  })

  if (error || !data.user) {
    return { error: error ?? new Error("Invalid token") }
  }

  return { user: data.user }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ResetPasswordBody

    if (!isNonEmptyString(body.token) || !isNonEmptyString(body.password)) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      )
    }

    const token = body.token.trim()
    const password = body.password

    if (password.trim().length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    const resolvedUser = await resolveResetUser(token)
    if ("error" in resolvedUser) {
      return NextResponse.json(
        { error: "Invalid or expired reset link" },
        { status: 400 }
      )
    }

    const { error: updateError } = await supabase.auth.admin.updateUserById(
      resolvedUser.user.id,
      { password }
    )

    if (updateError) {
      console.error("Failed to update freelancer password", updateError)
      return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Unexpected reset-password error", error)
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 })
  }
}