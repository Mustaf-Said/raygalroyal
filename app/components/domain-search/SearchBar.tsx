"use client"

import { Search } from "lucide-react"

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  placeholder: string
  buttonLabel: string
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder,
  buttonLabel,
}: SearchBarProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-2 md:p-3 shadow-sm">
      <div className="flex items-stretch gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2">
        <Search className="w-5 h-5 text-blue-500 shrink-0" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch()
          }}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 min-h-10"
        />
        <button
          onClick={onSearch}
          className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm md:text-base font-semibold hover:bg-blue-500 transition-colors cursor-pointer"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  )
}
