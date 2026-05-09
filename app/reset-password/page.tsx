"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { KeyRound, Loader2, ShieldCheck } from "lucide-react"
import { useLanguage } from "../components/LanguageProvider"

const RESET_TOKEN_STORAGE_KEY = "raygalroyal-reset-password-token"

const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-400/60 focus:bg-white/10"

const extractTokenFromLocation = () => {
  if (typeof window === "undefined") {
    return null
  }

  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""))
  const searchParams = new URLSearchParams(window.location.search)

  return (
    hashParams.get("access_token") ??
    hashParams.get("token_hash") ??
    hashParams.get("token") ??
    searchParams.get("token_hash") ??
    searchParams.get("token") ??
    searchParams.get("code") ??
    null
  )
}

export default function ResetPasswordPage() {
  const { t } = useLanguage()
  const [token, setToken] = useState<string | null>(null)
  const [tokenReady, setTokenReady] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = window.sessionStorage.getItem(RESET_TOKEN_STORAGE_KEY)
    const urlToken = extractTokenFromLocation()
    const nextToken = urlToken ?? storedToken

    if (urlToken) {
      window.sessionStorage.setItem(RESET_TOKEN_STORAGE_KEY, urlToken)
      window.history.replaceState({}, document.title, window.location.pathname)
    }

    setToken(nextToken)
    setTokenReady(true)
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!token) {
      setError(t.invalidResetLink)
      return
    }

    if (password !== confirmPassword) {
      setError(t.passwordsDoNotMatch)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      const json = (await response.json().catch(() => null)) as { error?: string } | null

      if (!response.ok) {
        throw new Error(response.status === 400 ? t.invalidResetLink : json?.error || "Failed to reset password")
      }

      window.sessionStorage.removeItem(RESET_TOKEN_STORAGE_KEY)
      setSuccess(true)
      setPassword("")
      setConfirmPassword("")
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to reset password")
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
              <KeyRound className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white">{t.resetPassword}</h1>
            </div>
          </div>

          {!tokenReady ? (
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-300">
              <Loader2 className="h-5 w-5 animate-spin text-blue-300" />
              <span>{t.checkingResetLink}</span>
            </div>
          ) : success ? (
            <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-5 text-emerald-100">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                <div>
                  <p className="font-semibold">{t.passwordUpdated}</p>
                </div>
              </div>

              <div className="mt-5">
                <Link
                  href="/freelancer/login"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                >
                  {t.backToLogin}
                </Link>
              </div>
            </div>
          ) : (
            <>
              {!token ? (
                <div className="mb-6 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {t.invalidResetLink}
                </div>
              ) : null}

              {error ? (
                <div className="mb-6 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {error}
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="new-password" className="text-sm font-semibold text-slate-200">
                    {t.newPassword}
                  </label>
                  <input
                    id="new-password"
                    name="new-password"
                    required
                    minLength={6}
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className={inputClassName}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirm-password" className="text-sm font-semibold text-slate-200">
                    {t.confirmPassword}
                  </label>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    required
                    minLength={6}
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className={inputClassName}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !token}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : t.resetPassword}
                </button>
              </form>

              <div className="mt-6 flex items-center justify-between gap-4 text-sm text-slate-300">
                <Link href="/forgot-password" className="font-semibold text-blue-300 transition hover:text-white">
                  {t.forgotPassword}
                </Link>
                <Link href="/freelancer/login" className="font-semibold text-blue-300 transition hover:text-white">
                  {t.backToLogin}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}