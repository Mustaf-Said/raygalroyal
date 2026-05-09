import type { Metadata } from "next"
import TermsOfServiceContent from "./TermsOfServiceContent"

export const metadata: Metadata = {
  title: "Terms of Service | Raygal Royal",
  description:
    "Review Raygal Royal's Terms of Service, including service scope, payments, intellectual property rights, and liability terms.",
  alternates: {
    canonical: "https://raygalroyal.com/terms-of-service",
  },
  openGraph: {
    title: "Terms of Service | Raygal Royal",
    description:
      "Understand the legal terms for using RaygalRoyal.com and engaging Raygal Royal services.",
    type: "article",
    url: "https://raygalroyal.com/terms-of-service",
    siteName: "Raygal Royal",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | Raygal Royal",
    description: "Service scope, payment terms, usage rights, and liability rules for Raygal Royal.",
  },
}

export default function TermsOfServicePage() {
  return <TermsOfServiceContent />
}
