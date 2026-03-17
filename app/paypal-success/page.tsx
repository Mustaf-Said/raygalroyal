"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

export default function PayPalSuccess() {
  const params = useSearchParams()

  const orderID = params.get("token")

  useEffect(() => {
    if (!orderID) return

    fetch("/api/paypal/capture", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderID }),
    })
  }, [orderID])

  return (
    <div className="h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold">
        🎉 Payment Successful!
      </h1>
    </div>
  )
}