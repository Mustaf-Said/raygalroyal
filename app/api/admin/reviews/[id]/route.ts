import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { requireAdminFromRequest } from "@/lib/adminAuth"
import type { Database, ReviewStatus } from "@/lib/database.types"

type UpdateReviewBody = {
  admin_response?: string
  admin_response_en?: string
  admin_response_so?: string
  admin_response_ar?: string
  status?: ReviewStatus
  message_en?: string
  message_so?: string
  message_ar?: string
}

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const adminCheck = await requireAdminFromRequest(req)
  if (!adminCheck.ok) {
    return adminCheck.response
  }

  const { id } = await context.params
  if (!id) {
    return NextResponse.json({ error: "Invalid review id" }, { status: 400 })
  }

  try {
    const body = (await req.json()) as UpdateReviewBody
    const updates: Database["public"]["Tables"]["reviews"]["Update"] = {}

    const { data: currentReview, error: currentReviewError } = await supabase
      .from("reviews")
      .select("id, admin_response, admin_response_en, message_en")
      .eq("id", id)
      .single()

    if (currentReviewError || !currentReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    if (typeof body.admin_response === "string") {
      const adminResponse = body.admin_response.trim()
      updates.admin_response = adminResponse || null

      if (typeof body.admin_response_en !== "string") {
        updates.admin_response_en = adminResponse || null
      }
    }

    if (typeof body.admin_response_en === "string") {
      const adminResponseEn = body.admin_response_en.trim()
      updates.admin_response_en = adminResponseEn || null
      updates.admin_response = adminResponseEn || null
    }

    if (typeof body.admin_response_so === "string") {
      updates.admin_response_so = body.admin_response_so.trim() || null
    }

    if (typeof body.admin_response_ar === "string") {
      updates.admin_response_ar = body.admin_response_ar.trim() || null
    }

    if (typeof body.message_en === "string") {
      updates.message_en = body.message_en.trim()
      updates.message = body.message_en.trim()
    }

    if (typeof body.message_so === "string") {
      updates.message_so = body.message_so.trim()
    }

    if (typeof body.message_ar === "string") {
      updates.message_ar = body.message_ar.trim()
    }

    if (typeof body.status === "string") {
      if (body.status !== "pending" && body.status !== "approved") {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 })
      }

      const nextResponseText =
        typeof updates.admin_response_en === "string"
          ? updates.admin_response_en
          : (currentReview.admin_response_en ?? currentReview.admin_response)

      const nextEnglishMessage =
        typeof updates.message_en === "string"
          ? updates.message_en
          : currentReview.message_en ?? ""

      if (body.status === "approved" && !isNonEmptyString(nextResponseText)) {
        return NextResponse.json(
          { error: "Admin response is required before approval" },
          { status: 400 }
        )
      }

      if (body.status === "approved" && !isNonEmptyString(nextEnglishMessage)) {
        return NextResponse.json(
          { error: "English review message is required before approval" },
          { status: 400 }
        )
      }

      updates.status = body.status
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        {
          error:
            "Provide at least one field: admin_response, admin_response_en, admin_response_so, admin_response_ar, status, message_en, message_so, or message_ar",
        },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("reviews")
      .update(updates)
      .eq("id", id)
      .select("id, name, message, message_en, message_so, message_ar, rating, admin_response, admin_response_en, admin_response_so, admin_response_ar, status, created_at")
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 })
  }
}
