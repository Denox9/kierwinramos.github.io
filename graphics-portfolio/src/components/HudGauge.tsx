// Siklab half-dial gauge: value 0..1. Ink arc, turns red above 80%.
export default function HudGauge({ value, label }: { value: number; label: string }) {
  const v = Math.max(0, Math.min(1, value));
  const pct = Math.round(v * 100);
  const r = 60, c = Math.PI * r, f = c * v;
  const ticks = Array.from({ length: 11 }, (_, i) => Math.PI + (i * Math.PI) / 10);
  return (
    <figure className="gauge">
      <svg viewBox="0 0 160 100" role="img" aria-label={`${label}: ${pct} percent`} style={{ width: "11rem", height: "auto" }}>
        <path d="M20 86 A60 60 0 0 1 140 86" fill="none" stroke="var(--line)" strokeWidth="14" />
        <path d="M20 86 A60 60 0 0 1 140 86" fill="none" strokeWidth="14" strokeDasharray={`${f} ${c}`} stroke={pct > 80 ? "var(--red)" : "var(--ink)"} />
        {ticks.map((a, i) => (
          <line key={i} x1={80 + 70 * Math.cos(a)} y1={86 + 70 * Math.sin(a)} x2={80 + 76 * Math.cos(a)} y2={86 + 76 * Math.sin(a)} stroke="var(--ink)" />
        ))}
        <text x="80" y="82" textAnchor="middle" fill="var(--ink)" fontFamily="var(--grot)" fontWeight="200" fontSize="36" letterSpacing="-2">{String(pct).padStart(2, "0")}</text>
        <text x="80" y="97" textAnchor="middle" fill="var(--ink)" fontFamily="var(--mono)" fontSize="7" letterSpacing="1.5">%LOAD</text>
      </svg>
      <figcaption>{label}</figcaption>
    </figure>
  );
}
