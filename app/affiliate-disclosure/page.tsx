import type { Metadata } from "next"
import AffiliateDisclosureContent from "./AffiliateDisclosureContent"

export const metadata: Metadata = {
  title: "Affiliate Disclosure | Raygal Royal",
  description:
    "Read Raygal Royal's affiliate disclosure to understand how we evaluate tools, when we may earn commissions, and how we keep recommendations transparent.",
  openGraph: {
    title: "Affiliate Disclosure | Raygal Royal",
    description:
      "How Raygal Royal handles affiliate links, editorial independence, and recommendation standards.",
    type: "article",
    url: "https://raygalroyal.com/affiliate-disclosure",
    siteName: "Raygal Royal",
  },
  twitter: {
    card: "summary_large_image",
    title: "Affiliate Disclosure | Raygal Royal",
    description:
      "How we disclose affiliate relationships and keep our recommendations trustworthy.",
  },
  alternates: {
    canonical: "https://raygalroyal.com/affiliate-disclosure",
  },
}

export default function AffiliateDisclosurePage() {
  return <AffiliateDisclosureContent />
}
