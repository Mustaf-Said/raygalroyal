import { isValidFullDomain } from "@/lib/domain/validation"

const DEFAULT_NAMECHEAP_AFFILIATE_URL = "https://namecheap.pxf.io/c/7160302/1632743/5618"
const NAMECHEAP_REGISTRATION_RESULTS_URL = "https://www.namecheap.com/domains/registration/results/"

function normalizeAffiliateUrl(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return null

  try {
    const parsed = new URL(trimmed)
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null
    return parsed.toString()
  } catch {
    return null
  }
}

function getNamecheapAffiliateBaseUrl(): string {
  const fullUrl = normalizeAffiliateUrl(process.env.NEXT_PUBLIC_NAMECHEAP_AFFILIATE_URL || "")
  if (fullUrl) {
    return fullUrl
  }

  return DEFAULT_NAMECHEAP_AFFILIATE_URL
}

export function generateNamecheapAffiliateLink(domain?: string): string {
  const normalizedDomain = domain?.trim().toLowerCase() || ""

  if (!isValidFullDomain(normalizedDomain)) {
    throw new Error("Invalid domain format")
  }

  const targetUrl = `${NAMECHEAP_REGISTRATION_RESULTS_URL}?domain=${encodeURIComponent(normalizedDomain)}`
  const affiliateBaseUrl = getNamecheapAffiliateBaseUrl()

  try {
    const redirectUrl = new URL(affiliateBaseUrl)
    redirectUrl.searchParams.set("u", targetUrl)
    return redirectUrl.toString()
  } catch {
    const params = new URLSearchParams({ u: targetUrl })
    return `${affiliateBaseUrl}?${params.toString()}`
  }
}
