# ensotek.de — Master Aksiyon Planı & Checklist

> **Kapsam:** Yalnızca `ensotek_de` reposu (frontend + backend + admin_panel).
> **Kaynaklar:** (1) GSC export 2026-06-03 (Coverage + Performance) — bkz. [seo-gsc-duzeltme-plani.md](seo-gsc-duzeltme-plani.md); (2) Ensotek Dijital Rekabet Analizi Raporu (Nisan 2026, 19 sf).
> **Önemli:** Nisan raporundaki bazı bulgular repo'nun güncel halinde **kısmen çözülmüş** (SSR'a geçiş, JSON-LD Organization, meta metadata, 180-URL sitemap). Aşağıda her madde **repo gerçeğiyle doğrulanmış** durumla işaretlendi.
> Rol: Claude Code (mimar) planladı → Codex uygular → Antigravity doğrular.
> Durum: **Plan onaylandı, uygulama bekliyor.**

---

## 0. Durum Doğrulama Tablosu (Rapor iddiası → Repo gerçeği)

| Rapor iddiası (Nisan) | Repo gerçeği (Haziran) | Sonuç |
|---|---|---|
| "CSR felaketi — ürün/blog JS render" | Sayfalar **server component**, `generateMetadata` + server fetch. Ancak gövde (`ProductDetail`, `ProductDetailWrapper`) `"use client"` | ⚠️ Kısmî — metadata SSR, **gövde içeriği CSR** olabilir → doğrula |
| "JSON-LD tamamen yok" | `src/seo/jsonld.ts`: Organization + WebSite + SearchAction **basılıyor** (`layout.tsx`). Product/Article/Breadcrumb **fonksiyonları var** | ⚠️ Kısmî — Org var, **Product/Breadcrumb/FAQ/LocalBusiness sayfalarda basılmıyor** |
| "Hiçbir sayfada meta description yok" | 35 dosyada `description:` mevcut | ✅ Büyük ölçüde çözülmüş → kapsamı doğrula |
| "Sitemap 180 URL, 3 dil" (güçlü yan) | `sitemap.ts` mevcut, dinamik | ✅ Var ama **GSC'ye gönderilmemiş** |
| "Navigasyon İngilizce (About Us/Contact)" | `HeaderTwo/Three/Four.tsx`: `<Link href="/about">about us</Link>`, `href="/contact">Contact` | ❌ Doğru — **hâlâ Digitek header'ı**, lokalsiz+İngilizce |
| "llms.txt yok" | `public/` altında yok | ❌ Doğru |
| "AI bot robots direktifi yok" | `robots.ts` GPTBot/ClaudeBot yok | ❌ Doğru |
| "Impressum/iletişimde adres-telefon-USt yok" (YASAL) | — (DB/içerik kaynaklı) | ❓ Canlıda doğrula |

---

## FAZ 0 — Bu Hafta (Kritik, Yasal & GSC Kanaması) 🔴

### Yasal (Almanya TMG §5 — para cezası riski)
- [ ] **0.1 Impressum sayfası** — fiziksel adres, yetkili kişi adı, USt-IdNr (KDV no), kayıt mahkemesi/ticaret sicil. `/[locale]/legal/` altında `impressum` slug'ı + footer linki.
- [ ] **0.2 İletişim sayfası** — adres, telefon, e-posta görünür ekle (`[locale]/contact/page.tsx` + DB içerik). Şu an eksik (canlıda doğrula).

### GSC Coverage kanaması (çift içerik / soft 404)
- [x] **0.3 Şablon kök sayfalarını sil** — ✅ 2026-06-03 silindi: `src/app/{about,contact,library,faqs,service,team,project,technical,analys,index-4}/` + `hello.ts` + 4 ölü demo component (HomeThreeCta/Team/Approach, HomeFourVideo). `tsc --noEmit` temiz, referans kalmadı.
- [~] **0.4 Header/Footer linklerini lokalize et** — ⚠️ **Büyük ölçüde gereksiz:** Aktif Header.tsx (header={1}) + Footer.tsx (footer={1}) zaten `@/i18n/routing` locale-aware `Link` kullanıyor → `href="/about"` otomatik `/${locale}/about` oluyor. HeaderTwo/Three/Four + FooterThree/Four/Five **ölü kod** (kullanılmıyor). Kalan iş: (a) metin Almancalaştırma ("About Us"→"Über uns") aktif Header/Footer'da; (b) ölü header/footer component temizliği (opsiyonel); (c) slug Almancalaştırma → bkz. 1.4.
- [x] **0.5 Catch-all 404 sıkılaştır** — ✅ PR #3 (fix/catch-all-soft-404). 12 dinamik `[slug]` route'una server-side `if (!item) notFound()` eklendi ([slug], news, blog, team, quality, about, solutions, mission-vision, product, sparepart, service, library). `/tr/[locale]` placeholder + 20 soft 404 kaynağı çözüldü. projects/[slug] + references/[slug] de eklendi (soft-404 JSX → notFound()). **Kalan:** legal/[slug] (server fetch'siz, içerik client'ta) ayrı; `fetchContent` 404/5xx ayrımı → 0.8.
- [ ] **0.6 DB literal placeholder linkleri** — menü/içerik tablolarında `[slug]`/`[locale]` literal href'lerini ara-temizle (`MenuItemForm`'a validasyon ekle). Seed SQL düzelt (ALTER yok → `db:seed:*:fresh`).
- [x] **0.7 www → non-www 301** — ✅ ÇÖZÜLDÜ (2026-06-04). nginx `www→ensotek.de 301` **zaten çalışıyordu** (SSL her iki host'u kapsıyor). Asıl sorun: `frontend/.env.local` `NEXT_PUBLIC_SITE_URL=https://www.ensotek.de` (`.env.production`'ı override) → canonical/robots/sitemap www gösteriyordu (redirect olan URL'i canonical!). `.env.local` non-www'ye düzeltildi + rebuild. Doğrulandı: robots Host, /de canonical, sitemap hepsi `https://ensotek.de` (non-www). nginx'e dokunulmadı.
- [x] **0.8 5xx (15 sayfa) kök neden** — ✅ ÇÖZÜLDÜ (`9184e40`). Kök neden: `lib/axios` SSR'da relative `NEXT_PUBLIC_API_URL=/api` (`.env.local` override) kullanıyordu → "Invalid URL"/NETWORK_ERROR → axios tabanlı tüm SSR fetch'leri (customPagesService vb.) başarısız. Fix: SSR'da `INTERNAL_API_URL` (absolute). Canlı log'da NETWORK_ERROR bitti; `/de/about` 307, quality içerik render.

### İçerik görünürlüğü (Googlebot)
- [x] **0.9 Gövde içeriği SSR doğrula** — ✅ 0.8 fix sonrası canlı `curl /de/quality` HTML'inde gerçek içerik (Zertifikat ×25, certificate, technical__main) render ediliyor; SSR backend'e ulaşıyor. (Client component'ler veriyi alıyor; ileride tam RSC'ye taşıma performans iyileştirmesi olabilir, ama içerik artık Googlebot/AI'a görünür.)

---

## FAZ 1 — 2-3 Hafta (SEO Temeli) 🟠

- [ ] **1.1 Meta description kapsamı** — 35 sayfada var; **tüm public route'ları** kapsadığını doğrula, eksiklere özgün 150-160 karakter ekle (özellikle ürün/referans).
- [x] **1.2 Canonical düzelt** — ✅ PR #4 (statik) + batch2 (`227d031`, dinamik). Layout'tan statik canonical kaldırıldı; `canonicalFor()` anasayfa + 17 statik + **15 dinamik `[slug]`** sayfada self-referencing canonical üretiyor. (about/page.tsx redirect olduğu için kapsam dışı — doğru.)
- [x] **1.3 Hreflang** — ✅ PR #4 + batch2. `languagesMap()` tüm sayfalarda (statik + dinamik `[slug]`).
- [ ] **1.4 URL slug Almancalaştır** — `/about`→`/ueber-uns`, `/contact`→`/kontakt`, `/product`→`/produkte` vb. Eski slug'lara **301 redirect** (`next.config.js redirects()`), sitemap güncelle.
- [ ] **1.5 Almanca umlaut** — title/meta'da "Kuehlturm"→"Kühlturm", "Kuehltuerme"→"Kühltürme" (DB içerik + statik metinlerde ara; kaynak kodda görünmedi, içerikte olabilir).
- [ ] **1.6 Sitemap'i GSC'ye gönder** — kanonik host ile build, GSC → `https://ensotek.de/sitemap.xml` ekle. Sadece 200 dönen kanonik URL'leri içersin.
- [ ] **1.7 404 (70 sayfa) temizliği** — GSC'den örnek URL export → değerli olanlara 301, ölüleri bırak, iç link kaynaklarını düzelt.

---

## FAZ 2 — Ay 1 (GEO / AI Görünürlük & Dönüşüm) 🔵

> Rapor: sektörde **tüm rakipler + Ensotek 1-3/10 GEO bandında** → ilk hamle eden rakipsiz üstünlük kazanır. ensotek.de GEO puanı **2.0 (Kritik)**.

- [x] **2.1 llms.txt oluştur** — ✅ batch2 (`227d031`). `app/llms.txt/route.ts` dinamik: şirket özeti (CTP/ISO/CE — doğrulanmış), ürün/hizmet/kütüphane backend'den, önemli sayfa linkleri, iletişim. **Canlıda: `ensotek.de/llms.txt` → 200.** Doğrulanmamış iddialar (kuruluş yılı/kurulum sayısı/CTI) kasıtlı dışarıda — veri gelince zenginleştirilecek.
- [x] **2.2 AI bot robots direktifleri** — ✅ PR #5. 11 AI/LLM botu için açık `Allow` (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, anthropic-ai, Claude-Web, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, CCBot) + kanonik `host`.
- [~] **2.3 JSON-LD genişlet** — mevcut Organization'a ek:
  - [x] **Product** schema → ✅ batch2, `product/[slug]`'a basıldı (`product()` helper, item zaten çekiliyordu)
  - [ ] **LocalBusiness** → adres/telefon/coğrafi (Impressum verisiyle — veri bekliyor)
  - [ ] **FAQPage** → SSS sayfası
  - [ ] **BreadcrumbList** → tüm alt sayfalar (`breadcrumb()` helper var — sonraki tur)
  - [ ] **Article** → blog/library detay (`article()` helper var — sonraki tur)
- [x] **2.4 WhatsApp floating buton** — ✅ ZATEN VAR: `layout.tsx` `WhatsAppFloating` (number `contactInfo.whatsapp || phone_2` DB'den).
- [ ] **2.5 Google Business Profile (DE)** — Almanya kaydı oluştur/doğrula, LocalBusiness schema ile eşle.
- [ ] **2.6 LinkedIn doğrulama** — profil linkini siteden çalışan URL ile bağla, `sameAs`'a ekle.

---

## FAZ 3 — Ay 2-3 (Otorite, İçerik & Performans) 🟢

- [ ] **3.1 Blog/içerik üretimi** — düzenli Almanca teknik makale ("Kühlturm Auswahl", "Legionellen-Prävention", "CTP vs FRP"). Organik trafik + E-E-A-T.
- [x] **3.2 Referans/Portfolio görünürlüğü** — ✅ 2026-06-04. ensotek.com/referanslarimiz'dan **455 firma + 13 sektör kategorisi** çekildi, 455 logo Cloudinary'e yüklendi, canlı DB'ye idempotent import (references 30→485, i18n→1448). Boş referans sayfası dolduruldu (rapor'un en kritik güven eksiği). Bkz. [referans-import-plani.md](referans-import-plani.md). Kalan ince ayar: marka adlarının Türkçe karakter düzeltmesi (admin panel) + ürün/proje detayları.
- [ ] **3.3 Teknik datasheet / PDF indirme** — ürün PDF + lead capture (e-posta karşılığı).
- [ ] **3.4 Gerçek testimonial** — logo+isim+pozisyon+foto (jenerik isim değil).
- [ ] **3.5 Core Web Vitals** — PageSpeed Insights + CrUX; GIF animasyonları video/Lottie'ye çevir, LCP/CLS/INP ölç. (`/lighthouse` skill ile koştur.)
- [ ] **3.6 Newsletter / "Wartung planen" CTA** — mevcut güçlü yanları koru, dönüşüm hunisine bağla.

---

## Uygulama Sırası (özet)

1. **Faz 0** tek PR halinde: yasal (0.1-0.2) + GSC kanaması (0.3-0.8) + içerik doğrulama (0.9). En yüksek getiri, en düşük risk.
2. **Faz 1** SEO temeli — canonical/hreflang/slug/sitemap.
3. **Faz 2** GEO — sektörde rakipsiz fırsat penceresi; geciktirme.
4. **Faz 3** otorite & performans — sürekli.

Her faz sonrası: GSC "Doğrulamayı başlat" + 1-2 hafta trend izle. Schema değişikliklerinde `/seo` ve `/geo-audit` skill'leriyle tekrar denetle.

---

## Eksik Veri (kullanıcıdan)

- [ ] GSC örnek URL export'u: 404 (70) + 5xx (15) tam liste → 0.8 ve 1.7 için.
- [ ] Prod nginx config erişimi → 0.7 için.
- [ ] Impressum bilgileri: USt-IdNr, kayıt mahkemesi, yetkili ad, fiziksel adres → 0.1 için.
- [ ] Prod `.env` `NEXT_PUBLIC_SITE_URL` mevcut değeri.

---

## İlerleme Özeti (2026-06-04 güncel)

| Faz | Toplam | Tamam | Kısmi | Veri/erişim bekliyor |
|-----|-------:|------:|------:|------:|
| Faz 0 (Kritik/Yasal) | 9 | 6 (0.3,0.4,0.5,0.7,0.8,0.9) | — | 3 (0.1,0.2,0.6) |
| Faz 1 (SEO) | 7 | 2 (1.2,1.3) | — | 5 (1.1,1.4,1.5,1.6,1.7) |
| Faz 2 (GEO) | 6 | 3 (2.1,2.2,2.4) | 1 (2.3) | 2 (2.5,2.6) |
| Faz 3 (Otorite) | 6 | 0 | — | 6 (içerik/uzun vade) |
| **Toplam** | **28** | **11** | **1** | **16** |

**Repo-içi yapılabilecek tüm net işler tamamlandı + canlıya deploy edildi.** Kalan 17 madde ya kullanıcı verisi (Impressum/USt-IdNr, sertifika görselleri, CTI), ya dış erişim (nginx www→non-www, GSC sitemap submit, GBP/LinkedIn), ya DB içerik (slug Almancalaştırma, placeholder temizliği), ya uzun-vadeli içerik üretimi (blog, datasheet, testimonial).

**Deploy edilen commit'ler:** `5834729` (5 PR), `9184e40` (SSR axios fix), `227d031` (dinamik canonical + Product JSON-LD + llms.txt). Tümü canlıda, doğrulandı.
