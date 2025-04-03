import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define protected routes
const protectedRoutes = ["/", "/dashboard"]
// Define public routes
const publicRoutes = ["/login", "/signup"]

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.includes(path)
  // Check if the current route is public
  const isPublicRoute = publicRoutes.includes(path)

  // Get the session cookie - adjust the name based on your NestJS backend
  const sessionCookie = request.cookies.get("sessionId")?.value

  // If there's no session cookie and the route is protected, redirect to login
  if (isProtectedRoute && !sessionCookie) {
    const loginUrl = new URL("/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  // If there's a session cookie and the route is public (like login), redirect to dashboard
  // Note: This is a simple check. In a real app, you might want to validate the cookie
  if (isPublicRoute && sessionCookie) {
    console.log(sessionCookie)
    const dashboardUrl = new URL("/dashboard", request.url)
    return NextResponse.redirect(dashboardUrl)
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}

