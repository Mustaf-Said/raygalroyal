"use client"

import { useEffect, useState } from "react"
import Script from "next/script"

const GA_ID = "G-C2K3XQQ389"
const CONSENT_KEY = "cookie_consent"

export default function AnalyticsLoader() {
  const [load, setLoad] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(CONSENT_KEY) === "accepted") {
      setLoad(true)
    }

    const handleConsent = () => setLoad(true)
    window.addEventListener("cookie-consent-accepted", handleConsent)
    return () => window.removeEventListener("cookie-consent-accepted", handleConsent)
  }, [])

  if (!load) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `,
        }}
      />
    </>
  )
}
