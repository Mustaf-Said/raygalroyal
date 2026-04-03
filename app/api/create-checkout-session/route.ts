import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

type Provider = "stripe" | "paypal"
const MIN_CUSTOM_AMOUNT = 10

const PLAN_TO_PRICE_ENV: Record<string, string> = {
  basic: "STRIPE_PRICE_BASIC",
  pro: "STRIPE_PRICE_PRO",
  enterprise: "STRIPE_PRICE_ENTERPRISE",
}

const PLAN_TO_PAYPAL_PRICE: Record<string, string> = {
  basic: "1499",
  pro: "2999",
  enterprise: "5000",
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      provider?: Provider
      orderId?: string
      plan?: string
      isCustom?: boolean
      customAmount?: number | string
      service?: string | null
      details?: string
      language?: string
      email?: string
    }

    const provider = body.provider ?? "stripe"
    const plan = body.plan
    const orderId = body.orderId
    const language = body.language || "en"
    const customerEmail = body.email
    const isCustom = body.isCustom === true || plan === "support"
    const parsedCustomAmount = Number(body.customAmount)

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 })
    }

    if (!plan) {
      return NextResponse.json({ error: "Invalid plan selected" }, { status: 400 })
    }

    const isKnownStaticPlan = Boolean(PLAN_TO_PRICE_ENV[plan])

    if (!isCustom && !isKnownStaticPlan) {
      return NextResponse.json({ error: "Invalid plan selected" }, { status: 400 })
    }

    if (isCustom) {
      if (!Number.isFinite(parsedCustomAmount) || parsedCustomAmount < MIN_CUSTOM_AMOUNT) {
        return NextResponse.json(
          { error: `Invalid amount. Minimum is ${MIN_CUSTOM_AMOUNT}` },
          { status: 400 }
        )
      }
    }

    // Dynamic pricing for Enterprise
    let amount: number;
    let currency = "USD";

    if (isCustom) {
      amount = parsedCustomAmount
      currency = "SEK"
    } else if (plan === "enterprise") {
      if (language === "so" || language === "ar") {
        amount = 5000;
        currency = "USD";
      } else {
        amount = 50000;
        currency = "SEK";
      }
    } else {
      amount = parseFloat(PLAN_TO_PAYPAL_PRICE[plan]);
      currency = "USD";
    }

    const origin = req.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

    // Update order with provider, amount, and currency
    await supabase
      .from("project_orders")
      .update({
        plan: isCustom ? "support" : plan,
        provider,
        amount,
        currency,
        custom_amount: isCustom ? amount : null,
        status: "pending"
      })
      .eq("id", orderId)

    if (provider === "paypal") {
      const paypalBaseUrl = process.env.PAYPAL_BASE_URL || "https://api-m.sandbox.paypal.com"
      const paypalCheckoutUrl = process.env.PAYPAL_CHECKOUT_URL || "https://www.sandbox.paypal.com/checkoutnow"

      // 1. Get access token
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

      const authData = await auth.json()
      const accessToken = authData.access_token

      if (!accessToken) {
        console.error("PayPal Auth failed:", authData)
        return NextResponse.json({ error: "PayPal authentication failed" }, { status: 500 })
      }

      // 2. Create PayPal order
      const orderRes = await fetch(`${paypalBaseUrl}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              custom_id: orderId,
              amount: {
                currency_code: isCustom ? "SEK" : currency,
                value: isCustom ? amount.toFixed(2) : amount.toString(),
              },
            },
          ],
          application_context: {
            return_url: `${origin}/paypal-success?orderId=${orderId}`,
            cancel_url: `${origin}/paypal-cancel`,
          },
        })
      })

      const orderData = await orderRes.json()

      if (!orderData.id) {
        console.error("PayPal order creation failed:", orderData)
        return NextResponse.json({ error: "PayPal order creation failed" }, { status: 500 })
      }

      // Update order with payment_id (paypal order id)
      await supabase
        .from("project_orders")
        .update({ payment_id: orderData.id })
        .eq("id", orderId)

      return NextResponse.json({
        url: `${paypalCheckoutUrl}?token=${orderData.id}`,
      })
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    const stripe = new Stripe(stripeSecretKey!)

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      success_url: `${origin}/?checkout=success&orderId=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?checkout=cancelled`,
      metadata: {
        orderId,
        plan: isCustom ? "support" : plan,
        isCustom: isCustom ? "true" : "false",
        customAmount: isCustom ? amount.toString() : "",
        service: body.service ?? "",
        language: body.language ?? "",
      },
      client_reference_id: orderId,
      customer_email: customerEmail || undefined,
    }

    if (isCustom) {
      sessionParams.line_items = [
        {
          price_data: {
            currency: "sek",
            product_data: {
              name: "Support Payment",
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ]
    } else if (plan === "enterprise") {
      // Use dynamic price_data for Enterprise
      sessionParams.line_items = [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: "Enterprise Plan",
              description: "Custom Web App + AI Integration + Cloud Infrastructure",
            },
            unit_amount: amount * 100, // Stripe uses cents
          },
          quantity: 1,
        },
      ]
    } else {
      const priceId = process.env[PLAN_TO_PRICE_ENV[plan]]
      if (!priceId) {
        return NextResponse.json(
          { error: `Stripe price ID for ${plan} is not configured` },
          { status: 501 }
        )
      }
      sessionParams.line_items = [{ price: priceId, quantity: 1 }]
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    // Update order with payment_id (stripe session id)
    await supabase
      .from("project_orders")
      .update({ payment_id: session.id })
      .eq("id", orderId)

    return NextResponse.json({ url: session.url }, { status: 200 })
  } catch (error) {
    console.error("Checkout session error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create checkout session" },
      { status: 500 }
    )
  }
}
