"use client"

import { motion } from "framer-motion"
import { Globe, Code, Layout, Cloud, Cpu, ShieldCheck, ArrowRight } from "lucide-react"
import { useLanguage } from "./LanguageProvider"
import { useModals } from "./ModalProvider"

const SERVICES_ICONS = {
  web: Globe,
  mobile: Code,
  design: Layout,
  cloud: Cloud,
  ai: Cpu,
  security: ShieldCheck,
}

export default function Services() {
  const { t } = useLanguage()
  const { openOrderModal } = useModals()

  const serviceKeys = Object.keys(t.services.items) as Array<keyof typeof t.services.items>

  return (
    <section id="services" className="py-24 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden">
      {/* BACKGROUND GRADIENTS */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6"
          >
            {t.services.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-400"
          >
            {t.services.subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceKeys.map((key, index) => {
            const Icon = SERVICES_ICONS[key] || Globe
            const service = t.services.items[key]

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group p-8 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <Icon className="w-8 h-8" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {service.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                  {service.desc}
                </p>

                <button
                  onClick={() => openOrderModal(key)}
                  className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 group/btn"
                >
                  LEARN MORE
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )
          })}
        </div>

        {/* ORDER FLOW CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-20 relative overflow-hidden p-12 rounded-[40px] text-white text-center"
          style={{
            background: "linear-gradient(135deg, #0f0c29 0%, #1a1a6e 25%, #2563eb 55%, #7c3aed 80%, #c026d3 100%)",
            boxShadow: "0 0 80px rgba(99,102,241,0.4), 0 0 160px rgba(192,38,211,0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          {/* Orb top-left */}
          <div className="absolute top-[-60px] left-[-60px] w-72 h-72 rounded-full opacity-25 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, #a855f7, transparent)" }} />

          {/* Orb bottom-right */}
          <div className="absolute bottom-[-60px] right-[-60px] w-72 h-72 rounded-full opacity-25 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }} />

          {/* Center glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-40 opacity-10 blur-2xl rounded-full pointer-events-none"
            style={{ background: "radial-gradient(ellipse, #e879f9, transparent)" }} />

          {/* Shimmer border */}
          <div className="absolute inset-0 rounded-[40px] pointer-events-none"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%, rgba(255,255,255,0.04) 100%)" }} />

          {/* Content */}
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-4 drop-shadow-lg">
              Ready to build something amazing?
            </h3>
            <p className="text-blue-100/80 mb-8 text-lg font-light tracking-wide">
              Select a service and let&apos;s get started on your digital journey.
            </p>
            <button
              onClick={() => openOrderModal()}
              className="relative px-10 py-4 font-black rounded-2xl transition-all duration-300 active:scale-95 shadow-xl shadow-black/30 overflow-hidden group"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.25)",
                backdropFilter: "blur(12px)",
                color: "#fff",
              }}
            >
              {/* Button hover shimmer */}
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))" }} />
              <span className="relative z-10 tracking-widest text-sm">START YOUR ORDER</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
