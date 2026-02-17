"use client"
import { useState } from "react"
import { FaCode, FaGlobe, FaPlug } from "react-icons/fa"
import { useLanguage } from "./LanguageProvider"

const SERVICES = [
  {
    key: "frontend",
    icon: FaCode,
    image: "/images/service/1.avif"
  },
  {
    key: "fullstack",
    icon: FaGlobe,
    image: "/images/service/3.avif"
  },
  {
    key: "api",
    icon: FaPlug,
    image: "/images/service/2.avif"
  },
] as const

export default function Services() {
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const { t } = useLanguage()


  return (
    <section id="services" className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        {t.services.title}
      </h2>

      <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
        {t.services.subtitle}
      </p>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
      >
        {SERVICES.map((service) => {
          const Icon = service.icon
          const serviceText = t.services.items[service.key]

          return (
            <div
              key={service.key}
              className="group relative h-[380px] perspective"
            >
              {/* CARD */}
              <div
                onClick={() =>
                  setActiveKey(activeKey === service.key ? null : service.key)
                }
                className={`relative h-full w-full rounded-2xl
                transition-transform duration-700
                transform-style-preserve-3d
                group-hover:rotate-y-180
                ${activeKey === service.key ? "rotate-y-180" : ""}`}
              >
                {/* FRONT */}
                <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden">
                  <div
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${service.image})` }}
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-end p-6"
                  >
                    <h3 className="text-xl font-semibold text-white">
                      {serviceText.title}
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
                    {serviceText.title}
                  </h3>

                  <p className="mt-3 text-sm text-gray-300">
                    {serviceText.desc}
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

