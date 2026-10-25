// Shown only while Supabase env vars are not set — lets you preview the design.
import type { Project } from "./types";

const base = {
  client: null, summary: null, problem: null, direction: null, result: null,
  cover_url: null, cover_path: null, status: "published" as const,
  sort_order: 0, created_at: "2026-01-01T00:00:00Z", project_images: [],
};

export const DEMO_PROJECTS: Project[] = [
  { ...base, id: "d1", code: "PPT-001", title: "Corporate AI Strategy Deck", category: "ppt", year: 2026, featured: true, tags: ["Corporate", "AI"],
    client: "Internal", summary: "A 24-slide executive deck explaining a private AI platform, savings model and rollout plan.",
    problem: "Dense technical content had to be understood by non-technical management in under 10 minutes.",
    direction: "Industrial grid layout, one accent color, KPI readouts and a single idea per slide.",
    result: "Approved in the first review. The slide system was reused for three follow-up proposals." },
  { ...base, id: "d2", code: "INF-002", title: "Email Assistant Before / After", category: "infographic", year: 2026, featured: true, tags: ["Process", "Agentic AI"],
    summary: "Process infographic comparing manual email triage against an AI-assisted workflow." },
  { ...base, id: "d3", code: "LOG-003", title: "RX-09 Mark System", category: "logo", year: 2026, featured: true, tags: ["Identity", "Mecha"],
    summary: "Chamfered monogram, lockups and a pictogram kit for a fictional machine brand." },
  { ...base, id: "d4", code: "BRD-004", title: "ProtoLab Visual Identity", category: "branding", year: 2026, featured: false, tags: ["System", "Enterprise"],
    summary: "Typography, color, grid and component rules for an internal knowledge platform." },
  { ...base, id: "d5", code: "UI-005", title: "PNG-01 NetMon Dashboard", category: "ui", year: 2026, featured: false, tags: ["Dashboard", "HUD"],
    summary: "Network monitor interface with HUD gauges and live status readouts." },
  { ...base, id: "d6", code: "EXP-006", title: "Baybayin Mecha Type Study", category: "other", year: 2026, featured: false, tags: ["Type", "Baybayin"],
    summary: "Experimental angular Baybayin glyphs designed for the RX-09 system." },
];
