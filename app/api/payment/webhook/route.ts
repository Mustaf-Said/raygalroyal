import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import {
  fulfillPaidOrder,
  markDomainOrderPaid,
  type PaymentProvider,
} from "@/lib/domain/commerce"

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null
const stripeWebhookSecret =
  process.env.PAYMENT_STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET || ""

type ConfirmBody = {
  orderId?: string
  provider?: PaymentProvider
  paymentId?: string
}

async function confirmManualPayment(body: ConfirmBody) {
  const orderId = body.orderId?.trim()
  const provider = body.provider
  const paymentId = body.paymentId?.trim()

  if (!orderId || !provider || !paymentId) {
    return NextResponse.json({ error: "Missing orderId/provider/paymentId" }, { status: 400 })
  }

  if (provider !== "stripe" && provider !== "paypal") {
    return NextResponse.json({ error: "Unsupported provider" }, { status: 400 })
  }

  let amount = 0
  let currency = "USD"

  if (provider === "stripe") {
    if (!stripe) return NextResponse.json({ error: "Stripe not configured" }, { status: 500 })

    const session = await stripe.checkout.sessions.retrieve(paymentId)
    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Stripe session is not paid" }, { status: 400 })
    }

    amount = session.amount_total ? session.amount_total / 100 : 0
    currency = (session.currency || "usd").toUpperCase()
  }

  if (provider === "paypal") {
    const paypalBaseUrl = process.env.PAYPAL_BASE_URL || "https://api-m.sandbox.paypal.com"

    const auth = await fetch(`${paypalBaseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
        ).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    })

    const authData = (await auth.json()) as { access_token?: string }
    if (!authData.access_token) {
      return NextResponse.json({ error: "PayPal authentication failed" }, { status: 500 })
    }

    const captureRes = await fetch(`${paypalBaseUrl}/v2/checkout/orders/${paymentId}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authData.access_token}`,
      },
    })

    const captureData = (await captureRes.json()) as {
      status?: string
      purchase_units?: Array<{ payments?: { captures?: Array<{ amount?: { value?: string; currency_code?: string } }> } }>
    }

    if (captureData.status !== "COMPLETED") {
      return NextResponse.json({ error: "PayPal payment was not completed" }, { status: 400 })
    }

    const capture = captureData.purchase_units?.[0]?.payments?.captures?.[0]
    amount = Number(capture?.amount?.value || 0)
    currency = capture?.amount?.currency_code || "USD"
  }

  const updated = await markDomainOrderPaid({
    orderId,
    paymentId,
    paymentProvider: provider,
    amount,
    currency,
  })

  const fulfilled = await fulfillPaidOrder(orderId)

  return NextResponse.json({
    success: true,
    order: {
      id: updated.id,
      domain: updated.domain,
      status: updated.status,
    },
    fulfillment: {
      hosting: fulfilled.hosting,
      emailAccounts: fulfilled.emailAccounts.length,
      ssl: fulfilled.ssl,
    },
  })
}

async function handleStripeWebhook(req: NextRequest) {
  if (!stripe || !stripeWebhookSecret) {
    return NextResponse.json({ error: "Stripe webhook is not configured" }, { status: 500 })
  }

  const signature = req.headers.get("stripe-signature")
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 })
  }

  const bodyText = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(bodyText, signature, stripeWebhookSecret)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid webhook payload"
    return NextResponse.json({ error: message }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const orderId = session.client_reference_id || session.metadata?.orderId

    if (orderId && session.id) {
      const amount = session.amount_total ? session.amount_total / 100 : 0
      const currency = (session.currency || "usd").toUpperCase()

      await markDomainOrderPaid({
        orderId,
        paymentProvider: "stripe",
        paymentId: session.id,
        amount,
        currency,
      })

      await fulfillPaidOrder(orderId)
    }
  }

  return NextResponse.json({ received: true })
}

export async function POST(req: NextRequest) {
  try {
    if (req.headers.get("stripe-signature")) {
      return await handleStripeWebhook(req)
    }

    const body = (await req.json()) as ConfirmBody
    return await confirmManualPayment(body)
  } catch (error) {
    console.error("[PaymentWebhook] Error", error)
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 })
  }
}
