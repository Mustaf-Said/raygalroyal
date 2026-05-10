"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Sparkles, Zap, Rocket } from "lucide-react"
import { useLanguage } from "./LanguageProvider"
import { useModals } from "./ModalProvider"
import { cn } from "@/lib/utils"

const PRICES = { basic: 1499, pro: 2999 }

const formatPrice = (n: number) => n.toLocaleString('en-US')
const getDiscounted = (base: number) => Math.round(base * 0.75)
const getSavings = (base: number) => Math.round(base * 0.25)

export default function Pricing() {
  const { t, language } = useLanguage()
  const { openOrderModal } = useModals()

  const [discountActive, setDiscountActive] = useState(false)
  const [supportAmount, setSupportAmount] = useState("")
  const [supportError, setSupportError] = useState<string | null>(null)
  const [supportLoading, setSupportLoading] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)

  const getErrorMessage = (value: unknown, fallback: string) => {
    if (typeof value === "string" && value.trim()) return value
    if (value && typeof value === "object") {
      const record = value as Record<string, unknown>
      if (typeof record.message === "string" && record.message.trim()) return record.message
      if (typeof record.details === "string" && record.details.trim()) return record.details
    }
    return fallback
  }

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
          description: t.pricing.supportDescription,
        }),
      })
      const createOrderPayload = await createOrderResponse.json()
      if (!createOrderResponse.ok || !createOrderPayload?.data?.id) {
        const message = getErrorMessage(createOrderPayload?.error, t.pricing.checkoutErrors.createOrder)
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
        const message = getErrorMessage(payload?.error, t.pricing.checkoutErrors.startCheckout)
        throw new Error(message)
      }
      window.location.href = payload.url
    } catch (error) {
      console.error(error)
      setSupportError(
        error instanceof Error && error.message
          ? error.message
          : t.pricing.checkoutErrors.retry
      )
    } finally {
      setSupportLoading(false)
    }
  }

  const handleCheckout = async (plan: string) => {
    // Enterprise always goes through the order modal — no direct checkout
    if (plan === 'enterprise') {
      openOrderModal(null, plan)
      return
    }

    try {
      setCheckoutLoading(plan)
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          discountActive,
          successUrl: window.location.origin + '/?checkout=success',
          cancelUrl: window.location.origin + '/pricing',
        }),
      })
      const { url, error } = await res.json()
      if (error || !url) {
        alert(error ?? t.pricing.checkoutErrors.startCheckout)
        return
      }
      window.location.href = url
    } catch {
      alert(t.pricing.checkoutErrors.retry)
    } finally {
      setCheckoutLoading(null)
    }
  }

  const plans = [
    { key: "support", icon: Check, color: "emerald" },
    { key: "basic", icon: Zap, color: "blue" },
    { key: "pro", icon: Sparkles, color: "indigo", popular: true },
    { key: "enterprise", icon: Rocket, color: "purple" },
  ]

  const renderCard = (plan: (typeof plans)[number], index: number) => {
    const planText = t.pricing[plan.key as keyof typeof t.pricing] as { name: string; price: string; features: readonly string[] }
    const Icon = plan.icon
    const isSupportPlan = plan.key === "support"
    const isEnterprise = plan.key === "enterprise"
    const isPaidFixed = plan.key === "basic" || plan.key === "pro"
    const basePrice = isPaidFixed ? PRICES[plan.key as keyof typeof PRICES] : 0

    return (
      <motion.div
        key={plan.key}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        className={cn(
          "relative flex flex-col p-5 rounded-3xl border transition-all duration-500",
          plan.popular
            ? "bg-gray-900 dark:bg-blue-600 border-gray-900 dark:border-blue-600 shadow-2xl scale-105 z-10 text-white"
            : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white hover:border-blue-500/50"
        )}
      >
        {plan.popular && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-linear-to-r from-blue-400 to-indigo-500 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-lg text-center whitespace-nowrap">
            {t.pricing.mostPopular}
          </div>
        )}

        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center mb-4",
          plan.popular ? "bg-white/10" : "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
        )}>
          <Icon className="w-5 h-5" />
        </div>

        <h3 className="text-lg font-bold mb-1.5">{planText.name}</h3>

        <div className="flex flex-col mb-5">
          {isSupportPlan ? (
            <div className="space-y-2">
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
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {t.pricing.supportHelper}
              </p>
              <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                {t.pricing.agreementMessage}
              </p>
              {supportError && (
                <p className="text-xs font-medium text-red-600 dark:text-red-400">
                  {supportError}
                </p>
              )}
            </div>
          ) : isPaidFixed ? (
            <div className="min-h-14">
              {discountActive && (
                <p className="text-gray-500 line-through text-xs animate-fade-in">
                  ${formatPrice(basePrice)}
                </p>
              )}
              <div className="flex items-baseline gap-1">
                <span className={cn(
                  "text-xs font-bold opacity-70",
                  plan.popular ? "text-white" : ""
                )}>
                  {t.pricing.perProject}
                </span>
                <span className="text-gray-400 text-sm font-bold">$</span>
                <span className={cn(
                  "text-2xl font-black transition-all duration-300",
                  discountActive ? "text-blue-400" : (plan.popular ? "text-white" : "text-gray-900 dark:text-white")
                )}>
                  {discountActive ? formatPrice(getDiscounted(basePrice)) : formatPrice(basePrice)}
                </span>
              </div>
              {discountActive && (
                <p className="text-green-400 text-xs font-semibold mt-1 animate-fade-in">
                  {t.pricing.discount.save_text.replace('{amount}', `$${formatPrice(getSavings(basePrice))}`)}
                </p>
              )}
            </div>
          ) : (
            // Enterprise
            <>
              <div className="flex items-baseline gap-1">
                <span className="text-xs font-bold opacity-70">{t.pricing.perProject}</span>
                <span className="text-2xl font-black">{t.pricing.enterprise.price}</span>
              </div>
              {discountActive && (
                <span className="inline-block bg-green-500/10 text-green-400 text-xs font-semibold px-2 py-0.5 rounded-full mt-2 animate-fade-in">
                  {t.pricing.discount.enterprise_badge}
                </span>
              )}
            </>
          )}
        </div>

        <div className="space-y-2 mb-5 flex-1">
          {planText.features.map((feature: string) => (
            <div key={feature} className="flex items-start gap-2">
              <div className={cn(
                "mt-0.5 p-0.5 rounded-full shrink-0",
                plan.popular ? "bg-white/20" : "bg-blue-50 dark:bg-blue-900/20"
              )}>
                <Check className={cn("w-3 h-3", plan.popular ? "text-white" : "text-blue-600 dark:text-blue-400")} />
              </div>
              <span className="text-xs font-medium opacity-90">{feature}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            if (isSupportPlan) { void handleSupportPayNow(); return }
            void handleCheckout(plan.key)
          }}
          disabled={(isSupportPlan && supportLoading) || checkoutLoading === plan.key}
          className="w-full py-2.5 rounded-xl font-black text-sm transition-all duration-300 active:scale-95 disabled:opacity-60 disabled:pointer-events-none relative overflow-hidden group"
          style={plan.popular ? {
            background: "rgba(255,255,255,0.95)",
            color: "#0f0c29",
            boxShadow: "0 0 30px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.8)",
            border: "1px solid rgba(255,255,255,0.6)",
          } : {
            background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 60%, #c026d3 100%)",
            boxShadow: "0 0 20px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#fff",
          }}
        >
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
            style={{
              background: plan.popular
                ? "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(192,38,211,0.05))"
                : "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))"
            }} />
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl blur-md -z-10"
            style={{ background: "linear-gradient(135deg, #2563eb, #c026d3)" }} />
          <span className="relative z-10 tracking-wide">
            {isSupportPlan
              ? (supportLoading ? t.pricing.redirecting : t.pricing.payNow)
              : checkoutLoading === plan.key
                ? t.pricing.redirecting
                : isEnterprise
                  ? (discountActive ? t.pricing.discount.enterprise_cta : t.pricing.choose)
                  : (discountActive ? t.pricing.discount.cta_discount : t.pricing.choose)
            }
          </span>
        </button>
      </motion.div>
    )
  }

  return (
    <section id="pricing" className="py-20 bg-white dark:bg-gray-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
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

        {/* Discount toggle — above all 4 cards */}
        <div className="flex items-center justify-center gap-3 mb-16">
          <span className={cn(
            "text-sm font-medium transition-colors duration-200",
            !discountActive ? "text-gray-900 dark:text-white" : "text-gray-500"
          )}>
            {t.pricing.discount.regular_label}
          </span>

          <button
            role="switch"
            aria-checked={discountActive}
            onClick={() => setDiscountActive(v => !v)}
            className={cn(
              "relative w-14 h-7 rounded-full border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500",
              discountActive ? "bg-blue-600 border-blue-600" : "bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            )}
          >
            <span className={cn(
              "absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300",
              discountActive ? "translate-x-7" : "translate-x-0"
            )} />
          </button>

          <span className={cn(
            "text-sm font-medium transition-colors duration-200",
            discountActive ? "text-gray-900 dark:text-white" : "text-gray-500"
          )}>
            {t.pricing.discount.toggle_label}
          </span>

          <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide animate-pulse">
            {t.pricing.discount.badge}
          </span>
        </div>

        <div aria-live="polite" className="sr-only">
          {discountActive ? t.pricing.discount.discount_applied : ''}
        </div>

        {/* All 4 cards in one row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((plan, index) => renderCard(plan, index))}
        </div>
      </div>
    </section>
  )
}
