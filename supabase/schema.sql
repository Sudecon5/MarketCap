-- Run this in your Supabase project's SQL Editor (Dashboard → SQL Editor → New query)

create table if not exists public.watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  symbol text not null,
  created_at timestamptz not null default now(),
  unique (user_id, symbol)
);

alter table public.watchlist enable row level security;

-- Each user can only see, add, and remove their own watchlist rows.
create policy "Users can view their own watchlist"
  on public.watchlist for select
  using (auth.uid() = user_id);

create policy "Users can add to their own watchlist"
  on public.watchlist for insert
  with check (auth.uid() = user_id);

create policy "Users can remove from their own watchlist"
  on public.watchlist for delete
  using (auth.uid() = user_id);

-- Portfolio holdings: one row per symbol per user. Buying more shares of a
-- symbol you already hold updates this row's shares/cost_basis (weighted
-- average) via application logic rather than adding a duplicate row.
create table if not exists public.holdings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  symbol text not null,
  shares numeric not null check (shares > 0),
  cost_basis numeric not null check (cost_basis >= 0), -- average price paid per share
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, symbol)
);

alter table public.holdings enable row level security;

create policy "Users can view their own holdings"
  on public.holdings for select
  using (auth.uid() = user_id);

create policy "Users can add their own holdings"
  on public.holdings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own holdings"
  on public.holdings for update
  using (auth.uid() = user_id);

create policy "Users can remove their own holdings"
  on public.holdings for delete
  using (auth.uid() = user_id);
