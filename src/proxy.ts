import { type NextRequest, NextResponse } from "next/server"

const protectedRoutePrefixes = ["/dashboard"]

export function proxy(request: NextRequest) {
  const authGuardEnabled = process.env.NEXT_PUBLIC_AUTH_GUARD_ENABLED === "true"

  if (!authGuardEnabled) {
    return NextResponse.next()
  }

  const { pathname } = request.nextUrl
  const isProtectedRoute = protectedRoutePrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  )

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  const accessToken =
    request.cookies.get("token")?.value ??
    request.cookies.get("access_token")?.value

  if (!accessToken) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = "/login"
    loginUrl.searchParams.set("next", pathname)

    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
