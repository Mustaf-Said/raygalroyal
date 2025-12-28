import "@/styles/globals.css"
/* export const metadata = {
  title: "RaygalRoyal NextTech",
} */

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="abril-fatface-regular">
        {children}
      </body>
    </html>
  )
}
