type NamecheapCheckResult = {
  domain: string
  available?: boolean
  availabilityStatus: "available" | "taken" | "premium" | "unknown"
  price: number | null
  isPremium: boolean
  pricingStatus: "live" | "check_price" | "premium_check" | "estimated"
}

const NAMECHEAP_API_BASE = "https://api.namecheap.com/xml.response"
const NAMECHEAP_PUBLIC_RESULTS_BASE = "https://r.jina.ai/http://www.namecheap.com/domains/registration/results/"

// In-memory TLD pricing cache — persists for the lifetime of the process
const pricingCache = new Map<string, number>()

function parseXmlAttr(xml: string, element: string, attr: string): string | null {
  const pattern = new RegExp(`<${element}[^>]*${attr}="([^"]+)"[^>]*>`, "i")
  const match = xml.match(pattern)
  return match?.[1] ?? null
}

function parseXmlFlag(xml: string): boolean | undefined {
  const value = parseXmlAttr(xml, "DomainCheckResult", "Available")?.toLowerCase()
  if (value === "true") return true
  if (value === "false") return false
  return undefined
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

async function fetchLiveDomainRegistrationPrice(domain: string): Promise<number | null> {
  const tld = getDomainTld(domain)
  if (!tld) return null

  // Return cached price immediately — no API call needed
  if (pricingCache.has(tld)) {
    return pricingCache.get(tld)!
  }

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

    // Cache every TLD price we encounter while we have the response
    const candidateValues = [
      parseTagAttr(tag, "YourPrice"),
      parseTagAttr(tag, "Price"),
      parseTagAttr(tag, "RegularPrice"),
    ]

    for (const candidate of candidateValues) {
      const parsed = Number(candidate)
      if (Number.isFinite(parsed) && parsed >= 0) {
        if (!pricingCache.has(normalizedName)) {
          pricingCache.set(normalizedName, parsed)
        }
        break
      }
    }
  }

  return pricingCache.get(tld) ?? null
}

type PublicDomainInfo = {
  price: number | null
  availabilityStatus: "available" | "taken" | "premium" | "unknown"
}

async function fetchPublicDomainInfo(domain: string): Promise<PublicDomainInfo> {
  try {
    const response = await fetch(`${NAMECHEAP_PUBLIC_RESULTS_BASE}?domain=${encodeURIComponent(domain)}`, {
      method: "GET",
      cache: "no-store",
    })

    if (!response.ok) {
      return { price: null, availabilityStatus: "unknown" }
    }

    const text = await response.text()
    const lowerText = text.toLowerCase()
    const domainLower = domain.toLowerCase()

    // Find the exact section for this domain (between ## markers)
    const domainHeader = `## ${domainLower}`
    const headerIndex = lowerText.indexOf(domainHeader)

    if (headerIndex < 0) {
      return { price: null, availabilityStatus: "unknown" }
    }

    // Get the section from this domain header to the next ## or end of text
    const afterHeader = headerIndex + domainHeader.length
    const nextHeaderIndex = lowerText.indexOf("\n## ", afterHeader)
    const sectionEnd = nextHeaderIndex > 0 ? nextHeaderIndex : text.length
    const section = text.slice(headerIndex, sectionEnd)

    // Determine availability status
    let availabilityStatus: "available" | "taken" | "premium" | "unknown" = "unknown"

    if (/REGISTERED IN \d{4}/i.test(section)) {
      availabilityStatus = "taken"
    } else if (/\$[\d,]+\.\d{2}\/yr/i.test(section)) {
      availabilityStatus = "available"
    }

    // Extract price from the section
    let price: number | null = null

    const priceMatch = section.match(/\$([\d,]+\.\d{2})\/yr/i)
    if (priceMatch?.[1]) {
      const parsed = Number(priceMatch[1].replace(/,/g, ""))
      if (Number.isFinite(parsed) && parsed > 0) {
        price = parsed
      }
    }

    // Check if premium
    const isPremiumMarker = /premium|minimum \d+-year/i.test(section)
    if (isPremiumMarker && price !== null) {
      availabilityStatus = "premium"
    }

    return { price, availabilityStatus }
  } catch {
    return { price: null, availabilityStatus: "unknown" }
  }
}

export async function checkDomainAvailability(domain: string): Promise<NamecheapCheckResult> {
  if (!hasNamecheapCredentials()) {
    // Without API credentials, fall back to public Namecheap results page scraping
    const publicInfo = await fetchPublicDomainInfo(domain)

    if (publicInfo.availabilityStatus !== "unknown" || publicInfo.price !== null) {
      return {
        domain,
        available: publicInfo.availabilityStatus === "available" || publicInfo.availabilityStatus === "premium",
        availabilityStatus: publicInfo.availabilityStatus,
        price: publicInfo.price,
        isPremium: publicInfo.availabilityStatus === "premium",
        pricingStatus: publicInfo.price !== null ? "live" : "check_price",
      }
    }

    // Public page parsing failed — return unknown (RDAP removed)
    return {
      domain,
      available: undefined,
      availabilityStatus: "unknown",
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

  const availableFlag = parseXmlFlag(xml)
  const isPremium = parseDomainCheckIsPremium(xml)

  if (isPremium) {
    // Try to get premium price from the XML response itself first — no extra request
    const premiumPrice = parseXmlNumberAttr(xml, "DomainCheckResult", "PremiumRegistrationPrice")

    return {
      domain,
      available: availableFlag,
      availabilityStatus: "premium",
      price: premiumPrice,
      isPremium,
      pricingStatus: "premium_check",
    }
  }

  const availabilityStatus =
    availableFlag === true ? "available" : availableFlag === false ? "taken" : "unknown"

  // Only fetch price when the domain is actually available — skip for taken/unknown
  if (availabilityStatus === "available") {
    const livePrice = await fetchLiveDomainRegistrationPrice(domain)
    if (livePrice !== null) {
      return {
        domain,
        available: availableFlag,
        availabilityStatus,
        price: Number(livePrice.toFixed(2)),
        isPremium,
        pricingStatus: "live",
      }
    }
  }

  return {
    domain,
    available: availableFlag,
    availabilityStatus,
    price: null,
    isPremium,
    pricingStatus: "check_price",
  }
}