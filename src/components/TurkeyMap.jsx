import React from 'react';

const TurkeyMap = ({ cropHealth, season = 1 }) => {
  // MEVSIM BAZLI GÖRÜNÜM
  const isAutumn = season === 1;  // Sonbahar - Ekim
  const isWinter = season === 2;   // Kış - Toprak altında
  const isSpring = season === 3;   // İlkbahar - Büyüme
  const isSummer = season === 4;   // Yaz - Hasat
  
  // Sağlık kategorileri
  const isHealthy = cropHealth >= 70;
  const isMedium = cropHealth >= 40 && cropHealth < 70;
  const isPoor = cropHealth < 40;

  // Sağlık durumuna göre renk belirleme
  const getHealthColor = () => {
    if (isHealthy) return '#10b981'; // Koyu yeşil
    if (isMedium) return '#eab308'; // Sarı
    return '#dc2626'; // Kırmızı
  };

  // MEVSIM BAZLI BİTKİ GÖRÜNÜMÜ
  const getFieldEmoji = () => {
    if (isWinter) return null; // KIŞ: Toprak altında, görünmez!
    
    if (isAutumn) {
      // SONBAHAR: Yeni ekilmiş, küçük filizler
      if (isHealthy || isMedium) return '🌱'; // Yeşil filiz
      return '🟤'; // Çimlenme yok
    }
    
    if (isSpring) {
      // İLKBAHAR: Büyüyen yeşil bitkiler
      if (isHealthy) return '🌿'; // Güçlü yeşil
      if (isMedium) return '🌱'; // Orta büyüme
      return '🥀'; // Zayıf/kurumuş
    }
    
    if (isSummer) {
      // YAZ: Olgun buğday - SARI/ALTIN
      if (isHealthy) return '🌾'; // Olgun buğday
      if (isMedium) return '🌾'; // Olgun ama zayıf
      return '🥀'; // Kurumuş
    }
    
    return '🌱';
  };

  // MEVSIM BAZLI TOPRAK RENGİ
  const getSoilColor = () => {
    if (isWinter) {
      // KIŞ: Kar örtülü/donmuş toprak
      return 'from-slate-200 via-slate-300 to-slate-400';
    }
    
    if (isAutumn) {
      // SONBAHAR: Taze ekilmiş toprak
      return 'from-amber-800 via-amber-900 to-stone-900';
    }
    
    if (isSpring) {
      // İLKBAHAR: Nemli, verimli toprak
      if (isHealthy) return 'from-amber-700 via-amber-800 to-amber-900';
      if (isMedium) return 'from-yellow-700 via-yellow-800 to-amber-900';
      return 'from-stone-700 via-stone-800 to-stone-900'; // Kuru
    }
    
    if (isSummer) {
      // YAZ: Kuru toprak (hasat için ideal)
      return 'from-yellow-700 via-amber-800 to-amber-900';
    }
    
    return 'from-amber-700 via-amber-800 to-amber-900';
  };

  // MEVSIM BAZLI GÖKYÜZÜ
  const getSkyGradient = () => {
    if (isWinter) return 'from-gray-300 via-slate-200 to-blue-100'; // Soğuk kış gökyüzü
    if (isAutumn) return 'from-orange-200 via-amber-100 to-sky-200'; // Sonbahar
    if (isSpring) return 'from-blue-400 via-sky-300 to-green-100'; // Taze ilkbahar
    if (isSummer) return 'from-yellow-300 via-orange-200 to-blue-300'; // Sıcak yaz
    return 'from-blue-400 via-sky-300 to-sky-200';
  };

  // MEVSIM BAZLI HAVA DURUMU İKONU
  const getWeatherIcon = () => {
    if (isWinter) {
      return { icon: '❄️', text: 'Kış - Kar', size: 'text-8xl' };
    }
    if (isAutumn) {
      return { icon: '🍂', text: 'Sonbahar', size: 'text-7xl' };
    }
    if (isSpring) {
      // İlkbaharda sağlığa göre
      if (isHealthy) return { icon: '🌸', text: 'İlkbahar', size: 'text-8xl' };
      if (isMedium) return { icon: '⛅', text: 'Bulutlu', size: 'text-7xl' };
      return { icon: '🌧️', text: 'Yağmur', size: 'text-6xl' };
    }
    if (isSummer) {
      return { icon: '☀️', text: 'Yaz - Sıcak', size: 'text-9xl' };
    }
    return { icon: '⛅', text: 'Normal', size: 'text-7xl' };
  };

  const weather = getWeatherIcon();

  // Tarla satırları - daha fazla bitki
  const fieldRows = [
    { plants: 24, scale: 0.35, y: 8, depth: 6 },   // En uzak
    { plants: 22, scale: 0.45, y: 16, depth: 5 },
    { plants: 20, scale: 0.55, y: 26, depth: 4 },
    { plants: 18, scale: 0.68, y: 38, depth: 3 },
    { plants: 16, scale: 0.82, y: 52, depth: 2 },
    { plants: 14, scale: 0.95, y: 68, depth: 1 },
    { plants: 12, scale: 1.0, y: 82, depth: 0 },   // En yakın
  ];

  // Bitki yükseklikleri - sağlığa göre
  const getPlantHeight = () => {
    if (isHealthy) return 'h-6';
    if (isMedium) return 'h-4';
    return 'h-2';
  };

  return (
    <div className={`relative bg-gradient-to-b ${getSkyGradient()} rounded-xl p-8 min-h-[580px] flex items-end justify-center overflow-hidden shadow-2xl`}>
      
      {/* GÖK & HAVA DURUMU */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Güneş veya Bulut */}
        <div className={`absolute top-8 right-12 ${weather.size} opacity-90 ${isHealthy ? 'sun-pulse' : ''}`}>
          {weather.icon}
        </div>

        {/* Bulutlar - sayı sağlığa göre */}
        {!isPoor && (
          <>
            <div className="absolute top-12 left-20 text-6xl opacity-70 cloud-float" style={{ animationDuration: '8s' }}>☁️</div>
            <div className="absolute top-20 right-32 text-7xl opacity-60 cloud-float" style={{ animationDuration: '10s', animationDelay: '2s' }}>☁️</div>
          </>
        )}

        {/* Yağmur efekti - sadece kötü sağlıkta */}
        {isPoor && (
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rain-drop"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${0.8 + Math.random() * 0.4}s`
                }}
              >
                💧
              </div>
            ))}
          </div>
        )}

        {/* Türkiye haritası siluet - çok soluk */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 opacity-10">
          <div className="text-xs text-gray-600 font-bold mb-1 text-center">TÜRKİYE - İÇ ANADOLU</div>
          <svg width="200" height="100" viewBox="0 0 1000 500">
            <path
              d="M 100 280 L 900 290 L 910 310 L 880 370 L 100 350 Z"
              fill="#047857"
              opacity="0.3"
            />
          </svg>
        </div>
      </div>

      {/* ANA TARLA GÖRÜNÜMÜ */}
      <div className="relative w-full h-full perspective-field">
        
        {/* TOPRAK ZEMİNİ */}
        <div className={`absolute bottom-0 left-0 right-0 h-4/5 bg-gradient-to-b ${getSoilColor()}`}>
          
          {/* Toprak dokusu */}
          <div className="absolute inset-0 soil-pattern opacity-40"></div>

          {/* Kuraklık çatlakları - orta ve kötü sağlıkta */}
          {!isHealthy && (
            <div className="absolute inset-0">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-stone-900 opacity-60 crack-line"
                  style={{
                    left: `${10 + (i * 12)}%`,
                    top: `${20 + (i * 10) % 60}%`,
                    width: '2px',
                    height: `${40 + Math.random() * 60}px`,
                    transform: `rotate(${-20 + Math.random() * 40}deg)`
                  }}
                />
              ))}
            </div>
          )}

          {/* Nem lekesi - sadece sağlıklı durumda */}
          {isHealthy && (
            <div className="absolute inset-0 opacity-20">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-blue-900"
                  style={{
                    left: `${15 + (i * 15)}%`,
                    top: `${30 + (i * 8) % 50}%`,
                    width: `${60 + Math.random() * 40}px`,
                    height: `${30 + Math.random() * 20}px`,
                    filter: 'blur(8px)'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* BUĞDAY SATIRLARI - MEVSIME GÖRE */}
        {!isWinter && (
          <div className="absolute bottom-0 left-0 right-0 h-4/5">
            {fieldRows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="absolute left-0 right-0 flex justify-center items-end"
                style={{
                  bottom: `${row.y}%`,
                  transform: `scale(${row.scale})`,
                  transformOrigin: 'bottom center',
                  gap: `${4 * row.scale}px`
                }}
              >
                {/* Tarla çizgisi */}
                <div 
                  className="absolute -bottom-2 left-0 right-0 h-px bg-amber-950 opacity-30"
                />

                {/* Buğday bitkileri - GRUP HALİNDE HAREKET */}
                {[...Array(row.plants)].map((_, plantIndex) => {
                  // Dalga efekti için offset
                  const waveOffset = (plantIndex / row.plants) * 2;
                  const fieldEmoji = getFieldEmoji();
                  
                  // Kışta null dönerse bitki gösterme
                  if (!fieldEmoji) return null;
                  
                  return (
                    <div
                      key={plantIndex}
                      className="flex flex-col items-center"
                    >
                      {/* Bitki başı */}
                      <div 
                        className="wheat-head-wave"
                        style={{
                          fontSize: `${28 * row.scale}px`,
                          animationDelay: `${waveOffset}s`,
                          filter: `drop-shadow(0 2px 3px rgba(0,0,0,0.3)) ${!isHealthy ? 'grayscale(0.3)' : ''}`,
                        }}
                      >
                        {fieldEmoji}
                      </div>
                      
                      {/* Sap - beraber sallanıyor (yalnızca ilkbahar ve yaz) */}
                      {(isSpring || isSummer) && (
                        <div 
                          className={`w-1 ${getPlantHeight()} wheat-stem-wave`}
                          style={{
                            backgroundColor: isSummer ? '#d97706' : getHealthColor(), // Yaz'da altın rengi
                            animationDelay: `${waveOffset}s`,
                            opacity: isHealthy ? 0.9 : isMedium ? 0.7 : 0.5
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
        
        {/* KIŞ: KAR EFEKTİ */}
        {isWinter && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Kar taneleri */}
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute text-white text-2xl animate-fall"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${-20 + Math.random() * 120}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`,
                  opacity: 0.6 + Math.random() * 0.4
                }}
              >
                ❄️
              </div>
            ))}
            
            {/* Kar örtüsü */}
            <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-white/80 via-white/50 to-transparent">
              <div className="absolute inset-0 flex items-end justify-center pb-4">
                <p className="text-sm font-bold text-slate-600 bg-white/70 px-4 py-2 rounded-full">
                  ❄️ BİTKİLER TOPRAK ALTINDA - VERNALİZASYON
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ÖN PLAN - Çim ve detaylar (Kışta yok!) */}
        {!isWinter && (
          <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none">
            {isHealthy && (isSpring || isSummer) && (
              <>
                {/* Yeşil çimler - sadece sağlıklı ilkbahar/yaz */}
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute bottom-0 text-2xl grass-wave"
                    style={{
                      left: `${i * 8}%`,
                      animationDelay: `${i * 0.1}s`,
                      opacity: 0.7
                    }}
                  >
                    🌿
                  </div>
                ))}
              </>
            )}
          </div>
        )}

      </div>

      {/* BİLGİ KARTLARI - MEVSIME GÖRE */}
      <div className="absolute top-4 left-4 bg-gradient-to-br from-white to-green-50 backdrop-blur-sm px-5 py-3 rounded-xl shadow-2xl border-2 border-green-300 z-20">
        <div className="flex items-center gap-3">
          <div className="text-4xl">
            {isWinter ? '❄️' : getFieldEmoji() || '🌱'}
          </div>
          <div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wide">
              {isWinter ? 'Kış Uykusu' : 'Tarla Durumu'}
            </div>
            <div className="text-lg font-bold" style={{ color: isWinter ? '#64748b' : getHealthColor() }}>
              {isWinter ? 'Toprak Altı' : 
               isAutumn ? 'Çimlenme' :
               isSpring ? (isHealthy ? 'Büyüyor' : isMedium ? 'Orta' : 'Zayıf') :
               isSummer ? 'Olgunlaşma' : 'Normal'}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-4 bg-gradient-to-br from-white to-blue-50 backdrop-blur-sm px-5 py-3 rounded-xl shadow-2xl border-2 border-blue-300 z-20">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{weather.icon}</div>
          <div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wide">Hava</div>
            <div className="text-lg font-bold text-gray-800">{weather.text}</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 bg-gradient-to-br from-green-600 to-green-700 text-white px-5 py-3 rounded-xl shadow-2xl z-20 border-2 border-green-400">
        <div className="flex items-center gap-3">
          <div className="text-3xl">📊</div>
          <div>
            <div className="text-xs opacity-90 uppercase tracking-wide font-semibold">Sağlık</div>
            <div className="text-2xl font-bold">{Math.round(cropHealth)}%</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 bg-gradient-to-br from-amber-600 to-amber-700 text-white px-5 py-3 rounded-xl shadow-2xl z-20 border-2 border-amber-400">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🗺️</div>
          <div>
            <div className="text-xs opacity-90 uppercase tracking-wide font-semibold">Bölge</div>
            <div className="text-sm font-bold">İç Anadolu</div>
          </div>
        </div>
      </div>

      {/* DURUM GÖSTERGELERİ - MEVSIME GÖRE */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex gap-3">
          {/* Kış mesajı */}
          {isWinter && (
            <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl">
              ❄️ VERNALİZASYON - BİTKİLER DİNLENİYOR
            </div>
          )}
          
          {/* Sonbahar */}
          {isAutumn && (
            <div className={`${isHealthy || isMedium ? 'bg-green-500' : 'bg-red-500'} text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl`}>
              {isHealthy || isMedium ? '🌱 ÇİMLENME BAŞARILI' : '⚠️ ÇİMLENME SORUNU'}
            </div>
          )}
          
          {/* İlkbahar - Kritik! */}
          {isSpring && (
            <>
              {isPoor && (
                <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse shadow-xl">
                  ⚠️ KRİTİK! BÜYÜME DURDU
                </div>
              )}
              {isMedium && (
                <div className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl">
                  ⚠️ BÜYÜME YAVAŞ
                </div>
              )}
              {isHealthy && (
                <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl">
                  ✓ GÜÇLÜ BÜYÜME
                </div>
              )}
            </>
          )}
          
          {/* Yaz - Hasat */}
          {isSummer && (
            <div className={`${isHealthy ? 'bg-yellow-500' : isMedium ? 'bg-orange-500' : 'bg-red-500'} text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl`}>
              {isHealthy ? '🌾 HASAT HAZIR!' : isMedium ? '⚠️ VERİM DÜŞÜK' : '❌ VERİM ÇOK DÜŞÜK'}
            </div>
          )}
        </div>
      </div>

      {/* CSS ANİMASYONLARI - SENKRONİZE */}
      <style>{`
        .perspective-field {
          perspective: 1500px;
          perspective-origin: 50% 20%;
        }

        /* Toprak deseni */
        .soil-pattern {
          background-image: 
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(0,0,0,0.05) 10px,
              rgba(0,0,0,0.05) 20px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 10px,
              rgba(0,0,0,0.05) 10px,
              rgba(0,0,0,0.05) 20px
            );
        }

        /* Çatlak çizgi animasyonu */
        .crack-line {
          animation: crack-appear 2s ease-out forwards;
        }

        @keyframes crack-appear {
          from { opacity: 0; transform: scaleY(0); }
          to { opacity: 0.6; transform: scaleY(1); }
        }

        /* BUĞDAY DALGA HAREKETİ - BERABER */
        @keyframes wheat-wave {
          0%, 100% { 
            transform: rotate(-4deg) translateX(-2px);
          }
          50% { 
            transform: rotate(4deg) translateX(2px);
          }
        }

        @keyframes stem-wave {
          0%, 100% { 
            transform: skewX(-2deg);
          }
          50% { 
            transform: skewX(2deg);
          }
        }

        .wheat-head-wave {
          animation: wheat-wave 3s ease-in-out infinite;
          transform-origin: bottom center;
          display: inline-block;
        }

        .wheat-stem-wave {
          animation: stem-wave 3s ease-in-out infinite;
          transform-origin: bottom;
        }

        /* Çim sallanma */
        @keyframes grass-wave {
          0%, 100% { 
            transform: rotate(-8deg) translateX(-3px);
          }
          50% { 
            transform: rotate(8deg) translateX(3px);
          }
        }

        .grass-wave {
          animation: grass-wave 2.5s ease-in-out infinite;
          transform-origin: bottom center;
        }

        /* Güneş parıltısı */
        .sun-pulse {
          animation: sun-pulse 4s ease-in-out infinite;
          filter: drop-shadow(0 0 30px rgba(251, 191, 36, 0.6));
        }

        @keyframes sun-pulse {
          0%, 100% { 
            transform: scale(1);
            filter: drop-shadow(0 0 30px rgba(251, 191, 36, 0.6));
          }
          50% { 
            transform: scale(1.05);
            filter: drop-shadow(0 0 50px rgba(251, 191, 36, 0.8));
          }
        }

        /* Bulut yüzme */
        @keyframes cloud-float {
          0%, 100% { 
            transform: translateX(0) translateY(0);
          }
          50% { 
            transform: translateX(20px) translateY(-10px);
          }
        }

        .cloud-float {
          animation: cloud-float 10s ease-in-out infinite;
        }

        /* Yağmur damlası */
        @keyframes rain-fall {
          0% { 
            transform: translateY(-20px);
            opacity: 1;
          }
          100% { 
            transform: translateY(600px);
            opacity: 0.3;
          }
        }

        .rain-drop {
          animation: rain-fall 1s linear infinite;
          font-size: 20px;
        }
      `}</style>
    </div>
  );
};

export default TurkeyMap;
