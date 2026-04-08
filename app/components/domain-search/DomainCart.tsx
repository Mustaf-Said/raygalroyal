"use client"

import { useState } from "react"
import { generateNamecheapAffiliateLink } from "@/lib/domain/affiliate"

type SelectedDomain = {
  domain: string
  price: number
  priceLabel?: string
}

type AddOnService = {
  id: string
  name: string
  priceLabel: string
}

type DomainCartProps = {
  selected: SelectedDomain | null
  title: string
  empty: string
  domainLabel: string
  priceLabel: string
  checkPriceLabel: string
  registrarPriceLabel: string
  continueLabel: string
  addOnsTitle: string
  addOns: AddOnService[]
  selectedAddOnIds: string[]
  totalLabel: string
  onToggleAddOn: (id: string) => void
}

export default function DomainCart({
  selected,
  title,
  empty,
  domainLabel,
  priceLabel,
  checkPriceLabel,
  registrarPriceLabel,
  continueLabel,
  addOnsTitle,
  addOns,
  selectedAddOnIds,
  totalLabel,
  onToggleAddOn,
}: DomainCartProps) {
  const [error, setError] = useState<string | null>(null)

  const hasSelectedAddOns = selectedAddOnIds.length > 0
  const hasDomainNumericPrice = Boolean(selected && Number.isFinite(selected.price) && selected.price > 0)
  const domainPriceLabel = selected
    ? (hasDomainNumericPrice ? `$${selected.price.toFixed(2)}` : (selected.priceLabel || checkPriceLabel))
    : checkPriceLabel
  const totalPriceLabel = hasSelectedAddOns ? registrarPriceLabel : domainPriceLabel

  const handleContinue = () => {
    if (!selected) return

    try {
      setError(null)
      window.location.href = generateNamecheapAffiliateLink(selected.domain)
    } catch (affiliateError) {
      setError(affiliateError instanceof Error ? affiliateError.message : "Could not redirect to Namecheap")
    }
  }

  return (
    <aside className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 md:p-6 shadow-sm md:sticky md:top-28 cart-inner">
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
              <span className="font-bold">{domainPriceLabel}</span>
            </div>

            <div className="pt-1">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{addOnsTitle}</h3>
              <div className="space-y-2">
                {addOns.map((service) => {
                  const isSelected = selectedAddOnIds.includes(service.id)
                  return (
                    <label
                      key={service.id}
                      className="flex items-center justify-between gap-3 p-2 rounded-lg border border-gray-200 dark:border-gray-800"
                    >
                      <span className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggleAddOn(service.id)}
                          className="accent-blue-600"
                        />
                        {service.name}
                      </span>
                      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 text-right">
                        {service.priceLabel}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>

            <div className="flex justify-between gap-4 text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-800">
              <span className="font-bold">{totalLabel}</span>
              <span className="font-black">{totalPriceLabel}</span>
            </div>
          </div>

          <button
            onClick={handleContinue}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors cursor-pointer"
          >
            {continueLabel}
          </button>

          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
        </>
      )}
    </aside>
  )
}
