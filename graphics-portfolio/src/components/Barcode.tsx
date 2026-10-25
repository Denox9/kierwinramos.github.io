// Deterministic decorative barcode generated from a string.
export default function Barcode({ value, height = 36 }: { value: string; height?: number }) {
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  const src = (value + "RX09").repeat(3);
  for (let i = 0; i < src.length; i++) {
    const c = src.charCodeAt(i);
    const w = (c % 3) + 1;
    if (i % 2 === 0) bars.push({ x, w });
    x += w + ((c >> 2) % 2) + 1;
  }
  return (
    <svg className="barcode" viewBox={`0 0 ${x} ${height}`} preserveAspectRatio="none" aria-hidden="true">
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={0} width={b.w} height={height} fill="currentColor" />
      ))}
    </svg>
  );
}
