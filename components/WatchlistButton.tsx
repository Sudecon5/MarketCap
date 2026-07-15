"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function WatchlistButton({ symbol }: { symbol: string }) {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
  }, []);

  useEffect(() => {
    if (!signedIn) return;
    fetch("/api/watchlist")
      .then((r) => r.json())
      .then((json) => {
        const list = (json.watchlist ?? []) as { symbol: string }[];
        setSaved(list.some((item) => item.symbol === symbol));
      });
  }, [signedIn, symbol]);

  if (signedIn === null) return null; // avoid a flash while checking auth

  if (!signedIn) {
    return (
      <Link
        href="/login"
        className="bg-panel border border-line rounded-lg px-4 py-2 text-sm text-muted hover:text-ink transition-colors"
      >
        Sign in to save
      </Link>
    );
  }

  async function toggle() {
    setBusy(true);
    if (saved) {
      await fetch(`/api/watchlist/${symbol}`, { method: "DELETE" });
      setSaved(false);
    } else {
      await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol }),
      });
      setSaved(true);
    }
    setBusy(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={`rounded-lg px-4 py-2 text-sm border transition-colors disabled:opacity-50 ${
        saved
          ? "bg-line/50 text-ink border-line"
          : "bg-accent/10 text-accent border-accent/30 hover:bg-accent/20"
      }`}
    >
      {saved ? "✓ On Watchlist" : "+ Add to Watchlist"}
    </button>
  );
}
