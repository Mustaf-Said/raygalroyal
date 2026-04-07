"use client"

import DomainResultRow from "./DomainResultRow"

type DomainResult = {
  domain: string
  available: boolean
  availabilityStatus: "available" | "taken" | "premium" | "unknown"
  statusLabel: string
  price: number
  priceLabel: string
  buyDisabled?: boolean
  pricingTagLabel?: string
  pricingTagTone?: "live" | "estimated" | "premium"
}

type DomainResultsListProps = {
  results: DomainResult[]
  selectedDomain: string | null
  primaryDomain: string
  buyLabel: string
  onBuy: (domain: DomainResult) => void
}

export default function DomainResultsList({
  results,
  selectedDomain,
  primaryDomain,
  buyLabel,
  onBuy,
}: DomainResultsListProps) {
  return (
    <div className="space-y-4">
      {results.map((result) => (
        <DomainResultRow
          key={result.domain}
          domain={result.domain}
          available={result.available}
          availabilityStatus={result.availabilityStatus}
          statusLabel={result.statusLabel}
          priceLabel={result.priceLabel}
          pricingTagLabel={result.pricingTagLabel}
          pricingTagTone={result.pricingTagTone}
          isPrimary={result.domain === primaryDomain}
          isSelected={selectedDomain === result.domain}
          buyLabel={buyLabel}
          buyDisabled={result.buyDisabled}
          onBuy={() => onBuy(result)}
        />
      ))}
    </div>
  )
}
