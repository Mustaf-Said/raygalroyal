import "@/styles/globals.css"
import type { Metadata } from "next"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { LanguageProvider } from "./components/LanguageProvider"
import { ThemeProvider } from "./components/ThemeProvider"

export const metadata: Metadata = {
  title: "Raygal Royal | Digital Solutions Agency",
  description:
    "Raygal Royal is a professional digital agency specializing in modern, high-performance web and mobile applications with multilingual support.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="so" suppressHydrationWarning>
      <body className="font-sans antialiased bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300">
        <LanguageProvider>
          <ThemeProvider>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
