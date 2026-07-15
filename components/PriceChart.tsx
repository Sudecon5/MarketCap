"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const RANGES = ["1D", "5D", "1M", "6M", "1Y", "5Y"] as const;
type Range = (typeof RANGES)[number];

type CandlePoint = { t: number; c: number };

export default function PriceChart({ symbol }: { symbol: string }) {
  const [range, setRange] = useState<Range>("1M");
  const [data, setData] = useState<CandlePoint[]>([]);
  const [source, setSource] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/candles?symbol=${symbol}&range=${range}`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        setData(json.candles ?? []);
        setSource(json.source ?? null);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [symbol, range]);

  const isUp = data.length >= 2 && data[data.length - 1].c >= data[0].c;
  const lineColor = isUp ? "#2ECC71" : "#EF4444";

  const chartData = data.map((d) => ({
    time: new Date(d.t * 1000).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    price: d.c,
  }));

  return (
    <div>
      <div className="flex gap-1 mb-4">
        {RANGES.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              r === range ? "bg-accent/20 text-accent" : "text-muted hover:text-ink"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {loading && (
        <div className="h-64 flex items-center justify-center text-muted text-xs">
          Loading chart...
        </div>
      )}

      {!loading && chartData.length === 0 && (
        <div className="h-64 flex items-center justify-center text-muted text-xs">
          No historical data available for {symbol}.
        </div>
      )}

      {!loading && chartData.length > 0 && (
        <>
          <ResponsiveContainer width="100%" height={256}>
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={lineColor} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                tick={{ fill: "#8A93A3", fontSize: 11 }}
                axisLine={{ stroke: "#1F2530" }}
                tickLine={false}
                minTickGap={40}
              />
              <YAxis
                domain={["auto", "auto"]}
                tick={{ fill: "#8A93A3", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={56}
              />
              <Tooltip
                contentStyle={{
                  background: "#12161C",
                  border: "1px solid #1F2530",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: "#8A93A3" }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={lineColor}
                strokeWidth={2}
                fill="url(#priceFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
          {source === "stooq" && (
            <p className="text-xs text-muted mt-2">
              Showing daily close data (fallback source) — intraday resolution requires a paid Finnhub plan.
            </p>
          )}
        </>
      )}
    </div>
  );
}
