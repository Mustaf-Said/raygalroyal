"use client"

import { useEffect, useState } from "react"
import LanguageSwitcher from "./LanguageSwitcher"

export default function Header({ lang }: { lang: "ar" | "en" | "sv" | "so" }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed z-50 transition-all duration-300
        ${!scrolled ? `
          top-[2vw]
          left-1/2 -translate-x-1/2
          w-[95vw] sm:w-[90vw] md:w-[85vw]
          bg-white/80 dark:bg-[#2a2a2a]
          rounded-2xl shadow
        ` : `
          top-0 left-0 translate-x-0
          w-full
          bg-white/90 dark:bg-[#1f1f1f]/90
          shadow-lg backdrop-blur-md rounded-none
          animate-slideDown
        `}
      `}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <div className="font-bold">RaygalRoyal NextTech</div>
        <LanguageSwitcher currentLang={lang} />
      </div>
    </header>
  )
}
