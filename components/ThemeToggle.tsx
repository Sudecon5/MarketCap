"use client";

import { useTheme } from "@/components/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="w-8 h-8 rounded-full border border-cyber-border bg-cyber-panel/60
                 flex items-center justify-center text-xs shadow-glow-sm
                 hover:shadow-glow-md hover:border-cyber-borderStrong transition-all"
      title="Toggle theme brightness"
      aria-label="Toggle theme"
    >
      {theme === "cyber-indigo" ? "🌙" : "✨"}
    </button>
  );
}
