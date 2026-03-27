"use client"

import { motion } from "framer-motion"
import { useLanguage } from "../components/LanguageProvider"
import {
  Cookie,
  Settings2,
  BarChart2,
  Target,
  ToggleLeft,
  AlertCircle,
} from "lucide-react"

export default function CookiePage() {
  const { t } = useLanguage()

  const sections: { key: keyof typeof t.cookie.sections; icon: React.ElementType }[] = [
    { key: "whatAreCookies", icon: Cookie },
    { key: "necessary", icon: Settings2 },
    { key: "analytics", icon: BarChart2 },
    { key: "marketing", icon: Target },
    { key: "managing", icon: ToggleLeft },
    { key: "updates", icon: AlertCircle },
  ]

  return (
    <section className="py-32 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6"
          >
            <Cookie className="w-8 h-8" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
            {t.cookie.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t.cookie.subtitle}
          </p>
        </div>

        <div className="space-y-12">
          {sections.map((section, index) => {
            const Icon = section.icon
            const title = t.cookie.sections[section.key]

            return (
              <motion.div
                key={section.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 p-8 md:p-10 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {title}
                  </h2>
                </div>

                <div className="prose prose-blue dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 leading-relaxed">
                  <p>{t.cookie.content}</p>
                  <ul className="mt-4 list-disc pl-5 space-y-2">
                    <li>{t.cookie.bullets.one}</li>
                    <li>{t.cookie.bullets.two}</li>
                    <li>{t.cookie.bullets.three}</li>
                  </ul>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
