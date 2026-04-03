"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { setFreelancerAuth } from "@/lib/freelancerAuth"
import { supabase } from "@/lib/supabase"

export default function FreelancerLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const redirectAdmin = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.access_token) {
        return
      }

      const adminCheck = await fetch("/api/freelancers?admin=1", {
        cache: "no-store",
        headers: { Authorization: `Bearer ${session.access_token}` },
      })

      if (adminCheck.ok) {
        router.push("/admin")
      }
    }

    void redirectAdmin()
  }, [router])

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch("/api/freelancer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const json = (await response.json().catch(() => null)) as
        | { error?: string; accessToken?: string; userId?: string }
        | null

      if (!response.ok || !json?.accessToken) {
        throw new Error(json?.error || "Invalid email or password")
      }

      setFreelancerAuth({ accessToken: json.accessToken, userId: json.userId })

      router.push("/freelancer/dashboard")
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 flex items-center justify-center">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-xl p-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Freelancer Login</h1>
        <p className="text-gray-500 mb-8">Login to continue your freelancer application.</p>

        <div className="mb-6 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-800/40">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">New here?</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create a freelancer account first, then complete your profile in the dashboard.</p>
          <Link href="/freelancer/register" className="inline-flex mt-3 px-4 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold">
            Create account
          </Link>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            required
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
          />

          {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login"}
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-600 dark:text-gray-300 flex gap-2">
          <span>Don&apos;t have an account?</span>
          <Link href="/freelancer/register" className="text-blue-600 dark:text-blue-400 font-semibold">Create account</Link>
        </div>
      </div>
    </div>
  )
}
