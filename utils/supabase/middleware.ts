// utils/supabase/middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // 1. Create an initial response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. Initialize the modern server client with strict TypeScript typing
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        // We explicitly type the cookiesToSet array here
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          // Write to the incoming request (so subsequent Server Components can read them)
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          // Re-create the response with the updated request cookies
          supabaseResponse = NextResponse.next({
            request,
          })
          // Write to the outgoing response headers (so the browser gets the fresh cookies)
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. This call is critical. It decodes the cookie and, if expired, 
  // automatically contacts Supabase to issue a new one via setAll above.
  await supabase.auth.getUser()

  // 4. Return the exact response containing the mutated Cookie headers
  return supabaseResponse
}