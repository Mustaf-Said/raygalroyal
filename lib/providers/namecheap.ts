type NamecheapCheckResult = {
  domain: string
  available?: boolean
  availabilityStatus: "available" | "taken" | "premium" | "unknown"
  price: number | null
  isPremium: boolean
  pricingStatus: "live" | "check_price" | "premium_check" | "estimated"
}

const NAMECHEAP_API_BASE = "https://api.namecheap.com/xml.response"
const RDAP_LOOKUP_BASE = "https://rdap.org/domain"
const NAMECHEAP_PUBLIC_RESULTS_BASE = "https://r.jina.ai/http://www.namecheap.com/domains/registration/results/"

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

async function resolveAvailabilityViaRdap(domain: string): Promise<"available" | "taken" | "unknown"> {
  try {
    const response = await fetch(`${RDAP_LOOKUP_BASE}/${encodeURIComponent(domain)}`, {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/rdap+json, application/json;q=0.9, */*;q=0.8",
      },
    })

    if (response.status === 404) {
      return "available"
    }

    if (response.ok) {
      return "taken"
    }

    return "unknown"
  } catch {
    return "unknown"
  }
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
      // Domain is registered
      availabilityStatus = "taken"
    } else if (/\$[\d,]+\.\d{2}\/yr/i.test(section)) {
      // Domain has a price listed and is not registered, so it's available
      availabilityStatus = "available"
    }

    // Extract price from the section
    let price: number | null = null

    // Look for pattern: $XX.XX/yr
    const priceMatch = section.match(/\$([\d,]+\.\d{2})\/yr/i)
    if (priceMatch?.[1]) {
      const parsed = Number(priceMatch[1].replace(/,/g, ""))
      if (Number.isFinite(parsed) && parsed > 0) {
        price = parsed
      }
    }

    // Check if premium (premium marker or very high price)
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
    // Without API credentials, fetch from public Namecheap results page
    const publicInfo = await fetchPublicDomainInfo(domain)

    // If we got public info with either availability or price, use it
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

    // Fallback to RDAP if public page parsing completely failed
    const rdapStatus = await resolveAvailabilityViaRdap(domain)
    return {
      domain,
      available: rdapStatus === "unknown" ? undefined : rdapStatus === "available",
      availabilityStatus: rdapStatus,
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
    let premiumPrice = parseXmlNumberAttr(xml, "DomainCheckResult", "PremiumRegistrationPrice")
    // If API doesn't return premium price, try to get it from public page
    if (premiumPrice === null) {
      const publicInfo = await fetchPublicDomainInfo(domain)
      premiumPrice = publicInfo.price
    }

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

  if (availabilityStatus === "unknown") {
    const rdapStatus = await resolveAvailabilityViaRdap(domain)
    if (rdapStatus !== "unknown") {
      return {
        domain,
        available: rdapStatus === "available",
        availabilityStatus: rdapStatus,
        price: null,
        isPremium,
        pricingStatus: "check_price",
      }
    }
  }

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

  return {
    domain,
    available: availableFlag,
    availabilityStatus,
    price: null,
    isPremium,
    pricingStatus: "estimated",
  }
}
