"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, displayCode, getCategory } from "@/lib/categories";
import { createClient } from "@/lib/supabase/client";
import { BUCKET } from "@/lib/supabase/env";
import type { Project } from "@/lib/types";

const MAX_BYTES = 15 * 1024 * 1024;
const ACCEPT = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"];

type FormState = {
  code: string; title: string; category: string; client: string; year: string;
  summary: string; problem: string; direction: string; result: string; tags: string;
  featured: boolean; status: "draft" | "published"; sort_order: string;
};

type GalleryItem = { key: string; id?: string; url: string; path?: string; caption: string; file?: File };

const uid = () => Math.random().toString(36).slice(2, 10);
const extOf = (f: File) => (f.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "") || "png";
const errMsg = (e: unknown) =>
  e instanceof Error ? e.message : typeof e === "object" && e && "message" in e ? String((e as { message: unknown }).message) : "Unknown error";

export default function ProjectForm({ initial }: { initial?: Project }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const coverInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);

  const [f, setF] = useState<FormState>({
    code: initial?.code ?? "",
    title: initial?.title ?? "",
    category: initial?.category ?? "ppt",
    client: initial?.client ?? "",
    year: String(initial?.year ?? new Date().getFullYear()),
    summary: initial?.summary ?? "",
    problem: initial?.problem ?? "",
    direction: initial?.direction ?? "",
    result: initial?.result ?? "",
    tags: (initial?.tags ?? []).join(", "),
    featured: initial?.featured ?? false,
    status: initial?.status ?? "draft",
    sort_order: String(initial?.sort_order ?? 0),
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(initial?.cover_url ?? null);
  const [gallery, setGallery] = useState<GalleryItem[]>(() =>
    (initial?.project_images ?? [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((i) => ({ key: i.id, id: i.id, url: i.url, path: i.path, caption: i.caption ?? "" }))
  );
  const [removed, setRemoved] = useState<{ id: string; path: string }[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [err, setErr] = useState("");

  // Auto-suggest a code for brand-new projects.
  useEffect(() => {
    if (!initial && !f.code) void autoCode(f.category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (k: keyof FormState, v: string | boolean) => setF((p) => ({ ...p, [k]: v }));

  async function autoCode(category: string) {
    const prefix = getCategory(category).prefix;
    const { data } = await supabase.from("projects").select("code").like("code", `${prefix}-%`);
    const nums = (data ?? [])
      .map((r: { code: string }) => parseInt(r.code.split("-").pop() || "0", 10))
      .filter((n: number) => !Number.isNaN(n));
    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    set("code", `${prefix}-${String(next).padStart(3, "0")}`);
  }

  function validateFile(file: File): string | null {
    if (!ACCEPT.includes(file.type)) return `${file.name}: UNSUPPORTED TYPE (PNG/JPG/WEBP/GIF/SVG ONLY)`;
    if (file.size > MAX_BYTES) return `${file.name}: OVER 15 MB`;
    return null;
  }

  function pickCover(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    const bad = validateFile(file);
    if (bad) { setErr(bad); return; }
    setErr("");
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  function addGallery(files: FileList | null) {
    if (!files) return;
    const items: GalleryItem[] = [];
    const errors: string[] = [];
    Array.from(files).forEach((file) => {
      const bad = validateFile(file);
      if (bad) errors.push(bad);
      else items.push({ key: uid(), url: URL.createObjectURL(file), caption: "", file });
    });
    setErr(errors.join(" · "));
    setGallery((g) => [...g, ...items]);
  }

  function move(i: number, d: -1 | 1) {
    setGallery((g) => {
      const j = i + d;
      if (j < 0 || j >= g.length) return g;
      const copy = g.slice();
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  }

  function removeItem(i: number) {
    setGallery((g) => {
      const item = g[i];
      if (item.id && item.path) setRemoved((r) => [...r, { id: item.id!, path: item.path! }]);
      if (item.file) URL.revokeObjectURL(item.url);
      return g.filter((_, k) => k !== i);
    });
  }

  async function upload(file: File, code: string, name: string) {
    const path = `${code}/${name}-${Date.now()}-${uid()}.${extOf(file)}`;
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type });
    if (error) throw error;
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return { path, url: data.publicUrl };
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const code = f.code.trim().toUpperCase();
    if (!/^[A-Z0-9-]{3,24}$/.test(code)) { setErr("CODE MUST BE 3–24 CHARS: A–Z, 0–9, DASH (e.g. INF-014)."); return; }
    if (!f.title.trim()) { setErr("TITLE IS REQUIRED."); return; }
    const year = f.year.trim() ? parseInt(f.year, 10) : null;
    if (year !== null && (Number.isNaN(year) || year < 1990 || year > 2100)) { setErr("YEAR MUST BE 1990–2100."); return; }
    const sort = parseInt(f.sort_order, 10);

    setBusy(true);
    try {
      const payload = {
        code,
        title: f.title.trim(),
        category: f.category,
        client: f.client.trim() || null,
        year,
        summary: f.summary.trim() || null,
        problem: f.problem.trim() || null,
        direction: f.direction.trim() || null,
        result: f.result.trim() || null,
        tags: f.tags.split(",").map((t) => t.trim()).filter(Boolean),
        featured: f.featured,
        status: f.status,
        sort_order: Number.isNaN(sort) ? 0 : sort,
      };

      setProgress("SAVING RECORD…");
      let id = initial?.id;
      if (id) {
        const { error } = await supabase.from("projects").update(payload).eq("id", id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("projects").insert(payload).select("id").single();
        if (error) throw error;
        id = (data as { id: string }).id;
      }

      if (coverFile) {
        setProgress("UPLOADING COVER…");
        const up = await upload(coverFile, code, "cover");
        const { error } = await supabase.from("projects").update({ cover_url: up.url, cover_path: up.path }).eq("id", id);
        if (error) throw error;
        if (initial?.cover_path) await supabase.storage.from(BUCKET).remove([initial.cover_path]);
      }

      if (removed.length) {
        setProgress("REMOVING IMAGES…");
        await supabase.storage.from(BUCKET).remove(removed.map((r) => r.path));
        const { error } = await supabase.from("project_images").delete().in("id", removed.map((r) => r.id));
        if (error) throw error;
      }

      for (let i = 0; i < gallery.length; i++) {
        const g = gallery[i];
        if (g.file) {
          setProgress(`UPLOADING IMAGE ${i + 1}/${gallery.length}…`);
          const up = await upload(g.file, code, `img-${String(i + 1).padStart(2, "0")}`);
          const { error } = await supabase.from("project_images").insert({
            project_id: id, url: up.url, path: up.path, caption: g.caption.trim() || null, sort_order: i,
          });
          if (error) throw error;
        } else if (g.id) {
          const { error } = await supabase.from("project_images")
            .update({ caption: g.caption.trim() || null, sort_order: i }).eq("id", g.id);
          if (error) throw error;
        }
      }

      setProgress("PUBLISHING…");
      await fetch("/api/revalidate", { method: "POST" });
      router.push("/admin");
      router.refresh();
    } catch (e2) {
      setErr(errMsg(e2).toUpperCase());
      setProgress("");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!initial) return;
    if (!window.confirm(`DELETE ${displayCode(initial.code)} AND ALL ITS IMAGES? THIS CANNOT BE UNDONE.`)) return;
    setBusy(true);
    try {
      const paths = [initial.cover_path, ...(initial.project_images ?? []).map((i) => i.path)].filter(
        (p): p is string => Boolean(p)
      );
      if (paths.length) await supabase.storage.from(BUCKET).remove(paths);
      const { error } = await supabase.from("projects").delete().eq("id", initial.id);
      if (error) throw error;
      await fetch("/api/revalidate", { method: "POST" });
      router.push("/admin");
      router.refresh();
    } catch (e2) {
      setErr(errMsg(e2).toUpperCase());
      setBusy(false);
    }
  }

  const prevent = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };

  return (
    <form className="pform" onSubmit={onSubmit} noValidate>
      {/* LEFT: data */}
      <div className="pform__main">
        <fieldset className="panel">
          <legend className="panel__bar label"><span>01 // IDENTIFICATION</span></legend>
          <div className="panel__body form-grid">
            <label className="field">
              <span className="label">CATEGORY</span>
              <select className="input" value={f.category} onChange={(e) => { set("category", e.target.value); if (!initial) void autoCode(e.target.value); }}>
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </label>
            <label className="field">
              <span className="label">PROJECT CODE → {displayCode(f.code || "XXX-000")}</span>
              <div className="input-row">
                <input className="input mono" value={f.code} maxLength={24} required
                  onChange={(e) => set("code", e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ""))} />
                <button type="button" className="btn btn--sm" onClick={() => autoCode(f.category)}>AUTO</button>
              </div>
            </label>
            <label className="field field--wide">
              <span className="label">PROJECT TITLE *</span>
              <input className="input" value={f.title} required onChange={(e) => set("title", e.target.value)} />
            </label>
            <label className="field">
              <span className="label">CLIENT / CONTEXT</span>
              <input className="input" value={f.client} onChange={(e) => set("client", e.target.value)} />
            </label>
            <label className="field">
              <span className="label">YEAR</span>
              <input className="input mono" inputMode="numeric" value={f.year} maxLength={4}
                onChange={(e) => set("year", e.target.value.replace(/\D/g, ""))} />
            </label>
            <label className="field field--wide">
              <span className="label">TAGS (COMMA SEPARATED)</span>
              <input className="input" value={f.tags} placeholder="Corporate, AI, Infographic" onChange={(e) => set("tags", e.target.value)} />
            </label>
          </div>
        </fieldset>

        <fieldset className="panel">
          <legend className="panel__bar label"><span>02 // CASE STUDY</span></legend>
          <div className="panel__body form-grid">
            <label className="field field--wide">
              <span className="label">BRIEF / SUMMARY</span>
              <textarea className="input" rows={3} value={f.summary} onChange={(e) => set("summary", e.target.value)} />
            </label>
            <label className="field field--wide">
              <span className="label">01 — PROBLEM</span>
              <textarea className="input" rows={3} value={f.problem} onChange={(e) => set("problem", e.target.value)} />
            </label>
            <label className="field field--wide">
              <span className="label">02 — DIRECTION</span>
              <textarea className="input" rows={3} value={f.direction} onChange={(e) => set("direction", e.target.value)} />
            </label>
            <label className="field field--wide">
              <span className="label">03 — RESULT</span>
              <textarea className="input" rows={3} value={f.result} onChange={(e) => set("result", e.target.value)} />
            </label>
          </div>
        </fieldset>

        <fieldset className="panel">
          <legend className="panel__bar label"><span>03 // GALLERY</span><span>{String(gallery.length).padStart(2, "0")} FILES</span></legend>
          <div className="panel__body">
            <div
              className="drop"
              onDragEnter={prevent}
              onDragOver={prevent}
              onDrop={(e) => { prevent(e); addGallery(e.dataTransfer.files); }}
            >
              <p className="label">DROP SLIDES / CROPS / MOCKUPS HERE</p>
              <button type="button" className="btn btn--sm" onClick={() => galleryInput.current?.click()}>[ + ADD IMAGES ]</button>
              <input ref={galleryInput} type="file" accept={ACCEPT.join(",")} multiple hidden
                onChange={(e) => { addGallery(e.target.files); e.target.value = ""; }} />
            </div>
            {gallery.length > 0 && (
              <ol className="thumbs">
                {gallery.map((g, i) => (
                  <li key={g.key} className="thumb">
                    <div className="thumb__img">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={g.url} alt="" />
                      <span className="thumb__n label">FIG.{String(i + 1).padStart(2, "0")}{g.file ? " · NEW" : ""}</span>
                    </div>
                    <input className="input input--sm" placeholder="Caption" aria-label={`Caption for figure ${i + 1}`} value={g.caption}
                      onChange={(e) => setGallery((all) => all.map((x, k) => (k === i ? { ...x, caption: e.target.value } : x)))} />
                    <div className="thumb__act">
                      <button type="button" className="btn btn--sm" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
                      <button type="button" className="btn btn--sm" onClick={() => move(i, 1)} disabled={i === gallery.length - 1} aria-label="Move down">↓</button>
                      <button type="button" className="btn btn--sm btn--danger" onClick={() => removeItem(i)} aria-label="Remove image">✕</button>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </fieldset>
      </div>

      {/* RIGHT: cover + publish */}
      <aside className="pform__side">
        <fieldset className="panel">
          <legend className="panel__bar label"><span>04 // COVER</span></legend>
          <div className="panel__body">
            <div
              className="drop drop--cover"
              onDragEnter={prevent}
              onDragOver={prevent}
              onDrop={(e) => { prevent(e); pickCover(e.dataTransfer.files); }}
            >
              {coverPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverPreview} alt="Cover preview" />
              ) : (
                <p className="label">DROP COVER IMAGE<br />RECOMMENDED 2400×1800 WEBP</p>
              )}
            </div>
            <button type="button" className="btn btn--sm btn--block" onClick={() => coverInput.current?.click()}>[ SELECT / REPLACE ]</button>
            <input ref={coverInput} type="file" accept={ACCEPT.join(",")} hidden
              onChange={(e) => { pickCover(e.target.files); e.target.value = ""; }} />
          </div>
        </fieldset>

        <fieldset className="panel">
          <legend className="panel__bar label"><span>05 // OUTPUT</span></legend>
          <div className="panel__body">
            <label className="check">
              <input type="checkbox" checked={f.featured} onChange={(e) => set("featured", e.target.checked)} />
              <span>FEATURED ON HOME</span>
            </label>
            <label className="check">
              <input type="checkbox" checked={f.status === "published"} onChange={(e) => set("status", e.target.checked ? "published" : "draft")} />
              <span>PUBLISHED (VISIBLE TO PUBLIC)</span>
            </label>
            <label className="field">
              <span className="label">SORT ORDER (LOW = FIRST)</span>
              <input className="input mono" inputMode="numeric" value={f.sort_order}
                onChange={(e) => set("sort_order", e.target.value.replace(/[^\d-]/g, ""))} />
            </label>

            {err && <p className="alert" role="alert">! {err}</p>}
            <p className="label" aria-live="polite">{progress}</p>

            <button type="submit" className="btn btn--accent btn--block" disabled={busy}>
              {busy ? "PROCESSING…" : f.status === "published" ? "SAVE + PUBLISH >>>" : "SAVE DRAFT >>>"}
            </button>
            {initial && (
              <button type="button" className="btn btn--danger btn--block" onClick={onDelete} disabled={busy}>
                [DELETE PROJECT]
              </button>
            )}
          </div>
          <div className="hazard hazard--thin" aria-hidden="true" />
        </fieldset>
      </aside>
    </form>
  );
}
