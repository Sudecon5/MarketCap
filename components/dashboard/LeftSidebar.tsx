"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Sparkline from "@/components/Sparkline";
import { mockSeries } from "@/lib/sparkline";

const SECTORS = [
  { name: "Technology", change: 1.42 },
  { name: "Healthcare", change: -0.38 },
  { name: "Financials", change: 0.61 },
  { name: "Energy", change: -1.15 },
  { name: "Consumer Disc.", change: 0.94 },
  { name: "Industrials", change: 0.12 },
  { name: "Utilities", change: -0.22 },
];

export default function LeftSidebar() {
  const [signedIn, setSignedIn] = useState(false);
  const [watchlist, setWatchlist] = useState<string[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setSignedIn(!!data.user);
      if (data.user) {
        fetch("/api/watchlist")
          .then((r) => r.json())
          .then((json) => setWatchlist((json.watchlist ?? []).map((w: { symbol: string }) => w.symbol)));
      }
    });
  }, []);

  return (
    <aside className="space-y-4">
      {/* Portfolios */}
      <div className="glow-panel p-4">
        <h2 className="text-xs uppercase tracking-wide text-cyber-muted mb-3">Portfolios</h2>
        {signedIn ? (
          <Link
            href="/portfolio"
            className="flex items-center justify-between text-sm px-3 py-2 rounded-lg
                       hover:bg-cyber-panelHover transition-colors"
          >
            <span>My Portfolio</span>
            <span className="text-cyber-accent2">→</span>
          </Link>
        ) : (
          <Link href="/login" className="text-xs text-cyber-accent2 hover:underline">
            Sign in to view your portfolio
          </Link>
        )}
      </div>

      {/* Watchlists */}
      <div className="glow-panel p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs uppercase tracking-wide text-cyber-muted">Watchlist</h2>
          <Link href="/watchlist" className="text-[11px] text-cyber-accent2 hover:underline">
            View all
          </Link>
        </div>

        {!signedIn && (
          <p className="text-xs text-cyber-muted">
            <Link href="/login" className="text-cyber-accent2 hover:underline">
              Sign in
            </Link>{" "}
            to save stocks here.
          </p>
        )}

        {signedIn && watchlist.length === 0 && (
          <p className="text-xs text-cyber-muted">No saved stocks yet.</p>
        )}

        <ul className="space-y-1">
          {watchlist.slice(0, 6).map((symbol) => (
            <li key={symbol}>
              <Link
                href={`/stock/${symbol}`}
                className="flex items-center justify-between text-sm px-3 py-2 rounded-lg
                           hover:bg-cyber-panelHover transition-colors"
              >
                <span className="numeric">{symbol}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Equity Sectors */}
      <div className="glow-panel p-4">
        <h2 className="text-xs uppercase tracking-wide text-cyber-muted mb-3">Equity Sectors</h2>
        <ul className="space-y-2">
          {SECTORS.map((sector) => {
            const positive = sector.change >= 0;
            return (
              <li
                key={sector.name}
                className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-cyber-panelHover transition-colors"
              >
                <span className="text-sm text-cyber-text/90">{sector.name}</span>
                <div className="flex items-center gap-2">
                  <Sparkline
                    values={mockSeries(sector.name, 16, positive ? 0.3 : -0.3)}
                    width={56}
                    height={20}
                    positive={positive}
                  />
                  <span
                    className={`numeric text-xs w-14 text-right ${
                      positive ? "text-cyber-neonGreen" : "text-cyber-neonPink"
                    }`}
                  >
                    {positive ? "+" : ""}
                    {sector.change.toFixed(2)}%
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
