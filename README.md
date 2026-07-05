# IDRN — Insurance Digital Risk Network (Prototype)

Prototype portal multi-role: Penyelenggara, Penilai Klaim, Pengawas (OJK), Asosiasi (AAUI), Pemegang Polis.
Fitur: risk scoring IDRN-RS (0-100, faktor berbobot), ledger anchoring (Merkle, 3 validator), audit trail,
command center nasional, threshold simulator, copilot analitik.

## Menjalankan
```bash
npm install
npm run dev      # development server (http://localhost:5173)
npm run build    # production build ke dist/
npm run preview  # preview hasil build
```

## Struktur
```
index.html       # markup seluruh halaman (login + app shell + semua page)
src/main.js      # seluruh logika aplikasi (data demo, scoring, render, chart)
src/style.css    # design system institutional (light corporate, navy/gold)
vite.config.js   # base './' agar hasil build bisa dibuka dari sub-path
```

Catatan: seluruh data bersifat fiktif (demo). State di memori, tanpa backend —
titik integrasi backend ada pada array data (CLAIMS, AUDIT, REGISTRY, POLICIES, MYCLAIMS)
dan fungsi render terkait di src/main.js.
