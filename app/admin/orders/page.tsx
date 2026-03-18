"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Loader2, Filter, CreditCard, ShoppingCart } from "lucide-react"

type Order = {
  id: string
  plan: string
  description: string
  file_url: string
  customer_email: string
  service: string
  language: string
  provider: string
  status: string
  amount: number
  currency: string
  payment_id: string
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")
  const [providerFilter, setProviderFilter] = useState("all")
  const router = useRouter()

  async function fetchOrders() {
    setLoading(true)
    let query = supabase
      .from("project_orders")
      .select("id, plan, description, file_url, customer_email, service, language, status, amount, currency, provider, payment_id")

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter)
    }
    if (providerFilter !== "all") {
      query = query.eq("provider", providerFilter)
    }

    const { data } = await query
    if (data) setOrders(data as Order[])
    setLoading(false)
  }

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push("/admin/login")
      } else {
        fetchOrders()
      }
    }
    checkUser()
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [statusFilter, providerFilter])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-500">Manage your project orders and track payments.</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* FILTERS */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-4xl shadow-sm border border-gray-100 dark:border-gray-800 mb-8 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
              className="bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none"
            >
              <option value="all">All Providers</option>
              <option value="stripe">Stripe</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white dark:bg-gray-900 rounded-4xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
              <Loader2 className="w-10 h-10 animate-spin" />
              <p>Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-20 text-center text-gray-500">
              No orders found matching your filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <th className="px-6 py-5 font-bold text-gray-500 text-sm uppercase">Order</th>
                    <th className="px-6 py-5 font-bold text-gray-500 text-sm uppercase">Customer</th>
                    <th className="px-6 py-5 font-bold text-gray-500 text-sm uppercase">Plan</th>
                    <th className="px-6 py-5 font-bold text-gray-500 text-sm uppercase">Amount</th>
                    <th className="px-6 py-5 font-bold text-gray-500 text-sm uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${order.provider === "stripe" ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20" : "bg-amber-50 text-amber-600 dark:bg-amber-900/20"
                            }`}>
                            {order.provider === "stripe" ? <CreditCard className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 dark:text-white uppercase text-xs tracking-wider">
                              {order.provider}
                            </div>
                            <div className="text-xs text-gray-400 truncate max-w-[100px]">
                              {order.payment_id || order.id.slice(0, 8)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-bold text-gray-900 dark:text-white">{order.customer_email}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <span className="uppercase">{order.language}</span> • {order.service}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-gray-600 dark:text-gray-400">
                        <div className="font-bold capitalize">{order.plan}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-black text-gray-900 dark:text-white">
                          {order.amount ? `$${order.amount}` : "—"}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${order.status === "completed" || order.status === "paid"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                            : order.status === "pending"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                          }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
