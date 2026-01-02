import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const protectedRoutes = [
    "/",
    "/trekkings",
    "/tours",
    "/accommodations",
    "/destinations",
    "/tailor-made",
    "/bookings",
    "/quotes",
    "/clients",
    "/affiliated",
    "/dinings",
    "/my-account",
    "/ratinghub",
    "/home-banners",
    "/destination-banners",
    "/about",
  ]

  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/",
    "/trekkings/:path*",
    "/tours/:path*",
    "/accommodations/:path*",
    "/destinations/:path*",
    "/tailor-made/:path*",
    "/quotes/:path*",
    "/bookings/:path*",
    "/clients/:path*",
    "/affiliated/:path*",
    "/dinings/:path*",
    "/my-account/:path*",
    "/ratinghub/:path*",
    "/home-banners/:path*",
    "/destination-banners/:path*",
    "/about/:path*",
  ],
}
