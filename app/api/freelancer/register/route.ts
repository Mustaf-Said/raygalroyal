import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

type RegisterBody = {
  name?: string
  email?: string
  password?: string
}

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const isNotNullConstraintError = (message: string) =>
  /null value in column .* violates not-null constraint/i.test(message)

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RegisterBody

    if (
      !isNonEmptyString(body.name) ||
      !isNonEmptyString(body.email) ||
      !isNonEmptyString(body.password)
    ) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, password" },
        { status: 400 }
      )
    }

    const email = body.email.trim().toLowerCase()
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    if (body.password.trim().length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
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
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    const { data: userResult, error: createUserError } = await supabase.auth.admin.createUser({
      email,
      password: body.password.trim(),
      email_confirm: true,
      user_metadata: { role: "freelancer", name: body.name.trim() },
    })

    if (createUserError || !userResult.user) {
      const message = createUserError?.message ?? "Failed to create account"
      const status = message.toLowerCase().includes("already") ? 409 : 500
      return NextResponse.json({ error: message }, { status })
    }

    const baseInsert: Database["public"]["Tables"]["freelancers"]["Insert"] = {
      user_id: userResult.user.id,
      name: body.name.trim(),
      email,
      status: "pending",
    }

    let { error: insertError } = await supabase.from("freelancers").insert(baseInsert)

    if (insertError && isNotNullConstraintError(insertError.message)) {
      const legacyCompatibleInsert: Database["public"]["Tables"]["freelancers"]["Insert"] = {
        ...baseInsert,
        role: "pending-profile",
        bio: null,
        profile_image: null,
        phone: "",
        github: "",
        message: "",
        title_en: "",
        title_so: "",
        title_ar: "",
        bio_en: null,
        bio_so: null,
        bio_ar: null,
      }

      const retryResult = await supabase.from("freelancers").insert(legacyCompatibleInsert)
      insertError = retryResult.error
    }

    if (insertError) {
      await supabase.auth.admin.deleteUser(userResult.user.id)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to register freelancer" }, { status: 500 })
  }
}
