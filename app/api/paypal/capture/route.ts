import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { orderID } = await req.json()

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

    const { access_token } = await auth.json()

    // 2. Capture payment
    const captureRes = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    )

    const data = await captureRes.json()

    console.log("✅ PayPal CAPTURE:", data)

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Capture failed" }, { status: 500 })
  }
}