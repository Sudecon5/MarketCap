// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // This refreshes the session link if it has expired
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl

  // 1. If user IS NOT signed in and trying to access protected pages, redirect to /login
  const protectedRoutes = ['/portfolio', '/watchlist']
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (!session && isProtectedRoute) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/login'
    return NextResponse.redirect(redirectUrl)
  }

  // 2. If user IS signed in and trying to access /login, redirect them to home or dashboard
  if (session && pathname === '/login') {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/' // or /portfolio
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}