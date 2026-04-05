"use client"

import Link from "next/link"
import type { Language } from "@/locales"
import { useLanguage } from "@/app/components/LanguageProvider"
import ArticleSection from "@/app/components/content/ArticleSection"

type Copy = {
  title: string
  subtitle: string
  sections: {
    dataCollection: {
      title: string
      intro: string
      h3a: string
      p1: string
      h3b: string
      p2: string
    }
    usage: {
      title: string
      intro: string
      p3: string
      p4: string
    }
    legalBasis: {
      title: string
      intro: string
      p5: string
      p6: string
    }
    sharing: {
      title: string
      intro: string
      p7: string
      p8: string
    }
    rights: {
      title: string
      intro: string
      p9: string
      p10: string
    }
  }
}

const copyByLang: Record<Language, Copy> = {
  en: {
    title: "Privacy Policy",
    subtitle:
      "This Privacy Policy explains what personal information Raygal Royal collects, how we use it, and the choices you have regarding your data.",
    sections: {
      dataCollection: {
        title: "Information We Collect",
        intro: "We collect only the information required to provide services, communicate with you, and improve website performance.",
        h3a: "Information you provide directly",
        p1:
          "When you contact us, request a quote, or submit a project request, we may collect your name, email address, business name, and project details. If you upload documents or media related to your project, those files are processed for service delivery only.",
        h3b: "Information collected automatically",
        p2:
          "Like most modern websites, we may collect technical data such as browser type, device type, IP address, referral source, and visited pages. This helps us improve user experience, detect abuse, and maintain site security.",
      },
      usage: {
        title: "How We Use Information",
        intro: "We use your information for legitimate business operations and customer communication.",
        p3:
          "Your data may be used to respond to inquiries, prepare proposals, process service requests, deliver purchased work, and provide support. We may also use aggregated analytics to understand which pages and services are most helpful to visitors.",
        p4:
          "We do not sell personal data to third parties. If we send service-related emails, they are tied to requests you made or services you purchased. Marketing communication is limited and can be opted out where applicable.",
      },
      legalBasis: {
        title: "Legal Basis and Data Retention",
        intro: "Where required by law, we process personal data based on clear legal grounds.",
        p5:
          "Depending on your interaction with us, processing may be based on consent, contractual necessity, legal obligations, or legitimate interests such as fraud prevention and service improvement.",
        p6:
          "We retain personal information only for as long as necessary to provide services, comply with legal obligations, resolve disputes, and enforce agreements. Retention periods vary by data type and business context.",
      },
      sharing: {
        title: "Third-Party Services and Data Sharing",
        intro: "Some trusted providers process data on our behalf to support website and business operations.",
        p7:
          "We may use third-party platforms for hosting, analytics, communication, payment processing, and affiliate tracking. These providers receive only the data necessary to perform their role and are expected to maintain appropriate security standards.",
        p8:
          "In the context of affiliate partnerships, certain clicks or conversions may be tracked by partner networks. This tracking is used for attribution and reporting, not for selling your personal identity.",
      },
      rights: {
        title: "Your Rights and Contact",
        intro: "You can request access, correction, or deletion of your personal data subject to applicable law.",
        p9:
          "If you want to update or remove personal information, contact us with enough detail to verify your request. We may need to retain limited data where required for legal, security, or contractual reasons.",
        p10:
          "By using this website, you acknowledge this policy. We may update this Privacy Policy as our services evolve. For related legal terms, review our Terms of Service and Affiliate Disclosure pages.",
      },
    },
  },
  so: {
    title: "Siyaasadda Asturnaanta",
    subtitle: "Siyaasaddan waxay sharaxaysaa xogta aan aruurino, sida aan u isticmaalno, iyo xuquuqdaada.",
    sections: {
      dataCollection: {
        title: "Xogta Aan Aruurino",
        intro: "Waxaan aruurinaa keliya xogta lagama maarmaanka u ah adeeg bixinta iyo isgaarsiinta.",
        h3a: "Xogta aad si toos ah noo siiso",
        p1: "Marka aad nala soo xiriirto ama codsato adeeg, waxaan aruurin karnaa magaca, email, iyo faahfaahinta mashruuca.",
        h3b: "Xogta si otomaatig ah loo aruuriyo",
        p2: "Waxaan aruurin karnaa browser info, IP, iyo boggaga la booqday si loo hagaajiyo amniga iyo waxqabadka.",
      },
      usage: {
        title: "Sida Aan U Isticmaalno Xogta",
        intro: "Xogta waxaa loo isticmaalaa hawlgal sharci ah iyo taageero adeeg.",
        p3: "Waxaan u isticmaalnaa ka jawaabista su'aalaha, diyaarinta dalabyada, iyo fulinta adeegyada la codsaday.",
        p4: "Ma iibinno xogta shaqsiga ah. Isgaarsiinta suuq-geyntu waa xaddidan tahay waxaana jirta ikhtiyaar ka bixid.",
      },
      legalBasis: {
        title: "Aasaaska Sharci iyo Kaydinta Xogta",
        intro: "Marka sharci ahaan loo baahdo, waxaan ku shaqeynaa aasaas sharci oo cad.",
        p5: "Processing-ku wuxuu ku saleysnaan karaa oggolaansho, heshiis, waajib sharci, ama dan sharciyeed.",
        p6: "Xogta waxaan haynaa inta ay lagama maarmaan u tahay adeeg, sharci, iyo amni.",
      },
      sharing: {
        title: "Dhinacyada Saddexaad",
        intro: "Qaar ka mid ah adeeg bixiyeyaasha la aamini karo ayaa noo shaqeeya.",
        p7: "Waxaan isticmaali karnaa hosting, analytics, payment, iyo communication providers si aan u fulino adeegga.",
        p8: "Affiliate networks waxay qaarkood la socdaan clicks ama conversions si attribution loo sameeyo.",
      },
      rights: {
        title: "Xuquuqdaada iyo Xiriir",
        intro: "Waxaad codsan kartaa in xogtaada la arko, la saxo, ama la tirtiro iyadoo la raacayo sharciga.",
        p9: "Nala soo xiriir si aad u codsato wax ka beddel ama tirtirid xogtaada.",
        p10: "Isticmaalka boggan wuxuu ka dhigan yahay inaad aqbashay siyaasaddan. Waxaa suurtagal ah inaan cusboonaysiinno mustaqbalka.",
      },
    },
  },
  ar: {
    title: "سياسة الخصوصية",
    subtitle: "توضح هذه السياسة ما نجمعه من بيانات وكيف نستخدمها والخيارات المتاحة لك.",
    sections: {
      dataCollection: {
        title: "المعلومات التي نجمعها",
        intro: "نجمع فقط البيانات اللازمة لتقديم الخدمة وتحسين تجربة الاستخدام.",
        h3a: "بيانات تقدمها أنت مباشرة",
        p1: "عند التواصل معنا أو طلب خدمة قد نجمع الاسم والبريد الإلكتروني وتفاصيل المشروع.",
        h3b: "بيانات يتم جمعها تلقائيًا",
        p2: "قد نجمع نوع المتصفح والجهاز وعنوان IP والصفحات التي تمت زيارتها لتحسين الأداء والأمان.",
      },
      usage: {
        title: "كيف نستخدم البيانات",
        intro: "نستخدم البيانات ضمن تشغيل الأعمال والتواصل مع العملاء.",
        p3: "تشمل الاستخدامات الرد على الاستفسارات، إعداد العروض، وتنفيذ الخدمات المطلوبة.",
        p4: "لا نبيع البيانات الشخصية. وقد نرسل رسائل خدمية مرتبطة بطلباتك أو خدماتك.",
      },
      legalBasis: {
        title: "الأساس القانوني والاحتفاظ",
        intro: "نعالج البيانات وفق أساس قانوني واضح عند الاقتضاء.",
        p5: "قد يكون الأساس القانوني هو الموافقة أو تنفيذ العقد أو الالتزام القانوني أو المصلحة المشروعة.",
        p6: "نحتفظ بالبيانات للمدة اللازمة لتقديم الخدمة والامتثال القانوني وحماية الحقوق.",
      },
      sharing: {
        title: "مشاركة البيانات مع أطراف ثالثة",
        intro: "نستخدم مزودين موثوقين لدعم العمليات التقنية والتجارية.",
        p7: "قد نشارك بيانات محدودة مع خدمات الاستضافة والتحليلات والدفع والتواصل لتنفيذ الخدمة.",
        p8: "في الشراكات التابعة قد يتم تتبع النقرات أو التحويلات لأغراض الإسناد وإعداد التقارير.",
      },
      rights: {
        title: "حقوقك ووسائل التواصل",
        intro: "يمكنك طلب الوصول إلى بياناتك أو تصحيحها أو حذفها وفق القانون.",
        p9: "تواصل معنا مع تفاصيل كافية للتحقق من الطلب وتنفيذه بأسرع وقت ممكن.",
        p10: "استخدامك للموقع يعني إقرارك بهذه السياسة. قد نقوم بتحديثها عند تغير الخدمات أو المتطلبات.",
      },
    },
  },
}

export default function PrivacyPolicyContent() {
  const { language } = useLanguage()
  const copy = copyByLang[language]

  return (
    <main className="bg-slate-50 py-14 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <header className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10 dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl dark:text-slate-100">{copy.title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">{copy.subtitle}</p>
        </header>

        <div className="mt-8 space-y-6">
          <ArticleSection id="data-collection" title={copy.sections.dataCollection.title} intro={copy.sections.dataCollection.intro}>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{copy.sections.dataCollection.h3a}</h3>
            <p>{copy.sections.dataCollection.p1}</p>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{copy.sections.dataCollection.h3b}</h3>
            <p>{copy.sections.dataCollection.p2}</p>
          </ArticleSection>

          <ArticleSection id="usage" title={copy.sections.usage.title} intro={copy.sections.usage.intro}>
            <p>{copy.sections.usage.p3}</p>
            <p>{copy.sections.usage.p4}</p>
          </ArticleSection>

          <ArticleSection id="legal-basis" title={copy.sections.legalBasis.title} intro={copy.sections.legalBasis.intro}>
            <p>{copy.sections.legalBasis.p5}</p>
            <p>{copy.sections.legalBasis.p6}</p>
          </ArticleSection>

          <ArticleSection id="sharing" title={copy.sections.sharing.title} intro={copy.sections.sharing.intro}>
            <p>{copy.sections.sharing.p7}</p>
            <p>{copy.sections.sharing.p8}</p>
          </ArticleSection>

          <ArticleSection id="rights" title={copy.sections.rights.title} intro={copy.sections.rights.intro}>
            <p>{copy.sections.rights.p9}</p>
            <p>{copy.sections.rights.p10}</p>
            <p>
              <Link href="/terms-of-service" className="font-semibold text-sky-600 dark:text-sky-400">Terms of Service</Link>,{" "}
              <Link href="/affiliate-disclosure" className="font-semibold text-sky-600 dark:text-sky-400">Affiliate Disclosure</Link>,{" "}
              <Link href="/contact" className="font-semibold text-sky-600 dark:text-sky-400">Contact</Link>.
            </p>
          </ArticleSection>
        </div>
      </div>
    </main>
  )
}
