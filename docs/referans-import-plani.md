# ensotek.com → ensotek.de Referans Import Planı

> **Amaç:** ensotek.com/referanslarimiz'daki referansları ensotek.de'ye (backend DB) aktarmak. ensotek.de referans sayfası boştu (rapor: kritik güven eksiği). Kaynak: 542 logo → **455 benzersiz firma**, **13 sektör kategorisi**.
> Onay: kullanıcı (2026-06-04) — backend'e import + logolar Cloudinary'e.

## Hazır Varlıklar
- `docs/ensotek-com-referanslar.csv` — 542 logo (kategorili)
- `docs/ensotek-com-referanslar-firma.csv` — 455 firma (dedup)
- `docs/ensotek-com-referanslar.json` — import-ready (name, categories, logo)
- `/tmp/ref_logos/` — indirilen 542 logo (yerel arşiv)

## Backend Yapısı (keşfedildi)
- `references` (id, is_published, is_featured, display_order, **featured_image** [Cloudinary URL], featured_image_asset_id, website_url, **category_id**, **sub_category_id**, timestamps)
- `references_i18n` (reference_id, locale tr/en/de, title, **slug** [locale+slug unique], summary, content, alt, meta_title, meta_description)
- `reference_images` (+i18n) — ek galeri görselleri (opsiyonel)
- Kategori: `category_id` → `categories` (YURT İÇİ/DIŞI REFERANSLAR), `sub_category_id` → `sub_categories` (sektör)
- Cloudinary: `src/modules/storage/cloudinary.ts` + backend `.env` (cloud_name dbozv7…, api_key, secret) ✓

## Kategori Eşleme (13 → sub_categories)
| ensotek.com kategori | Mevcut sub_category | Durum |
|---|---|---|
| Enerji | Enerji Santralleri (bbbb5201) | ✅ var |
| Kimya | Petrokimya & Kimya (5202) | ✅ var |
| Çimento-Maden | Çimento & Madencilik (5203) | ✅ var |
| Gıda & Yağ | Gıda & İçecek (5204) | ✅ var |
| Metal | Çelik & Metal Sanayi (5205) | ✅ var |
| Otomotiv | Otomotiv & Yan Sanayi (5206) | ✅ var |
| Alüminyum-Tel Çekme | — | ➕ yeni |
| Tekstil | — | ➕ yeni |
| AVM-İş Merkezi-Otel | — | ➕ yeni |
| Mühendislik-Makine | — | ➕ yeni |
| Ambalaj-Kağıt-Yalıtım | — | ➕ yeni |
| Plastik | — | ➕ yeni |
| **Başlıca Referanslar** | kategori değil → `is_featured=1` | flag |

→ **7 yeni sub_category** (tr/en/de) eklenecek. Ana kategori = "Yurt İçi Referanslar" (aaaa5002).

## Aşamalar
1. **[DEVAM] Logo indirme** — 542 logo → `/tmp/ref_logos/` (yerel arşiv).
2. **Cloudinary upload** — Node script (backend cloudinary.ts config) ile 542 logo → Cloudinary; çıktı `logo → secure_url` map JSON. Klasör: `uploads/ensotek/referanslar/`.
3. **7 yeni sub_category seed** — `012_sub_categories.sql` + i18n'e ekle (tr/en/de), deterministik UUID.
4. **Seed generator** — `json` + kategori map + Cloudinary URL → üret:
   - `references` INSERT (455, category=yurt içi, sub_category=sektör, featured_image=Cloudinary, is_featured=başlıca)
   - `references_i18n` INSERT (455×3 = 1365; title=firma, slug=firma-slug, summary/content=sektör şablonu, meta). EN/DE için şablon çeviri.
   - Deterministik UUID (firma adından hash) → idempotent.
5. **Lokal test** — `bun run build && db:seed:*:fresh` → lokal DB, doğrula.
6. **Canlı import** — ⚠️ **fresh DEĞİL** (veri kaybı). Sadece yeni seed dosyalarını canlıda çalıştır (INSERT … ON DUPLICATE KEY UPDATE — idempotent). Mevcut referansları (Enerjisa vb. örnek seed) korur/günceller.

## Riskler & Kararlar
- **Canlı DB:** `db:seed:fresh` ASLA canlıda (CLAUDE.md). Import = idempotent INSERT (yeni seed dosyaları, ON DUPLICATE).
- **Slug çakışması:** locale+slug unique. 455 firma slug'ı normalize + çakışma kontrolü.
- **i18n çeviri:** title=marka (çevrilmez). summary/content sektör-bazlı jenerik şablon (TR örnekteki gibi); EN/DE şablon çevirisi.
- **Mevcut örnek seed:** 021-024 zaten birkaç referans içeriyor (Enerjisa, Aksa…). Yeni 455 onlarla çakışırsa ON DUPLICATE; farklı UUID alanı kullanılacak.
- **Logo kalitesi:** 250x250 küçük logolar; yeterli (referans grid). Cloudinary'de otomatik optimize.

## Durum — ✅ TAMAMLANDI (2026-06-04)
- [x] Çekme + kategorize (542 logo, 455 firma, 13 kategori)
- [x] Logo indirme (542/542)
- [x] Cloudinary upload (455/455 → uploads/ensotek/referanslar/)
- [x] 6 yeni sub_category (Alüminyum, Tekstil, AVM/Otel, Mühendislik, Ambalaj, Plastik)
- [x] Seed generator (025/026/027 tr/en/de) + 2 syntax fix
- [x] Canlı import (idempotent): references 30→485, i18n 87→1448. Frontend /tr/references gösteriyor.
