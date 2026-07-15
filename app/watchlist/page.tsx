"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Row = { symbol: string; c?: number; d?: number; dp?: number };

export default function WatchlistPage() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      setSignedIn(!!data.user);
      if (!data.user) {
        setLoading(false);
        return;
      }
      await loadWatchlist();
    });
  }, []);

  async function loadWatchlist() {
    setLoading(true);
    const res = await fetch("/api/watchlist");
    const json = await res.json();
    const symbols: string[] = (json.watchlist ?? []).map((w: { symbol: string }) => w.symbol);

    const withQuotes = await Promise.all(
      symbols.map(async (symbol) => {
        try {
          const q = await fetch(`/api/quote?symbol=${symbol}`).then((r) => r.json());
          return { symbol, c: q.c, d: q.d, dp: q.dp };
        } catch {
          return { symbol };
        }
      })
    );
    setRows(withQuotes);
    setLoading(false);
  }

  async function remove(symbol: string) {
    setRows((prev) => prev.filter((r) => r.symbol !== symbol));
    await fetch(`/api/watchlist/${symbol}`, { method: "DELETE" });
  }

  if (signedIn === false) {
    return (
      <div className="text-center mt-16">
        <p className="text-muted text-sm mb-4">Sign in to build and save a watchlist.</p>
        <Link href="/login" className="text-accent hover:underline text-sm">
          Sign in →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto w-full">
      <h1 className="text-2xl font-semibold mb-6">Watchlist</h1>

      {loading && <p className="text-muted text-sm">Loading...</p>}

      {!loading && rows.length === 0 && (
        <div className="border border-dashed border-line rounded-lg p-8 text-center text-muted text-sm">
          Your watchlist is empty.{" "}
          <Link href="/" className="text-accent hover:underline">
            Search for a stock
          </Link>{" "}
          to add one.
        </div>
      )}

      {!loading && rows.length > 0 && (
        <div className="border border-line rounded-lg divide-y divide-line overflow-hidden">
          {rows.map((row) => {
            const isUp = (row.d ?? 0) >= 0;
            return (
              <div key={row.symbol} className="flex items-center justify-between px-4 py-3 bg-panel">
                <Link href={`/stock/${row.symbol}`} className="numeric font-medium hover:text-accent">
                  {row.symbol}
                </Link>
                <div className="flex items-center gap-4">
                  {row.c !== undefined ? (
                    <>
                      <span className="numeric text-sm">${row.c.toFixed(2)}</span>
                      <span className={`numeric text-xs w-16 text-right ${isUp ? "text-gain" : "text-loss"}`}>
                        {isUp ? "+" : ""}
                        {row.dp?.toFixed(2)}%
                      </span>
                    </>
                  ) : (
                    <span className="text-muted text-xs">—</span>
                  )}
                  <button
                    onClick={() => remove(row.symbol)}
                    className="text-muted hover:text-loss text-xs transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
