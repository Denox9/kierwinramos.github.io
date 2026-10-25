"use client";
import { useEffect, useState } from "react";
import { transliterate } from "@/lib/baybayin";

type Theme = "light" | "dark";
const KEY = "rx-theme";
const GABI = transliterate("gabi");   // night
const ARAW = transliterate("araw");   // day

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme((document.documentElement.dataset.theme as Theme) || "light");
    // Follow OS changes until the user picks explicitly
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem(KEY)) return;
      const t: Theme = e.matches ? "dark" : "light";
      document.documentElement.dataset.theme = t;
      setTheme(t);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(KEY, next); } catch {}
    setTheme(next);
  }

  const dark = theme === "dark";
  return (
    <button
      type="button"
      className="theme-switch"
      role="switch"
      aria-checked={dark}
      aria-label="Night mode"
      onClick={toggle}
    >
      <span className="t-day">
        <span className="bb" lang="tl-Tglg" aria-hidden="true">{ARAW}</span> DAY
      </span>
      <span className="t-night">
        <span className="bb" lang="tl-Tglg" aria-hidden="true">{GABI}</span> NIGHT
      </span>
    </button>
  );
}
