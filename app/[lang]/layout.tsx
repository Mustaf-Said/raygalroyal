import type { Metadata } from "next"
import Header from "../components/Header";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: "ar" | "en" | "sv" | "so" }>
}): Promise<Metadata> {
  const { lang } = await params

  const titles = {
    en: "RaygalRoyal NextTech | Frontend Developer",
    sv: "RaygalRoyal NextTech | Frontendutvecklare",
    ar: "رايغال رويال نيكست تيك | مطور واجهات أمامية",
    so: "RaygalRoyal NextTech | Horumariye Frontend",
  }

  const descriptions = {
    en: "Frontend developer building modern, fast and multilingual websites with React and Next.js.",
    sv: "Frontendutvecklare som bygger moderna, snabba och flerspråkiga webbplatser med React och Next.js.",
    ar: "مطور واجهات أمامية يبني مواقع ويب حديثة وسريعة ومتعددة اللغات باستخدام React و Next.js.",
    so: "Horumariye frontend oo dhisa websaytyo casri ah, degdeg ah oo luuqado badan leh.",
  }

  return {
    title: titles[lang],
    description: descriptions[lang],

    alternates: {
      canonical: `/${lang}`,
      languages: {
        en: "/en",
        sv: "/sv",
        ar: "/ar",
        so: "/so",
      },
    },

    openGraph: {
      title: titles[lang],
      description: descriptions[lang],
      url: `https://yourdomain.com/${lang}`,
      siteName: "RaygalRoyal NextTech",
      locale: lang,
      type: "website",
    },

    icons: {
      icon: "/favicon.ico",
    },
  }
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: "ar" | "en" | "sv" | "so" }>;
}) {
  const { lang } = await params;
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <div className={`${dir === "rtl" ? "rtl" : "ltr"}`}>
      <Header lang={lang} />
      <main className="pt-20 bg-gray-200 min-h-screen">{children}</main>
    </div>
  );
}
