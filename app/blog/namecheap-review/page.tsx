import type { Metadata } from "next"
import NamecheapReviewContent from "./NamecheapReviewContent"
import ArticleSchema from "@/app/components/seo/ArticleSchema"
import BreadcrumbSchema from "@/app/components/seo/BreadcrumbSchema"
import ReviewSchema from "@/app/components/seo/ReviewSchema"

export const metadata: Metadata = {
  title: "Namecheap Review 2026 | Raygal Royal",
  description:
    "Read our practical Namecheap review covering pricing, DNS management, support quality, and best-fit use cases for startups and agencies.",
  alternates: {
    canonical: "https://raygalroyal.com/blog/namecheap-review",
  },
  openGraph: {
    title: "Namecheap Review 2026 | Raygal Royal",
    description:
      "A balanced review of Namecheap's strengths, tradeoffs, and long-term value for modern web teams.",
    url: "https://raygalroyal.com/blog/namecheap-review",
    type: "article",
    siteName: "Raygal Royal",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Namecheap Review 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Namecheap Review 2026 | Raygal Royal",
    description: "Detailed analysis of Namecheap pricing, DNS usability, and operational fit.",
    images: ["/logo.png"],
  },
}

export default function NamecheapReviewPage() {
  return (
    <>
      <BreadcrumbSchema
        id="namecheap-review-breadcrumb"
        items={[
          { name: "Home", item: "https://raygalroyal.com" },
          { name: "Blog", item: "https://raygalroyal.com/blog" },
          { name: "Namecheap Review 2026", item: "https://raygalroyal.com/blog/namecheap-review" },
        ]}
      />
      <ArticleSchema
        id="namecheap-review-article"
        type="BlogPosting"
        url="https://raygalroyal.com/blog/namecheap-review"
        headline="Namecheap Review 2026: Pricing, DNS Experience, and Real-World Fit"
        description="Read our practical Namecheap review covering pricing, DNS management, support quality, and best-fit use cases for startups and agencies."
        image="https://raygalroyal.com/logo.png"
        datePublished="2026-04-05"
        dateModified="2026-04-05"
        authorName="Raygal Royal Editorial Team"
        publisherName="Raygal Royal"
        publisherLogo="https://raygalroyal.com/logo.png"
      />
      <ReviewSchema
        id="namecheap-review-schema"
        url="https://raygalroyal.com/blog/namecheap-review"
        name="Namecheap Review 2026"
        description="Detailed review of Namecheap for pricing, DNS usability, support, and operational fit."
        reviewBody="Namecheap is a strong option for startups and freelancers seeking affordable domains and straightforward management. Tradeoffs include renewal variation by extension and fewer enterprise governance controls by default."
        datePublished="2026-04-05"
        authorName="Raygal Royal Editorial Team"
        publisherName="Raygal Royal"
        publisherLogo="https://raygalroyal.com/logo.png"
        image="https://raygalroyal.com/logo.png"
        itemReviewedName="Namecheap"
        ratingValue={4.4}
      />
      <NamecheapReviewContent />
    </>
  )
}
