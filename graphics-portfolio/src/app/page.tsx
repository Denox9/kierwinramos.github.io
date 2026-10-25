import Link from "next/link";
import CountUp from "@/components/CountUp";
import HudGauge from "@/components/HudGauge";
import ProjectCard from "@/components/ProjectCard";
import Ticker from "@/components/Ticker";
import Bb from "@/components/Bb";
import BbSvg from "@/components/BbSvg";
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
      {/* 01 / HERO */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__block" aria-hidden="true" />
        <div className="hero__meta">
          <span className="label">// PORTFOLIO SYSTEM</span>
          <span className="label">MODEL: {site.model}</span>
          <span className="label">LOC: {site.location.toUpperCase()}</span>
          <span className="label">ARCHIVE {span}</span>
        </div>

        <h1 id="hero-title" className="hero__title">
          <span className="sr-only">{site.fullName}, </span>
          <span aria-hidden="true">{site.name}</span>
          <span className="sr-only">{site.role}</span>
        </h1>

        <div className="hero__info">
          <div className="hero__copy">
            <div className="hero__sig">
              <BbSvg text={site.baybayinName} height={44} className="hero__sig-svg" />
              <span className="label">{site.baybayinName.toUpperCase()} // <Bb text="baybayin" /> SIGNATURE</span>
            </div>
            <p className="hero__role">{site.role}</p>
            <p className="hero__tag">{site.tagline}</p>
            <div className="hero__cta">
              <Link href="/work" className="btn btn--accent">VIEW ARCHIVE &gt;&gt;&gt;</Link>
              <Link href="/#contact" className="btn">[CONTACT]</Link>
            </div>
          </div>

          <div className="hero__hud">
            <dl className="readouts">
              <div className="readout">
                <dt className="label">PROJECTS</dt>
                <dd className="readout__num"><CountUp to={projects.length} /></dd>
              </div>
              <div className="readout">
                <dt className="label">DISCIPLINES</dt>
                <dd className="readout__num"><CountUp to={activeCats} pad={2} /></dd>
              </div>
            </dl>
            <HudGauge value={Math.min(1, projects.length / 30)} label="ARCHIVE CAPACITY" />
          </div>
        </div>

        <p className="hero__bb-line" aria-hidden="true">
          <Bb text="likha" /> · <Bb text="sining" /> · <Bb text="pasulong" />
        </p>
        <svg className="hero__circuit" viewBox="0 0 400 120" aria-hidden="true">
          <path d="M0 100 H120 L150 70 H260 L290 40 H400" fill="none" stroke="currentColor" />
          <path d="M40 120 V90 L60 70 H110" fill="none" stroke="currentColor" />
          <circle cx="110" cy="70" r="3" fill="currentColor" />
          <rect x="257" y="67" width="6" height="6" fill="currentColor" />
          <circle cx="290" cy="40" r="3" fill="var(--accent)" />
        </svg>
      </section>

      <Ticker />

      {/* 02 / SELECTED WORK */}
      <section className="section" aria-labelledby="sel-title">
        <header className="section__head">
          <span className="section__n">02</span>
          <h2 id="sel-title" className="section__title">SELECTED WORK</h2>
          <Link href="/work" className="label section__link">ALL PROJECTS &gt;&gt;&gt;</Link>
        </header>
        {featured.length ? (
          <div className="grid-cards grid-cards--feature">
            {featured.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
          </div>
        ) : (
          <div className="empty"><span className="warn-tri" aria-hidden="true">!</span><p className="label">ARCHIVE EMPTY — PUBLISH YOUR FIRST PROJECT</p></div>
        )}
      </section>

      {/* 03 / DISCIPLINES */}
      <section className="section" aria-labelledby="disc-title">
        <header className="section__head">
          <span className="section__n">03</span>
          <h2 id="disc-title" className="section__title">DESIGN INDEX</h2>
          <span className="label section__link">CLASS GRM-976</span>
        </header>
        <ul className="disc">
          {CATEGORIES.map((c, i) => {
            const n = projects.filter((p) => p.category === c.id).length;
            return (
              <li key={c.id}>
                <Link href={`/work?cat=${c.id}`} className="disc__item">
                  <span className="label">//:{String(i + 1).padStart(3, "0")} — <Bb text={c.bb} /></span>
                  <span className="disc__label">{c.label}</span>
                  <span className="disc__n tnum">{String(n).padStart(2, "0")}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 04 / ABOUT */}
      <section id="about" className="section about" aria-labelledby="about-title">
        <header className="section__head">
          <span className="section__n">04</span>
          <h2 id="about-title" className="section__title">OPERATOR PROFILE</h2>
          <span className="label section__link">SA/CT_II</span>
        </header>
        <div className="about__grid">
          <div className="cell about__lead">
            <p>
              I design presentations, logos, infographics and complete visual systems. My background in
              engineering means every layout is built on a grid, a rule set and a reason — clarity first,
              character second, decoration last.
            </p>
          </div>
          <div className="cell">
            <span className="label">// CAPABILITIES</span>
            <ul className="spec">
              {site.skills.map((s) => <li key={s}><span>[X]</span> {s}</li>)}
            </ul>
          </div>
          <div className="cell about__warn">
            <span className="warn-tri" aria-hidden="true">!</span>
            <p className="label">CAUTION: SYSTEM-MINDED DESIGNER.<br />EXPECT GRIDS, TOKENS AND REUSABLE COMPONENTS.</p>
          </div>
        </div>
      </section>

      {/* 05 / CONTACT */}
      <section id="contact" className="contact" aria-labelledby="contact-title">
        <div className="contact__inner">
          <span className="label">05 // OPEN CHANNEL — <Bb text="ugnayan" bold /></span>
          <h2 id="contact-title" className="contact__title">LET&apos;S BUILD SOMETHING.</h2>
          <a className="btn btn--ink btn--lg" href={`mailto:${site.email}`}>{site.email.toUpperCase()} &gt;&gt;&gt;</a>
        </div>
      </section>
    </>
  );
}
