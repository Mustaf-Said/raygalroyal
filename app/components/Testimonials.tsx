"use client"

import { motion } from "framer-motion"
import { Quote, Star } from "lucide-react"
import { useLanguage } from "./LanguageProvider"

export default function Testimonials() {
  const { t } = useLanguage()

  return (
    <section className="py-24 bg-white dark:bg-gray-950 relative overflow-hidden">
      {/* SOFT GRADIENT BACKGROUND */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6"
          >
            {t.testimonials.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-400"
          >
            {t.testimonials.subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.testimonials.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 bg-gray-50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-100 dark:border-gray-800 rounded-[32px] relative group hover:bg-white dark:hover:bg-gray-900 transition-all duration-300"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <Quote className="absolute top-8 right-8 w-12 h-12 text-blue-600/10 group-hover:text-blue-600/20 transition-colors" />

              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed italic">
                &quot;{item.text}&quot;
              </p>

              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 60%, #c026d3 100%)",
                    boxShadow: "0 0 16px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  <span className="absolute inset-0 rounded-full"
                    style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.03))" }} />
                  <span className="relative z-10">{item.name[0]}</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
