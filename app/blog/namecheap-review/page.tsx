import type { Metadata } from "next"
import NamecheapReviewContent from "./NamecheapReviewContent"

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
  },
  twitter: {
    card: "summary_large_image",
    title: "Namecheap Review 2026 | Raygal Royal",
    description: "Detailed analysis of Namecheap pricing, DNS usability, and operational fit.",
  },
}

export default function NamecheapReviewPage() {
  return <NamecheapReviewContent />
}
