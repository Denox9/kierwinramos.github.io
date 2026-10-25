"use client";
import { useEffect, useState } from "react";

export default function CountUp({ to, pad = 3, duration = 1200 }: { to: number; pad?: number; duration?: number }) {
  const [n, setN] = useState(to);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    setN(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <span className="tnum">{String(n).padStart(pad, "0")}</span>;
}
