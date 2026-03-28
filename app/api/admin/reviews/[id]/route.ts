import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { requireAdminFromRequest } from "@/lib/adminAuth"
import type { Database, ReviewStatus } from "@/lib/database.types"

type UpdateReviewBody = {
  admin_response?: string
  status?: ReviewStatus
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
      .select("id, admin_response")
      .eq("id", id)
      .single()

    if (currentReviewError || !currentReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    if (typeof body.admin_response === "string") {
      updates.admin_response = body.admin_response.trim() || null
    }

    if (typeof body.status === "string") {
      if (body.status !== "pending" && body.status !== "approved") {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 })
      }

      const nextResponseText =
        typeof updates.admin_response === "string"
          ? updates.admin_response
          : currentReview.admin_response

      if (body.status === "approved" && !isNonEmptyString(nextResponseText)) {
        return NextResponse.json(
          { error: "Admin response is required before approval" },
          { status: 400 }
        )
      }

      updates.status = body.status
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "Provide at least one field: admin_response or status" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("reviews")
      .update(updates)
      .eq("id", id)
      .select("id, name, message, rating, admin_response, status, created_at")
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 })
  }
}
