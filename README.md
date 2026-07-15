# IDRN Web — Landing + Portal (one deployable unit)

A **Vite multi-page app (MPA)**. Two static HTML pages deployed together:

| File | Purpose | URL after deploy |
|------|---------|------------------|
| `index.html` | Public landing page (animated network hero) | `/` |
| `portal.html` | Command-center portal (the app) | `/portal.html` |

## Link behaviour (as configured)
- **Explore Portal** (nav, hero, QR panel, CTA, footer) → opens **`portal.html` in a new tab** (`target="_blank" rel="noopener"`).
- **Contact to Invest** and **Partnership Enquiry** → open **https://innovation.pidi.id/** in a new tab.

Both pages are **self-contained**: all CSS/JS is inline and the landing hero is a canvas-drawn network (no image assets to ship). External resources loaded from CDN at runtime: Google Fonts, QRCode.js (landing), plus Chart.js / Leaflet (portal). The deployed site therefore needs client internet access.

## Prerequisites
- Node.js 18+ (Node 20 LTS recommended), npm

## Install / Develop / Build
```bash
npm install
npm run dev        # http://localhost:5173/index.html
npm run build      # outputs static files to dist/
npm run preview    # preview the production build
```

`dist/` after build:
```
dist/
├── index.html      # landing
└── portal.html     # portal
```

## Deploy
`dist/` is plain static output. Deploy to any static host.

- **Vercel** — Framework preset: Vite · Build: `npm run build` · Output: `dist`
- **Netlify** — Build: `npm run build` · Publish: `dist`
- **Cloudflare Pages / GitHub Pages / S3 / Nginx** — serve the contents of `dist/`.

> This is an MPA (not an SPA). Do **not** add a catch-all rewrite to `index.html`; each page must resolve to its own file so `/portal.html` serves the portal.

## Project structure
```
idrn-web/
├── index.html          # landing (latest: animated network hero)
├── portal.html         # portal (latest version)
├── vite.config.js      # MPA config: two entry points
├── package.json
└── README.md
```

## Notes
- To make Explore Portal open in the **same tab** instead, remove `target="_blank" rel="noopener"` from the portal anchors in `index.html`.
- The portal opens as its own tab/workspace; the landing stays open behind it.
