"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle2, Package, CreditCard, ChevronRight, Loader2 } from "lucide-react"
import { translations, type Language } from "@/locales"
import { supabase } from "@/lib/supabase"

type Order = {
  id: string
  plan: string
  amount: number | null
  currency: string | null
  created_at: string | null
  language: string | null
}

const isLanguage = (value: string | null): value is Language =>
  value === "en" || value === "so" || value === "ar"

function PayPalSuccessContent() {
  const params = useSearchParams()
  const router = useRouter()
  const orderID = params.get("token")
  const orderId = params.get("orderId") // Our internal orderId

  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState<Order | null>(null)
  const [lang, setLang] = useState<Language>("en")

  useEffect(() => {
    if (!orderID) return

    const capturePayment = async () => {
      try {
        const res = await fetch("/api/paypal/capture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderID }),
        })

        const captureData = await res.json()

        if (res.ok && captureData.success) {
          const capture = captureData.data.purchase_units?.[0]?.payments?.captures?.[0]
          const amount = capture?.amount?.value ? Number(capture.amount.value) : undefined
          const currency = capture?.amount?.currency_code
          const captureId = capture?.id || orderID

          // Call Unified Confirmation API
          const confirmRes = await fetch("/api/payment/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId,
              provider: "paypal",
              amount,
              currency,
              paymentId: captureId
            })
          })

          if (!confirmRes.ok) {
            const confirmData = await confirmRes.json().catch(() => ({}))
            throw new Error(confirmData.error || translations[lang].order.errors.confirmPaymentFailed)
          }

          // Fetch updated order details
          const { data } = await supabase
            .from("project_orders")
            .select("*")
            .eq("id", orderId)
            .single()

          if (data) {
            setOrder(data)
            setLang(isLanguage(data.language) ? data.language : "en")
          }
        } else {
          throw new Error(captureData.error || translations[lang].order.errors.captureFailed)
        }
      } catch (error) {
        console.error("Capture failed:", error)
      } finally {
        setLoading(false)
      }
    }

    capturePayment()
  }, [orderID, orderId])

  const t = translations[lang].order.success

  const formattedDate = order?.created_at
    ? new Date(order.created_at).toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" })
    : ""

  const formattedAmount = order?.amount != null
    ? Number(order.amount).toFixed(2)
    : "0.00"

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="text-gray-500 font-bold animate-pulse">{t.confirmingPayment}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6 pt-24 pb-24">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
        <div className="p-12 text-center">
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600 mx-auto mb-8">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
            {t.title}
          </h1>
          <p className="text-gray-500 text-lg mb-12">
            {t.message}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-12">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3 text-blue-600 mb-2">
                <Package className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">{t.plan}</span>
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                {order?.plan || translations[lang].pricing.basic.name}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3 text-green-600 mb-2">
                <CreditCard className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">{t.amount}</span>
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {order?.currency === "USD" ? "$" : ""}{formattedAmount} {order?.currency !== "USD" ? order?.currency : ""}
              </div>
            </div>
          </div>

          {formattedDate && (
            <p className="text-sm text-gray-500 mb-6">
              {t.createdAt}: {formattedDate} (Europe/Stockholm)
            </p>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl mb-12 inline-flex items-center gap-3 border border-blue-100 dark:border-blue-900/30">
            <span className="text-xs font-black text-blue-600 uppercase tracking-widest">{t.orderId}</span>
            <span className="font-mono text-sm text-blue-900 dark:text-blue-300 font-bold">{orderId}</span>
          </div>

          <button
            onClick={() => router.push("/")}
            className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 group"
          >
            {t.backHome}
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PayPalSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="text-gray-500 font-bold">{translations.en.order.success.loadingConfirmation}</p>
        </div>
      </div>
    }>
      <PayPalSuccessContent />
    </Suspense>
  )
}
