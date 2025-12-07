// app/[lang]/layout.tsx
import LanguageSwitcher from "../components/LanguageSwitcher"

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const dir = lang === "ar" ? "rtl" : "ltr"

  // Klient: uppdatera dir/lang så snabbt som möjligt
  const setHtml = `
    document.documentElement.lang = "${lang}";
    document.documentElement.dir = "${dir}";
  `

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: setHtml }} />

      <div className={dir === "rtl" ? "rtl min-h-screen" : "min-h-screen"}>
        <header className="p-4 border-b">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="font-bold">RaygalRoyal NextTech</div>
            <LanguageSwitcher currentLang={lang} />
          </div>
        </header>

        <main>{children}</main>
      </div>
    </>
  )
}
