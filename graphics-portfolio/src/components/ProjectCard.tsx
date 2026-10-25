import Link from "next/link";
import { displayCode, getCategory } from "@/lib/categories";
import type { Project } from "@/lib/types";
import Cover from "./Cover";

export default function ProjectCard({ project, index }: { project: Project; index?: number }) {
  const cat = getCategory(project.category);
  return (
    <Link href={`/work/${encodeURIComponent(project.code)}`} className="card">
      <div className="card__bar label">
        <span>{displayCode(project.code)}</span>
        <span>{index !== undefined ? `#${String(index + 1).padStart(2, "0")}` : cat.short}</span>
      </div>
      <div className="card__media">
        <Cover project={project} />
        {project.featured && <span className="card__flag label">[X] FEATURED</span>}
      </div>
      <div className="card__body">
        <h3 className="card__title">{project.title}</h3>
        <p className="label card__meta">
          {cat.label} / {project.year ?? "—"} <span className="card__go">&gt;&gt;&gt;</span>
        </p>
      </div>
    </Link>
  );
}
