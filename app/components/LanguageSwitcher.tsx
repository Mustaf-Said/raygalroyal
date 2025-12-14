"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import ReactCountryFlag from "react-country-flag"

const LANGUAGES = {
  en: { label: "EN", country: "GB" },
  sv: { label: "SV", country: "SE" },
  ar: { label: "AR", country: "AE" },
  so: { label: "SO", country: "SO" },
}

type LanguageCode = keyof typeof LANGUAGES

export default function LanguageSwitcher({
  currentLang,
}: {
  currentLang: LanguageCode
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  const router = useRouter()
  const pathname = usePathname() || "/"
  const searchParams = useSearchParams()

  // close dropdown outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  const changeLang = (lang: string) => {
    const segments = pathname.split("/").filter(Boolean)

    if (segments.length > 0 && Object.keys(LANGUAGES).includes(segments[0])) {
      segments.shift()
    }

    const rest = segments.length ? `/${segments.join("/")}` : ""
    const query = searchParams ? `?${searchParams.toString()}` : ""

    router.push(`/${lang}${rest}${query}`)
    setOpen(false)
  }

  const active = LANGUAGES[currentLang] ? currentLang : "en"

  return (
    <div ref={ref} className="relative">
      {/* MAIN BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 hover:border rounded-md bg-transparanat dark:bg-[#2a2a2a]  cursor-pointer"
      >
        <ReactCountryFlag
          countryCode={LANGUAGES[active].country}
          svg
          style={{ width: "1.2em", height: "1.2em", borderRadius: "3px" }}
        />
        <span className="font-medium">{LANGUAGES[active].label}</span>
        <span className="opacity-60 text-xs">▼</span>
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-2 w-23 bg-white dark:bg-[#2a2a2a] rounded-lg shadow-lg z-50">
          {Object.entries(LANGUAGES).map(([code, data]) => (
            <button
              key={code}
              onClick={() => changeLang(code)}
              className={`flex w-full items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700
                ${currentLang === code ? "bg-gray-50 dark:bg-gray-800 font-semibold" : ""}
              `}
            >
              <ReactCountryFlag
                svg
                countryCode={data.country}
                style={{ width: "1.2em", height: "1.2em", borderRadius: "3px" }}
              />
              <span>{data.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
