"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ExternalLink, ArrowUpRight } from "lucide-react"
import { useLanguage } from "./LanguageProvider"

const PROJECTS_DATA = [
  {
    key: "ecommerce",
    image: "/images/projekt/1.jpg",
    category: "E-Commerce",
    tech: ["Next.js", "Stripe", "Tailwind"],
  },
  {
    key: "fintech",
    image: "/images/projekt/2.jpg",
    category: "FinTech",
    tech: ["React", "D3.js", "Node.js"],
  },
  {
    key: "healthcare",
    image: "/images/projekt/3.jpg",
    category: "Healthcare",
    tech: ["TypeScript", "Next.js", "Firebase"],
  },
] as const

export default function Projects() {
  const { t } = useLanguage()

  return (
    <section id="projects" className="py-24 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6"
            >
              {t.projects.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 dark:text-gray-400"
            >
              {t.projects.subtitle}
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="#contact"
              className="group flex items-center gap-2 text-lg font-bold text-blue-600 dark:text-blue-400"
            >
              Start a project with us
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {PROJECTS_DATA.map((project, index) => {
            const projectText = t.projects.items[project.key]

            return (
              <motion.div
                key={project.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative h-[400px] w-full overflow-hidden rounded-[32px] mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-500">
                  <Image
                    src={project.image}
                    alt={projectText.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech) => (
                        <span key={tech} className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/20">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {projectText.title}
                    </h3>
                  </div>

                  <Link
                    href="#"
                    className="absolute top-6 right-6 w-14 h-14 bg-white rounded-full flex items-center justify-center text-gray-950 scale-0 group-hover:scale-100 transition-transform duration-500 hover:bg-blue-600 hover:text-white"
                  >
                    <ExternalLink className="w-6 h-6" />
                  </Link>
                </div>
                
                <div className="px-4">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2 block">
                    {project.category}
                  </span>
                  <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                    {projectText.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
