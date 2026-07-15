// Fallback historical data source. Used when Finnhub's /stock/candle
// returns a 403 (common on newer free-tier keys). Stooq requires no API key
// and has no meaningful rate limit for this kind of light usage.
// Docs: https://stooq.com/db/h/

import type { Candle } from "./finnhub";

export async function getStooqDailyCandles(symbol: string): Promise<Candle[]> {
  // Stooq expects lowercase tickers with a market suffix; ".us" covers US equities.
  const stooqSymbol = `${symbol.toLowerCase()}.us`;
  const url = `https://stooq.com/q/d/l/?s=${stooqSymbol}&i=d`;

  const res = await fetch(url, { next: { revalidate: 3600 } }); // cache 1hr, EOD data
  if (!res.ok) return [];

  const csv = await res.text();
  const lines = csv.trim().split("\n");
  if (lines.length < 2 || lines[0].startsWith("<") ) return []; // Stooq returns an error page for unknown symbols

  const rows = lines.slice(1); // skip header: Date,Open,High,Low,Close,Volume
  return rows
    .map((line) => {
      const [date, , , , close] = line.split(",");
      const t = Math.floor(new Date(date).getTime() / 1000);
      const c = parseFloat(close);
      return { t, c };
    })
    .filter((row) => !Number.isNaN(row.c) && !Number.isNaN(row.t));
}
