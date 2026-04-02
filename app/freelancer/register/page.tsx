"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { setFreelancerAuth } from "@/lib/freelancerAuth"

type FormState = {
  name: string
  email: string
  password: string
}

export default function FreelancerRegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch("/api/freelancer/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const json = (await response.json().catch(() => null)) as { error?: string } | null
      if (!response.ok) {
        throw new Error(json?.error || "Failed to register")
      }

      const loginResponse = await fetch("/api/freelancer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email.trim(), password: form.password }),
      })

      const loginJson = (await loginResponse.json().catch(() => null)) as
        | { error?: string; accessToken?: string; userId?: string }
        | null

      if (!loginResponse.ok || !loginJson?.accessToken) {
        throw new Error(loginJson?.error || "Registration succeeded but login failed")
      }

      setFreelancerAuth({ accessToken: loginJson.accessToken, userId: loginJson.userId })

      router.push("/freelancer/dashboard")
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to register")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-xl p-8 md:p-10">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Freelancer Registration</h1>
        <p className="text-gray-500 mb-8">Create your freelancer account, then complete your application from the dashboard.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <input required placeholder="Name" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700" />
          <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700" />
          <input required type="password" placeholder="Password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700" />

          {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create account"}
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-600 dark:text-gray-300 flex gap-2">
          <span>Already registered?</span>
          <Link href="/freelancer/login" className="text-blue-600 dark:text-blue-400 font-semibold">Login</Link>
        </div>
      </div>
    </div>
  )
}
