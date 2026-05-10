import Stripe from 'stripe'
import { readFileSync } from 'fs'

// tsx doesn't load .env.local automatically — load it here
try {
  const lines = readFileSync('.env.local', 'utf8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq > 0) {
      const key = trimmed.slice(0, eq).trim()
      const val = trimmed.slice(eq + 1).trim()
      if (!process.env[key]) process.env[key] = val
    }
  }
} catch { /* .env.local not found */ }

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

async function main() {
  const coupon = await stripe.coupons.create({
    id: 'DISCOUNT25',
    percent_off: 25,
    duration: 'once',
    name: '25% Discount',
  })
  console.log('✅ Coupon created:', coupon.id)
}

main()
