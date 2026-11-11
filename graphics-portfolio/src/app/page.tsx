import Link from "next/link";
import CountUp from "@/components/CountUp";
import HudGauge from "@/components/HudGauge";
import ProjectCard from "@/components/ProjectCard";
import Ticker from "@/components/Ticker";
import Bb from "@/components/Bb";
import BbSvg from "@/components/BbSvg";
import BbCols from "@/components/BbCols";
import PixelArt from "@/components/PixelArt";
import SecHead from "@/components/SecHead";
import { CATEGORIES } from "@/lib/categories";
import { getPublishedProjects } from "@/lib/data";
import { site } from "@/lib/site";

export const revalidate = 60;

export default async function Home() {
  const projects = await getPublishedProjects();
  const featured = (projects.some((p) => p.featured) ? projects.filter((p) => p.featured) : projects).slice(0, 3);
  const years = projects.map((p) => p.year).filter((y): y is number => !!y);
  const span = years.length ? `${Math.min(...years)}—${Math.max(...years)}` : String(new Date().getFullYear());
  const activeCats = CATEGORIES.filter((c) => projects.some((p) => p.category === c.id)).length;

  return (
    <>
      {/* 00 / COVER */}
      <section className="cover" aria-labelledby="hero-title">
        <div className="cover-left">
          <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
            <div className="stack" style={{ gap: "0.625rem" }}>
              <span className="mark ink" aria-hidden="true" />
              <p className="cover-intro">Presentation, logo and brand work <span className="red">engineered</span> on a grid.</p>
              <Link href="/work" className="link">Enter archive ↗</Link>
            </div>
            <div className="stack" style={{ gap: "0.375rem", textAlign: "right" }}>
              <p className="micro">MODEL {site.model} · {site.location.toUpperCase()}</p>
              <p className="micro">ARCHIVE {span}</p>
              <div className="cover-sig">
                <BbSvg text={site.baybayinName} height={34} />
              </div>
            </div>
          </div>
          <div>
            <p className="micro" style={{ marginBottom: "1rem" }}>INDEX — WORK · DESIGN INDEX · PROFILE · CONTACT</p>
            <h1 id="hero-title" className="cover-title">
              <span className="sr-only">{site.fullName}, {site.role}. </span>
              <span aria-hidden="true">{site.name}<br /><span className="red">/{site.model.replace(/^RX-?/, "")}</span></span>
            </h1>
            <p className="cover-role">{site.role}</p>
            <p className="cover-tag">{site.tagline}</p>
            <div className="cover-cta">
              <Link href="/work" className="btn red"><span>View archive</span><span aria-hidden="true">→</span></Link>
              <Link href="/#contact" className="btn ghost"><span>Contact</span></Link>
            </div>
          </div>
        </div>

        <div className="cover-art">
          <div className="art-red" aria-hidden="true" />
          <PixelArt className="art-px" />
          <div className="art-stripes stripes" aria-hidden="true" />
          <BbCols lines={["likha", "sining", "pasulong"]} className="art-cols" />
          <dl className="art-hud">
            <div>
              <dt className="micro">Projects</dt>
              <dd className="readout"><CountUp to={projects.length} /></dd>
            </div>
            <div>
              <dt className="micro">Disciplines</dt>
              <dd className="readout red"><CountUp to={activeCats} pad={2} /></dd>
            </div>
            <div style={{ display: "grid", placeItems: "center" }}>
              <HudGauge value={Math.min(1, projects.length / 30)} label="Archive capacity" />
            </div>
          </dl>
          <Link href="/work" className="btn sq art-arrow" aria-label="Open the work archive">↗</Link>
          <div className="art-circle" aria-hidden="true" />
          <div className="art-fig stack" style={{ gap: "0.5rem" }} aria-hidden="true">
            <p className="micro">FIG. 00 — COVER PLATE</p>
            <div className="pager-mini"><span className="red">01</span><i /><span>05</span></div>
          </div>
        </div>
      </section>

      <Ticker />

      {/* 01 / SELECTED WORK */}
      <section className="sec" aria-labelledby="sel-title">
        <SecHead idx="01" soft="Selected" title="Work" side="gawa" meta={`${String(featured.length).padStart(2, "0")} FEATURED · ARCHIVE ${span}`} ghost="gawa" id="sel-title" />
        {featured.length ? (
          <>
            <div className="grid-cards grid-cards--feature">
              {featured.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
            </div>
            <div className="row" style={{ marginTop: "1.5rem" }}>
              <Link href="/work" className="btn"><span>All projects</span><span aria-hidden="true">→</span></Link>
            </div>
          </>
        ) : (
          <div className="empty"><span className="warn-tri" aria-hidden="true">!</span><p className="label">ARCHIVE EMPTY — PUBLISH YOUR FIRST PROJECT</p></div>
        )}
      </section>

      {/* 02 / DESIGN INDEX */}
      <section className="sec" aria-labelledby="disc-title">
        <SecHead idx="02" soft="Design" title="Index" side="talaan" meta={`${CATEGORIES.length} DISCIPLINES · CLASS GRM-976`} ghost="talaan" id="disc-title" />
        <div className="index-list" style={{ borderTop: "2px solid var(--ink)" }}>
          {CATEGORIES.map((c, i) => {
            const n = projects.filter((p) => p.category === c.id).length;
            return (
              <Link key={c.id} href={`/work?cat=${c.id}`}>
                <span className="n">{String(i + 1).padStart(2, "0")}</span>
                <span className="t">{c.label}</span>
                <span className="micro d" style={{ display: "flex", gap: "0.75rem", alignItems: "center", justifyContent: "space-between" }}>
                  <Bb text={c.bb} bold /> <span>{String(n).padStart(2, "0")} PROJECTS ↗</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 03 / ABOUT */}
      <section id="about" className="sec" aria-labelledby="about-title">
        <SecHead idx="03" soft="Operator" title="Profile" side="tungkol" meta="SA/CT_II · SYSTEM-MINDED" ghost="tungkol" id="about-title" />
        <div className="cells c3">
          <div>
            <p className="cell-title">Brief</p>
            <p className="about-lead">
              I design presentations, logos, infographics and complete visual systems. My background in
              engineering means every layout is built on a grid, a rule set and a reason — clarity first,
              character second, decoration last.
            </p>
          </div>
          <div>
            <p className="cell-title">Capabilities</p>
            <ul className="spec">
              {site.skills.map((s, i) => <li key={s}><b>{String(i + 1).padStart(2, "0")}</b>{s}</li>)}
            </ul>
          </div>
          <div className="stack">
            <p className="cell-title">Signals</p>
            <div className="plate attn"><div className="sym"><span className="warn-tri" style={{ background: "var(--on-red)", color: "var(--red)" }} aria-hidden="true">!</span></div><div className="txt"><p className="word">Caution</p><p className="micro">SYSTEM-MINDED DESIGNER</p></div></div>
            <div className="plate"><div className="sym label">GRID</div><div className="txt"><p className="word">Expect grids</p><p className="micro">TOKENS · COMPONENTS</p></div></div>
            <div className="plate inverse"><div className="sym"><Bb text="likha" bold /></div><div className="txt"><p className="word">Reusable</p><p className="micro">BUILT TO DESIGN, BORN TO SHIP</p></div></div>
          </div>
        </div>
      </section>

      {/* 04 / CONTACT */}
      <section id="contact" className="contact" aria-labelledby="contact-title">
        <div className="contact__stripes stripes inv" aria-hidden="true" />
        <BbCols lines={["ugnayan", "tayo na"]} className="contact__cols" />
        <p className="micro">04 // OPEN CHANNEL — <Bb text="ugnayan" bold /></p>
        <h2 id="contact-title" className="contact__title">Let&apos;s<br /><span className="soft">build</span> it.</h2>
        <a className="btn lg" href={`mailto:${site.email}`}><span>{site.email}</span><span aria-hidden="true">→</span></a>
      </section>
    </>
  );
}
