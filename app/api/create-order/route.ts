import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  const body = await req.json()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase
    .from("project_orders")
    .insert(body)
    .select()
    .single()

  if (error) {
    return Response.json({ error }, { status: 500 })
  }

  return Response.json({ data })
}
