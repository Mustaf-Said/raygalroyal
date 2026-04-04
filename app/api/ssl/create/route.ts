import { NextRequest, NextResponse } from "next/server"
import { isValidFullDomain } from "@/lib/domain/validation"
import { issueSslCertificate } from "@/lib/providers/ssl"
import { supabaseAdmin } from "@/lib/server/supabaseAdmin"

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      domain?: string
    }

    const domain = body.domain?.trim().toLowerCase() || ""

    if (!isValidFullDomain(domain)) {
      return NextResponse.json({ error: "Invalid domain format" }, { status: 400 })
    }

    const ssl = await issueSslCertificate(domain)

    const { data, error } = await supabaseAdmin
      .from("ssl_certificates")
      .insert({
        domain,
        status: ssl.status,
        issued_at: ssl.issuedAt,
      })
      .select("*")
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[SslCreate] Failed", error)
    return NextResponse.json({ error: "SSL issuance failed" }, { status: 500 })
  }
}
