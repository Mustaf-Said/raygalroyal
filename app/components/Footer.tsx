"use client"

import Link from "next/link"
import { FacebookIcon, TwitterIcon, LinkedinIcon, GithubIcon, Mail, MapPin, Building2, CreditCard, ShoppingCart } from "lucide-react"
import { useLanguage } from "./LanguageProvider"
import ScrollToTop from "./ScrollToTop"
import Image from "next/image"
import { useState } from "react"
import ContactPopup from "./ContactPopup"

export default function Footer() {
  const { t, language } = useLanguage()
  const [showContactPopup, setShowContactPopup] = useState(false)
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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-gray-800 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">

          {/* BRAND */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div
                className="w-10 h-10  flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-all duration-300 relative overflow-hidden rounded-r-full"
              /*  style={{
                 background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 60%, #c026d3 100%)",
                 boxShadow: "0 0 16px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
                 border: "1px solid rgba(255,255,255,0.15)",
               }} */
              >
                {/*     <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
                style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))" }} 
                  /> */}
                <span className="relative hover:rotate-360 transition-transform z-10">
                  <Image
                    src="/logoB.png"
                    alt="RaygalRoyal logo"
                    width={36}
                    height={36}
                    className="hidden dark:block"
                  />
                  <Image
                    src="/logoW.png"
                    alt="RaygalRoyal logo"
                    width={36}
                    height={36}
                    className="block dark:hidden"
                  />

                </span>
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-500 dark:text-white">
                {language === "ar" ? (
                  <>
                    رايغال <span className="text-blue-600">رويال</span>
                  </>
                ) : (
                  <>
                    Raygal<span className="text-blue-600">Royal</span>
                  </>
                )}
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
              {/* <li className="flex items-start gap-4 text-gray-400">

                <MapPin className="w-6 h-6 text-blue-600 shrink-0" />
                <span>{t.contact.location}</span>
              </li> */}
              <li className="flex items-center gap-4 text-gray-400">
                <Mail className="w-6 h-6 text-blue-600 shrink-0" />
                <button
                  onClick={() => setShowContactPopup(true)}
                  className="hover:text-blue-500 transition-colors text-left"
                >
                  support@raygalroyal.com
                </button>
              </li>
              <li className="flex items-center gap-4 text-gray-400">
                <Link
                  href="https://wa.me/46722889588"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-gray-400 hover:text-green-500 transition-colors">

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{ color: '#25D366' }}
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>{t.contact.mobile}</span>
                </Link>
              </li>
              <li className="flex items-center gap-4 text-gray-400">
                <Mail className="w-6 h-6 text-blue-600 shrink-0" />
                <button
                  onClick={() => setShowContactPopup(true)}
                  className="hover:text-blue-500 transition-colors text-left"
                >
                  jobs@raygalroyal.com
                </button>
              </li>
              <li className="flex items-start gap-4 text-gray-400">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Marklandsgatan+25,+41477+Gothenborg,+Sweden"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 group"
                >
                  <MapPin className="w-6 h-6 text-blue-600 shrink-0 group-hover:text-blue-400 transition-colors" />
                  <span className="group-hover:text-blue-400 transition-colors">{t.contact.location}</span>
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

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-white text-xs font-bold bg-[#635BFF] rounded-xl px-4 py-2.5 shadow-lg shadow-[#635BFF]/30">
              <CreditCard className="w-4 h-4" />
              <span>Stripe</span>
            </div>
            <div className="flex items-center gap-2 text-[#003087] text-xs font-bold bg-[#FFC439] rounded-xl px-4 py-2.5 shadow-lg shadow-[#FFC439]/30">
              <ShoppingCart className="w-4 h-4" />
              <span>PayPal</span>
            </div>
          </div>

          <div className="flex gap-6 text-sm text-gray-500 flex-shrink-0 pr-14">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              {footerLegal.privacy ?? t.footer.privacy}
            </Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">
              {language === "ar" ? "شروط الخدمة" : (footerLegal.terms ?? t.footer.terms)}
            </Link>
            <Link href="/cookies" className="hover:text-white transition-colors">
              {language === "ar" ? "سياسة ملفات تعريف الارتباط" : (footerLegal.cookies ?? t.footer.cookies)}
            </Link>
          </div>
        </div>
      </div>
      <ContactPopup isOpen={showContactPopup} onClose={() => setShowContactPopup(false)} />
    </footer>
  )
}
