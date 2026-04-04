"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useLanguage } from "@/app/components/LanguageProvider"

type ConfirmationState = {
  status: "loading" | "success" | "error"
  error?: string
  orderId?: string
  domain?: string
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const { language } = useLanguage()

  const orderId = searchParams.get("orderId") || ""
  const provider = (searchParams.get("provider") || "") as "stripe" | "paypal"
  const domain = searchParams.get("domain") || ""
  const stripeSessionId = searchParams.get("session_id") || ""
  const paypalToken = searchParams.get("token") || ""

  const [state, setState] = useState<ConfirmationState>({ status: "loading" })

  const copy = useMemo(() => {
    if (language === "ar") {
      return {
        title: "تم شراء النطاق بنجاح",
        subtitle: "تم تأكيد دفعتك وسيتم تجهيز الخطوات التالية قريباً.",
        orderId: "رقم الطلب",
        domain: "النطاق",
        next: "الخطوات التالية",
        nextMessage: "سنرسل لك رسالة تأكيد عبر البريد الإلكتروني تحتوي على تفاصيل الطلب.",
        back: "العودة للرئيسية",
      }
    }

    if (language === "so") {
      return {
        title: "Domain-ka si guul leh ayaa loo iibsaday",
        subtitle: "Lacag-bixinta waa la xaqiijiyay, tallaabooyinka xiga dhawaan ayaan kula wadaagi doonaa.",
        orderId: "Order ID",
        domain: "Domain",
        next: "Tallaabooyinka xiga",
        nextMessage: "Waxaan kuu diri doonaa email xaqiijin ah oo wata faahfaahinta dalabka.",
        back: "Ku noqo Bogga Hore",
      }
    }

    return {
      title: "Domain Purchased Successfully",
      subtitle: "Your payment is confirmed and we will prepare next steps shortly.",
      orderId: "Order ID",
      domain: "Domain",
      next: "Next Steps",
      nextMessage: "We will send a confirmation email with your domain order details.",
      back: "Back to Home",
    }
  }, [language])

  useEffect(() => {
    if (!orderId || !provider) {
      setState({ status: "error", error: "Missing payment context." })
      return
    }

    const paymentId = provider === "stripe" ? stripeSessionId : paypalToken
    if (!paymentId) {
      setState({ status: "error", error: "Missing provider payment id." })
      return
    }

    let active = true

    const confirm = async () => {
      try {
        const res = await fetch("/api/payment/webhook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            provider,
            paymentId,
          }),
        })

        const payload = (await res.json()) as {
          success?: boolean
          error?: string
          order?: { id?: string; domain?: string }
        }

        if (!res.ok || !payload.success) {
          throw new Error(payload.error || "Payment confirmation failed")
        }

        if (active) {
          setState({
            status: "success",
            orderId: payload.order?.id || orderId,
            domain: payload.order?.domain || domain,
          })
        }
      } catch (confirmError) {
        if (active) {
          setState({
            status: "error",
            error: confirmError instanceof Error ? confirmError.message : "Confirmation failed",
          })
        }
      }
    }

    confirm()

    return () => {
      active = false
    }
  }, [orderId, provider, stripeSessionId, paypalToken, domain])

  return (
    <section className="py-32 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 md:p-10">
          {state.status === "loading" && (
            <p className="text-gray-600 dark:text-gray-300">Confirming your payment...</p>
          )}

          {state.status === "error" && (
            <div>
              <h1 className="text-2xl font-black text-red-500 mb-3">Payment confirmation failed</h1>
              <p className="text-gray-600 dark:text-gray-300">{state.error}</p>
            </div>
          )}

          {state.status === "success" && (
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">{copy.title}</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">{copy.subtitle}</p>

              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>{copy.orderId}</span>
                  <span className="font-bold">{state.orderId}</span>
                </div>
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>{copy.domain}</span>
                  <span className="font-bold">{state.domain || domain}</span>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 mb-8">
                <h2 className="font-bold text-gray-900 dark:text-white mb-2">{copy.next}</h2>
                <p className="text-gray-600 dark:text-gray-400">{copy.nextMessage}</p>
              </div>

              <Link
                href="/"
                className="inline-flex px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500"
              >
                {copy.back}
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<section className="py-32 bg-gray-50 dark:bg-gray-950 min-h-screen" />}>
      <PaymentSuccessContent />
    </Suspense>
  )
}
