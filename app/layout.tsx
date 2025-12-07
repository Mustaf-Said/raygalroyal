// app/layout.tsx
import "@/styles/globals.css"

export const metadata = {
  title: "RaygalRoyal NextTech",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  )
}
