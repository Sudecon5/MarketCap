import { getMarketNews } from "@/lib/finnhub";
import DashboardShell from "@/components/dashboard/DashboardShell";
import LeftSidebar from "@/components/dashboard/LeftSidebar";
import IndexTrackerBar from "@/components/dashboard/IndexTrackerBar";
import DashboardSearchBar from "@/components/dashboard/DashboardSearchBar";
import ResearchPanel from "@/components/dashboard/ResearchPanel";

export default async function Home() {
  const news = await getMarketNews().catch(() => []);

  return (
    <DashboardShell
      left={<LeftSidebar />}
      right={<ResearchPanel />}
      center={
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold mb-1 text-cyber-text">Dashboard</h1>
            <p className="text-cyber-muted text-sm mb-4">
              Search a ticker to see live pricing, charts, and news.
            </p>
            <DashboardSearchBar />
          </div>

          <IndexTrackerBar />

          <section>
            <h2 className="text-sm uppercase tracking-wide text-cyber-muted mb-3">
              Market News
            </h2>
            <div className="space-y-3">
              {news.length === 0 && (
                <div className="glow-panel p-4 text-sm text-cyber-muted">
                  No market news available right now.
                </div>
              )}
              {news.slice(0, 8).map((item, i) => (
                <a
                  key={i}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="glow-panel block p-4"
                >
                  <div className="text-sm font-medium text-cyber-text">{item.headline}</div>
                  <div className="text-xs text-cyber-muted mt-1">
                    {item.source} · {new Date(item.datetime * 1000).toLocaleDateString()}
                  </div>
                </a>
              ))}
            </div>
          </section>
        </div>
      }
    />
  );
}
