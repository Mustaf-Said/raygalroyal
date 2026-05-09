"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CreditCard, MessageSquareText, Settings2, Users } from "lucide-react"
import { clearAdminAuth, getAdminAuthHeaders } from "@/lib/adminClientAuth"
import { getFreelancerAccessToken } from "@/lib/freelancerAuth"

export default function AdminOrders() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  const ensureAdminAccess = useCallback(async () => {
    const headers = getAdminAuthHeaders()
    if (!headers.Authorization) {
      if (getFreelancerAccessToken()) {
        router.push("/freelancer/dashboard")
      } else {
        router.push("/admin/login")
      }
      return false
    }

    const response = await fetch("/api/freelancers?admin=1", {
      cache: "no-store",
      headers,
    })

    if (response.status === 403) {
      router.push("/freelancer/dashboard")
      return false
    }

    if (!response.ok) {
      clearAdminAuth()
      router.push("/admin/login")
      return false
    }

    return true
  }, [router])

  useEffect(() => {
    const check = async () => {
      const ok = await ensureAdminAccess()
      if (ok) {
        setChecking(false)
      }
    }

    void check()
  }, [ensureAdminAccess])

  if (checking) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-950" />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-xl p-8">
        <div className="flex flex-wrap items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-gray-500 mt-2">Choose a section to manage.</p>
          </div>
          <div className="flex justify-between items-center mt-4">
            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-800 font-semibold"
            >
              ← Back to Home
            </Link>

            <button
              onClick={async () => {
                await fetch("/api/admin/logout", { method: "POST" })
                clearAdminAuth()
                router.push("/admin/login")
              }}
              className="px-5 py-2 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link href="/admin/payments" className="p-6 rounded-2xl bg-blue-600 text-white font-bold flex items-center gap-3">
            <CreditCard className="w-5 h-5" />
            Payments
          </Link>
          <Link href="/admin/reviews" className="p-6 rounded-2xl bg-indigo-600 text-white font-bold flex items-center gap-3">
            <MessageSquareText className="w-5 h-5" />
            Review Management
          </Link>
          <Link href="/admin/freelancers" className="p-6 rounded-2xl bg-purple-600 text-white font-bold flex items-center gap-3">
            <Users className="w-5 h-5" />
            Freelancer Applications
          </Link>
          <Link href="/admin/domain-add-ons" className="p-6 rounded-2xl bg-emerald-600 text-white font-bold flex items-center gap-3">
            <Settings2 className="w-5 h-5" />
            Domain Add-ons
          </Link>
        </div>
      </div>
    </div>
  )
}
