import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

type RequireAdminResult =
  | { ok: true }
  | { ok: false; response: NextResponse }

const getAdminEmails = () => {
  const values = [process.env.ADMIN_EMAIL, process.env.ADMIN_EMAILS]
    .filter(Boolean)
    .flatMap((value) => String(value).split(","))
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)

  return Array.from(new Set(values))
}

export async function requireAdminFromRequest(req: NextRequest): Promise<RequireAdminResult> {
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

  const authClient = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await authClient.auth.getUser(token)
  if (error || !data.user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    }
  }

  const adminEmails = getAdminEmails()
  const userEmail = data.user.email?.toLowerCase()

  if (adminEmails.length > 0) {
    if (!userEmail || !adminEmails.includes(userEmail)) {
      return {
        ok: false,
        response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      }
    }
    return { ok: true }
  }

  const roleFromMetadata =
    (typeof data.user.app_metadata?.role === "string" && data.user.app_metadata.role) || ""

  if (roleFromMetadata.toLowerCase() !== "admin") {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error:
            "Forbidden. Configure ADMIN_EMAIL or ADMIN_EMAILS in .env.local, or set user role metadata to admin.",
        },
        { status: 403 }
      ),
    }
  }

  return { ok: true }
}
