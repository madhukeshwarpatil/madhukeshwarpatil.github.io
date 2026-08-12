# QA Report — 3D Portfolio

Role: Senior QA Test Engineer. Date: Aug 11, 2026. Environment: macOS, Node 22.21.1, npm 10.9.4, Chrome (headless, driven via puppeteer-core installed with `--no-save` for the test run only).

## 1. Automated checks

| Check | Command | Result |
|---|---|---|
| Production build | `npm run build` | **PASS** — zero errors. Output: `index.html` 3.1 kB, `resume.html` 9.7 kB, CSS 11.1 kB (3.1 gz), main JS 333 kB (106 gz), HeroScene chunk 160 kB (51 gz), three chunk 724 kB (184 gz, lazy) |
| TypeScript strict | `npm run typecheck` (`tsc -b`, `strict` + `noUncheckedIndexedAccess` + `noUnusedLocals/Parameters` + `verbatimModuleSyntax`) | **PASS** — zero errors |
| Dev server | `npm run dev` → `curl http://localhost:5173/` | **PASS** — HTTP 200 |
| Preview server | `npm run preview` → `/` and `/resume.html` | **PASS** — HTTP 200 both routes |
| Console errors (desktop 1440×1100) | puppeteer page/console error listeners over full scroll-through | **PASS** — zero errors |
| Console errors (mobile 390×844) | same | **PASS** — zero errors |
| Console errors (reduced motion) | same with `prefers-reduced-motion: reduce` emulated | **PASS** — zero errors |
| WebGL path | assert `.hero-canvas` mounts on desktop + mobile | **PASS** — canvas mounted, fallback absent |
| Reduced-motion path | assert canvas absent, `.hero-fallback` present | **PASS** — static SVG hero rendered, counters show final values immediately |
| Horizontal overflow | `scrollWidth > clientWidth` at 1440 / 390 / 320 px | **PASS** — no overflow at any width |
| Keyboard navigation | programmatic Tab sequence | **PASS** — order: Skip to content → brand → About → Experience → Skills → Education → Contact → Resume (nav) → Get in touch → Resume (hero) → email → phone… (logical, skip link first) |

Note: the vite warning about the 724 kB three chunk is expected and accepted — that chunk is code-split and lazy-loaded only after first paint on WebGL-capable, motion-allowing devices; it never blocks initial content.

## 2. Visual verification (screenshots reviewed)

Captured at desktop 1440×1100, mobile 390×844, narrow 320×700, and reduced-motion desktop; per-section captures for hero, about, experience, skills, education, languages, contact; plus `resume.html`.

- Hero: 3D node network with soft glowing dots and data packets; name, title, status chip, CTAs all legible over the scene. Mobile places the network centered behind content.
- Experience: timeline spine + glowing nodes render; stat counters animate (captured mid-count) and land on correct values (9M+/20M+/8K+/90 days; 60M+/2.5M/20K/3).
- Skills/Education/Languages/Contact: correct data, correct layout at both widths.
- Resume page: A4-styled, complete data, print toolbar hidden in `@media print`, `window.print()` button works.

## 3. Defects found and fixed during QA

1. **Build failure — missing type declarations.** CSS side-effect import rejected under `noUncheckedSideEffectImports`; `__dirname`/`node:path` unavailable in ESM vite config. Fixed with `src/vite-env.d.ts` (`vite/client` types), `@types/node`, and `fileURLToPath(new URL(...))` in `vite.config.ts`.
2. **Layout bug — hero content shifted right, 3D scene squeezed left (all viewports).** Root cause: @react-three/fiber's canvas wrapper sets inline `position: relative`, which overrode the `.hero-canvas` absolute positioning, making the canvas a flex sibling that consumed layout width. Fixed by wrapping `<Canvas>` in an absolutely positioned container div.
3. **Typography bug — name clipped at 390 px, then broke mid-word ("Madhukeshwargou / da").** Caused by `max-width: 14ch` + `overflow-wrap` interaction with the 17-character name. Fixed with an explicit `<br />` between first/last name, removal of the ch cap, and a viewport-scaled `clamp()` font size; verified no overflow down to 320 px.
4. **3D polish — points rendered as hard squares.** `PointsMaterial` has no round sprite by default. Fixed with a generated radial-gradient `CanvasTexture` on all three point layers.
5. **OG image pipeline** — `qlmanage` mis-rendered the SVG (encoding + square padding); switched to headless Chrome screenshot, producing a correct 1200×630 `public/og.png`.

## 4. Manual test checklist

| Test | Status |
|---|---|
| Viewports 320 / 390 / 640 / 900 / 1440 px render without overflow or clipped text | ✅ (320/390/1440 verified via screenshots + overflow probe; 640/900 covered by CSS breakpoint review) |
| `prefers-reduced-motion`: no canvas, static hero art, instant counters, no scroll animation | ✅ verified via emulation |
| No-WebGL fallback: `isWebGLAvailable()` guards canvas mount before the three chunk is requested | ✅ code-path review (same render branch as reduced-motion, which is verified) |
| Keyboard: skip link, logical tab order, visible `:focus-visible` rings, all targets native elements | ✅ tab order verified programmatically; focus ring defined globally |
| Contrast: body `#e2e8f0` on `#060a13` ≈ 15:1, muted `#94a3b8` ≈ 7.5:1 — AA/AAA | ✅ by token audit |
| SEO: title, description, canonical, OG + Twitter cards, JSON-LD Person, favicon, `og.png` 1200×630 | ✅ present in `index.html` |
| Resume download reachable from nav, hero, and contact; print stylesheet correct | ✅ verified via screenshot + markup review |
| Deploy workflow: Node 22, `npm ci`, build, upload `dist`, deploy-pages; Vite `base: '/'` for user-root Pages | ✅ reviewed |
| Nothing committed to git | ✅ repo has no commits |

## 5. Known limitations / future work

- OG image and favicon are generated assets; regenerate `public/og.png` from `assets-src/og.svg` if branding changes.
- `@react-three/drei` is installed (per recommended stack) but the scene currently uses raw fiber primitives; drei is available for future scene work and is tree-shaken out of the bundle.
- Lighthouse was not run in this environment; the budget-relevant items (lazy 3D, code splitting, font `display=swap`, compressed assets) are implemented. Recommend a Lighthouse run after first deploy.
- Repeat QA captures with: `npm i --no-save puppeteer-core && npm run preview & node scripts/qa-capture.mjs` (screenshots land in `qa-shots/`, gitignored).

**Verdict: release-ready.** Build green, types green, zero console errors, accessibility paths verified.

---

## Addendum — DNA-of-code helix (Aug 13, 2026)

Replaced the hero-only Control Plane node-network with a fixed, full-viewport **DNA double helix of code glyphs + stack keywords** behind all sections.

| Check | Result |
|---|---|
| `npm run typecheck` | **PASS** |
| `npm run build` | **PASS** — lazy chunks: `CodeHelixScene` (~162 kB / 52 gz), `three` (~724 kB / 184 gz) |
| WebGL path | `.bg3d` + `<canvas>` mount; `.bg3d-fallback` absent |
| Reduced-motion / no-WebGL | canvas absent; `.bg3d-fallback` SVG DNA present |
| Scroll dimming | `.bg3d-dim` applied after ~0.7× viewport scroll (scene ~38% + stronger veil); content remains readable |
| Tab hidden | `frameloop: never` when `document.hidden` |

Visual spot-checks (`qa-shots/helix-hero.png`, `helix-midscroll.png`, `helix-reduced.png`): helix readable in hero, dimmed behind Experience, static SVG fallback on reduced motion. No commit/push in this pass.
