import { isValidFullDomain } from "@/lib/domain/validation"

const NAMECHEAP_REGISTRATION_URL = "https://www.namecheap.com/domains/registration/results/"

export function generateNamecheapAffiliateLink(domain: string): string {
  const normalizedDomain = domain.trim().toLowerCase()

  if (!isValidFullDomain(normalizedDomain)) {
    throw new Error("Invalid domain format")
  }

  const params = new URLSearchParams({ domain: normalizedDomain })
  const affiliateId = process.env.NEXT_PUBLIC_NAMECHEAP_AFFILIATE_ID?.trim()
  if (affiliateId) {
    params.set("aff", affiliateId)
  }

  return `${NAMECHEAP_REGISTRATION_URL}?${params.toString()}`
}
