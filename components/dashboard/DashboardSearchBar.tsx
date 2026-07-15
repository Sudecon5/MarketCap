"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ symbol: string; description: string }[]>([]);

  async function handleSearch(value: string) {
    setQuery(value);
    if (value.length < 1) {
      setResults([]);
      return;
    }
    const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
    const data = await res.json();
    setResults(data.result ?? []);
  }

  return (
    <div className="relative max-w-md">
      <input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search AAPL, Tesla, MSFT..."
        className="w-full glow-panel px-4 py-3 text-sm bg-transparent
                   placeholder:text-cyber-muted focus:outline-none focus:border-cyber-borderStrong focus:shadow-glow-md"
      />
      {results.length > 0 && (
        <ul className="absolute z-10 mt-2 w-full glow-panel overflow-hidden">
          {results.map((r) => (
            <li key={r.symbol}>
              <button
                onClick={() => router.push(`/stock/${r.symbol}`)}
                className="w-full text-left px-4 py-3 hover:bg-cyber-panelHover flex justify-between text-sm"
              >
                <span className="numeric font-medium">{r.symbol}</span>
                <span className="text-cyber-muted truncate ml-4">{r.description}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
