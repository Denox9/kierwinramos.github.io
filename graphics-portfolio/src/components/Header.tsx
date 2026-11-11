import Link from "next/link";
import { site } from "@/lib/site";
import ModeSwitches from "./ModeSwitches";

const NAV = [
  { n: "01", label: "Index", href: "/" },
  { n: "02", label: "Work", href: "/work" },
  { n: "03", label: "About", href: "/#about" },
  { n: "04", label: "Contact", href: "/#contact" },
];

export default function Header() {
  return (
    <nav className="topnav" aria-label="Primary">
      <Link href="/" className="brand-mini" aria-label={`${site.fullName} — home`}>
        <span className="sq" aria-hidden="true" />
        <span>
          <b>{site.name}<br />/{site.model.replace(/^RX-?/, "")}</b>
        </span>
        <span className="sub">DESIGN ARCHIVE // {site.model}</span>
      </Link>
      <div className="links">
        {NAV.map((i) => (
          <Link key={i.n} href={i.href}>
            <span>{i.n}</span>{i.label}
          </Link>
        ))}
      </div>
      <div className="nav-tools">
        <ModeSwitches />
      </div>
    </nav>
  );
}
