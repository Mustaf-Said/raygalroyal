import "../styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LanguageProvider } from "./components/LanguageProvider";
import { ThemeProvider } from "./components/ThemeProvider";
import { ModalProvider } from "./components/ModalProvider";
import LayoutWrapper from "./components/LayoutWrapper";
import OrganizationSchema from "./components/seo/OrganizationSchema";
import CookieBanner from "./components/CookieBanner";
import AnalyticsLoader from "./components/AnalyticsLoader";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Raygal Royal | Digital Solutions Agency",

  description:
    "Raygal Royal is a professional digital agency specializing in modern, high-performance web and mobile applications with multilingual support.",

  metadataBase: new URL("https://raygalroyal.com"),

  verification: {
    other: {
      "impact-site-verification": "76817790-a843-4faf-9db0-ebf09e60592e",
    },
  },

  icons: {
    icon: "/logoB.png",
    shortcut: "/logoB.png",
    apple: "/logoB.png",
  },

  openGraph: {
    title: "Raygal Royal | Digital Solutions Agency",
    description:
      "Raygal Royal is a professional digital agency specializing in modern, high-performance web and mobile applications.",
    url: "https://raygalroyal.com",
    siteName: "Raygal Royal",
    type: "website",
    images: [
      {
        url: "/logoB.png",
        width: 1200,
        height: 630,
        alt: "Raygal Royal",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
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
    `,
          }}
        />

      </head>
      <body className={`${inter.className} font-sans antialiased transition-colors duration-300`}>
        <OrganizationSchema
          name="Raygal Royal"
          url="https://raygalroyal.com"
          logo="https://raygalroyal.com/logo.png"
          sameAs={[
            "https://www.facebook.com/mustfa99/",
            "https://x.com/MR4273083817955",
            "https://www.linkedin.com/in/mustafa-said-b6b164198/",
            "https://github.com/Mustaf-Said",
          ]}
        />
        <LanguageProvider>
          <ThemeProvider>
            <ModalProvider>
              <LayoutWrapper>{children}</LayoutWrapper>
            </ModalProvider>
          </ThemeProvider>
          <CookieBanner />
        </LanguageProvider>
        <AnalyticsLoader />
      </body>
    </html>
  );
}
