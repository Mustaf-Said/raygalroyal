"use client"

import { motion } from "framer-motion"
import { Mail, /* MessageSquare */ Phone, Send, CheckCircle2, ArrowDown, MessageCircle } from "lucide-react"
import { useLanguage } from "../components/LanguageProvider"
import { useState } from "react"

export default function Contact() {
  const { t } = useLanguage()
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data?.error || "Failed to send message")
      }

      setSubmitted(true)
      setFormData({ name: "", email: "", message: "" })
      setTimeout(() => setSubmitted(false), 5000)
    } catch (error) {
      console.error("Contact form submit failed:", error)
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage(t.contact.submitFailed)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: "name" | "email" | "message", value: string) => {
    setFormData((current) => ({ ...current, [field]: value }))
  }

  return (
    <section id="contact" className="py-24 bg-white dark:bg-gray-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-8 leading-tight">
              {t.contact.title}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-lg">
              {t.contact.subtitle}
            </p>

            <div className="space-y-8">
              <div className="space-y-5">
                {/* Animated pulse icon */}
                <a href="tel:+46722889588" className="flex items-center gap-3 w-fit group">
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <div className="absolute inset-0 rounded-full bg-blue-100 dark:bg-blue-900/30 animate-ping opacity-40" />
                    <div className="relative w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                      <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-blue-500 transition-colors">Direct line</span>
                </a>

                {/* Message */}
                <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  Write your message here and we&apos;ll get back to you quickly —
                  <span className="font-semibold text-blue-600 dark:text-blue-400"> or reach us by email</span>
                  {" "}listed in the footer below.
                </p>

                {/* Footer hint */}
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 w-fit">
                  <ArrowDown className="w-4 h-4 text-gray-400 animate-bounce" />
                  <span className="text-sm text-gray-400">Scroll to footer for email contact</span>
                </div>
              </div>

            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gray-50 dark:bg-gray-900 p-8 md:p-12 rounded-[48px] border border-gray-100 dark:border-gray-800 shadow-2xl shadow-blue-500/5">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-20 text-center"
                >
                  <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/20">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t.contact.success}</h3>
                  <p className="text-gray-500">{t.contact.replyWithin}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 dark:text-gray-400 ml-1">{t.contact.name}</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="w-full px-6 py-4 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder={t.contact.placeholders.name}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 dark:text-gray-400 ml-1">{t.contact.email}</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="w-full px-6 py-4 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder={t.contact.placeholders.email}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 dark:text-gray-400 ml-1">{t.contact.message}</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      className="w-full px-6 py-4 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                      placeholder={t.contact.placeholders.message}
                    />
                  </div>

                  {errorMessage ? (
                    <p className="text-sm font-semibold text-red-500">{errorMessage}</p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 relative text-white font-black rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-95 overflow-hidden flex items-center justify-center gap-3 group disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 60%, #c026d3 100%)",
                      boxShadow: "0 0 30px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                  >
                    {/* Hover shimmer */}
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                      style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))" }} />
                    {/* Glow on hover */}
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-md -z-10"
                      style={{ background: "linear-gradient(135deg, #2563eb, #c026d3)" }} />
                    <Send className="relative z-10 w-5 h-5" />
                    <span className="relative z-10 tracking-wide">
                      {isSubmitting ? t.contact.sending : t.contact.send}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
