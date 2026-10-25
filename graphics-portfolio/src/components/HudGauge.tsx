// Dial gauge: value 0..1
export default function HudGauge({ value, label }: { value: number; label: string }) {
  const v = Math.max(0, Math.min(1, value));
  const r = 52, cx = 64, cy = 64;
  const start = Math.PI * 0.75, sweep = Math.PI * 1.5;
  const pt = (a: number, rr = r) => [cx + rr * Math.cos(a), cy + rr * Math.sin(a)];
  const arc = (a0: number, a1: number) => {
    const [x0, y0] = pt(a0), [x1, y1] = pt(a1);
    return `M${x0} ${y0} A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1} ${y1}`;
  };
  const ticks = Array.from({ length: 13 }, (_, i) => start + (sweep * i) / 12);
  return (
    <figure className="gauge">
      <svg viewBox="0 0 128 128" role="img" aria-label={`${label}: ${Math.round(v * 100)} percent`}>
        <path d={arc(start, start + sweep)} fill="none" stroke="var(--gray)" strokeWidth="2" />
        {v > 0 && <path d={arc(start, start + sweep * v)} fill="none" stroke="var(--accent)" strokeWidth="8" />}
        {ticks.map((a, i) => {
          const [x0, y0] = pt(a, 40), [x1, y1] = pt(a, i % 3 === 0 ? 32 : 36);
          return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} stroke="var(--ink)" strokeWidth="1" />;
        })}
        <text x="64" y="70" textAnchor="middle" fontSize="20" fontWeight="700" fontFamily="var(--font-mono)" fill="var(--ink)">
          {String(Math.round(v * 100)).padStart(3, "0")}
        </text>
        <text x="64" y="84" textAnchor="middle" fontSize="7" letterSpacing="1.5" fontFamily="var(--font-mono)" fill="var(--ink)">%LOAD</text>
      </svg>
      <figcaption className="label">{label}</figcaption>
    </figure>
  );
}
