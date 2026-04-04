"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useLanguage } from "@/app/components/LanguageProvider"

type Provider = "stripe" | "paypal"

function CheckoutContent() {
  const searchParams = useSearchParams()
  const { language } = useLanguage()

  const domain = searchParams.get("domain") || ""
  const queryPrice = Number(searchParams.get("price") || "0")

  const [provider, setProvider] = useState<Provider>("stripe")
  const [email, setEmail] = useState("")
  const [resolvedPrice, setResolvedPrice] = useState<number | null>(
    Number.isFinite(queryPrice) && queryPrice > 0 ? queryPrice : null
  )
  const [priceLoading, setPriceLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const copy = useMemo(() => {
    if (language === "ar") {
      return {
        title: "إتمام شراء النطاق",
        domain: "النطاق",
        price: "السعر",
        email: "البريد الإلكتروني",
        provider: "طريقة الدفع",
        stripe: "الدفع عبر Stripe",
        paypal: "الدفع عبر PayPal",
        payNow: "ادفع الآن",
        invalid: "بيانات الدفع غير مكتملة.",
        resolvingPrice: "جاري جلب سعر النطاق...",
        processing: "جاري التحويل إلى الدفع...",
      }
    }

    if (language === "so") {
      return {
        title: "Dhameystir Iibka Domain-ka",
        domain: "Domain",
        price: "Qiimaha",
        email: "Email",
        provider: "Habka Lacag-bixinta",
        stripe: "Ku bixi Stripe",
        paypal: "Ku bixi PayPal",
        payNow: "Bixi Hadda",
        invalid: "Xogta lacag-bixinta way dhameystirnayn.",
        resolvingPrice: "Waxaa socda helitaanka qiimaha domain-ka...",
        processing: "Waxaa laguu wareejinayaa lacag-bixinta...",
      }
    }

    return {
      title: "Complete Domain Checkout",
      domain: "Domain",
      price: "Price",
      email: "Email",
      provider: "Payment Method",
      stripe: "Pay with Stripe",
      paypal: "Pay with PayPal",
      payNow: "Pay Now",
      invalid: "Checkout details are incomplete.",
      resolvingPrice: "Resolving domain price...",
      processing: "Redirecting to payment...",
    }
  }, [language])

  useEffect(() => {
    if (!domain || (Number.isFinite(queryPrice) && queryPrice > 0)) {
      return
    }

    let active = true

    const loadPrice = async () => {
      try {
        setPriceLoading(true)
        const label = domain.split(".")[0] || domain
        const res = await fetch(`/api/domain/check?domain=${encodeURIComponent(label)}`)
        const payload = (await res.json()) as Array<{ domain: string; price: number }> | { error?: string }

        if (!res.ok || !Array.isArray(payload)) {
          throw new Error((payload as { error?: string }).error || "Could not load domain price")
        }

        const exact = payload.find((item) => item.domain.toLowerCase() === domain.toLowerCase())
        if (!exact) throw new Error("Could not resolve selected domain price")

        if (active) setResolvedPrice(exact.price)
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : "Could not load price")
      } finally {
        if (active) setPriceLoading(false)
      }
    }

    loadPrice()

    return () => {
      active = false
    }
  }, [domain, queryPrice])

  const handleCheckout = async () => {
    const finalPrice = resolvedPrice

    if (!domain || !Number.isFinite(finalPrice) || (finalPrice ?? 0) <= 0) {
      setError(copy.invalid)
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch("/api/payment/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain,
          price: finalPrice,
          paymentProvider: provider,
          email,
          language,
        }),
      })

      const payload = (await res.json()) as { checkoutUrl?: string; error?: string }
      if (!res.ok || !payload.checkoutUrl) {
        throw new Error(payload.error || "Checkout failed")
      }

      window.location.href = payload.checkoutUrl
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Checkout failed")
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-32 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-8">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8">{copy.title}</h1>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>{copy.domain}</span>
              <span className="font-bold">{domain || "-"}</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>{copy.price}</span>
              <span className="font-bold">{resolvedPrice !== null ? `$${resolvedPrice.toFixed(2)}` : "-"}</span>
            </div>
          </div>

          {priceLoading && <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">{copy.resolvingPrice}</p>}

          <div className="mb-5">
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">{copy.email}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">{copy.provider}</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setProvider("stripe")}
                className={`px-4 py-3 rounded-xl border text-sm font-semibold transition-colors ${provider === "stripe"
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
              >
                {copy.stripe}
              </button>
              <button
                onClick={() => setProvider("paypal")}
                className={`px-4 py-3 rounded-xl border text-sm font-semibold transition-colors ${provider === "paypal"
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
              >
                {copy.paypal}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <button
            onClick={handleCheckout}
            disabled={isSubmitting || priceLoading || resolvedPrice === null}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 disabled:opacity-70"
          >
            {isSubmitting ? copy.processing : copy.payNow}
          </button>
        </div>
      </div>
    </section>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<section className="py-32 bg-gray-50 dark:bg-gray-950 min-h-screen" />}>
      <CheckoutContent />
    </Suspense>
  )
}
