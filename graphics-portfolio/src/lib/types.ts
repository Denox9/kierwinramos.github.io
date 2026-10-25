import type { CategoryId } from "./categories";

export type ProjectImage = {
  id: string;
  project_id: string;
  url: string;
  path: string;
  caption: string | null;
  sort_order: number;
};

export type Project = {
  id: string;
  code: string;
  title: string;
  category: CategoryId;
  client: string | null;
  year: number | null;
  summary: string | null;
  problem: string | null;
  direction: string | null;
  result: string | null;
  tags: string[];
  cover_url: string | null;
  cover_path: string | null;
  featured: boolean;
  status: "draft" | "published";
  sort_order: number;
  created_at: string;
  project_images?: ProjectImage[];
};
