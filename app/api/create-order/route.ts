import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

type ProjectOrderInsert = Database["public"]["Tables"]["project_orders"]["Insert"]
type CreateOrderBody = ProjectOrderInsert & { id?: string | null }
const MIN_CUSTOM_AMOUNT = 10

export async function POST(req: Request) {
  const body = (await req.json()) as CreateOrderBody

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const orderId = typeof body.id === "string" && body.id.trim().length > 0 ? body.id : null
  const payload: ProjectOrderInsert = { ...body }
  delete (payload as { id?: string | null }).id

  if (payload.plan === "support") {
    const amount = Number(payload.custom_amount)

    if (!Number.isFinite(amount) || amount < MIN_CUSTOM_AMOUNT) {
      return Response.json(
        { error: `Invalid custom amount. Minimum is ${MIN_CUSTOM_AMOUNT}.` },
        { status: 400 }
      )
    }

    payload.custom_amount = amount
    payload.amount = amount
    payload.currency = "SEK"
    payload.status = payload.status ?? "pending"
  }

  let query
  if (orderId) {
    query = supabase
      .from("project_orders")
      .update(payload)
      .eq("id", orderId)
      .select()
      .single()
  } else {
    query = supabase
      .from("project_orders")
      .insert(payload)
      .select()
      .single()
  }

  const { data, error } = await query

  if (error) {
    const errorMessage = error.message || "Failed to create order"
    const customAmountColumnMissing =
      (error.code === "42703" && errorMessage.toLowerCase().includes("custom_amount")) ||
      errorMessage.toLowerCase().includes("custom_amount")

    if (customAmountColumnMissing) {
      return Response.json(
        {
          error: "Database schema missing project_orders.custom_amount column",
          details: "Run supabase_setup.sql to add custom_amount before using the Support plan.",
          code: error.code,
        },
        { status: 500 }
      )
    }

    return Response.json(
      {
        error: errorMessage,
        details: error.details,
        code: error.code,
      },
      { status: 500 }
    )
  }

  return Response.json({ data })
}
