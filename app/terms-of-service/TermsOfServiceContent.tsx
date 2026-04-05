"use client"

import Link from "next/link"
import type { Language } from "@/locales"
import { useLanguage } from "@/app/components/LanguageProvider"
import ArticleSection from "@/app/components/content/ArticleSection"

type Copy = {
  title: string
  subtitle: string
  sections: {
    scope: {
      title: string
      intro: string
      p1: string
      p2: string
    }
    commercial: {
      title: string
      intro: string
      h3a: string
      p3: string
      h3b: string
      p4: string
    }
    ip: {
      title: string
      intro: string
      p5: string
      p6: string
    }
    limits: {
      title: string
      intro: string
      p7: string
      p8: string
    }
    final: {
      title: string
      intro: string
      p9: string
      p10: string
    }
  }
}

const copyByLang: Record<Language, Copy> = {
  en: {
    title: "Terms of Service",
    subtitle:
      "These Terms govern your use of RaygalRoyal.com and any services provided by Raygal Royal. By using this website, you agree to these terms.",
    sections: {
      scope: {
        title: "Scope and Acceptance",
        intro: "These Terms apply to website visitors, inquiry submissions, and service clients.",
        p1:
          "By accessing our website, requesting services, or submitting project details, you acknowledge that you have read and accepted these Terms of Service. If you do not agree, you should discontinue use of the site and related services.",
        p2:
          "Additional commercial terms may appear in service proposals, statements of work, or written contracts. Where a signed contract exists, that contract governs project-specific obligations.",
      },
      commercial: {
        title: "Service Delivery, Pricing, and Payments",
        intro: "All project timelines, milestones, and deliverables are defined in writing before work begins.",
        h3a: "Quotes and project scope",
        p3:
          "Quotes are based on the information available at the time of estimation. If scope changes, revised pricing or timelines may be required. Clients are responsible for providing accurate requirements, timely feedback, and access needed for delivery.",
        h3b: "Billing and payment obligations",
        p4:
          "Payments are due according to agreed billing terms. Delayed payment may pause work or delay final delivery. Where applicable, payment processors and third-party checkout platforms apply their own terms and policies in addition to ours.",
      },
      ip: {
        title: "Intellectual Property and Usage Rights",
        intro: "Ownership and usage rights depend on the specific agreement for each engagement.",
        p5:
          "Unless otherwise stated in writing, Raygal Royal retains rights to pre-existing frameworks, reusable components, and proprietary internal methods. Upon full payment, clients receive rights to approved deliverables as defined in the project agreement.",
        p6:
          "Clients are responsible for ensuring that content, media, and materials they provide do not violate third-party rights. We reserve the right to remove unlawful or infringing content from active project channels.",
      },
      limits: {
        title: "Disclaimers and Limitation of Liability",
        intro: "We provide services using commercially reasonable skill and care, but no digital system is risk-free.",
        p7:
          "Raygal Royal does not guarantee uninterrupted operation of third-party platforms, affiliate networks, or hosting services outside our direct control. We are not liable for indirect, incidental, or consequential losses to the extent permitted by law.",
        p8:
          "Clients remain responsible for legal compliance in their own business operations, including privacy, consumer, and tax obligations in their jurisdictions.",
      },
      final: {
        title: "Policy Updates and Contact",
        intro: "We may update these Terms to reflect service changes, legal requirements, or operational improvements.",
        p9:
          "When updates are material, we will publish a revised version on this page. Continued use of the website after updates indicates acceptance of the revised Terms.",
        p10:
          "For legal or contractual questions, contact us directly. You can also review our Privacy Policy and Affiliate Disclosure for related compliance information.",
      },
    },
  },
  so: {
    title: "Shuruudaha Adeegga",
    subtitle: "Shuruudahani waxay xukumaan isticmaalka RaygalRoyal.com iyo adeegyada Raygal Royal.",
    sections: {
      scope: {
        title: "Baaxadda iyo Aqbalidda",
        intro: "Shuruudahani waxay khuseeyaan booqdayaasha bogga iyo macaamiisha adeegga.",
        p1: "Markaad isticmaasho website-ka ama codsato adeeg, waxaad aqbashay shuruudahaan.",
        p2: "Heshiisyada qoraalka ah ee mashruuca gaarka ah ayaa mudnaan leh marka ay jiraan.",
      },
      commercial: {
        title: "Bixinta Adeegga, Qiimeynta, iyo Lacag-bixinta",
        intro: "Jadwalka iyo deliverables-ka waxaa lagu qeexaa qoraal ahaan ka hor bilowga shaqada.",
        h3a: "Qiimeyn iyo scope",
        p3: "Haddii scope is beddelo, qiime ama jadwal cusub ayaa loo baahan karaa.",
        h3b: "Lacag-bixinta",
        p4: "Lacag bixinta dib u dhacda waxay dib u dhigi kartaa ama joojin kartaa shaqada.",
      },
      ip: {
        title: "Hantida Maskaxeed iyo Xuquuqda Isticmaalka",
        intro: "Xuquuqda lahaanshaha waxay ku xirnaaneysaa heshiiska mashruuca.",
        p5: "Qalabka gudaha ee hore loo lahaa wuxuu ahaan karaa hantida Raygal Royal haddii aan si kale loo qorin.",
        p6: "Macaamilku waa masuul ka ah inuu xaqiijiyo in content-ka uu bixiyo uusan jebin xuquuq dad kale.",
      },
      limits: {
        title: "Xaddidaadda Masuuliyadda",
        intro: "Waxaan bixinaa adeeg heer sare ah, balse nidaam dijitaal ah 100% khatar la'aan ma jiro.",
        p7: "Mas'uul kama nihin carqaladaha ka yimaada third-party platforms ka baxsan xakameynteena.",
        p8: "Macaamilku wuxuu mas'uul ka yahay compliance-ka sharci ee ganacsigiisa.",
      },
      final: {
        title: "Cusboonaysiin iyo Xiriir",
        intro: "Waxaan cusboonaysiin karnaa shuruudahaan marka adeegyada ama shuruucdu is beddelaan.",
        p9: "Isticmaalkaaga sii socda wuxuu ka dhigan yahay aqbalidda nooca cusub ee shuruudaha.",
        p10: "Su'aalaha sharci, nala soo xiriir. Sidoo kale eeg Privacy Policy iyo Affiliate Disclosure.",
      },
    },
  },
  ar: {
    title: "شروط الخدمة",
    subtitle: "تحكم هذه الشروط استخدام موقع RaygalRoyal.com والخدمات المقدمة من Raygal Royal.",
    sections: {
      scope: {
        title: "النطاق والقبول",
        intro: "تسري هذه الشروط على زوار الموقع والعملاء.",
        p1: "باستخدامك الموقع أو طلبك خدمة فإنك توافق على هذه الشروط.",
        p2: "إذا وُجد عقد مكتوب خاص بالمشروع فله الأولوية على البنود العامة هنا.",
      },
      commercial: {
        title: "تقديم الخدمة والتسعير والدفع",
        intro: "يتم تحديد نطاق العمل والتسليمات والمواعيد كتابيًا قبل بدء التنفيذ.",
        h3a: "العروض ونطاق المشروع",
        p3: "أي تغيير في النطاق قد يؤدي إلى تعديل السعر أو الجدول الزمني.",
        h3b: "الالتزامات المالية",
        p4: "تأخر الدفع قد يؤدي إلى تعليق العمل أو تأخير التسليم النهائي.",
      },
      ip: {
        title: "الملكية الفكرية وحقوق الاستخدام",
        intro: "تعتمد الملكية النهائية على ما ينص عليه الاتفاق الخاص بكل مشروع.",
        p5: "تبقى الأطر والأدوات الداخلية المسبقة مملوكة لـ Raygal Royal ما لم يُتفق خلاف ذلك.",
        p6: "العميل مسؤول عن قانونية المواد والمحتوى الذي يقدمه للمشروع.",
      },
      limits: {
        title: "إخلاء المسؤولية وحدودها",
        intro: "نقدم خدماتنا بعناية مهنية، لكن لا يمكن ضمان خلو الأنظمة الرقمية من المخاطر.",
        p7: "لا نتحمل مسؤولية تعطل منصات خارجية لا تخضع لسيطرتنا المباشرة.",
        p8: "يبقى العميل مسؤولًا عن الامتثال القانوني لنشاطه داخل نطاقه القضائي.",
      },
      final: {
        title: "تحديثات الشروط والتواصل",
        intro: "قد نقوم بتحديث هذه الشروط عند تغيّر المتطلبات القانونية أو التشغيلية.",
        p9: "الاستمرار في استخدام الموقع بعد النشر يعني قبول النسخة المحدثة.",
        p10: "للاستفسارات القانونية تواصل معنا، وراجع أيضًا سياسة الخصوصية وإفصاح الروابط التابعة.",
      },
    },
  },
}

export default function TermsOfServiceContent() {
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
          <ArticleSection id="scope" title={copy.sections.scope.title} intro={copy.sections.scope.intro}>
            <p>{copy.sections.scope.p1}</p>
            <p>{copy.sections.scope.p2}</p>
          </ArticleSection>

          <ArticleSection id="commercial" title={copy.sections.commercial.title} intro={copy.sections.commercial.intro}>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{copy.sections.commercial.h3a}</h3>
            <p>{copy.sections.commercial.p3}</p>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{copy.sections.commercial.h3b}</h3>
            <p>{copy.sections.commercial.p4}</p>
          </ArticleSection>

          <ArticleSection id="intellectual-property" title={copy.sections.ip.title} intro={copy.sections.ip.intro}>
            <p>{copy.sections.ip.p5}</p>
            <p>{copy.sections.ip.p6}</p>
          </ArticleSection>

          <ArticleSection id="liability" title={copy.sections.limits.title} intro={copy.sections.limits.intro}>
            <p>{copy.sections.limits.p7}</p>
            <p>{copy.sections.limits.p8}</p>
          </ArticleSection>

          <ArticleSection id="updates" title={copy.sections.final.title} intro={copy.sections.final.intro}>
            <p>{copy.sections.final.p9}</p>
            <p>{copy.sections.final.p10}</p>
            <p>
              <Link href="/privacy-policy" className="font-semibold text-sky-600 dark:text-sky-400">Privacy Policy</Link>,{" "}
              <Link href="/affiliate-disclosure" className="font-semibold text-sky-600 dark:text-sky-400">Affiliate Disclosure</Link>,{" "}
              <Link href="/contact" className="font-semibold text-sky-600 dark:text-sky-400">Contact</Link>.
            </p>
          </ArticleSection>
        </div>
      </div>
    </main>
  )
}
