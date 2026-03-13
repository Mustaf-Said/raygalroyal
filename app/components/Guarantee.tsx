"use client"

import { motion } from "framer-motion"
import { ShieldCheck, CheckCircle2 } from "lucide-react"
import { useLanguage } from "./LanguageProvider"

export default function Guarantee() {
  const { t } = useLanguage()

  return (
    <section className="py-24 bg-blue-600 relative overflow-hidden">
      {/* DECORATIVE ELEMENTS */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-white mb-10 shadow-2xl">
              <ShieldCheck className="w-12 h-12" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
              {t.guarantee.title}
            </h2>
            
            <p className="text-xl text-blue-100 mb-10 leading-relaxed max-w-2xl">
              {t.guarantee.desc}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 w-full"
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 md:p-12 rounded-[48px] shadow-2xl">
              <div className="grid gap-6">
                {t.guarantee.points.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold text-white">
                      {point}
                    </span>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-12 pt-12 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-white/50 flex items-center justify-center text-white font-black">
                    RR
                  </div>
                  <div>
                    <div className="text-white font-bold">Raygal Royal</div>
                    <div className="text-blue-200 text-sm">Quality Assurance Team</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
