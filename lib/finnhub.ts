// Server-side only. Never import this from a client component.
// Get a free key at https://finnhub.io/register and put it in .env.local

const BASE_URL = "https://finnhub.io/api/v1";

function requireApiKey(): string {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) {
    throw new Error(
      "Missing FINNHUB_API_KEY. Copy .env.local.example to .env.local and add your key."
    );
  }
  return key;
}

async function finnhubGet<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  url.searchParams.set("token", requireApiKey());

  const res = await fetch(url.toString(), { next: { revalidate: 15 } }); // cache 15s
  if (!res.ok) {
    throw new Error(`Finnhub request failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export type Quote = {
  c: number; // current price
  d: number; // change
  dp: number; // percent change
  h: number; // high
  l: number; // low
  o: number; // open
  pc: number; // previous close
};

export type SymbolResult = {
  symbol: string;
  description: string;
  type: string;
};

export type NewsItem = {
  headline: string;
  source: string;
  url: string;
  datetime: number; // unix seconds
  summary: string;
};

export function getQuote(symbol: string) {
  return finnhubGet<Quote>("/quote", { symbol });
}

export async function searchSymbols(query: string) {
  const data = await finnhubGet<{ result: SymbolResult[] }>("/search", { q: query });
  return data.result.slice(0, 8);
}

export function getCompanyNews(symbol: string, from: string, to: string) {
  return finnhubGet<NewsItem[]>("/company-news", { symbol, from, to });
}

export function getMarketNews() {
  return finnhubGet<NewsItem[]>("/news", { category: "general" });
}

export type Candle = {
  t: number; // unix seconds
  c: number; // close
};

export type CandleResponse = {
  s: "ok" | "no_data";
  t: number[];
  c: number[];
};

// resolution: "5" | "60" | "D" | "W"   from/to: unix seconds
export async function getCandles(
  symbol: string,
  resolution: string,
  from: number,
  to: number
): Promise<Candle[]> {
  const data = await finnhubGet<CandleResponse>("/stock/candle", {
    symbol,
    resolution,
    from: String(from),
    to: String(to),
  });
  if (data.s !== "ok") return [];
  return data.t.map((t, i) => ({ t, c: data.c[i] }));
}
