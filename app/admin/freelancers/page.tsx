"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { getFreelancerAccessToken } from "@/lib/freelancerAuth"

type ApplicationStatus = "pending" | "approved" | "rejected"

type FreelancerApplication = {
  id: number
  user_id: string | null
  name: string
  email: string
  role: string
  message: string
  bio: string | null
  profile_image: string | null
  phone: string | null
  github: string | null
  status: ApplicationStatus
  created_at: string
  title_en?: string | null
  title_so?: string | null
  title_ar?: string | null
  bio_en?: string | null
  bio_so?: string | null
  bio_ar?: string | null
}

type Message = {
  id: string
  sender_id: string
  receiver_id: string
  message: string
  created_at: string
}

type TranslationDraft = {
  title_en: string
  title_so: string
  title_ar: string
  bio_en: string
  bio_so: string
  bio_ar: string
}

export default function AdminFreelancersPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<FreelancerApplication[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [drafts, setDrafts] = useState<Record<number, TranslationDraft>>({})
  const [actionId, setActionId] = useState<number | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [adminUserId, setAdminUserId] = useState("")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selected = useMemo(
    () => applications.find((item) => item.id === selectedId) ?? null,
    [applications, selectedId]
  )

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

    setAdminUserId(session.user.id)
    return headers
  }, [router])

  const fetchApplications = useCallback(async () => {
    setLoading(true)
    setError(null)

    const headers = await getHeaders()
    if (!headers) {
      return
    }

    try {
      const response = await fetch("/api/freelancer-applications", {
        cache: "no-store",
        headers,
      })

      const json = (await response.json().catch(() => null)) as { error?: string; data?: FreelancerApplication[] } | null
      if (!response.ok) {
        throw new Error(json?.error || "Failed to load freelancer applications")
      }

      const rows = json?.data ?? []
      setApplications(rows)
      setDrafts(
        rows.reduce<Record<number, TranslationDraft>>((acc, row) => {
          acc[row.id] = {
            title_en: row.title_en ?? row.role,
            title_so: row.title_so ?? "",
            title_ar: row.title_ar ?? "",
            bio_en: row.bio_en ?? row.message,
            bio_so: row.bio_so ?? "",
            bio_ar: row.bio_ar ?? "",
          }
          return acc
        }, {})
      )

      setSelectedId((prev) => prev ?? rows[0]?.id ?? null)
    } catch (fetchError) {
      setApplications([])
      setError(fetchError instanceof Error ? fetchError.message : "Failed to load freelancer applications")
    } finally {
      setLoading(false)
    }
  }, [getHeaders])

  const fetchMessages = useCallback(async () => {
    if (!selected?.user_id) {
      setMessages([])
      return
    }

    const headers = await getHeaders()
    if (!headers) {
      return
    }

    try {
      const response = await fetch(`/api/messages?with=${encodeURIComponent(selected.user_id)}`, {
        cache: "no-store",
        headers,
      })
      const json = (await response.json().catch(() => null)) as { error?: string; data?: Message[] } | null

      if (!response.ok) {
        throw new Error(json?.error || "Failed to load messages")
      }

      setMessages(json?.data ?? [])
    } catch {
      setMessages([])
    }
  }, [getHeaders, selected?.user_id])

  useEffect(() => {
    void fetchApplications()
  }, [fetchApplications])

  useEffect(() => {
    void fetchMessages()
  }, [fetchMessages])

  const handleAction = async (action: "approve" | "reject") => {
    if (!selected) {
      return
    }

    setActionId(selected.id)
    setError(null)

    const headers = await getHeaders()
    if (!headers) {
      return
    }

    try {
      const response = await fetch(`/api/freelancer-applications/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify(
          action === "approve"
            ? {
              id: selected.id,
              ...(drafts[selected.id] ?? {
                title_en: "",
                title_so: "",
                title_ar: "",
                bio_en: "",
                bio_so: "",
                bio_ar: "",
              }),
            }
            : { id: selected.id }
        ),
      })

      const json = (await response.json().catch(() => null)) as { error?: string } | null
      if (!response.ok) {
        throw new Error(json?.error || `Failed to ${action} freelancer`)
      }

      await fetchApplications()
      await fetchMessages()
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : `Failed to ${action} freelancer`)
    } finally {
      setActionId(null)
    }
  }

  const sendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selected?.user_id || !newMessage.trim()) {
      return
    }

    const headers = await getHeaders()
    if (!headers) {
      return
    }

    setSending(true)
    setError(null)

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify({ receiver_id: selected.user_id, message: newMessage.trim() }),
      })

      const json = (await response.json().catch(() => null)) as { error?: string } | null
      if (!response.ok) {
        throw new Error(json?.error || "Failed to send message")
      }

      setNewMessage("")
      await fetchMessages()
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Failed to send message")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Freelancer Applications</h1>
          <Link href="/admin/orders" className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-800 font-semibold">Back to Dashboard</Link>
        </div>

        {error ? <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</p> : null}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 border border-gray-100 dark:border-gray-800 rounded-2xl p-4">
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : applications.length === 0 ? (
              <p className="text-gray-500">No freelancer applications found.</p>
            ) : (
              <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {applications.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={`w-full text-left p-3 rounded-xl border ${item.id === selectedId ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-100 dark:border-gray-800"}`}
                  >
                    <p className="font-bold text-gray-900 dark:text-white">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.email}</p>
                    <p className="text-xs mt-1 capitalize">{item.status}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-2 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 space-y-4">
            {selected ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input value={drafts[selected.id]?.title_en ?? ""} onChange={(e) => setDrafts((prev) => ({ ...prev, [selected.id]: { ...(prev[selected.id] ?? { title_en: "", title_so: "", title_ar: "", bio_en: "", bio_so: "", bio_ar: "" }), title_en: e.target.value } }))} placeholder="Title (EN)" className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800" />
                  <input value={drafts[selected.id]?.title_so ?? ""} onChange={(e) => setDrafts((prev) => ({ ...prev, [selected.id]: { ...(prev[selected.id] ?? { title_en: "", title_so: "", title_ar: "", bio_en: "", bio_so: "", bio_ar: "" }), title_so: e.target.value } }))} placeholder="Title (SO)" className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800" />
                  <input value={drafts[selected.id]?.title_ar ?? ""} onChange={(e) => setDrafts((prev) => ({ ...prev, [selected.id]: { ...(prev[selected.id] ?? { title_en: "", title_so: "", title_ar: "", bio_en: "", bio_so: "", bio_ar: "" }), title_ar: e.target.value } }))} placeholder="Title (AR)" className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800" />
                  <input value={drafts[selected.id]?.bio_en ?? ""} onChange={(e) => setDrafts((prev) => ({ ...prev, [selected.id]: { ...(prev[selected.id] ?? { title_en: "", title_so: "", title_ar: "", bio_en: "", bio_so: "", bio_ar: "" }), bio_en: e.target.value } }))} placeholder="Bio (EN)" className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800" />
                  <input value={drafts[selected.id]?.bio_so ?? ""} onChange={(e) => setDrafts((prev) => ({ ...prev, [selected.id]: { ...(prev[selected.id] ?? { title_en: "", title_so: "", title_ar: "", bio_en: "", bio_so: "", bio_ar: "" }), bio_so: e.target.value } }))} placeholder="Bio (SO)" className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800" />
                  <input value={drafts[selected.id]?.bio_ar ?? ""} onChange={(e) => setDrafts((prev) => ({ ...prev, [selected.id]: { ...(prev[selected.id] ?? { title_en: "", title_so: "", title_ar: "", bio_en: "", bio_so: "", bio_ar: "" }), bio_ar: e.target.value } }))} placeholder="Bio (AR)" className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800" />
                </div>

                <div className="rounded-xl border border-gray-100 dark:border-gray-800 p-3">
                  <p className="font-semibold text-gray-900 dark:text-white mb-2">Freelancer Profile Preview</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Name: {selected.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Role: {selected.role}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Email: {selected.email}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Phone: {selected.phone || "-"}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">GitHub: {selected.github || "-"}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Message: {selected.message || "-"}</p>
                </div>

                <div className="flex gap-2">
                  <button type="button" onClick={() => void handleAction("approve")} disabled={selected.status !== "pending" || actionId === selected.id} className="px-4 py-2 rounded-xl bg-green-600 text-white font-bold disabled:opacity-50">Approve</button>
                  <button type="button" onClick={() => void handleAction("reject")} disabled={selected.status !== "pending" || actionId === selected.id} className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold disabled:opacity-50">Reject</button>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                  <p className="font-semibold text-gray-900 dark:text-white mb-2">Messages</p>
                  <div className="space-y-2 max-h-60 overflow-y-auto mb-3">
                    {messages.length === 0 ? (
                      <p className="text-sm text-gray-500">No messages yet.</p>
                    ) : (
                      messages.map((item) => {
                        const mine = item.sender_id === adminUserId
                        return (
                          <div key={item.id} className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${mine ? "ml-auto bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800"}`}>
                            <p className="whitespace-pre-wrap">{item.message}</p>
                          </div>
                        )
                      })
                    )}
                  </div>

                  <form onSubmit={sendMessage} className="space-y-2">
                    <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Reply to freelancer" className="w-full min-h-24 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800" />
                    <button type="submit" disabled={sending || !selected.user_id} className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold disabled:opacity-50">
                      {sending ? "Sending..." : "Send Reply"}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <p className="text-gray-500">Select a freelancer application.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
