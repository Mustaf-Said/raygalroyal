import { ReactNode } from "react"
import Link from "next/link"

type BlogLayoutProps = {
  title: string
  subtitle: string
  published: string
  updated: string
  readTime: string
  children: ReactNode
  labels?: {
    home?: string
    recommendedTools?: string
    published?: string
    updated?: string
    footerNote?: string
  }
}

export default function BlogLayout({
  title,
  subtitle,
  published,
  updated,
  readTime,
  children,
  labels,
}: BlogLayoutProps) {
  const homeLabel = labels?.home ?? "Home"
  const recommendedToolsLabel = labels?.recommendedTools ?? "Recommended Tools"
  const publishedLabel = labels?.published ?? "Published"
  const updatedLabel = labels?.updated ?? "Updated"
  const footerNote = labels?.footerNote ??
    "This content is for educational purposes and reflects editorial research by Raygal Royal. Verify pricing, terms, and legal requirements on each provider website before purchase."

  return (
    <main className="relative overflow-hidden bg-slate-50 py-14 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-linear-to-b from-cyan-100 via-sky-100/80 to-transparent dark:from-cyan-950/40 dark:via-sky-950/30" />

      <div className="relative mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <nav className="mb-6 text-sm text-slate-600 dark:text-slate-300">
          <Link href="/" className="hover:text-sky-600 dark:hover:text-sky-400">
            {homeLabel}
          </Link>
          <span className="mx-2">/</span>
          <Link href="/recommended-tools" className="hover:text-sky-600 dark:hover:text-sky-400">
            {recommendedToolsLabel}
          </Link>
        </nav>

        <header className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10 dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-3xl font-black tracking-tight md:text-4xl">{title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">{subtitle}</p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
            <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">{publishedLabel}: {published}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">{updatedLabel}: {updated}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">{readTime}</span>
          </div>
        </header>

        <article className="mt-8 space-y-7">{children}</article>

        <footer className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <p>{footerNote}</p>
        </footer>
      </div>
    </main>
  )
}
