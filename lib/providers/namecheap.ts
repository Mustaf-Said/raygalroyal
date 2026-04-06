type NamecheapCheckResult = {
  domain: string
  available: boolean
  price: number | null
  isPremium: boolean
  pricingStatus: "live" | "check_price" | "premium_check" | "estimated"
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

function parseXmlNumberAttr(xml: string, element: string, attr: string): number | null {
  const value = parseXmlAttr(xml, element, attr)
  if (!value) return null

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function parseDomainCheckIsPremium(xml: string): boolean {
  const value = parseXmlAttr(xml, "DomainCheckResult", "IsPremiumName")
  return value === "true"
}

function getDomainTld(domain: string): string {
  const lower = domain.toLowerCase()
  const firstDotIndex = lower.indexOf(".")
  if (firstDotIndex < 0 || firstDotIndex === lower.length - 1) {
    return ""
  }

  return lower.slice(firstDotIndex + 1)
}

function parseTagAttr(tag: string, attr: string): string | null {
  const pattern = new RegExp(`${attr}="([^"]+)"`, "i")
  const match = tag.match(pattern)
  return match?.[1] ?? null
}

async function fetchLiveDomainRegistrationPrice(domain: string): Promise<number | null> {
  const tld = getDomainTld(domain)
  if (!tld) return null

  const creds = getNamecheapCredentials()

  const params = new URLSearchParams({
    ApiUser: creds.apiUser!,
    ApiKey: creds.apiKey!,
    UserName: creds.userName!,
    ClientIp: creds.clientIp!,
    Command: "namecheap.users.getPricing",
    ProductType: "DOMAIN",
    ProductCategory: "register",
    ActionName: "register",
  })

  const response = await fetch(`${NAMECHEAP_API_BASE}?${params.toString()}`, {
    method: "GET",
    cache: "no-store",
  })

  const xml = await response.text()

  if (!response.ok) {
    return null
  }

  const productTags = xml.match(/<Product\b[^>]*>/gi) || []
  for (const tag of productTags) {
    const name = parseTagAttr(tag, "Name")?.toLowerCase() || ""
    const normalizedName = name.startsWith(".") ? name.slice(1) : name

    if (normalizedName !== tld) {
      continue
    }

    const candidateValues = [
      parseTagAttr(tag, "YourPrice"),
      parseTagAttr(tag, "Price"),
      parseTagAttr(tag, "RegularPrice"),
    ]

    for (const candidate of candidateValues) {
      const parsed = Number(candidate)
      if (Number.isFinite(parsed) && parsed >= 0) {
        return parsed
      }
    }
  }

  return null
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

export async function checkDomainAvailability(domain: string): Promise<NamecheapCheckResult> {
  if (!hasNamecheapCredentials()) {
    return {
      domain,
      available: false,
      price: null,
      isPremium: false,
      pricingStatus: "check_price",
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

  const isPremium = parseDomainCheckIsPremium(xml)
  if (isPremium) {
    const premiumPrice = parseXmlNumberAttr(xml, "DomainCheckResult", "PremiumRegistrationPrice")
    return {
      domain,
      available: parseXmlFlag(xml),
      price: premiumPrice,
      isPremium,
      pricingStatus: "premium_check",
    }
  }

  const livePrice = await fetchLiveDomainRegistrationPrice(domain)
  if (livePrice !== null) {
    return {
      domain,
      available: parseXmlFlag(xml),
      price: Number(livePrice.toFixed(2)),
      isPremium,
      pricingStatus: "live",
    }
  }

  return {
    domain,
    available: parseXmlFlag(xml),
    price: null,
    isPremium,
    pricingStatus: "estimated",
  }
}
