import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import Stripe from "stripe"
import { sendOrderConfirmationEmail } from "@/lib/emails"

type Provider = "paypal" | "stripe"

type ConfirmPaymentBody = {
  orderId?: string
  provider?: Provider
  amount?: number | string | null
  currency?: string | null
  paymentId?: string
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null

// Initialize Supabase with Service Role Key for secure server-side updates
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ConfirmPaymentBody
    const orderId = body.orderId?.trim()
    const provider = body.provider
    const paymentId = body.paymentId?.trim()

    if (!orderId || !provider || !paymentId) {
      return NextResponse.json(
        { error: "Missing required fields: orderId, provider, paymentId" },
        { status: 400 }
      )
    }

    if (provider !== "paypal" && provider !== "stripe") {
      return NextResponse.json(
        { error: "Invalid provider. Must be 'paypal' or 'stripe'" },
        { status: 400 }
      )
    }

    // Fetch existing order first for idempotency and verification context.
    const { data: existingOrder, error: orderFetchError } = await supabase
      .from("project_orders")
      .select("id, status, payment_id, customer_email, plan, language")
      .eq("id", orderId)
      .single()

    if (orderFetchError || !existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if (existingOrder.status === "paid") {
      if (!existingOrder.payment_id || existingOrder.payment_id === paymentId) {
        return NextResponse.json({
          success: true,
          alreadyPaid: true,
          orderId,
          message: "Order already processed",
        })
      }

      return NextResponse.json(
        {
          error: "Order already paid with a different payment reference",
        },
        { status: 409 }
      )
    }

    let resolvedAmount = Number(body.amount)
    let resolvedCurrency = (body.currency || "").toUpperCase()
    let resolvedPaymentId = paymentId

    // Stripe validation source of truth comes from Stripe session, not client payload.
    if (provider === "stripe") {
      if (!stripe) {
        return NextResponse.json(
          { error: "Stripe is not configured on server" },
          { status: 500 }
        )
      }

      const session = await stripe.checkout.sessions.retrieve(paymentId)

      if (session.payment_status !== "paid") {
        return NextResponse.json(
          { error: "Stripe payment is not completed" },
          { status: 400 }
        )
      }

      resolvedAmount = session.amount_total ? session.amount_total / 100 : 0
      resolvedCurrency = (session.currency || resolvedCurrency || "USD").toUpperCase()
      resolvedPaymentId = session.id
    }

    if (!Number.isFinite(resolvedAmount) || resolvedAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount. Must be a positive number" },
        { status: 400 }
      )
    }

    if (!resolvedCurrency) {
      return NextResponse.json(
        { error: "Invalid currency. Currency is required" },
        { status: 400 }
      )
    }

    const normalizedCurrency = resolvedCurrency.toUpperCase()

    console.log("[PaymentConfirm] Confirming payment", {
      orderId,
      provider,
      amount: resolvedAmount,
      currency: normalizedCurrency,
      paymentId: resolvedPaymentId,
    })

    const { data: updatedOrder, error: updateError } = await supabase
      .from("project_orders")
      .update({
        amount: resolvedAmount,
        currency: normalizedCurrency,
        provider,
        payment_id: resolvedPaymentId,
        status: "paid",
      })
      .eq("id", orderId)
      .select("id, customer_email, plan, amount, currency, language, provider, payment_id, status")
      .single()

    if (updateError || !updatedOrder) {
      console.error("[PaymentConfirm] Supabase update error:", updateError)

      if (updateError?.code === "42703" && updateError.message?.includes("updated_at")) {
        return NextResponse.json(
          {
            error: "Database schema mismatch: missing project_orders.updated_at column",
            code: updateError.code,
            details: updateError.details,
            hint: "Run the SQL migration that adds updated_at and trigger.",
          },
          { status: 500 }
        )
      }

      return NextResponse.json(
        {
          error: "Database update failed",
          code: updateError?.code,
          details: updateError?.details,
        },
        { status: 500 }
      )
    }

    if (updatedOrder.customer_email) {
      await sendOrderConfirmationEmail({
        email: updatedOrder.customer_email,
        orderId: updatedOrder.id,
        plan: updatedOrder.plan,
        amount: updatedOrder.amount,
        currency: updatedOrder.currency,
        language: updatedOrder.language,
      })
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    })
  } catch (error) {
    console.error("[PaymentConfirm] Critical Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
