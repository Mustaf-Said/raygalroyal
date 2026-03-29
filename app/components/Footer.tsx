"use client"

import Link from "next/link"
import { FacebookIcon, TwitterIcon, LinkedinIcon, GithubIcon, Mail, Phone, MapPin } from "lucide-react"
import { useLanguage } from "./LanguageProvider"
import ScrollToTop from "./ScrollToTop"

export default function Footer() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()
  const footerLegal = t.footer as typeof t.footer & {
    privacy?: string
    terms?: string
    cookies?: string
  }

  // ✅ Inside component to access `t`
  const quickLinks = [
    { label: t.nav.home, href: "/" },
    { label: t.nav.services, href: "/services" },
    { label: t.nav.projects, href: "/projects" },
    { label: t.nav.team, href: "/team" },
    { label: t.nav.pricing, href: "/pricing" },
  ]

  const socialLinks = [
    { Icon: FacebookIcon, href: "https://www.facebook.com/mustfa99/", label: "Facebook" },
    { Icon: TwitterIcon, href: "https://x.com/MR4273083817955", label: "Twitter/X" },
    { Icon: LinkedinIcon, href: "https://www.linkedin.com/in/mustafa-said-b6b164198/", label: "LinkedIn" },
    { Icon: GithubIcon, href: "https://github.com/Mustaf-Said", label: "GitHub" },
  ]

  return (
    <footer className="bg-gray-950 text-white pt-24 pb-12 overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">

          {/* BRAND */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-all duration-300 relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 60%, #c026d3 100%)",
                  boxShadow: "0 0 16px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
                  style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))" }}
                />
                <span className="relative hover:rotate-360 transition-transform z-10">R</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">
                Raygal<span className="text-blue-600">Royal</span>
              </span>
            </Link>

            <p className="text-gray-400 text-lg leading-relaxed">
              {t.footer.aboutDesc}
            </p>

            {/* ✅ Real social links */}
            <div className="flex gap-4">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* ✅ Quick Links — translated + real routes */}
          <div>
            <h3 className="text-xl font-bold mb-8">{t.footer.links}</h3>
            <ul className="space-y-4">
              {quickLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-gray-400 hover:text-blue-500 transition-colors flex items-center gap-2 group"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 scale-0 group-hover:scale-100 transition-transform" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ✅ Services — translated titles + real route */}
          <div>
            <h3 className="text-xl font-bold mb-8">{t.nav.services}</h3>
            <ul className="space-y-4">
              {Object.values(t.services.items).map((service) => (
                <li key={service.title}>
                  <Link
                    href="/services"
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                  >
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
                <span>{t.contact.location}</span>
              </li>
              <li className="flex items-center gap-4 text-gray-400">
                <Phone className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <span>+46 72 288 95 88</span>
              </li>
              <li className="flex items-center gap-4 text-gray-400">
                <Mail className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <a
                  href="mailto:info@raygalroyal.com"
                  className="hover:text-blue-500 transition-colors"
                >
                  info@raygalroyal.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <ScrollToTop />
        {/* BOTTOM */}
        <div className="pt-12 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-sm">
            © {year} Raygal Royal. {t.footer.rights}
          </p>
          <div className="flex gap-8 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors">
              {footerLegal.privacy ?? t.footer.privacy}
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              {footerLegal.terms ?? t.footer.terms}
            </Link>
            <Link href="/cookies" className="hover:text-white transition-colors">
              {footerLegal.cookies ?? t.footer.cookies}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
