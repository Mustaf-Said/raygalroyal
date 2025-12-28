import fs from "fs"
import path from "path"

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  // ✅ Load translations from filesystem (production-safe)
  const filePath = path.join(
    process.cwd(),
    "public",
    "locales",
    `${lang}.json`
  )

  const file = fs.readFileSync(filePath, "utf-8")
  const t = JSON.parse(file)

  return (
    <section className="min-h-[90vh] flex items-center">
      <div
        className={`max-w-5xl mx-auto px-6 py-24
          ${lang === "ar" ? "text-right" : "text-left"}
        `}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-10">
          {t.about_title}
        </h1>

        <div className="space-y-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          <p>{t.about_p1}</p>
          <p>{t.about_p2}</p>
          <p>{t.about_p3}</p>
          <p>{t.about_p4}</p>
        </div>
      </div>
    </section>
  )
}
