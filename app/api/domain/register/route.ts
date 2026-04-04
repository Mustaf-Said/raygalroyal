import { NextRequest, NextResponse } from "next/server"
import { isValidFullDomain } from "@/lib/domain/validation"
import { generateNamecheapAffiliateLink } from "@/lib/domain/affiliate"

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      domain?: string
    }

    const domain = body.domain?.trim().toLowerCase() || ""

    if (!isValidFullDomain(domain)) {
      return NextResponse.json({ error: "Invalid domain format" }, { status: 400 })
    }

    return NextResponse.json(
      {
        error: "Domain registration is handled via Namecheap affiliate redirect",
        affiliateUrl: generateNamecheapAffiliateLink(domain),
      },
      { status: 410 }
    )
  } catch (error) {
    console.error("[DomainRegister] Failed", error)
    return NextResponse.json({ error: "Could not generate affiliate checkout URL" }, { status: 500 })
  }
}
