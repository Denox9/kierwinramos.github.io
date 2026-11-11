import Link from "next/link";
import { site } from "@/lib/site";
import Barcode from "./Barcode";
import Bb from "./Bb";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-foot">
      <div className="cells c3">
        <div>
          <p className="cell-title">Credit <Bb text="likha" /></p>
          <p className="label">{year} {site.name}. Built on the grid,<br />born from fire.</p>
        </div>
        <div>
          <p className="cell-title">Links</p>
          <ul className="footer__links">
            {site.socials.map((s) => (
              <li key={s.label}><a href={s.href} target="_blank" rel="noreferrer">{s.label} ↗</a></li>
            ))}
            <li><Link href="/admin">Control panel →</Link></li>
          </ul>
        </div>
        <div className="stack" style={{ gap: "0.625rem" }}>
          <p className="micro">BRAND: {site.name} / MODEL: {site.model}</p>
          <Barcode value={site.serial} />
          <p className="micro">SER. {site.serial} — <Bb text="ingat" bold /> HANDLE WITH CARE</p>
        </div>
      </div>
      <div className="footer">
        <p className="micro">{year} {site.name}. A {site.name} ORIGINAL SYSTEM · SIKLAB/68 GRID</p>
        <p className="micro">{site.location.toUpperCase()} · {site.model}</p>
      </div>
    </footer>
  );
}
