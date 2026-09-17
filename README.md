# Insurance Cost Frontend

Frontend React (Vite + Tailwind) untuk aplikasi estimasi biaya asuransi.
Memanggil backend FastAPI di `backend-medical-cost-prediction.up.railway.app`.

## Setup lokal

```bash
npm install
cp .env.example .env      # lalu cek isi VITE_INSURANCE_API_URL sudah benar
npm run dev
```

Buka `http://localhost:5173`.

## Struktur project

```
├── src/
│   ├── App.jsx                      # entry komponen utama
│   ├── InsuranceCostPredictor.jsx   # form + logika panggil API
│   ├── main.jsx                     # React root
│   └── index.css                    # Tailwind directives
├── index.html
├── vite.config.js
├── tailwind.config.js
├── .env.example                     # template env var (URL backend)
└── package.json
```

## Environment variable

| Variable | Keterangan |
|---|---|
| `VITE_INSURANCE_API_URL` | URL backend FastAPI (tanpa trailing slash), contoh: `https://backend-medical-cost-prediction.up.railway.app` |

Kalau env var ini tidak diisi, komponen fallback ke URL default yang sudah di-hardcode di `InsuranceCostPredictor.jsx` -- tapi untuk deploy production, tetap isi env var-nya secara eksplisit supaya gampang diganti tanpa ubah kode.

## Build production

```bash
npm run build
```

Hasilnya di folder `dist/` -- folder statis siap di-deploy ke Vercel/Netlify/static hosting manapun.

## Deploy

Lihat panduan step-by-step di percakapan Claude (GitHub -> Vercel).
