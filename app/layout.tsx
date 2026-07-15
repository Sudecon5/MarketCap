import type { Metadata } from "next";
import "./globals.css";
import AuthStatus from "@/components/AuthStatus";
import ThemeProvider from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "MarketCap",
  description: "Track stocks, build a watchlist, follow the news.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-theme set here for zero-flash SSR; ThemeProvider re-syncs from
    // localStorage on mount if the user previously chose the light variant.
    <html lang="en" data-theme="cyber-indigo">
      <body className="font-sans min-h-screen">
        <ThemeProvider>
          <header className="border-b border-cyber-border/60 px-6 py-4 flex items-center justify-between backdrop-blur-md sticky top-0 z-20 bg-cyber-bg/40">
            <a href="/" className="text-lg font-semibold tracking-tight text-cyber-text">
              Market<span className="text-cyber-accent2">Cap</span>
            </a>
            <nav className="text-sm text-cyber-muted flex items-center gap-6">
              <a href="/" className="hover:text-cyber-text transition-colors">Dashboard</a>
              <a href="/watchlist" className="hover:text-cyber-text transition-colors">Watchlist</a>
              <a href="/portfolio" className="hover:text-cyber-text transition-colors">Portfolio</a>
              <AuthStatus />
              <ThemeToggle />
            </nav>
          </header>
          {/* No width constraint here — the dashboard page goes full-bleed for
              its 3-column layout; other pages apply their own max-w wrapper. */}
          <main className="px-6 py-6">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
