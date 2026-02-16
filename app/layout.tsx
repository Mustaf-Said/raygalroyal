import "@/styles/globals.css"
import type { Metadata } from "next"
import Header from "./components/Header"

// Extend the Window interface to include Weglot
declare global {
  interface Window {
    Weglot?: {
      initialize: (options: { api_key: string }) => void
    }
  }
}

export const metadata: Metadata = {
  title: "RaygalRoyal NextTech | Frontend Developer",
  description:
    "Frontend developer building modern, fast and multilingual websites with React and Next.js.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <body className="abril-fatface-regular">

        <Header />

        <main className="pt-20 bg-gray-200 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}
