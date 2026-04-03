"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Package, CreditCard, ChevronRight, X, Loader2 } from "lucide-react"
import { translations, type Language } from "@/locales"
import { supabase } from "@/lib/supabase"
import { useLanguage } from "./LanguageProvider"

interface Order {
  id: string
  plan: string
  amount: number | null
  currency: string | null
  language: string | null
  status: string
  created_at: string | null
}

const isLanguage = (value: string | null): value is Language =>
  value === "en" || value === "so" || value === "ar"

export default function SuccessModal() {
  const params = useSearchParams()
  const { language: currentLang } = useLanguage()

  const isSuccess = params.get("checkout") === "success"
  const orderId = params.get("orderId")
  const sessionId = params.get("session_id")

  const [isOpen, setIsOpen] = useState(isSuccess && !!orderId)
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState<Order | null>(null)
  const [lang, setLang] = useState<Language>(currentLang as Language)

  useEffect(() => {
    const confirmAndFetchOrder = async () => {
      setLoading(true)

      if (isSuccess && orderId && sessionId) {
        // 1. Confirm Stripe Payment via API
        try {
          const confirmRes = await fetch("/api/payment/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId,
              provider: "stripe",
              paymentId: sessionId,
            })
          })

          if (!confirmRes.ok) {
            const confirmData = await confirmRes.json().catch(() => ({}))
            throw new Error(confirmData.error || translations[currentLang].order.errors.confirmPaymentFailed)
          }
        } catch (error) {
          console.error("Stripe confirmation failed:", error)
        }
      }

      // 2. Fetch updated order details
      const { data } = await supabase
        .from("project_orders")
        .select("*")
        .eq("id", orderId)
        .single()

      if (data) {
        setOrder(data)
        setLang(isLanguage(data.language) ? data.language : "en")
      }
      setLoading(false)
    }

    if (isSuccess && orderId) {
      confirmAndFetchOrder()
    }
  }, [currentLang, isSuccess, orderId, sessionId])

  const close = () => {
    setIsOpen(false)
    // Clean up URL
    const newUrl = window.location.pathname
    window.history.replaceState({}, "", newUrl)
  }

  const t = translations[lang].order.success

  const formattedDate = order?.created_at
    ? new Date(order.created_at).toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" })
    : ""

  const formattedAmount = order?.amount != null
    ? Number(order.amount).toFixed(2)
    : "0.00"

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
          >
            <button
              onClick={close}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-400 z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-10 text-center">
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                  <p className="text-gray-500 font-bold animate-pulse">{translations[currentLang].order.success.fetchingDetails}</p>
                </div>
              ) : (
                <>
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                    {t.title}
                  </h1>
                  <p className="text-gray-500 mb-8">
                    {t.message}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-8">
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2 text-blue-600 mb-1">
                        <Package className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{t.plan}</span>
                      </div>
                      <div className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                        {order?.plan || translations[currentLang].pricing.basic.name}
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2 text-green-600 mb-1">
                        <CreditCard className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{t.amount}</span>
                      </div>
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {order?.currency === "USD" ? "$" : ""}{formattedAmount} {order?.currency !== "USD" ? order?.currency : ""}
                      </div>
                    </div>
                  </div>

                  {formattedDate && (
                    <p className="text-sm text-gray-500 mb-6">
                      {translations[currentLang].order.success.createdAt}: {formattedDate} (Europe/Stockholm)
                    </p>
                  )}

                  <div className="bg-blue-50 dark:bg-blue-900/10 p-3 px-4 rounded-xl mb-8 inline-flex items-center gap-3 border border-blue-100 dark:border-blue-900/30">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{t.orderId}</span>
                    <span className="font-mono text-xs text-blue-900 dark:text-blue-300 font-bold">{orderId}</span>
                  </div>

                  <button
                    onClick={close}
                    className="w-full py-4 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 group"
                  >
                    {t.backHome}
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
