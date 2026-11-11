# RX DESIGN ARCHIVE — Graphic Design Portfolio

`NEXT.JS 15 · REACT 19 · SUPABASE · VERCEL` — redesigned on the **SIKLAB/68** Swiss-constructivist system (one red, Baybayin, 90% scale).

A public portfolio for presentations, logos, infographics and brand systems, plus a private
**/admin control panel** where you upload designs. You never have to touch code to publish new work.

```
/                 Home: hero, selected work, design index, about, contact
/work             Filterable archive  [ALL] [PPT] [LOGO] [INFO] [BRAND] [UI] [EXP]
/work/PPT-001     Case study: brief → problem → direction → result → gallery
/login            Admin sign-in
/admin            Project control: list, stats, + new project
/admin/new        Upload form (cover + gallery, drag & drop)
/admin/[id]       Edit / reorder images / delete
```

> No Supabase keys yet? The site still runs with **demo projects** so you can preview the design.

---

## 01 // SET UP SUPABASE (≈5 min)

1. Create a project at **supabase.com → New project**.
2. **SQL Editor → New query** → paste all of `supabase/schema.sql` → **Run**.
   This creates the `projects` + `project_images` tables, Row Level Security, and the public
   `portfolio` storage bucket (admin-only uploads, 15 MB max, PNG/JPG/WEBP/GIF/SVG).
3. **Authentication → Users → Add user** → your email + a strong password → tick *Auto confirm*.
4. Back in **SQL Editor**, make that user the admin (replace the email):
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'you@example.com'
   on conflict do nothing;
   ```
5. **Authentication → Sign In / Providers** → turn **off** “Allow new users to sign up”.
   (Even if someone signs up, they can’t upload — only `public.admins` can write.)
6. **Project Settings → API Keys** → copy the **Project URL** and the **Publishable key**
   (or legacy *anon* key).

## 02 // RUN LOCALLY

```bash
cp .env.example .env.local     # paste URL + key
npm install
npm run dev                    # http://localhost:3000
```

Edit your name, role, email and socials in **`src/lib/site.ts`**.

## 03 // GITHUB → VERCEL

```bash
git init && git add . && git commit -m "RX design archive v1"
git branch -M main
git remote add origin https://github.com/<you>/rx-design-archive.git
git push -u origin main
```

1. **vercel.com → Add New → Project** → import the repo (framework auto-detected: Next.js).
2. **Environment Variables** → add both:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
3. **Deploy.** Every `git push` redeploys automatically.

`.env.local` is git-ignored — your keys never go to GitHub.

## 04 // UPLOADING A DESIGN

1. Go to `https://your-site.vercel.app/login` → sign in.
2. **[+ NEW PROJECT]** → choose a category → the code auto-fills (`INF-014` → shown as `RX/INF-014`).
3. Fill title, client, year, tags, and the case-study fields (all optional except title).
4. Drop a **cover** image and any number of **gallery** images; add captions, reorder with ↑ ↓.
5. Tick **PUBLISHED** (and **FEATURED** to show it on the home page) → **SAVE + PUBLISH**.

The public site updates immediately (on-demand revalidation), and every 60 s otherwise.

### Export tips

| Work type | Export |
|---|---|
| PPT | Each key slide as PNG/WEBP, 2400 px wide. Cover = best slide or a mockup. Don’t upload the `.pptx`. |
| Logo | SVG or 2400 px PNG on off-white; add lockups, color variants, mockups to gallery. |
| Infographic | Full piece as cover; detail crops (1:1 or 4:3) in gallery so text is readable. |
| UI / Web | Screens at 2× resolution; one hero mockup as cover. |

Use **WEBP** where possible — sharper and much smaller than PNG.

---

## STRUCTURE

```
supabase/schema.sql          tables, RLS, storage bucket, policies
src/middleware.ts            refreshes session, guards /admin
src/lib/site.ts              ← YOUR DETAILS
src/lib/categories.ts        categories, code prefixes, Baybayin tags
src/lib/data.ts              public queries (falls back to demo data)
src/lib/supabase/*           browser / server / public clients
src/app/                     pages + /api/revalidate + /auth/signout
src/components/              Header, Footer, ProjectCard, WorkFilter, SecHead, BbCols, PixelArt, ModeSwitches, HudGauge
src/components/admin/ProjectForm.tsx   upload / edit form
src/app/globals.css          SIKLAB/68 tokens + all styles (rem, 90% scale)
```

## DESIGN — SIKLAB/68 (REDESIGN)

- **Tokens + components:** `src/app/globals.css` (Siklab core + a Next layer). Paper `#F2F0EB`, ink `#0B0B0B`,
  one red `#E3171E`; dark mode uses softened near-black `#121211` (ink on paper 15.46:1).
- **Type:** Inter Tight (mega headlines/body), Archivo wdth 62–125 (wide + condensed numerals), Space Mono (labels) via `next/font`.
- **Structure:** sticky top nav with indexed links → cover plate (mega title, red block, pixel mosaic, stripes,
  vertical Baybayin, HUD readouts) → ticker → numbered sections (`<SecHead>`: red numeral, soft/strong title,
  vertical side label, Baybayin ghost) → red contact block → 3-column footer with barcode.
- **New components:** `SecHead`, `BbCols` (vertical Baybayin), `PixelArt`, `ModeSwitches` (replaces `ThemeToggle`).
  `HudGauge` is now the Siklab half-dial.
- **Admin + upload form:** class names and logic unchanged — restyled through the CSS layer only.

## MODES + 90% SCALE

- `[ARAW|GABI]` theme · `[A·PULA|B·MONO]` accent · `[90%|100%]` scale — all in the top nav.
- Applied before first paint by `src/lib/theme-script.ts` (`rx-theme`, `rx-accent`, `rx-scale` in localStorage) and
  painted by CSS from `<html data-*>`, so the switches are correct before hydration.
- Every size is `rem`; `html{font-size:calc(100% * var(--s))}` with `--s:.9` (default) or `1` (100% / large text).

## BAYBAYIN

- **SKB Baybayin** (`public/fonts/rx09-baybayin-*.woff2`, SIL OFL 1.1), scoped with unicode-range to U+1700.
- Write Latin, get Baybayin: `<Bb text="babala" bold />`, `<BbSvg text="Kierwin" height={44} />`, `<BbCols lines={["likha","sining"]} />`.

## SECURITY MODEL

- Public visitors: read **published** projects only (RLS).
- Uploads, edits, deletes: allowed only for users listed in `public.admins` — enforced in the
  database and storage policies, not just the UI.
- `/admin` and `/login` are excluded in `robots.txt` and set `noindex`.

2026 KIERWIN. A KIERWIN ORIGINAL SYSTEM. BUILT TO DESIGN, BORN TO SHIP.
