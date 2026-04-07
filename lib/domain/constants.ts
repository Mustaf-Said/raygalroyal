export const DOMAIN_LABEL_REGEX = /^(?!-)[a-z0-9-]{1,63}(?<!-)$/i
export const FULL_DOMAIN_REGEX = /^(?!-)(?:[a-z0-9-]{1,63}\.)+[a-z]{2,63}$/i

export const SUPPORTED_TLDS = [".com", ".net", ".io", ".co", ".co.uk", ".org", ".to", ".london"] as const

export type SupportedTld = (typeof SUPPORTED_TLDS)[number]

export const DOMAIN_BASE_PRICES: Record<SupportedTld, number> = {
  ".com": 12,
  ".net": 10,
  ".io": 39,
  ".co": 28,
  ".co.uk": 14,
  ".org": 11,
  ".to": 34,
  ".london": 33,
}

export const HOSTING_PLAN_PRICES = {
  basic: 9,
  pro: 19,
  business: 39,
} as const

export type HostingPlan = keyof typeof HOSTING_PLAN_PRICES

export const EMAIL_MAILBOX_MONTHLY_PRICE = 3
export const SSL_CERTIFICATE_PRICE = 0
