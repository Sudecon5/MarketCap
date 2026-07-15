"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import AddHoldingForm from "@/components/AddHoldingForm";

type Holding = {
  symbol: string;
  shares: number;
  cost_basis: number;
  price?: number;
};

export default function PortfolioPage() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      setSignedIn(!!data.user);
      if (!data.user) {
        setLoading(false);
        return;
      }
      await load();
    });
  }, []);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/holdings");
    const json = await res.json();
    const raw: { symbol: string; shares: number; cost_basis: number }[] = json.holdings ?? [];

    const withPrices = await Promise.all(
      raw.map(async (h) => {
        try {
          const q = await fetch(`/api/quote?symbol=${h.symbol}`).then((r) => r.json());
          return { ...h, price: q.c as number };
        } catch {
          return { ...h };
        }
      })
    );
    setHoldings(withPrices);
    setLoading(false);
  }

  async function remove(symbol: string) {
    setHoldings((prev) => prev.filter((h) => h.symbol !== symbol));
    await fetch(`/api/holdings/${symbol}`, { method: "DELETE" });
  }

  if (signedIn === false) {
    return (
      <div className="text-center mt-16">
        <p className="text-muted text-sm mb-4">Sign in to track your portfolio.</p>
        <Link href="/login" className="text-accent hover:underline text-sm">
          Sign in →
        </Link>
      </div>
    );
  }

  const withPrice = holdings.filter((h) => h.price !== undefined);
  const totalValue = withPrice.reduce((sum, h) => sum + h.shares * (h.price ?? 0), 0);
  const totalCost = withPrice.reduce((sum, h) => sum + h.shares * h.cost_basis, 0);
  const totalGain = totalValue - totalCost;
  const totalGainPct = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;
  const isUp = totalGain >= 0;

  return (
    <div className="max-w-6xl mx-auto w-full">
      <h1 className="text-2xl font-semibold mb-6">Portfolio</h1>

      {loading && <p className="text-muted text-sm">Loading...</p>}

      {!loading && holdings.length > 0 && (
        <div className="border border-line rounded-lg p-6 bg-panel mb-6 flex flex-wrap gap-8">
          <div>
            <div className="text-xs text-muted mb-1">Total Value</div>
            <div className="numeric text-2xl">
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted mb-1">Total Gain/Loss</div>
            <div className={`numeric text-2xl ${isUp ? "text-gain" : "text-loss"}`}>
              {isUp ? "+" : ""}
              ${totalGain.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
              <span className="text-base">
                ({isUp ? "+" : ""}
                {totalGainPct.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
      )}

      {!loading && holdings.length === 0 && (
        <div className="border border-dashed border-line rounded-lg p-8 text-center text-muted text-sm">
          You haven't added any holdings yet.{" "}
          <Link href="/" className="text-accent hover:underline">
            Find a stock
          </Link>{" "}
          and use "Add to Portfolio" to log shares you own.
        </div>
      )}

      {!loading && holdings.length > 0 && (
        <div className="border border-line rounded-lg divide-y divide-line overflow-hidden">
          <div className="grid grid-cols-6 gap-2 px-4 py-2 text-xs text-muted bg-panel/50">
            <div>Symbol</div>
            <div className="text-right">Shares</div>
            <div className="text-right">Avg Cost</div>
            <div className="text-right">Price</div>
            <div className="text-right">Value</div>
            <div className="text-right">Gain/Loss</div>
          </div>
          {holdings.map((h) => {
            const value = h.price !== undefined ? h.shares * h.price : undefined;
            const cost = h.shares * h.cost_basis;
            const gain = value !== undefined ? value - cost : undefined;
            const gainPct = value !== undefined && cost > 0 ? (gain! / cost) * 100 : undefined;
            const up = (gain ?? 0) >= 0;

            return (
              <div key={h.symbol}>
                <div className="grid grid-cols-6 gap-2 px-4 py-3 items-center bg-panel">
                  <Link href={`/stock/${h.symbol}`} className="numeric font-medium hover:text-accent">
                    {h.symbol}
                  </Link>
                  <div className="numeric text-sm text-right">{h.shares}</div>
                  <div className="numeric text-sm text-right">${h.cost_basis.toFixed(2)}</div>
                  <div className="numeric text-sm text-right">
                    {h.price !== undefined ? `$${h.price.toFixed(2)}` : "—"}
                  </div>
                  <div className="numeric text-sm text-right">
                    {value !== undefined ? `$${value.toFixed(2)}` : "—"}
                  </div>
                  <div className={`numeric text-sm text-right ${up ? "text-gain" : "text-loss"}`}>
                    {gainPct !== undefined ? `${up ? "+" : ""}${gainPct.toFixed(2)}%` : "—"}
                  </div>
                </div>
                <div className="px-4 pb-3 flex gap-3 bg-panel">
                  <button
                    onClick={() => setEditing(editing === h.symbol ? null : h.symbol)}
                    className="text-xs text-muted hover:text-ink transition-colors"
                  >
                    {editing === h.symbol ? "Cancel" : "Buy more"}
                  </button>
                  <button
                    onClick={() => remove(h.symbol)}
                    className="text-xs text-muted hover:text-loss transition-colors"
                  >
                    Remove
                  </button>
                </div>
                {editing === h.symbol && (
                  <div className="px-4 pb-4 bg-panel">
                    <AddHoldingForm
                      symbol={h.symbol}
                      initiallyOpen
                      onCancel={() => setEditing(null)}
                      onSaved={() => {
                        setEditing(null);
                        load();
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
