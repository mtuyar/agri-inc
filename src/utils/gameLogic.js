// Oyun mantığı ve hesaplamalar - GERÇEKÇI TARIM TAKVİMİ

// SEZON SİSTEMİ (Gerçek buğday takvimi - 4 Mevsim = 1 Yıl)
export const SEASONS = {
  1: { 
    name: 'Sonbahar - Ekim Zamanı', 
    period: 'Ekim-Kasım', 
    phase: 'ekim', 
    critical: false,
    icon: '🍂',
    description: 'Kışlık buğday ekim dönemi. Tohumlar toprağa atılır.',
    temp: '10-15°C'
  },
  2: { 
    name: 'Kış - Vernalizasyon', 
    period: 'Aralık-Şubat', 
    phase: 'kis', 
    critical: false,
    icon: '❄️',
    description: 'Bitkiler toprak altında kış uykusunda. Soğuk gerekli!',
    temp: '-5 - +5°C'
  },
  3: { 
    name: 'İlkbahar - Büyüme', 
    period: 'Mart-Mayıs', 
    phase: 'ilkbahar', 
    critical: true,
    icon: '🌸',
    description: 'Sapa kalkma ve başaklanma! EN KRİTİK DÖNEM!',
    temp: '15-25°C'
  },
  4: { 
    name: 'Yaz - Hasat', 
    period: 'Haziran-Temmuz', 
    phase: 'hasat', 
    critical: false,
    icon: '☀️',
    description: 'Olgunlaşma ve hasat zamanı. Kuru hava şart!',
    temp: '25-35°C'
  },
};

// Sezona göre hava olayları ve etkileri
export const WEATHER_EVENTS = {
  // SONBAHAR olayları
  ekim: [
    { id: 'rain', name: 'Yağışlı Sezon', effect: 15, icon: '🌧️', description: 'Sonbahar yağışları toprağı nemlendirdi. Ekim için ideal!', weight: 3 },
    { id: 'drought', name: 'Kuraklık', effect: -15, icon: '☀️', description: 'Kuru toprak ekimi zorlaştırdı.', weight: 2 },
    { id: 'normal', name: 'Normal İklim', effect: 8, icon: '⛅', description: 'Ekim için uygun hava koşulları.', weight: 3 },
    { id: 'early_frost', name: 'Erken Don', effect: -20, icon: '❄️', description: 'Erken gelen don çimlenen tohumlara zarar verdi!', weight: 1 },
  ],
  
  // KIŞ olayları
  kis: [
    { id: 'snow', name: 'Karlı Hava', effect: 10, icon: '🌨️', description: 'Kar örtüsü bitkileri soğuktan korudu.', weight: 3 },
    { id: 'normal_cold', name: 'Normal Kış', effect: 5, icon: '❄️', description: 'Kış uykusu normal seyrediyor.', weight: 3 },
    { id: 'severe_frost', name: 'Aşırı Don', effect: -12, icon: '🥶', description: 'Çok sert kış bazı bitkilere zarar verdi.', weight: 1 },
    { id: 'warm_winter', name: 'Ilık Kış', effect: -8, icon: '🌤️', description: 'Beklenenden ılık kış vernalizasyonu etkiledi.', weight: 1 },
  ],
  
  // İLKBAHAR olayları (TEK SEZON - 3 AY - EN KRİTİK!)
  ilkbahar: [
    { id: 'rain', name: 'İlkbahar Yağışları', effect: 30, icon: '🌧️', description: '⭐ Sapa kalkma ve başaklanma için ideal yağış!', weight: 2 },
    { id: 'drought', name: 'Şiddetli Kuraklık', effect: -40, icon: '🔥', description: '⚠️ FELAKET! Kritik dönemde su yok - büyüme durdu!', weight: 3 },
    { id: 'normal', name: 'Ilıman İlkbahar', effect: 15, icon: '🌤️', description: 'Büyüme için iyi koşullar.', weight: 2 },
    { id: 'late_frost', name: 'Geç Don', effect: -45, icon: '❄️', description: '⚠️ FELAKET! Mart-Nisan donu bitkileri yok etti!', weight: 1 },
    { id: 'heatwave', name: 'Erken Sıcak Dalga', effect: -30, icon: '🌡️', description: '⚠️ Mayısta aşırı sıcak başakları kuruttu!', weight: 2 },
    { id: 'ideal', name: 'İdeal İlkbahar', effect: 25, icon: '🌈', description: '⭐ Mükemmel hava - yağış, sıcaklık ideal!', weight: 1 },
  ],
  
  // YAZ - HASAT olayları
  hasat: [
    { id: 'sunny', name: 'Güneşli Hava', effect: 15, icon: '☀️', description: '⭐ Hasat için mükemmel kuru hava!', weight: 4 },
    { id: 'rain', name: 'Yağışlı Sezon', effect: -15, icon: '🌧️', description: '❌ Yağmur tahılları ıslattı ve kaliteyi düşürdü!', weight: 2 },
    { id: 'normal', name: 'Normal Yaz', effect: 8, icon: '⛅', description: 'Hasat için uygun hava.', weight: 2 },
    { id: 'storm', name: 'Fırtına', effect: -25, icon: '⛈️', description: '❌ Fırtına başakları yere döktü!', weight: 1 },
    { id: 'hail', name: 'Dolu', effect: -30, icon: '🧊', description: '❌ FELAKET! Dolu tüm ürünü harap etti!', weight: 1 },
  ],
};

// HASTALIK SİSTEMİ - GERÇEKÇİ TARIM HASTALIKLARI
export const DISEASES = {
  // Sonbahar hastalıkları
  ekim: [
    { id: 'root_rot', name: 'Kök Çürüklüğü', effect: -25, icon: '🦠', description: 'Aşırı nemden kökler çürüdü!', weight: 2, condition: 'high_moisture' },
    { id: 'seedling_blight', name: 'Fide Yanıklığı', effect: -20, icon: '🔥', description: 'Genç fidelerde mantar hastalığı!', weight: 1, condition: 'poor_soil' },
  ],
  
  // Kış hastalıkları
  kis: [
    { id: 'snow_mold', name: 'Kar Küfü', effect: -15, icon: '❄️', description: 'Kar altında mantar gelişimi!', weight: 1, condition: 'warm_winter' },
  ],
  
  // İlkbahar hastalıkları (EN KRİTİK!)
  ilkbahar: [
    { id: 'rust', name: 'Pas Hastalığı', effect: -35, icon: '🟫', description: '⚠️ FELAKET! Yapraklarda pas lekeleri!', weight: 3, condition: 'high_humidity' },
    { id: 'powdery_mildew', name: 'Külleme', effect: -30, icon: '🤍', description: '⚠️ Yapraklarda beyaz kül tabakası!', weight: 2, condition: 'high_humidity' },
    { id: 'leaf_spot', name: 'Yaprak Lekesi', effect: -20, icon: '🟡', description: 'Yapraklarda kahverengi lekeler!', weight: 2, condition: 'poor_air_circulation' },
    { id: 'fusarium', name: 'Fusarium Solgunluğu', effect: -40, icon: '💀', description: '❌ FELAKET! Bitkiler soluyor ve ölüyor!', weight: 1, condition: 'high_temp_low_moisture' },
  ],
  
  // Yaz hastalıkları
  hasat: [
    { id: 'ergot', name: 'Ergot Mantarı', effect: -30, icon: '🟣', description: '❌ Başaklarda zehirli mantar!', weight: 1, condition: 'high_humidity' },
    { id: 'smut', name: 'Rastık Hastalığı', effect: -25, icon: '⚫', description: 'Başaklarda siyah mantar!', weight: 2, condition: 'high_humidity' },
  ],
};

// HASTALIK KOŞULLARI - GERÇEKÇİ TARIM BİLGİSİ
export const checkDiseaseConditions = (season, cropHealth, decisions, event) => {
  const conditions = [];
  
  // Nem kontrolü
  const hasWatered = decisions.some(d => d.id === 'water');
  const isRainy = event.id === 'rain' || event.id === 'autumn_rain';
  
  if (hasWatered && isRainy) {
    conditions.push('high_moisture'); // Çok nemli
  }
  
  // Sağlık kontrolü
  if (cropHealth < 40) {
    conditions.push('poor_soil'); // Zayıf toprak
    conditions.push('poor_air_circulation'); // Zayıf hava sirkülasyonu
  }
  
  // Sıcaklık kontrolü
  if (season === 3 && event.id === 'heatwave') {
    conditions.push('high_temp_low_moisture'); // Sıcak + kuru
  }
  
  // Nem kontrolü
  if (isRainy || (season === 3 && hasWatered)) {
    conditions.push('high_humidity'); // Yüksek nem
  }
  
  // Kış kontrolü
  if (season === 2 && event.id === 'warm_winter') {
    conditions.push('warm_winter'); // Ilık kış
  }
  
  return conditions;
};

// HASTALIK TESPİT VE ETKİSİ
export const checkForDiseases = (season, cropHealth, decisions, event, upgrades) => {
  const seasonInfo = SEASONS[season];
  const diseases = DISEASES[seasonInfo.phase] || [];
  
  if (diseases.length === 0) return null;
  
  const conditions = checkDiseaseConditions(season, cropHealth, decisions, event);
  const possibleDiseases = diseases.filter(disease => 
    conditions.some(condition => disease.condition === condition)
  );
  
  if (possibleDiseases.length === 0) return null;
  
  // Drone teknolojisi hastalık riskini azaltır
  const hasDrone = upgrades.includes('drone');
  const hasSensor = upgrades.includes('sensor');
  
  let diseaseRisk = 1.0;
  if (hasDrone) diseaseRisk *= 0.4; // %60 azalt
  if (hasSensor) diseaseRisk *= 0.7; // %30 azalt
  
  // Hastalık olasılığı
  const totalWeight = possibleDiseases.reduce((sum, d) => sum + d.weight, 0);
  const random = Math.random() * totalWeight * diseaseRisk;
  
  let currentWeight = 0;
  for (const disease of possibleDiseases) {
    currentWeight += disease.weight;
    if (random <= currentWeight) {
      return {
        ...disease,
        prevented: hasDrone || hasSensor,
        preventionMessage: hasDrone ? '🚁 Drone ile erken müdahale!' : 
                           hasSensor ? '📡 Sensör ile erken tespit!' : null
      };
    }
  }
  
  return null;
};

// HASTALIK UYARI SİSTEMİ - ERKEN TESPİT VE TAVSİYE
export const getDiseaseWarning = (season, cropHealth, decisions, event, upgrades) => {
  const seasonInfo = SEASONS[season];
  const diseases = DISEASES[seasonInfo.phase] || [];
  
  if (diseases.length === 0) return null;
  
  const conditions = checkDiseaseConditions(season, cropHealth, decisions, event);
  const possibleDiseases = diseases.filter(disease => 
    conditions.some(condition => disease.condition === condition)
  );
  
  if (possibleDiseases.length === 0) return null;
  
  // En yüksek riskli hastalığı seç
  const highestRiskDisease = possibleDiseases.reduce((max, disease) => 
    disease.weight > max.weight ? disease : max
  );
  
  const hasDrone = upgrades.includes('drone');
  const hasSensor = upgrades.includes('sensor');
  
  // Uyarı seviyesi
  let warningLevel = 'medium';
  if (highestRiskDisease.effect < -35) warningLevel = 'high';
  else if (highestRiskDisease.effect < -20) warningLevel = 'medium';
  else warningLevel = 'low';
  
  // İlaçlama tavsiyesi
  let treatmentAdvice = '';
  if (highestRiskDisease.id === 'rust') {
    treatmentAdvice = '🔬 Fungisit uygulaması önerilir (Tebuconazole)';
  } else if (highestRiskDisease.id === 'powdery_mildew') {
    treatmentAdvice = '🔬 Kükürt bazlı fungisit kullanın';
  } else if (highestRiskDisease.id === 'fusarium') {
    treatmentAdvice = '🔬 Trichoderma biyolojik mücadele önerilir';
  } else if (highestRiskDisease.id === 'root_rot') {
    treatmentAdvice = '🔬 Toprak drenajını iyileştirin, fungisit uygulayın';
  } else {
    treatmentAdvice = '🔬 Uygun fungisit ile koruyucu ilaçlama yapın';
  }
  
  return {
    disease: highestRiskDisease,
    warningLevel,
    treatmentAdvice,
    conditions: conditions,
    hasProtection: hasDrone || hasSensor,
    protectionMessage: hasDrone ? '🚁 Drone ile otomatik ilaçlama aktif!' : 
                       hasSensor ? '📡 Sensör ile erken uyarı sistemi!' : null
  };
};

// Sezona göre sulama etkileri (4 SEZON)
export const getSeasonWaterEffects = (season) => {
  const effects = {
    1: { water: 18, noWater: -12 },  // Sonbahar EKİM - nem ŞU ART (tohum çimlenmesi için)
    2: { water: 5, noWater: -3 },    // Kış - kar suyu yeterli, fazla su zararlı
    3: { water: 35, noWater: -35 },  // İlkbahar - EN KRİTİK! 3 ay büyüme, su hayati
    4: { water: -15, noWater: 10 },  // Yaz HASAT - Sulama ZARARLI! Tahıl ıslanır
  };
  return effects[season] || effects[1];
};

export const DECISIONS = {
  water: {
    name: 'Sulama',
    getOptions: (season) => {
      const effects = getSeasonWaterEffects(season);
      return [
        { 
          id: 'water', 
          label: 'Sula', 
          cost: 15, 
          effect: effects.water, 
          icon: '💧',
          seasonAdvice: season === 3 ? '⭐ KRİTİK DÖNEM!' : season === 4 ? '⚠️ Zararlı olabilir' : season === 1 ? '✓ Önemli' : ''
        },
        { 
          id: 'no_water', 
          label: 'Sulama', 
          cost: 0, 
          effect: effects.noWater, 
          icon: '🚫',
          seasonAdvice: season === 3 ? '❌ Çok riskli!' : season === 4 ? '✓ Doğru karar' : ''
        },
      ];
    }
  },
  fertilize: {
    name: 'Gübreleme',
    getOptions: (season) => {
      // Gübreleme etkisi sezona göre (4 SEZON) - GERÇEKÇİ!
      const effects = {
        1: { fertilize: 20, noFertilize: -10 }, // Sonbahar EKİM - toprak hazırlığı kritik
        2: { fertilize: 10, noFertilize: -5 },  // Kış - orta etkili
        3: { fertilize: 30, noFertilize: -20 }, // İlkbahar BÜYÜME - çok önemli!
        4: { fertilize: 5, noFertilize: 0 },    // Yaz HASAT - gübreleme gereksiz, ceza yok!
      };
      const eff = effects[season] || effects[1];
      
      return [
        { 
          id: 'fertilize', 
          label: 'Gübrele', 
          cost: 20, 
          effect: eff.fertilize, 
          icon: '🌱',
          seasonAdvice: season === 3 ? '⭐ Önerilen' : season === 4 ? '✓ Doğru karar' : season === 1 ? '✓ İyi' : ''
        },
        { 
          id: 'no_fertilize', 
          label: 'Gübreleme', 
          cost: 0, 
          effect: eff.noFertilize, 
          icon: '🚫',
          seasonAdvice: season === 3 ? '❌ Çok riskli!' : season === 4 ? '✓ Doğru karar' : ''
        },
      ];
    }
  }
};

export const UPGRADES = [
  { id: 'drip', name: 'Damla Sulama', cost: 70, unlocked: false, effect: 1.25, icon: '💧', description: 'Su kullanımını %25 daha verimli hale getirir' },
  { id: 'organic', name: 'Organik Gübre', cost: 100, unlocked: false, effect: 1.35, icon: '🌿', description: 'Gübreleme etkisini %35 artırır' },
  { id: 'satellite', name: 'Uydu İzleme', cost: 150, unlocked: false, effect: 1.5, icon: '🛰️', description: 'Olumsuz hava etkilerini %50 azaltır' },
  { id: 'drone', name: 'Drone İlaçlama', cost: 200, unlocked: false, effect: 1.4, icon: '🚁', description: 'Hastalık riskini %60 azaltır, verimi %40 artırır' },
  { id: 'sensor', name: 'Toprak Sensörleri', cost: 120, unlocked: false, effect: 1.3, icon: '📡', description: 'Hastalık erken tespit, %30 verim artışı' },
];

// NDVI sağlık hesaplama - HASTALIK SİSTEMİ İLE!
export const calculateCropHealth = (currentHealth, decisions, event, upgrades, season) => {
  let newHealth = currentHealth;
  const seasonInfo = SEASONS[season];
  
  // Doğal değişim - sezona göre (4 SEZON)
  const naturalChange = {
    1: -5,  // Sonbahar EKİM - ekim stresi
    2: -3,  // Kış - dinlenme, az azalma
    3: -15, // İlkbahar BÜYÜME - 3 ay, yoğun enerji, çok bakım gerekli
    4: -8,  // Yaz HASAT - olgunlaşma, doğal kuruma
  };
  newHealth += (naturalChange[season] || -5);
  
  // Karar etkilerini uygula
  decisions.forEach(decision => {
    let effect = decision.effect;
    
    // Kritik sezonda etkiler artırılır
    if (seasonInfo.critical) {
      effect *= 1.2; // İlkbaharda her karar %20 daha etkili
    }
    
    // Upgrade etkilerini uygula
    if (decision.id === 'water' && upgrades.includes('drip')) {
      effect *= 1.25;
    }
    if (decision.id === 'fertilize' && upgrades.includes('organic')) {
      effect *= 1.35;
    }
    
    // Drone teknolojisi genel verimi artırır
    if (upgrades.includes('drone')) {
      effect *= 1.4; // %40 verim artışı
    }
    if (upgrades.includes('sensor')) {
      effect *= 1.3; // %30 verim artışı
    }
    
    newHealth += effect;
  });
  
  // Hava durumu etkisini uygula
  let eventEffect = event.effect;
  
  // Kritik sezonda kötü hava çok daha zararlı
  if (seasonInfo.critical && eventEffect < 0) {
    eventEffect *= 1.3;
  }
  
  // Uydu teknolojisi olumsuz etkileri azaltır
  if (upgrades.includes('satellite') && eventEffect < 0) {
    eventEffect *= 0.5;
  }
  
  newHealth += eventEffect;
  
  // HASTALIK KONTROLÜ
  const disease = checkForDiseases(season, newHealth, decisions, event, upgrades);
  if (disease) {
    if (disease.prevented) {
      // Hastalık önlendi ama küçük etki
      newHealth += disease.effect * 0.2; // %20 etki
    } else {
      // Hastalık etkisi
      newHealth += disease.effect;
    }
  }
  
  // Düşük sağlıkta ekstra risk
  if (newHealth < 30) {
    newHealth -= 8; // Hastalık ve zararlı riski
  }
  
  // 0-100 arasında tut
  return Math.max(0, Math.min(100, newHealth));
};

// NASA VERİLERİNİ YÜKLE
import nasaData2024 from '../data/nasaData2024.json';
import nasaNDVI from '../data/nasaNDVI.json';

// NASA VERİLERİNE GÖRE HAVA OLAYI BELİRLE
export const getNasaBasedEvent = (season, decisions = []) => {
  const seasonInfo = SEASONS[season];
  const hasWatered = decisions.some(d => d.id === 'water');
  
  // Sezona göre ay belirle
  const monthMap = {
    1: ['ekim', 'kasim'],     // Sonbahar
    2: ['aralik', 'ocak', 'subat'], // Kış
    3: ['mart', 'nisan', 'mayis'],  // İlkbahar
    4: ['haziran', 'temmuz']        // Yaz
  };
  
  const months = monthMap[season] || ['mart'];
  const currentMonth = months[Math.floor(Math.random() * months.length)];
  
  // NASA yağış verilerini al
  const monthlyPrecipitation = nasaData2024.precipitation[currentMonth] || [];
  const avgPrecipitation = monthlyPrecipitation.reduce((sum, val) => sum + val, 0) / monthlyPrecipitation.length;
  
  // Yağış seviyesine göre olay belirle
  let event;
  
  if (avgPrecipitation > 5) {
    // Bol yağış
    event = {
      id: 'rain',
      name: `${currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)} Yağışları`,
      effect: 25,
      icon: '🌧️',
      description: `⭐ NASA verilerine göre ${currentMonth} ayında ${avgPrecipitation.toFixed(1)}mm ortalama yağış!`,
      weight: 1,
      nasaData: true
    };
  } else if (avgPrecipitation < 1) {
    // Kuraklık
    event = {
      id: 'drought',
      name: `${currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)} Kuraklığı`,
      effect: -30,
      icon: '🔥',
      description: `⚠️ NASA verilerine göre ${currentMonth} ayında sadece ${avgPrecipitation.toFixed(1)}mm yağış!`,
      weight: 1,
      nasaData: true
    };
  } else {
    // Normal
    event = {
      id: 'normal',
      name: `Normal ${currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)}`,
      effect: 10,
      icon: '⛅',
      description: `NASA verilerine göre ${currentMonth} ayında ${avgPrecipitation.toFixed(1)}mm yağış.`,
      weight: 1,
      nasaData: true
    };
  }
  
  // Sulama etkisini uygula
  if (hasWatered && event.id === 'drought') {
    event.effect = -15; // Kuraklık etkisi azaldı
    event.description += ' Sulama sayesinde etkisi azaldı!';
  }
  
  return event;
};

// Sezona göre uygun hava olayı seç - KARARLARA BAĞLI!
export const getRandomEvent = (season, decisions = []) => {
  const seasonInfo = SEASONS[season];
  const seasonEvents = WEATHER_EVENTS[seasonInfo.phase];
  
  if (!seasonEvents || seasonEvents.length === 0) {
    console.error(`Sezon ${season} için hava olayı bulunamadı!`);
    return { id: 'normal', name: 'Normal İklim', effect: 0, icon: '⛅', description: 'Normal hava koşulları.', weight: 1 };
  }
  
  // KARARLARA GÖRE HAVA OLAYI AYARLA
  const hasWatered = decisions.some(d => d.id === 'water');
  const hasFertilized = decisions.some(d => d.id === 'fertilize');
  
  // Sulama yapıldıysa kuraklık riski AZALIR
  let adjustedEvents = seasonEvents.map(event => {
    let adjustedWeight = event.weight;
    let adjustedDescription = event.description;
    
    // Sulama yapıldıysa kuraklık olaylarını azalt
    if (hasWatered && (event.id === 'drought' || event.id === 'dry_autumn')) {
      adjustedWeight = Math.max(1, event.weight * 0.3); // %70 azalt
      adjustedDescription = `⚠️ Kuraklık tehdidi var ama sulama sayesinde etkisi azaldı! ${event.description}`;
    }
    
    // Sulama yapıldıysa yağış olaylarını artır (iyi sulama = nemli hava)
    if (hasWatered && (event.id === 'rain' || event.id === 'autumn_rain')) {
      adjustedWeight = event.weight * 1.5; // %50 artır
      adjustedDescription = `⭐ Sulama ile birlikte mükemmel yağış! ${event.description}`;
    }
    
    // Gübreleme yapıldıysa büyüme olaylarını artır
    if (hasFertilized && (event.id === 'ideal' || event.id === 'normal')) {
      adjustedWeight = event.weight * 1.3; // %30 artır
      adjustedDescription = `⭐ Gübreleme ile ideal koşullar! ${event.description}`;
    }
    
    return { ...event, weight: adjustedWeight, description: adjustedDescription };
  });
  
  // Ağırlıklı rastgele seçim
  const totalWeight = adjustedEvents.reduce((sum, event) => sum + event.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const event of adjustedEvents) {
    random -= event.weight;
    if (random <= 0) {
      return event;
    }
  }
  
  return adjustedEvents[0];
};

// Hasat skoru hesapla - Daha dengeli
export const calculateHarvestScore = (cropHealth, totalBudget, seasonsCompleted) => {
  const healthScore = cropHealth * 8; // Biraz düşürüldü
  const budgetBonus = totalBudget * 1; // Artırıldı (para biriktirmek önemli)
  const seasonBonus = seasonsCompleted * 40; // Biraz düşürüldü
  
  // Bonus: Eğer sağlık 80 üzerindeyse ekstra puan
  const excellenceBonus = cropHealth >= 80 ? 100 : 0;
  
  return Math.round(healthScore + budgetBonus + seasonBonus + excellenceBonus);
};

// IMERG yağış verisi (mock)
export const getRainfallData = (season) => {
  return {
    probability: Math.random() * 100,
    amount: Math.random() * 50,
    season: season
  };
};

