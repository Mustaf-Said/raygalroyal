"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Sparkles, Zap, Rocket } from "lucide-react"
import { useLanguage } from "./LanguageProvider"
import { useModals } from "./ModalProvider"
import { cn } from "@/lib/utils"

export default function Pricing() {
  const { t, language } = useLanguage()
  const { openOrderModal } = useModals()
  const [supportAmount, setSupportAmount] = useState("")
  const [supportError, setSupportError] = useState<string | null>(null)
  const [supportLoading, setSupportLoading] = useState(false)

  const getErrorMessage = (value: unknown, fallback: string) => {
    if (typeof value === "string" && value.trim()) return value

    if (value && typeof value === "object") {
      const record = value as Record<string, unknown>
      const message = record.message
      const details = record.details

      if (typeof message === "string" && message.trim()) return message
      if (typeof details === "string" && details.trim()) return details
    }

    return fallback
  }

  const plans = [
    {
      key: "support",
      icon: Check,
      color: "emerald",
    },
    {
      key: "basic",
      icon: Zap,
      color: "blue",
    },
    {
      key: "pro",
      icon: Sparkles,
      color: "indigo",
      popular: true,
    },
    {
      key: "enterprise",
      icon: Rocket,
      color: "purple",
    },
  ]

  const handleSupportPayNow = async () => {
    const parsedAmount = Number(supportAmount)

    if (!Number.isFinite(parsedAmount) || parsedAmount < 10) {
      setSupportError(t.pricing.invalidAmount)
      return
    }

    setSupportError(null)

    try {
      setSupportLoading(true)

      const createOrderResponse = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: "support",
          custom_amount: parsedAmount,
          amount: parsedAmount,
          currency: "SEK",
          status: "pending",
          language,
          description: "Support payment",
        }),
      })

      const createOrderPayload = await createOrderResponse.json()

      if (!createOrderResponse.ok || !createOrderPayload?.data?.id) {
        const message = getErrorMessage(
          createOrderPayload?.error,
          "Unable to create support order"
        )
        throw new Error(message)
      }

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "stripe",
          orderId: createOrderPayload.data.id,
          plan: "support",
          customAmount: parsedAmount,
          isCustom: true,
          language,
        }),
      })

      const payload = await response.json()

      if (!response.ok || !payload?.url) {
        const message = getErrorMessage(payload?.error, "Unable to start checkout")
        throw new Error(message)
      }

      window.location.href = payload.url
    } catch (error) {
      console.error(error)
      setSupportError(
        error instanceof Error && error.message
          ? error.message
          : "Unable to start checkout. Please try again."
      )
    } finally {
      setSupportLoading(false)
    }
  }

  return (
    <section id="pricing" className="py-24 bg-white dark:bg-gray-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6"
          >
            {t.pricing.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-400"
          >
            {t.pricing.subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => {
            const planText = t.pricing[plan.key as keyof typeof t.pricing] as { name: string; price: string; features: readonly string[] }
            const Icon = plan.icon
            const isSupportPlan = plan.key === "support"

            return (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "relative flex flex-col p-8 rounded-[40px] border transition-all duration-500",
                  plan.popular
                    ? "bg-gray-900 dark:bg-blue-600 border-gray-900 dark:border-blue-600 shadow-2xl scale-105 z-10 text-white"
                    : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white hover:border-blue-500/50"
                )}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-linear-to-r from-blue-400 to-indigo-500 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center mb-6",
                  plan.popular ? "bg-white/10" : "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                )}>
                  <Icon className="w-7 h-7" />
                </div>

                <h3 className="text-2xl font-bold mb-2">{planText.name}</h3>

                <div className="flex flex-col mb-8">
                  {isSupportPlan ? (
                    <div className="space-y-3">
                      <input
                        type="number"
                        inputMode="decimal"
                        min={10}
                        value={supportAmount}
                        onChange={(e) => {
                          setSupportAmount(e.target.value)
                          if (supportError) setSupportError(null)
                        }}
                        placeholder={t.pricing.enterAmount}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t.pricing.supportHelper}
                      </p>
                      <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                        {t.pricing.agreementMessage}
                      </p>
                      {supportError && (
                        <p className="text-sm font-medium text-red-600 dark:text-red-400">
                          {supportError}
                        </p>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-bold opacity-70">{t.pricing.perProject}</span>
                        <span className="text-4xl font-black">
                          {plan.key === "enterprise"
                            ? (language === "so" ? "Qiimo go'an" : "Custom")
                            : `${t.pricing.currency}${planText.price}`
                          }
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1" />
                    </>
                  )}
                </div>

                <div className="space-y-4 mb-10 flex-1">
                  {planText.features.map((feature: string) => (
                    <div key={feature} className="flex items-start gap-3">
                      <div className={cn(
                        "mt-1 p-0.5 rounded-full",
                        plan.popular ? "bg-white/20" : "bg-blue-50 dark:bg-blue-900/20"
                      )}>
                        <Check className={cn("w-3.5 h-3.5", plan.popular ? "text-white" : "text-blue-600 dark:text-blue-400")} />
                      </div>
                      <span className="text-sm font-medium opacity-90">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    if (isSupportPlan) {
                      void handleSupportPayNow()
                      return
                    }

                    openOrderModal(null, plan.key)
                  }}
                  disabled={isSupportPlan && supportLoading}
                  className={cn(
                    "w-full py-4 rounded-2xl font-black transition-all active:scale-95 disabled:opacity-60 disabled:pointer-events-none",
                    plan.popular
                      ? "bg-white text-gray-950 hover:bg-gray-100"
                      : "bg-gray-950 dark:bg-blue-600 text-white hover:opacity-90 shadow-xl shadow-blue-500/20"
                  )}
                >
                  {isSupportPlan ? (supportLoading ? "Redirecting..." : t.pricing.payNow) : t.pricing.choose}
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
