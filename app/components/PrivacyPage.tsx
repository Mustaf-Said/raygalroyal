"use client"

import { motion } from "framer-motion"
import { useLanguage } from "../components/LanguageProvider"
import { ShieldCheck, Eye, Database, Share2, UserCheck, Trash2, Globe } from "lucide-react"

export default function PrivacyPage() {
  const { t, language } = useLanguage()

  const sections = [
    {
      key: "collection",
      icon: Database,
      content: {
        en: {
          title: "Data We Collect",
          body: "When you contact us, place an order, or use our website, we may collect certain personal information to provide you with our services effectively.",
          points: [
            "Name, email address, and phone number submitted through our contact or order forms.",
            "Project details and files you upload when starting a project with us.",
            "Technical data such as IP address, browser type, and pages visited — collected automatically via cookies.",
          ],
        },
        so: {
          title: "Xogta Aan Aruurino",
          body: "Marka aad nala xiriirto, dalbo, ama isticmaasho websaytkeena, waxaan laga yaabaa in aan aruurino macluumaad shakhsi ah si aan kuugu bixino adeegyadayada si waxtar leh.",
          points: [
            "Magaca, cinwaanka iimaylka, iyo lambarka telefoonka ee lagu gudbiyay foomamka xiriirka ama dalabka.",
            "Faahfaahinta mashruuca iyo faylasha aad soo geliso marka aad naga bilaabayso mashruuc.",
            "Xogta farsamada sida ciwaanka IP, nooca browser-ka, iyo bogagga la booqday — si otomaatig ah loo aruuriyaa cookies-ka.",
          ],
        },
      },
    },
    {
      key: "usage",
      icon: Eye,
      content: {
        en: {
          title: "How We Use Your Data",
          body: "Your data is used solely to deliver and improve our services. We do not use your personal information for purposes beyond what is described here.",
          points: [
            "To communicate with you about your project, quote, or support request.",
            "To process payments and send invoices securely.",
            "To improve our website and understand which services are most relevant to our visitors.",
          ],
        },
        so: {
          title: "Sida Aan Xogta Ugu Isticmaalno",
          body: "Xogta shakhsigaagu waxaa loo isticmaalaa oo keliya in lagu gaarsiiyo oo lagu hagaajiyo adeegyadayada. Macluumaadkaaga shakhsiga ah kuma isticmaalnayno ujeeddooyin ka baxsan waxa halkan lagu sharaxay.",
          points: [
            "Si aan kaula xiriirno mashruucaaga, qiimaha, ama codsiga taageerada.",
            "Si loo maaro lacag-bixinnada oo si ammaan ah loo diro qaansheegadaha.",
            "Si aan u hagaajiino websaytkeena oo aan u fahanno adeegyada ugu muhiimsan booqdayaasheena.",
          ],
        },
      },
    },
    {
      key: "sharing",
      icon: Share2,
      content: {
        en: {
          title: "Data Sharing & Third Parties",
          body: "Raygal Royal does not sell, trade, or rent your personal data. We only share data with trusted third-party tools required to operate our business.",
          points: [
            "Payment processors such as Stripe to handle transactions securely.",
            "Email providers to send project updates and invoices.",
            "All third-party tools we use are GDPR-compliant and bound by data processing agreements.",
          ],
        },
        so: {
          title: "Wadaagga Xogta & Dhinacyada Saddexaad",
          body: "Raygal Royal ma iibiso, ma ganacsato, ama ma kirayso xogta shakhsigaaga. Xogta oo keliya ayaanu wadaagnaa qalab dhinac saddexaad oo la aamin karo oo loo baahan yahay si loo maareeyo ganacsigayaga.",
          points: [
            "Maarayaasha lacag-bixinta sida Stripe si loo maareeyo macaamilada si ammaan ah.",
            "Bixiyeyaasha iimaylka si loo diro cusbooneysiinta mashruuca iyo qaansheegadaha.",
            "Dhammaan qalab dhinaca saddexaad ee aan isticmaalno waa GDPR-ku waafaqsan oo ku xidhan heshiisyada habaynta xogta.",
          ],
        },
      },
    },
    {
      key: "rights",
      icon: UserCheck,
      content: {
        en: {
          title: "Your Rights",
          body: "You have full rights over your personal data at all times. Raygal Royal respects and upholds these rights in accordance with GDPR and applicable privacy laws.",
          points: [
            "Right to access — you can request a copy of all data we hold about you.",
            "Right to rectification — you can ask us to correct inaccurate information.",
            "Right to erasure — you can request that we delete your data from our systems at any time.",
          ],
        },
        so: {
          title: "Xuquuqdaada",
          body: "Waxaad xaq buuxda u leedahay xogta shakhsigaaga waqti kasta. Raygal Royal waxay xurmeysaa oo xajisaa xuquuqahan sida GDPR iyo sharciyadda asturnaanta ee xukumaysa.",
          points: [
            "Xaqa helitaanka — waxaad codsanaysaa nuqul dhammaan xogta aan ku hayno adiga ku saabsan.",
            "Xaqa saxitaanka — waxaad naga codsan kartaa in aan saxno macluumaadka khaldan.",
            "Xaqa tirtirka — waxaad codsanaysaa in aan xogta kasaarid nidaamyadayada waqti kasta.",
          ],
        },
      },
    },
    {
      key: "retention",
      icon: Trash2,
      content: {
        en: {
          title: "Data Retention",
          body: "We only keep your personal data for as long as necessary to fulfil the purpose it was collected for, or as required by law.",
          points: [
            "Project and client records are retained for up to 3 years for accounting and legal purposes.",
            "Contact form submissions are deleted after 12 months if no project was initiated.",
            "You can request early deletion of your data at any time by emailing info@raygalroyal.com.",
          ],
        },
        so: {
          title: "Kayditaanka Xogta",
          body: "Xogta shakhsigaaga oo keliya ayaanu haynnaa muddada lagama maarmaan ah si loo buuxiyo ujeedada ay loogu aruuriyay, ama sida sharciga loo baahan yahay.",
          points: [
            "Diiwaannaadka mashruuca iyo macmiilka waxaa lagu hayaa ilaa 3 sano si loo gudbo xisaabaadka iyo ujeeddooyinka sharci.",
            "Gudbinnada foomka xiriirka waxaa la tirtirayaa ka dib 12 bilood haddaan mashruuc la bilaabin.",
            "Waxaad codsanaysaa tirtirka hore ee xogta marka kasta adiga oo iimaylka u diraya info@raygalroyal.com.",
          ],
        },
      },
    },
    {
      key: "international",
      icon: Globe,
      content: {
        en: {
          title: "International Transfers",
          body: "Raygal Royal operates from Gothenburg, Sweden, and serves clients globally. Where data is transferred outside the EU/EEA, we ensure adequate protections are in place.",
          points: [
            "We use Standard Contractual Clauses approved by the European Commission where required.",
            "Cloud services and tools we use are hosted in EU-based data centres where possible.",
            "You will be informed if your data is transferred to a country outside the EU/EEA.",
          ],
        },
        so: {
          title: "Wareejinta Caalamiga ah",
          body: "Raygal Royal waxay ka shaqaysaa Gothenburg, Sweden, oo adeegaysa macaamiisha adduunka oo dhan. Marka xogta laga wareejiyaa EU/EEA dibadda, waxaan hubinaa in ilaalintu ku filan tahay.",
          points: [
            "Waxaan isticmaalnaa Cutubbyada Heshiiska Caadiga ah ee Gudiga Yurub u ogolaadey marka loo baahan yahay.",
            "Adeegyada daruuriga ah iyo qalab aan isticmaalno waxaa lagu martigeliyaa xarunaha xogta ee ku yaal EU haddii suurtowdo.",
            "Waxaa lagugu xog-ogalayn doonaa haddii xogta lagaa wareejiyaa dal ka baxsan EU/EEA.",
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
            <ShieldCheck className="w-8 h-8" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
            {t.privacy.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t.privacy.subtitle}
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
