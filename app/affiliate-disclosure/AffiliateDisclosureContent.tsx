"use client"

import Link from "next/link"
import type { Language } from "@/locales"
import { useLanguage } from "@/app/components/LanguageProvider"
import ArticleSection from "@/app/components/content/ArticleSection"

type DisclosureCopy = {
  eyebrow: string
  title: string
  lead: string
  sections: {
    howItWorks: {
      title: string
      intro: string
      p1: string
      p2: string
    }
    editorial: {
      title: string
      intro: string
      h3a: string
      p3: string
      h3b: string
      p4: string
      h3c: string
      p5: string
    }
    compliance: {
      title: string
      intro: string
      p6: string
      p7: string
    }
    readerResponsibility: {
      title: string
      intro: string
      p8: string
      p9: string
    }
    contact: {
      title: string
      intro: string
      p10: string
    }
  }
}

const disclosureCopy: Record<Language, DisclosureCopy> = {
  en: {
    eyebrow: "Transparency",
    title: "Affiliate Disclosure",
    lead:
      "Raygal Royal publishes reviews, implementation guides, and tool comparisons for founders and growing teams. Some links on this website are affiliate links, which means we may earn a commission when you purchase through those links. This does not increase your price.",
    sections: {
      howItWorks: {
        title: "How Affiliate Links Work",
        intro:
          "Affiliate programs provide unique tracking links that help providers understand where referrals come from.",
        p1:
          "When you click an affiliate link on RaygalRoyal.com and complete a purchase, the provider may attribute the sale to us and pay a referral fee. That referral fee supports the cost of editorial research, real product testing, and ongoing updates to keep our recommendations accurate.",
        p2:
          "We may work with direct partner programs or affiliate networks such as Impact.com. If an article includes monetized links, that relationship is disclosed clearly on the page. We avoid hidden disclosures and we do not place affiliate links in a way that confuses readers.",
      },
      editorial: {
        title: "Editorial Standards and Independence",
        intro:
          "Our recommendations are based on practical fit, not affiliate payout size.",
        h3a: "How we evaluate tools",
        p3:
          "Our team reviews products based on reliability, support quality, security controls, pricing transparency, and long-term value. For domain registrars and hosting providers, we also evaluate DNS management quality, SSL simplicity, renewal pricing behavior, account protection, and migration experience.",
        h3b: "What we do not allow",
        p4:
          "We do not accept payment for guaranteed rankings, fake testimonials, or hidden endorsements. A partner relationship never guarantees a positive recommendation. If a tool underperforms in real-world use, we explain the limitations so readers can make informed decisions.",
        h3c: "How we maintain accuracy",
        p5:
          "Because pricing and product features can change quickly, we periodically revisit key pages and refresh data. If a provider changes terms, adds fees, or degrades support quality, we revise content to reflect that change.",
      },
      compliance: {
        title: "How We Label Commercial Relationships",
        intro:
          "Our disclosure process is designed to satisfy both user trust and affiliate compliance expectations.",
        p6:
          "Pages with affiliate links include visible disclosure language near the top of the page or beside recommendations. Individual affiliate links may include relationship attributes such as nofollow and sponsored when appropriate.",
        p7:
          "A provider can be listed without an affiliate relationship if we believe it is the best fit for a specific use case. Likewise, a provider can be an affiliate partner and still not be our top recommendation for every business model.",
      },
      readerResponsibility: {
        title: "Your Responsibility as a Buyer",
        intro:
          "Our content is educational and should be part of your due diligence process, not a replacement for legal or financial advice.",
        p8:
          "Before you buy any tool, review the provider's latest pricing page, billing cycle terms, cancellation policy, refund policy, and regional compliance details. Teams handling sensitive data should also verify data residency and security certifications.",
        p9:
          "If you find outdated information on our pages, contact us and we will review it. We value corrections from readers and aim to keep recommendations current for startups, agencies, and freelancers.",
      },
      contact: {
        title: "Questions and Contact",
        intro:
          "We welcome questions from readers, compliance teams, and potential partners.",
        p10:
          "For affiliate or policy questions, use our contact page. You can also review our Privacy Policy, Terms of Service, and Recommended Tools page for additional legal and editorial context.",
      },
    },
  },
  so: {
    eyebrow: "Daahfurnaan",
    title: "Shaacinta Xiriirrada Affiliate",
    lead:
      "Raygal Royal waxay daabacdaa dib-u-eegisyo, hagitaanno farsamo, iyo isbarbardhigyo qalab si ay uga caawiso ganacsiyada koraya. Qaar ka mid ah links-ka boggan waa affiliate links, taas oo micnaheedu yahay inaan helno komishan haddii aad wax iibsato adigoo isticmaalaya link-gaas. Qiimaha adiga laguma kordhiyo.",
    sections: {
      howItWorks: {
        title: "Sida Affiliate Links U Shaqeeyaan",
        intro: "Barnaamijyada affiliate-ku waxay bixiyaan links raad-raac leh si loo ogaado halka tixraacyadu ka yimaadeen.",
        p1:
          "Haddii aad gujiso affiliate link ku yaal RaygalRoyal.com kadibna aad iibsato adeeg, shirkadda bixisa adeegga waxay noo aqoonsan kartaa iibkaas oo waxay na siin kartaa lacag tixraac ah. Dakhligaas wuxuu naga caawiyaa cilmi-baarista, tijaabinta qalabka, iyo cusboonaysiinta maqaalada.",
        p2:
          "Waxaan la shaqayn karnaa barnaamijyo toos ah ama shabakado sida Impact.com. Haddii maqaal uu leeyahay links lacag-keenaya, waxaan si cad ugu sheegnaa boggaas. Ma isticmaalno qoraal qarsoon ama qaab marin-habaabin ah.",
      },
      editorial: {
        title: "Madax-bannaanida Tifaftirka",
        intro: "Talooyinkeennu waxay ku saleysan yihiin waxtar dhab ah, ma aha komishanka ugu badan.",
        h3a: "Sida aan u qiimeyno qalabka",
        p3:
          "Waxaan qiimeynaa xasilloonida adeegga, tayada taageerada, amniga, daahfurnaanta qiimaha, iyo qiimaha muddada dheer. Domain iyo hosting ahaan waxaan sidoo kale eegnaa DNS control, SSL fudayd, renewals, iyo ilaalinta akoonka.",
        h3b: "Waxyaabaha aanan aqbalin",
        p4:
          "Ma aqbalno lacag lagu iibsado qiimeyn wanaagsan, darajo la hubo, ama xayeysiin qarsoon. Xiriirka affiliate ma dammaanad qaado talo togan. Haddii qalabku liito, waxaan si cad u sharaxnaa xaddidaadaha.",
        h3c: "Sida aan xogta u cusboonaysiinno",
        p5:
          "Qiimaha iyo sifooyinka qalabku way isbeddelaan. Sidaas darteed waxaan si joogto ah u dib u eegnaa boggaga muhiimka ah si aan u saxno xogta marka xaaladuhu is beddelaan.",
      },
      compliance: {
        title: "Sida Aan U Calaamadeyno Xiriirrada Ganacsi",
        intro: "Habka shaacinteennu wuxuu ilaaliyaa kalsoonida akhristaha iyo shuruudaha affiliate network-yada.",
        p6:
          "Boggaga leh affiliate links waxay leeyihiin ogeysiis muuqda oo ku dhow bilowga bogga ama agta recommendations-ka. Links-ka qaarkood waxaan ku darnaa nofollow iyo sponsored marka ay ku habboon yihiin.",
        p7:
          "Qalab qaar ayaan soo jeedin karnaa xitaa haddii aanu lahayn affiliate xiriir. Sidoo kale, affiliate partner ma noqonayo had iyo jeer doorashada ugu fiican ee use case kasta.",
      },
      readerResponsibility: {
        title: "Masuuliyaddaada iibsade ahaan",
        intro: "Maqaalladeennu waa waxbarasho; ma beddelayaan talo sharci ama talo maaliyadeed.",
        p8:
          "Ka hor iibsiga, hubi qiimaha ugu dambeeya, shuruudaha lacag-bixinta, cancellation policy, refund policy, iyo compliance-ka deegaankaaga. Haddii aad maamusho xog xasaasi ah, hubi data residency iyo security certifications.",
        p9:
          "Haddii aad aragto xog duugoowday, nala soo xiriir. Waxaan mudnaanta siinaa saxnaanta iyo cusboonaysiinta degdegga ah.",
      },
      contact: {
        title: "Su'aalo iyo Xiriir",
        intro: "Waxaan soo dhoweyneynaa su'aalaha akhristayaasha, la-hawlgalayaasha, iyo kooxaha compliance-ka.",
        p10:
          "Su'aalaha affiliate ama siyaasadaha, fadlan booqo bogga contact-ka. Waxaad sidoo kale akhrisan kartaa Privacy Policy, Terms of Service, iyo Recommended Tools si aad u hesho macluumaad dheeraad ah.",
      },
    },
  },
  ar: {
    eyebrow: "الشفافية",
    title: "إفصاح الروابط التابعة",
    lead:
      "تنشر Raygal Royal مراجعات تقنية ومقارنات أدوات لمساعدة الشركات على اتخاذ قرارات أفضل. بعض الروابط في هذا الموقع روابط تابعة، ما يعني أننا قد نحصل على عمولة عند الشراء من خلالها دون أي تكلفة إضافية عليك.",
    sections: {
      howItWorks: {
        title: "كيف تعمل الروابط التابعة",
        intro: "توفر برامج التسويق بالعمولة روابط تتبع لمعرفة مصدر الإحالات.",
        p1:
          "عند النقر على رابط تابع في RaygalRoyal.com وإتمام عملية شراء، قد تنسب الشركة عملية البيع إلينا وتدفع عمولة إحالة. تساعدنا هذه العمولات على تمويل البحث التحريري وتجربة الأدوات وتحديث المحتوى باستمرار.",
        p2:
          "قد نتعاون مع برامج مباشرة أو شبكات مثل Impact.com. عندما يحتوي المقال على روابط ربحية، نذكر ذلك بوضوح داخل الصفحة. لا نعتمد على إفصاحات مخفية أو صياغات مربكة للقارئ.",
      },
      editorial: {
        title: "المعايير التحريرية والاستقلالية",
        intro: "توصياتنا تعتمد على ملاءمة الأداة وجودتها، وليس على قيمة العمولة.",
        h3a: "كيف نقيم الأدوات",
        p3:
          "نقيم موثوقية الخدمة، جودة الدعم، عناصر الأمان، وضوح التسعير، والقيمة على المدى الطويل. وفي أدوات النطاقات والاستضافة نقيم أيضًا جودة إدارة DNS وسهولة SSL وسياسات التجديد وحماية الحساب.",
        h3b: "ما الذي نرفضه",
        p4:
          "لا نقبل الدفع مقابل ترتيب مضمون أو مراجعات مزيفة أو توصيات مخفية. وجود شراكة تابعة لا يعني توصية تلقائية. إذا كانت الأداة غير مناسبة نشرح القيود بوضوح.",
        h3c: "كيف نحدث المحتوى",
        p5:
          "لأن الأسعار والميزات تتغير بسرعة، نقوم بمراجعة الصفحات الأساسية بشكل دوري. إذا تغيرت الشروط أو انخفضت الجودة نحدّث المقالات بما يعكس الواقع.",
      },
      compliance: {
        title: "كيف نوضح العلاقات التجارية",
        intro: "آلية الإفصاح لدينا تراعي ثقة المستخدم ومتطلبات الامتثال.",
        p6:
          "الصفحات التي تحتوي على روابط تابعة تتضمن نص إفصاح واضحًا في أعلى الصفحة أو بجانب التوصيات. وقد نستخدم خصائص مثل nofollow وsponsored عند الحاجة.",
        p7:
          "قد نوصي بأداة حتى دون علاقة عمولة إذا كانت الأنسب لحالة استخدام محددة. وبالمقابل قد تكون الأداة شريكًا تابعًا لكنها ليست الخيار الأول لكل نشاط تجاري.",
      },
      readerResponsibility: {
        title: "مسؤوليتك قبل الشراء",
        intro: "محتوانا تعليمي ولا يُعد بديلاً عن الاستشارة القانونية أو المالية.",
        p8:
          "قبل الشراء راجع أحدث الأسعار وشروط الفوترة وسياسات الإلغاء والاسترجاع ومتطلبات الامتثال في بلدك. وإذا كنت تتعامل مع بيانات حساسة، تحقق من مكان حفظ البيانات وشهادات الأمان.",
        p9:
          "إذا لاحظت معلومات قديمة في أي صفحة، تواصل معنا لنراجعها. نحرص على إبقاء التوصيات دقيقة ومحدثة.",
      },
      contact: {
        title: "الأسئلة والتواصل",
        intro: "نرحب بأسئلة القراء وفرق الامتثال والشركاء المحتملين.",
        p10:
          "للاستفسارات المتعلقة بالشراكات أو السياسات، يرجى استخدام صفحة التواصل. ويمكنك أيضًا مراجعة سياسة الخصوصية وشروط الخدمة وصفحة الأدوات الموصى بها.",
      },
    },
  },
}

export default function AffiliateDisclosureContent() {
  const { language } = useLanguage()
  const copy = disclosureCopy[language]

  return (
    <main className="bg-slate-50 py-14 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <header className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-400">{copy.eyebrow}</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl dark:text-slate-100">{copy.title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">{copy.lead}</p>
        </header>

        <div className="mt-8 space-y-6">
          <ArticleSection
            id="how-affiliate-links-work"
            title={copy.sections.howItWorks.title}
            intro={copy.sections.howItWorks.intro}
          >
            <p>{copy.sections.howItWorks.p1}</p>
            <p>{copy.sections.howItWorks.p2}</p>
          </ArticleSection>

          <ArticleSection
            id="editorial-standards"
            title={copy.sections.editorial.title}
            intro={copy.sections.editorial.intro}
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{copy.sections.editorial.h3a}</h3>
            <p>{copy.sections.editorial.p3}</p>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{copy.sections.editorial.h3b}</h3>
            <p>{copy.sections.editorial.p4}</p>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{copy.sections.editorial.h3c}</h3>
            <p>{copy.sections.editorial.p5}</p>
          </ArticleSection>

          <ArticleSection
            id="affiliate-labeling"
            title={copy.sections.compliance.title}
            intro={copy.sections.compliance.intro}
          >
            <p>{copy.sections.compliance.p6}</p>
            <p>{copy.sections.compliance.p7}</p>
          </ArticleSection>

          <ArticleSection
            id="buyer-responsibility"
            title={copy.sections.readerResponsibility.title}
            intro={copy.sections.readerResponsibility.intro}
          >
            <p>{copy.sections.readerResponsibility.p8}</p>
            <p>{copy.sections.readerResponsibility.p9}</p>
          </ArticleSection>

          <ArticleSection id="contact" title={copy.sections.contact.title} intro={copy.sections.contact.intro}>
            <p>
              {copy.sections.contact.p10}{" "}
              <Link href="/contact" className="font-semibold text-sky-600 dark:text-sky-400">Contact</Link>,{" "}
              <Link href="/privacy-policy" className="font-semibold text-sky-600 dark:text-sky-400">Privacy Policy</Link>,{" "}
              <Link href="/terms-of-service" className="font-semibold text-sky-600 dark:text-sky-400">Terms of Service</Link>,{" "}
              <Link href="/recommended-tools" className="font-semibold text-sky-600 dark:text-sky-400">Recommended Tools</Link>.
            </p>
          </ArticleSection>
        </div>
      </div>
    </main>
  )
}
