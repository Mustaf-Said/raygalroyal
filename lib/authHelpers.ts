import { UserRole } from "@/app/api/auth/me/route"

/**
 * Fetch current user's role from the auth/me API
 * Returns null if user is not authenticated
 */
export async function getUserRole(accessToken: string | null): Promise<UserRole | null> {
  if (!accessToken) {
    return null
  }

  try {
    const response = await fetch("/api/auth/me", {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      return null
    }

    const data = (await response.json()) as { success?: boolean; user?: { role?: UserRole } }
    return data.user?.role ?? null
  } catch {
    return null
  }
}

/**
 * Get the appropriate redirect URL based on user role and current locale
 * Handles multilingual routing (en, ar, so)
 */
export function getRedirectUrlByRole(role: UserRole, currentPathname: string = ""): string {
  // Extract locale from current pathname if present
  const localeMatch = currentPathname.match(/^\/(en|ar|so)(?:\/|$)/)
  const locale = localeMatch ? localeMatch[1] : ""
  const localePrefix = locale ? `/${locale}` : ""

  if (role === "admin") {
    return `${localePrefix}/admin`
  }

  return `${localePrefix}/freelancer/dashboard`
}

/**
 * Check if current pathname is an admin-only route
 */
export function isAdminRoute(pathname: string): boolean {
  const adminRoutes = ["/admin", "/admin/"]
  const normalized = pathname.replace(/^\/(en|ar|so)/, "") || "/"
  return adminRoutes.some((route) => normalized.startsWith(route))
}

/**
 * Check if current pathname is a freelancer-only route
 */
export function isFreelancerRoute(pathname: string): boolean {
  const freelancerRoutes = ["/freelancer/dashboard", "/freelancer/dashboard/"]
  const normalized = pathname.replace(/^\/(en|ar|so)/, "") || "/"
  return freelancerRoutes.some((route) => normalized.startsWith(route))
}
