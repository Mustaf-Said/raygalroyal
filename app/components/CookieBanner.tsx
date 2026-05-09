"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useLanguage } from "./LanguageProvider"

const CONSENT_KEY = "cookie_consent"

export default function CookieBanner() {
  const { t, language } = useLanguage()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) {
      setVisible(true)
    }
  }, [])

  const handleChoice = (accepted: boolean) => {
    localStorage.setItem(CONSENT_KEY, accepted ? "accepted" : "declined")
    setVisible(false)
    if (accepted) {
      window.dispatchEvent(new Event("cookie-consent-accepted"))
    }
  }

  if (!visible) return null

  const isRTL = language === "ar"

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.4)]"
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="flex-1 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {t.cookies.message}{" "}
          <Link
            href="/privacy-policy"
            className="font-medium text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            {t.cookies.privacy_policy}
          </Link>
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => handleChoice(false)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {t.cookies.decline}
          </button>
          <button
            onClick={() => handleChoice(true)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            {t.cookies.accept}
          </button>
        </div>
      </div>
    </div>
  )
}
