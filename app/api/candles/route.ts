import { NextRequest, NextResponse } from "next/server";
import { getCandles } from "@/lib/finnhub";
import { getStooqDailyCandles } from "@/lib/stooq";

const RANGE_CONFIG: Record<string, { resolution: string; days: number }> = {
  "1D": { resolution: "5", days: 1 },
  "5D": { resolution: "60", days: 5 },
  "1M": { resolution: "D", days: 30 },
  "6M": { resolution: "D", days: 182 },
  "1Y": { resolution: "D", days: 365 },
  "5Y": { resolution: "W", days: 365 * 5 },
};

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol");
  const range = req.nextUrl.searchParams.get("range") ?? "1M";
  const config = RANGE_CONFIG[range];

  if (!symbol || !config) {
    return NextResponse.json({ error: "invalid symbol or range" }, { status: 400 });
  }

  const to = Math.floor(Date.now() / 1000);
  const from = to - config.days * 24 * 60 * 60;

  try {
    const candles = await getCandles(symbol, config.resolution, from, to);
    if (candles.length > 0) {
      return NextResponse.json({ candles, source: "finnhub" });
    }
    throw new Error("empty result, trying fallback");
  } catch {
    // Finnhub candle endpoint is premium-only on many free-tier keys — fall back
    // to Stooq daily EOD data. Note: Stooq is daily-only, so intraday ranges
    // (1D/5D) will look coarser than on a paid Finnhub plan.
    const daily = await getStooqDailyCandles(symbol);
    const cutoff = to - config.days * 24 * 60 * 60;
    const candles = daily.filter((c) => c.t >= cutoff);
    return NextResponse.json({ candles, source: "stooq" });
  }
}
