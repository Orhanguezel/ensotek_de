# Ensotek — İçerik & Konumlandırma Stratejisi (AI + Arama Görünürlüğü)

> **Amaç:** Ensotek'in gerçek konumunu (Türkiye'nin en köklü/tecrübeli soğutma kulesi üreticisi, kalite belgeli) hem **normal ihtiyaç sahibinin Google aramalarında** hem de **AI ajanlarının (ChatGPT/Perplexity/Gemini/AI Overviews) cevaplarında** öne çıkaracak içerik düzenlemesi.
> **Tetikleyen kanıt:** `fabrika_sicak_su_geri_kazanim_raporu.pdf` — gerçek bir B2B alıcının ChatGPT ile yaptığı satın alma araştırması özeti. AI'ın Ensotek'i şu an nasıl konumlandırdığının canlı örneği.
> **Bağlam:** [ensotek-de-master-aksiyon-plani.md](ensotek-de-master-aksiyon-plani.md) Faz 2 (GEO) ile entegre. Bu belge "neyi/nasıl yazacağız" katmanı; master plan "teknik altyapı" katmanı.
> Rol: Claude Code (mimar/stratejist). Durum: **Strateji — uygulama içerik+kod ekibine.**

---

## 1. Teşhis: Algı–Gerçeklik Uçurumu

AI, gerçek alıcıya Ensotek hakkında ne dedi (PDF s.2, s.5-7) → gerçek konum ne olmalı:

| Konu | AI'ın şu anki algısı | Ensotek'in gerçek konumu | Neden uçurum var? |
|---|---|---|---|
| Pazar konumu | "Tercih edilebilir **bir aday**" (kısa listede) | Sektör lideri / en köklü üretici | Köklülük içerikte sayısal+yapılandırılmış kanıtla yok |
| Sertifika | "CTI/Eurovent **var mı sorulmalı**" — bilinmiyor | ISO 9001/14001/45001, CE, EAC (+ varsa CTI/Eurovent) | Sertifikalar görünür, alıntılanabilir, schema'lı değil |
| Teknik güven | "İlk bakılacaklar: **Cenk, Form Freva, Niba**" | Ensotek bu listenin başında olmalı | Rakipler sertifika/teknik içeriği daha net sunuyor |
| Tecrübe | Belirsiz | 39+ yıl, 3000+ kurulum, 40+ ülke, 500+ MW *(doğrula)* | Rakam yok / cümle içine gömülü, taranamıyor |
| Referans | "Yorum sayısı sınırlı, memnuniyet kesin değil" | Çok sayıda kurumsal referans | Referanslar CSR'da gizli, logosuz, doğrulanamaz |
| Performans garantisi | Bilinmiyor ("yazılı garanti ediyor musunuz?") | Mühendislik garantisi veriliyor *(doğrula)* | "Yaz şartlarında hedef sıcaklık garantisi" hiçbir yerde yazılı değil |

**Sonuç:** Bu bir pazarlama-abartı sorunu değil. AI'ın **çıkaramadığı (extract edemediği)** her gerçek = AI'ın vermediği her güven. Ensotek gerçekte lider; içerik bunu makineye okutamıyor.

---

## 2. Alıcının Karar Mantığı = İçerik Öncelik Haritası

PDF'teki **karar ağırlık matrisi** (s.9), içeriğin neye ağırlık vermesi gerektiğinin reçetesidir:

| Kriter | Ağırlık | İçerikte karşılığı (ne yazılmalı) |
|---|---:|---|
| Yaz performans garantisi | %25 | Her ürün/çözüm sayfasında "yaş termometre tasarım şartı + hedef sıcaklığa indirme + **yazılı performans garantisi**" net cümlesi |
| Toplam sistem kapsamı | %20 | "Sadece kule değil: tank + pompa + eşanjör + filtre + kimyasal şartlandırma + blöf + otomasyon — **komple sistem**" |
| Referans teyidi | %15 | Sektör+ülke bazında logolu, proje adlı, MW'lı referans tablosu |
| Servis & yedek parça | %15 | "Devreye alma, periyodik bakım, dolgu/fan/nozul/pompa yedek parça, arıza müdahale süresi" |
| Toplam sahip olma maliyeti | %15 | Su/elektrik tüketimi, blöf optimizasyonu, ömür boyu maliyet içeriği |
| Firma puanı/yorum | %5 | Gerçek müşteri testimonial (logo+isim+pozisyon) |
| Ödeme & teslim | %5 | Teslim süresi, garanti süresi netliği |

➡️ **Kural:** Ana sayfa ve çözüm sayfalarındaki içerik bloklarının görsel+metinsel ağırlığı bu yüzdeleri yansıtmalı. Şu an site büyük olasılıkla görsel/estetik ağırlıklı; **karar-kriteri ağırlıklı** olmalı.

---

## 3. Konumlandırma Hedefi

**Şu an:** AI gözünde → "*yerli, fiyat/performansı iyi, kısa listeye konabilecek bir aday*"
**Hedef:** AI gözünde → "*Türkiye'nin en köklü CTP/su soğutma kulesi üreticisi; CTI/Eurovent + ISO sertifikalı; yaz şartlarında yazılı performans garantisi veren; komple sistem + ömür boyu servis sağlayan referans firma*"

Bunun için içerik üç şeyi aynı anda yapmalı:
1. **İddia + Kanıt** formatı (her iddia ölçülebilir sayı + belge ile)
2. **Makine-okunur** (JSON-LD, llms.txt, düz metin SSR — JS arkasında değil)
3. **Alıcının dilinde** (PDF'teki gerçek soru kalıpları = içerik başlıkları)

---

## 4. İçerik Projeksiyonu — Sayfa/Blok Bazında

> 💡 **ÖNEMLİ KEŞİF (2026-06-03):** `frontend/src/components/sections/` altında **zaten yazılmış ama sayfalara bağlanmamış** gerçek Ensotek component'leri var. Aşağıdaki birçok madde "sıfırdan yaz" değil, **"bağla + veriyle besle"** işi:
>
> | Hazır component | Strateji maddesi | Durum |
> |---|---|---|
> | `CertificateGallery` (lightbox, `CertItem[]`) | §4.2 sertifika sayfası | Görseller de hazır: `backend/uploads/zertifika/` → sadece bağla |
> | `WhatsAppButton` | §4.6 / master 2.4 | Bağlanmamış |
> | `ReferenceGallery`, `ReferencesCarousel` | §4.4 referans | Bağlanmamış |
> | `ContactForm`, `OfferForm` | §4.6 teklif formu | Bağlanmamış |
> | `ReviewForm`, `ReviewsSection`, `ReviewCard`, `TestimonialsSection` | §3.4 testimonial | Bağlanmamış |
> | `NewsletterSection` | §3.6 | Bağlanmamış |
> | `HeroSlider`/`HeroSliderClient`, `ProductsCarousel`, `ContactInfoCard`, `SocialShareCard`, `HelpfulButton` | ana sayfa / muhtelif | Bağlanmamış |
>
> İlk iş: bu component'lerin neden bağlı olmadığını teyit et (eski mi, yarım mı), sonra ilgili sayfalara entegre et. Bu, Faz 2/3'ün önemli kısmını hızlandırır.


### 4.1 Kurumsal Otorite Bloğu (Ana sayfa + "Über uns/Hakkımızda" + her sayfa footer üstü)
İddia+kanıt, sayısal, **schema'lı**:
- "**1985'ten beri** *(doğrula)* — Türkiye'nin en köklü su soğutma kulesi üreticisi"
- "**3000+ kurulum · 40+ ülke · 500+ MW kurulu kapasite**" *(rakamları teyit et)*
- "**ISO 9001 · ISO 14001 · ISO 45001 · CE · EAC**" — logolu + **belge no görünür** + indirilebilir PDF
- (Varsa) "**CTI Sertifikalı / Eurovent**" — bu AI'ın bilmediği en kritik eksik; varsa öne çıkar, yoksa "bağımsız test/performans raporu" ile ikame et
- JSON-LD: `Organization` + `foundingDate` + `numberOfEmployees` + `hasCredential` (sertifikalar) + `award` + `sameAs`

### 4.2 Sertifika & Kalite Sayfası (yeni veya güçlendirilmiş)
**Eldeki gerçek belgeler** (`backend/uploads/zertifika/` — görsellerden teyit edildi):

| Belge | Standart | Belge No | Tür |
|---|---|---|---|
| ISO 9001:2015 | Kalite Yönetim Sistemi | QMS-05508 | Yönetim sistemi |
| ISO 14001:2015 | Çevre Yönetim Sistemi | EMS-08971 | Yönetim sistemi |
| ISO 45001:2018 | İş Sağlığı & Güvenliği | ISO-03604 | Yönetim sistemi |
| ISO 10002:2018 | Müşteri Memnuniyeti | MM-02326 | Yönetim sistemi |
| CE | EC Declaration of Conformity (Makine 2006/42/EC, LVD 2014/35/EU) | — | AT öz-beyanı |
| EAC | Avrasya (RU/Gümrük Birliği) uygunluk | — | İhracat/ithalat uygunluğu |

Yapılacaklar:
- Her sertifika: ad, veren kurum (IQR), belge no, **güncel geçerlilik tarihi**, **indirilebilir PDF**, "bu belge ne anlama gelir?" açıklaması
- FAQPage + `hasCredential` schema
- **EAC'yi ihracat kanıtı olarak** vurgula → "40+ ülke / Avrasya pazarı" iddiasını somutlar

> ⚠️ **İki kritik düzeltme önce yapılmalı:**
> 1. **Tarih güncelliği:** Eldeki görsellerin geçerlilik tarihleri 2020–2023 (dolmuş görünüyor). Sitede yayınlanacak belgeler **yenilenmiş/güncel tarihli** olmalı — eski tarihli tarama güven kaybettirir.
> 2. **CTI/Eurovent açığı:** Bu klasörde **yok**. ISO 9001 = *süreç* belgesi; CTI/Eurovent = *ürün termal performans* belgesi — alıcı/AI ikincisini soruyor. Aşağıdaki §4.2b stratejisi uygulanmalı; **sahip olunmayan sertifika asla ima edilmemeli** (yasal/güven riski).

### 4.2b CTI/Eurovent Açığı — Doğru Strateji
AI'ın en belirleyici sorusu "CTI/Eurovent sertifikalı mı?" idi (PDF s.5).

> ✅ **GÜNCEL DURUM (2026-06):** Ensotek **CTI termal performans testini yaptırıyor — Ağustos 2026'da Almanya'da test yapılacak.** Bu, AI'ın PDF'te sorduğu sertifikanın **birebir kendisi** → açık doğrudan ve tam isabetle kapanıyor. Aşağıdaki **Seçenek A yürürlükte.** Avrupa/CTI belge bilgileri kullanıcı tarafından sonra iletilecek; belge görselleri güncellenecek.

- **A (en güçlü — UYGULANIYOR):** **CTI termal performans testi** (Ağustos 2026 Almanya). Tamamlanınca → belge no + PDF + `hasCredential` schema ile öne çıkar; "CTI sertifikalı" iddiası artık **gerçek ve doğrulanabilir** → rakiplerin (Cenk/Niba) önüne geç. Bu, GEO açısından en yüksek getirili tek hamle.
- **B (geçiş dönemi — şimdi):** Sertifika tamamlanana kadar boşluğu **"yazılı performans garantisi + bağımsız test süreci + referans saha ölçümleri"** ile doldur. İçerikte net ama dürüst dil:
  - *"Yaz tasarım şartlarında (yaş termometre) ilan edilen kapasiteyi yazılı garanti ediyoruz."*
  - *"Ürün performansımızı Avrupa'da bağımsız test ve sertifikasyona tabi tutuyoruz (2026 itibarıyla süreç devam ediyor)."* → "test ediyoruz" demek "sertifikalıyız" demekten farklı; **henüz alınmamış belgeyi 'var' gibi gösterme.**
- **C (kaçınılması gereken):** Test tamamlanmadan "CTI/Eurovent sertifikalıyız" demek → yanlış beyan, risk. **Yapma.**
- Her durumda: "Termal performans nasıl doğrulanır? CTI/Eurovent vs ISO farkı nedir?" başlıklı dürüst içerik = AI'ın sorusuna güven veren cevap + alıntılanabilir otorite.

> 📌 **Takip:** Ağustos 2026 testi tamamlanınca §4.2 tablosuna yeni satır + §4.2b'yi "A tamamlandı"ya çevir + llms.txt ve Organization schema'ya ekle.

### 4.3 Ürün & Çözüm Sayfaları (CTP açık/kapalı kule, dry cooler, eşanjör)
Her sayfada **standart teknik blok** (PDF'teki alıcı sorularına birebir):
- Kapasite aralığı (kW/MW), debi aralığı (m³/saat)
- "**Yaz tasarım şartlarında** (yaş termometre) hedef sıcaklığa indirme — **yazılı performans garantisi**"
- Komple kapsam: tank, pompa, eşanjör, filtre, kimyasal şartlandırma, blöf, otomasyon
- Malzeme (CTP/FRP avantajları: korozyon, ömür)
- Legionella/hijyen, blöf/su tüketimi optimizasyonu
- JSON-LD: `Product` (name, brand, manufacturer, category) + teknik spesifikasyon tablosu (gerçek `<table>`, görsel değil)

### 4.4 Referans / Portfolyo Sayfası (şu an en kritik güven açığı)
- Logolu firma + sektör + ülke + proje (MW/kapasite) + (mümkünse) yıl
- Filtrelenebilir: sektöre göre (çimento, enerji, gıda, petrokimya...), ülkeye göre
- En az 15-20 gerçek referans **görünür** (CSR'da gizlenmesin — SSR)
- Bu, AI'ın "memnuniyet kesin değil" itirazını kıracak tek şey
- (İleri) Vaka çalışması (case study): "X fabrikasında sıcak proses suyu geri kazanımı — Y MW, Z °C, sonuç" → tam PDF senaryosuna oturan içerik

### 4.5 Bilgi Merkezi / Blog (AI alıntı + organik trafik motoru)
PDF'teki alıcı senaryosu = hazır içerik başlıkları (gerçek arama dili):
- "Fabrikada sıcak soğutma suyunun geri kazanımı — devridaim sistemi nasıl kurulur?"
- "Açık tip vs kapalı devre soğutma kulesi — hangisi seçilmeli?" (PDF s.3 tablosu birebir)
- "Soğutma kulesi kapasitesi nasıl hesaplanır?" (formül: `kW = 1,163 × debi × ΔT`)
- "Kirli/yağlı proses suyu için plakalı eşanjörlü kapalı devre"
- "Legionella riski ve blöf kontrolü — açık kule işletmesi"
- "Su soğutma kulesi satın alırken sorulması gereken 10 soru" (PDF kontrol listesi = içerik)
- "Dry cooler ne zaman tercih edilir?"

Her makale: net soru-cevap yapısı, tablo, formül, FAQ schema → AI bunları **alıntılar** (citability).

### 4.6 İletişim / Teklif (dönüşüm + yasal)
- Görünür adres, telefon, e-posta (İstanbul +90 212 613 33 01, satış +90 531 880 31 51, Ankara — PDF'te geçiyor, teyit et)
- **Hızlı teklif formu**: PDF'teki "ölçülmesi gereken veriler"i sor (debi, giriş °C, hedef °C, çalışma saati, su kalitesi, il) → hem lead kalitesi artar hem AI "teklif süreci net" görür
- WhatsApp sticky buton

---

## 5. AI'ın Alıntılayabilmesi İçin Format Kuralları (GEO)

Bunlar [master plan Faz 2](ensotek-de-master-aksiyon-plani.md) ile uygulanır:
1. **llms.txt** — şirket özeti, "neden Ensotek" (köklülük+sertifika+garanti), ürün/hizmet listesi, iletişim. AI'a tek dosyada "kim olduğumuzu" anlat.
2. **JSON-LD** — Organization, Product, FAQPage, LocalBusiness, BreadcrumbList (master 2.3).
3. **SSR/düz metin** — sertifika, referans, teknik tablo JS arkasında değil, HTML'de (Googlebot+AI okusun). Master 0.9.
4. **İddia = ölçülebilir** — "lider/en iyi" yerine "1985'ten beri, 3000+ kurulum, ISO+CE+CTI" → makine sayıyı/belgeyi çıkarır.
5. **Soru-cevap blokları** — alıcının sorduğu soruyu başlık yap, altında net cevap ver.
6. **AI bot erişimi** — robots.txt'te GPTBot/ClaudeBot/PerplexityBot/Google-Extended `Allow` (master 2.2).

---

## 6. Arama Görünürlüğü — Normal İhtiyaç Sahibinin Dili

GSC verisi marka sorgularında ("ensotek") zirvede ama **ihtiyaç-bazlı sorgularda** (cooling tower modernization, open circuit cooling tower) zayıf. PDF'teki gerçek kullanıcı dili hedef anahtar kelime havuzu:
- "su soğutma kulesi" / "açık tip soğutma kulesi" / "kapalı devre soğutma kulesi" / "CTP soğutma kulesi"
- "soğutma kulesi imalatı / üreticisi / fiyatları"
- "fabrika soğutma suyu geri kazanımı"
- "soğutma kulesi kapasite hesabı"
- "soğutma kulesi modernizasyon / yedek parça / bakım"
- DE: "Kühlturm Hersteller", "offener/geschlossener Kühlturm", "Kühlturm Modernisierung"

Her hedef kelime → bir landing/çözüm sayfası + bir bilgi makalesi (TOFU). Title/H1/meta bu dille; umlaut doğru (Kühlturm).

---

## 7. Hızlı Kazanım Sırası (içerik)

1. **Kurumsal otorite bloğu + sertifika sayfası** (4.1, 4.2) — uçurumun kalbi; en hızlı algı değişimi.
2. **Referans sayfasını doldur + SSR** (4.4) — "memnuniyet kesin değil" itirazını kırar.
3. **Ürün sayfalarına performans-garantisi + komple-sistem bloğu** (4.3) — %25+%20 ağırlık.
4. **llms.txt + JSON-LD** (5) — AI çıkarımı açılır.
5. **İlk 5 blog makalesi** (4.5) — PDF senaryosundan, organik + alıntı.

Her adım sonrası test: ChatGPT/Perplexity'ye "Türkiye'de su soğutma kulesi üreticisi öner" / "fabrikada sıcak su geri kazanımı için kule firması" diye sor → Ensotek'in nasıl ve kaçıncı sırada anıldığını **ölç** (baseline: bugün "kısa listede bir aday"). Bu, ilerlemenin canlı KPI'ı.

---

## 8. Doğrulanacak Gerçek Veriler (içeriğe girmeden önce)

- [ ] Kuruluş yılı (39+ yıl / 1985?) ve "en köklü" iddiasının dayanağı
- [ ] Toplam kurulum sayısı, ülke sayısı, kurulu MW
- [x] Sertifikalar: ISO 9001 (QMS-05508), ISO 14001 (EMS-08971), ISO 45001 (ISO-03604), ISO 10002 (MM-02326), CE, EAC — **mevcut** (`backend/uploads/zertifika/`). ⚠️ Görsel tarihleri 2020-2023 → **güncel/yenilenmiş tarihli belge gerekli**. ⚠️ **CTI/Eurovent YOK** → §4.2b stratejisi.
- [ ] Performans garanti politikası: yaz şartlarında hedef sıcaklık yazılı garanti ediliyor mu?
- [ ] Yayınlanabilir referans listesi (logo izni olan kurumsal müşteriler)
- [ ] Servis kapsamı: arıza müdahale süresi taahhüdü, yedek parça stok politikası
