# MarketCap

A Google-Finance-style stock tracking app — live quotes, price charts, news, a
persisted watchlist and portfolio — restyled as a 3-column "Cyber Indigo"
dashboard with an embedded AI research assistant.

## What's included so far
- Next.js 14 (App Router) + TypeScript + Tailwind
- **Cyber Indigo theme**: deep indigo/violet gradient background, translucent
  glowing cards (`.glow-panel`), neon green/pink up/down indicators — see
  `tailwind.config.ts` (the `cyber.*` color tokens) and `app/globals.css`
  (`.glow-panel`, gradient body backgrounds). `ThemeProvider`/`ThemeToggle`
  switch between the default dark variant and a brighter variant of the same
  palette — there is no flat-gray fallback.
- `/` — **3-column dashboard** (`components/dashboard/DashboardShell.tsx`):
  - **Left**: portfolio link, watchlist quick-list, equity sectors with sparklines
    (`components/dashboard/LeftSidebar.tsx`)
  - **Center**: ticker search, a horizontally scrollable index tracker bar
    (S&P 500 / Dow / Nasdaq / Russell 2000 / VIX, via ETF proxies — see note
    below), and market news
  - **Right**: sticky "Research" AI assistant panel with starter prompt chips,
    scrollable message history, and a glowing input with mic + send
    (`components/dashboard/ResearchPanel.tsx`, backed by `app/api/research/route.ts` 
    powered by the lightning-fast free-tier **Groq API**)
  - Sidebars collapse to stacked blocks below the center column on mobile/tablet;
    full 3-column grid from `lg:` breakpoint up
- `/stock/[symbol]` — quote, day stats, price chart, recent company news, add-to-watchlist, add-to-portfolio
- `/watchlist`, `/portfolio`, `/login` — unchanged functionally, just re-themed
- Server-side Finnhub proxy so your API key never reaches the browser
- Supabase-backed watchlist and holdings (row-level security)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. **Finnhub**: get a free key at https://finnhub.io/register
3. **Supabase**: create a free project at https://supabase.com
   - In the SQL Editor, run the contents of `supabase/schema.sql`
   - Enable Email auth, add `http://localhost:3000/auth/callback` as a redirect URL
   - Copy your Project URL and anon key from Settings → API
4. **Groq** (powers the Research panel): Get a free developer API key at 
   https://console.groq.com/. Groq provides extremely low-latency, free access 
   to highly capable open-source models (like Llama 3). Without this, the Research 
   panel still renders but fails gracefully, showing a clear instruction error.
5. Copy the env template file and fill in your keys:
   ```bash
   cp .env.local.example .env.local
   ```
6. Run the dev server:
   ```bash
   npm run dev
   ```

## Not built yet (upcoming phases)
- Live price updates (WebSocket or polling) instead of on-load fetches
- Deployment to Vercel
- React Native (Expo) mobile app reusing this same backend
- Streaming responses in the Research panel (currently single request/response)

## Notes
- **Index tracker uses ETF proxies, not raw index symbols.** Finnhub's free
  tier doesn't grant access to symbols like `^GSPC` or `^DJI` — that's gated
  behind a paid plan. `SPY`/`DIA`/`QQQ`/`IWM`/`VIXY` track the same indices
  closely and work fine on the free tier. Swap these out in
  `components/dashboard/IndexTrackerBar.tsx` if you upgrade your Finnhub plan.
- **Sparklines are illustrative, not literal.** The mini sparklines on the
  sector list and index cards use a deterministic mock series
  (`lib/sparkline.ts`) shaped by the real % change direction — they convey
  "up-and-to-the-right" vs "down" correctly, but aren't plotting real intraday
  ticks (which Finnhub's free tier doesn't expose at that granularity either).
  The main `PriceChart.tsx` on the stock detail page is real historical data.
- Buying more shares of a symbol you already hold in `/portfolio` recalculates
  a weighted-average cost basis automatically rather than creating a duplicate row.
- If you have separate local `StockChart.tsx`/theme work in progress outside
  this scaffold, reconcile it against `PriceChart.tsx` and the new `cyber.*`
  Tailwind tokens — this pass assumes the file structure as it existed in this
  project so far.
- Magic-link emails come from Supabase's shared sender by default, which can be slow
  or land in spam — fine for development, worth configuring a custom SMTP provider
  before shipping to real users.
