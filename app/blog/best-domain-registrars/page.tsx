import type { Metadata } from "next"
import BestDomainRegistrarsContent from "./BestDomainRegistrarsContent"
import ArticleSchema from "@/app/components/seo/ArticleSchema"
import BreadcrumbSchema from "@/app/components/seo/BreadcrumbSchema"

export const metadata: Metadata = {
  title: "Best Domain Registrars in 2026 | Raygal Royal",
  description:
    "Compare top domain registrars including Namecheap and Cloudflare Registrar with practical selection criteria for startups and agencies.",
  alternates: {
    canonical: "https://raygalroyal.com/blog/best-domain-registrars",
  },
  openGraph: {
    title: "Best Domain Registrars in 2026 | Raygal Royal",
    description:
      "A practical registrar comparison covering pricing, DNS control, security defaults, and support quality.",
    url: "https://raygalroyal.com/blog/best-domain-registrars",
    type: "article",
    siteName: "Raygal Royal",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Best Domain Registrars in 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Domain Registrars in 2026 | Raygal Royal",
    description: "How to choose a registrar with better long-term value and fewer operational risks.",
    images: ["/logo.png"],
  },
}

export default function BestDomainRegistrarsPage() {
  return (
    <>
      <BreadcrumbSchema
        id="best-domain-registrars-breadcrumb"
        items={[
          { name: "Home", item: "https://raygalroyal.com" },
          { name: "Blog", item: "https://raygalroyal.com/blog" },
          {
            name: "Best Domain Registrars in 2026",
            item: "https://raygalroyal.com/blog/best-domain-registrars",
          },
        ]}
      />
      <ArticleSchema
        id="best-domain-registrars-article"
        type="BlogPosting"
        url="https://raygalroyal.com/blog/best-domain-registrars"
        headline="Best Domain Registrars in 2026: Practical Picks for Startups and Agencies"
        description="Compare top domain registrars including Namecheap and Cloudflare Registrar with practical selection criteria for startups and agencies."
        image="https://raygalroyal.com/logo.png"
        datePublished="2026-04-05"
        dateModified="2026-04-05"
        authorName="Raygal Royal Editorial Team"
        publisherName="Raygal Royal"
        publisherLogo="https://raygalroyal.com/logo.png"
      />
      <BestDomainRegistrarsContent />
    </>
  )
}
