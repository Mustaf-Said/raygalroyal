"use client"

import Link from "next/link"
import { useLanguage } from "./LanguageProvider"

const PROJECTS = [
  {
    key: "multilingual",
    tech: ["Next.js", "TypeScript", "Tailwind"],
    code: "https://raygalroyal.com",
  },
  {
    key: "dashboard",
    tech: ["React", "API", "CSS"],
    code: "https://react-slut-project.vercel.app/",
  },
  {
    key: "fullstack",
    tech: ["Node.js", "Express", "MongoDB"],
    code: "https://asha-rust.vercel.app/",
  },
] as const

export default function Projects() {
  const { t } = useLanguage()

  return (
    <section
      id="projects"
      className="relative overflow-hidden py-24 bg-gray-400 font-medium"
    >
      {/* BACKGROUND VIDEO */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="hidden md:block absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/coding.mp4" type="video/mp4" />
      </video>

      {/* GLOBAL OVERLAY */}
      <div className="absolute inset-0 md:bg-black/70 z-10" />

      {/* CONTENT */}
      <div className="relative z-20 max-w-6xl mx-auto px-6">
        {/* TITLE */}
        <h2 className="text-3xl md:text-4xl font-bold text-center md:text-white">
          {t.projects.title}
        </h2>

        <p className="mt-4 text-center md:text-gray-300">
          {t.projects.subtitle}
        </p>

        {/* GRID */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project) => {
            const projectText = t.projects.items[project.key]

            return (
              <div
                key={project.key}
                className="
                group relative h-[300px] rounded-2xl overflow-hidden
                bg-white/90 dark:bg-transparent
                               shadow-xl
                transition-all duration-300
                hover:bg-transparent dark:hover:bg-transparent
              "
              >
                {/* CARD OVERLAY (för textläsbarhet vid hover) */}
                <div
                  className="
                  absolute inset-0 bg-black/60
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-300
                "
                />

                {/* CONTENT */}
                <div
                  className="
                  relative z-10 h-full flex flex-col justify-between p-6
                  text-gray-900 dark:text-white
                  group-hover:text-white
                  transition-colors
                "
                >
                  <div>
                    <h3 className="text-xl font-semibold">
                      {projectText.title}
                    </h3>

                    <p className="mt-2 text-sm opacity-80">
                      {projectText.description}
                    </p>
                  </div>

                  <div>
                    {/* TECH */}
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="
                          text-xs px-2 py-1 rounded border
                          bg-gray-200/80 dark:bg-zinc-700/80
                          group-hover:bg-white/20 group-hover:text-white
                          transition
                        "
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* LINKS */}
                    <div className="mt-4 flex flex-row gap-4 text-sm font-medium text-blue-600 group-hover:text-blue-300 justify-end">
                      {/*    <Link href={project.live} target="_blank" className="hover:underline">
                      Live Demo
                    </Link> */}
                      <Link href={project.code} target="_blank" className="hover:underline">
                        🔵 {t.projects.liveDemo}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
