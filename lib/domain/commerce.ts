import { supabaseAdmin } from "@/lib/server/supabaseAdmin"
import {
  EMAIL_MAILBOX_MONTHLY_PRICE,
  HOSTING_PLAN_PRICES,
  SSL_CERTIFICATE_PRICE,
  type HostingPlan,
} from "@/lib/domain/constants"
import { isValidFullDomain } from "@/lib/domain/validation"
import { registerDomainWithNamecheap } from "@/lib/providers/namecheap"
import { createHetznerHostingServer } from "@/lib/providers/hetzner"
import { createZohoMailbox } from "@/lib/providers/zoho"
import { issueSslCertificate } from "@/lib/providers/ssl"
import { sendOrderConfirmationEmail } from "@/lib/emails"

export type PaymentProvider = "stripe" | "paypal"

export type OrderExtras = {
  hosting?: {
    enabled: boolean
    plan?: HostingPlan
  }
  email?: {
    enabled: boolean
    addresses?: string[]
  }
  ssl?: {
    enabled: boolean
  }
}

export type DomainOrderInput = {
  domain: string
  domainPrice: number
  paymentProvider: PaymentProvider
  userEmail: string
  customerName: string
  extras?: OrderExtras
}

type DbOrderRow = {
  id: string
  domain: string
  price: number
  user_email: string
  payment_provider: PaymentProvider
  status: string
  created_at: string
  currency: string | null
  total_price: number | null
  customer_name: string | null
  extras: OrderExtras | null
  payment_id: string | null
}

function validateDomainOrderInput(input: DomainOrderInput) {
  if (!isValidFullDomain(input.domain)) {
    throw new Error("Invalid domain format")
  }

  if (!Number.isFinite(input.domainPrice) || input.domainPrice <= 0) {
    throw new Error("Invalid domain price")
  }

  if (!input.userEmail || !input.userEmail.includes("@")) {
    throw new Error("Valid customer email is required")
  }

  if (!input.customerName?.trim()) {
    throw new Error("Customer name is required")
  }
}

function normalizeExtras(extras?: OrderExtras): OrderExtras {
  const cleanAddresses = (extras?.email?.addresses || [])
    .map((value) => value.trim().toLowerCase())
    .filter((value) => value.includes("@"))

  return {
    hosting: {
      enabled: extras?.hosting?.enabled === true,
      plan: extras?.hosting?.plan,
    },
    email: {
      enabled: extras?.email?.enabled === true,
      addresses: cleanAddresses,
    },
    ssl: {
      enabled: extras?.ssl?.enabled === true,
    },
  }
}

export function calculateExtrasPrice(extras?: OrderExtras): number {
  const normalized = normalizeExtras(extras)
  let total = 0

  if (normalized.hosting?.enabled && normalized.hosting.plan) {
    total += HOSTING_PLAN_PRICES[normalized.hosting.plan]
  }

  if (normalized.email?.enabled) {
    total += (normalized.email.addresses?.length || 0) * EMAIL_MAILBOX_MONTHLY_PRICE
  }

  if (normalized.ssl?.enabled) {
    total += SSL_CERTIFICATE_PRICE
  }

  return total
}

export async function ensureNoPaidDomainOrder(domain: string) {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("id")
    .eq("domain", domain)
    .in("status", ["paid", "registered"])
    .limit(1)

  if (error) {
    throw error
  }

  if (data && data.length > 0) {
    throw new Error("Domain already purchased")
  }
}

export async function createPendingDomainOrder(input: DomainOrderInput) {
  validateDomainOrderInput(input)
  await ensureNoPaidDomainOrder(input.domain)

  const extras = normalizeExtras(input.extras)
  const extrasPrice = calculateExtrasPrice(extras)
  const totalPrice = Number((input.domainPrice + extrasPrice).toFixed(2))

  const { data, error } = await supabaseAdmin
    .from("orders")
    .insert({
      domain: input.domain,
      price: input.domainPrice,
      user_email: input.userEmail,
      payment_provider: input.paymentProvider,
      status: "pending",
      currency: "USD",
      total_price: totalPrice,
      customer_name: input.customerName,
      extras,
    })
    .select("*")
    .single<DbOrderRow>()

  if (error || !data) {
    throw error || new Error("Failed to create order")
  }

  return data
}

export async function getDomainOrderById(orderId: string) {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single<DbOrderRow>()

  if (error || !data) {
    throw error || new Error("Order not found")
  }

  return data
}

export async function markDomainOrderPaid(args: {
  orderId: string
  paymentProvider: PaymentProvider
  paymentId: string
  amount: number
  currency: string
}) {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .update({
      payment_provider: args.paymentProvider,
      payment_id: args.paymentId,
      status: "paid",
      total_price: args.amount,
      currency: args.currency.toUpperCase(),
    })
    .eq("id", args.orderId)
    .select("*")
    .single<DbOrderRow>()

  if (error || !data) {
    throw error || new Error("Failed to mark order paid")
  }

  return data
}

export async function registerDomainForOrder(orderId: string) {
  const order = await getDomainOrderById(orderId)

  if (order.status === "registered") {
    return order
  }

  const registered = await registerDomainWithNamecheap({
    domain: order.domain,
    customerEmail: order.user_email,
    customerName: order.customer_name || "Customer",
  })

  const { data, error } = await supabaseAdmin
    .from("orders")
    .update({
      status: "registered",
      registrar_order_id: registered.registrarOrderId,
    })
    .eq("id", order.id)
    .select("*")
    .single<DbOrderRow>()

  if (error || !data) {
    throw error || new Error("Failed to update order to registered")
  }

  return data
}

export async function provisionHostingForOrder(order: DbOrderRow) {
  const extras = normalizeExtras(order.extras || undefined)
  if (!extras.hosting?.enabled || !extras.hosting.plan) {
    return null
  }

  const existing = await supabaseAdmin
    .from("hosting_accounts")
    .select("id")
    .eq("domain", order.domain)
    .limit(1)

  if (!existing.error && existing.data && existing.data.length > 0) {
    return existing.data[0]
  }

  const server = await createHetznerHostingServer(order.domain, extras.hosting.plan)

  const { data, error } = await supabaseAdmin
    .from("hosting_accounts")
    .insert({
      domain: order.domain,
      server_id: server.serverId,
      plan: extras.hosting.plan,
    })
    .select("*")
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function provisionEmailForOrder(order: DbOrderRow) {
  const extras = normalizeExtras(order.extras || undefined)
  if (!extras.email?.enabled || !extras.email.addresses?.length) {
    return []
  }

  const created: Array<{ email_address: string }> = []

  for (const emailAddress of extras.email.addresses) {
    const exists = await supabaseAdmin
      .from("email_accounts")
      .select("id")
      .eq("email_address", emailAddress)
      .limit(1)

    if (!exists.error && exists.data && exists.data.length > 0) {
      created.push({ email_address: emailAddress })
      continue
    }

    await createZohoMailbox(emailAddress)

    const { data, error } = await supabaseAdmin
      .from("email_accounts")
      .insert({
        domain: order.domain,
        email_address: emailAddress,
        provider: "zoho",
      })
      .select("*")
      .single()

    if (error) {
      throw error
    }

    created.push({ email_address: data.email_address as string })
  }

  return created
}

export async function provisionSslForOrder(order: DbOrderRow) {
  const extras = normalizeExtras(order.extras || undefined)
  const shouldIssue = extras.ssl?.enabled || extras.hosting?.enabled

  if (!shouldIssue) {
    return null
  }

  const existing = await supabaseAdmin
    .from("ssl_certificates")
    .select("id")
    .eq("domain", order.domain)
    .limit(1)

  if (!existing.error && existing.data && existing.data.length > 0) {
    return existing.data[0]
  }

  const ssl = await issueSslCertificate(order.domain)

  const { data, error } = await supabaseAdmin
    .from("ssl_certificates")
    .insert({
      domain: order.domain,
      status: ssl.status,
      issued_at: ssl.issuedAt,
    })
    .select("*")
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function fulfillPaidOrder(orderId: string) {
  const paidOrder = await getDomainOrderById(orderId)

  if (paidOrder.status !== "paid" && paidOrder.status !== "registered") {
    throw new Error("Order must be in paid state before fulfillment")
  }

  const registeredOrder = await registerDomainForOrder(orderId)
  const hosting = await provisionHostingForOrder(registeredOrder)
  const emailAccounts = await provisionEmailForOrder(registeredOrder)
  const ssl = await provisionSslForOrder(registeredOrder)

  await sendOrderConfirmationEmail({
    email: registeredOrder.user_email,
    orderId: registeredOrder.id,
    plan: [
      `Domain ${registeredOrder.domain}`,
      hosting ? `Hosting (${hosting.plan || "configured"})` : null,
      emailAccounts.length ? `Email (${emailAccounts.length} mailbox${emailAccounts.length > 1 ? "es" : ""})` : null,
      ssl ? "SSL" : null,
    ]
      .filter(Boolean)
      .join(" + "),
    amount: registeredOrder.total_price || registeredOrder.price,
    currency: registeredOrder.currency || "USD",
    language: "en",
  })

  return {
    order: registeredOrder,
    hosting,
    emailAccounts,
    ssl,
  }
}
