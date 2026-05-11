"use client";

import { useEffect } from "react";

type ThemePreference = "light" | "dark" | "system";

const STORAGE_KEY = "theme";

function getStoredTheme(): ThemePreference | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(STORAGE_KEY);
  if (value === "light" || value === "dark" || value === "system") {
    return value;
  }

  return null;
}

function getEffectiveTheme(preference: ThemePreference): "light" | "dark" {
  if (preference === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  return preference;
}

function applyTheme(preference: ThemePreference) {
  const root = document.documentElement;
  const effective = getEffectiveTheme(preference);
  root.classList.toggle("dark", effective === "dark");
  root.style.colorScheme = effective;
}

export function setTheme(preference: ThemePreference) {
  window.localStorage.setItem(STORAGE_KEY, preference);
  applyTheme(preference);
}

export function ThemeProvider() {
  useEffect(() => {
    const stored = getStoredTheme() ?? "system";
    applyTheme(stored);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const current = getStoredTheme() ?? "system";
      if (current === "system") {
        applyTheme("system");
      }
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  return null;
}

export function getThemeState() {
  const stored = getStoredTheme() ?? "system";
  const effective = getEffectiveTheme(stored);
  return { stored, effective };
}
