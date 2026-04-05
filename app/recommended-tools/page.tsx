import type { Metadata } from "next"
import RecommendedToolsContent from "./RecommendedToolsContent"

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
  },
  twitter: {
    card: "summary_large_image",
    title: "Recommended Tools | Raygal Royal",
    description:
      "A practical stack for domains, hosting, development workflows, and business automation.",
  },
}

export default function RecommendedToolsPage() {
  return <RecommendedToolsContent />
}
