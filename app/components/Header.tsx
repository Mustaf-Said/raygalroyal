"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { GiHamburgerMenu } from "react-icons/gi"
import { IoClose } from "react-icons/io5"
import { useLanguage } from "./LanguageProvider"

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { language, toggleLanguage, t } = useLanguage()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed z-50 transition-all duration-300
        ${!scrolled
          ? `
              top-[2vw]
              left-1/2 -translate-x-1/2
              w-[95vw] sm:w-[90vw] md:w-[85vw]
              bg-gray-200/80 dark:bg-[#2a2a2a]
            `
          : `
              top-0 left-0 translate-x-0
              w-full
              bg-white/90 dark:bg-[#1f1f1f]/90
              shadow-lg backdrop-blur-md
              p-4
            `
        }
      `}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between" >
        {/* LOGO */}
        <h1 className=" md:text-2xl leading-tight text-gray-700">
          Mustafa Ibrahim
        </h1>

        <div className="flex items-center gap-4">
          {/* DESKTOP MENU (>= 700px) */}
          <nav className="hidden min-[700px]:flex items-center gap-6">
            <Link href="/" className="font-medium hover:underline">
              {t.nav.home}
            </Link>
            <Link href="/about" className="font-medium hover:underline">
              {t.nav.about}
            </Link>
            <Link href="/#contact" className="font-medium hover:underline">
              {t.nav.contact}
            </Link>
          </nav>

          {/* DESKTOP TOGGLE */}
          <button
            type="button"
            onClick={toggleLanguage}
            aria-label={t.toggle.label}
            aria-pressed={language === "so"}
            className="hidden min-[700px]:inline-flex items-center"
          >
            <span
              className={`relative inline-flex h-8 w-16 items-center rounded-full
                transition-colors duration-300
                ${language === "so"
                  ? "bg-gradient-to-r from-indigo-600/70 to-sky-500/70"
                  : "bg-gray-300"}
              `}
            >
              <span className="absolute left-2 text-[10px] font-semibold text-gray-800">
                {t.toggle.en}
              </span>
              <span className="absolute right-2 text-[10px] font-semibold text-gray-800">
                {t.toggle.so}
              </span>
              <span
                className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow
                  transition-transform duration-300
                  ${language === "so" ? "translate-x-8" : "translate-x-0"}
                `}
              />
            </span>
          </button>

          {/* HAMBURGER BUTTON (< 700px) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="min-[700px]:hidden text-2xl"
            aria-label="Toggle menu"
          >
            {menuOpen ? <IoClose /> : <GiHamburgerMenu />}
          </button>

          {/* MOBILE TOGGLE */}
          <button
            type="button"
            onClick={toggleLanguage}
            aria-label={t.toggle.label}
            aria-pressed={language === "so"}
            className="min-[700px]:hidden inline-flex items-center"
          >
            <span
              className={`relative inline-flex h-8 w-14 items-center rounded-full
                transition-colors duration-300
                ${language === "so"
                  ? "bg-gradient-to-r from-emerald-500/70 to-sky-500/70"
                  : "bg-gray-300"}
              `}
            >
              <span className="absolute left-2 text-[10px] font-semibold text-gray-800">
                {t.toggle.en}
              </span>
              <span className="absolute right-2 text-[10px] font-semibold text-gray-800">
                {t.toggle.so}
              </span>
              <span
                className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow
                  transition-transform duration-300
                  ${language === "so" ? "translate-x-6" : "translate-x-0"}
                `}
              />
            </span>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="min-[700px]:hidden mt-4 bg-transparent dark:bg-[#1f1f1f] ">
          <nav className="flex flex-col-reverse items-end gap-4">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="font-medium pr-4"
            >
              {t.nav.home}
            </Link>

            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
              className="font-medium pr-4"
            >
              {t.nav.about}
            </Link>

            <Link
              href="/#contact"
              onClick={() => setMenuOpen(false)}
              className="font-medium pr-4"
            >
              {t.nav.contact}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
