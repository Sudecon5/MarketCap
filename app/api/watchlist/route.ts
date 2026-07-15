import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ watchlist: [] });

  const { data, error } = await supabase
    .from("watchlist")
    .select("symbol, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ watchlist: data });
}

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { symbol } = await req.json();
  if (!symbol) return NextResponse.json({ error: "symbol is required" }, { status: 400 });

  const { error } = await supabase
    .from("watchlist")
    .insert({ user_id: userData.user.id, symbol: symbol.toUpperCase() });

  // Unique constraint violation just means it's already saved — treat as success.
  if (error && error.code !== "23505") {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
