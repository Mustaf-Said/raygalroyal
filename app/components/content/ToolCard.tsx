type ToolCardProps = {
  name: string
  website: string
  category: string
  description: string
  bestFor: string
  pricing: string
  affiliate?: boolean
  labels?: {
    bestFor?: string
    pricing?: string
    visit?: string
    affiliate?: string
  }
}

export default function ToolCard({
  name,
  website,
  category,
  description,
  bestFor,
  pricing,
  affiliate = false,
  labels,
}: ToolCardProps) {
  const bestForLabel = labels?.bestFor ?? "Best for"
  const pricingLabel = labels?.pricing ?? "Typical pricing"
  const visitLabel = labels?.visit ?? "Visit"
  const affiliateLabel = labels?.affiliate ?? "Affiliate Partner"

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {category}
        </span>
        {affiliate ? (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:bg-amber-900/40 dark:text-amber-200">
            {affiliateLabel}
          </span>
        ) : null}
      </div>

      <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-slate-100">{name}</h3>
      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{description}</p>

      <div className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
        <p>
          <span className="font-semibold">{bestForLabel}:</span> {bestFor}
        </p>
        <p>
          <span className="font-semibold">{pricingLabel}:</span> {pricing}
        </p>
      </div>

      <a
        href={website}
        target="_blank"
        rel={affiliate ? "noopener noreferrer nofollow sponsored" : "noopener noreferrer nofollow"}
        className="mt-5 inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-sky-700 dark:bg-sky-600 dark:group-hover:bg-sky-500"
      >
        {visitLabel} {name}
      </a>
    </article>
  )
}
