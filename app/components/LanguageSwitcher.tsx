"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"

const LOCALES = ["en", "sv", "ar", "so"]

export default function LanguageSwitcher({ currentLang }: { currentLang: string }) {
  const router = useRouter()
  const pathname = usePathname() || "/"
  const searchParams = useSearchParams()

  const changeLang = (lang: string) => {
    const segments = pathname.split("/").filter(Boolean)

    // remove old lang prefix
    if (segments.length > 0 && LOCALES.includes(segments[0])) {
      segments.shift()
    }

    const rest = segments.length ? `/${segments.join("/")}` : ""
    const query = searchParams ? `?${searchParams.toString()}` : ""
    const newPath = `/${lang}${rest}${query}`

    router.push(newPath)
  }

  return (
    <div className="flex gap-2">
      {LOCALES.map(l => (
        <button
          key={l}
          onClick={() => changeLang(l)}
          className={currentLang === l ? "bg-indigo-600 text-white px-3 py-1 rounded" : "border px-3 py-1 rounded"}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
