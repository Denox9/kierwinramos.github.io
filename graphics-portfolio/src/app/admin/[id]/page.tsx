import { notFound } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import { displayCode } from "@/lib/categories";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";

type Props = { params: Promise<{ id: string }> };

export default async function EditProject({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("*, project_images(*)").eq("id", id).maybeSingle();
  if (!data) notFound();
  const project = data as Project;
  return (
    <section className="section">
      <header className="section__head">
        <span className="section__n">ED</span>
        <h1 className="section__title">{displayCode(project.code)}</h1>
      </header>
      <ProjectForm initial={project} />
    </section>
  );
}
