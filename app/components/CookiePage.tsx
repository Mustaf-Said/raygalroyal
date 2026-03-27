"use client"

import { motion } from "framer-motion"
import { useLanguage } from "../components/LanguageProvider"
import { Cookie, Settings2, BarChart2, Target, ToggleLeft, AlertCircle } from "lucide-react"

export default function CookiePage() {
  const { t, language } = useLanguage()

  const sections = [
    {
      key: "whatAreCookies",
      icon: Cookie,
      content: {
        en: {
          title: "What Are Cookies?",
          body: "Cookies are small text files that are stored on your device when you visit our website. They allow the site to remember your preferences and understand how you interact with our pages.",
          points: [
            "Cookies do not contain viruses or harmful software — they are simple data files.",
            "Some cookies are deleted when you close your browser (session cookies), while others remain for a set period (persistent cookies).",
            "You can view and manage cookies stored on your device through your browser settings.",
          ],
        },
        so: {
          title: "Maxaa Ah Cookie-yada?",
          body: "Cookie-yadu waa faylal qoraal ah oo yar oo lagu kaydiyay qalabkaaga marka aad booqato websaytkeena. Waxay u oggolaanaysaa goobta in ay xasuusato doorashadaada oo ay fahanto sida aad ula falgashay bogaggeena.",
          points: [
            "Cookie-yadu ma koontaynaysaan fayrasyada ama software-ka waxyeelada leh — waa faylal xog oo fudud.",
            "Qaar ka mid ah cookie-yada waxaa la tirtirayaa marka aad xiddo browser-kaaga (session cookies), halka kuwa kale ay sii joogaan muddo go'an (persistent cookies).",
            "Waxaad arag oo maareyn kartaa cookie-yada lagu kaydiyay qalabkaaga iyada oo loo marayo dejintayaasha browser-kaaga.",
          ],
        },
      },
    },
    {
      key: "necessary",
      icon: Settings2,
      content: {
        en: {
          title: "Necessary Cookies",
          body: "These cookies are essential for the website to function correctly. Without them, core features such as navigation, forms, and secure areas would not work.",
          points: [
            "Session management cookies that keep you logged in during your visit.",
            "Security tokens that protect against cross-site request forgery (CSRF).",
            "These cookies cannot be disabled as they are required for basic site functionality.",
          ],
        },
        so: {
          title: "Cookie-yada Lagama Maarmaan ah",
          body: "Cookie-yadan waa muhiim si websaytu u shaqayso si sax ah. Iyaga la'aantood, astaamaha xudunta ah sida is-maariyaha, foomamka, iyo meelaha ammaan ah ma shaqayn doonaan.",
          points: [
            "Cookie-yada maareynta xilliga ee kaa haysa gudaha booqashadaada.",
            "Calaamadaha ammaanka ee ka ilaaliya codsiga dhinaca ka-hortagga ee goobta (CSRF).",
            "Cookie-yadan lama xannibi karo maadaama ay loo baahan yihiin shaqaynta aasaasiga ah ee goobta.",
          ],
        },
      },
    },
    {
      key: "analytics",
      icon: BarChart2,
      content: {
        en: {
          title: "Analytics Cookies",
          body: "We use analytics cookies to understand how visitors navigate our website, which pages are most popular, and where we can improve the experience.",
          points: [
            "We use tools such as Google Analytics to collect anonymised usage data.",
            "No personally identifiable information is stored in analytics cookies.",
            "You can opt out of analytics tracking by adjusting your cookie preferences or using browser extensions.",
          ],
        },
        so: {
          title: "Cookie-yada Falanqaynta",
          body: "Waxaan isticmaalnaa cookie-yada falanqaynta si aan u fahanno sida booqdayaashu u maariyaan websaytkeena, bogagga ugu caaansan, iyo meelaha aan ku hagaajin karno khibradda.",
          points: [
            "Waxaan isticmaalnaa qalab sida Google Analytics si aan u aruurino xogta isticmaalka ee magac-la'aanta.",
            "Macluumaad shakhsi lagu garan karo kuma kaydin cookie-yada falanqaynta.",
            "Waxaad ka bixin kartaa raadraaca falanqaynta adiga oo hagaajinaya doorashadaada cookie-ga ama adeegsanaya kordhinnada browser-ka.",
          ],
        },
      },
    },
    {
      key: "marketing",
      icon: Target,
      content: {
        en: {
          title: "Marketing Cookies",
          body: "Marketing cookies may be used to show you relevant content or services based on your interests. Raygal Royal does not currently run paid advertising campaigns but may use these in the future.",
          points: [
            "These cookies track your browsing activity across websites to deliver targeted content.",
            "We will always ask for your consent before activating any marketing cookies.",
            "You can withdraw your consent at any time through your cookie preferences.",
          ],
        },
        so: {
          title: "Cookie-yada Suuq-geynta",
          body: "Cookie-yada suuq-geynta laga yaabaa in loo isticmaalo in lagugu tuso nuxurka ama adeegyada ku habboon xiisahaaga. Raygal Royal hadda ma socodsiin ololaynta xayeysiinta lacagta leh laakiin laga yaabaa inay isticmaali doonaan mustaqbalka.",
          points: [
            "Cookie-yadan waxay raad-raacaan hawsha daawashadaada websaytka oo dhan si loo gaarsiiyo nuxurka bartilmaameedka.",
            "Weligeen oggolaansho ayaannu ka doonayaa ka hor intaanaan firfircoonayn cookie-yada suuq-geynta.",
            "Waxaad ka saarayaan oggolaanshahaaga waqti kasta iyada oo loo marayo doorashadaada cookie-ga.",
          ],
        },
      },
    },
    {
      key: "managing",
      icon: ToggleLeft,
      content: {
        en: {
          title: "Managing Your Preferences",
          body: "You are in control of which cookies you accept. You can change your cookie preferences at any time without affecting your ability to use our core services.",
          points: [
            "Use your browser settings to block or delete cookies — instructions vary by browser (Chrome, Firefox, Safari, Edge).",
            "Blocking all cookies may affect some functionality of our website such as form submissions.",
            "To update your preferences on our site, look for the cookie settings option in the footer.",
          ],
        },
        so: {
          title: "Maareynta Doorashadaada",
          body: "Adiga ayaa xukuma cookie-yada aad aqbasho. Waxaad bedeli kartaa doorashadaada cookie-ga waqti kasta iyada oo aan saameyn lahayn kartidaada isticmaalka adeegyadayada xudunta ah.",
          points: [
            "Isticmaal dejintayaasha browser-kaaga si aad u xannibto ama tirirto cookie-yada — tilmaamaha waxay kala duwan yihiin browser-ka (Chrome, Firefox, Safari, Edge).",
            "Xannibaadda dhammaan cookie-yada laga yaabaa inay saameeyaan qaar ka mid ah shaqaynta websaytkeena sida gudbinta foomka.",
            "Si aad u cusboonaysiiso doorashadaada goobteena, raadinso ikhtiyaarka dejintayaasha cookie-ga ee cagaha.",
          ],
        },
      },
    },
    {
      key: "updates",
      icon: AlertCircle,
      content: {
        en: {
          title: "Policy Updates",
          body: "We may update this Cookie Policy from time to time as our services evolve or regulations change. We encourage you to review this page periodically.",
          points: [
            "Significant changes will be communicated via a notice on our website or by email.",
            "The date at the top of this page will always reflect when the policy was last revised.",
            "Continued use of our website after changes are posted constitutes your acceptance of the updated policy.",
          ],
        },
        so: {
          title: "Cusbooneysiinta Siyaasadda",
          body: "Waxaan laga yaabaa in aan cusboonaysiino Siyaasadda Cookie-ga ee wakhti ka wakhti ahaan marka adeegyadayadu horumaraan ama xeerarka isbeddelaan. Waxaan ku dhiirigelinayaa in aad mar mar dib u eegto boggan.",
          points: [
            "Isbedelladda muhiimka ah waxaa loo xiriirin doonaa iyada oo loo marayo ogeysiis goobteena ama iimaylka.",
            "Taariikhda sare ee boggan had iyo jeer waxay muujin doontaa markii ugu dambeysay siyaasadda la dib u eegay.",
            "Sii isticmaalka websaytkeena ka dib marka isbedelladdu la daabacaan waxay mataashaa oggolaanshahaaga siyaasadda la cusboonaysiiyay.",
          ],
        },
      },
    },
  ]

  const lang = (language === "so" ? "so" : "en") as "en" | "so"

  return (
    <section className="py-32 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6"
          >
            <Cookie className="w-8 h-8" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
            {t.cookie.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t.cookie.subtitle}
          </p>
        </div>

        <div className="space-y-12">
          {sections.map((section, index) => {
            const Icon = section.icon
            const sectionLang = section.content[lang]

            return (
              <motion.div
                key={section.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 p-8 md:p-10 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {sectionLang.title}
                  </h2>
                </div>
                <div className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  <p className="mb-4">{sectionLang.body}</p>
                  <ul className="list-disc pl-5 space-y-2">
                    {sectionLang.points.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
