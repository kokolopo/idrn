# IDRN Web — Landing + Portal (one deployable unit)

This is a **Vite multi-page app (MPA)**. It ships two static HTML pages that work together as one site:

| File | Purpose | URL after deploy |
|------|---------|------------------|
| `index.html` | Public landing page | `/` |
| `portal.html` | Command-center portal (the app) | `/portal.html` |

The landing page's **"Explore the Portal"** buttons link to `portal.html` with a relative href, so a click on the landing takes the user straight into the portal. Nothing else is wired between them — they are two independent pages deployed side by side.

Both pages are **self-contained**: all CSS and JavaScript are inline. There is no build-time bundling of app code. Vite is used only to (a) give a dev server and (b) emit an optimized `dist/` folder for deploy. External resources (Google Fonts, Chart.js, Leaflet, and the hero background image) are loaded from their CDNs at runtime, so the deployed site needs internet access on the client.

## Prerequisites
- Node.js 18+ (Node 20 LTS recommended)
- npm (or pnpm/yarn)

## Install
```bash
npm install
```

## Develop (hot reload)
```bash
npm run dev
```
Opens `http://localhost:5173/index.html`. Click **Explore the Portal** to navigate to `/portal.html`.

## Build (production)
```bash
npm run build
```
Outputs static files to `dist/`:
```
dist/
├── index.html      # landing
└── portal.html     # portal
```

## Preview the production build locally
```bash
npm run preview
```

## Deploy
`dist/` is plain static output — deploy it to any static host.

**Vercel**
- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`

**Netlify**
- Build command: `npm run build`
- Publish directory: `dist`

**Cloudflare Pages / GitHub Pages / S3 / Nginx**
- Serve the contents of `dist/` as static files.
- Nginx example:
  ```nginx
  server {
    root /var/www/idrn/dist;
    index index.html;
    location / { try_files $uri $uri/ =404; }
  }
  ```

> Note: because this is an MPA (not an SPA), do **not** add a catch-all rewrite to `index.html`. Each page must resolve to its own file so `/portal.html` serves the portal.

## Project structure
```
idrn-web/
├── index.html          # landing page (was idrn-infrastructure.html)
├── portal.html         # portal (was idrn-command-center-ojk.html)
├── vite.config.js      # MPA config: two entry points
├── package.json
└── README.md
```

## Notes for the team
- To make the portal open in a **new tab** instead of the same tab, add `target="_blank" rel="noopener"` to the four `Explore the Portal` / `Explore Portal` anchors in `index.html`.
- To self-host the hero image instead of loading from Unsplash, download it into an `assets/` folder and change the `<img class="hero-photo" src="...">` in `index.html` to point at the local file.
- If you later refactor the portal into a real Vite app (components, state, routing), keep `portal.html` as its entry point and add your `src/` + imports; the MPA config already treats it as a separate bundle.
