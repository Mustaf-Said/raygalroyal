import { NextRequest, NextResponse } from "next/server"
import { isValidFullDomain } from "@/lib/domain/validation"
import { registerDomainWithNamecheap } from "@/lib/providers/namecheap"

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      domain?: string
      customerEmail?: string
      customerName?: string
    }

    const domain = body.domain?.trim().toLowerCase() || ""
    const customerEmail = body.customerEmail?.trim() || ""
    const customerName = body.customerName?.trim() || ""

    if (!isValidFullDomain(domain)) {
      return NextResponse.json({ error: "Invalid domain format" }, { status: 400 })
    }

    if (!customerEmail || !customerEmail.includes("@")) {
      return NextResponse.json({ error: "Valid customer email is required" }, { status: 400 })
    }

    if (!customerName) {
      return NextResponse.json({ error: "Customer name is required" }, { status: 400 })
    }

    const result = await registerDomainWithNamecheap({
      domain,
      customerEmail,
      customerName,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("[DomainRegister] Failed", error)
    return NextResponse.json({ error: "Domain registration failed" }, { status: 500 })
  }
}
