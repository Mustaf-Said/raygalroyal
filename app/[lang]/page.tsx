export default async function LangPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/locales/${lang}.json`
  const res = await fetch(url, { cache: "no-store" })
  const translations = await res.json()

  return (
    <main className="flex min-h-screen items-center justify-center flex-col">
      <h1 className="text-3xl font-bold">{translations.hero_title}</h1>
      <p className="text-gray-600">{translations.hero_sub}</p>
    </main>
  )
}
