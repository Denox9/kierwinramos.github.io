import { transliterate } from "@/lib/baybayin";

// { t: text, bb: true } renders in the RX09 Baybayin font
const ITEMS: { t: string; bb?: boolean }[] = [
  { t: "PRESENTATION DESIGN" }, { t: "▲ " + transliterate("babala"), bb: true }, { t: "LOGO / IDENTITY" }, { t: ">>>" },
  { t: "INFOGRAPHIC SYSTEMS" }, { t: transliterate("likha ang lakas"), bb: true }, { t: "BRAND SYSTEMS" }, { t: "//:009" },
  { t: "UI / WEB" }, { t: transliterate("sining"), bb: true }, { t: "SECURITY PROTOCOL ACTIVE" },
];

export default function Ticker() {
  const row = (k: string) => ITEMS.map((it, i) => (
      <span key={k + i} className={"ticker__item" + (it.bb ? " bb" : "")} lang={it.bb ? "tl-Tglg" : undefined}>{it.t}</span>
    ));
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track">{row("a")}{row("b")}</div>
    </div>
  );
}
