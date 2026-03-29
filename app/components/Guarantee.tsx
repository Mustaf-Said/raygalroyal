"use client"

import { motion } from "framer-motion"
import { ShieldCheck, CheckCircle2 } from "lucide-react"
import { useLanguage } from "./LanguageProvider"

export default function Guarantee() {
  const { t } = useLanguage()

  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0f0c29 0%, #1a1a6e 25%, #2563eb 55%, #7c3aed 80%, #c026d3 100%)",
      }}
    >
      {/* Orb top-right */}
      <div className="absolute top-[-80px] right-[-80px] w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #a855f7, transparent)" }} />
      {/* Orb bottom-left */}
      <div className="absolute bottom-[-80px] left-[-80px] w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }} />
      {/* Center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-48 opacity-10 blur-3xl rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #e879f9, transparent)" }} />
      {/* Shimmer border overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)" }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <div
              className="w-24 h-24 backdrop-blur-md rounded-3xl flex items-center justify-center text-white mb-10 shadow-2xl"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow: "0 0 30px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
              }}
            >
              <ShieldCheck className="w-12 h-12" />
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight drop-shadow-lg">
              {t.guarantee.title}
            </h2>

            <p className="text-xl text-blue-100/80 mb-10 leading-relaxed max-w-2xl font-light tracking-wide">
              {t.guarantee.desc}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 w-full"
          >
            <div
              className="backdrop-blur-md p-8 md:p-12 rounded-[48px] shadow-2xl"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "0 0 60px rgba(99,102,241,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
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
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform"
                      style={{
                        background: "rgba(255,255,255,0.12)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        boxShadow: "0 0 12px rgba(192,38,211,0.3)",
                      }}
                    >
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold text-white">
                      {point}
                    </span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 pt-12" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-sm"
                    style={{
                      background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                      border: "2px solid rgba(255,255,255,0.25)",
                      boxShadow: "0 0 16px rgba(99,102,241,0.4)",
                    }}
                  >
                    RR
                  </div>
                  <div>
                    <div className="text-white font-bold">Raygal Royal</div>
                    <div className="text-sm" style={{ color: "rgba(196,181,253,0.8)" }}>{t.guarantee.signatureRole}</div>
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
