import { BB_UNICODE, tokenize } from "@/lib/baybayin";

// Vertical stacked Baybayin columns (Siklab "BBCol") — decorative, hidden from screen readers.
export default function BbCols({ lines, className = "" }: { lines: string[]; className?: string }) {
  return (
    <span className={`bbcols ${className}`.trim()} aria-hidden="true">
      {lines.map((l) => (
        <span key={l} className="bbcol" lang="tl-Tglg">
          {tokenize(l).filter((k) => k !== " ").map((k, i) => <span key={i}>{BB_UNICODE[k] ?? ""}</span>)}
        </span>
      ))}
    </span>
  );
}
