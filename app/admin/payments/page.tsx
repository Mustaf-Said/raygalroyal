"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { getFreelancerAccessToken } from "@/lib/freelancerAuth"

type Order = {
  id: string
  customer_email: string
  plan: string
  service: string
  provider: string
  status: string
  amount: number | null
  payment_id: string | null
}

export default function AdminPaymentsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [providerFilter, setProviderFilter] = useState("all")

  const getHeaders = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.access_token) {
      if (getFreelancerAccessToken()) {
        router.push("/freelancer/dashboard")
      } else {
        router.push("/admin/login")
      }
      return null
    }

    const headers = { Authorization: `Bearer ${session.access_token}` }
    const adminCheck = await fetch("/api/freelancers?admin=1", { cache: "no-store", headers })

    if (adminCheck.status === 403) {
      router.push("/freelancer/dashboard")
      return null
    }

    if (!adminCheck.ok) {
      await supabase.auth.signOut()
      router.push("/admin/login")
      return null
    }

    return headers
  }, [router])

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    const headers = await getHeaders()
    if (!headers) {
      return
    }

    try {
      const params = new URLSearchParams({ status: statusFilter, provider: providerFilter })
      const response = await fetch(`/api/admin/orders?${params.toString()}`, {
        cache: "no-store",
        headers,
      })

      const json = (await response.json().catch(() => null)) as { data?: Order[] } | null
      if (!response.ok) {
        throw new Error("Failed to load orders")
      }

      setOrders(json?.data ?? [])
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [getHeaders, providerFilter, statusFilter])

  useEffect(() => {
    void fetchOrders()
  }, [fetchOrders])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Payments</h1>
          <Link href="/admin/orders" className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-800 font-semibold">Back to Dashboard</Link>
        </div>

        <div className="flex gap-3 mb-6">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800">
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
          <select value={providerFilter} onChange={(e) => setProviderFilter(e.target.value)} className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800">
            <option value="all">All Providers</option>
            <option value="stripe">Stripe</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="py-3">Customer</th>
                  <th className="py-3">Plan</th>
                  <th className="py-3">Service</th>
                  <th className="py-3">Provider</th>
                  <th className="py-3">Amount</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Payment ID</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 dark:border-gray-800/50">
                    <td className="py-3">{order.customer_email}</td>
                    <td className="py-3">{order.plan}</td>
                    <td className="py-3">{order.service}</td>
                    <td className="py-3 uppercase">{order.provider}</td>
                    <td className="py-3">{order.amount ? `$${order.amount}` : "-"}</td>
                    <td className="py-3 capitalize">{order.status}</td>
                    <td className="py-3">{order.payment_id || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
