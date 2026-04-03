"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import {
  clearFreelancerAuth,
  getFreelancerAccessToken,
  getFreelancerAuthHeaders,
} from "@/lib/freelancerAuth"

type FreelancerProfile = {
  id: number
  user_id: string | null
  name: string
  role: string | null
  bio: string | null
  profile_image: string | null
  phone: string | null
  github: string | null
  status: "pending" | "approved" | "rejected"
  email: string
}

export default function FreelancerDashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<FreelancerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [profileFile, setProfileFile] = useState<File | null>(null)

  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "")
      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsDataURL(file)
    })

  const fetchProfile = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const token = getFreelancerAccessToken()
      if (!token) {
        router.push("/freelancer/login")
        return
      }

      const response = await fetch("/api/freelancer/profile", {
        cache: "no-store",
        headers: getFreelancerAuthHeaders(),
      })

      if (response.status === 401) {
        clearFreelancerAuth()
        router.push("/freelancer/login")
        return
      }

      const json = (await response.json().catch(() => null)) as
        | { error?: string; profile?: FreelancerProfile | null }
        | null

      if (!response.ok) {
        throw new Error(json?.error || "Failed to load profile")
      }

      setProfile(json?.profile ?? null)
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Failed to load profile")
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    void fetchProfile()
  }, [fetchProfile])

  const handleProfileUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!profile) {
      return
    }

    const wasApproved = profile.status === "approved"

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      if (!profile.role?.trim() || !profile.phone?.trim() || !profile.github?.trim() || !profile.bio?.trim()) {
        throw new Error("Please fill role, phone, GitHub, and bio before submitting.")
      }

      const profileImagePayload = profileFile ? await fileToDataUrl(profileFile) : profile.profile_image

      if (!profileImagePayload?.trim()) {
        throw new Error("Please upload a profile image.")
      }

      const response = await fetch("/api/freelancer/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getFreelancerAuthHeaders(),
        },
        body: JSON.stringify({
          name: profile.name,
          role: profile.role,
          bio: profile.bio,
          phone: profile.phone,
          github: profile.github,
          profile_image: profileImagePayload,
        }),
      })

      const json = (await response.json().catch(() => null)) as { error?: string } | null
      if (!response.ok) {
        throw new Error(json?.error || "Failed to update profile")
      }

      setSuccess(
        wasApproved
          ? "Update submitted. Admin approval is required before new changes appear publicly."
          : "Application saved successfully."
      )
      setProfileFile(null)
      await fetchProfile()
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Delete your freelancer account permanently?")
    if (!confirmed) {
      return
    }

    setDeleting(true)
    setError(null)

    try {
      const response = await fetch("/api/freelancer/update", {
        method: "DELETE",
        headers: getFreelancerAuthHeaders(),
      })

      const json = (await response.json().catch(() => null)) as { error?: string } | null
      if (!response.ok) {
        throw new Error(json?.error || "Failed to delete account")
      }

      clearFreelancerAuth()
      router.push("/freelancer/login")
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete account")
    } finally {
      setDeleting(false)
    }
  }

  const handleLogout = async () => {
    clearFreelancerAuth()
    router.push("/freelancer/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 flex items-center justify-center text-gray-500">
        <Loader2 className="w-7 h-7 animate-spin" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 flex items-center justify-center text-gray-500">
        Freelancer profile not found.
      </div>
    )
  }

  const isApprovedProfile = profile.status === "approved"

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-xl p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">Freelancer Dashboard</h1>
            <p className="text-gray-500 mt-1">Status: <span className="font-bold capitalize">{profile.status}</span></p>
            <p className="text-sm text-gray-500 mt-1">Complete your freelancer application below.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/freelancer/dashboard/messages" className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold">Messages</Link>
            <button onClick={handleLogout} className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold">Logout</button>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 px-4 py-3">
          <p className="text-sm text-gray-700 dark:text-gray-200"><span className="font-semibold">Name:</span> {profile.name}</p>
          <p className="text-sm text-gray-700 dark:text-gray-200 mt-1"><span className="font-semibold">Email:</span> {profile.email}</p>
        </div>

        <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input required value={profile.name ?? ""} onChange={(e) => setProfile((prev) => (prev ? { ...prev, name: e.target.value } : prev))} placeholder="Name" className="md:col-span-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700" />
          <input required value={profile.role ?? ""} onChange={(e) => setProfile((prev) => (prev ? { ...prev, role: e.target.value } : prev))} placeholder="Role" className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700" />
          <input required value={profile.phone ?? ""} onChange={(e) => setProfile((prev) => (prev ? { ...prev, phone: e.target.value } : prev))} placeholder="Phone" className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700" />
          <input required value={profile.github ?? ""} onChange={(e) => setProfile((prev) => (prev ? { ...prev, github: e.target.value } : prev))} placeholder="GitHub" className="md:col-span-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700" />
          <input type="file" accept="image/*" onChange={(e) => setProfileFile(e.target.files?.[0] ?? null)} className="md:col-span-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700" />
          <textarea required value={profile.bio ?? ""} onChange={(e) => setProfile((prev) => (prev ? { ...prev, bio: e.target.value } : prev))} placeholder="Bio" className="md:col-span-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 min-h-28" />

          {profile.profile_image ? (
            <p className="md:col-span-2 text-xs text-gray-500">Current profile image is set.</p>
          ) : null}

          {error ? <p className="md:col-span-2 text-sm text-red-600 dark:text-red-400">{error}</p> : null}
          {success ? <p className="md:col-span-2 text-sm text-green-700 dark:text-green-300">{success}</p> : null}

          <div className="md:col-span-2 flex flex-wrap gap-3 mt-2">
            <button
              type="submit"
              disabled={saving}
              className={`px-6 py-3 rounded-xl text-white font-bold disabled:opacity-60 flex items-center gap-2 ${isApprovedProfile ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : isApprovedProfile ? "Update Application" : "Save Application"}
            </button>
            <button type="button" onClick={handleDeleteAccount} disabled={deleting} className="px-6 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 disabled:opacity-60">
              {deleting ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
