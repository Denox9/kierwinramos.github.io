import { transliterate, type BbOptions } from "@/lib/baybayin";

type Props = BbOptions & {
  /** Latin source text — transliterated to Baybayin at render time */
  text: string;
  className?: string;
  bold?: boolean;
  /** Decorative by default. Set to expose the Latin meaning to screen readers. */
  label?: string;
};

// Baybayin flavor text rendered with the RX09 Baybayin font.
export default function Bb({ text, className = "", bold = false, label, killer }: Props) {
  return (
    <span
      className={`bb${bold ? " bb--bold" : ""} ${className}`.trim()}
      lang="tl-Tglg"
      title={text}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      {transliterate(text, { killer })}
    </span>
  );
}
