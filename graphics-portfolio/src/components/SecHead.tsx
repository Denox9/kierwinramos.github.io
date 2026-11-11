import { transliterate } from "@/lib/baybayin";

type Props = { idx: string; title: string; soft?: string; side: string; meta: string; ghost?: string; id?: string; as?: "h1" | "h2" };

// Siklab section header: red thin numeral · mega title (soft gray first word) · vertical side label · Baybayin ghost.
export default function SecHead({ idx, title, soft, side, meta, ghost, id, as = "h2" }: Props) {
  const H = as;
  return (
    <>
      {ghost && <span className="sec-ghost" lang="tl-Tglg" aria-hidden="true">{transliterate(ghost)}</span>}
      <header className="sec-head">
        <span className="sec-num" aria-hidden="true">{idx}</span>
        <H id={id} className="sec-title">{soft && <span className="soft">{soft} </span>}{title}</H>
        <div className="sec-side">
          <div className="sec-meta"><p className="micro">{meta}</p><p className="micro">RX/09 · //{idx}</p></div>
          <span className="vlabel red">{side}—</span>
        </div>
      </header>
    </>
  );
}
