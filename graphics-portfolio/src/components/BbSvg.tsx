import { baybayinPaths, type BbSvgOptions } from "@/lib/baybayin-svg";

// Server Component: Baybayin as pure vector (for logos / hero marks).
export default function BbSvg({ text, height = 48, className, ...opt }: BbSvgOptions & { text: string; className?: string }) {
  const { width, height: uh, paths } = baybayinPaths(text, opt);
  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${uh}`}
      height={height}
      width={Math.round((height * width) / uh)}
      role="img"
      aria-label={`${text} in Baybayin`}
    >
      <g fill={opt.color ?? "currentColor"}>
        {paths.map((p, i) => <path key={i} transform={`translate(${p.x} 0)`} d={p.d} />)}
      </g>
    </svg>
  );
}
