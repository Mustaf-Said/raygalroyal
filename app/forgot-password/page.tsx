"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2, Mail } from "lucide-react"
import { useLanguage } from "../components/LanguageProvider"

const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-400/60 focus:bg-white/10"

export default function ForgotPasswordPage() {
  const { t } = useLanguage()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const json = (await response.json().catch(() => null)) as { error?: string } | null

      if (!response.ok) {
        throw new Error(json?.error || "Failed to request password reset")
      }

      setMessage(t.checkEmailMessage)
      setEmail("")
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to request password reset")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.16),transparent_34%),linear-gradient(180deg,#020617_0%,#020617_55%,#0f172a_100%)]" />
      <div className="absolute left-8 top-16 h-48 w-48 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute right-8 bottom-16 h-56 w-56 rounded-full bg-fuchsia-500/15 blur-3xl" />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-4xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-10">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-fuchsia-600 shadow-lg shadow-blue-500/20">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white">{t.forgotPassword}</h1>
            </div>
          </div>

          {message ? (
            <div className="mb-6 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
              {message}
            </div>
          ) : null}

          {error ? (
            <div className="mb-6 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-slate-200">
                {t.enterEmail}
              </label>
              <input
                id="email"
                name="email"
                required
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={inputClassName}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : t.resetPassword}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-300">
            <Link href="/freelancer/login" className="font-semibold text-blue-300 transition hover:text-white">
              {t.backToLogin}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}