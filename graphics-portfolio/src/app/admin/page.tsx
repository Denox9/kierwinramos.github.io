import Link from "next/link";
import { CATEGORIES, displayCode, getCategory } from "@/lib/categories";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";

export default async function AdminHome() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  const projects = (data ?? []) as Project[];
  const published = projects.filter((p) => p.status === "published").length;

  return (
    <section className="section">
      <header className="section__head">
        <span className="section__n">00</span>
        <h1 className="section__title">PROJECT CONTROL</h1>
        <Link href="/admin/new" className="btn btn--accent">+ NEW PROJECT</Link>
      </header>

      <dl className="stats">
        <div className="stat stat--accent"><dt className="label">TOTAL</dt><dd className="tnum">{String(projects.length).padStart(3, "0")}</dd></div>
        <div className="stat"><dt className="label">PUBLISHED</dt><dd className="tnum">{String(published).padStart(3, "0")}</dd></div>
        <div className="stat"><dt className="label">DRAFT</dt><dd className="tnum">{String(projects.length - published).padStart(3, "0")}</dd></div>
        {CATEGORIES.map((c) => (
          <div key={c.id} className="stat">
            <dt className="label">{c.short}</dt>
            <dd className="tnum">{String(projects.filter((p) => p.category === c.id).length).padStart(3, "0")}</dd>
          </div>
        ))}
      </dl>

      {projects.length === 0 ? (
        <div className="empty">
          <span className="warn-tri" aria-hidden="true">!</span>
          <p className="label">NO PROJECTS YET. PRESS [+ NEW PROJECT] TO UPLOAD YOUR FIRST DESIGN.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>CODE</th><th>TITLE</th><th>CATEGORY</th><th>YEAR</th><th>STATUS</th><th><span className="sr-only">Actions</span></th></tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td className="mono">{displayCode(p.code)}</td>
                  <td>{p.title}{p.featured && <span className="tag">FEATURED</span>}</td>
                  <td className="mono">{getCategory(p.category).short}</td>
                  <td className="mono">{p.year ?? "—"}</td>
                  <td><span className={`status status--${p.status}`}>{p.status.toUpperCase()}</span></td>
                  <td className="table__act">
                    <Link href={`/admin/${p.id}`} className="btn btn--sm">EDIT</Link>
                    {p.status === "published" && (
                      <Link href={`/work/${encodeURIComponent(p.code)}`} className="btn btn--sm" target="_blank">VIEW ↗</Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
