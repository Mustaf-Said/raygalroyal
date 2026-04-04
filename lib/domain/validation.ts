import { DOMAIN_LABEL_REGEX, FULL_DOMAIN_REGEX } from "@/lib/domain/constants"

export function normalizeDomainQuery(raw: string): string {
  const trimmed = raw.trim().toLowerCase()
  const withoutProtocol = trimmed.replace(/^https?:\/\//, "")
  const withoutWww = withoutProtocol.replace(/^www\./, "")
  const [hostPart] = withoutWww.split("/")

  if (!hostPart) return ""

  if (hostPart.includes(".")) {
    return hostPart.replace(/\.+$/, "")
  }

  return hostPart.replace(/[^a-z0-9-]/g, "")
}

export function isValidDomainLabel(label: string): boolean {
  return DOMAIN_LABEL_REGEX.test(label)
}

export function isValidFullDomain(domain: string): boolean {
  return FULL_DOMAIN_REGEX.test(domain)
}

export function splitDomain(domain: string): { sld: string; tld: string } {
  const normalized = domain.toLowerCase().trim()
  const segments = normalized.split(".")

  if (segments.length < 2) {
    throw new Error("Domain must include a TLD")
  }

  const sld = segments[0]
  const tld = segments.slice(1).join(".")

  if (!isValidDomainLabel(sld)) {
    throw new Error("Invalid domain label")
  }

  return { sld, tld }
}
