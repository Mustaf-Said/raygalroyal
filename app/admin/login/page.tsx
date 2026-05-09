"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { setAdminAuth } from "@/lib/adminClientAuth"
import { ShieldCheck, Loader2 } from "lucide-react"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Call admin login API (backend validates role)
      const response = await fetch("/api/admin/login", {
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

      setAdminAuth({ accessToken: json.accessToken, userId: json.userId })
      router.push("/admin/orders")
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-4xl shadow-2xl p-10 border border-gray-100 dark:border-gray-800">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-blue-500/20">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Admin Portal</h1>
            <p className="text-gray-500">Please sign in to access the dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@raygalroyal.com"
                required
                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-gray-900 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-gray-900 dark:text-white"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 text-center font-bold bg-red-50 dark:bg-red-900/10 py-3 rounded-xl">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:pointer-events-none shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Sign In to Dashboard"}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-sm text-gray-400">
          Secure access restricted to authorized personnel only.
        </p>
      </div>
    </div>
  )
}
