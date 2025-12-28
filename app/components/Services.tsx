import { FaCode, FaGlobe, FaPlug } from "react-icons/fa"
const SERVICES = [
  {
    key: "frontend",
    icon: FaCode,
    titleKey: "service_frontend_title",
    descKey: "service_frontend_desc",
    image: "/images/service/1.avif"
  },
  {
    key: "fullstack",
    icon: FaGlobe,
    titleKey: "service_fullstack_title",
    descKey: "service_fullstack_desc",
    image: "/images/service/3.avif"
  },
  {
    key: "api",
    icon: FaPlug,
    titleKey: "service_api_title",
    descKey: "service_api_desc",
    image: "/images/service/2.avif"
  },
]

type ServicesProps = {
  t: Record<string, string>
}

export default function Services({ t }: ServicesProps) {
  return (
    <section id="services" className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        {t.services_title}
      </h2>

      <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
        {t.services_sub}
      </p>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service) => {
          const Icon = service.icon

          return (
            <div
              key={service.key}
              className="group relative h-[380px] perspective"
            >
              {/* CARD */}
              <div
                className="relative h-full w-full rounded-2xl
                transition-transform duration-700
                transform-style-preserve-3d
                group-hover:rotate-y-180"
              >
                {/* FRONT */}
                <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden">
                  <div
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${service.image})` }}
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-end p-6">
                    <h3 className="text-xl font-semibold text-white">
                      {t[service.titleKey]}
                    </h3>
                  </div>
                </div>

                {/* BACK */}
                <div className="absolute inset-0 backface-hidden rotate-y-180
                  rounded-2xl bg-zinc-900 text-white p-6
                  flex flex-col justify-center"
                >
                  <Icon className="text-4xl mb-4 text-indigo-400" />

                  <h3 className="text-xl font-semibold">
                    {t[service.titleKey]}
                  </h3>

                  <p className="mt-3 text-sm text-gray-300">
                    {t[service.descKey]}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

