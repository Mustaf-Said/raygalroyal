import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

type Provider = "stripe" | "paypal"

const PLAN_TO_PRICE_ENV: Record<string, string> = {
  basic: "STRIPE_PRICE_BASIC",
  pro: "STRIPE_PRICE_PRO",
  enterprise: "STRIPE_PRICE_ENTERPRISE",
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

    if (provider === "paypal") {
      const paypalCheckoutUrl = process.env.NEXT_PUBLIC_PAYPAL_CHECKOUT_URL
      if (!paypalCheckoutUrl) {
        return NextResponse.json({ error: "PayPal checkout is not configured" }, { status: 501 })
      }
      return NextResponse.json({ url: paypalCheckoutUrl }, { status: 200 })
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
    const origin = req.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

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
