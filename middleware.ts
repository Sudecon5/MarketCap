// middleware.ts
import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Run our cookie refreshment utility on every request
  return await updateSession(request)
}

// This matcher blocks the middleware from running on static assets 
// (like images, CSS, JS) to keep your app fast.
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}