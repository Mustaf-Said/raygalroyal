type ServicesProps = {
  t: Record<string, string>
}

const SERVICES = [
  {
    key: "frontend",
    icon: "💻",
    titleKey: "service_frontend_title",
    descKey: "service_frontend_desc",
  },
  {
    key: "fullstack",
    icon: "🌐",
    titleKey: "service_fullstack_title",
    descKey: "service_fullstack_desc",
  },
  {
    key: "api",
    icon: "🔌",
    titleKey: "service_api_title",
    descKey: "service_api_desc",
  },
]

export default function Services({ t }: ServicesProps) {
  return (
    <section id="services" className="max-w-6xl mx-auto px-6 py-20">
      {/* TITLE */}
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        {t.services_title}
      </h2>

      {/* SUBTITLE */}
      <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
        {t.services_sub}
      </p>

      {/* CARDS */}
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service) => (
          <div
            key={service.key}
            className="rounded-2xl border bg-white dark:bg-zinc-800 p-6 shadow-sm
              hover:shadow-lg hover:-translate-y-1 transition"
          >
            <div className="text-4xl">{service.icon}</div>

            <h3 className="mt-4 text-xl font-semibold">
              {t[service.titleKey]}
            </h3>

            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {t[service.descKey]}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
