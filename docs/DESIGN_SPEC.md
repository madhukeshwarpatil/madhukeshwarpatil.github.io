# Design Specification — 3D Portfolio

Covers roles: Senior UI/UX Designer (Part 1) and Senior Frontend + Graphic Designer (Part 2).

---

## Part 1 — UX Design

### 1.1 Information architecture

Single scroll page, seven acts, plus a standalone print resume page.

```
/            Hero → About → Experience → Skills → Education → Languages → Contact
/resume.html Print-optimized resume (A4), opened by "Resume" buttons; user prints to PDF
```

Sticky top nav (blurred glass) with anchor links: About · Experience · Skills · Education · Contact, plus a persistent **Resume** button. On mobile the nav collapses to name + Resume button; anchors are reachable by scroll (content is linear, so a hamburger menu is unnecessary overhead).

### 1.2 Section-by-section design

**Hero (100svh).** Foreground only: status chip ("Open to work · Berlin, DE"), name in display type, title line, one-sentence hook ("0 → 9M users in 90 days"), two CTAs (primary "Get in touch", secondary "Resume"), scroll hint. The DNA-of-code helix is a fixed full-viewport background behind the entire page (not hero-only). Contact facts are thus visible in the first viewport — the recruiter's 30-second budget is served immediately.

**About.** Two-column on desktop: summary paragraph (left, ~60ch) + "facts card" (right: location, availability, visa note, email, phone, LinkedIn). Single column stacked on mobile, facts card first.

**Experience.** Vertical timeline, spine on the left with glowing nodes. Each role is a card: period, title, company/client, headline **metric row** (the big numbers as animated count-up stat blocks — the visual centerpiece of the page), bullet achievements, tech chips. Most recent first. Roles ordered: The Chosen OTT → PayPay → Indust Logistik.

**Skills.** Four category cards (Cloud & IaC, CI/CD & DevOps, Observability & SRE, Languages & Data) in a 2×2 grid (1-col mobile). Each card: icon, category name, skill chips. Chips get a subtle hover lift; no fake proficiency bars (they read as filler to senior reviewers).

**Education.** Two cards side by side (stacked mobile): degree, institution, place, dates; MSc marked "in progress".

**Languages.** Compact row of four cards: language + proficiency label with a subtle level indicator (dots, not percentages).

**Contact.** Full-width closing act: large "Let's build something reliable." headline, email as the primary action (mailto), phone, LinkedIn, resume button repeated. Footer: name, "Built with React & Three.js", year.

### 1.3 Interaction & motion design

- **Scroll reveals:** sections fade-up 24px with slight stagger on children (Framer Motion `whileInView`, `once: true` so scrolling back up doesn't re-trigger).
- **Stat counters:** count up over ~1.4s with ease-out when scrolled into view; suffixes (M+, K+, days) rendered statically to avoid layout shift.
- **3D DNA helix (full-page background):** continuous autonomous rotation; scroll progress drives vertical travel + extra twist so the helix feels continuous down the page; pointer parallax is lerped and subtle. Scene pauses via `frameloop: never` when the tab is hidden.
- **Micro-interactions:** buttons scale 0.98 on press, chips lift 2px on hover, nav links get an underline slide; timeline nodes pulse subtly.
- **Timing language:** 300–600ms, `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-quint feel). Nothing bounces.

### 1.4 Accessibility

- **Reduced motion:** `prefers-reduced-motion: reduce` disables the 3D canvas (static SVG DNA-of-code art instead), disables scroll/parallax animations (content renders in final state), counters show final values immediately.
- **Keyboard:** all interactive elements are native `<a>`/`<button>`; logical DOM order; skip-to-content link as first focusable element; visible `:focus-visible` ring (2px accent outline, 2px offset) everywhere.
- **Contrast:** body text `#e2e8f0` on `#060a13` ≈ 15:1; muted text `#94a3b8` on `#060a13` ≈ 7.5:1; accent used for decorative/large elements, never for body copy below AA thresholds.
- **Semantics:** one `<h1>` (name), sections labelled via `aria-labelledby` on their headings, `<nav>`, `<main>`, `<footer>` landmarks, canvas `aria-hidden` with textual content never inside it.
- **Touch targets:** ≥44px on all buttons/links on mobile.

### 1.5 Responsive strategy

Mobile-first CSS. Breakpoints: 640px (facts card joins two-col grids), 900px (two-column About, 2×2 Skills, timeline gains left spine offset), 1200px (max content width 1120px, centered). The 3D scene renders on mobile but with capped DPR (≤1.5) and reduced helix density via a `coarse pointer + small viewport` / low-core heuristic; type scales with `clamp()`. On small screens the helix is centered; on desktop it sits slightly right so hero copy keeps the left column clear.

---

## Part 2 — Visual Language (Frontend + Graphic Design)

### 2.1 Concept: "DNA of Code"

The aesthetic is drawn from Madhu's actual work: infrastructure-as-code, platform engineering, and the craft of composing systems from primitives. The site backdrop is a **DNA double helix made of code** — two strands of glyphs (`{ } < / > ; …`) bridged by binary base-pair rungs, with stack keywords (aws, terraform, docker, kafka, sre, …) orbiting as ambient labels. It is fixed, full-viewport, and continuous behind every section: restrained and atmospheric, never competing with content.

### 2.2 Color system

| Token | Value | Use |
|---|---|---|
| `--bg` | `#060a13` | Page background (deep space navy) |
| `--bg-elevated` | `#0b1220` | Cards, nav glass base |
| `--border` | `#1c2839` | Hairline card borders |
| `--text` | `#e2e8f0` | Body text |
| `--text-muted` | `#94a3b8` | Secondary text, labels |
| `--accent` | `#38bdf8` | Primary accent (signal cyan) — links, CTAs, nodes |
| `--accent-2` | `#818cf8` | Secondary accent (indigo) — gradients, secondary glows |
| `--success` | `#34d399` | Status chip ("Open to work") |
| Gradient | `135deg, #38bdf8 → #818cf8` | Display headline fill, primary button |

Dark theme only. Glows are achieved with low-opacity radial gradients and `box-shadow`, kept below 8% opacity so text always wins.

### 2.3 Typography

| Role | Face | Notes |
|---|---|---|
| Display / headings | **Space Grotesk** 500–700 | Technical but warm; used for name, section titles, stat numbers |
| Body / UI | **Inter** 400–600 | Workhorse readability |
| Mono accents | **JetBrains Mono** 400–500 | Section index labels (`01 // about`), chips, terminal-flavored details |

Scale (clamp-based): display `clamp(2.5rem, 7vw, 4.5rem)`; section title `clamp(1.75rem, 4vw, 2.5rem)`; stat number `clamp(2rem, 5vw, 3rem)`; body `1rem/1.7`.

### 2.4 Iconography & graphic details

- Inline SVG icons only (no icon-font dependency): stroke-based, 1.5px stroke, 20–24px — mail, phone, LinkedIn, download, location, arrow-down.
- Mono "section index" labels (`01 // ABOUT`) act as a recurring graphic motif tying to the terminal aesthetic.
- Cards: 1px `--border` hairline, 16px radius, near-black fill, faint top-edge highlight; hover raises border to accent at 40%.
- Background texture: fixed, extremely subtle dot grid + one large radial glow behind the hero; no noise heavy enough to band.

### 2.5 3D art direction

- **Geometry:** double helix of height ~44 world units; two glyph strands wind around Y with twist ≈ 2π / 7.5 per unit height; faint line-segment rungs + small `0`/`1` glyph dots as base pairs; keyword billboards distributed along the length.
- **Materials:** custom shader points sampling a 5×5 glyph atlas (additive cyan→indigo→teal), rung lines ~9% opacity, keywords as transparent additive billboards via drei `Billboard`.
- **Motion:** continuous Y-rotation (~0.12 rad/s) + scroll-normalized vertical travel and extra twist (damped); camera eases toward pointer offset (subtle parallax). Past ~0.7× viewport scroll the scene dims (~38% opacity) under a stronger vignette veil so section copy always wins.
- **Rendering budget:** no shadows, no postprocessing; DPR capped at 2 (1.5 on constrained devices); denser vs sparser step sizes via `isConstrainedDevice()`; `frameloop: never` when the tab is hidden. Three.js + R3F + drei are lazy-loaded after first paint.
- **Fallback art:** static SVG DNA-of-code composition (sinusoidal glyph strands + rungs + keywords) for `prefers-reduced-motion` and no-WebGL — same palette, designed hero, not an empty div.
