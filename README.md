# Ensotek DE

Ensotek soğutma kulesi çözümleri için **B2B platform** — Almanca pazar sitesi. Katalog yönetimi, müşteri doküman akışları ve çok dilli içerik (TR/EN/DE) içerir.

🌐 Canlı: <https://www.ensotek.de>

## Yapı

| Klasör | Açıklama | Stack | Port |
|--------|----------|-------|------|
| `frontend/` | Genel kullanıcı sitesi | Next.js 16, React 19, next-intl, React Query | 3011 |
| `backend/` | REST API | Fastify 5, Drizzle ORM, MySQL, Zod | 8086 |
| `admin_panel/` | Yönetim paneli | Next.js 16, Redux Toolkit, Tailwind v4 | 3022 |

Veritabanı: MySQL — `ensotek`.

## Kurulum & Çalıştırma

```bash
# frontend
cd frontend && bun install && bun run dev

# backend
cd backend && bun install && bun run dev      # bun run db:seed ile şema/seed

# admin_panel
cd admin_panel && bun install && bun run dev
```

## Ortam Değişkenleri

`.env` dosyaları repoya **dahil değildir** (`.gitignore`). Her uygulamada ilgili `.env` / `.env.production` üretim ortamında ayrıca sağlanır.

## Deploy

- **VPS:** `ssh vps-Ensotek` (Hostinger, Ubuntu)
- **PM2:** `ensotek-backend` (8086), `ensotek-frontend` (3011), `ensotek-admin-panel` (3022)
- **Domain:** ensotek.de — nginx reverse proxy

> Şema değişikliği: `ALTER TABLE` kullanılmaz. İlgili `src/db/seed/sql/0XX_*_schema.sql` dosyası güncellenir, ardından `db:seed:*:fresh` ile DB sıfırdan kurulur.

## Ortak Paketler

Frontend, `Ensotek/packages/` altındaki ortak paketleri (`shared-ui`, `shared-config`, `shared-types`) root `bun` workspace üzerinden kullanır.

## Not

- `admin_panel/package.json` `name` alanı hâlâ `konig-admin` — şablondan türetilmiş, güncellenmeli.
