import Header from "../components/Header"

type ValidLanguage = "ar" | "en" | "sv" | "so"
type LangParams = Promise<{ lang: ValidLanguage }>

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: LangParams
}) {
  const { lang } = await params
  const dir = lang === "ar" ? "rtl" : "ltr"

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.documentElement.lang="${lang}";
            document.documentElement.dir="${dir}";
          `,
        }}
      />

      <div className={dir === "rtl" ? "rtl min-h-screen" : "min-h-screen"}>
        <Header lang={lang} />
        <main className="pt-20">{children}</main>
      </div>
    </>
  )
}
