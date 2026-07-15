import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Legacy tokens — kept so existing components don't break
        base: "#0B0E11",
        panel: "#12161C",
        line: "#1F2530",
        ink: "#E8ECF1",
        muted: "#8A93A3",
        gain: "#2ECC71",
        loss: "#EF4444",
        accent: "#3B82F6",

        // Cyber Indigo system
        cyber: {
          bg: "#05061a",        // deepest background stop
          bg2: "#0b0f2e",       // mid gradient stop
          bg3: "#150c33",       // violet-leaning gradient stop
          panel: "rgba(17, 18, 45, 0.55)",   // translucent card fill
          panelHover: "rgba(24, 22, 62, 0.7)",
          border: "rgba(139, 126, 255, 0.22)",
          borderStrong: "rgba(167, 139, 250, 0.45)",
          text: "#E9E7FF",
          muted: "#9B94C9",
          accent: "#8B7CFF",     // primary indigo accent
          accent2: "#A78BFA",    // violet accent
          neonGreen: "#22ff9d",
          neonGreenDim: "#22c55e",
          neonPink: "#ff4d8d",
          neonPinkDim: "#f43f5e",
        },
      },
      backgroundImage: {
        "cyber-gradient":
          "radial-gradient(120% 120% at 15% 0%, #150c33 0%, #0b0f2e 45%, #05061a 100%)",
        "cyber-panel-gradient":
          "linear-gradient(180deg, rgba(139,124,255,0.08) 0%, rgba(17,18,45,0.4) 100%)",
      },
      boxShadow: {
        "glow-sm": "0 0 12px rgba(139, 124, 255, 0.25)",
        "glow-md": "0 0 24px rgba(139, 124, 255, 0.28), 0 0 2px rgba(167,139,250,0.6)",
        "glow-lg": "0 0 40px rgba(139, 124, 255, 0.3)",
        "glow-green": "0 0 16px rgba(34, 255, 157, 0.35)",
        "glow-pink": "0 0 16px rgba(255, 77, 141, 0.35)",
      },
      fontFamily: {
        mono: ["'IBM Plex Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ["'Inter'", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};
export default config;

