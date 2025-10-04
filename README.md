# 🌾 AgriInc - Tarım Yönetimi Oyunu

Modern React tabanlı, **gerçek NASA verilerine dayalı** eğitici tarım simülasyonu. 2024 İç Anadolu yağış ve NDVI verileri ile bilimsel tarım yönetimi deneyimi!

## ✨ Özellikler

- 🛰️ **GERÇEK NASA VERİLERİ**: 2024 yılı İç Anadolu (Ankara) yağış ve NDVI verileri
- 🗺️ **Gerçekçi Tarla Görünümü**: Perspektif efektli, animasyonlu 3D buğday tarlası
  - Mevsim bazlı görsel değişimler
  - Kışın kar yağışı ve boş tarla
  - İlkbaharda büyüyen yeşil bitkiler
  - Yazda altın rengi olgun buğday
- 📊 **4 Mevsim = 1 Yıl Simülasyonu**: Gerçek kışlık buğday döngüsü
  - 🍂 **SONBAHAR:** Ekim zamanı (Ekim-Kasım)
  - ❄️ **KIŞ:** Vernalizasyon/dinlenme (Aralık-Şubat)
  - 🌸 **İLKBAHAR:** Büyüme - 3 ay KRİTİK dönem! (Mart-Mayıs)
  - ☀️ **YAZ:** Hasat zamanı (Haziran-Temmuz)
- 🎮 **Stratejik Kararlar**: Her sezonun farklı sulama/gübreleme ihtiyacı
- 🌦️ **Akıllı Hava Sistemi**: 
  - Kararlarınıza göre hava olayları değişir!
  - Sulama yaparsanız kuraklık riski %70 azalır
  - Gübreleme yaparsanız ideal koşullar artar
  - Sezona özel olaylar (kışın kar, ilkbaharda don riski)
- 📈 **Kritik Dönem Sistemi**: İlkbahar 3 ayı (Mart-Mayıs) tüm hasadı belirler!
- ⏱️ **Gerçekçi Zaman Akışı**: Mevsim göstergeleri, sıcaklık bilgisi, ay çubukları
- 💰 **Gelişmiş Ekonomi**: 300₺ bütçe, stratejik teknoloji satın alma

## 🚀 Kurulum

### Gereksinimler
- Node.js 16+ 
- npm veya yarn

### Adımlar

1. **Bağımlılıkları yükleyin:**
```bash
npm install
```

2. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

3. **Tarayıcınızda açın:**
```
http://localhost:5173
```

## 🎮 Nasıl Oynanır?

### 4 Mevsim = 1 Yıllık Gerçek Buğday Döngüsü:

#### 🍂 Sezon 1 - SONBAHAR (Ekim-Kasım)
- **EKİM ZAMANI:** Kışlık buğday tohumları toprağa atılır
- 🌡️ Sıcaklık: 10-15°C
- 💧 **Nem şart!** Tohum çimlenmesi için toprak ıslak olmalı
- 👁️ **Görsel:** Küçük yeşil filizler 🌱, taze ekilmiş toprak
- ⚠️ Kuraklık: Çimlenme gerçekleşmez!

#### ❄️ Sezon 2 - KIŞ (Aralık-Şubat)
- **VERNALIZASYON:** Bitkiler toprak altında kış uykusunda
- 🌡️ Sıcaklık: -5°C ile +5°C
- ❄️ **Soğuk gerekli!** Bahar büyümesi için kış şart
- 👁️ **Görsel:** Tarla BOŞ/KARLI ❄️, bitkiler görünmez!
- ⛔ Fazla müdahale zararlı, kar suyu yeterli
- 💡 **Strateji:** PARA BİRİKTİRME ZAMANI!

#### 🌸 Sezon 3 - İLKBAHAR (Mart-Mayıs) ⭐ EN KRİTİK 3 AY!
- **SAPA KALKMA + BAŞAKLANMA:** Yılın en kritik dönemi!
- 🌡️ Sıcaklık: 15-25°C
- 💧 **SU VE GÜBRE ŞART!** Bu 3 ay tüm hasadı belirler
- 👁️ **Görsel:** Yeşil bitkiler büyüyor 🌿, sağlıklı toprak
- ⚠️ Riskler:
  - **Mart-Nisan Donu:** Bitkileri yok eder!
  - **Kuraklık:** Büyüme durur, %30-40 verim kaybı!
  - **Mayıs sıcakları:** Başaklar kurur!
- 📊 **2024 Gerçek Veri:** Nisan'da sadece 11.34 mm yağış (KURAKLIK!)

#### ☀️ Sezon 4 - YAZ (Haziran-Temmuz)
- **HASAT ZAMANI:** Tahıl olgunlaşıyor
- 🌡️ Sıcaklık: 25-35°C
- ☀️ **Kuru hava ideal!** Tahıl kurumalı
- 👁️ **Görsel:** Altın rengi olgun buğday 🌾
- ⛔ **SULAMA ZARARLI!** Tahıl ıslanırsa kalite düşer

### 🎯 Strateji İpuçları:
1. **Sonbahar:** Sulamayı ihmal etme, ekim başarısını belirler
2. **Kış:** Para biriktir, fazla harcama
3. **İlkbahar:** **KAZANMA VEYA KAYBETME ZAMANI!** Tüm kaynaklarını kullan
4. **Yaz:** Sulama, gübre yok - sadece bekle ve hasat et

### 🧠 Akıllı Hava Sistemi:
- **Sulama yaparsanız:** Kuraklık riski %70 azalır, yağış şansı %50 artar
- **Gübreleme yaparsanız:** İdeal koşullar %30 artar
- **Kararlarınız hava olaylarını etkiler!** Artık "suladım ama kuraklık geldi" sorunu yok!

### 📊 Başlangıç Kaynakları:
- 💰 Bütçe: **300₺**
- 🌱 Bitki Sağlığı: **65%**
- 📅 Hedef: 4 sezonu tamamla ve en yüksek skoru al!

## 🛠️ Teknolojiler

- **React 18.3** - Modern UI framework
- **Vite** - Hızlı geliştirme ve build aracı
- **Tailwind CSS** - Utility-first CSS framework
- **JavaScript (ES6+)** - Modern JavaScript özellikleri

## 📁 Proje Yapısı

```
agri-inc/
├── src/
│   ├── components/          # React bileşenleri
│   │   ├── GameBoard.jsx    # Ana oyun tahtası
│   │   ├── TurkeyMap.jsx    # Türkiye haritası ve tarla görünümü
│   │   ├── CropHealth.jsx   # Bitki sağlığı göstergesi
│   │   ├── DecisionPanel.jsx # Karar verme paneli
│   │   ├── EventCard.jsx    # Hava durumu olayları
│   │   ├── UpgradePanel.jsx # Teknoloji ağacı
│   │   └── ScoreBoard.jsx   # Skor tablosu
│   ├── utils/
│   │   └── gameLogic.js     # Oyun mantığı ve hesaplamalar
│   ├── App.jsx              # Ana uygulama bileşeni
│   ├── main.jsx             # Giriş noktası
│   └── index.css            # Global stiller
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🎯 Oyun Mekaniği

### Bitki Sağlığı (NDVI)
- **0-24**: ❌ Kritik durum
- **25-49**: ⚠️ Zayıf
- **50-74**: ✅ İyi
- **75-100**: ⭐ Mükemmel

### Teknolojiler
1. **Damla Sulama** (70₺): Su kullanımını %25 artırır
2. **Organik Gübre** (100₺): Gübreleme etkisini %35 artırır
3. **Uydu İzleme** (150₺): Olumsuz hava etkilerini %50 azaltır
4. **🚁 Drone İlaçlama** (200₺): Hastalık riskini %60 azaltır, verimi %40 artırır
5. **📡 Toprak Sensörleri** (120₺): Hastalık erken tespit, %30 verim artışı

### Hava Olayları (Sezona Özel!)

#### 🍂 Sonbahar:
- 🌧️ **Sonbahar Yağmurları** +20: İdeal ekim koşulları
- ☀️ **Kuru Ekim** -15: Çimlenme zorlaşır

#### ❄️ Kış:
- ❄️ **Normal Kış** +5: Vernalizasyon devam ediyor
- 🥶 **Aşırı Don** -12: Çok sert kış, bazı zarar
- 🌤️ **Ilık Kış** -8: Beklenenden ılık, vernalizasyon etkilendi

#### 🌸 İlkbahar (KRİTİK!):
- 🌧️ **İlkbahar Yağışları** +30: ⭐ Sapa kalkma için ideal!
- 🔥 **Şiddetli Kuraklık** -40: ❌ FELAKET! Büyüme durdu
- ❄️ **Geç Don** -45: ❌ Mart-Nisan donu bitkileri yok etti
- 🌡️ **Erken Sıcak Dalga** -30: Mayıs'ta aşırı sıcak
- 🌈 **İdeal İlkbahar** +25: ⭐ Mükemmel koşullar

#### ☀️ Yaz:
- ☀️ **Güneşli Hava** +15: ⭐ Hasat için mükemmel
- 🌧️ **Yağışlı Sezon** -15: ❌ Tahıllar ıslak
- ⛈️ **Fırtına** -25: Başaklar yere döküldü
- 🧊 **Dolu** -30: ❌ FELAKET!

### 🦠 Hastalık Sistemi (Gerçek Tarım Bilgisi!)

#### 🍂 Sonbahar Hastalıkları:
- 🦠 **Kök Çürüklüğü** (-25): Aşırı nemden kökler çürüdü
- 🔥 **Fide Yanıklığı** (-20): Genç fidelerde mantar hastalığı

#### ❄️ Kış Hastalıkları:
- ❄️ **Kar Küfü** (-15): Kar altında mantar gelişimi

#### 🌸 İlkbahar Hastalıkları (KRİTİK!):
- 🟫 **Pas Hastalığı** (-35): ⚠️ FELAKET! Yapraklarda pas lekeleri
- 🤍 **Külleme** (-30): ⚠️ Yapraklarda beyaz kül tabakası
- 🟡 **Yaprak Lekesi** (-20): Yapraklarda kahverengi lekeler
- 💀 **Fusarium Solgunluğu** (-40): ❌ FELAKET! Bitkiler soluyor

#### ☀️ Yaz Hastalıkları:
- 🟣 **Ergot Mantarı** (-30): ❌ Başaklarda zehirli mantar
- ⚫ **Rastık Hastalığı** (-25): Başaklarda siyah mantar

### 🚁 Teknoloji ile Hastalık Önleme:
- **Drone İlaçlama:** Hastalık riskini %60 azaltır
- **Toprak Sensörleri:** Erken tespit ile %30 koruma
- **Akıllı Sistem:** Koşullara göre otomatik uyarı

## 🏗️ Build

Üretim için build almak:

```bash
npm run build
```

Build sonucu `dist/` klasöründe oluşur.

## 👀 Önizleme

Build'i önizlemek için:

```bash
npm run preview
```

## 📝 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Pull request göndermekten çekinmeyin.

## 📧 İletişim

Sorularınız için issue açabilirsiniz.

---

**Geliştirici Notu**: Bu MVP versiyonudur. Gelecek versiyonlarda:
- Gerçek NASA API entegrasyonu
- Çoklu bölge desteği (Karadeniz, Ege, Akdeniz)
- Daha fazla ürün çeşidi
- Hastalık ve zararlı sistemi
- Çok oyunculu mod
- Liderlik tablosu

Keyifli oyunlar! 🌾

