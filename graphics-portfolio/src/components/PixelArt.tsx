// Pixel mosaic — 8-bit "lantern" field in one hue (red at stepped opacities). Deterministic, server-rendered.
function seeded(seed: number) { let s = seed; return () => (s = (s * 9301 + 49297) % 233280) / 233280; }

export default function PixelArt({ n = 28, seed = 11, className }: { n?: number; seed?: number; className?: string }) {
  const r = seeded(seed);
  const orbs: [number, number, number][] = [[9, 10, 6.2], [19, 8, 4.6], [15, 19, 5.4], [24, 21, 3.2]];
  const cells: React.ReactElement[] = [];
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    let d = 99;
    for (const [ox, oy, rad] of orbs) d = Math.min(d, Math.hypot(x - ox, y - oy) - rad);
    let o = 0;
    if (d < -2) o = r() > .15 ? 1 : .7;
    else if (d < 0) o = r() > .4 ? .7 : .45;
    else if (d < 1.5) o = r() > .55 ? .3 : 0;
    else o = r() > .93 ? .18 : 0;
    if (o) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" className="fill-red" opacity={o} />);
  }
  return <svg viewBox={`0 0 ${n} ${n}`} className={className} shapeRendering="crispEdges" aria-hidden="true">{cells}</svg>;
}
