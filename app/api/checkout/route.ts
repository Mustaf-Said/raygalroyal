import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const PLANS = {
  support:      { name: 'Support',      amount: null,   discountEligible: false },
  basic:        { name: 'Standard',     amount: 149900, discountEligible: true  },
  pro:          { name: 'Professional', amount: 299900, discountEligible: true  },
  enterprise:   { name: 'Enterprise',   amount: null,   discountEligible: true  },
} as const

const DISCOUNT_COUPON_ID = 'DISCOUNT25'

export async function POST(req: NextRequest) {
  try {
    const { plan, discountActive, customAmount, successUrl, cancelUrl } = await req.json() as {
      plan: string
      discountActive?: boolean
      customAmount?: string
      successUrl?: string
      cancelUrl?: string
    }

    const planConfig = PLANS[plan as keyof typeof PLANS]
    if (!planConfig) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Support plan: use custom amount entered by customer — NEVER apply discount
    if (plan === 'support') {
      const parsed = customAmount ? parseFloat(customAmount) : NaN
      if (!Number.isFinite(parsed) || parsed < 10) {
        return NextResponse.json({ error: 'Invalid amount. Enter at least 10.' }, { status: 400 })
      }
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'sek',
            product_data: { name: 'Support Payment — RaygalRoyal' },
            unit_amount: Math.round(parsed * 100),
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: successUrl ?? `${process.env.NEXT_PUBLIC_SITE_URL}/?checkout=success`,
        cancel_url: cancelUrl ?? `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
        metadata: { plan: 'support', discount_applied: 'none' },
      })
      return NextResponse.json({ url: session.url })
    }

    // Paid plans: determine amount
    let amountInCents = planConfig.amount as number | null
    if (!amountInCents && customAmount) {
      amountInCents = Math.round(parseFloat(customAmount) * 100)
    }
    if (!amountInCents || amountInCents < 50) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const applyDiscount = Boolean(discountActive) && planConfig.discountEligible

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: `${planConfig.name} Plan — RaygalRoyal` },
          unit_amount: amountInCents,
        },
        quantity: 1,
      }],
      mode: 'payment',
      discounts: applyDiscount ? [{ coupon: DISCOUNT_COUPON_ID }] : undefined,
      success_url: successUrl ?? `${process.env.NEXT_PUBLIC_SITE_URL}/?checkout=success`,
      cancel_url: cancelUrl ?? `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
      metadata: {
        plan,
        discount_applied: applyDiscount ? '25%' : 'none',
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to create checkout session' },
      { status: 500 }
    )
  }
}
