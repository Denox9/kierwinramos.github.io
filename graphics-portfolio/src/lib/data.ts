import { DEMO_PROJECTS } from "./demo";
import { createPublicClient } from "./supabase/public";
import { isSupabaseConfigured } from "./supabase/env";
import type { Project } from "./types";

export async function getPublishedProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured) return DEMO_PROJECTS;
  const sb = createPublicClient();
  const { data, error } = await sb
    .from("projects")
    .select("*")
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[projects]", error.message);
    return [];
  }
  return (data ?? []) as Project[];
}

export async function getProjectByCode(code: string): Promise<Project | null> {
  if (!isSupabaseConfigured) return DEMO_PROJECTS.find((p) => p.code === code) ?? null;
  const sb = createPublicClient();
  const { data, error } = await sb
    .from("projects")
    .select("*, project_images(*)")
    .eq("code", code)
    .eq("status", "published")
    .maybeSingle();
  if (error || !data) return null;
  const project = data as Project;
  project.project_images = (project.project_images ?? []).sort(
    (a, b) => a.sort_order - b.sort_order
  );
  return project;
}
