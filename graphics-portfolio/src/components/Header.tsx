import Link from "next/link";
import { site } from "@/lib/site";
import ThemeToggle from "./ThemeToggle";

const NAV = [
  { n: "01", label: "INDEX", href: "/" },
  { n: "02", label: "WORK", href: "/work" },
  { n: "03", label: "ABOUT", href: "/#about" },
  { n: "04", label: "CONTACT", href: "/#contact" },
];

export default function Header() {
  return (
    <header className="header">
      <Link href="/" className="brand" aria-label={`${site.fullName} — home`}>
        <svg className="brand__mark" viewBox="0 0 64 64" aria-hidden="true">
          <path d="M8 0h56v56l-8 8H0V8z" fill="currentColor" />
          <path d="M40 0h24v24z" fill="var(--accent)" />
          <text x="32" y="44" textAnchor="middle" fontSize="26" fontWeight="700" fill="var(--bg)" fontFamily="monospace">09</text>
        </svg>
        <span className="brand__text">
          <strong>{site.name}</strong>
          <span className="label">DESIGN ARCHIVE // {site.model}</span>
        </span>
      </Link>
      <nav aria-label="Primary" className="nav">
        {NAV.map((i) => (
          <Link key={i.n} href={i.href} className="nav__item">
            <span className="nav__n">{i.n}</span>[{i.label}]
          </Link>
        ))}
      </nav>
      <div className="header__status label" aria-hidden="true">
        <span className="dot" /> ONLINE<span className="blink">_</span>
      </div>
      <div className="header__theme">
        <ThemeToggle />
      </div>
    </header>
  );
}
