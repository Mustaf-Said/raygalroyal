"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Target, Users, Award } from "lucide-react"

export default function AboutPage() {
  const values = [
    { icon: ShieldCheck, title: "Excellence", desc: "We deliver only the highest quality digital products." },
    { icon: Target, title: "Innovation", desc: "Staying ahead of tech trends to give you the edge." },
    { icon: Users, title: "Collaboration", desc: "Your vision, our expertise, one successful team." },
    { icon: Award, title: "Integrity", desc: "Transparent processes and honest communication." },
  ]

  return (
    <section className="py-32 bg-white dark:bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wider text-blue-600 uppercase bg-blue-50 dark:bg-blue-900/30 rounded-full">
              Our Agency
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-8 leading-tight">
              About <span className="text-blue-600">Raygal Royal</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              Raygal Royal is a modern digital solutions agency based in Sweden. We specialize in building high-performance, scalable, and visually stunning web and mobile applications for global businesses.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              Our mission is to empower businesses with cutting-edge technology and exceptional design, ensuring they stay ahead in the rapidly evolving digital landscape.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-2 gap-6"
          >
            {values.map((value, i) => (
              <div key={i} className="p-8 bg-gray-50 dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800 hover:border-blue-500/50 transition-all">
                <value.icon className="w-10 h-10 text-blue-600 mb-6" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                <p className="text-sm text-gray-500">{value.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* MISSION SECTION */}
        <div className="bg-blue-600 rounded-[60px] p-12 md:p-24 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black mb-10">Crafting Digital Success Stories</h2>
            <p className="text-xl text-blue-100 mb-12">
              We don&apos;t just build websites; we create digital experiences that drive growth, engage users, and leave a lasting impression. From startups to enterprises, we help you navigate the future.
            </p>
            <div className="flex flex-wrap justify-center gap-12">
              <div className="text-center">
                <div className="text-5xl font-black mb-2">5+</div>
                <div className="text-blue-200 uppercase tracking-widest text-sm font-bold">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-black mb-2">150+</div>
                <div className="text-blue-200 uppercase tracking-widest text-sm font-bold">Projects Done</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-black mb-2">100%</div>
                <div className="text-blue-200 uppercase tracking-widest text-sm font-bold">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
