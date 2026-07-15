import { getQuote, getCompanyNews } from "@/lib/finnhub";
import PriceChart from "@/components/PriceChart";
import WatchlistButton from "@/components/WatchlistButton";
import AddHoldingForm from "@/components/AddHoldingForm";

export default async function StockPage({ params }: { params: { symbol: string } }) {
  const symbol = params.symbol.toUpperCase();

  const to = new Date().toISOString().slice(0, 10);
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 14);
  const from = fromDate.toISOString().slice(0, 10);

  const [quote, news] = await Promise.all([
    getQuote(symbol),
    getCompanyNews(symbol, from, to).catch(() => []),
  ]);

  const isUp = quote.d >= 0;

  return (
    <div className="max-w-6xl mx-auto w-full space-y-8">
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold numeric">{symbol}</h1>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-2xl numeric">${quote.c.toFixed(2)}</span>
            <span className={`numeric text-sm ${isUp ? "text-gain" : "text-loss"}`}>
              {isUp ? "+" : ""}
              {quote.d.toFixed(2)} ({quote.dp.toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <WatchlistButton symbol={symbol} />
          <AddHoldingForm symbol={symbol} />
        </div>
      </section>

      <section className="border border-line rounded-lg p-6 bg-panel">
        <PriceChart symbol={symbol} />
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat label="Open" value={quote.o} />
        <Stat label="Prev Close" value={quote.pc} />
        <Stat label="Day High" value={quote.h} />
        <Stat label="Day Low" value={quote.l} />
      </section>

      <section>
        <h2 className="text-sm uppercase tracking-wide text-muted mb-3">News</h2>
        <ul className="space-y-3">
          {news.length === 0 && (
            <li className="text-muted text-sm">No recent news found for {symbol}.</li>
          )}
          {news.map((item, i) => (
            <li key={i} className="border border-line rounded-lg p-4 bg-panel">
              <a href={item.url} target="_blank" rel="noreferrer" className="hover:text-accent">
                <div className="text-sm font-medium">{item.headline}</div>
              </a>
              <div className="text-xs text-muted mt-1">
                {item.source} · {new Date(item.datetime * 1000).toLocaleDateString()}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-line rounded-lg p-4 bg-panel">
      <div className="text-xs text-muted">{label}</div>
      <div className="numeric text-lg mt-1">${value.toFixed(2)}</div>
    </div>
  );
}
