// app/dashboard/page.tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // safe to query user-owned rows here — RLS will enforce ownership anyway
  return <div>Welcome back, {user.email}</div>
}