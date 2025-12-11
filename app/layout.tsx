// app/layout.tsx
import "@/styles/globals.css"
import Footer from "./components/Footer"
export const metadata = {
  title: "RaygalRoyal NextTech",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html suppressHydrationWarning>
      <body>
        {children}
        <Footer />
      </body>
    </html>
  )
}
