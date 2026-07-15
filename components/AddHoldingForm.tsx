"use client";

import { useState } from "react";

export default function AddHoldingForm({
  symbol,
  onSaved,
  onCancel,
  initiallyOpen = false,
}: {
  symbol: string;
  onSaved?: () => void;
  onCancel?: () => void;
  initiallyOpen?: boolean;
}) {
  const [open, setOpen] = useState(initiallyOpen);
  const [shares, setShares] = useState("");
  const [costBasis, setCostBasis] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const res = await fetch("/api/holdings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol, shares: Number(shares), costBasis: Number(costBasis) }),
    });

    setBusy(false);
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? "Something went wrong.");
      return;
    }

    setShares("");
    setCostBasis("");
    setOpen(false);
    onSaved?.();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="bg-panel border border-line rounded-lg px-4 py-2 text-sm text-muted hover:text-ink transition-colors"
      >
        + Add to Portfolio
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-line rounded-lg p-4 bg-panel flex flex-wrap items-end gap-3"
    >
      <div>
        <label className="block text-xs text-muted mb-1">Shares</label>
        <input
          type="number"
          step="any"
          min="0"
          required
          value={shares}
          onChange={(e) => setShares(e.target.value)}
          className="w-28 bg-base border border-line rounded-md px-3 py-2 text-sm numeric focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>
      <div>
        <label className="block text-xs text-muted mb-1">Avg. price paid</label>
        <input
          type="number"
          step="any"
          min="0"
          required
          value={costBasis}
          onChange={(e) => setCostBasis(e.target.value)}
          className="w-32 bg-base border border-line rounded-md px-3 py-2 text-sm numeric focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>
      <button
        type="submit"
        disabled={busy}
        className="bg-accent text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
      >
        {busy ? "Saving..." : "Save"}
      </button>
      <button
        type="button"
        onClick={() => (onCancel ? onCancel() : setOpen(false))}
        className="text-muted text-sm px-2 py-2 hover:text-ink transition-colors"
      >
        Cancel
      </button>
      {error && <p className="text-loss text-xs w-full">{error}</p>}
    </form>
  );
}
