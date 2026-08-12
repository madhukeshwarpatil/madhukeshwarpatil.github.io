# Product & Project Plan — 3D Portfolio for Madhukeshwargouda Patil

## Part 1 — Product Manager

### 1.1 Problem statement

Madhu is job-hunting for Cloud / Platform / DevOps / SRE roles across Europe. His current portfolio is a static resume page: the content is strong, but the presentation neither differentiates him from other candidates nor demonstrates the engineering craft the content claims. Recruiters spend under 30 seconds on a candidate site; the current site wastes that window.

### 1.2 Target audience

| Persona | What they need in <30s | Device |
|---|---|---|
| **EU tech recruiter** (primary) | Title, location, availability, visa status, headline metrics, resume download, LinkedIn | Desktop + mobile, often mid-range laptop |
| **Hiring manager / engineering lead** (primary) | Evidence of scale (users, req/s), depth (observability, IaC, incident response), leadership (team of 5, promotions) | Desktop |
| **Peer / interviewer pre-call** (secondary) | Career narrative, tech stack specifics | Any |

Implication: the 3D experience must never gate the content. Every critical fact must be readable with JavaScript-lite patience, on a slow laptop, or with animations off.

### 1.3 Product goals

1. **Convert visits to contact** — make email / LinkedIn / resume download reachable within one interaction from anywhere on the page.
2. **Make the metrics unforgettable** — 9M users / 90 days / 8K req/s / 60M users staged as the visual centerpiece.
3. **Signal craft** — a premium, restrained 3D experience themed on his actual domain (cloud infrastructure, node graphs, data flow), proving quality standards by example.
4. **Zero-friction on any device** — fast load, graceful degradation, accessible.

### 1.4 Success criteria

- `npm run build` produces a deployable static bundle with zero errors; TypeScript strict mode passes.
- 3D scene lazy-loads; initial route JS (excluding the deferred three.js chunk) stays lean; static fallback renders for `prefers-reduced-motion`, WebGL-unavailable, and small/low-end devices.
- All content from `CURRENT_PORTFOLIO_DATA.md` present and accurate.
- Keyboard navigable, visible focus states, WCAG AA contrast on all text.
- SEO/OG meta complete; deployable to GitHub Pages user root via included workflow.

### 1.5 Feature scope

**In scope (v1):**
- Single-page scroll experience: Hero (3D) → About → Experience timeline with animated stat counters → Skills → Education → Languages → Contact
- 3D backdrop: DNA-of-code double helix (glyphs + stack keywords), fixed full-viewport, scroll-linked travel; static SVG fallback
- Sticky minimal nav with section anchors + always-visible contact CTA
- Resume: dedicated print-optimized `/resume.html` page (print-to-PDF) + download button
- Dark premium theme, scroll-reveal motion, micro-interactions
- SEO meta, OG tags, favicon, GitHub Pages deploy workflow, README

**Out of scope (v1):** blog, CMS, contact form backend, analytics, i18n, light theme, project case-study subpages.

---

## Part 2 — Project Manager

### 2.1 Milestones

| # | Milestone | Deliverable | Exit criteria |
|---|---|---|---|
| M0 | Content audit | `docs/CURRENT_PORTFOLIO_DATA.md` | All live-site data captured + site review |
| M1 | Product plan | `docs/PRODUCT_PLAN.md` (this doc) | Audience, goals, scope signed off |
| M2 | Design spec | `docs/DESIGN_SPEC.md` | IA, section designs, motion, a11y, visual language defined |
| M3 | Scaffold | Vite + React + TS + R3F project boots | `npm run dev` serves; strict TS configured |
| M4 | Content sections | All sections with real data | Every fact from M0 present; responsive |
| M5 | 3D hero + motion | Lazy-loaded scene + fallback + scroll animations | Reduced-motion & no-WebGL paths verified |
| M6 | Resume + deploy | Print resume page, SEO, favicon, Pages workflow, README | Build passes; deploy workflow valid |
| M7 | QA | `docs/QA_REPORT.md` | Build/dev/type checks green; manual checklist executed; issues fixed |

### 2.2 Execution order & dependencies

M0 → M1 → M2 happen doc-first (done before code). M3 blocks M4–M6. M4 and M5 can interleave (content data lives in a single typed data module so sections and 3D develop independently). M7 is last and loops back into fixes until green.

### 2.3 Risks & mitigations

| Risk | Mitigation |
|---|---|
| 3D hurts load/perf on recruiter laptops | Lazy-load three.js chunk after first paint; cap device pixel ratio; reduce helix density on constrained devices; pause rendering when tab hidden |
| 3D unavailable (old GPU, disabled WebGL) | Feature-detect WebGL before mounting canvas; ship a designed static hero fallback, not an error |
| Motion sickness / vestibular issues | Respect `prefers-reduced-motion` globally: no parallax, counters render final values, 3D replaced by static art |
| GitHub Pages routing | Single page + separate physical `resume.html` — no SPA router needed, nothing to 404 |
| Content drift | All copy in one typed `src/data/` module; docs reference it as canonical |

### 2.4 Definition of done

Build green, TS strict green, QA report written with all checks passing, README documents run/deploy, nothing committed until stable.
