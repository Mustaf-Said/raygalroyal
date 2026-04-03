import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

type LoginBody = {
  email?: string
  password?: string
}

const supabase = createClient(
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

    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email.trim().toLowerCase(),
      password: body.password,
    })

    if (error || !data.session || !data.user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      accessToken: data.session.access_token,
      userId: data.user.id,
    })
  } catch {
    return NextResponse.json({ error: "Failed to login freelancer" }, { status: 500 })
  }
}
