/* import "@/styles/globals.css" */
import Script from "next/script";
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

        <Script
          id="impact-stat"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            (function(i,m,p,a,c,t){
              c[i]=c[i]||function(){(c[i].a=c[i].a||[]).push(arguments)};
              c[i].l=1*new Date();
              t=m.createElement(p);
              var z=m.getElementsByTagName(p)[0];
              t.async=1;
              t.src=a;
              z.parentNode.insertBefore(t,z);
            })(
              'impactStat',
              document,
              'script',
              'https://utt.impactcdn.com/P-A7160302-54e6-404e-8b71-3e0e7de7c482.js'
            );

            impactStat('transformLinks');
            impactStat('trackImpression');
            `,
          }}
        />

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
