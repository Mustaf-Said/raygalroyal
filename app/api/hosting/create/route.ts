import { NextRequest, NextResponse } from "next/server"
import { isValidFullDomain } from "@/lib/domain/validation"
import { createHetznerHostingServer } from "@/lib/providers/hetzner"
import { supabaseAdmin } from "@/lib/server/supabaseAdmin"
import type { HostingPlan } from "@/lib/domain/constants"

const VALID_PLANS: HostingPlan[] = ["basic", "pro", "business"]

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      domain?: string
      plan?: HostingPlan
    }

    const domain = body.domain?.trim().toLowerCase() || ""
    const plan = body.plan

    if (!isValidFullDomain(domain)) {
      return NextResponse.json({ error: "Invalid domain format" }, { status: 400 })
    }

    if (!plan || !VALID_PLANS.includes(plan)) {
      return NextResponse.json({ error: "Invalid hosting plan" }, { status: 400 })
    }

    const server = await createHetznerHostingServer(domain, plan)

    const { data, error } = await supabaseAdmin
      .from("hosting_accounts")
      .insert({
        domain,
        server_id: server.serverId,
        plan,
      })
      .select("*")
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[HostingCreate] Failed", error)
    return NextResponse.json({ error: "Hosting provisioning failed" }, { status: 500 })
  }
}
