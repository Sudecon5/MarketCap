// Generates a smooth (quadratic-bezier-ish) SVG path for a small inline
// sparkline, given a series of numbers. No chart library needed — this stays
// tiny so we can render dozens of these (sectors, index cards) without cost.

export function buildSparklinePath(
  values: number[],
  width: number,
  height: number,
  padding = 2
): string {
  if (values.length === 0) return "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1 || 1)) * (width - padding * 2) + padding;
    const y = height - padding - ((v - min) / range) * (height - padding * 2);
    return [x, y];
  });

  return points
    .map(([x, y], i) => {
      if (i === 0) return `M ${x.toFixed(1)} ${y.toFixed(1)}`;
      const [px, py] = points[i - 1];
      const mx = (px + x) / 2;
      return `Q ${px.toFixed(1)} ${py.toFixed(1)} ${mx.toFixed(1)} ${((py + y) / 2).toFixed(1)}`;
    })
    .join(" ");
}

// Deterministic pseudo-random walk so mock sparklines don't reshuffle on
// every render — seeded from the symbol string. Swap for real intraday
// data once you wire up a candles endpoint per symbol.
export function mockSeries(seed: string, points = 20, drift = 0): number[] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;

  const series: number[] = [100];
  for (let i = 1; i < points; i++) {
    hash = (hash * 1103515245 + 12345) >>> 0;
    const noise = (hash % 1000) / 1000 - 0.5; // -0.5..0.5
    const next = series[i - 1] + noise * 2 + drift;
    series.push(next);
  }
  return series;
}
