"use client"

import { useLanguage } from "../components/LanguageProvider"

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <section className="min-h-[90vh] flex flex-col items-center">
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-9 text-left">
        <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center">
          {t.about.title}
        </h1>

        <div className="space-y-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          {t.about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  )
}
