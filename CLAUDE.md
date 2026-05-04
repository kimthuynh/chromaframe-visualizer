# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**chromaframe-visualizer** — Chroma Frame v1. A React + Vite static site hosted on GitHub Pages that lets designers pick a color palette and instantly see it applied to realistic UI templates. No UI framework. CSS custom properties drive all live theming.

## Stack

- **React 18 + Vite 5** — `npm run dev` to develop, `npm run build` to build
- **chroma-js** — all color math (contrast, darken, brighten, hue rotate)
- **gh-pages** — `npm run deploy` builds and publishes to `gh-pages` branch
- **Base path** — `/chromaframe/` (set in `vite.config.js`)
- **Fonts** — DM Sans (Google Fonts) for template previews; `system-ui` for app shell

## Dev Container

The workspace runs inside a Dev Container (`node` user, `/workspace`). The container has ESLint and Prettier configured with format-on-save. The default shell is `zsh`.

## Architecture

```
src/
├── main.jsx                        — React entry
├── App.jsx                         — Root state, layout, CSS var injection
├── App.css                         — App shell styles (reset, layout)
├── templates/
│   ├── index.js                    — Template registry (TEMPLATES array, getTemplate)
│   ├── landing/config.js           — Landing page color schema & defaults
│   ├── landing/Preview.jsx         — Landing page preview component
│   ├── landing/preview.css         — Landing styles using --cf-* vars
│   ├── ecommerce/config.js         — E-commerce color schema & defaults
│   ├── ecommerce/Preview.jsx       — E-commerce preview component
│   ├── ecommerce/preview.css       — E-commerce styles using --cf-* vars
│   ├── dashboard/config.js         — Stub (stub: true)
│   └── apptheme/config.js          — Stub (stub: true)
├── components/
│   ├── TopNav.jsx / TopNav.css     — Fixed top nav with template tabs
│   ├── LeftPanel/                  — 320px left panel
│   │   ├── index.jsx               — Panel orchestrator
│   │   ├── ModeToggle.jsx          — Light/Dark segmented control
│   │   ├── StyleToggle.jsx         — Filled/Border segmented control
│   │   ├── SuggestionStrip.jsx     — 3 tone suggestion chips
│   │   ├── ColorRow.jsx            — Per-variable color picker row
│   │   ├── ExportStrip.jsx         — Copy CSS + Copy Link buttons
│   │   └── LeftPanel.css           — All panel styles
│   └── PreviewPane/                — Right preview area
│       ├── index.jsx               — Tab bar + chrome wrapper
│       └── PreviewPane.css
└── utils/
    ├── contrast.js                 — WCAG contrast ratio + badge info
    ├── suggestions.js              — Tone suggestion generation via chroma-js
    ├── cssExport.js                — Builds :root {} CSS block for export
    └── hash.js                     — URL hash encode/decode for state sharing
```

## Key Conventions

- **CSS variables** — all template theming uses `--cf-*` prefix. App.jsx sets them on `document.documentElement.style` whenever palette changes. Derived vars (`--cf-primary-hover`, `--cf-primary-light`, `--cf-accent-hover`) are computed via chroma-js in `buildDerivedVars`.
- **Template config** — each template exports `{ id, label, tabs, colorSchema, defaults, neutralDefaults }`. `colorSchema` entries describe each variable with `id`, `label`, `group`, `semantic` (brand/neutral), `weightHint`, `optional`, `skipSuggestions`, `contrastAgainst`.
- **Adding a new template** — create `src/templates/<name>/config.js` and `Preview.jsx`, register in `templates/index.js`, add to `PREVIEW_MAP` in `App.jsx`. Nothing else changes.
- **Mode toggle** — switches `data-mode` attribute on `<html>` AND auto-applies `neutralDefaults[mode]` to the palette so neutral colors flip sensibly.
- **Style toggle** — switches `data-style` attribute on `<html>`. All border-mode overrides are pure CSS under `[data-style='border']` selectors. No JS logic.
- **URL hash** — format `#t=landing&m=light&s=filled&primary=5B4CF6&...`. Hydrated on mount; updated on every state change via `history.replaceState`.
