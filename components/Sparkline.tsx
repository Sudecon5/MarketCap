"use client";

import { buildSparklinePath } from "@/lib/sparkline";

export default function Sparkline({
  values,
  width = 80,
  height = 28,
  positive,
}: {
  values: number[];
  width?: number;
  height?: number;
  positive: boolean;
}) {
  const path = buildSparklinePath(values, width, height);
  const color = positive ? "#22ff9d" : "#ff4d8d";
  const gradientId = `spark-${positive ? "up" : "down"}-${width}-${height}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.35} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path
        d={`${path} L ${width - 2} ${height} L 2 ${height} Z`}
        fill={`url(#${gradientId})`}
        stroke="none"
      />
      <path
        d={path}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        fill="none"
        style={{ filter: `drop-shadow(0 0 3px ${color}80)` }}
      />
    </svg>
  );
}
