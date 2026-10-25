import { displayCode, getCategory } from "@/lib/categories";
import type { Project } from "@/lib/types";
import Bb from "./Bb";

// Project cover, or an RX-style placeholder plate when no image exists yet.
export default function Cover({ project, eager = false }: { project: Project; eager?: boolean }) {
  if (project.cover_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className="cover__img"
        src={project.cover_url}
        alt={`${project.title} — cover`}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
    );
  }
  const cat = getCategory(project.category);
  return (
    <div className="cover__ph" aria-hidden="true">
      <Bb text={cat.bb} bold className="cover__ph-bb" />
      <span className="cover__ph-code">{displayCode(project.code)}</span>
      <span className="label">NO IMAGE // UPLOAD IN CONTROL PANEL</span>
    </div>
  );
}
