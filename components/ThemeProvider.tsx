"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "cyber-indigo" | "cyber-indigo-light";

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
}>({ theme: "cyber-indigo", toggle: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Cyber Indigo dark is the default and primary identity of the app.
  // The only alternate is a lighter variant of the SAME palette — never a
  // flat gray theme — toggled via ThemeToggle and persisted locally.
  const [theme, setTheme] = useState<Theme>("cyber-indigo");

  useEffect(() => {
    const stored = window.localStorage.getItem("marketcap-theme") as Theme | null;
    if (stored) setTheme(stored);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("marketcap-theme", theme);
  }, [theme]);

  function toggle() {
    setTheme((t) => (t === "cyber-indigo" ? "cyber-indigo-light" : "cyber-indigo"));
  }

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}
