import { defineConfig } from 'vite'
import { resolve } from 'path'

// IDRN is a multi-page app (MPA), NOT a single-page app.
// Two independent HTML entry points are built and shipped together:
//
//   index.html   -> public landing page
//   portal.html  -> command-center portal (the app behind "Explore the Portal")
//
// The landing links to the portal with a plain relative href ("portal.html"),
// so clicking "Explore the Portal" simply navigates to the portal page.
// Both pages are self-contained (all CSS/JS inline); Vite bundles them as-is.
//
// base: './' keeps all URLs relative so the build works whether it is served
// from a domain root (https://idrn.id/) or a subfolder (https://host/idrn/).
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        portal: resolve(__dirname, 'portal.html'),
      },
    },
  },
  server: {
    open: '/index.html',
  },
})
