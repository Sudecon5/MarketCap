// components/Navbar.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // 1. Get whoever's logged in right now
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    // 2. Keep it in sync on sign-in / sign-out / token refresh, in any tab
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh() // forces Server Components to re-read the (now cleared) cookie
  }

  if (loading) return null // or a skeleton

  return (
    <nav className="flex items-center justify-between p-4">
      <span className="font-bold">MarketCap</span>
      {user ? (
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{user.email}</span>
          <button onClick={handleSignOut} className="rounded bg-gray-900 px-3 py-1.5 text-white">
            Sign out
          </button>
        </div>
      ) : (
        <a href="/login" className="rounded bg-blue-600 px-3 py-1.5 text-white">
          Sign in
        </a>
      )}
    </nav>
  )
}