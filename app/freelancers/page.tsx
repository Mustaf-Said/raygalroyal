"use client"

import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Mail, Linkedin, X } from "lucide-react"
import { useLanguage } from "@/app/components/LanguageProvider"
import { getSafeAvatarSrc } from "@/lib/utils"

type Freelancer = {
  id: number
  name: string
  role: string
  image_url: string | null
  email: string
  linkedin_url: string
  message: string
}

export default function FreelancersPage() {
  const { t } = useLanguage()
  const [freelancers, setFreelancers] = useState<Freelancer[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFreelancer, setSelectedFreelancer] = useState<Freelancer | null>(null)

  const text = t.freelancers

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/freelancers", { cache: "no-store" })
        if (!response.ok) {
          throw new Error("Failed to fetch freelancers")
        }

        const data = await response.json()
        setFreelancers(Array.isArray(data) ? (data as Freelancer[]) : [])
      } catch {
        setFreelancers([])
      } finally {
        setLoading(false)
      }
    }

    fetchFreelancers()
  }, [])

  return (
    <>
      <section className="py-24 bg-gray-50 dark:bg-gray-900/30 min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">{text.title}</h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">{text.subtitle}</p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-950 dark:bg-blue-600 text-white font-semibold hover:opacity-90 transition-opacity"
            >
              {text.back}
            </Link>
          </div>

          {loading ? (
            <div className="text-center text-gray-600 dark:text-gray-400 py-20">{text.loading}</div>
          ) : freelancers.length === 0 ? (
            <div className="text-center text-gray-600 dark:text-gray-400 py-20">{text.empty}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {freelancers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedFreelancer(member)}
                  className="group bg-white dark:bg-gray-950 p-6 rounded-4xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
                >
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-6">
                    <Image
                      src={getSafeAvatarSrc(member.image_url)}
                      alt={member.name || "Freelancer"}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-colors" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-1">{member.name}</h3>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 text-center mb-6">
                    {t.team.roles[member.role as keyof typeof t.team.roles] ?? member.role}
                  </p>

                  <div className="flex items-center justify-center gap-4">
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(event) => event.stopPropagation()}
                      className="p-2 bg-gray-50 dark:bg-gray-900 rounded-full text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a
                      href={`mailto:${member.email}`}
                      onClick={(event) => event.stopPropagation()}
                      className="p-2 bg-gray-50 dark:bg-gray-900 rounded-full text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedFreelancer ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedFreelancer(null)}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start md:items-center justify-center p-3 md:p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-lg max-h-[92vh] overflow-y-auto bg-white dark:bg-gray-950 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-800 shadow-2xl my-3"
            >
              <div className="flex justify-end mb-3">
                <button
                  type="button"
                  onClick={() => setSelectedFreelancer(null)}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-label={text.close}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative w-full aspect-square max-h-85 rounded-2xl overflow-hidden mb-6">
                <Image
                  src={getSafeAvatarSrc(selectedFreelancer.image_url)}
                  alt={selectedFreelancer.name}
                  fill
                  className="object-cover"
                />
              </div>

              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{selectedFreelancer.name}</h3>
              <p className="text-blue-600 dark:text-blue-400 font-semibold mb-5">
                {t.team.roles[selectedFreelancer.role as keyof typeof t.team.roles] ?? selectedFreelancer.role}
              </p>

              <div className="mb-5 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">{text.bio}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {selectedFreelancer.message || "-"}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${selectedFreelancer.email}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  {selectedFreelancer.email}
                </a>
                <a
                  href={selectedFreelancer.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
