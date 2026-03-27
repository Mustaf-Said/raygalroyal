"use client"

import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollUp = () => window.scrollTo({ top: 0, behavior: "smooth" })

  if (!visible) return null

  return (
    <button
      onClick={scrollUp}
      aria-label="Scroll to top"
      className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
      style={{
        background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 60%, #c026d3 100%)",
        boxShadow: "0 0 20px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
        border: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  )
}