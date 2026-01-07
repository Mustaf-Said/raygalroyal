import fs from "fs"
import path from "path"

import Hero from "@/app/components/Hero"
import Skills from "../components/Skills"
import Projects from "../components/Projects"
import Services from "../components/Services"
import Contact from "../components/Contact"
import Footer from "../components/Footer"

export default async function LangPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  // ✅ READ TRANSLATIONS FROM FILESYSTEM (PRODUCTION SAFE)
  const filePath = path.join(
    process.cwd(),
    "public",
    "locales",
    `${lang}.json`
  )

  const file = fs.readFileSync(filePath, "utf-8")
  const t = JSON.parse(file)

  return (
    <>
      <Hero t={t} lang={lang} />
      <Skills t={t} />
      <Projects t={t} />
      <Services t={t} />
      <Contact t={t} />
      <Footer t={t} />
    </>
  )
}
