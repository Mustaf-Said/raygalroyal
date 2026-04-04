"use client"

type DomainResultRowProps = {
  domain: string
  available: boolean
  price: number
  isPrimary: boolean
  isSelected: boolean
  availableLabel: string
  unavailableLabel: string
  buyLabel: string
  onBuy: () => void
}

export default function DomainResultRow({
  domain,
  available,
  price,
  isPrimary,
  isSelected,
  availableLabel,
  unavailableLabel,
  buyLabel,
  onBuy,
}: DomainResultRowProps) {
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
          <p className={available ? "text-emerald-500" : "text-red-400"}>
            {available ? availableLabel : unavailableLabel}
          </p>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-3 md:gap-4 min-w-[210px]">
          <div className="text-lg font-bold text-gray-900 dark:text-white">${price}</div>
          <button
            disabled={!available}
            onClick={onBuy}
            className={[
              "px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
              available
                ? "bg-blue-600 text-white hover:bg-blue-500"
                : "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed",
            ].join(" ")}
          >
            {available ? buyLabel : unavailableLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
