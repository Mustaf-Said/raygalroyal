"use client"
import { SomalilandFlag } from './SomalilandFlag'
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronDown, Sun, Moon, Globe, Lock, LogOut } from "lucide-react"
import { GB, SA } from "country-flag-icons/react/3x2"
import { SUPPORTED_LANGUAGES, useLanguage } from "./LanguageProvider"
import type { Language } from "@/locales"
import { useTheme } from "./ThemeProvider"
import { useModals } from "./ModalProvider"
import { cn } from "@/lib/utils"
import { clearAdminAuth, getAdminAccessToken } from "@/lib/adminClientAuth"
import { clearFreelancerAuth, getFreelancerAccessToken } from "@/lib/freelancerAuth"
import Image from "next/image"

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const [authMenuOpen, setAuthMenuOpen] = useState(false)
  const [authRole, setAuthRole] = useState<"admin" | "freelancer" | null>(null)
  const languageMenuRef = useRef<HTMLDivElement | null>(null)
  const authMenuRef = useRef<HTMLDivElement | null>(null)
  const { language, setLanguage, t } = useLanguage()
  const { toggleTheme, isDark } = useTheme()
  const { openOrderModal } = useModals()

  const languageLabels: Record<Language, string> = {
    en: "English",
    so: "Somali",
    ar: "العربية",
  }

  // Ändra typen på languageFlags
  const languageFlags: Record<Language, React.ComponentType<{ className?: string; title?: string }>> = {
    en: GB,
    so: SomalilandFlag,  // ← direkt, ingen wrapper behövs!
    ar: SA,
  }



  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setLanguageMenuOpen(false)
      }

      if (authMenuRef.current && !authMenuRef.current.contains(event.target as Node)) {
        setAuthMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  useEffect(() => {
    const syncAuthState = () => {
      const adminToken = getAdminAccessToken()
      const freelancerToken = getFreelancerAccessToken()

      if (adminToken) {
        setAuthRole("admin")
      } else if (freelancerToken) {
        setAuthRole("freelancer")
      } else {
        setAuthRole(null)
      }
    }

    syncAuthState()
    window.addEventListener("storage", syncAuthState)
    window.addEventListener("focus", syncAuthState)
    return () => {
      window.removeEventListener("storage", syncAuthState)
      window.removeEventListener("focus", syncAuthState)
    }
  }, [pathname])

  const handleLogout = async () => {
    if (authRole === "admin") {
      await fetch("/api/admin/logout", { method: "POST" })
      clearAdminAuth()
    } else if (authRole === "freelancer") {
      clearFreelancerAuth()
    }

    setAuthRole(null)
    setAuthMenuOpen(false)
    setMenuOpen(false)
    router.push("/")
  }

  const navLinks = [
    { name: t.nav.home, href: "/" },
    {
      name: t.nav.services,
      href: "/services",
      dropdown: [
        { name: t.services.items.web.title, key: "web" },
        { name: t.services.items.mobile.title, key: "mobile" },
        { name: t.services.items.design.title, key: "design" },
        { name: t.services.items.ai.title, key: "ai" },
        { name: t.services.items.cloud.title, key: "cloud" },
        { name: t.services.items.security.title, key: "security" },
      ]
    },
    { name: "Domain Search", href: "/domain-search" },
    { name: t.nav.pricing, href: "/pricing" },
    { name: t.nav.contact, href: "/contact" },

    /*  { name: t.nav.faq, href: "/faq" },
     { name: t.nav.team, href: "/team" },
      { name: t.nav.projects, href: "/projects" },*/
  ]

  const ActiveLanguageFlag = languageFlags[language]

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 px-4 py-4",
        scrolled ? "bg-white/80 dark:bg-gray-950/80 backdrop-blur-md shadow-lg py-3" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div
            className="w-10 h-10 rounded-r-full flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-all duration-300 relative overflow-hidden"
          /*  style={{
             background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 60%, #c026d3 100%)",
             boxShadow: "0 0 16px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
             border: "1px solid rgba(255,255,255,0.15)",
           }} */
          >
            {/*   <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
              style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))" }} /> */}
            <span className="relative hover:rotate-360 transition-transform z-10">
              <Image
                src="/logoW.png"
                alt="RaygalRoyal logo"
                width={40}
                height={40}
                sizes="40px"
                className="block dark:hidden"
              />
              <Image
                src="/logoB.png"
                alt="RaygalRoyal logo"
                width={40}
                height={40}
                sizes="40px"
                className="hidden dark:block"
              />
            </span>
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            {language === "ar" ? (
              <>
                رايغال <span className="text-blue-600">رويال</span>
              </>
            ) : (
              <>
                Raygal<span className="text-blue-600">Royal</span>
              </>
            )}
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <div
              key={link.name}
              className="relative group"
              onMouseEnter={() => link.dropdown && setServicesOpen(true)}
              onMouseLeave={() => link.dropdown && setServicesOpen(false)}
            >
              {link.dropdown ? (
                <div className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer py-2">
                  {link.name} <ChevronDown className={cn("w-4 h-4 transition-transform", servicesOpen && "rotate-180")} />
                  <AnimatePresence>
                    {servicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-0 w-64 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl p-2 z-60"
                      >
                        {link.dropdown.map((item) => (
                          <button
                            aria-label="Open menu"
                            key={item.name}
                            onClick={(e) => {
                              e.stopPropagation();
                              openOrderModal(item.key);
                              setServicesOpen(false);
                            }}
                            className="w-full text-left block px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-colors cursor-pointer font-bold"
                          >
                            {item.name}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href={link.href}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2 block"
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-2">
          {/* ADMIN BUTTON */}
          {!authRole ? (
            <div className="relative hidden lg:block" ref={authMenuRef}>
              <button
                aria-label="Open menu"
                onClick={() => setAuthMenuOpen((prev) => !prev)}
                className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                title="Logins"
                aria-haspopup="menu"
                aria-expanded={authMenuOpen}
              >
                <Lock className="w-5 h-5" />
              </button>

              <AnimatePresence>
                {authMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl p-1 z-70"
                    role="menu"
                  >
                    <Link
                      href="/admin/login"
                      onClick={() => setAuthMenuOpen(false)}
                      className="block w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      role="menuitem"
                    >
                      Admin Login
                    </Link>
                    <Link
                      href="/freelancer/login"
                      onClick={() => setAuthMenuOpen(false)}
                      className="block w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      role="menuitem"
                    >
                      Freelancer Login
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              aria-label="Open menu"
              onClick={() => void handleLogout()}
              className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          )}

          {/* THEME TOGGLE */}
          <button
            aria-label="Open menu"
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
            title={t.toggle.theme}
          >
            {
              isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />
            }
          </button>

          {/* LANGUAGE SWITCHER */}
          <div className="relative" ref={languageMenuRef} dir="ltr">
            <button
              aria-label="Open menu"
              onClick={() => setLanguageMenuOpen((prev) => !prev)}
              className="flex items-center gap-1 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
              title={t.toggle.label}
              aria-haspopup="menu"
              aria-expanded={languageMenuOpen}
            >
              <Globe className="w-5 h-5" />
              <ActiveLanguageFlag className="w-5 h-4 rounded-xs shadow-sm ring-1 ring-white/25" aria-hidden="true" />
              <ChevronDown className={cn("w-3 h-3 transition-transform", languageMenuOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {languageMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute top-full right-0 mt-2 w-36 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl p-1 z-70"
                  role="menu"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    (() => {
                      const Flag = languageFlags[lang]
                      return (
                        <button
                          aria-label="Open menu"
                          key={lang}
                          onClick={() => {
                            setLanguage(lang)
                            setLanguageMenuOpen(false)
                          }}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                            language === lang
                              ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          )}
                          role="menuitem"
                        >
                          <Flag className="w-5 h-4 rounded-xs shadow-sm ring-1 ring-white/25" aria-hidden="true" />
                          <span className="block text-xs opacity-80">{languageLabels[lang]}</span>
                        </button>
                      )
                    })()
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* START PROJECT CTA */}
          <button
            aria-label="Open menu"
            onClick={() => openOrderModal()}
            className="hidden sm:block relative px-5 py-2.5 text-white text-sm font-black rounded-full transition-all duration-300 active:scale-95 overflow-hidden group"
            style={{
              background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 60%, #c026d3 100%)",
              boxShadow: "0 0 20px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            {/* Hover shimmer */}
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
              style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))" }} />
            {/* Glow on hover */}
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full blur-md -z-10"
              style={{ background: "linear-gradient(135deg, #2563eb, #c026d3)" }} />
            <span className="relative z-10 tracking-wide">{t.nav.startProject}</span>
          </button>

          {/* MOBILE MENU TOGGLE */}
          <button
            aria-label="Open menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-4 overflow-hidden bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl"
          >
            <nav className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              {!authRole ? (
                <>
                  <Link
                    href="/admin/login"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-colors flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Admin Login
                  </Link>
                  <Link
                    href="/freelancer/login"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-colors flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Freelancer Login
                  </Link>
                </>
              ) : (
                <button
                  aria-label="Open menu"
                  onClick={() => void handleLogout()}
                  className="px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-left"
                >
                  Logout
                </button>
              )}
              <button
                aria-label="Open menu"
                onClick={() => {
                  openOrderModal();
                  setMenuOpen(false);
                }}
                className="mt-2 px-4 py-4 bg-blue-600 text-white text-center font-bold rounded-xl"
              >
                {t.nav.startProject}
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header >
  )
}
