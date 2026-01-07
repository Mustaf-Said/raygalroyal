// app/components/Hero.tsx
import Link from "next/link"
import Image from "next/image"

type HeroProps = {
  t: Record<string, string>
  lang: string
}

export default function Hero({ t, lang }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gray-100 dark:bg-slate-950">

      {/* Mobile background image */}
      <div
        className="
          absolute inset-0
          bg-[url('/images/profile.jpg')]
          bg-cover
          bg-top
          opacity-20
          md:hidden
        "
      />

      {/* Mobile overlay */}
      <div className="absolute inset-0 bg-white/80 dark:bg-slate-950/80 md:hidden" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-7">

          {/* TEXT */}
          <div className="max-w-xl order-2 md:order-1">
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold leading-tight">
              {t.hero_title}
            </h1>

            <p className="mt-6 text-lg text-slate-600 dark:text-slate-300">
              {t.hero_sub}
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <Link
                href={`/${lang}#contact`}
                className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
              >
                {t.hire_me}
              </Link>

              <Link
                href={`/${lang}#projects`}
                className="px-6 py-3 rounded-lg border font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {t.view_projects}
              </Link>
            </div>

            <div className="mt-6 text-sm text-slate-500">
              <strong>{t.skills_title}:</strong>{" "}
              HTML5 · CSS · SCSS · Tailwind · JavaScript · TypeScript · React · Next.js
            </div>
          </div>

          {/* IMAGE (desktop only) */}
          <div className="hidden md:flex justify-end order-1 md:order-2">
            <Image
              src="/images/profile.jpg"
              alt="Profile photo"
              width={420}
              height={520}
              className="
                w-72 h-96
                object-cover
                object-[50%_7%]
                rounded-3xl
                shadow-xl
              "
              priority
            />
          </div>

        </div>
      </div>
    </section>
  )
}
