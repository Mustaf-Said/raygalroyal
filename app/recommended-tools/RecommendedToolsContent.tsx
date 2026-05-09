"use client"

import Link from "next/link"
import type { Language } from "@/locales"
import { useLanguage } from "@/app/components/LanguageProvider"
import ToolCard from "@/app/components/content/ToolCard"
import ArticleSection from "@/app/components/content/ArticleSection"

type Tool = {
  name: string
  website: string
  category: string
  description: string
  bestFor: string
  pricing: string
  affiliate?: boolean
}

type ToolsPageCopy = {
  eyebrow: string
  title: string
  intro: string
  disclosure: string
  labels: {
    bestFor: string
    pricing: string
    visit: string
    affiliate: string
  }
  sections: {
    domain: {
      title: string
      intro: string
      tools: Tool[]
    }
    hosting: {
      title: string
      intro: string
      tools: Tool[]
    }
    development: {
      title: string
      intro: string
      tools: Tool[]
    }
    automation: {
      title: string
      intro: string
      tools: Tool[]
    }
  }
  closingTitle: string
  closingText: string
}

const copyByLang: Record<Language, ToolsPageCopy> = {
  en: {
    eyebrow: "Editorial Picks",
    title: "Recommended Tools for Building and Growing Online Businesses",
    intro:
      "This page curates the platforms we consistently recommend to clients and internal teams. We focus on tools that are reliable, easy to maintain, and scalable for startups, freelancers, and growing agencies. Selection criteria include support quality, pricing transparency, security posture, and integration compatibility with modern workflows.",
    disclosure:
      "Some links on this page may be affiliate links. If you purchase through those links, Raygal Royal may earn a commission at no additional cost to you.",
    labels: {
      bestFor: "Best for",
      pricing: "Typical pricing",
      visit: "Visit",
      affiliate: "Affiliate Partner",
    },
    sections: {
      domain: {
        title: "Domain Registrars",
        intro:
          "Choosing the right registrar impacts security, renewal cost, DNS control, and migration speed. We prioritize registrars that offer clear pricing and strong account protection.",
        tools: [
          {
            name: "Namecheap",
            website: "https://www.namecheap.com",
            category: "Domain Registrar",
            description:
              "Namecheap is a strong default for founders who need competitive first-year pricing, straightforward DNS management, and a clean dashboard for domain portfolio handling.",
            bestFor: "Startups, freelancers, and small agencies that want fast setup",
            pricing: "Varies by TLD; often competitive promo pricing on first-year registration",
            affiliate: true,
          },
          {
            name: "Cloudflare Registrar",
            website: "https://www.cloudflare.com/products/registrar/",
            category: "Domain Registrar",
            description:
              "Cloudflare Registrar sells domains near wholesale cost and integrates tightly with Cloudflare DNS, SSL, and security tooling for performance-focused teams.",
            bestFor: "Technical teams already using Cloudflare ecosystem services",
            pricing: "Near wholesale pricing with no traditional markup",
          },
        ],
      },
      hosting: {
        title: "Hosting Providers",
        intro:
          "Performance and uptime directly affect conversions, SEO, and user trust. For most modern JavaScript projects, we recommend managed platforms that simplify deployment and observability.",
        tools: [
          {
            name: "Vercel",
            website: "https://vercel.com",
            category: "Hosting",
            description:
              "Vercel is ideal for Next.js applications, with excellent preview deployments, edge capabilities, and a workflow that connects product, design, and engineering teams.",
            bestFor: "Next.js teams needing rapid deployment cycles",
            pricing: "Free tier available, paid plans for team collaboration and scale",
            affiliate: true,
          },
          {
            name: "Cloudflare Pages",
            website: "https://pages.cloudflare.com",
            category: "Hosting",
            description:
              "Cloudflare Pages is a strong option for static or edge-first projects that need global delivery, security controls, and integration with Cloudflare developer products.",
            bestFor: "Edge deployments and globally distributed front-end apps",
            pricing: "Generous free tier with usage-based scaling",
          },
        ],
      },
      development: {
        title: "Development Tools",
        intro:
          "Great product teams reduce handoff friction between design and engineering. These tools improve code quality, collaboration, and release confidence.",
        tools: [
          {
            name: "GitHub",
            website: "https://github.com",
            category: "Version Control",
            description:
              "GitHub remains the foundation for source control, pull-request reviews, and CI workflows. It is a practical choice for distributed teams and open collaboration.",
            bestFor: "Code collaboration, CI automation, and repository governance",
            pricing: "Free for many projects; paid plans unlock advanced team controls",
          },
          {
            name: "Figma",
            website: "https://www.figma.com",
            category: "Design",
            description:
              "Figma accelerates interface design and prototyping while keeping stakeholders aligned through shared components and real-time feedback.",
            bestFor: "UI/UX design systems and cross-functional collaboration",
            pricing: "Free starter tier and paid professional/team plans",
          },
        ],
      },
      automation: {
        title: "Automation Tools",
        intro:
          "Automation helps teams reduce manual work and ship faster. We favor tools that are accessible to non-engineers but still flexible for advanced workflows.",
        tools: [
          {
            name: "Zapier",
            website: "https://zapier.com",
            category: "Automation",
            description:
              "Zapier connects SaaS applications with trigger-action workflows, making it easy to automate lead routing, notifications, CRM updates, and reporting.",
            bestFor: "Operations and marketing automation without custom code",
            pricing: "Free plan with paid tiers based on task volume",
            affiliate: true,
          },
          {
            name: "GitHub Actions",
            website: "https://github.com/features/actions",
            category: "Automation",
            description:
              "GitHub Actions allows teams to automate testing, builds, deployments, and security checks directly inside the repository lifecycle.",
            bestFor: "Engineering teams standardizing CI/CD and QA pipelines",
            pricing: "Usage-based minutes with included quotas on many plans",
          },
        ],
      },
    },
    closingTitle: "How to Choose the Right Stack",
    closingText:
      "Start with business goals before buying tools. If speed to market is your top priority, combine Namecheap and Vercel with GitHub and Zapier for fast execution. If security and edge performance are your focus, Cloudflare Registrar and Cloudflare Pages can be the stronger base. For design-heavy products, maintain a shared component system in Figma and synchronize implementation in GitHub. If you want personalized advice, contact Raygal Royal and we can help you map a practical stack for your budget, team size, and technical goals.",
  },
  so: {
    eyebrow: "Xulashooyin Tifaftireed",
    title: "Qalabka Aan Kula Talo-galineyno Dhismaha Ganacsi Online",
    intro:
      "Boggan wuxuu soo koobayaa aaladaha aan sida joogtada ah ugu talino macaamiisha iyo kooxaha gudaha. Waxaan diiradda saarnaa qalab la isku halayn karo, fudud in la maareeyo, lana miisaami karo marka ganacsigu korayo.",
    disclosure:
      "Qaar ka mid ah links-kan waa affiliate links. Haddii aad wax ka iibsato, Raygal Royal waxay heli kartaa komishan adiga oo aan wax dheeraad ah bixin.",
    labels: {
      bestFor: "Ku habboon",
      pricing: "Qiime caadi ah",
      visit: "Booqo",
      affiliate: "Affiliate Partner",
    },
    sections: {
      domain: {
        title: "Domain Registrars",
        intro: "Doorashada registrar sax ah waxay saameyneysaa amniga, DNS control, iyo qiimaha renewals.",
        tools: [
          {
            name: "Namecheap",
            website: "https://www.namecheap.com",
            category: "Domain Registrar",
            description: "Doorasho caan ah oo leh dashboard fudud, qiime tartan leh, iyo DNS maamul cad.",
            bestFor: "Startup-yada iyo freelancers-ka raba setup degdeg ah",
            pricing: "Waxay ku xiran tahay TLD; badanaa waxaa jira qiimo dhiirrigelin ah sanadkii koowaad",
            affiliate: true,
          },
          {
            name: "Cloudflare Registrar",
            website: "https://www.cloudflare.com/products/registrar/",
            category: "Domain Registrar",
            description: "Registrar xooggan oo si fiican ula shaqeeya Cloudflare DNS, SSL, iyo amniga.",
            bestFor: "Kooxo farsamo oo isticmaalaya adeegyada Cloudflare",
            pricing: "Qiime u dhow wholesale oo aan lahayn markup weyn",
          },
        ],
      },
      hosting: {
        title: "Hosting Providers",
        intro: "Hosting-ka saxda ahi wuxuu saameeyaa SEO, xawaare, iyo kalsoonida isticmaalaha.",
        tools: [
          {
            name: "Vercel",
            website: "https://vercel.com",
            category: "Hosting",
            description: "Ku habboon Next.js, leh preview deployments iyo hab-socod aad u degdeg badan.",
            bestFor: "Kooxo Next.js ah oo u baahan release degdeg ah",
            pricing: "Free tier + qorshayaal paid ah marka la koro",
            affiliate: true,
          },
          {
            name: "Cloudflare Pages",
            website: "https://pages.cloudflare.com",
            category: "Hosting",
            description: "Xulasho fiican oo loogu talagalay static ama edge-first projects oo global ah.",
            bestFor: "Apps front-end ah oo dunida oo dhan laga isticmaalo",
            pricing: "Free tier fiican iyo usage-based scaling",
          },
        ],
      },
      development: {
        title: "Development Tools",
        intro: "Qalabkan wuxuu yareeyaa jahwareerka u dhexeeya design iyo engineering.",
        tools: [
          {
            name: "GitHub",
            website: "https://github.com",
            category: "Version Control",
            description: "Aasaaska source control, pull requests, iyo CI workflows.",
            bestFor: "Iskaashi code iyo nidaam otomaatig ah",
            pricing: "Free plans iyo paid plans oo leh xakameyn dheeraad ah",
          },
          {
            name: "Figma",
            website: "https://www.figma.com",
            category: "Design",
            description: "Waxay dedejisaa UI/UX design, prototyping, iyo wada-shaqeynta kooxda.",
            bestFor: "Naqshadeynta interfaces iyo design systems",
            pricing: "Starter free + plans ganacsi",
          },
        ],
      },
      automation: {
        title: "Automation Tools",
        intro: "Automation-ku wuxuu yareeyaa shaqada gacanta wuxuuna kordhiyaa xawaare shaqo.",
        tools: [
          {
            name: "Zapier",
            website: "https://zapier.com",
            category: "Automation",
            description: "Isku xira apps kala duwan si loo sameeyo workflows aan code badan u baahnayn.",
            bestFor: "Ops iyo marketing automation",
            pricing: "Free plan + paid tiers iyadoo ku xiran task volume",
            affiliate: true,
          },
          {
            name: "GitHub Actions",
            website: "https://github.com/features/actions",
            category: "Automation",
            description: "Waxay otomaatig ka dhigtaa tests, builds, deployments, iyo checks amni.",
            bestFor: "Kooxo engineering ah oo dhisaya CI/CD adag",
            pricing: "Usage-based minutes",
          },
        ],
      },
    },
    closingTitle: "Sida Loo Doorto Stack-ka Kuugu Habboon",
    closingText:
      "Ka bilow yoolalka ganacsiga ka hor intaanad qalab iibsan. Haddii aad rabto inaad si degdeg ah suuqa u gasho, Namecheap + Vercel + GitHub + Zapier waa stack wax ku ool ah. Haddii amniga iyo edge performance ay muhiim kuu yihiin, Cloudflare Registrar iyo Cloudflare Pages ayaa noqon kara doorasho fiican.",
  },
  ar: {
    eyebrow: "اختيارات تحريرية",
    title: "أدوات موصى بها لبناء ونمو الأعمال الرقمية",
    intro:
      "تجمع هذه الصفحة الأدوات التي نوصي بها باستمرار لعملائنا وفرقنا. نركز على المنصات الموثوقة والقابلة للتوسع والتي تسهّل العمل اليومي للشركات الناشئة والوكالات.",
    disclosure:
      "قد تحتوي بعض الروابط في هذه الصفحة على روابط تابعة. إذا اشتريت من خلالها فقد تحصل Raygal Royal على عمولة دون تكلفة إضافية عليك.",
    labels: {
      bestFor: "مناسبة لـ",
      pricing: "التسعير المعتاد",
      visit: "زيارة",
      affiliate: "شريك تابع",
    },
    sections: {
      domain: {
        title: "مسجلو النطاقات",
        intro: "اختيار المسجل المناسب يؤثر على الأمان وتكلفة التجديد وسهولة إدارة DNS.",
        tools: [
          {
            name: "Namecheap",
            website: "https://www.namecheap.com",
            category: "مسجل نطاقات",
            description: "خيار عملي لبدء سريع مع لوحة تحكم سهلة وأسعار أولية منافسة.",
            bestFor: "الشركات الناشئة والمستقلون",
            pricing: "يختلف حسب الامتداد وغالبًا مع عروض أول سنة",
            affiliate: true,
          },
          {
            name: "Cloudflare Registrar",
            website: "https://www.cloudflare.com/products/registrar/",
            category: "مسجل نطاقات",
            description: "يتكامل بشكل ممتاز مع DNS وSSL وخدمات الحماية في Cloudflare.",
            bestFor: "الفرق التقنية التي تعتمد على Cloudflare",
            pricing: "قريب من سعر الجملة دون هامش مرتفع",
          },
        ],
      },
      hosting: {
        title: "مزودو الاستضافة",
        intro: "الأداء الجيد والاستقرار ينعكسان مباشرة على SEO وتحويلات الموقع.",
        tools: [
          {
            name: "Vercel",
            website: "https://vercel.com",
            category: "استضافة",
            description: "مثالي لمشاريع Next.js مع نشر سريع وبيئات معاينة فعالة.",
            bestFor: "فرق Next.js التي تحتاج سرعة في الإطلاق",
            pricing: "خطة مجانية مع خطط مدفوعة للتوسع",
            affiliate: true,
          },
          {
            name: "Cloudflare Pages",
            website: "https://pages.cloudflare.com",
            category: "استضافة",
            description: "حل قوي لمشاريع الواجهة الأمامية والتوزيع العالمي عبر الحافة.",
            bestFor: "تطبيقات front-end عالمية",
            pricing: "خطة مجانية قوية مع توسع حسب الاستخدام",
          },
        ],
      },
      development: {
        title: "أدوات التطوير",
        intro: "هذه الأدوات تقلل فجوة التسليم بين التصميم والهندسة.",
        tools: [
          {
            name: "GitHub",
            website: "https://github.com",
            category: "إدارة الكود",
            description: "الأساس لإدارة المستودعات ومراجعة الكود وأتمتة CI.",
            bestFor: "التعاون البرمجي وحوكمة المستودعات",
            pricing: "خطط مجانية ومدفوعة",
          },
          {
            name: "Figma",
            website: "https://www.figma.com",
            category: "تصميم",
            description: "منصة فعالة لتصميم الواجهات وبناء أنظمة التصميم والتعاون الفوري.",
            bestFor: "فرق UX/UI والتعاون بين التخصصات",
            pricing: "خطة مجانية وخطط احترافية",
          },
        ],
      },
      automation: {
        title: "أدوات الأتمتة",
        intro: "الأتمتة تقلل العمل اليدوي وتسرّع الإنجاز دون التضحية بالجودة.",
        tools: [
          {
            name: "Zapier",
            website: "https://zapier.com",
            category: "أتمتة",
            description: "يربط تطبيقات SaaS عبر سيناريوهات trigger/action بسهولة كبيرة.",
            bestFor: "أتمتة العمليات والتسويق",
            pricing: "خطة مجانية وخطط مدفوعة حسب الاستخدام",
            affiliate: true,
          },
          {
            name: "GitHub Actions",
            website: "https://github.com/features/actions",
            category: "أتمتة",
            description: "ينفذ الاختبارات والبناء والنشر والتحقق الأمني داخل دورة تطوير الكود.",
            bestFor: "فرق التطوير التي تريد CI/CD موحد",
            pricing: "دقائق حسب الاستخدام",
          },
        ],
      },
    },
    closingTitle: "كيف تختار الحزمة المناسبة",
    closingText:
      "ابدأ من أهداف عملك قبل شراء الأدوات. إذا كانت السرعة أولوية، فمزيج Namecheap وVercel وGitHub وZapier مناسب لمعظم الفرق الصغيرة. وإذا كان الأمان والأداء على الحافة أهم، فاعتمد Cloudflare Registrar وCloudflare Pages كأساس تقني.",
  },
}

export default function RecommendedToolsContent() {
  const { language } = useLanguage()
  const copy = copyByLang[language]

  const sections = [
    copy.sections.domain,
    copy.sections.hosting,
    copy.sections.development,
    copy.sections.automation,
  ]

  return (
    <main className="bg-slate-50 py-14 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-400">{copy.eyebrow}</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl dark:text-slate-100">{copy.title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">{copy.intro}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{copy.disclosure}</p>
        </header>

        <div className="mt-8 space-y-6">
          {sections.map((section) => (
            <ArticleSection key={section.title} id={section.title.toLowerCase().replace(/\s+/g, "-")} title={section.title} intro={section.intro}>
              <div className="grid gap-5 md:grid-cols-2">
                {section.tools.map((tool) => (
                  <ToolCard
                    key={tool.name}
                    name={tool.name}
                    website={tool.website}
                    category={tool.category}
                    description={tool.description}
                    bestFor={tool.bestFor}
                    pricing={tool.pricing}
                    affiliate={tool.affiliate}
                    labels={copy.labels}
                  />
                ))}
              </div>
            </ArticleSection>
          ))}

          <ArticleSection id="selection-guide" title={copy.closingTitle}>
            <p>{copy.closingText}</p>
            <p>
              <Link href="/affiliate-disclosure" className="font-semibold text-sky-600 dark:text-sky-400">Affiliate Disclosure</Link>,{" "}
              <Link href="/blog/best-domain-registrars" className="font-semibold text-sky-600 dark:text-sky-400">Best Domain Registrars</Link>,{" "}
              <Link href="/blog/namecheap-review" className="font-semibold text-sky-600 dark:text-sky-400">Namecheap Review</Link>.
            </p>
          </ArticleSection>
        </div>
      </div>
    </main>
  )
}
