"use client"

import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useLanguage } from "./LanguageProvider"
import { Users, Briefcase, X } from "lucide-react"
import { getSafeAvatarSrc } from "@/lib/utils"

type TeamMember = {
  id: number
  name: string
  role: string
  bio?: string | null
  profile_image?: string | null
  title_en?: string | null
  title_so?: string | null
  title_ar?: string | null
  bio_en?: string | null
  bio_so?: string | null
  bio_ar?: string | null
  image_url?: string | null
  email?: string
  linkedin_url?: string
  message?: string
}

const FALLBACK_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "frontend",
    image_url: "/images/profile.jpg",
    email: "alex@example.com",
    linkedin_url: "https://www.linkedin.com",
    message: "Frontend engineer focused on motion-rich interfaces and clean UX.",
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "backend",
    image_url: "/images/profile.jpg",
    email: "sarah@example.com",
    linkedin_url: "https://www.linkedin.com",
    message: "Backend specialist working on scalable APIs and secure systems.",
  },
  {
    id: 3,
    name: "Marcus Ray",
    role: "fullstack",
    image_url: "/images/profile.jpg",
    email: "marcus@example.com",
    linkedin_url: "https://www.linkedin.com",
    message: "Fullstack developer bridging product vision and technical delivery.",
  },
  {
    id: 4,
    name: "Elena Soto",
    role: "uiux",
    image_url: "/images/profile.jpg",
    email: "elena@example.com",
    linkedin_url: "https://www.linkedin.com",
    message: "Product designer crafting delightful user journeys across web platforms.",
  },
]

type ApplyFormTranslations = {
  title?: string
  name?: string
  email?: string
  linkedin?: string
  role?: string
  message?: string
  submit?: string
  image?: string
  success?: string
  error?: string
  submitting?: string
  closeMember?: string
  closeForm?: string
  loadingTeam?: string
  seeMoreFreelancers?: string
  noFreelancers?: string
  bio?: string
  linkedinPlaceholder?: string
}

export default function Team() {
  const { t, language } = useLanguage()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [membersLoading, setMembersLoading] = useState(true)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  const applyFormT = (t.team as { applyForm?: ApplyFormTranslations }).applyForm

  const defaultApplyText = {
    closeMember: applyFormT?.closeMember ?? "Close member details",
    loadingTeam: applyFormT?.loadingTeam ?? "Loading team...",
    seeMoreFreelancers: applyFormT?.seeMoreFreelancers ?? "See more freelancers",
    noFreelancers: applyFormT?.noFreelancers ?? "No freelancers found.",
    bio: applyFormT?.bio ?? "Bio",
    linkedinPlaceholder: applyFormT?.linkedinPlaceholder ?? "https://www.linkedin.com/in/username",
  }

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        setMembersLoading(true)
        const res = await fetch("/api/freelancers")
        if (!res.ok) {
          throw new Error("Failed to load freelancers")
        }
        const data = await res.json()
        const fetchedMembers = Array.isArray(data) ? (data as TeamMember[]) : []
        setMembers(fetchedMembers.length > 0 ? fetchedMembers : FALLBACK_TEAM_MEMBERS)
      } catch {
        setMembers(FALLBACK_TEAM_MEMBERS)
      } finally {
        setMembersLoading(false)
      }
    }

    fetchFreelancers()
  }, [])

  const getLocalizedTitle = (member: TeamMember) => {
    return member[`title_${language}` as "title_en" | "title_so" | "title_ar"]
      || member.title_en
      || t.team.roles[member.role as keyof typeof t.team.roles]
      || member.role
  }

  const getLocalizedBio = (member: TeamMember) => {
    if (member.bio && member.bio.trim().length > 0) {
      return member.bio
    }

    return member[`bio_${language}` as "bio_en" | "bio_so" | "bio_ar"]
      || member.bio_en
      || member.message
      || "-"
  }

  const displayedMembers = members.slice(0, 8)

  return (
    <>
      <section id="team" className="py-24 bg-gray-50 dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6"
            >
              {t.team.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 dark:text-gray-400"
            >
              {t.team.subtitle}
            </motion.p>
          </div>

          <div className="flex justify-end mb-6">
            <Link
              href="/freelancers"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-950 dark:bg-blue-600 text-white font-semibold hover:opacity-90 transition-opacity"
            >
              {defaultApplyText.seeMoreFreelancers} <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          {membersLoading ? (
            <div className="text-center text-gray-600 dark:text-gray-400 mb-10">{defaultApplyText.loadingTeam}</div>
          ) : displayedMembers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {displayedMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedMember(member)}
                  className="group bg-white dark:bg-gray-950 p-6 rounded-4xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
                >
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-6">
                    <Image
                      src={getSafeAvatarSrc(member.profile_image || member.image_url)}
                      alt={member.name || "Freelancer"}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-colors" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 text-center mb-6">
                    {getLocalizedTitle(member)}
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600 dark:text-gray-400 mb-10">{defaultApplyText.noFreelancers}</div>
          )}

          {/* JOIN THE TEAM CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-[40px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-blue-500/5"
          >
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white">
                  {t.team.joinTitle}
                </h3>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {t.team.joinDesc}
              </p>
            </div>

            <Link
              href="/freelancer/login"
              className="px-10 py-4 text-white font-black rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 relative overflow-hidden flex items-center gap-3 group"
              style={{
                background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 60%, #c026d3 100%)",
                boxShadow: "0 0 20px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))" }} />
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-md -z-10"
                style={{ background: "linear-gradient(135deg, #2563eb, #c026d3)" }} />
              <Briefcase className="relative z-10 w-5 h-5" />
              <span className="relative z-10 tracking-wide">{t.team.applyNow}</span>
            </Link>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {selectedMember ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMember(null)}
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
                  onClick={() => setSelectedMember(null)}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-label={defaultApplyText.closeMember}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative w-full aspect-square max-h-85 rounded-2xl overflow-hidden mb-6">
                <Image
                  src={getSafeAvatarSrc(selectedMember.profile_image || selectedMember.image_url)}
                  alt={selectedMember.name}
                  fill
                  className="object-cover"
                />
              </div>

              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                {selectedMember.name}
              </h3>
              <p className="text-blue-600 dark:text-blue-400 font-semibold mb-5">
                {getLocalizedTitle(selectedMember)}
              </p>

              <div className="mb-5 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">{defaultApplyText.bio}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {getLocalizedBio(selectedMember)}
                </p>
              </div>

            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

    </>
  )
}
