# Deploy Jatahku

## 1. Database — Neon Postgres

1. neon.com → New Project → region **Singapore (ap-southeast-1)**
2. Dashboard → Connect → copy **dua** string:
   - **Pooled** (host ada `-pooler`) → `DATABASE_URL`
   - **Direct** → `DIRECT_URL` (dipakai `prisma migrate`)
3. Lokal: tempel keduanya ke `.env`, lalu:

```bash
npm run db:deploy   # bikin 9 tabel dari prisma/migrations/20261023170000_init
npm run db:seed     # opsional: user dev + 3 rutin contoh
npm run dev         # login: http://localhost:3000/masuk/mock
```

Lokal dan produksi boleh pakai project Neon sama saat MVP; kalau perlu pisah, pakai branch Neon.

## 2. Google OAuth

- console.cloud.google.com → APIs & Services → Credentials → OAuth client ID (Web application)
- **Authorized redirect URIs** — tambah dua:
  - `http://localhost:3000/api/auth/google/callback`
  - `https://DOMAIN-KAMU/api/auth/google/callback`
- Isi `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET`

Redirect URI dihitung dari `AUTH_URL` (`src/app/api/auth/google/route.ts:32`), jadi `AUTH_URL` produksi harus domain https yang benar.

## 3. Vercel

- Import repo (repo ini **belum** ada git — `git init` dulu)
- Framework: Next.js. Build command sudah `prisma generate && next build`
- Env vars (Production + Preview):

```
DATABASE_URL   = <Neon pooled>
DIRECT_URL     = <Neon direct>
AUTH_SECRET    = <openssl rand -base64 32>
AUTH_URL       = https://DOMAIN-KAMU
GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
```

- Migrasi ke DB produksi: jalankan sekali `npm run db:deploy` dari lokal (pakai `DIRECT_URL`).

## Diblok di produksi

- `/masuk/mock` → redirect ke `/masuk?error=lindungi` (hanya dev)
- Cookie sesi memakai flag `secure` saat `NODE_ENV=production` → wajib HTTPS

## Rollback ke SQLite

1. `prisma/schema.prisma`: `provider = "sqlite"`, hapus baris `directUrl`
2. `rm -rf prisma/migrations && mv prisma/migrations-sqlite.bak prisma/migrations`
3. `.env`: `DATABASE_URL="file:./dev.db"` (file asli masih ada; cadangan `prisma/dev.db.sqlite.bak`)
4. `npx prisma generate`
