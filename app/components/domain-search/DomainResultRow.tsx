"use client"

import { generateNamecheapAffiliateLink } from "@/lib/domain/affiliate"

type DomainResultRowProps = {
  domain: string
  available: boolean
  availabilityStatus: "available" | "taken" | "premium" | "unknown"
  statusLabel: string
  priceLabel: string
  pricingTagLabel?: string
  pricingTagTone?: "live" | "estimated" | "premium"
  isPrimary: boolean
  isSelected: boolean
  buyLabel: string
  buyDisabled?: boolean
  onBuy: () => void
}

export default function DomainResultRow({
  domain,
  available,
  availabilityStatus,
  statusLabel,
  priceLabel,
  pricingTagLabel,
  pricingTagTone,
  isPrimary,
  isSelected,
  buyLabel,
  buyDisabled,
  onBuy,
}: DomainResultRowProps) {
  const disableBuy = buyDisabled ?? !available
  const showMakeOffer = availabilityStatus === "taken" || availabilityStatus === "unknown"
  const makeOfferUrl = showMakeOffer ? generateNamecheapAffiliateLink(domain) : null

  return (
    <div
      className={[
        "rounded-2xl border p-4 md:p-5 transition-colors",
        isSelected
          ? "border-blue-500/70 bg-blue-50/70 dark:bg-blue-900/20"
          : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900",
        isPrimary ? "ring-1 ring-blue-500/40" : "",
      ].join(" ")}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            {domain}
            {isPrimary ? (
              <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-blue-600 text-white">
                Primary
              </span>
            ) : null}
          </h3>
          <p
            className={
              availabilityStatus === "available"
                ? "text-emerald-500"
                : availabilityStatus === "taken"
                  ? "text-red-400"
                  : "text-amber-500"
            }
          >
            {statusLabel}
          </p>
          {pricingTagLabel ? (
            <span
              className={[
                "inline-flex mt-2 text-[11px] px-2 py-1 rounded-full font-semibold",
                pricingTagTone === "premium"
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                  : pricingTagTone === "estimated"
                    ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
              ].join(" ")}
            >
              {pricingTagLabel}
            </span>
          ) : null}
        </div>

        <div className="flex items-center justify-between md:justify-end gap-3 md:gap-4 min-w-52.5">
          {/* Price label — hidden for taken/unknown since they have no price */}
          {!showMakeOffer && (
            <div className="text-lg font-bold text-gray-900 dark:text-white text-right">
              {priceLabel}
            </div>
          )}

          {showMakeOffer && makeOfferUrl ? (
            /* Make offer — opens Namecheap via affiliate link, commission tracked */
            <a
              href={makeOfferUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 cursor-pointer ml-auto"
            >
              Make offer
            </a>
          ) : (
            <button
              disabled={disableBuy}
              onClick={onBuy}
              className={[
                "px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
                !disableBuy
                  ? "bg-blue-600 text-white hover:bg-blue-500 cursor-pointer"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed",
              ].join(" ")}
            >
              {!disableBuy ? buyLabel : statusLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
