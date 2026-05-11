"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { getThemeState, setTheme } from "./theme-provider";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const { effective } = getThemeState();
    setIsDark(effective === "dark");

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const { stored, effective: nextEffective } = getThemeState();
      if (stored === "system") {
        setIsDark(nextEffective === "dark");
      }
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    const next = isDark ? "light" : "dark";
    setTheme(next);
    setIsDark(next === "dark");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex size-10 items-center justify-center rounded-full border border-border text-foreground shadow-sm transition hover:bg-muted"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
  );
}
