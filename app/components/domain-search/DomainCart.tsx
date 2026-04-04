"use client"

import { useRouter } from "next/navigation"

type SelectedDomain = {
  domain: string
  price: number
}

type DomainCartProps = {
  selected: SelectedDomain | null
  title: string
  empty: string
  domainLabel: string
  priceLabel: string
  continueLabel: string
}

export default function DomainCart({
  selected,
  title,
  empty,
  domainLabel,
  priceLabel,
  continueLabel,
}: DomainCartProps) {
  const router = useRouter()

  return (
    <aside className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 md:p-6 shadow-sm md:sticky md:top-28">
      <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-5">{title}</h2>

      {!selected ? (
        <p className="text-gray-500 dark:text-gray-400">{empty}</p>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between gap-4 text-gray-700 dark:text-gray-300">
              <span>{domainLabel}</span>
              <span className="font-bold text-right">{selected.domain}</span>
            </div>
            <div className="flex justify-between gap-4 text-gray-700 dark:text-gray-300">
              <span>{priceLabel}</span>
              <span className="font-bold">${selected.price.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => router.push(`/checkout?domain=${encodeURIComponent(selected.domain)}`)}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors"
          >
            {continueLabel}
          </button>
        </>
      )}
    </aside>
  )
}
