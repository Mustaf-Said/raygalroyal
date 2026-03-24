import "@/styles/globals.css"
import type { Metadata } from "next"
import { LanguageProvider } from "./components/LanguageProvider"
import { ThemeProvider } from "./components/ThemeProvider"
import { ModalProvider } from "./components/ModalProvider"
import LayoutWrapper from "./components/LayoutWrapper"

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
      (function() {
        try {
          var s = localStorage.getItem('raygalroyal-theme');
          var p = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          if ((s || p) === 'dark') document.documentElement.classList.add('dark');
        } catch(e) {}
      })()
    `}} />
      </head>
      <body className="font-sans antialiased bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300">
        <LanguageProvider>
          <ThemeProvider>
            <ModalProvider>
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
            </ModalProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
