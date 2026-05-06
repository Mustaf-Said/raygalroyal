"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Send, CheckCircle2 } from "lucide-react"
import { useLanguage } from "./LanguageProvider"
import { useState } from "react"

interface ContactPopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function ContactPopup({ isOpen, onClose }: ContactPopupProps) {
  const { t } = useLanguage()
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data?.error || "Failed to send message")
      }
      setSubmitted(true)
      setFormData({ name: "", email: "", message: "" })
      setTimeout(() => {
        setSubmitted(false)
        onClose()
      }, 3000)
    } catch (error) {
      if (error instanceof Error) setErrorMessage(error.message)
      else setErrorMessage(t.contact.submitFailed)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setSubmitted(false)
    setErrorMessage("")
    setFormData({ name: "", email: "", message: "" })
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-gray-50 dark:bg-gray-900 p-8 md:p-10 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-2xl shadow-blue-500/10 w-full max-w-lg pointer-events-auto relative">
              <button
                onClick={handleClose}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center"
                >
                  <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-green-500/20">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{t.contact.success}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{t.contact.replyWithin}</p>
                </motion.div>
              ) : (
                <>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 pr-10">{t.contact.title}</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-gray-500 dark:text-gray-400 ml-1">{t.contact.name}</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-white"
                          placeholder={t.contact.placeholders.name}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-gray-500 dark:text-gray-400 ml-1">{t.contact.email}</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-white"
                          placeholder={t.contact.placeholders.email}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-gray-500 dark:text-gray-400 ml-1">{t.contact.message}</label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData((f) => ({ ...f, message: e.target.value }))}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none text-gray-900 dark:text-white"
                        placeholder={t.contact.placeholders.message}
                      />
                    </div>
                    {errorMessage && (
                      <p className="text-sm font-semibold text-red-500">{errorMessage}</p>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 relative text-white font-black rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-95 overflow-hidden flex items-center justify-center gap-3 group disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{
                        background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 60%, #c026d3 100%)",
                        boxShadow: "0 0 30px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
                        border: "1px solid rgba(255,255,255,0.15)",
                      }}
                    >
                      <span
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                        style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))" }}
                      />
                      <span
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-md -z-10"
                        style={{ background: "linear-gradient(135deg, #2563eb, #c026d3)" }}
                      />
                      <Send className="relative z-10 w-5 h-5" />
                      <span className="relative z-10 tracking-wide">
                        {isSubmitting ? t.contact.sending : t.contact.send}
                      </span>
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
