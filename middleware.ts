import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect all admin routes
  if (pathname.startsWith("/admin")) {
    // Allow access to /admin/login without authentication
    if (pathname === "/admin/login" || pathname === "/admin/login/") {
      return NextResponse.next()
    }

    // Check for admin session cookie on protected routes
    const adminSession = request.cookies.get("admin_session")?.value?.trim()

    if (!adminSession) {
      // Redirect to login if no session
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
