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

  // Load translations from public/locales
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  const res = await fetch(`${base}/locales/${lang}.json`, { cache: "no-store" })
  const t = await res.json()

  return (
    <>
      <Hero t={t} lang={lang} avatarUrl="/images/profile.jpg" />
      <Skills t={t} />
      <Projects t={t} />
      <Services t={t} />
      <Contact t={t} />
      <Footer t={t} />

    </>
  )
}
