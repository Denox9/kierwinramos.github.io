import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Cover from "@/components/Cover";
import Bb from "@/components/Bb";
import { displayCode, getCategory } from "@/lib/categories";
import { getProjectByCode, getPublishedProjects } from "@/lib/data";

export const revalidate = 60;

type Props = { params: Promise<{ code: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const p = await getProjectByCode(decodeURIComponent(code));
  if (!p) return { title: "Not found" };
  return {
    title: `${p.title} — ${displayCode(p.code)}`,
    description: p.summary ?? undefined,
    openGraph: p.cover_url ? { images: [p.cover_url] } : undefined,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { code } = await params;
  const p = await getProjectByCode(decodeURIComponent(code));
  if (!p) notFound();

  const all = await getPublishedProjects();
  const idx = all.findIndex((x) => x.id === p.id);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;
  const cat = getCategory(p.category);

  const steps = [
    { n: "01", t: "PROBLEM", body: p.problem },
    { n: "02", t: "DIRECTION", body: p.direction },
    { n: "03", t: "RESULT", body: p.result },
  ].filter((s) => s.body);

  return (
    <article className="case">
      <header className="case__head">
        <div className="case__code">
          <Link href="/work" className="label">&lt;&lt;&lt; ARCHIVE</Link>
          <span className="case__serial">{displayCode(p.code)}</span>
        </div>
        <h1 className="case__title">{p.title}</h1>
        <dl className="meta">
          <div><dt className="label">CATEGORY</dt><dd>{cat.label}</dd></div>
          <div><dt className="label">CLIENT</dt><dd>{p.client ?? "—"}</dd></div>
          <div><dt className="label">YEAR</dt><dd className="tnum">{p.year ?? "—"}</dd></div>
          <div><dt className="label">TAGS</dt><dd>{p.tags.length ? p.tags.join(" / ") : "—"}</dd></div>
        </dl>
      </header>

      <div className="case__cover">
        <Cover project={p} eager />
        <span className="case__bb"><Bb text={cat.bb} bold /></span>
      </div>

      {p.summary && (
        <section className="case__summary">
          <span className="label">// BRIEF</span>
          <p>{p.summary}</p>
        </section>
      )}

      {steps.length > 0 && (
        <section className="case__steps" aria-label="Case study">
          {steps.map((s) => (
            <div key={s.n} className="cell">
              <span className="case__step-n">{s.n}</span>
              <h2 className="label case__step-t">{s.t}</h2>
              <p>{s.body}</p>
            </div>
          ))}
        </section>
      )}

      {(p.project_images ?? []).length > 0 && (
        <section className="gallery" aria-label="Gallery">
          {(p.project_images ?? []).map((img, i) => (
            <figure key={img.id} className="gallery__fig">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.caption ?? `${p.title} — figure ${i + 1}`} loading="lazy" decoding="async" />
              <figcaption className="label">
                FIG.{String(i + 1).padStart(2, "0")} {img.caption ? `— ${img.caption}` : ""}
              </figcaption>
            </figure>
          ))}
        </section>
      )}

      <nav className="pager" aria-label="More projects">
        {prev ? (
          <Link href={`/work/${encodeURIComponent(prev.code)}`} className="pager__item">
            <span className="label">&lt;&lt;&lt; PREV // {displayCode(prev.code)}</span>
            <span className="pager__t">{prev.title}</span>
          </Link>
        ) : <span className="pager__item pager__item--off label">START OF ARCHIVE</span>}
        {next ? (
          <Link href={`/work/${encodeURIComponent(next.code)}`} className="pager__item pager__item--next">
            <span className="label">NEXT // {displayCode(next.code)} &gt;&gt;&gt;</span>
            <span className="pager__t">{next.title}</span>
          </Link>
        ) : <span className="pager__item pager__item--off label">END OF ARCHIVE</span>}
      </nav>
    </article>
  );
}
