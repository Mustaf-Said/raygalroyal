"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Play, Search } from "lucide-react"
import { useLanguage } from "./LanguageProvider"
import { useState } from "react"

export default function Hero() {
  const { t } = useLanguage()
  const [domain, setDomain] = useState("")
  const router = useRouter()

  const handleDomainSearch = () => {
    const nextDomain = domain.trim()
    if (!nextDomain) return

    router.push(`/domain-search?query=${encodeURIComponent(nextDomain)}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleDomainSearch()
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* VIDEO BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-40 dark:opacity-30"
        >
          <source src="/videos/coding.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-linear-to-b from-white via-white/80 to-white dark:from-gray-950 dark:via-gray-950/80 dark:to-gray-950" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wider text-blue-600 uppercase bg-blue-50 dark:bg-blue-900/30 rounded-full">
            {t.hero.badge}
          </span>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-gray-900 dark:text-white mb-8">
            {t.hero.title.split(" ").map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="inline-block mr-3"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
            {t.hero.description}
          </p>

          {/* DOMAIN SEARCH FIELD */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-3 max-w-xl mx-auto"
          >
            <div className="flex items-center bg-white dark:bg-gray-900 rounded-full border border-gray-200 dark:border-gray-700 shadow-lg shadow-black/5 px-2 py-2 gap-2 transition-all focus-within:border-violet-400 dark:focus-within:border-violet-500 focus-within:shadow-violet-200/40 dark:focus-within:shadow-violet-900/30 focus-within:shadow-xl">
              <Search className="w-5 h-5 text-violet-500 shrink-0" />
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.hero.domainPlaceholder ?? "Search for your perfect domain name..."}
                className=" flex-1 min-w-0 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-base py-1"
              />
              <button
                aria-label="Open menu"
                onClick={handleDomainSearch}
                className="shrink-0 px-4 sm:px-5 py-2 rounded-full text-white text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap"
                style={{
                  background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 60%, #c026d3 100%)",
                  boxShadow: "0 0 16px rgba(124,58,237,0.35)",
                }}
              >
                {t.hero.domainSearch ?? "Search Domain"}
              </button>
            </div>
          </motion.div>

          {/* DOMAIN HINT */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-xs text-gray-400 dark:text-gray-600 mb-10 tracking-wide"
          >
            {t.hero.domainHint ?? "Try: yourbusiness.com · .se · .io · .dev"}
          </motion.p>

          {/* CTA BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="group relative px-8 py-4 text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden flex items-center gap-2"
              style={{
                background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 60%, #c026d3 100%)",
                boxShadow: "0 0 20px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))" }} />
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-md -z-10"
                style={{ background: "linear-gradient(135deg, #2563eb, #c026d3)" }} />
              <span className="relative z-10">{t.hero.ctaPrimary}</span>
              <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="#projects"
              className="px-8 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-bold rounded-2xl border border-gray-200 dark:border-gray-800 transition-all hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              {t.hero.ctaSecondary}
            </Link>
          </div>
        </motion.div>

        {/* STATS / TRUST BADGES */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-20 pt-10 border-t border-gray-100 dark:border-gray-900 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { label: t.hero.stats.projectsCompleted, value: t.hero.stats.projectsCompletedValue },
            { label: t.hero.stats.happyClients, value: t.hero.stats.happyClientsValue },
            { label: t.hero.stats.experience, value: t.hero.stats.experienceValue },
            { label: t.hero.stats.technologies, value: t.hero.stats.technologiesValue },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-black text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-sm text-gray-500 uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* DECORATIVE ELEMENTS */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700" />
    </section>
  )
}