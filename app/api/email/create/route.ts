import { NextRequest, NextResponse } from "next/server"
import { isValidFullDomain } from "@/lib/domain/validation"
import { createZohoMailbox } from "@/lib/providers/zoho"
import { supabaseAdmin } from "@/lib/server/supabaseAdmin"

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      domain?: string
      emailAddress?: string
    }

    const domain = body.domain?.trim().toLowerCase() || ""
    const emailAddress = body.emailAddress?.trim().toLowerCase() || ""

    if (!isValidFullDomain(domain)) {
      return NextResponse.json({ error: "Invalid domain format" }, { status: 400 })
    }

    if (!emailAddress || !emailAddress.includes("@")) {
      return NextResponse.json({ error: "Valid email address is required" }, { status: 400 })
    }

    await createZohoMailbox(emailAddress)

    const { data, error } = await supabaseAdmin
      .from("email_accounts")
      .insert({
        domain,
        email_address: emailAddress,
        provider: "zoho",
      })
      .select("*")
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[EmailCreate] Failed", error)
    return NextResponse.json({ error: "Email provisioning failed" }, { status: 500 })
  }
}
