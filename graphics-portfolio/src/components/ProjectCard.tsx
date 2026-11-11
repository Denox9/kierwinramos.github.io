import Link from "next/link";
import { displayCode, getCategory } from "@/lib/categories";
import type { Project } from "@/lib/types";
import Cover from "./Cover";

export default function ProjectCard({ project, index }: { project: Project; index?: number }) {
  const cat = getCategory(project.category);
  return (
    <Link href={`/work/${encodeURIComponent(project.code)}`} className="card">
      <div className="card__bar">
        <span className="label">{displayCode(project.code)}</span>
        <span className="micro">{index !== undefined ? `S-${String(index + 1).padStart(2, "0")}` : cat.short}</span>
      </div>
      <div className="card__media">
        <Cover project={project} />
        {project.featured && <span className="card__flag label">Featured</span>}
      </div>
      <div className="card__body">
        <h3 className="card__title">{project.title}</h3>
        <p className="micro card__meta">
          <span>{cat.label} / {project.year ?? "—"}</span> <span className="card__go">↗</span>
        </p>
      </div>
    </Link>
  );
}
