import { NextRequest, NextResponse } from "next/server"
import {
  buildMockDomainResults,
  isValidDomainLabel,
  normalizeDomainQuery,
} from "@/lib/domain/domainSearch"

export async function GET(req: NextRequest) {
  const rawDomain = req.nextUrl.searchParams.get("domain") || ""
  const normalized = normalizeDomainQuery(rawDomain)

  if (!normalized || !isValidDomainLabel(normalized)) {
    return NextResponse.json({ error: "Invalid domain query" }, { status: 400 })
  }

  // TODO: replace mocked provider with registrar API integration.
  const results = buildMockDomainResults(normalized)
  return NextResponse.json(results)
}
