import type { ReactNode } from "react"

type ArticleSectionProps = {
  id: string
  title: string
  intro?: string
  children: ReactNode
}

export default function ArticleSection({ id, title, intro, children }: ArticleSectionProps) {
  return (
    <section id={id} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-9 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl dark:text-slate-100">{title}</h2>
      {intro ? <p className="mt-3 text-lg leading-8 text-slate-600 dark:text-slate-300">{intro}</p> : null}
      <div className="mt-5 space-y-4 leading-8 text-slate-700 dark:text-slate-300">{children}</div>
    </section>
  )
}