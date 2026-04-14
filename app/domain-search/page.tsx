"use client"


import { motion, AnimatePresence } from "framer-motion"
import { Suspense, useCallback, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, Search, Sparkles, X } from "lucide-react"
import { useLanguage } from "@/app/components/LanguageProvider"
import SearchBar from "@/app/components/domain-search/SearchBar"
import DomainResultsList from "@/app/components/domain-search/DomainResultsList"
import DomainCart from "@/app/components/domain-search/DomainCart"

type DomainResult = {
  domain: string
  available: boolean
  availabilityStatus: "available" | "taken" | "premium" | "unknown"
  statusLabel: string
  price: number
  cartPriceLabel?: string
  priceLabel: string
  buyDisabled?: boolean
  pricingTagLabel?: string
  pricingTagTone?: "live" | "estimated" | "premium"
}

type DomainApiResult = {
  domain: string
  available?: boolean
  availability?: boolean
  availabilityStatus?: "available" | "taken" | "premium" | "unknown"
  price: number | null
  isPremium?: boolean
  pricingStatus?: "live" | "check_price" | "premium_check" | "estimated"
}

type AddOnService = {
  id: string
  name: string
  priceLabel: string
}

const AI_PREFIXES = ["get", "my", "try", "go", "the"]
const AI_SUFFIXES = ["hq", "app", "online", "site"]

function sanitizeKeyword(value: string): string {
  const base = value.trim().toLowerCase().split(".")[0] || ""
  return base.replace(/[^a-z0-9-]/g, "").replace(/^-+|-+$/g, "")
}

function generateAiDomainCandidates(keyword: string, existing: Set<string>): string[] {
  const root = sanitizeKeyword(keyword)
  if (!root) return []

  const candidates = new Set<string>([
    `${root}.ai`,
    `${root}.app`,
    `${root}.dev`,
    `get${root}.com`,
    `${root}hq.com`,
    `my${root}.com`,
    `${root}online.com`,
  ])

  for (const prefix of AI_PREFIXES) {
    candidates.add(`${prefix}${root}.com`)
  }

  for (const suffix of AI_SUFFIXES) {
    candidates.add(`${root}${suffix}.com`)
  }

  return Array.from(candidates)
    .map((value) => value.toLowerCase())
    .filter((value, index, arr) => arr.indexOf(value) === index)
    .filter((value) => !existing.has(value))
    .filter((value) => /^(?!-)[a-z0-9-]{1,63}(?:\.[a-z0-9-]{1,63})+$/i.test(value))
    .slice(0, 12)
}

function isDomainApiResult(value: unknown): value is DomainApiResult {
  return typeof value === "object" && value !== null && "domain" in value
}

const loadingSteps = [
  "Live availability",
  "Price checks",
  "AI suggestions",
]

const loadingResultCards = [1, 2, 3, 4]

const loadingAddOns = ["SSL", "Hosting", "Email"]

function DomainSearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = (searchParams.get("query") || "").trim()
  const { t } = useLanguage()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<DomainResult[]>([])
  const [aiSuggestions, setAiSuggestions] = useState<DomainResult[]>([])
  const [searchInput, setSearchInput] = useState(query)
  const [selectedDomain, setSelectedDomain] = useState<DomainResult | null>(null)
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([])
  const copy = t.domainSearch
  const [cartOpen, setCartOpen] = useState(false)

  const toDomainResult = useCallback((item: DomainApiResult): DomainResult => {
    const availabilityFlag = item.available ?? item.availability
    const availabilityStatus =
      item.availabilityStatus
      ?? (item.isPremium ? "premium" : availabilityFlag === true ? "available" : availabilityFlag === false ? "taken" : "unknown")
    const numericPrice = Number(item.price)
    const hasNumericPrice = Number.isFinite(numericPrice) && numericPrice > 0
    const pricingStatus = item.pricingStatus || "check_price"
    const hasPremiumPrice = availabilityStatus === "premium" && hasNumericPrice
    const canBuy = availabilityStatus === "available" || hasPremiumPrice

    // Taken and unknown domains — show no price, no button label
    if (availabilityStatus === "taken" || availabilityStatus === "unknown") {
      const statusLabel =
        availabilityStatus === "taken" ? copy.unavailable : copy.checkPrice

      return {
        domain: item.domain,
        available: false,
        availabilityStatus,
        statusLabel,
        price: 0,
        cartPriceLabel: undefined,
        priceLabel: "",           // no price label shown
        buyDisabled: true,
        pricingTagLabel: undefined,
        pricingTagTone: undefined,
      }
    }

    let priceLabel = copy.checkPrice
    let pricingTagLabel: string | undefined
    let pricingTagTone: "live" | "estimated" | "premium" | undefined

    if (pricingStatus === "premium_check") {
      if (hasNumericPrice) {
        priceLabel = `$${Number(numericPrice).toFixed(2)}`
      } else {
        priceLabel = copy.premiumCheckPrice
      }
      pricingTagLabel = copy.pricingPremium
      pricingTagTone = "premium"
    } else if (pricingStatus === "estimated") {
      if (hasNumericPrice) {
        priceLabel = `$${Number(numericPrice).toFixed(2)} (${copy.estimated})`
        pricingTagLabel = copy.pricingEstimated
        pricingTagTone = "estimated"
      } else {
        priceLabel = copy.checkPrice
      }
    } else if (pricingStatus === "live" && hasNumericPrice) {
      priceLabel = `$${Number(numericPrice).toFixed(2)}`
      pricingTagLabel = copy.pricingLive
      pricingTagTone = "live"
    }

    const statusLabel =
      availabilityStatus === "available"
        ? copy.available
        : availabilityStatus === "premium"
          ? (hasNumericPrice ? copy.pricingPremium : copy.premiumCheckPrice)
          : copy.checkPrice

    return {
      domain: item.domain,
      available: canBuy,
      availabilityStatus,
      statusLabel,
      price: hasNumericPrice ? Number(numericPrice) : 0,
      cartPriceLabel: hasNumericPrice ? undefined : (availabilityStatus === "premium" ? copy.premiumCheckPrice : copy.checkPrice),
      priceLabel,
      buyDisabled: !canBuy,
      pricingTagLabel,
      pricingTagTone,
    }
  }, [copy.available, copy.checkPrice, copy.estimated, copy.premiumCheckPrice, copy.pricingEstimated, copy.pricingLive, copy.pricingPremium, copy.unavailable])

  const addOnServices = useMemo<AddOnService[]>(() => {
    return [
      { id: "ssl", name: copy.addOnSsl, priceLabel: copy.priceAvailableAtRegistrar },
      { id: "hosting", name: copy.addOnHosting, priceLabel: copy.priceAvailableAtRegistrar },
      { id: "email", name: copy.addOnEmail, priceLabel: copy.priceAvailableAtRegistrar },
      { id: "dns", name: copy.addOnDns, priceLabel: copy.priceAvailableAtRegistrar },
      { id: "vpn", name: copy.addOnVpn, priceLabel: copy.priceAvailableAtRegistrar },
    ]
  }, [copy.addOnDns, copy.addOnEmail, copy.addOnHosting, copy.addOnSsl, copy.addOnVpn, copy.priceAvailableAtRegistrar])

  const primaryDomain = useMemo(() => {
    const normalized = query.toLowerCase()
    return normalized.includes(".") ? normalized : `${normalized}.com`
  }, [query])

  const handleSearch = () => {
    const nextQuery = searchInput.trim()
    if (!nextQuery) return

    router.push(`/domain-search?query=${encodeURIComponent(nextQuery)}`)
  }

  const handleBuy = (item: DomainResult) => {
    if (item.buyDisabled ?? !item.available) return

    setError(null)
    setSelectedDomain(item)
    setCartOpen(true)
  }

  const handleToggleAddOn = (id: string) => {
    setSelectedAddOnIds((prev) => (prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]))
  }

  useEffect(() => {
    if (!query) {
      setError(copy.invalid)
      setResults([])
      setAiSuggestions([])
      setSelectedDomain(null)
      return
    }

    setSearchInput(query)

    let active = true

    const run = async () => {
      setLoading(true)
      setError(null)

      try {
        void fetch("/api/domain/search-log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ domain: query }),
        })

        const res = await fetch(`/api/domain/check?domain=${encodeURIComponent(query)}`)
        const payload = (await res.json()) as DomainApiResult[] | DomainApiResult | { error?: string }

        if (!res.ok) {
          throw new Error((payload as { error?: string }).error || "Search failed")
        }

        const payloadItems = Array.isArray(payload)
          ? payload
          : isDomainApiResult(payload)
            ? [payload]
            : []

        if (payloadItems.length === 0) {
          throw new Error((payload as { error?: string }).error || "Search failed")
        }

        const normalizedResults = payloadItems.map(toDomainResult)

        const existingDomains = new Set(normalizedResults.map((item) => item.domain.toLowerCase()))
        const aiCandidateDomains = generateAiDomainCandidates(query, existingDomains)

        const aiSuggestionResponses = await Promise.all(
          aiCandidateDomains.map(async (domain) => {
            const checkRes = await fetch(`/api/domain/check?domain=${encodeURIComponent(domain)}`)
            const checkPayload = (await checkRes.json()) as DomainApiResult | { error?: string }

            if (!checkRes.ok || Array.isArray(checkPayload) || !("domain" in checkPayload)) {
              return null
            }

            return toDomainResult(checkPayload)
          })
        )

        const normalizedSuggestions = aiSuggestionResponses.filter((item): item is DomainResult => item !== null)

        if (active) {
          setResults(normalizedResults)
          setAiSuggestions(normalizedSuggestions)
          setSelectedDomain((prev) => {
            if (prev && normalizedResults.some((item) => item.domain === prev.domain && !item.buyDisabled)) {
              return prev
            }

            const defaultPrimary = normalizedResults.find((item) => item.domain === primaryDomain && !item.buyDisabled)
            return defaultPrimary ?? null
          })
        }
      } catch (fetchError) {
        if (active) {
          setError(fetchError instanceof Error ? fetchError.message : "Search failed")
          setResults([])
          setAiSuggestions([])
          setSelectedDomain(null)
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    run()

    return () => {
      active = false
    }
  }, [query, copy.invalid, primaryDomain, toDomainResult])

  return (
    <section className="pt-24 md:pt-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-4 md:px-6 md:py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-10">
            {[
              copy.stepChoose,
              copy.stepExtras,
              copy.stepDetails,
              copy.stepPayment,
            ].map((stepLabel, index) => (
              <div key={stepLabel} className="flex items-center gap-2">
                <span
                  className={[
                    "w-6 h-6 rounded-full text-xs font-black flex items-center justify-center",
                    index === 0
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
                  ].join(" ")}
                >
                  {index + 1}
                </span>
                <span className={index === 0 ? "text-gray-900 dark:text-white font-semibold" : "text-gray-500 dark:text-gray-400"}>
                  {stepLabel}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">{copy.title}</h1>
          <p className="text-base text-gray-600 dark:text-gray-400 mb-4">
            {copy.subtitle} <span className="font-bold text-gray-900 dark:text-white">&quot;{query}&quot;</span>
          </p>

          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            onSearch={handleSearch}
            placeholder={copy.searchPlaceholder}
            buttonLabel={copy.searchButton}
          />
        </div>

        {loading && (
          <div className="mb-8 overflow-hidden rounded-3xl border border-blue-500/20 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.35)]">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-500/15 ring-1 ring-inset ring-blue-400/20">
                  <div className="absolute inset-0 rounded-2xl bg-blue-400/10 animate-pulse" />
                  <Loader2 className="relative h-6 w-6 animate-spin text-blue-300" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-200/70">
                    {copy.searching}
                  </p>
                  <h2 className="mt-2 text-2xl md:text-3xl font-black text-white">
                    Scanning options for &quot;{query}&quot;
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm md:text-base text-slate-300">
                    Comparing availability, pricing, and alternatives in real time. The best matches will appear here in a moment.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 md:min-w-80">
                {loadingSteps.map((step, index) => (
                  <div
                    key={step}
                    className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-center"
                  >
                    <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/15 text-blue-200">
                      {index === 2 ? <Sparkles className="h-4 w-4" /> : <Search className="h-4 w-4" />}
                    </div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-200">
                      Step {index + 1}
                    </p>
                    <p className="mt-1 text-[11px] leading-tight text-slate-400">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1.8fr)_minmax(300px,1fr)]">
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="h-4 w-32 rounded-full bg-white/10 animate-pulse" />
                    <div className="h-4 w-20 rounded-full bg-white/10 animate-pulse" />
                  </div>
                </div>

                {loadingResultCards.map((card) => (
                  <div
                    key={card}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
                      <div className="space-y-3">
                        <div className="h-6 w-56 rounded-full bg-white/10 animate-pulse" />
                        <div className="h-4 w-32 rounded-full bg-white/10 animate-pulse" />
                        <div className="h-5 w-20 rounded-full bg-blue-400/20 animate-pulse" />
                      </div>

                      <div className="flex items-center justify-between gap-3 md:justify-end md:min-w-52.5">
                        <div className="h-6 w-24 rounded-full bg-white/10 animate-pulse" />
                        <div className="h-10 w-28 rounded-xl bg-white/10 animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="mb-5 h-6 w-28 rounded-full bg-white/10 animate-pulse" />
                <div className="space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                    <div className="h-4 w-24 rounded-full bg-white/10 animate-pulse" />
                    <div className="mt-4 space-y-3">
                      {loadingAddOns.map((item) => (
                        <div key={item} className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                          <div>
                            <div className="h-4 w-24 rounded-full bg-white/10 animate-pulse" />
                            <div className="mt-2 h-3 w-32 rounded-full bg-white/10 animate-pulse" />
                          </div>
                          <div className="h-5 w-10 rounded-full bg-white/10 animate-pulse" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-blue-500/10 p-4">
                    <div className="h-4 w-20 rounded-full bg-white/10 animate-pulse" />
                    <div className="mt-3 h-10 w-full rounded-xl bg-white/10 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="mb-8 rounded-xl border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 p-4 text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && results.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400">{copy.noResults}</div>
        )}

        {/* MOBILE CART LIGHTBOX */}
        <AnimatePresence>
          {cartOpen && selectedDomain && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setCartOpen(false)}
                className="fixed inset-0 bg-black/70 z-40 md:hidden"
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 280 }}
                className="fixed inset-x-0 bottom-0 z-50 md:hidden rounded-t-3xl overflow-hidden"
              >
                {/* drag handle bar */}
                <div className="bg-gray-900 pt-3 pb-1 flex justify-center">
                  <div className="w-10 h-1 rounded-full bg-gray-700" />
                </div>

                {/* header row with X */}
                <div className="bg-gray-900 flex items-center justify-between px-5 py-3 border-b border-gray-800">
                  <h2 className="text-lg font-black text-white">{copy.cartTitle}</h2>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* scrollable cart body */}
                <div className="bg-gray-900 max-h-[78dvh] overflow-y-auto px-5 pb-10 pt-4">
                  <DomainCart
                    selected={{ domain: selectedDomain.domain, price: selectedDomain.price, priceLabel: selectedDomain.cartPriceLabel }}
                    title=""
                    empty={copy.cartEmpty}
                    domainLabel={copy.domainLabel}
                    priceLabel={copy.priceLabel}
                    checkPriceLabel={copy.checkPrice}
                    registrarPriceLabel={copy.priceAvailableAtRegistrar}
                    continueLabel={copy.continue}
                    addOnsTitle={copy.addOnsTitle}
                    addOns={addOnServices}
                    selectedAddOnIds={selectedAddOnIds}
                    totalLabel={copy.totalLabel}
                    onToggleAddOn={handleToggleAddOn}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* MAIN GRID */}
        {loading ? null : (
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.8fr)_minmax(300px,1fr)] gap-8 items-start">
            <div>
              <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">{copy.sectionTitle}</h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">{copy.priceColumn}</span>
              </div>
              <DomainResultsList
                results={results}
                selectedDomain={selectedDomain?.domain ?? null}
                primaryDomain={primaryDomain}
                buyLabel={copy.buy}
                onBuy={handleBuy}
              />
              {!loading && !error && aiSuggestions.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4 px-1">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">{copy.aiSuggestionsTitle}</h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{copy.priceColumn}</span>
                  </div>
                  <DomainResultsList
                    results={aiSuggestions}
                    selectedDomain={selectedDomain?.domain ?? null}
                    primaryDomain=""
                    buyLabel={copy.buy}
                    onBuy={handleBuy}
                  />
                </div>
              )}
            </div>

            {/* Desktop only — sticky sidebar cart */}
            <div className="hidden md:block md:sticky md:top-28">
              <DomainCart
                selected={selectedDomain
                  ? { domain: selectedDomain.domain, price: selectedDomain.price, priceLabel: selectedDomain.cartPriceLabel }
                  : null}
                title={copy.cartTitle}
                empty={copy.cartEmpty}
                domainLabel={copy.domainLabel}
                priceLabel={copy.priceLabel}
                checkPriceLabel={copy.checkPrice}
                registrarPriceLabel={copy.priceAvailableAtRegistrar}
                continueLabel={copy.continue}
                addOnsTitle={copy.addOnsTitle}
                addOns={addOnServices}
                selectedAddOnIds={selectedAddOnIds}
                totalLabel={copy.totalLabel}
                onToggleAddOn={handleToggleAddOn}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default function DomainSearchPage() {
  return (
    <Suspense fallback={<section className="py-32 bg-gray-50 dark:bg-gray-950 min-h-screen" />}>
      <DomainSearchContent />
    </Suspense>
  )
}
