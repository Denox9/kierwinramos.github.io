"use client";
import { useEffect } from "react";

// Siklab mode switches. The active side is painted by CSS from <html data-*>,
// so the buttons are correct before hydration; this component only flips the attributes.
type Mode = { name: "theme" | "accent" | "scale"; key: string; a: string; b: string; la: string; lb: string; aria: string };

const MODES: Mode[] = [
  { name: "theme", key: "rx-theme", a: "light", b: "dark", la: "ARAW", lb: "GABI", aria: "Night mode (Gabi)" },
  { name: "accent", key: "rx-accent", a: "pula", b: "mono", la: "A·PULA", lb: "B·MONO", aria: "Mono print mode" },
  { name: "scale", key: "rx-scale", a: "90", b: "100", la: "90%", lb: "100%", aria: "Large text (100% scale)" },
];

export default function ModeSwitches() {
  // Follow the OS theme until the user picks explicitly
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      try { if (localStorage.getItem("rx-theme")) return; } catch {}
      document.documentElement.dataset.theme = e.matches ? "dark" : "light";
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function flip(m: Mode, btn: HTMLButtonElement) {
    const d = document.documentElement;
    const cur = d.dataset[m.name] || m.a;
    const next = cur === m.b ? m.a : m.b;
    d.dataset[m.name] = next;
    try { localStorage.setItem(m.key, next); } catch {}
    btn.setAttribute("aria-checked", String(next === m.b));
  }

  return (
    <>
      {MODES.map((m) => (
        <button
          key={m.name}
          type="button"
          className="mode-switch"
          data-switch={m.name}
          role="switch"
          aria-checked={false}
          aria-label={m.aria}
          suppressHydrationWarning
          onClick={(e) => flip(m, e.currentTarget)}
        >
          <span data-v={m.a}>{m.la}</span>
          <span data-v={m.b}>{m.lb}</span>
        </button>
      ))}
    </>
  );
}
