"use client"

import Link from "next/link"
import { Facebook, Twitter, Linkedin, Github, Mail, Phone, MapPin } from "lucide-react"
import { useLanguage } from "./LanguageProvider"

export default function Footer() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-950 text-white pt-24 pb-12 overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* BRAND */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:rotate-12 transition-transform">
                R
              </div>
              <span className="text-2xl font-bold tracking-tight">
                Raygal<span className="text-blue-600">Royal</span>
              </span>
            </Link>
            <p className="text-gray-400 text-lg leading-relaxed">
              {t.footer.aboutDesc}
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Linkedin, Github].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-xl font-bold mb-8">{t.footer.links}</h3>
            <ul className="space-y-4">
              {[t.nav.home, t.nav.services, t.nav.projects, t.nav.team, t.nav.pricing].map((link) => (
                <li key={link}>
                  <Link href={`#${link.toLowerCase()}`} className="text-gray-400 hover:text-blue-500 transition-colors flex items-center gap-2 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 scale-0 group-hover:scale-100 transition-transform" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SERVICES */}
          <div>
            <h3 className="text-xl font-bold mb-8">{t.nav.services}</h3>
            <ul className="space-y-4">
              {Object.values(t.services.items).map((service) => (
                <li key={service.title}>
                  <Link href="#services" className="text-gray-400 hover:text-blue-500 transition-colors">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT INFO */}
          <div>
            <h3 className="text-xl font-bold mb-8">{t.footer.contact}</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 text-gray-400">
                <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <span>Stockholm, Sweden</span>
              </li>
              <li className="flex items-center gap-4 text-gray-400">
                <Phone className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <span>+46 72 288 95 88</span>
              </li>
              <li className="flex items-center gap-4 text-gray-400">
                <Mail className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <a href="mailto:info@raygalroyal.com" className="hover:text-blue-500 transition-colors">info@raygalroyal.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="pt-12 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-sm">
            © {year} Raygal Royal. {t.footer.rights}
          </p>
          <div className="flex gap-8 text-sm text-gray-500">
            <Link href="/terms" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
