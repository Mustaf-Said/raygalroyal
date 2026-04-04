"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useLanguage } from "@/app/components/LanguageProvider"
import SearchBar from "@/app/components/domain-search/SearchBar"
import DomainResultsList from "@/app/components/domain-search/DomainResultsList"
import DomainCart from "@/app/components/domain-search/DomainCart"

type DomainResult = {
  domain: string
  available: boolean
  price: number
}

function DomainSearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = (searchParams.get("query") || "").trim()
  const { language } = useLanguage()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<DomainResult[]>([])
  const [searchInput, setSearchInput] = useState(query)
  const [selectedDomain, setSelectedDomain] = useState<DomainResult | null>(null)

  const copy = useMemo(() => {
    if (language === "ar") {
      return {
        title: "اختر النطاق",
        subtitle: "نتائج البحث عن",
        searchPlaceholder: "ابحث عن نطاق جديد...",
        searchButton: "بحث",
        sectionTitle: "النطاقات المقترحة",
        priceColumn: "السعر السنوي (USD)",
        searching: "جاري فحص النطاقات...",
        noResults: "لم يتم العثور على نتائج.",
        unavailable: "محجوز",
        available: "متاح",
        buy: "شراء",
        invalid: "يرجى إدخال اسم نطاق صالح.",
        cartTitle: "السلة",
        cartEmpty: "اختر نطاقاً متاحاً لإضافته إلى السلة.",
        domainLabel: "النطاق",
        priceLabel: "السعر",
        continue: "متابعة",
        stepChoose: "اختر النطاق",
        stepExtras: "إضافات",
        stepDetails: "بيانات العميل",
        stepPayment: "الدفع",
      }
    }

    if (language === "so") {
      return {
        title: "Dooro Domain",
        subtitle: "Natiijooyinka",
        searchPlaceholder: "Raadi domain cusub...",
        searchButton: "Raadi",
        sectionTitle: "Domain-yada Caanka ah",
        priceColumn: "Qiimaha Sannadlaha (USD)",
        searching: "Waxaa socda hubinta domain-yada...",
        noResults: "Wax natiijo ah lama helin.",
        unavailable: "La qaatay",
        available: "La heli karo",
        buy: "Iibso",
        invalid: "Fadlan geli magac domain sax ah.",
        cartTitle: "Gaadhigaaga",
        cartEmpty: "Dooro domain la heli karo si aad ugu darto gaadhiga.",
        domainLabel: "Domain",
        priceLabel: "Qiimaha",
        continue: "Sii wad",
        stepChoose: "Dooro Domain",
        stepExtras: "Adeegyo Dheeri ah",
        stepDetails: "Faahfaahinta Macaamiisha",
        stepPayment: "Lacag-bixin",
      }
    }

    return {
      title: "Choose a Domain",
      subtitle: "Results for",
      searchPlaceholder: "Search for another domain...",
      searchButton: "Search",
      sectionTitle: "Popular domain names",
      priceColumn: "Yearly fee in USD",
      searching: "Checking domain availability...",
      noResults: "No results found.",
      unavailable: "Taken",
      available: "Available",
      buy: "Buy",
      invalid: "Please enter a valid domain name.",
      cartTitle: "Your Cart",
      cartEmpty: "Select an available domain to add it to your cart.",
      domainLabel: "Domain",
      priceLabel: "Price",
      continue: "Continue",
      stepChoose: "Choose domain",
      stepExtras: "Add extras",
      stepDetails: "Customer details",
      stepPayment: "Payment",
    }
  }, [language])

  const primaryDomain = useMemo(() => `${query.toLowerCase()}.com`, [query])

  const handleSearch = () => {
    const nextQuery = searchInput.trim()
    if (!nextQuery) return
    router.push(`/domain-search?query=${encodeURIComponent(nextQuery)}`)
  }

  const handleBuy = (item: DomainResult) => {
    if (!item.available) return
    setSelectedDomain(item)
  }

  useEffect(() => {
    if (!query) {
      setError(copy.invalid)
      setResults([])
      setSelectedDomain(null)
      return
    }

    setSearchInput(query)

    let active = true

    const run = async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`/api/domain/check?domain=${encodeURIComponent(query)}`)
        const payload = (await res.json()) as DomainResult[] | { error?: string }

        if (!res.ok || !Array.isArray(payload)) {
          throw new Error((payload as { error?: string }).error || "Search failed")
        }

        if (active) {
          setResults(payload)
          setSelectedDomain((prev) => {
            if (prev && payload.some((item) => item.domain === prev.domain && item.available)) {
              return prev
            }

            const defaultPrimary = payload.find((item) => item.domain === primaryDomain && item.available)
            return defaultPrimary ?? null
          })
        }
      } catch (fetchError) {
        if (active) {
          setError(fetchError instanceof Error ? fetchError.message : "Search failed")
          setResults([])
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
  }, [query, copy.invalid, primaryDomain])

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
              availableLabel={copy.available}
              unavailableLabel={copy.unavailable}
              buyLabel={copy.buy}
              onBuy={handleBuy}
            />
          </div>

          <div>
            <DomainCart
              selected={selectedDomain ? { domain: selectedDomain.domain, price: selectedDomain.price } : null}
              title={copy.cartTitle}
              empty={copy.cartEmpty}
              domainLabel={copy.domainLabel}
              priceLabel={copy.priceLabel}
              continueLabel={copy.continue}
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
