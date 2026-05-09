import { NextRequest, NextResponse } from "next/server"
import {
  isValidDomainLabel,
  normalizeDomainQuery,
} from "@/lib/domain/domainSearch"
import { checkDomainAvailability } from "@/lib/providers/namecheap"
import { SUPPORTED_TLDS } from "@/lib/domain/constants"
import { isValidFullDomain } from "@/lib/domain/validation"

export async function GET(req: NextRequest) {
  try {
    const rawDomain = req.nextUrl.searchParams.get("domain") || ""
    const normalized = normalizeDomainQuery(rawDomain)

    if (!normalized) {
      return NextResponse.json({ error: "Invalid domain query" }, { status: 400 })
    }

    // Full domain request returns a single object: { domain, availability, price }
    if (normalized.includes(".")) {
      if (!isValidFullDomain(normalized)) {
        return NextResponse.json({ error: "Invalid domain format" }, { status: 400 })
      }

      const result = await checkDomainAvailability(normalized)
      return NextResponse.json({
        domain: result.domain,
        availability: result.available,
        availabilityStatus: result.availabilityStatus,
        price: result.price,
        isPremium: result.isPremium,
        pricingStatus: result.pricingStatus,
      })
    }

    if (!isValidDomainLabel(normalized)) {
      return NextResponse.json({ error: "Invalid domain query" }, { status: 400 })
    }

    const domains = SUPPORTED_TLDS.map((tld) => `${normalized}${tld}`)
    const checks = await Promise.all(domains.map((domain) => checkDomainAvailability(domain)))

    const results = checks.map((item) => ({
      domain: item.domain,
      available: item.available,
      availabilityStatus: item.availabilityStatus,
      price: item.price,
      isPremium: item.isPremium,
      pricingStatus: item.pricingStatus,
    }))

    return NextResponse.json(results)
  } catch (error) {
    console.error("[DomainCheck] Failed", error)
    return NextResponse.json({ error: "Domain lookup failed" }, { status: 500 })
  }
}
