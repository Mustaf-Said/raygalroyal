"use client"

import DomainResultRow from "./DomainResultRow"

type DomainResult = {
  domain: string
  available: boolean
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
  availableLabel: string
  unavailableLabel: string
  buyLabel: string
  onBuy: (domain: DomainResult) => void
}

export default function DomainResultsList({
  results,
  selectedDomain,
  primaryDomain,
  availableLabel,
  unavailableLabel,
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
          priceLabel={result.priceLabel}
          pricingTagLabel={result.pricingTagLabel}
          pricingTagTone={result.pricingTagTone}
          isPrimary={result.domain === primaryDomain}
          isSelected={selectedDomain === result.domain}
          availableLabel={availableLabel}
          unavailableLabel={unavailableLabel}
          buyLabel={buyLabel}
          buyDisabled={result.buyDisabled}
          onBuy={() => onBuy(result)}
        />
      ))}
    </div>
  )
}
