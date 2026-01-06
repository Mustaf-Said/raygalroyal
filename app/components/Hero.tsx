// app/components/Hero.tsx
import Link from "next/link"
import Image from "next/image"

type HeroProps = {
  t: Record<string, string>
  lang: string
}

export default function Hero({ t, lang }: HeroProps) {
  return (
    <section className="relative max-w-6xl mx-auto px-6 pt-24 pb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-7">

        {/* LEFT */}
        <div className="max-w-xl order-2 md:order-1">
          <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold leading-tight">
            {t.hero_title}
          </h1>

          <p className="mt-6 text-lg text-slate-600 dark:text-slate-300">
            {t.hero_sub}
          </p>

          <div className="mt-8 flex gap-4">
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

          <div className="mt-8 text-sm text-slate-500">
            <strong>{t.skills_title}:</strong>{" "}
            HTML5 · CSS · SCSS · Tailwind · JavaScript · TypeScript · React · Next.js
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative flex justify-start md:justify-end order-1 md:order-2">
          <div className="absolute -inset-4 rounded-3xl bg-indigo-100 dark:bg-indigo-950 blur-2xl opacity-60" />

          <Image
            src="/images/profile.jpg"
            alt="Profile photo"
            width={420}
            height={520}
            className="
            relative
            w-64 h-80 md:w-72 md:h-96
            object-cover
            object-[50%_10%]
            rounded-3xl
            shadow-xl
                    "
            priority
          />

        </div>

      </div>
    </section>
  )
}
