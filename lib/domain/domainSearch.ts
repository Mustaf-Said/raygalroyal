import { DOMAIN_BASE_PRICES, SUPPORTED_TLDS } from "@/lib/domain/constants"
import { isValidDomainLabel, normalizeDomainQuery } from "@/lib/domain/validation"

export type DomainResult = {
  domain: string
  available: boolean
  price: number
}

const randomAvailability = () => Math.random() >= 0.45

/**
 * Returns mocked availability today, but exposes a stable service shape
 * for later registrar provider integration.
 */
export function buildMockDomainResults(label: string): DomainResult[] {
  return SUPPORTED_TLDS.map((tld) => ({
    domain: `${label}${tld}`,
    available: randomAvailability(),
    price: DOMAIN_BASE_PRICES[tld],
  }))
}

export { isValidDomainLabel, normalizeDomainQuery }
