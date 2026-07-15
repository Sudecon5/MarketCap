import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PUT(req: Request, { params }: { params: { symbol: string } }) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { shares, costBasis } = await req.json();
  if (!shares || Number(shares) <= 0 || costBasis === undefined || Number(costBasis) < 0) {
    return NextResponse.json({ error: "shares (>0) and costBasis are required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("holdings")
    .update({
      shares: Number(shares),
      cost_basis: Number(costBasis),
      updated_at: new Date().toISOString(),
    })
    .eq("symbol", params.symbol.toUpperCase());

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: { symbol: string } }) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { error } = await supabase
    .from("holdings")
    .delete()
    .eq("symbol", params.symbol.toUpperCase());

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
