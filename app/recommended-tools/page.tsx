import type { Metadata } from "next"
import RecommendedToolsContent from "./RecommendedToolsContent"
import ArticleSchema from "@/app/components/seo/ArticleSchema"
import BreadcrumbSchema from "@/app/components/seo/BreadcrumbSchema"

export const metadata: Metadata = {
  title: "Recommended Tools for Domains, Hosting, Dev, and Automation | Raygal Royal",
  description:
    "Explore Raygal Royal's recommended stack for domain registrars, hosting providers, development tools, and automation platforms.",
  alternates: {
    canonical: "https://raygalroyal.com/recommended-tools",
  },
  openGraph: {
    title: "Recommended Tools | Raygal Royal",
    description:
      "Professional recommendations for Namecheap, Cloudflare, Vercel, GitHub, Figma, Zapier, and other modern growth tools.",
    type: "article",
    url: "https://raygalroyal.com/recommended-tools",
    siteName: "Raygal Royal",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Recommended Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Recommended Tools | Raygal Royal",
    description:
      "A practical stack for domains, hosting, development workflows, and business automation.",
    images: ["/logo.png"],
  },
}

export default function RecommendedToolsPage() {
  return (
    <>
      <BreadcrumbSchema
        id="recommended-tools-breadcrumb"
        items={[
          { name: "Home", item: "https://raygalroyal.com" },
          { name: "Recommended Tools", item: "https://raygalroyal.com/recommended-tools" },
        ]}
      />
      <ArticleSchema
        id="recommended-tools-article"
        type="Article"
        url="https://raygalroyal.com/recommended-tools"
        headline="Recommended Tools for Building and Growing Online Businesses"
        description="Professional recommendations for Namecheap, Cloudflare, Vercel, GitHub, Figma, Zapier, and other modern growth tools."
        image="https://raygalroyal.com/logo.png"
        datePublished="2026-04-05"
        dateModified="2026-04-05"
        authorName="Raygal Royal Editorial Team"
        publisherName="Raygal Royal"
        publisherLogo="https://raygalroyal.com/logo.png"
      />
      <RecommendedToolsContent />
    </>
  )
}
