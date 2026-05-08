"use client"

import { motion } from "framer-motion"
import { ExternalLink, Globe, Mic, Building2 } from "lucide-react"
import { useLanguage } from "./LanguageProvider"

const projects = [
  {
    name: "Sahal.one",
    badgeKey: "marketplacePlatform" as const,
    description:
      "A full-featured marketplace for cars, houses and land listings with real-time weather across Somaliland cities.",
    Icon: Globe,
    iconBg: "bg-orange-500",
    textColor: "text-orange-500",
    status: "live" as const,
    link: "https://www.sahal.one",
  },
  {
    name: "PodManager.AI",
    badgeKey: "internship" as const,
    description:
      "A comprehensive podcast platform supporting recording, AI-powered translation, publishing and monetization.",
    Icon: Mic,
    iconBg: "bg-indigo-600",
    textColor: "text-indigo-500",
    status: "live" as const,
    link: "https://podmanager.ai/",
  },
  {
    name: "Somaliland.nu",
    badgeKey: "governmentPlatform" as const,
    description:
      "An official digital government platform for Somaliland — providing citizens with key public services online.",
    Icon: Building2,
    iconBg: "bg-blue-600",
    textColor: "text-blue-500",
    status: "inProgress" as const,
    link: "",
  },
]

export default function PaymentIntegration() {
  const { t } = useLanguage()
  const p = t.paymentIntegration

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
            {p.sectionTitle}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">{p.sectionSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map(({ name, badgeKey, description, Icon, iconBg, textColor, status, link }, index) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-950 p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-xl flex flex-col gap-6"
            >
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    status === "live"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}
                >
                  {status === "live" ? p.live : p.inProgress}
                </span>
              </div>

              <div>
                <div className="text-xs font-bold text-gray-400 uppercase mb-2">{p[badgeKey]}</div>
                <h3 className={`text-2xl font-black mb-3 ${textColor}`}>{name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{description}</p>
              </div>

              {link && (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  {p.visitSite}
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
