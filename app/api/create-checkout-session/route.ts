import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

type Provider = "stripe" | "paypal"

const PLAN_TO_PRICE_ENV: Record<string, string> = {
  basic: "STRIPE_PRICE_BASIC",
  pro: "STRIPE_PRICE_PRO",
  enterprise: "STRIPE_PRICE_ENTERPRISE",
}
/* Paybal betalning */
const PLAN_TO_PAYPAL_PRICE: Record<string, string> = {
  basic: "1499",
  pro: "2999",
  enterprise: "5000",
}
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      provider?: Provider
      plan?: string
      service?: string | null
      details?: string
      language?: string
    }

    const provider = body.provider ?? "stripe"
    const plan = body.plan

    if (!plan || !PLAN_TO_PRICE_ENV[plan]) {
      return NextResponse.json({ error: "Invalid plan selected" }, { status: 400 })
    }
    const origin = req.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

    if (provider === "paypal") {
      const price = PLAN_TO_PAYPAL_PRICE[plan]

      if (!price) {
        return NextResponse.json({ error: "Invalid PayPal plan" }, { status: 400 })
      }

      // 1. Get access token
      const auth = await fetch(`${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
          ).toString("base64")}`,
        },
        body: "grant_type=client_credentials",
      })

      const authData = await auth.json()
      const accessToken = authData.access_token

      // 2. Create PayPal order
      const orderRes = await fetch(`${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: price,
              },
            },
          ],
          application_context: {
            return_url: `${origin}/paypal-success`,
            cancel_url: `${origin}/paypal-cancel`,
          },
        })
      })

      const orderData = await orderRes.json()

      if (!orderData.id) {
        console.error(orderData)
        return NextResponse.json({ error: "PayPal order failed" }, { status: 500 })
      }

      return NextResponse.json({
        /* url: `https://www.paypal.com/checkoutnow?token=${orderData.id}`, */
        url: `https://www.sandbox.paypal.com/checkoutnow?token=${orderData.id}`,
      })
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    const priceId = process.env[PLAN_TO_PRICE_ENV[plan]]

    if (!stripeSecretKey || !priceId) {
      return NextResponse.json(
        { error: "Stripe checkout is not configured (missing key or price id)" },
        { status: 501 }
      )
    }

    const stripe = new Stripe(stripeSecretKey)

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/?checkout=success`,
      cancel_url: `${origin}/?checkout=cancelled`,
      metadata: {
        plan,
        service: body.service ?? "",
        language: body.language ?? "",
      },
      client_reference_id: `${Date.now()}`,
    })

    return NextResponse.json({ url: session.url }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create checkout session" },
      { status: 500 }
    )
  }
}
