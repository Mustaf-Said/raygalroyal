// app/components/Hero.tsx
import Link from "next/link"
/* import Image from "next/image" */

type HeroProps = {
  t: Record<string, string>
  lang: string
  avatarUrl?: string
}

export default function Hero({ t, lang /* ,avatarUrl */ }: HeroProps) {
  return (
    <section className="max-w-5xl mx-auto text-center py-10 md:py-20">
      <div className="grid md:grid-cols-1 gap-8 items-center">
        <div>
          <h1 className="text-3xl md:text-5xl pt-17 font-extrabold leading-tight">
            {t.hero_title}
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            {t.hero_sub}
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <Link href={`/${lang}#contact`} className="inline-block px-5 py-2 rounded bg-indigo-600 text-white">
              {t.hire_me}
            </Link>
            <Link href={`/${lang}#projects`} className="inline-block px-5 py-2 rounded border">
              {t.view_projects}
            </Link>
          </div>

          <div className="mt-6 text-sm text-slate-500">
            <span><strong>{t.skills_title}</strong>: </span>
            <span className="font-medium">HTML5 · CSS · SCSS · Tailwind · JavaScript · TypeScript · React · Next.js</span>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          {/* <video
            autoPlay
            muted
            loop
            playsInline
            className="relative w-100 h-70 inset-0 object-cover cursor-pointer hover:opacity-80 rounded-xl"
          >
            <source src="/videos/coding.mp4" type="video/mp4" />
          </video> */}
          <div className="absolute rounded-xl overflow-hidden shadow-lg bg-white">
            {/*  {avatarUrl ? (
              // If you have a profile image in public/
              // <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              <Image src={avatarUrl} alt="profile" width={200} height={200} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-600">
                <span className="text-4xl font-bold">RR</span>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </section>
  )
}
