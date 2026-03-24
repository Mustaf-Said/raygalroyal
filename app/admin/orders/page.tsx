"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Loader2, Filter, CreditCard, ShoppingCart, ArrowLeft, CreditCard as PaymentIcon, Users } from "lucide-react"

type ApplicationStatus = "pending" | "approved" | "rejected"

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

type FreelancerApplication = {
  id: number
  name: string
  email: string
  role: string
  message: string
  status: ApplicationStatus
  created_at: string
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")
  const [providerFilter, setProviderFilter] = useState("all")
  const [applications, setApplications] = useState<FreelancerApplication[]>([])
  const [applicationsLoading, setApplicationsLoading] = useState(true)
  const [applicationFilter, setApplicationFilter] = useState<"all" | ApplicationStatus>("all")
  const [actionApplicationId, setActionApplicationId] = useState<number | null>(null)
  const [actionStatus, setActionStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const router = useRouter()

  // Refs for scroll navigation
  const paymentsRef = useRef<HTMLDivElement>(null)
  const applicationsRef = useRef<HTMLDivElement>(null)

  async function getAuthHeaders(): Promise<Record<string, string>> {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const headers: Record<string, string> = {}
    if (session?.access_token) {
      headers.Authorization = `Bearer ${session.access_token}`
    }

    return headers
  }

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

  async function fetchApplications() {
    setApplicationsLoading(true)
    setActionStatus(null)

    try {
      const authHeaders = await getAuthHeaders()
      const response = await fetch("/api/freelancer-applications", {
        cache: "no-store",
        headers: authHeaders,
      })
      const json = await response.json()

      if (!response.ok) {
        throw new Error(json?.error || "Failed to load freelancer applications")
      }

      setApplications((json?.data ?? []) as FreelancerApplication[])
    } catch (error) {
      setApplications([])
      setActionStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to load freelancer applications",
      })
    } finally {
      setApplicationsLoading(false)
    }
  }

  async function handleApplicationAction(id: number, action: "approve" | "reject") {
    setActionApplicationId(id)
    setActionStatus(null)

    try {
      const authHeaders = await getAuthHeaders()
      const response = await fetch(`/api/freelancer-applications/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify({ id }),
      })

      const json = await response.json()
      if (!response.ok) {
        throw new Error(json?.error || `Failed to ${action} application`)
      }

      setActionStatus({
        type: "success",
        message: action === "approve" ? "Application approved successfully." : "Application rejected successfully.",
      })

      await fetchApplications()
    } catch (error) {
      setActionStatus({
        type: "error",
        message: error instanceof Error ? error.message : `Failed to ${action} application`,
      })
    } finally {
      setActionApplicationId(null)
    }
  }

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push("/admin/login")
      } else {
        fetchOrders()
        fetchApplications()
      }
    }
    checkUser()
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [statusFilter, providerFilter])

  const filteredApplications =
    applicationFilter === "all"
      ? applications
      : applications.filter((application) => application.status === applicationFilter)

  const badgeClassName = (status: ApplicationStatus) => {
    if (status === "approved") return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
    if (status === "pending") return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
    return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
  }

  const scrollToSection = (ref: React.RefObject<HTMLDivElement> | null) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* HEADER WITH NAVIGATION */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
              <p className="text-gray-500">Manage your project orders and track payments.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* NAVIGATION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => scrollToSection(paymentsRef as React.RefObject<HTMLDivElement>)}
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <PaymentIcon className="w-5 h-5" />
              Payments
            </button>
            <button
              onClick={() => scrollToSection(applicationsRef as React.RefObject<HTMLDivElement>)}
              className="flex-1 px-6 py-3 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5" />
              Freelancer Applications
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto p-8">
        {/* PAYMENTS SECTION */}
        <div ref={paymentsRef} className="scroll-mt-32">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Payments & Orders</h2>
            <p className="text-gray-500">Track all project orders and payment statuses.</p>
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

          {/* ORDERS TABLE */}
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
                              <div className="text-xs text-gray-400 truncate max-w-25">
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

        {/* FREELANCER APPLICATIONS SECTION */}
        <div ref={applicationsRef} className="mt-16 scroll-mt-32">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Freelancer Applications</h2>
            <p className="text-gray-500">Review pending applications and approve or reject them.</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-4xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Manage freelancer applications</p>
              </div>

              <select
                value={applicationFilter}
                onChange={(event) => setApplicationFilter(event.target.value as "all" | ApplicationStatus)}
                className="bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none"
              >
                <option value="all">All statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {actionStatus ? (
              <div className={`mx-6 mt-6 rounded-xl px-4 py-3 text-sm font-semibold ${actionStatus.type === "success"
                ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                }`}>
                {actionStatus.message}
              </div>
            ) : null}

            {applicationsLoading ? (
              <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin" />
                <p>Loading applications...</p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="p-20 text-center text-gray-500">No freelancer applications found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <th className="px-6 py-5 font-bold text-gray-500 text-sm uppercase">Name</th>
                      <th className="px-6 py-5 font-bold text-gray-500 text-sm uppercase">Email</th>
                      <th className="px-6 py-5 font-bold text-gray-500 text-sm uppercase">Role</th>
                      <th className="px-6 py-5 font-bold text-gray-500 text-sm uppercase">Status</th>
                      <th className="px-6 py-5 font-bold text-gray-500 text-sm uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                    {filteredApplications.map((application) => {
                      const isPending = application.status === "pending"
                      const isBusy = actionApplicationId === application.id

                      return (
                        <tr key={application.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                          <td className="px-6 py-5 font-bold text-gray-900 dark:text-white">{application.name}</td>
                          <td className="px-6 py-5 text-gray-600 dark:text-gray-400">{application.email}</td>
                          <td className="px-6 py-5 text-gray-600 dark:text-gray-400 capitalize">{application.role}</td>
                          <td className="px-6 py-5">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${badgeClassName(application.status)}`}>
                              {application.status}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => handleApplicationAction(application.id, "approve")}
                                disabled={!isPending || isBusy}
                                className="px-4 py-2 rounded-xl bg-green-600 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isBusy ? "Working..." : "Approve"}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleApplicationAction(application.id, "reject")}
                                disabled={!isPending || isBusy}
                                className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
