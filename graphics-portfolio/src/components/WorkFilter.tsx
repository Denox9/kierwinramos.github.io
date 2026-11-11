"use client";
import { useMemo, useState } from "react";
import { CATEGORIES } from "@/lib/categories";
import type { Project } from "@/lib/types";
import ProjectCard from "./ProjectCard";
import Bb from "./Bb";

export default function WorkFilter({ projects, initial }: { projects: Project[]; initial: string }) {
  const valid = initial === "all" || CATEGORIES.some((c) => c.id === initial);
  const [active, setActive] = useState(valid ? initial : "all");

  const shown = useMemo(
    () => (active === "all" ? projects : projects.filter((p) => p.category === active)),
    [active, projects]
  );

  function select(id: string) {
    setActive(id);
    const url = id === "all" ? "/work" : `/work?cat=${id}`;
    window.history.replaceState(null, "", url);
  }

  const options = [{ id: "all", short: "ALL" }, ...CATEGORIES.map((c) => ({ id: c.id, short: c.short }))];

  return (
    <>
      <div className="filters" role="group" aria-label="Filter by category">
        {options.map((o) => {
          const n = o.id === "all" ? projects.length : projects.filter((p) => p.category === o.id).length;
          return (
            <button key={o.id} type="button" className="filter" aria-pressed={active === o.id} onClick={() => select(o.id)}>
              {o.short} <span className="chip__n">{String(n).padStart(2, "0")}</span>
            </button>
          );
        })}
        <p className="micro filters__count" aria-live="polite">
          SHOWING {String(shown.length).padStart(3, "0")} / {String(projects.length).padStart(3, "0")}
        </p>
      </div>
      {shown.length ? (
        <div className="grid-cards" style={{ borderTop: 0 }}>
          {shown.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
        </div>
      ) : (
        <div className="empty">
          <span className="warn-tri" aria-hidden="true">!</span>
          <p className="label">NO WORK IN THIS CATEGORY YET // <Bb text="wala pa" /></p>
        </div>
      )}
    </>
  );
}
