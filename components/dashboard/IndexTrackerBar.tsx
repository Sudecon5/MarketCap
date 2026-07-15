"use client";

import { useEffect, useState } from "react";
import Sparkline from "@/components/Sparkline";
import { mockSeries } from "@/lib/sparkline";

// Finnhub's free tier doesn't grant access to raw index symbols (^GSPC, ^DJI,
// etc.) — those are gated behind a paid plan. Highly-liquid ETFs that track
// the same indices are a solid free-tier-friendly stand-in and move in near
// lockstep with the underlying index during market hours.
const INDEX_PROXIES = [
  { label: "S&P 500", symbol: "SPY" },
  { label: "Dow Jones", symbol: "DIA" },
  { label: "Nasdaq", symbol: "QQQ" },
  { label: "Russell 2000", symbol: "IWM" },
  { label: "VIX", symbol: "VIXY" },
];

type IndexData = { label: string; symbol: string; price?: number; changePct?: number };

export default function IndexTrackerBar() {
  const [data, setData] = useState<IndexData[]>(INDEX_PROXIES);

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      INDEX_PROXIES.map(async (idx) => {
        try {
          const q = await fetch(`/api/quote?symbol=${idx.symbol}`).then((r) => r.json());
          return { ...idx, price: q.c as number, changePct: q.dp as number };
        } catch {
          return idx;
        }
      })
    ).then((results) => !cancelled && setData(results));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex gap-3 overflow-x-auto scroll-track pb-1 -mx-1 px-1">
      {data.map((idx) => {
        const positive = (idx.changePct ?? 0) >= 0;
        return (
          <div
            key={idx.symbol}
            className="glow-panel flex-shrink-0 w-44 p-4 snap-start"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-cyber-muted">{idx.label}</span>
              <span className="text-[10px] text-cyber-muted/70">{idx.symbol}</span>
            </div>
            <div className="numeric text-lg mb-1">
              {idx.price !== undefined ? `$${idx.price.toFixed(2)}` : "—"}
            </div>
            <div className="flex items-center justify-between">
              <span
                className={`numeric text-xs ${
                  positive ? "text-cyber-neonGreen" : "text-cyber-neonPink"
                }`}
              >
                {idx.changePct !== undefined
                  ? `${positive ? "+" : ""}${idx.changePct.toFixed(2)}%`
                  : "—"}
              </span>
              <Sparkline
                values={mockSeries(idx.symbol, 18, positive ? 0.35 : -0.35)}
                width={64}
                height={22}
                positive={positive}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
