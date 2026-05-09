import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"
import { isAdminUser, requireUserFromRequest } from "@/lib/requestAuth"
import { sendAdminNotification } from "@/lib/email/sendAdminNotification"

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const getAdminEmails = () => {
  const values = [process.env.ADMIN_EMAIL, process.env.ADMIN_EMAILS]
    .filter(Boolean)
    .flatMap((value) => String(value).split(","))
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)

  return Array.from(new Set(values))
}

const getAdminUserIds = async () => {
  const adminEmails = getAdminEmails()
  if (adminEmails.length === 0) {
    return [] as string[]
  }

  const adminIds = new Set<string>()
  let page = 1

  while (page <= 10) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 })
    if (error) {
      throw new Error(error.message)
    }

    if (!data?.users?.length) {
      break
    }

    for (const user of data.users) {
      const email = user.email?.toLowerCase()
      if (email && adminEmails.includes(email)) {
        adminIds.add(user.id)
      }
    }

    if (data.users.length < 200) {
      break
    }

    page += 1
  }

  return Array.from(adminIds)
}

export async function GET(req: NextRequest) {
  const auth = await requireUserFromRequest(req)
  if (!auth.ok) {
    return auth.response
  }

  const admin = isAdminUser(auth.user)
  const withUserId = req.nextUrl.searchParams.get("with")?.trim()

  try {
    let query = supabase
      .from("messages")
      .select("id, sender_id, receiver_id, message, created_at")
      .order("created_at", { ascending: true })

    if (admin && withUserId) {
      query = query.or(
        `and(sender_id.eq.${auth.user.id},receiver_id.eq.${withUserId}),and(sender_id.eq.${withUserId},receiver_id.eq.${auth.user.id})`
      )
    } else {
      query = query.or(`sender_id.eq.${auth.user.id},receiver_id.eq.${auth.user.id}`)
    }

    const { data, error } = await query
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const adminUserIds = await getAdminUserIds()
    return NextResponse.json({ data: data ?? [], adminUserIds })
  } catch {
    return NextResponse.json({ error: "Failed to load messages" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireUserFromRequest(req)
  if (!auth.ok) {
    return auth.response
  }

  try {
    const body = (await req.json()) as { receiver_id?: string; message?: string }

    const receiverId = typeof body.receiver_id === "string" ? body.receiver_id.trim() : ""
    const message = typeof body.message === "string" ? body.message.trim() : ""

    if (!receiverId || !message) {
      return NextResponse.json({ error: "receiver_id and message are required" }, { status: 400 })
    }

    const admin = isAdminUser(auth.user)

    if (!admin) {
      const { data: freelancer, error: freelancerError } = await supabase
        .from("freelancers")
        .select("status")
        .eq("user_id", auth.user.id)
        .limit(1)
        .maybeSingle()

      if (freelancerError) {
        return NextResponse.json({ error: freelancerError.message }, { status: 500 })
      }

      if (!freelancer || freelancer.status !== "approved") {
        return NextResponse.json(
          { error: "Freelancer messages are only available after approval" },
          { status: 403 }
        )
      }

      const adminUserIds = await getAdminUserIds()
      if (!adminUserIds.includes(receiverId)) {
        return NextResponse.json({ error: "Freelancers can only message admin" }, { status: 403 })
      }
    }

    const { error } = await supabase.from("messages").insert({
      sender_id: auth.user.id,
      receiver_id: receiverId,
      message,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!admin) {
      await sendAdminNotification({ type: "freelancer_message" })
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
