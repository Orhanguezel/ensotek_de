# ensotek.de — GSC Hata Düzeltme Planı

> Kaynak: Google Search Console export (2026-06-03, son 3 ay) — Coverage + Performance.
> Hazırlayan: Claude Code (mimar). Uygulama: Codex. Doğrulama: Antigravity.
> Durum: **Plan onaylandı, uygulama bekliyor.**

---

## 1. Durum Özeti

| Metrik | Değer | Trend |
|--------|-------|-------|
| Tıklama (3 ay) | 9 | — |
| Gösterim | ~316 | çoğu marka sorgusu ("ensotek") |
| Ort. pozisyon | ~12 | 2. sayfa |
| **Dizinli sayfa** | **56** | ⬇️ 66 → 56 |
| **Dizinlenmemiş** | **358** | ⬆️ 172 → 358 (2 kat) |

Coverage trendi ters yönde. Sıçramalar: 21 Nis (197→308), 26 May (264→358).

### Coverage sorun dağılımı (GSC)
| Sebep | Sayfa | Kök neden (bu plandaki madde) |
|-------|------:|------------------------------|
| Keşfedildi – dizinlenmedi | 114 | Crawl bütçesi / çift içerik → #1, #2 |
| Bulunamadı (404) | 70 | Kırık linkler → #4 |
| Tarandı – dizinlenmedi | 54 | İnce/çift içerik → #1, #2 |
| Doğru canonical'lı alternatif | 27 | Normal (hreflang) — aksiyon yok |
| Yönlendirmeli sayfa | 22 | Beklenen — izle |
| Soft 404 | 20 | Şablon sayfalar + catch-all → #1, #2 |
| Sunucu hatası (5xx) | 15 | SSR hatası → #5 |
| Kopya – Google farklı canonical seçti | 19 | Canonical eksik → #1, #6 |
| Robots.txt engelli | 10 | Beklenen (login/dashboard) → #7 |
| Kopya – canonical yok | 6 | #1, #6 |
| noindex | 1 | Beklenen |

---

## 2. Kök Nedenler (koda kadar izlendi)

### KN-1 — Şablon (Digitek) artığı çift route ağacı
`frontend/src/app/` altında `[locale]` sisteminin **dışında**, kök seviyede eski tema sayfaları:
`about`, `contact`, `library`, `faqs`, `service`, `team`, `project`, `technical`, `analys`, `index-4`
- `force-dynamic`, **lokalsiz**, `title: "... | Digitek"` (yanlış marka).
- `/de/about` ile birebir çift içerik → Soft 404, çift-canonical, crawl bütçesi israfı.

### KN-2 — Catch-all geçersiz slug'da 404 vermiyor
`frontend/src/app/[locale]/[slug]/page.tsx`: `fetchCustomPage` null dönse bile `notFound()` çağrılmıyor, sayfa yine render ediliyor → **soft 404**. `/tr/[locale]` gibi placeholder URL'ler de 200 dönüyor.

### KN-3 — DB kaynaklı literal placeholder linkleri
Kaynak kodda `href="/[slug]"` / `[locale]` **yok** (grep temiz). `/tr/[locale]` ve `/tr/sparepart/[slug]` URL'leri **seed edilen menü/içerik linklerinden** geliyor (interpolasyonu yapılmamış). git status'taki `MenuItemForm` değişiklikleri ilgili.

### KN-4 — 404 (70 sayfa)
Eski/kırık iç ve dış linkler. Tam URL listesi GSC export'unda yok; GSC arayüzünden örnek URL'ler gerekli.

### KN-5 — 5xx (15 sayfa)
SSR hatası. Son commit (`SSR API çağrılarını internal localhost'a yönlendir`) alanı tam kapatmamış olabilir.

### KN-6 — Canonical / hreflang eksikliği
`frontend/src/app/[locale]/layout.tsx` canonical'ı **statik** `${siteUrl}/${locale}` (anasayfa). Alt sayfalar kendi `alternates.canonical`'ını set etmiyorsa hepsi anasayfayı canonical gösteriyor → "Google farklı canonical seçti" (19+6).

### KN-7 — www vs non-www konsolide değil
GSC'de hem `ensotek.de` hem `www.ensotek.de` indexli. `next.config.js redirects()` içinde kanonik host yönlendirmesi yok; nginx'te de konsolide değil.

### KN-8 — Sitemap gönderilmemiş
Coverage meta: "Site haritası: Bilinen tüm sayfalar" → GSC'ye **sitemap.xml gönderilmemiş**. `sitemap.ts` mevcut ama submit edilmemiş.

---

## 3. Önceliklendirilmiş Aksiyon Planı

### Aksiyon #1 — Şablon kök sayfalarını sil  🔥 (Düşük efor)
**Sil:** `frontend/src/app/` altındaki şu klasörler:
`about/ contact/ library/ faqs/ service/ team/ project/ technical/ analys/ index-4/`
- **Önce doğrula:** Bu route'lara iç link var mı? `grep -rn 'href="/about"\|href="/contact"\|...' frontend/src` — varsa lokalli (`/${locale}/...`) hale getir.
- `dashboard/ profile/ login/ register/ logout/` kök kopyaları: `[locale]` altında karşılıkları varsa **sil**; yoksa bırak ama `robots.ts` zaten engelliyor.
- **Beklenen kazanım:** Soft 404, çift-canonical (19+6), "Digitek" sızıntısı, crawl bütçesi.

### Aksiyon #2 — Catch-all'ı sıkılaştır  🔥 (Orta)
`frontend/src/app/[locale]/[slug]/page.tsx`:
- `fetchCustomPage` null dönerse `notFound()` çağır (hem `generateMetadata` hem component'te).
- Bilinen statik segmentlerle (`about`, `service`, vb.) çakışan slug'ları reddet (zaten daha spesifik route kazanır ama emin ol).
- **Kazanım:** Soft 404 (20), placeholder indexleme.

### Aksiyon #3 — Literal `[slug]`/`[locale]` link kaynağını temizle  🟠 (Orta)
- DB'de menü öğeleri ve custom page içeriklerinde `[slug]` / `[locale]` literal href'lerini ara:
  `SELECT * FROM menu_items WHERE url LIKE '%[slug]%' OR url LIKE '%[locale]%';` (ve içerik/blok tabloları).
- Seed SQL dosyalarını düzelt (CLAUDE.md: ALTER yasak → `0XX_*_schema.sql`/seed güncelle, `db:seed:*:fresh`).
- Admin panelde URL alanına placeholder kaçışını engelleyen validasyon ekle (`MenuItemForm`).

### Aksiyon #4 — 404'leri çöz  🟠 (Orta)
- GSC → Sayfalar → "Bulunamadı (404)" → örnek URL'leri dışa aktar.
- Hâlâ değerli olanlara 301 (`next.config.js redirects()`), gerçekten ölü olanları bırak.
- İç link kaynaklarını düzelt.

### Aksiyon #5 — 5xx'leri çöz  🟠 (Orta)
- `bun run build` + prod PM2 loglarında 500 üreten route'ları tespit.
- SSR fetch'lerinde backend erişimi/timeout/try-catch + fallback. `getRuntimeLocaleSettings`, `fetchCustomPage`, sitemap `fetchSlugs` gibi SSR çağrılarının backend down iken 500 yerine graceful davranması.

### Aksiyon #6 — Canonical + hreflang düzelt  🟠 (Orta)
- Her sayfanın `generateMetadata`'sında `alternates.canonical = ${siteUrl}/${locale}${path}` (gerçek path).
- `alternates.languages` ile tüm lokaller + `x-default`.
- `layout.tsx`'teki statik anasayfa canonical'ını alt sayfalara miras bırakma — sayfa bazında ez.

### Aksiyon #7 — www → non-www 301  🔥 (Düşük)
- Kanonik host **ensotek.de** (non-www, GSC'de baskın).
- Nginx'te `server_name www.ensotek.de` → `return 301 https://ensotek.de$request_uri;`.
- `NEXT_PUBLIC_SITE_URL=https://ensotek.de` (prod `.env`) — sitemap/canonical tutarlılığı.

### Aksiyon #8 — Sitemap'i gönder  🔥 (Düşük)
- `NEXT_PUBLIC_SITE_URL` doğru host ile build.
- GSC → Site Haritaları → `https://ensotek.de/sitemap.xml` ekle.
- `sitemap.ts` çıktısının yalnızca kanonik host ve gerçek (200) URL'leri içerdiğini doğrula.

---

## 4. Uygulama Sırası (önerilen)

1. **Hızlı kazanımlar (aynı PR):** #1 (sil) + #7 (www 301) + #8 (sitemap gönder).
2. **İçerik bütünlüğü:** #2 (catch-all 404) + #3 (literal link) + #6 (canonical/hreflang).
3. **Kurtarma:** #4 (404) + #5 (5xx) — GSC örnek URL exportu geldikten sonra.

Her adım sonrası GSC'de "Doğrulamayı başlat" tetikle ve 1-2 hafta trend izle.

---

## 5. Eksik Veri (kullanıcıdan istenecek)

- 404 (70) ve 5xx (15) için **GSC örnek URL listesi** (export) — #4 ve #5 nokta atışı için.
- Prod nginx config erişimi — #7 için.
- Prod `.env` (`NEXT_PUBLIC_SITE_URL` mevcut değeri) — #6/#7/#8 için.

---

## 6. Beklenen Sonuç

- Dizinlenmemiş 358 → büyük düşüş (çift/şablon/soft-404 elenince).
- Dizinli 56 → artış (gerçek lokalli içerik sayfaları).
- "Digitek" marka sızıntısı kalkar.
- Crawl bütçesi gerçek içeriğe yönlenir → keşif/indexleme hızlanır.
