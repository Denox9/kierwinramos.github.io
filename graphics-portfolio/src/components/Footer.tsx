import Link from "next/link";
import { site } from "@/lib/site";
import Barcode from "./Barcode";
import Bb from "./Bb";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="hazard hazard--thin" aria-hidden="true" />
      <div className="footer__grid">
        <div className="cell">
          <span className="label">// CREDIT <Bb text="likha" /></span>
          <p className="footer__credit">
            {year} {site.name}. A {site.name} ORIGINAL SYSTEM.
            <br />BUILT TO DESIGN, BORN TO SHIP.
          </p>
        </div>
        <div className="cell">
          <span className="label">// LINKS</span>
          <ul className="footer__links">
            {site.socials.map((s) => (
              <li key={s.label}><a href={s.href} target="_blank" rel="noreferrer">[{s.label}] ↗</a></li>
            ))}
            <li><Link href="/admin">[CONTROL PANEL]</Link></li>
          </ul>
        </div>
        <div className="cell footer__code">
          <span className="label">BRAND: {site.name} / MODEL: {site.model}</span>
          <Barcode value={site.serial} />
          <span className="label">SER. {site.serial} — <Bb text="babala" bold /> STAND CLEAR</span>
        </div>
      </div>
    </footer>
  );
}
