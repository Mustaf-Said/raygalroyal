"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Search, Loader2 } from "lucide-react"
import { useLanguage } from "@/app/components/LanguageProvider"

type DomainResult = {
  domain: string
  available: boolean
  price: number
}

function DomainSearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("query") || ""
  const { language } = useLanguage()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<DomainResult[]>([])

  const copy = useMemo(() => {
    if (language === "ar") {
      return {
        title: "نتائج البحث عن النطاق",
        subtitle: "اختر النطاق المتاح ثم أكمل الدفع.",
        searching: "جاري فحص النطاقات...",
        noResults: "لم يتم العثور على نتائج.",
        unavailable: "محجوز",
        available: "متاح",
        buy: "شراء",
        invalid: "يرجى إدخال اسم نطاق صالح.",
      }
    }

    if (language === "so") {
      return {
        title: "Natiijooyinka Raadinta Domain-ka",
        subtitle: "Dooro domain-ka la heli karo kadibna sii wad lacag-bixinta.",
        searching: "Waxaa socda hubinta domain-yada...",
        noResults: "Wax natiijo ah lama helin.",
        unavailable: "La qaatay",
        available: "La heli karo",
        buy: "Iibso",
        invalid: "Fadlan geli magac domain sax ah.",
      }
    }

    return {
      title: "Domain Search Results",
      subtitle: "Choose an available domain and continue to checkout.",
      searching: "Checking domain availability...",
      noResults: "No results found.",
      unavailable: "Taken",
      available: "Available",
      buy: "Buy",
      invalid: "Please enter a valid domain name.",
    }
  }, [language])

  useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed) {
      setError(copy.invalid)
      setResults([])
      return
    }

    let active = true

    const run = async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`/api/domain/check?domain=${encodeURIComponent(trimmed)}`)
        const payload = (await res.json()) as DomainResult[] | { error?: string }

        if (!res.ok || !Array.isArray(payload)) {
          throw new Error((payload as { error?: string }).error || "Search failed")
        }

        if (active) setResults(payload)
      } catch (fetchError) {
        if (active) {
          setError(fetchError instanceof Error ? fetchError.message : "Search failed")
          setResults([])
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    run()

    return () => {
      active = false
    }
  }, [query, copy.invalid])

  return (
    <section className="py-32 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
            <Search className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">{copy.title}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">{copy.subtitle}</p>
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

        <div className="space-y-4">
          {results.map((result) => (
            <div
              key={result.domain}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{result.domain}</h2>
                <p className={result.available ? "text-emerald-600" : "text-red-500"}>
                  {result.available ? copy.available : copy.unavailable}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-lg font-bold text-gray-900 dark:text-white">${result.price}</div>
                {result.available ? (
                  <Link
                    href={`/checkout?domain=${encodeURIComponent(result.domain)}&price=${result.price}`}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-colors"
                  >
                    {copy.buy}
                  </Link>
                ) : (
                  <span className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-semibold">
                    {copy.unavailable}
                  </span>
                )}
              </div>
            </div>
          ))}
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
