"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

type Theme = "light" | "dark"

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)
const STORAGE_KEY = "raygalroyal-theme"

function getSavedTheme(): Theme {
  if (typeof window === "undefined") return "dark"
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    // ✅ Only return if explicitly set to 'light', otherwise default to 'dark'
    if (saved === "light") return "light"
    return "dark"
  } catch (e) {
    // ✅ Fallback to dark if localStorage fails
    return "dark"
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // ✅ "dark" on server (SSR safe), corrected on client after mount
  const [theme, setThemeState] = useState<Theme>("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // ✅ On mount, ensure the theme is correctly set from localStorage
    const savedTheme = getSavedTheme()
    const root = document.documentElement

    // ✅ Always ensure correct classes are applied before state update
    if (savedTheme === "dark") {
      root.classList.add("dark")
      root.classList.remove("light")
    } else {
      root.classList.add("light")
      root.classList.remove("dark")
    }

    setThemeState(savedTheme)
    setMounted(true)
  }, [])

  // ✅ Apply dark/light class + save to localStorage whenever theme changes
  useEffect(() => {
    if (!mounted) return
    const root = document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
      root.classList.remove("light")
    } else {
      root.classList.add("light")
      root.classList.remove("dark")
    }
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme, mounted])

  const setTheme = (t: Theme) => setThemeState(t)
  const toggleTheme = () => setThemeState((current) => current === "dark" ? "light" : "dark")
  const isDark = theme === "dark"

  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    setTheme,
    toggleTheme,
    isDark,
  }), [theme, isDark])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used within ThemeProvider")
  return context
}