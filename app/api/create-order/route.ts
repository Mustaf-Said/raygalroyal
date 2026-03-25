import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

type ProjectOrderInsert = Database["public"]["Tables"]["project_orders"]["Insert"]
type CreateOrderBody = ProjectOrderInsert & { id?: string | null }

export async function POST(req: Request) {
  const body = (await req.json()) as CreateOrderBody

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const orderId = typeof body.id === "string" && body.id.trim().length > 0 ? body.id : null
  const payload: ProjectOrderInsert = { ...body }
  delete (payload as { id?: string | null }).id

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
    return Response.json({ error }, { status: 500 })
  }

  return Response.json({ data })
}
