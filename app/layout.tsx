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
          var root = document.documentElement;
          var s = localStorage.getItem('raygalroyal-theme');
          // ✅ Light theme ONLY if explicitly stored, default to DARK
          if (s === 'light') {
            root.classList.remove('dark');
            root.classList.add('light');
          } else {
            root.classList.add('dark');
            root.classList.remove('light');
          }
        } catch(e) {
          document.documentElement.classList.add('dark');
        }
      })()
    `}} />
        <meta name='impact-site-verification' content='76817790-a843-4faf-9db0-ebf09e60592e'></meta>
      </head>
      <body className="font-sans antialiased transition-colors duration-300">
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
