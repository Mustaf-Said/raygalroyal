import type { Metadata } from "next"
import PrivacyPolicyContent from "./PrivacyPolicyContent"

export const metadata: Metadata = {
  title: "Privacy Policy | Raygal Royal",
  description:
    "Read the Raygal Royal Privacy Policy to understand what data we collect, how we use it, and your rights regarding personal information.",
  alternates: {
    canonical: "https://raygalroyal.com/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | Raygal Royal",
    description: "How Raygal Royal collects, uses, protects, and manages personal data.",
    type: "article",
    url: "https://raygalroyal.com/privacy-policy",
    siteName: "Raygal Royal",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Raygal Royal",
    description: "Learn about data collection, usage, retention, and user rights at Raygal Royal.",
  },
}

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyContent />
}
