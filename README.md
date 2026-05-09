# Chroma Frame

A live color palette visualizer for designers and developers. Pick a set of brand colors and instantly see them applied to realistic UI templates — no guesswork, no waiting.

**[→ Open Chroma Frame](https://kimthuynh.github.io/chromaframe-visualizer)**

---

## What it does

- **Live theming** — every color change reflects instantly across the full template preview
- **Two templates** — Landing Page (SaaS) and E-commerce, with Dashboard and App Theme coming in v2
- **Smart color picker** — @uiw/react-color Colorful picker with 5 chroma.js-generated swatches per variable (complementary, analogous, desaturated steps, curated near-blacks for logos)
- **Mode & style toggles** — Light/Dark mode auto-adjusts neutral colors; Filled/Border style toggle handled entirely in CSS
- **Saved palettes** — 3 session slots per template; save and restore any palette without losing your work
- **CSS export** — one-click modal shows the full `:root {}` block with derived hover/light tokens, ready to paste
- **Shareable links** — full palette state (colors, mode, style, template) encoded in the URL hash; Copy Link shares the exact view

## Stack

- **React 18 + Vite 5** — static build, no server
- **chroma-js** — all color math (contrast, darken, lighten, hue rotation, complementary)
- **@uiw/react-color** — Colorful picker component
- **CSS custom properties** — all live theming; zero runtime style injection beyond setting `--cf-*` vars on `:root`
- **gh-pages** — deploys the `dist/` folder to GitHub Pages

## Local development

```bash
npm install
npm run dev       # http://localhost:5173/chromaframe/
npm run build     # production build → dist/
npm run deploy    # build + push to gh-pages branch
```

## Adding a new template

1. Create `src/templates/<name>/config.js` — export `{ id, label, tabs, colorSchema, defaults, defaultMode, neutralDefaults }`
2. Create `src/templates/<name>/Preview.jsx` + `preview.css` — use `var(--cf-*)` for all colors
3. Register in `src/templates/index.js` (add to `TEMPLATES` array)
4. Add to `PREVIEW_MAP` in `src/App.jsx`
5. Change `stub: true` → remove it from the config if it was a placeholder

The left panel, suggestion engine, URL hash, and CSS exporter all read from whatever the active template declares. No hardcoded variable names anywhere outside of template configs.
