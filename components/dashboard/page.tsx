import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Redirect to login if user session is not active
  if (!user) redirect('/login')

  // Logged-in view with Tailwind CSS styling
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <span className="text-xl font-bold tracking-tight text-blue-600">MarketCap</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden text-sm text-slate-500 md:inline-block">
                {user.email}
              </span>
              {/* Using a regular form action or button to trigger signout */}
              <form action="/auth/signout" method="post">
                <button 
                  type="submit" 
                  className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Content Space */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-600 uppercase tracking-wider">Overview</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Welcome back, {user.email?.split('@')[0]}
          </h1>
        </div>

        {/* Informational Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Card 1 */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <p className="text-sm font-medium text-slate-500">Portfolio Status</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">$24,500.00</p>
            <span className="inline-flex items-center mt-2 rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              +4.3% this week
            </span>
          </div>

          {/* Card 2 */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <p className="text-sm font-medium text-slate-500">Watchlist Alerts</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">3 Active</p>
            <span className="inline-flex items-center mt-2 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
              Markets Stable
            </span>
          </div>

          {/* Card 3 */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <p className="text-sm font-medium text-slate-500">Market Index</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">4,120.50</p>
            <span className="inline-flex items-center mt-2 rounded-md bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/10">
              -0.2% change
            </span>
          </div>

          {/* Card 4 */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <p className="text-sm font-medium text-slate-500">Linked Devices</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">Mobile Sync</p>
            <span className="inline-flex items-center mt-2 rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
              Connected
            </span>
          </div>

        </div>

        {/* Bottom Detailed Data Container */}
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-medium text-slate-900">Recent Asset Analysis</h2>
            <p className="text-sm text-slate-500">Row level security (RLS) handles data constraints safely for your account.</p>
          </div>
          <div className="flex min-h-[200px] items-center justify-center text-sm text-slate-400">
            [Chart or Data Tables can be rendered here]
          </div>
        </div>
      </main>
    </div>
  )
}