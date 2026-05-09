import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/server/supabaseAdmin"

type AddOnId = "ssl" | "hosting" | "email" | "dns" | "vpn"

type AddOnRow = {
  id: AddOnId
  enabled: boolean | null
}

const ADD_ON_LABELS: Record<AddOnId, string> = {
  ssl: "SSL Certificate",
  hosting: "Web Hosting",
  email: "Business Email",
  dns: "DNS Management",
  vpn: "VPN",
}

const DEFAULT_ADD_ONS: Array<{ id: AddOnId; enabled: boolean }> = [
  { id: "ssl", enabled: true },
  { id: "hosting", enabled: true },
  { id: "email", enabled: true },
  { id: "dns", enabled: true },
  { id: "vpn", enabled: true },
]

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("domain_add_ons")
      .select("id, enabled")
      .in("id", ["ssl", "hosting", "email", "dns", "vpn"])

    if (error || !Array.isArray(data) || data.length === 0) {
      return NextResponse.json({
        data: DEFAULT_ADD_ONS.map((item) => ({
          id: item.id,
          name: ADD_ON_LABELS[item.id],
          enabled: item.enabled,
          priceLabel: "Price available at registrar",
        })),
        source: "fallback",
      })
    }

    const byId = new Map((data as AddOnRow[]).map((item) => [item.id, item]))

    const normalized = DEFAULT_ADD_ONS.map((fallbackItem) => {
      const row = byId.get(fallbackItem.id)
      const enabled = row?.enabled

      return {
        id: fallbackItem.id,
        name: ADD_ON_LABELS[fallbackItem.id],
        enabled: typeof enabled === "boolean" ? enabled : fallbackItem.enabled,
        priceLabel: "Price available at registrar",
      }
    })

    return NextResponse.json({ data: normalized, source: "supabase" })
  } catch (error) {
    console.error("[DomainAddOns] Failed to load add-ons", error)
    return NextResponse.json({ data: DEFAULT_ADD_ONS, source: "fallback" })
  }
}
