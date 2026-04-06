"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { getFreelancerAccessToken } from "@/lib/freelancerAuth"

type AddOnRow = {
  id: "ssl" | "hosting" | "email"
  price: number
  enabled: boolean
  updated_at?: string
}

const ADD_ON_LABELS: Record<AddOnRow["id"], string> = {
  ssl: "SSL Certificate",
  hosting: "Web Hosting",
  email: "Business Email",
}

export default function AdminDomainAddOnsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [rows, setRows] = useState<AddOnRow[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

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

  const fetchAddOns = useCallback(async () => {
    setLoading(true)
    setError(null)
    const headers = await getHeaders()
    if (!headers) {
      return
    }

    try {
      const response = await fetch("/api/admin/domain-add-ons", { cache: "no-store", headers })
      const payload = (await response.json().catch(() => null)) as
        | { data?: AddOnRow[]; error?: string }
        | null

      if (!response.ok || !Array.isArray(payload?.data)) {
        throw new Error(payload?.error || "Failed to load add-ons")
      }

      setRows(payload.data)
    } catch (fetchError) {
      setRows([])
      setError(fetchError instanceof Error ? fetchError.message : "Failed to load add-ons")
    } finally {
      setLoading(false)
    }
  }, [getHeaders])

  useEffect(() => {
    void fetchAddOns()
  }, [fetchAddOns])

  const updatePrice = (id: AddOnRow["id"], value: string) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row
        const parsed = Number(value)
        return {
          ...row,
          price: Number.isFinite(parsed) && parsed >= 0 ? parsed : 0,
        }
      })
    )
  }

  const updateEnabled = (id: AddOnRow["id"], enabled: boolean) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, enabled } : row)))
  }

  const saveChanges = async () => {
    setSaving(true)
    setError(null)
    setSuccess(null)

    const headers = await getHeaders()
    if (!headers) {
      setSaving(false)
      return
    }

    try {
      const response = await fetch("/api/admin/domain-add-ons", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify({
          items: rows.map((row) => ({
            id: row.id,
            price: Number(row.price.toFixed(2)),
            enabled: row.enabled,
          })),
        }),
      })

      const payload = (await response.json().catch(() => null)) as
        | { data?: AddOnRow[]; error?: string }
        | null

      if (!response.ok || !Array.isArray(payload?.data)) {
        throw new Error(payload?.error || "Failed to save add-ons")
      }

      setRows(payload.data)
      setSuccess("Domain add-ons updated successfully.")
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save add-ons")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">Domain Add-ons</h1>
            <p className="text-gray-500 mt-1">Manage pricing and visibility for SSL, hosting, and email.</p>
          </div>
          <Link href="/admin/orders" className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-800 font-semibold">
            Back to Dashboard
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <>
            <div className="space-y-3 mb-5">
              {rows.map((row) => (
                <div
                  key={row.id}
                  className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-3 p-4 rounded-2xl border border-gray-100 dark:border-gray-800"
                >
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{ADD_ON_LABELS[row.id]}</p>
                    <p className="text-xs text-gray-500 mt-1">Code: {row.id}</p>
                  </div>

                  <label className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-300">
                    <span>Price (USD)</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={Number(row.price.toFixed(2))}
                      onChange={(e) => updatePrice(row.id, e.target.value)}
                      className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    />
                  </label>

                  <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={row.enabled}
                      onChange={(e) => updateEnabled(row.id, e.target.checked)}
                      className="accent-blue-600"
                    />
                    Enabled
                  </label>
                </div>
              ))}
            </div>

            {error && <p className="text-red-600 mb-3">{error}</p>}
            {success && <p className="text-green-600 mb-3">{success}</p>}

            <button
              type="button"
              onClick={() => void saveChanges()}
              disabled={saving || rows.length === 0}
              className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
