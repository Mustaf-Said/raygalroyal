const COMMON_TLDS = [".com", ".net", ".io", ".co", ".co.uk", ".org"] as const

export type DomainResult = {
  domain: string
  available: boolean
  price: number
}

const BASE_TLD_PRICES: Record<(typeof COMMON_TLDS)[number], number> = {
  ".com": 12,
  ".net": 10,
  ".io": 39,
  ".co": 28,
  ".co.uk": 14,
  ".org": 11,
}

const DOMAIN_LABEL_REGEX = /^(?!-)[a-z0-9-]{1,63}(?<!-)$/i

export function normalizeDomainQuery(raw: string): string {
  const trimmed = raw.trim().toLowerCase()
  const withoutProtocol = trimmed.replace(/^https?:\/\//, "")
  const withoutWww = withoutProtocol.replace(/^www\./, "")
  const [hostPart] = withoutWww.split("/")

  // If the user enters full domain like "example.com", keep only second-level label.
  const root = hostPart.split(".")[0] || ""
  return root.replace(/[^a-z0-9-]/g, "")
}

export function isValidDomainLabel(label: string): boolean {
  return DOMAIN_LABEL_REGEX.test(label)
}

const randomAvailability = () => Math.random() >= 0.45

/**
 * Returns mocked availability today, but exposes a stable service shape
 * for later registrar provider integration.
 */
export function buildMockDomainResults(label: string): DomainResult[] {
  return COMMON_TLDS.map((tld) => ({
    domain: `${label}${tld}`,
    available: randomAvailability(),
    price: BASE_TLD_PRICES[tld],
  }))
}
