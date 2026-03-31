import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { Database, ReviewStatus } from "@/lib/database.types"

type ReviewInsert = Database["public"]["Tables"]["reviews"]["Insert"]

type CreateReviewBody = {
  name?: string
  message?: string
  rating?: number
  language?: "en" | "so" | "ar"
  website?: string
}

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0

const isValidRating = (value: unknown): value is number =>
  typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 5

const MAX_REVIEW_WORDS = 200

const countWords = (value: string): number => {
  const trimmed = value.trim()
  if (!trimmed) {
    return 0
  }

  return trimmed.split(/\s+/).length
}

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 5

type RateLimitEntry = {
  count: number
  windowStart: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

const getClientKey = (req: NextRequest): string => {
  const forwardedFor = req.headers.get("x-forwarded-for")
  const realIp = req.headers.get("x-real-ip")
  const userAgent = req.headers.get("user-agent") || "unknown-agent"
  const ip = forwardedFor?.split(",")[0]?.trim() || realIp || "unknown-ip"

  return `${ip}:${userAgent.slice(0, 80)}`
}

const isRateLimited = (clientKey: string): boolean => {
  const now = Date.now()

  if (rateLimitStore.size > 1000) {
    for (const [key, value] of rateLimitStore.entries()) {
      if (now - value.windowStart > RATE_LIMIT_WINDOW_MS) {
        rateLimitStore.delete(key)
      }
    }
  }

  const entry = rateLimitStore.get(clientKey)
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(clientKey, { count: 1, windowStart: now })
    return false
  }

  entry.count += 1
  rateLimitStore.set(clientKey, entry)

  return entry.count > RATE_LIMIT_MAX_REQUESTS
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("id, name, message, message_en, message_so, message_ar, rating, admin_response, status, created_at")
      .eq("status", "approved" satisfies ReviewStatus)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: data ?? [] })
  } catch {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const clientKey = getClientKey(req)
    if (isRateLimited(clientKey)) {
      return NextResponse.json(
        { error: "Too many review submissions. Please try again later." },
        { status: 429 }
      )
    }

    const body = (await req.json()) as CreateReviewBody

    // Honeypot field: real users never fill this field.
    if (typeof body.website === "string" && body.website.trim().length > 0) {
      return NextResponse.json({ success: true }, { status: 202 })
    }

    if (!isNonEmptyString(body.name) || !isNonEmptyString(body.message) || !isValidRating(body.rating)) {
      return NextResponse.json(
        { error: "Missing or invalid fields: name, message, rating (1-5)" },
        { status: 400 }
      )
    }

    const trimmedName = body.name.trim()
    const trimmedMessage = body.message.trim()

    if (trimmedName.length > 80 || trimmedMessage.length > 1500) {
      return NextResponse.json(
        { error: "Review is too long." },
        { status: 400 }
      )
    }

    if (countWords(trimmedMessage) > MAX_REVIEW_WORDS) {
      return NextResponse.json(
        { error: `Review must be ${MAX_REVIEW_WORDS} words or fewer.` },
        { status: 400 }
      )
    }

    const language = body.language === "so" || body.language === "ar" ? body.language : "en"

    const payload: ReviewInsert = {
      name: trimmedName,
      message: trimmedMessage,
      message_en: language === "en" ? trimmedMessage : "",
      message_so: language === "so" ? trimmedMessage : "",
      message_ar: language === "ar" ? trimmedMessage : "",
      rating: body.rating,
      status: "pending",
      admin_response: null,
    }

    const { data, error } = await supabase
      .from("reviews")
      .insert(payload)
      .select("id, name, message, message_en, message_so, message_ar, rating, admin_response, status, created_at")
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 })
  }
}
