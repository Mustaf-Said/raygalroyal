"use client"

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from "react"
import { translations, type Language, type TranslationStrings } from "@/locales"

const STORAGE_KEY = "raygalroyal-language"
const RTL_LANGUAGE: Language = "ar"
export const SUPPORTED_LANGUAGES: Language[] = ["en", "so", "ar"]

const isSupportedLanguage = (value: string | null): value is Language =>
  value !== null && SUPPORTED_LANGUAGES.includes(value as Language)

const getNextLanguage = (lang: Language): Language => {
  const idx = SUPPORTED_LANGUAGES.indexOf(lang)
  if (idx === -1) return "en"
  return SUPPORTED_LANGUAGES[(idx + 1) % SUPPORTED_LANGUAGES.length]
}

type LanguageContextValue = {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: TranslationStrings
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

// ✅ useSyncExternalStore — React's official API for reading external stores
// No useState, no useEffect setState, no hydration mismatch
function useLocalStorageLanguage(): [Language, (lang: Language) => void] {
  const language = useSyncExternalStore(
    // 1. subscribe: listen for storage changes (e.g. other tabs)
    (callback) => {
      window.addEventListener("storage", callback)
      return () => window.removeEventListener("storage", callback)
    },
    // 2. getSnapshot: what the CLIENT reads right now
    () => {
      const saved = localStorage.getItem(STORAGE_KEY)
      return isSupportedLanguage(saved) ? saved : "en"
    },
    // 3. getServerSnapshot: what the SERVER always renders — must be "en"
    () => "en" as Language
  )

  const setLanguage = (lang: Language) => {
    localStorage.setItem(STORAGE_KEY, lang)
    // Trigger re-render by dispatching a storage event
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY, newValue: lang }))
  }

  return [language, setLanguage]
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useLocalStorageLanguage()

  // ✅ Only syncs external DOM — correct useEffect usage, no setState here
  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === RTL_LANGUAGE ? "rtl" : "ltr"
  }, [language])

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage,
    toggleLanguage: () => setLanguage(getNextLanguage(language)),
    t: translations[language],
  }), [language, setLanguage])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error("useLanguage must be used within LanguageProvider")
  return context
}