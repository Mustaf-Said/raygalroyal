import type { Metadata } from "next"
import BestDomainRegistrarsContent from "./BestDomainRegistrarsContent"

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
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Domain Registrars in 2026 | Raygal Royal",
    description: "How to choose a registrar with better long-term value and fewer operational risks.",
  },
}

export default function BestDomainRegistrarsPage() {
  return <BestDomainRegistrarsContent />
}
