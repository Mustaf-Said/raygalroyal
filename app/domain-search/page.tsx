"use client"

import { Suspense, useCallback, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
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
        : availabilityStatus === "taken"
          ? copy.unavailable
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
          <div className="flex items-center justify-center gap-3 text-gray-600 dark:text-gray-300 mb-8">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{copy.searching}</span>
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

        <div className="grid grid-cols-2 md:grid-cols-[minmax(0,1.8fr)_minmax(300px,1fr)] gap-8 items-start">
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

          <div>
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
