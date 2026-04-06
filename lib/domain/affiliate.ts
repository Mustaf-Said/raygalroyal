import { isValidFullDomain } from "@/lib/domain/validation"

const NAMECHEAP_AFFILIATE_URL = "https://namecheap.pxf.io/c/7160302/1632743/5618"
const NAMECHEAP_REGISTRATION_RESULTS_URL = "https://www.namecheap.com/domains/registration/results/"

export function generateNamecheapAffiliateLink(domain?: string): string {
  const normalizedDomain = domain?.trim().toLowerCase() || ""

  if (!isValidFullDomain(normalizedDomain)) {
    throw new Error("Invalid domain format")
  }

  const targetUrl = `${NAMECHEAP_REGISTRATION_RESULTS_URL}?domain=${encodeURIComponent(normalizedDomain)}`
  const params = new URLSearchParams({ u: targetUrl })

  return `${NAMECHEAP_AFFILIATE_URL}?${params.toString()}`
}
