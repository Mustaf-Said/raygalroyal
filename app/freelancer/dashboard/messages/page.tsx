"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import {
  clearFreelancerAuth,
  getFreelancerAccessToken,
  getFreelancerAuthHeaders,
  getFreelancerUserId,
} from "@/lib/freelancerAuth"

type Message = {
  id: string
  sender_id: string
  receiver_id: string
  message: string
  created_at: string
}

export default function FreelancerMessagesPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [adminIds, setAdminIds] = useState<string[]>([])
  const [myUserId, setMyUserId] = useState<string>("")
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMessages = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const token = getFreelancerAccessToken()
      const userId = getFreelancerUserId()

      if (!token || !userId) {
        router.push("/freelancer/login")
        return
      }

      setMyUserId(userId)

      const response = await fetch("/api/messages", {
        cache: "no-store",
        headers: getFreelancerAuthHeaders(),
      })

      if (response.status === 401) {
        clearFreelancerAuth()
        router.push("/freelancer/login")
        return
      }

      const json = (await response.json().catch(() => null)) as
        | { error?: string; data?: Message[]; adminUserIds?: string[] }
        | null

      if (!response.ok) {
        throw new Error(json?.error || "Failed to load messages")
      }

      setMessages(json?.data ?? [])
      setAdminIds(json?.adminUserIds ?? [])
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Failed to load messages")
      setMessages([])
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    void fetchMessages()
  }, [fetchMessages])

  const sendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const messageText = newMessage.trim()
    if (!messageText) {
      return
    }

    const receiverId = adminIds[0]
    if (!receiverId) {
      setError("No admin account is configured for messaging.")
      return
    }

    setSending(true)
    setError(null)

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getFreelancerAuthHeaders(),
        },
        body: JSON.stringify({ receiver_id: receiverId, message: messageText }),
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
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Messages</h1>
          <Link href="/freelancer/dashboard" className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold">Back to Dashboard</Link>
        </div>

        {loading ? (
          <div className="text-gray-500 flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />Loading messages...</div>
        ) : (
          <div className="space-y-3 mb-6 max-h-105 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-gray-500">No messages yet.</p>
            ) : (
              messages.map((item) => {
                const mine = item.sender_id === myUserId
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
        )}

        <form onSubmit={sendMessage} className="space-y-3">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Write a message to admin"
            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 min-h-24"
          />
          {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
          <button
            type="submit"
            disabled={sending}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-60"
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  )
}
