# kierwinramos.github.io

Personal portfolio — Systems Engineer specializing in full-stack development, automation, and AI-augmented software engineering. C#.NET, PHP, Python, JS.

## Redesign — SIKLAB/68 (Swiss constructivist + Baybayin) · 90% scale

Both apps in this repo now run on the **Siklab/68** design system:

| App | Path | Notes |
|---|---|---|
| Systems Engineer portfolio (GitHub Pages) | `index.html` + `assets/` | Static, no build step |
| RX Design Archive (Next.js 15) | `graphics-portfolio/` | Same tokens, see its README |

### Folder map (root site)
```
index.html                 page (cover · stats · 01 about · 02 stack · 03 work · 04 log · 05 record · 06 contact)
profile.jpg                portrait (shown grayscale in the cover plate)
assets/css/siklab-core.css Siklab tokens, base, controls, nav, sections, grid, responsive
assets/css/site.css        portfolio-only layout (cover art, work cards, experience, contact block)
assets/css/fonts.css       @font-face for SKB Baybayin (unicode-range U+1700 only)
assets/fonts/              skb-baybayin-400/700.woff2 + OFL notice
assets/js/site.js          theme · accent · scale switches, active nav/rail, count-up, pixel art, copy email
assets/img/favicon.svg     cut-in square mark
```

### How to open
Open `index.html` through any web server (GitHub Pages, `python -m http.server`, VS Code Live Server).
Opening it as `file://` works too, but browsers block local font files there, so Baybayin falls back to a system font.

### Modes (top-right switches, saved in localStorage)
| Switch | Values | Key |
|---|---|---|
| ARAW / GABI | light / dark (follows the OS until you choose) | `skb_theme` |
| A·PULA / B·MONO | one-red accent / mono print (red collapses into ink) | `skb_accent` |
| 90% / 100% | UI scale — **90% is the default**; 100% is the large-text option | `skb_scale` |

### Scale
Every size is in `rem`. `html { font-size: calc(100% * var(--s)) }` with `--s: .9` by default and `1` when
`[data-scale="100"]`. Fluid headlines use `calc(Nvw * var(--s))`, so the whole layout is exactly 90%.
Body text: 16px at 100% → **14.4px at 90%**. Hairlines (1–2px) stay crisp and are not scaled.

### Theming
Edit the tokens at the top of `assets/css/siklab-core.css`:
`--paper --ink --stone --line --gray --red --on-red`, plus the `[data-theme="dark"]` block.
Rules: one red only (~8% of a layout), square corners, no gradients/shadows/blur, Baybayin is decoration — Latin carries the content.

### Contrast (WCAG)
| Pair | Light | Dark (softened near-black #121211, not #000) |
|---|---|---|
| Ink on paper | 17.28:1 | 15.46:1 |
| Gray (meta text) on paper | 4.82:1 | 6.42:1 |
| Red on paper (numerals, large text) | 4.18:1 | 5.30:1 |
| Text on red block | 4.76:1 | 5.30:1 |
