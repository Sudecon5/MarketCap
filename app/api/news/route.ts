import { NextRequest, NextResponse } from "next/server";
import { getCompanyNews, getMarketNews } from "@/lib/finnhub";

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol");

  try {
    if (symbol) {
      const to = new Date().toISOString().slice(0, 10);
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 14);
      const from = fromDate.toISOString().slice(0, 10);

      const news = await getCompanyNews(symbol, from, to);
      return NextResponse.json({ news: news.slice(0, 12) });
    }

    const news = await getMarketNews();
    return NextResponse.json({ news: news.slice(0, 12) });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
