import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import {
  calculateExtrasPrice,
  createPendingDomainOrder,
  type OrderExtras,
  type PaymentProvider,
} from "@/lib/domain/commerce"
import { isValidFullDomain } from "@/lib/domain/validation"

type CreateCheckoutBody = {
  domain?: string
  price?: number
  paymentProvider?: PaymentProvider
  email?: string
  language?: string
  customerName?: string
  customer?: {
    email?: string
    name?: string
  }
  extras?: OrderExtras
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateCheckoutBody

    const domain = (body.domain || "").trim().toLowerCase()
    const domainPrice = Number(body.price)
    const paymentProvider = body.paymentProvider

    const customerEmail = body.customer?.email || body.email || ""
    const customerName = body.customer?.name || body.customerName || "Customer"
    const extras = body.extras

    if (!isValidFullDomain(domain)) {
      return NextResponse.json({ error: "Invalid domain" }, { status: 400 })
    }

    if (!Number.isFinite(domainPrice) || domainPrice <= 0) {
      return NextResponse.json({ error: "Invalid domain price" }, { status: 400 })
    }

    if (paymentProvider !== "stripe" && paymentProvider !== "paypal") {
      return NextResponse.json({ error: "Unsupported payment provider" }, { status: 400 })
    }

    if (!customerEmail || !customerEmail.includes("@")) {
      return NextResponse.json({ error: "A valid customer email is required" }, { status: 400 })
    }

    const extrasPrice = calculateExtrasPrice(extras)
    const totalPrice = Number((domainPrice + extrasPrice).toFixed(2))

    const order = await createPendingDomainOrder({
      domain,
      domainPrice,
      paymentProvider,
      userEmail: customerEmail,
      customerName,
      extras,
    })

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

    if (paymentProvider === "paypal") {
      const paypalBaseUrl = process.env.PAYPAL_BASE_URL || "https://api-m.sandbox.paypal.com"
      const paypalCheckoutUrl = process.env.PAYPAL_CHECKOUT_URL || "https://www.sandbox.paypal.com/checkoutnow"

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

      const orderRes = await fetch(`${paypalBaseUrl}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData.access_token}`,
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              custom_id: order.id,
              amount: {
                currency_code: "USD",
                value: totalPrice.toFixed(2),
              },
              description: `Domain ${domain} + extras`,
            },
          ],
          application_context: {
            return_url: `${origin}/payment-success?orderId=${order.id}&provider=paypal&domain=${encodeURIComponent(domain)}`,
            cancel_url: `${origin}/checkout?domain=${encodeURIComponent(domain)}&price=${domainPrice}`,
          },
        }),
      })

      const paypalOrder = (await orderRes.json()) as { id?: string }
      if (!paypalOrder.id) {
        return NextResponse.json({ error: "Could not create PayPal order" }, { status: 500 })
      }

      return NextResponse.json({
        orderId: order.id,
        checkoutUrl: `${paypalCheckoutUrl}?token=${paypalOrder.id}`,
      })
    }

    if (!stripe) {
      return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${origin}/payment-success?orderId=${order.id}&provider=stripe&session_id={CHECKOUT_SESSION_ID}&domain=${encodeURIComponent(domain)}`,
      cancel_url: `${origin}/checkout?domain=${encodeURIComponent(domain)}&price=${domainPrice}`,
      client_reference_id: order.id,
      customer_email: customerEmail,
      metadata: {
        orderId: order.id,
        domain,
        provider: "stripe",
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Domain + services: ${domain}`,
              description: `Domain: $${domainPrice.toFixed(2)} | Extras: $${extrasPrice.toFixed(2)}`,
            },
            unit_amount: Math.round(totalPrice * 100),
          },
          quantity: 1,
        },
      ],
    })

    return NextResponse.json({ orderId: order.id, checkoutUrl: session.url })
  } catch (error) {
    if (error instanceof Error && error.message.includes("already purchased")) {
      return NextResponse.json({ error: "This domain has already been purchased." }, { status: 409 })
    }

    console.error("[DomainCheckout] Failed to create checkout", error)
    return NextResponse.json({ error: "Unable to create checkout" }, { status: 500 })
  }
}
