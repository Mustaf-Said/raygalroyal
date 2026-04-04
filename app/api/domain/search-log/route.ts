import { NextRequest, NextResponse } from "next/server"
import { normalizeDomainQuery } from "@/lib/domain/domainSearch"
import { supabaseAdmin } from "@/lib/server/supabaseAdmin"

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { domain?: string }
    const domain = normalizeDomainQuery(body.domain || "")

    if (!domain) {
      return NextResponse.json({ error: "Invalid domain" }, { status: 400 })
    }

    const { error } = await supabaseAdmin.from("domain_search_logs").insert({ domain })
    if (error) {
      throw error
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[DomainSearchLog] Failed", error)
    return NextResponse.json({ error: "Failed to log domain search" }, { status: 500 })
  }
}
