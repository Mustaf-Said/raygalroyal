import type { HostingPlan } from "@/lib/domain/constants"

const HETZNER_API_BASE = process.env.HETZNER_API_BASE || "https://api.hetzner.cloud/v1"

const PLAN_TO_SERVER_TYPE: Record<HostingPlan, string> = {
  basic: process.env.HETZNER_SERVER_TYPE_BASIC || "cx22",
  pro: process.env.HETZNER_SERVER_TYPE_PRO || "cx32",
  business: process.env.HETZNER_SERVER_TYPE_BUSINESS || "cx42",
}

export async function createHetznerHostingServer(domain: string, plan: HostingPlan) {
  const token = process.env.HETZNER_API_TOKEN

  if (!token || process.env.MOCK_INFRA_PROVISIONING === "true") {
    return {
      serverId: `mock-hetzner-${plan}-${Date.now()}`,
      status: "active" as const,
    }
  }

  const payload = {
    name: `host-${domain.replace(/\./g, "-")}-${Date.now()}`,
    server_type: PLAN_TO_SERVER_TYPE[plan],
    image: process.env.HETZNER_IMAGE || "ubuntu-24.04",
    location: process.env.HETZNER_LOCATION || "nbg1",
  }

  const response = await fetch(`${HETZNER_API_BASE}/servers`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const json = (await response.json()) as { server?: { id?: number } }
  if (!response.ok || !json.server?.id) {
    throw new Error("Failed to create Hetzner server")
  }

  return {
    serverId: String(json.server.id),
    status: "active" as const,
  }
}
