import { DOMAIN_BASE_PRICES } from "@/lib/domain/constants"

type NamecheapCheckResult = {
  domain: string
  available: boolean
  price: number
}

const NAMECHEAP_API_BASE = "https://api.namecheap.com/xml.response"

function parseXmlAttr(xml: string, element: string, attr: string): string | null {
  const pattern = new RegExp(`<${element}[^>]*${attr}="([^"]+)"[^>]*>`, "i")
  const match = xml.match(pattern)
  return match?.[1] ?? null
}

function parseXmlFlag(xml: string): boolean {
  const value = parseXmlAttr(xml, "DomainCheckResult", "Available")
  return value === "true"
}

function getNamecheapCredentials() {
  return {
    apiUser: process.env.NAMECHEAP_API_USER,
    apiKey: process.env.NAMECHEAP_API_KEY,
    userName: process.env.NAMECHEAP_USERNAME,
    clientIp: process.env.NAMECHEAP_CLIENT_IP,
  }
}

function hasNamecheapCredentials() {
  const creds = getNamecheapCredentials()
  return Boolean(creds.apiUser && creds.apiKey && creds.userName && creds.clientIp)
}

function getDomainPrice(domain: string): number {
  const lower = domain.toLowerCase()
  const tld = Object.keys(DOMAIN_BASE_PRICES).find((candidate) => lower.endsWith(candidate)) as
    | keyof typeof DOMAIN_BASE_PRICES
    | undefined

  if (!tld) return 15
  return DOMAIN_BASE_PRICES[tld]
}

export async function checkDomainAvailability(domain: string): Promise<NamecheapCheckResult> {
  if (!hasNamecheapCredentials()) {
    return {
      domain,
      available: Math.random() > 0.4,
      price: getDomainPrice(domain),
    }
  }

  const creds = getNamecheapCredentials()
  const params = new URLSearchParams({
    ApiUser: creds.apiUser!,
    ApiKey: creds.apiKey!,
    UserName: creds.userName!,
    ClientIp: creds.clientIp!,
    Command: "namecheap.domains.check",
    DomainList: domain,
  })

  const response = await fetch(`${NAMECHEAP_API_BASE}?${params.toString()}`, {
    method: "GET",
    cache: "no-store",
  })

  const xml = await response.text()

  if (!response.ok) {
    throw new Error(`Namecheap availability check failed with status ${response.status}`)
  }

  return {
    domain,
    available: parseXmlFlag(xml),
    price: getDomainPrice(domain),
  }
}
