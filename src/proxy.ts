import { NextRequest, NextResponse } from "next/server"

const protectedRoutes = ["/dashboard", "/profile", "/orders", "/favorites"]
const authRoutes = ["/signin", "/signup"]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // next-auth v4 stores the session JWT in this cookie
  const sessionToken =
    request.cookies.get("next-auth.session-token") ??
    request.cookies.get("__Secure-next-auth.session-token")

  const isAuthenticated = !!sessionToken?.value

  if (isProtectedRoute && !isAuthenticated) {
    const signInUrl = new URL("/signin", request.url)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Google users need /signup?method=google to complete their profile even when authenticated
  const isGoogleOnboarding =
    pathname.startsWith("/signup") &&
    request.nextUrl.searchParams.get("method") === "google"

  if (isAuthRoute && isAuthenticated && !isGoogleOnboarding) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
