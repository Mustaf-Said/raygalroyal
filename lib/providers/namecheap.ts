import { DOMAIN_BASE_PRICES } from "@/lib/domain/constants"
import { splitDomain } from "@/lib/domain/validation"

type NamecheapCheckResult = {
  domain: string
  available: boolean
  price: number
}

type NamecheapRegisterInput = {
  domain: string
  customerEmail: string
  customerName: string
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

export async function registerDomainWithNamecheap(input: NamecheapRegisterInput) {
  if (!hasNamecheapCredentials() || process.env.MOCK_INFRA_PROVISIONING === "true") {
    return {
      domain: input.domain,
      registrarOrderId: `mock-nc-${Date.now()}`,
      status: "registered" as const,
    }
  }

  const creds = getNamecheapCredentials()
  const { sld, tld } = splitDomain(input.domain)

  const [firstName, ...rest] = input.customerName.trim().split(/\s+/)
  const lastName = rest.join(" ") || "Customer"

  const fallbackPhone = process.env.NAMECHEAP_DEFAULT_PHONE || "+46.555555555"
  const fallbackAddress = process.env.NAMECHEAP_DEFAULT_ADDRESS || "Street 1"
  const fallbackCity = process.env.NAMECHEAP_DEFAULT_CITY || "Stockholm"
  const fallbackState = process.env.NAMECHEAP_DEFAULT_STATE || "Stockholm"
  const fallbackCountry = process.env.NAMECHEAP_DEFAULT_COUNTRY || "SE"
  const fallbackPostalCode = process.env.NAMECHEAP_DEFAULT_POSTAL || "11122"

  const baseFields = {
    FirstName: firstName || "Customer",
    LastName: lastName,
    Address1: fallbackAddress,
    City: fallbackCity,
    StateProvince: fallbackState,
    PostalCode: fallbackPostalCode,
    Country: fallbackCountry,
    Phone: fallbackPhone,
    EmailAddress: input.customerEmail,
  }

  const params = new URLSearchParams({
    ApiUser: creds.apiUser!,
    ApiKey: creds.apiKey!,
    UserName: creds.userName!,
    ClientIp: creds.clientIp!,
    Command: "namecheap.domains.create",
    SLD: sld,
    TLD: tld,
    Years: "1",
    RegistrantFirstName: baseFields.FirstName,
    RegistrantLastName: baseFields.LastName,
    RegistrantAddress1: baseFields.Address1,
    RegistrantCity: baseFields.City,
    RegistrantStateProvince: baseFields.StateProvince,
    RegistrantPostalCode: baseFields.PostalCode,
    RegistrantCountry: baseFields.Country,
    RegistrantPhone: baseFields.Phone,
    RegistrantEmailAddress: baseFields.EmailAddress,
    TechFirstName: baseFields.FirstName,
    TechLastName: baseFields.LastName,
    TechAddress1: baseFields.Address1,
    TechCity: baseFields.City,
    TechStateProvince: baseFields.StateProvince,
    TechPostalCode: baseFields.PostalCode,
    TechCountry: baseFields.Country,
    TechPhone: baseFields.Phone,
    TechEmailAddress: baseFields.EmailAddress,
    AdminFirstName: baseFields.FirstName,
    AdminLastName: baseFields.LastName,
    AdminAddress1: baseFields.Address1,
    AdminCity: baseFields.City,
    AdminStateProvince: baseFields.StateProvince,
    AdminPostalCode: baseFields.PostalCode,
    AdminCountry: baseFields.Country,
    AdminPhone: baseFields.Phone,
    AdminEmailAddress: baseFields.EmailAddress,
    AuxBillingFirstName: baseFields.FirstName,
    AuxBillingLastName: baseFields.LastName,
    AuxBillingAddress1: baseFields.Address1,
    AuxBillingCity: baseFields.City,
    AuxBillingStateProvince: baseFields.StateProvince,
    AuxBillingPostalCode: baseFields.PostalCode,
    AuxBillingCountry: baseFields.Country,
    AuxBillingPhone: baseFields.Phone,
    AuxBillingEmailAddress: baseFields.EmailAddress,
  })

  const response = await fetch(`${NAMECHEAP_API_BASE}?${params.toString()}`, {
    method: "POST",
    cache: "no-store",
  })

  const xml = await response.text()
  if (!response.ok) {
    throw new Error(`Namecheap registration failed with status ${response.status}`)
  }

  const orderId = parseXmlAttr(xml, "DomainCreateResult", "OrderID")
  if (!orderId) {
    throw new Error("Namecheap registration response did not include OrderID")
  }

  return {
    domain: input.domain,
    registrarOrderId: orderId,
    status: "registered" as const,
  }
}
