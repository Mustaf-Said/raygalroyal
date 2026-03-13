"use client"

import { motion } from "framer-motion"
import { useLanguage } from "../components/LanguageProvider"
import { ScrollText, ShieldAlert, FileText, Scale, CreditCard, RefreshCcw, Lock } from "lucide-react"

export default function TermsPage() {
  const { t } = useLanguage()

  const sections = [
    { key: "scope", icon: FileText },
    { key: "payment", icon: CreditCard },
    { key: "client", icon: Scale },
    { key: "delivery", icon: ShieldAlert },
    { key: "refund", icon: RefreshCcw },
    { key: "ip", icon: Lock },
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
            <ScrollText className="w-8 h-8" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
            {t.terms.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t.terms.subtitle}
          </p>
        </div>

        <div className="space-y-12">
          {sections.map((section, index) => {
            const Icon = section.icon
            const title = t.terms.sections[section.key as keyof typeof t.terms.sections]

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
                  <p>
                    {t.terms.content}
                  </p>
                  <ul className="mt-4 list-disc pl-5 space-y-2">
                    <li>Comprehensive support and maintenance included.</li>
                    <li>Transparent revision process to ensure excellence.</li>
                    <li>Secure data handling and privacy compliance.</li>
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
