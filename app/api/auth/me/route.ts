import { NextRequest, NextResponse } from "next/server"
import { requireUserFromRequest, isAdminUser } from "@/lib/requestAuth"

export type UserRole = "admin" | "freelancer"

export interface AuthMeResponse {
  success: true
  user: {
    id: string
    email: string | undefined
    role: UserRole
  }
}

export async function GET(req: NextRequest): Promise<NextResponse<AuthMeResponse | { error: string }>> {
  const auth = await requireUserFromRequest(req)
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const role: UserRole = isAdminUser(auth.user) ? "admin" : "freelancer"

  return NextResponse.json({
    success: true,
    user: {
      id: auth.user.id,
      email: auth.user.email,
      role,
    },
  })
}
