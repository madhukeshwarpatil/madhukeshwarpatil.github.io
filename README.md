# Madhukeshwargouda Patil — 3D Portfolio

Personal portfolio for **Madhukeshwargouda Patil** — Technical Lead · Cloud & Platform Engineering · DevOps · SRE. A single-page, dark-themed 3D experience built around a **DNA-of-code** double helix (glyphs + stack keywords) as a fixed full-page background.

Live target: **https://madhukeshwarpatil.github.io/**

## Stack

- [Vite](https://vitejs.dev/) + [React 19](https://react.dev/) + TypeScript (strict)
- [Three.js](https://threejs.org/) via [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) + [drei](https://github.com/pmndrs/drei) — lazy-loaded DNA helix backdrop
- [Framer Motion](https://www.framer.com/motion/) — scroll reveals, stat counters, micro-interactions

## Structure

```
docs/                     Product plan, design spec, content audit, QA report
public/                   favicon.svg, og.png
resume.html               Standalone print-optimized resume (print → Save as PDF)
src/
  data/profile.ts         All portfolio content, typed (single source of truth)
  components/             Nav, Hero, Background3D (CodeHelixScene + HelixFallback), sections
  hooks/, lib/            Reduced-motion hook, WebGL detection
  styles/global.css       Design system (tokens, layout, components)
.github/workflows/        GitHub Pages deploy workflow
```

## Run locally

```bash
npm install
npm run dev        # dev server at http://localhost:5173
```

## Build & preview

```bash
npm run build      # type-checks (tsc -b) then bundles to dist/
npm run preview    # serve the production build locally
```

## Deploy to GitHub Pages

The site deploys to the **user root** (`madhukeshwarpatil.github.io`), so Vite `base` is `/`.

1. Push this repository to `github.com/madhukeshwarpatil/madhukeshwarpatil.github.io` (branch `main`).
2. In the repo settings → **Pages**, set **Source** to **GitHub Actions**.
3. Every push to `main` runs `.github/workflows/deploy.yml`: install → build → deploy.

## Graceful degradation

- `prefers-reduced-motion: reduce` → 3D canvas is never mounted; a static SVG DNA-of-code backdrop renders instead; scroll animations and counters render in final state.
- No WebGL → same static fallback.
- Small screens / low-core devices → reduced helix density and capped device pixel ratio.
- The three.js bundle is a separate lazy chunk loaded after first paint, so content is never blocked by 3D.

## Content updates

All copy lives in `src/data/profile.ts`. The printable resume is `resume.html` (plain HTML, edit directly).
