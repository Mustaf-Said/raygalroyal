"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { clearAdminAuth, getAdminAuthHeaders } from "@/lib/adminClientAuth"
import { getFreelancerAccessToken } from "@/lib/freelancerAuth"

type ReviewStatus = "pending" | "approved"

type AdminReview = {
  id: string
  name: string
  message: string
  message_en: string | null
  message_so: string | null
  message_ar: string | null
  rating: number
  admin_response: string | null
  admin_response_en: string | null
  admin_response_so: string | null
  admin_response_ar: string | null
  status: ReviewStatus
}

type Draft = { en: string; so: string; ar: string }

export default function AdminReviewsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState<AdminReview[]>([])
  const [responseDrafts, setResponseDrafts] = useState<Record<string, Draft>>({})
  const [messageDrafts, setMessageDrafts] = useState<Record<string, Draft>>({})

  const getHeaders = useCallback(async () => {
    const headers = getAdminAuthHeaders()
    if (!headers.Authorization) {
      if (getFreelancerAccessToken()) {
        router.push("/freelancer/dashboard")
      } else {
        router.push("/admin/login")
      }
      return null
    }

    const adminCheck = await fetch("/api/freelancers?admin=1", { cache: "no-store", headers })

    if (adminCheck.status === 403) {
      router.push("/freelancer/dashboard")
      return null
    }

    if (!adminCheck.ok) {
      clearAdminAuth()
      router.push("/admin/login")
      return null
    }

    return headers
  }, [router])

  const fetchReviews = useCallback(async () => {
    setLoading(true)
    const headers = await getHeaders()
    if (!headers) {
      return
    }

    try {
      const response = await fetch("/api/admin/reviews", { cache: "no-store", headers })
      const json = (await response.json().catch(() => null)) as { data?: AdminReview[] } | null

      if (!response.ok) {
        throw new Error("Failed to load reviews")
      }

      const rows = json?.data ?? []
      setReviews(rows)
      setResponseDrafts(
        rows.reduce<Record<string, Draft>>((acc, review) => {
          const fallback = review.admin_response ?? ""
          acc[review.id] = {
            en: review.admin_response_en ?? fallback,
            so: review.admin_response_so ?? fallback,
            ar: review.admin_response_ar ?? fallback,
          }
          return acc
        }, {})
      )
      setMessageDrafts(
        rows.reduce<Record<string, Draft>>((acc, review) => {
          const fallback = review.message ?? ""
          acc[review.id] = {
            en: review.message_en ?? fallback,
            so: review.message_so ?? fallback,
            ar: review.message_ar ?? fallback,
          }
          return acc
        }, {})
      )
    } catch {
      setReviews([])
    } finally {
      setLoading(false)
    }
  }, [getHeaders])

  useEffect(() => {
    void fetchReviews()
  }, [fetchReviews])

  const updateReview = async (id: string, approve: boolean) => {
    const headers = await getHeaders()
    if (!headers) {
      return
    }

    const responseDraft = responseDrafts[id] ?? { en: "", so: "", ar: "" }
    const messageDraft = messageDrafts[id] ?? { en: "", so: "", ar: "" }

    await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify({
        admin_response: responseDraft.en,
        admin_response_en: responseDraft.en,
        admin_response_so: responseDraft.so,
        admin_response_ar: responseDraft.ar,
        message_en: messageDraft.en,
        message_so: messageDraft.so,
        message_ar: messageDraft.ar,
        ...(approve ? { status: "approved" } : {}),
      }),
    })

    await fetchReviews()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Review Management</h1>
          <Link href="/admin/orders" className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-800 font-semibold">Back to Dashboard</Link>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <p className="font-bold text-gray-900 dark:text-white">{review.name} ({review.rating}/5)</p>
                <p className="text-sm text-gray-500 mb-3 capitalize">Status: {review.status}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <input value={messageDrafts[review.id]?.en ?? ""} onChange={(e) => setMessageDrafts((prev) => ({ ...prev, [review.id]: { ...(prev[review.id] ?? { en: "", so: "", ar: "" }), en: e.target.value } }))} placeholder="Message EN" className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800" />
                  <input value={messageDrafts[review.id]?.so ?? ""} onChange={(e) => setMessageDrafts((prev) => ({ ...prev, [review.id]: { ...(prev[review.id] ?? { en: "", so: "", ar: "" }), so: e.target.value } }))} placeholder="Message SO" className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800" />
                  <input value={messageDrafts[review.id]?.ar ?? ""} onChange={(e) => setMessageDrafts((prev) => ({ ...prev, [review.id]: { ...(prev[review.id] ?? { en: "", so: "", ar: "" }), ar: e.target.value } }))} placeholder="Message AR" className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <input value={responseDrafts[review.id]?.en ?? ""} onChange={(e) => setResponseDrafts((prev) => ({ ...prev, [review.id]: { ...(prev[review.id] ?? { en: "", so: "", ar: "" }), en: e.target.value } }))} placeholder="Response EN" className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800" />
                  <input value={responseDrafts[review.id]?.so ?? ""} onChange={(e) => setResponseDrafts((prev) => ({ ...prev, [review.id]: { ...(prev[review.id] ?? { en: "", so: "", ar: "" }), so: e.target.value } }))} placeholder="Response SO" className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800" />
                  <input value={responseDrafts[review.id]?.ar ?? ""} onChange={(e) => setResponseDrafts((prev) => ({ ...prev, [review.id]: { ...(prev[review.id] ?? { en: "", so: "", ar: "" }), ar: e.target.value } }))} placeholder="Response AR" className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800" />
                </div>

                <div className="flex gap-2">
                  <button type="button" onClick={() => void updateReview(review.id, false)} className="px-4 py-2 rounded-xl bg-gray-800 text-white font-bold">Save</button>
                  <button type="button" onClick={() => void updateReview(review.id, true)} className="px-4 py-2 rounded-xl bg-green-600 text-white font-bold">Approve</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
