"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useLanguage } from "./LanguageProvider"
import { Users, Mail, Linkedin, Briefcase } from "lucide-react"

const TEAM_MEMBERS = [
  {
    name: "Alex Johnson",
    role: "frontend",
    image: "/images/profile.jpg",
  },
  {
    name: "Sarah Chen",
    role: "backend",
    image: "/images/profile.jpg",
  },
  {
    name: "Marcus Ray",
    role: "fullstack",
    image: "/images/profile.jpg",
  },
  {
    name: "Elena Soto",
    role: "uiux",
    image: "/images/profile.jpg",
  },
]

export default function Team() {
  const { t } = useLanguage()

  return (
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {TEAM_MEMBERS.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white dark:bg-gray-950 p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-6">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-colors" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-1">
                {member.name}
              </h3>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 text-center mb-6">
                {t.team.roles[member.role as keyof typeof t.team.roles]}
              </p>
              
              <div className="flex items-center justify-center gap-4">
                <button className="p-2 bg-gray-50 dark:bg-gray-900 rounded-full text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </button>
                <button className="p-2 bg-gray-50 dark:bg-gray-900 rounded-full text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <Mail className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

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
          
          <button className="px-10 py-4 bg-gray-950 dark:bg-blue-600 text-white font-black rounded-2xl hover:scale-105 transition-transform flex items-center gap-3">
            <Briefcase className="w-5 h-5" />
            {t.team.applyNow}
          </button>
        </motion.div>
      </div>
    </section>
  )
}
