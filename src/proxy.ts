import { NextRequest, NextResponse } from "next/server"

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "tiendamas.vip"

const RESERVED_SUBDOMAINS = new Set([
  "www",
  "api",
  "admin",
  "dashboard",
  "app",
  "mail",
  "email",
  "ftp",
  "blog",
  "shop",
  "tienda",
  "tiendas",
  "static",
  "cdn",
  "assets",
  "media",
  "images",
  "help",
  "support",
  "docs",
  "status",
])

function extractTenantSubdomain(host: string): string | null {
  const hostname = host.split(":")[0].toLowerCase()
  if (hostname === ROOT_DOMAIN) return null
  if (!hostname.endsWith(`.${ROOT_DOMAIN}`)) return null
  const sub = hostname.slice(0, hostname.length - ROOT_DOMAIN.length - 1)
  if (!sub || sub.includes(".")) return null
  if (RESERVED_SUBDOMAINS.has(sub)) return null
  return sub
}

const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/orders",
  "/customers",
  "/inventory",
  "/stats",
  "/settings",
  "/pedidos",
  "/favorites",
  "/favoritos",
  "/perfil",
]
const authRoutes = ["/signin", "/signup"]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1) Si viene del Cloudflare Worker, usa el header (preferido).
  // 2) Si no, intenta extraer del host (cuando el wildcard sí llega directo).
  const workerSub = request.headers.get("x-tenant-subdomain")
  const host = request.headers.get("host") ?? ""
  const tenantSub =
    (workerSub && !RESERVED_SUBDOMAINS.has(workerSub.toLowerCase())
      ? workerSub.toLowerCase()
      : null) ?? extractTenantSubdomain(host)

  if (tenantSub && !pathname.startsWith("/_next") && !pathname.startsWith("/api")) {
    const url = request.nextUrl.clone()
    url.pathname = `/s/${tenantSub}${pathname === "/" ? "" : pathname}`
    return NextResponse.rewrite(url)
  }

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
