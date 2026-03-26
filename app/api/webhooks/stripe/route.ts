import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"
import { sendOrderConfirmationEmail } from "@/lib/emails"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown webhook error"
    console.error(`Webhook Error: ${message}`)
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 })
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const orderId = session.client_reference_id || session.metadata?.orderId

    if (orderId) {
      const isSupport = session.metadata?.plan === "support" || session.metadata?.isCustom === "true"
      const resolvedAmount = session.amount_total ? session.amount_total / 100 : null

      const { data: order, error } = await supabase
        .from("project_orders")
        .update({
          status: "paid",
          payment_id: session.id,
          amount: resolvedAmount,
          custom_amount: isSupport ? resolvedAmount : null,
          currency: session.currency?.toUpperCase() || "USD"
        })
        .eq("id", orderId)
        .select()
        .single()

      if (order && !error) {
        console.log(`✅ Order ${orderId} marked as paid`)

        // Send confirmation email
        await sendOrderConfirmationEmail({
          email: order.customer_email,
          orderId: order.id,
          plan: order.plan,
          amount: order.amount,
          currency: order.currency,
          language: order.language
        })
      }
    }
  }

  return NextResponse.json({ received: true })
}
