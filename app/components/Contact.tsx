"use client"

import { motion } from "framer-motion"
import { Mail, MessageSquare, Phone, Send, CheckCircle2 } from "lucide-react"
import { useLanguage } from "./LanguageProvider"
import { useState } from "react"

export default function Contact() {
  const { t } = useLanguage()
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
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
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{t.contact.email}</div>
                  <a href="mailto:info@raygalroyal.com" className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 transition-colors">info@raygalroyal.com</a>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{t.contact.whatsapp}</div>
                  <a href="https://wa.me/46722889588" target="_blank" className="text-xl font-bold text-gray-900 dark:text-white hover:text-green-600 transition-colors">+46 72 288 95 88</a>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Office</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">Stockholm, Sweden</div>
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
                  <p className="text-gray-500">We&apos;ll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 dark:text-gray-400 ml-1">{t.contact.name}</label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-6 py-4 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 dark:text-gray-400 ml-1">{t.contact.email}</label>
                      <input 
                        type="email" 
                        required
                        className="w-full px-6 py-4 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 dark:text-gray-400 ml-1">{t.contact.message}</label>
                    <textarea 
                      required
                      rows={4}
                      className="w-full px-6 py-4 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                      placeholder="Tell us about your project..."
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all hover:scale-[1.02] flex items-center justify-center gap-3 shadow-xl shadow-blue-500/25 active:scale-95"
                  >
                    <Send className="w-5 h-5" />
                    {t.contact.send}
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
