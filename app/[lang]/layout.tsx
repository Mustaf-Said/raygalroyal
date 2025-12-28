import type { Metadata } from "next"
import Header from "../components/Header"
const SUPPORTED_LANGS = ["en", "sv", "ar", "so"] as const
type Lang = (typeof SUPPORTED_LANGS)[number]

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const rawLang = (await params).lang
  const lang: Lang = SUPPORTED_LANGS.includes(rawLang as Lang)
    ? (rawLang as Lang)
    : "en"

  const titles: Record<Lang, string> = {
    en: "RaygalRoyal NextTech | Frontend Developer",
    sv: "RaygalRoyal NextTech | Frontendutvecklare",
    ar: "رايغال رويال نيكست تيك | مطور واجهات أمامية",
    so: "RaygalRoyal NextTech | Horumariye Frontend",
  }

  const descriptions: Record<Lang, string> = {
    en: "Frontend developer building modern, fast and multilingual websites with React and Next.js.",
    sv: "Frontendutvecklare som bygger moderna, snabba och flerspråkiga webbplatser med React och Next.js.",
    ar: "مطور واجهات أمامية يبني مواقع ويب حديثة وسريعة ومتعددة اللغات باستخدام React و Next.js.",
    so: "Horumariye frontend oo dhisa websaytyo casri ah, degdeg ah oo luuqado badan leh.",
  }

  return {
    title: titles[lang],
    description: descriptions[lang],
  }
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const rawLang = (await params).lang
  const lang: Lang = SUPPORTED_LANGS.includes(rawLang as Lang)
    ? (rawLang as Lang)
    : "en"

  const dir = lang === "ar" ? "rtl" : "ltr"

  return (
    <div className={dir === "rtl" ? "rtl" : "ltr"}>
      <Header lang={lang} />
      <main className="pt-20 bg-gray-200 min-h-screen">
        {children}
      </main>
    </div>
  )
}
