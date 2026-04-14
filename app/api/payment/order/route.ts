import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

type OrderView = {
  id: string
  plan: string
  amount: number | null
  currency: string | null
  language: string | null
  status: string
  created_at: string | null
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("orderId")?.trim()

  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("project_orders")
    .select("id, plan, amount, currency, language, status, created_at")
    .eq("id", orderId)
    .single<OrderView>()

  if (error || !data) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  return NextResponse.json({ order: data })
}
