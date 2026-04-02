"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

type Freelancer = {
  id: number
  user_id: string | null
  name: string
  role: string
  bio: string | null
  profile_image: string | null
  phone: string | null
  github: string | null
  email: string
  status: "pending" | "approved" | "rejected"
  created_at: string
}

type Message = {
  id: string
  sender_id: string
  receiver_id: string
  message: string
  created_at: string
}

export default function AdminMessagesPage() {
  const router = useRouter()
  const [freelancers, setFreelancers] = useState<Freelancer[]>([])
  const [selectedFreelancerId, setSelectedFreelancerId] = useState<string>("")
  const [adminUserId, setAdminUserId] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function getAuthHeaders(): Promise<Record<string, string>> {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.access_token) {
      return {}
    }

    return { Authorization: `Bearer ${session.access_token}` }
  }

  const fetchFreelancers = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/admin/login")
        return
      }

      setAdminUserId(session.user.id)

      const response = await fetch("/api/freelancers?admin=1", {
        cache: "no-store",
        headers: await getAuthHeaders(),
      })

      const json = (await response.json().catch(() => null)) as { error?: string; data?: Freelancer[] } | null
      if (!response.ok) {
        throw new Error(json?.error || "Failed to load freelancers")
      }

      const rows = json?.data ?? []
      setFreelancers(rows)

      const firstFreelancerWithAccount = rows.find((item) => item.user_id)
      if (firstFreelancerWithAccount && !selectedFreelancerId) {
        setSelectedFreelancerId(firstFreelancerWithAccount.user_id as string)
      }
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Failed to load freelancers")
      setFreelancers([])
    } finally {
      setLoading(false)
    }
  }, [router, selectedFreelancerId])

  const fetchMessages = useCallback(async () => {
    if (!selectedFreelancerId) {
      setMessages([])
      return
    }

    setError(null)

    try {
      const response = await fetch(`/api/messages?with=${encodeURIComponent(selectedFreelancerId)}`, {
        cache: "no-store",
        headers: await getAuthHeaders(),
      })

      const json = (await response.json().catch(() => null)) as { error?: string; data?: Message[] } | null
      if (!response.ok) {
        throw new Error(json?.error || "Failed to load messages")
      }

      setMessages(json?.data ?? [])
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Failed to load messages")
      setMessages([])
    }
  }, [selectedFreelancerId])

  useEffect(() => {
    void fetchFreelancers()
  }, [fetchFreelancers])

  useEffect(() => {
    void fetchMessages()
  }, [fetchMessages])

  const updateFreelancerStatus = async (id: number, status: "approved" | "rejected") => {
    setError(null)

    try {
      const response = await fetch("/api/freelancers", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(await getAuthHeaders()),
        },
        body: JSON.stringify({ id, status }),
      })

      const json = (await response.json().catch(() => null)) as { error?: string } | null
      if (!response.ok) {
        throw new Error(json?.error || "Failed to update status")
      }

      await fetchFreelancers()
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : "Failed to update status")
    }
  }

  const sendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const messageText = newMessage.trim()
    if (!messageText || !selectedFreelancerId) {
      return
    }

    setSending(true)
    setError(null)

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(await getAuthHeaders()),
        },
        body: JSON.stringify({ receiver_id: selectedFreelancerId, message: messageText }),
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
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Freelancers</h1>
            <Link href="/admin/orders" className="text-sm text-blue-600 dark:text-blue-400 font-semibold">Back</Link>
          </div>

          {loading ? (
            <div className="text-gray-500 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Loading...</div>
          ) : freelancers.length === 0 ? (
            <p className="text-gray-500">No freelancers found.</p>
          ) : (
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              {freelancers.map((freelancer) => {
                const active = freelancer.user_id === selectedFreelancerId
                return (
                  <button
                    key={freelancer.id}
                    onClick={() => setSelectedFreelancerId(freelancer.user_id ?? "")}
                    className={`w-full text-left p-4 rounded-2xl border transition-colors ${active ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40"}`}
                  >
                    <p className="font-bold text-gray-900 dark:text-white">{freelancer.name}</p>
                    <p className="text-sm text-gray-500">{freelancer.role}</p>
                    <p className="text-xs text-gray-500 mt-1">{freelancer.email}</p>
                    <p className="text-xs text-gray-500">{freelancer.phone || "No phone"}</p>
                    <p className="text-xs text-gray-500 truncate">{freelancer.github || "No github"}</p>
                    <p className="text-xs mt-2 font-semibold capitalize">Status: {freelancer.status}</p>

                    <div className="flex gap-2 mt-3">
                      <span
                        onClick={(event) => {
                          event.stopPropagation()
                          void updateFreelancerStatus(freelancer.id, "approved")
                        }}
                        className="text-xs px-3 py-1 rounded-lg bg-green-600 text-white"
                      >
                        Approve
                      </span>
                      <span
                        onClick={(event) => {
                          event.stopPropagation()
                          void updateFreelancerStatus(freelancer.id, "rejected")
                        }}
                        className="text-xs px-3 py-1 rounded-lg bg-red-600 text-white"
                      >
                        Reject
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Admin Messages</h2>

          {selectedFreelancerId ? (
            <>
              <div className="space-y-3 mb-6 max-h-[52vh] overflow-y-auto">
                {messages.length === 0 ? (
                  <p className="text-gray-500">No messages yet.</p>
                ) : (
                  messages.map((item) => {
                    const mine = item.sender_id === adminUserId
                    return (
                      <div
                        key={item.id}
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${mine ? "ml-auto bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"}`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{item.message}</p>
                        <p className={`text-xs mt-2 ${mine ? "text-blue-100" : "text-gray-500"}`}>
                          {new Date(item.created_at).toLocaleString()}
                        </p>
                      </div>
                    )
                  })
                )}
              </div>

              <form onSubmit={sendMessage} className="space-y-3">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Write a message"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 min-h-24"
                />
                {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
                <button type="submit" disabled={sending} className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-60">
                  {sending ? "Sending..." : "Send"}
                </button>
              </form>
            </>
          ) : (
            <p className="text-gray-500">Select a freelancer account with a linked user to start messaging.</p>
          )}
        </div>
      </div>
    </div>
  )
}
