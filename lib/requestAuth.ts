import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { User } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

type RequireUserResult =
  | { ok: true; user: User; token: string }
  | { ok: false; response: NextResponse }

const getAdminEmails = () => {
  const values = [process.env.ADMIN_EMAIL, process.env.ADMIN_EMAILS]
    .filter(Boolean)
    .flatMap((value) => String(value).split(","))
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)

  return Array.from(new Set(values))
}

const authClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function requireUserFromRequest(req: NextRequest): Promise<RequireUserResult> {
  const authHeader = req.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Missing bearer token" }, { status: 401 }),
    }
  }

  const token = authHeader.slice(7).trim()
  if (!token) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Invalid bearer token" }, { status: 401 }),
    }
  }

  const { data, error } = await authClient.auth.getUser(token)
  if (error || !data.user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    }
  }

  return { ok: true, user: data.user, token }
}

export const isAdminUser = (user: User) => {
  const adminEmails = getAdminEmails()
  const userEmail = user.email?.toLowerCase()

  if (adminEmails.length > 0) {
    return !!userEmail && adminEmails.includes(userEmail)
  }

  const roleFromMetadata =
    (typeof user.app_metadata?.role === "string" && user.app_metadata.role) || ""

  return roleFromMetadata.toLowerCase() === "admin"
}
