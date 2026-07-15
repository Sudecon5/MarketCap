import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ holdings: [] });

  const { data, error } = await supabase
    .from("holdings")
    .select("symbol, shares, cost_basis, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ holdings: data });
}

// Records a "buy": adds shares to an existing holding (recalculating the
// weighted-average cost basis) or creates a new holding if none exists yet.
export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { symbol, shares, costBasis } = await req.json();
  const newShares = Number(shares);
  const newCost = Number(costBasis);

  if (!symbol || !newShares || newShares <= 0 || newCost < 0) {
    return NextResponse.json({ error: "symbol, shares (>0), and costBasis are required" }, { status: 400 });
  }

  const upperSymbol = symbol.toUpperCase();

  const { data: existing } = await supabase
    .from("holdings")
    .select("shares, cost_basis")
    .eq("symbol", upperSymbol)
    .maybeSingle();

  let totalShares = newShares;
  let avgCost = newCost;

  if (existing) {
    const priorShares = Number(existing.shares);
    const priorCost = Number(existing.cost_basis);
    totalShares = priorShares + newShares;
    // Weighted average of the old position and the new buy
    avgCost = (priorShares * priorCost + newShares * newCost) / totalShares;
  }

  const { error } = await supabase.from("holdings").upsert(
    {
      user_id: userData.user.id,
      symbol: upperSymbol,
      shares: totalShares,
      cost_basis: avgCost,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,symbol" }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, shares: totalShares, costBasis: avgCost });
}
