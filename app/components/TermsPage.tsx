"use client"

import { motion } from "framer-motion"
import { useLanguage } from "../components/LanguageProvider"
import { ScrollText, ShieldAlert, FileText, Scale, CreditCard, RefreshCcw, Lock } from "lucide-react"

export default function TermsPage() {
  const { t, language } = useLanguage()

  const sections = [
    {
      key: "scope",
      icon: FileText,
      content: {
        en: {
          title: "Project Scope",
          body: "Every project begins with a detailed discovery session where we define goals, deliverables, timelines, and technical requirements. The agreed scope is documented in a project brief signed by both parties.",
          points: [
            "Any features or pages not listed in the original brief are considered out of scope.",
            "Scope changes requested after development begins are subject to a change order and may affect the timeline and cost.",
            "Raygal Royal reserves the right to decline scope changes that conflict with the technical architecture already in place.",
          ],
        },
        so: {
          title: "Baaxadda Mashruuca",
          body: "Mashruuc kasta wuxuu ku bilaabmaa falanqayn faahfaahsan oo aan ku cayimno yoolalka, waxyaabaha la gaarsiin doono, jadwalka waqtiga, iyo shuruudaha farsamo. Baaxadda la heshiiyay waxaa lagu dukumeentiyaa qorshe mashruuc oo labada dhinac saxiixaan.",
          points: [
            "Astaamaha ama bogaga aan ku jirin qorshaha asalka ah ayaa loo tixgeliyaa mid ka baxsan baaxadda.",
            "Isbedelladda baaxadda ee la codsado ka dib markii horumarku bilaabmo waxay u baahan yihiin amri isbeddel oo laga yaabo inay saameeyaan jadwalka iyo kharashka.",
            "Raygal Royal waxay xaq u leedahay inay diiday isbedelladda baaxadda ee khilaafsan nidaamka farsamo ee hore u jira.",
          ],
        },
      },
    },
    {
      key: "payment",
      icon: CreditCard,
      content: {
        en: {
          title: "Payment Terms",
          body: "To secure your project slot, a 50% deposit is required before any work begins. The remaining 50% is due upon project completion before the final handover of files and credentials.",
          points: [
            "Payments are accepted via bank transfer, Stripe, or other agreed methods.",
            "Invoices not paid within 14 days of the due date may result in work being paused.",
            "For ongoing retainer or maintenance agreements, billing is monthly in advance.",
          ],
        },
        so: {
          title: "Shuruudaha Lacag-bixinta",
          body: "Si aad u xasiliso goobta mashruucaaga, 50% deebaaji ah ayaa loo baahan yahay ka hor inta aan shaqadu bilaamin. 50%-ka hadhay waa in la bixiyaa marka mashruuca dhammaado ka hor inta aan la gaarsiin faylasha iyo xogta sirta ah.",
          points: [
            "Lacag-bixinnada waxaa loo aqbali karaa wareejinta bangiga, Stripe, ama hababka kale ee la heshiiyay.",
            "Qaansheegadaha aan la bixin 14 maalmood gudahood ee taariikhda xagga ka dib laga yaabo inay keenaan hakinta shaqada.",
            "Heshiisyada joogtada ah ee dayactirka, biilasha waa bishii hore.",
          ],
        },
      },
    },
    {
      key: "client",
      icon: Scale,
      content: {
        en: {
          title: "Client Responsibilities",
          body: "A successful project is a collaboration. Clients are expected to actively participate throughout the process to ensure the best outcome.",
          points: [
            "Provide all required content — text, images, logos, and brand assets — within 5 business days of project kickoff.",
            "Assign one primary point of contact to avoid conflicting feedback.",
            "Respond to design or development questions within 3 business days to avoid delays.",
          ],
        },
        so: {
          title: "Mas'uuliyadda Macmiilka",
          body: "Mashruuc guul leh waa kaashato. Macaamiisha waxaa laga filayaa inay si firfircoon uga qaybgalaan hadalka si loo hubiyo natiijooyinka ugu fiican.",
          points: [
            "Ku soo gudbi dhammaan waxyaabaha loo baahan yahay — qoraalka, sawirrada, sumadaha, iyo aaladaha sumadda — 5 maalmood ganacsiga ah gudahood ka dib bilaabmaha mashruuca.",
            "u xil saar hal xiriire ugu muhiimsan si looga fogaado jawaab-celin khilaafsan.",
            "Ka jawaab su'aalaha naqshadaynta ama horumarinta 3 maalmood ganacsiga ah gudahood si looga fogaado dib u dhac.",
          ],
        },
      },
    },
    {
      key: "delivery",
      icon: ShieldAlert,
      content: {
        en: {
          title: "Delivery Expectations",
          body: "We are committed to delivering projects on time and to the highest standard. All timelines are estimated at the start of the project and communicated clearly.",
          points: [
            "Delays caused by late content submission or slow client feedback are not the responsibility of Raygal Royal.",
            "A staging environment will be provided for client review before the final launch.",
            "Final delivery includes source code, credentials, and a handover document.",
          ],
        },
        so: {
          title: "Rajada Keenista",
          body: "Waxaan u heellan nahay in aan mashaarico gaarsiino waqtiga iyo heerka ugu sarreysa. Dhammaan jadwalada waxaa qiyaasaha laga bixiyaa bilowga mashruuca oo si cad loo xiriiriyo.",
          points: [
            "Dib-u-dhacyada ay sababtay gudbinta qaangaarka ee hore ama jawaab-celinta macmiilka ee gaabis ah ma aha mas'uuliyadda Raygal Royal.",
            "Degelka meelaynta ayaa loo diyaarinayaa dib u eegista macmiilka ka hor bilaabmaha ugu dambaysa.",
            "Keenista ugu dambaysa waxaa ku jira koodka isha, xogta sirta ah, iyo dukumeenti wareejin.",
          ],
        },
      },
    },
    {
      key: "refund",
      icon: RefreshCcw,
      content: {
        en: {
          title: "Refund Policy",
          body: "We take pride in our work and stand behind every project we deliver. Refunds are evaluated on a case-by-case basis.",
          points: [
            "The initial 50% deposit is non-refundable once development work has commenced.",
            "If Raygal Royal fails to deliver the agreed scope without valid reason, a partial or full refund may be issued.",
            "Refund requests must be submitted in writing within 7 days of the final delivery date.",
          ],
        },
        so: {
          title: "Siyaasadda Lacag-celinta",
          body: "Waxaan ku faanaa shaqadayada waxaanan ka damaanad qaadnaa mashruuc kasta oo aan gaarsiinno. Lacag-celinnada waxaa lagu qiimeeyaa kiis kasta gaar ahaan.",
          points: [
            "50%-ka deebaajiga asalka ah lama celin karo marka shaqada horumarinta ay bilaabato.",
            "Haddii Raygal Royal ay ku guuldaraysato in ay gaarsiiso baaxadda la heshiiyay sabab aan la aqbali karin, lacag-celin qayb ah ama buuxda ayaa laga yaabaa in la bixiyo.",
            "Codsiyada lacag-celinta waa in qoraal ahaan lagu gudbiyo 7 maalmood gudahood ka dib taariikhda keenista ugu dambaysa.",
          ],
        },
      },
    },
    {
      key: "ip",
      icon: Lock,
      content: {
        en: {
          title: "Intellectual Property",
          body: "Upon receipt of full payment, all custom design and code created specifically for your project is transferred to you. Raygal Royal retains rights to display the work in our portfolio.",
          points: [
            "Third-party libraries, fonts, and plugins remain subject to their own respective licenses.",
            "Raygal Royal retains ownership of any pre-built internal frameworks or tools used in the build.",
            "You may not resell or redistribute the delivered work as a template or product without written consent.",
          ],
        },
        so: {
          title: "Lahaanshaha Aqooneed",
          body: "Marka la helo lacag-bixinta buuxda, dhammaan naqshadaynta gaarka ah iyo koodka lagu abuuray gaar ahaan mashruucaaga ayaa lagugu wareejiyaa. Raygal Royal waxay xajisaa xuquuqda in ay ku muujiso shaqada ku-meel-gaarka ah.",
          points: [
            "Maktabadaha dhinaca saddexaad, noocyada xarfaha, iyo plugins-ka waxay sii joogaan hoos u dgga laysanashooyinkooda gaarka ah.",
            "Raygal Royal waxay xajisaa lahaanshaha dhismayaasha gudaha ah ama qalab lagu isticmaalo dhismaha.",
            "Xuquuq uma lihid inaad dib u iibiso ama baahiso shaqada la gaarsiyay sida qalab ama badeeco oggolaansho qoraal ah la'aanteed.",
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
            <ScrollText className="w-8 h-8" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
            {t.terms.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t.terms.subtitle}
          </p>
        </div>

        <div className="space-y-12">
          {sections.map((section, index) => {
            const Icon = section.icon
            const sectionLang = section.content[lang as keyof typeof section.content]

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
