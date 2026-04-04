import { createClient } from "@supabase/supabase-js"

export type PaymentProvider = "stripe" | "paypal"

type CreatePendingDomainOrderInput = {
  domain: string
  price: number
  paymentProvider: PaymentProvider
  customerEmail?: string
  language?: string
}

type DomainOrder = {
  id: string
  domain: string
  price: number
  paymentProvider: PaymentProvider
  status: string
  customerEmail?: string | null
  language?: string | null
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const isTableMissing = (code?: string) => code === "42P01"

async function findPaidInOrders(domain: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("id")
    .eq("domain", domain)
    .eq("status", "paid")
    .limit(1)

  if (error && !isTableMissing(error.code)) throw error
  return data && data.length > 0
}

async function findPaidInProjectOrders(domain: string) {
  const { data, error } = await supabase
    .from("project_orders")
    .select("id")
    .eq("plan", "domain")
    .eq("service", domain)
    .eq("status", "paid")
    .limit(1)

  if (error) throw error
  return data && data.length > 0
}

export async function ensureDomainNotAlreadyPaid(domain: string): Promise<void> {
  const [paidInOrders, paidInProjectOrders] = await Promise.all([
    findPaidInOrders(domain),
    findPaidInProjectOrders(domain),
  ])

  if (paidInOrders || paidInProjectOrders) {
    throw new Error("Domain already purchased")
  }
}

export async function createPendingDomainOrder(input: CreatePendingDomainOrderInput): Promise<DomainOrder> {
  const payload = {
    domain: input.domain,
    price: input.price,
    payment_provider: input.paymentProvider,
    status: "pending",
    customer_email: input.customerEmail ?? null,
    language: input.language ?? "en",
  }

  const primaryInsert = await supabase.from("orders").insert(payload).select("*").single()

  if (!primaryInsert.error && primaryInsert.data) {
    const row = primaryInsert.data as Record<string, unknown>
    return {
      id: String(row.id),
      domain: String(row.domain),
      price: Number(row.price),
      paymentProvider: String(row.payment_provider) as PaymentProvider,
      status: String(row.status),
      customerEmail: (row.customer_email as string | null) ?? null,
      language: (row.language as string | null) ?? null,
    }
  }

  if (!isTableMissing(primaryInsert.error?.code)) {
    throw primaryInsert.error
  }

  // Compatibility fallback using existing project_orders table.
  const fallbackInsert = await supabase
    .from("project_orders")
    .insert({
      plan: "domain",
      service: input.domain,
      amount: input.price,
      currency: "USD",
      provider: input.paymentProvider,
      status: "pending",
      customer_email: input.customerEmail ?? null,
      language: input.language ?? "en",
    })
    .select("id, service, amount, provider, status, customer_email, language")
    .single()

  if (fallbackInsert.error || !fallbackInsert.data) {
    throw fallbackInsert.error || new Error("Could not create domain order")
  }

  return {
    id: fallbackInsert.data.id,
    domain: fallbackInsert.data.service ?? input.domain,
    price: fallbackInsert.data.amount ?? input.price,
    paymentProvider: (fallbackInsert.data.provider as PaymentProvider) ?? input.paymentProvider,
    status: fallbackInsert.data.status ?? "pending",
    customerEmail: fallbackInsert.data.customer_email,
    language: fallbackInsert.data.language,
  }
}

export async function markDomainOrderPaid(args: {
  orderId: string
  paymentProvider: PaymentProvider
  paymentId: string
  amount?: number
  currency?: string
}) {
  const nowCurrency = args.currency?.toUpperCase() || "USD"

  const updateOrders = await supabase
    .from("orders")
    .update({
      payment_provider: args.paymentProvider,
      payment_id: args.paymentId,
      price: args.amount,
      currency: nowCurrency,
      status: "paid",
    })
    .eq("id", args.orderId)
    .select("*")
    .single()

  if (!updateOrders.error && updateOrders.data) {
    const row = updateOrders.data as Record<string, unknown>
    return {
      id: String(row.id),
      domain: String(row.domain),
      amount: Number(row.price),
      currency: String(row.currency || nowCurrency),
      customerEmail: (row.customer_email as string | null) ?? null,
      language: (row.language as string | null) ?? "en",
    }
  }

  if (updateOrders.error && !isTableMissing(updateOrders.error.code)) {
    throw updateOrders.error
  }

  const fallbackUpdate = await supabase
    .from("project_orders")
    .update({
      provider: args.paymentProvider,
      payment_id: args.paymentId,
      amount: args.amount,
      currency: nowCurrency,
      status: "paid",
    })
    .eq("id", args.orderId)
    .select("id, service, amount, currency, customer_email, language")
    .single()

  if (fallbackUpdate.error || !fallbackUpdate.data) {
    throw fallbackUpdate.error || new Error("Domain order not found")
  }

  return {
    id: fallbackUpdate.data.id,
    domain: fallbackUpdate.data.service ?? "",
    amount: fallbackUpdate.data.amount ?? args.amount ?? 0,
    currency: fallbackUpdate.data.currency ?? nowCurrency,
    customerEmail: fallbackUpdate.data.customer_email,
    language: fallbackUpdate.data.language ?? "en",
  }
}
