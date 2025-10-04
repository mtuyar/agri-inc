import React, { useState, useEffect, useRef, useCallback } from 'react';

// Süper şık Canvas tabanlı oyun alanı
const SuperStylishFarmCanvas = ({ 
  farmerPosition, 
  farmerDirection, 
  isMoving, 
  currentAction,
  fields,
  onFieldAction,
  nearbyFieldId,
  equipment,
  weather,
  season,
  isFullscreen,
  onToggleFullscreen
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const weatherParticlesRef = useRef([]);

  // Canvas boyutları - güvenli değerler
  const CANVAS_WIDTH = isFullscreen ? Math.max(800, window.innerWidth - 20) : 1200;
  const CANVAS_HEIGHT = isFullscreen ? Math.max(600, window.innerHeight - 150) : 800;

  // Süper şık parçacık sistemi
  const createParticle = (x, y, type) => {
    const colors = {
      planting: '#10b981',
      watering: '#3b82f6', 
      fertilizing: '#f59e0b',
      harvesting: '#ef4444',
      plowing: '#8b4513',
      seeding: '#059669'
    };
    
    return {
      x: Math.max(0, Math.min(CANVAS_WIDTH, x + (Math.random() - 0.5) * 40)),
      y: Math.max(0, Math.min(CANVAS_HEIGHT, y + (Math.random() - 0.5) * 40)),
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8 - 4,
      life: 1.0,
      decay: 0.02,
      size: Math.max(1, Math.random() * 12 + 6),
      color: colors[type] || '#10b981',
      type: type,
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 0.2
    };
  };

  // Hava durumu parçacıkları
  const createWeatherParticle = (type) => {
    const particles = {
      rain: {
        x: Math.max(0, Math.random() * CANVAS_WIDTH),
        y: -10,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 6 + 3,
        life: 1.0,
        decay: 0.01,
        size: Math.max(1, Math.random() * 3 + 1),
        color: '#60a5fa',
        type: 'rain'
      },
      snow: {
        x: Math.max(0, Math.random() * CANVAS_WIDTH),
        y: -10,
        vx: Math.random() * 3 - 1.5,
        vy: Math.random() * 2 + 1,
        life: 1.0,
        decay: 0.005,
        size: Math.max(1, Math.random() * 4 + 2),
        color: '#ffffff',
        type: 'snow'
      },
      sunbeam: {
        x: Math.max(0, Math.random() * CANVAS_WIDTH),
        y: Math.max(0, Math.random() * CANVAS_HEIGHT * 0.3),
        vx: 0,
        vy: 0,
        life: 1.0,
        decay: 0.003,
        size: Math.max(1, Math.random() * 30 + 15),
        color: '#fbbf24',
        type: 'sunbeam'
      }
    };
    return particles[type] || particles.rain;
  };

  // Parçacık güncelleme
  const updateParticles = () => {
    particlesRef.current = particlesRef.current.filter(particle => {
      particle.x = Math.max(0, Math.min(CANVAS_WIDTH, particle.x + particle.vx));
      particle.y = Math.max(0, Math.min(CANVAS_HEIGHT, particle.y + particle.vy));
      particle.vy += 0.2; // Gravity
      particle.life -= particle.decay;
      particle.size = Math.max(0.1, particle.size * 0.98);
      particle.rotation += particle.rotationSpeed;
      return particle.life > 0 && particle.size > 0.1;
    });
  };

  // Hava durumu parçacıklarını güncelle
  const updateWeatherParticles = () => {
    // Yağmur/snow ekle
    if (weather === 'rain' && Math.random() < 0.4) {
      weatherParticlesRef.current.push(createWeatherParticle('rain'));
    }
    if (weather === 'snow' && Math.random() < 0.3) {
      weatherParticlesRef.current.push(createWeatherParticle('snow'));
    }
    if (weather === 'sunny' && Math.random() < 0.15) {
      weatherParticlesRef.current.push(createWeatherParticle('sunbeam'));
    }

    // Parçacıkları güncelle
    weatherParticlesRef.current = weatherParticlesRef.current.filter(particle => {
      particle.x = Math.max(0, Math.min(CANVAS_WIDTH, particle.x + particle.vx));
      particle.y = Math.max(0, Math.min(CANVAS_HEIGHT, particle.y + particle.vy));
      particle.life -= particle.decay;
      
      if (particle.type === 'rain' || particle.type === 'snow') {
        if (particle.y > CANVAS_HEIGHT) {
          particle.y = -10;
          particle.x = Math.max(0, Math.random() * CANVAS_WIDTH);
        }
      }
      
      return particle.life > 0;
    });
  };

  // Süper şık çiftçi çizimi
  const drawFarmer = (ctx, frame) => {
    const { x, y } = farmerPosition;
    
    // Güvenli pozisyon kontrolü
    if (!isFinite(x) || !isFinite(y)) return;
    
    // Gölge efekti
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(x + 25, y + 45, 25, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Ekipman çizimi
    if (equipment === 'tractor') {
      // Süper şık traktör
      ctx.save();
      if (farmerDirection === 'left') {
        ctx.scale(-1, 1);
        ctx.translate(-x - 100, 0);
      }
      
      // Traktör gövdesi - gradient
      const gradient = ctx.createLinearGradient(x - 30, y + 10, x + 70, y + 40);
      gradient.addColorStop(0, '#dc2626');
      gradient.addColorStop(1, '#991b1b');
      ctx.fillStyle = gradient;
      ctx.fillRect(x - 30, y + 10, 100, 35);
      
      // Tekerlekler - 3D efekt
      ctx.fillStyle = '#1f2937';
      ctx.beginPath();
      ctx.arc(x - 15, y + 50, 12, 0, Math.PI * 2);
      ctx.arc(x + 45, y + 50, 12, 0, Math.PI * 2);
      ctx.fill();
      
      // Tekerlek detayları
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x - 15, y + 50, 8, 0, Math.PI * 2);
      ctx.arc(x + 45, y + 50, 8, 0, Math.PI * 2);
      ctx.stroke();
      
      // Kabin - cam efekti
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(x - 5, y + 5, 35, 25);
      
      // Cam
      ctx.fillStyle = '#0ea5e9';
      ctx.globalAlpha = 0.3;
      ctx.fillRect(x - 2, y + 8, 29, 19);
      ctx.globalAlpha = 1;
      
      ctx.restore();
    } else if (equipment === 'harvester') {
      // Süper şık biçerdöver
      ctx.save();
      if (farmerDirection === 'left') {
        ctx.scale(-1, 1);
        ctx.translate(-x - 120, 0);
      }
      
      // Biçerdöver gövdesi - gradient
      const gradient = ctx.createLinearGradient(x - 40, y + 5, x + 80, y + 40);
      gradient.addColorStop(0, '#f59e0b');
      gradient.addColorStop(1, '#d97706');
      ctx.fillStyle = gradient;
      ctx.fillRect(x - 40, y + 5, 120, 40);
      
      // Tekerlekler
      ctx.fillStyle = '#1f2937';
      ctx.beginPath();
      ctx.arc(x - 25, y + 50, 15, 0, Math.PI * 2);
      ctx.arc(x + 50, y + 50, 15, 0, Math.PI * 2);
      ctx.fill();
      
      // Kabin
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(x - 15, y, 40, 30);
      
      // Cam
      ctx.fillStyle = '#0ea5e9';
      ctx.globalAlpha = 0.3;
      ctx.fillRect(x - 12, y + 3, 34, 24);
      ctx.globalAlpha = 1;
      
      ctx.restore();
    } else {
      // Süper şık çiftçi
      ctx.save();
      if (farmerDirection === 'left') {
        ctx.scale(-1, 1);
        ctx.translate(-x - 50, 0);
      }
      
      // Şapka - gradient
      const hatGradient = ctx.createRadialGradient(x + 25, y + 8, 0, x + 25, y + 8, 15);
      hatGradient.addColorStop(0, '#a3a3a3');
      hatGradient.addColorStop(1, '#525252');
      ctx.fillStyle = hatGradient;
      ctx.beginPath();
      ctx.arc(x + 25, y + 8, 15, 0, Math.PI * 2);
      ctx.fill();
      
      // Yüz - gradient
      const faceGradient = ctx.createRadialGradient(x + 25, y + 20, 0, x + 25, y + 20, 12);
      faceGradient.addColorStop(0, '#fecaca');
      faceGradient.addColorStop(1, '#f87171');
      ctx.fillStyle = faceGradient;
      ctx.beginPath();
      ctx.arc(x + 25, y + 20, 12, 0, Math.PI * 2);
      ctx.fill();
      
      // Gözler
      ctx.fillStyle = '#1f2937';
      ctx.beginPath();
      ctx.arc(x + 21, y + 18, 2.5, 0, Math.PI * 2);
      ctx.arc(x + 29, y + 18, 2.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Göz parıltısı
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x + 21.5, y + 17.5, 1, 0, Math.PI * 2);
      ctx.arc(x + 29.5, y + 17.5, 1, 0, Math.PI * 2);
      ctx.fill();
      
      // Gülümseme
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x + 25, y + 23, 5, 0, Math.PI);
      ctx.stroke();
      
      // Vücut - gradient
      const bodyGradient = ctx.createLinearGradient(x + 15, y + 25, x + 35, y + 50);
      bodyGradient.addColorStop(0, '#3b82f6');
      bodyGradient.addColorStop(1, '#1d4ed8');
      ctx.fillStyle = bodyGradient;
      ctx.fillRect(x + 15, y + 25, 20, 30);
      
      // Kollar - hareket animasyonu
      const armOffset = isMoving ? Math.sin(frame * 0.4) * 4 : 0;
      const armGradient = ctx.createRadialGradient(x + 10, y + 30, 0, x + 10, y + 30, 6);
      armGradient.addColorStop(0, '#fecaca');
      armGradient.addColorStop(1, '#f87171');
      ctx.fillStyle = armGradient;
      ctx.fillRect(x + 8, y + 27 + armOffset, 6, 15);
      ctx.fillRect(x + 36, y + 27 - armOffset, 6, 15);
      
      // Bacaklar - hareket animasyonu
      const legOffset = isMoving ? Math.sin(frame * 0.4 + Math.PI) * 3 : 0;
      const legGradient = ctx.createLinearGradient(x + 18, y + 55, x + 22, y + 70);
      legGradient.addColorStop(0, '#1e40af');
      legGradient.addColorStop(1, '#1e3a8a');
      ctx.fillStyle = legGradient;
      ctx.fillRect(x + 18, y + 55 + legOffset, 6, 18);
      ctx.fillRect(x + 26, y + 55 - legOffset, 6, 18);
      
      ctx.restore();
    }

    // Süper şık eylem efekti
    if (currentAction) {
      const effectY = y - 30;
      ctx.save();
      ctx.globalAlpha = 0.9;
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      
      const emojis = {
        planting: '🌱',
        watering: '💧',
        fertilizing: '🌿',
        harvesting: '🌾',
        plowing: '🚜',
        seeding: '🌰'
      };
      
      const emoji = emojis[currentAction];
      if (emoji) {
        ctx.strokeText(emoji, x + 5, effectY);
        ctx.fillText(emoji, x + 5, effectY);
      }
      ctx.restore();
    }
  };

  // Süper şık tarla çizimi
  const drawField = (ctx, field, frame) => {
    const { x, y, state, cropType, quality } = field;
    const isNearby = field.id === nearbyFieldId;
    
    // Güvenli pozisyon kontrolü
    if (!isFinite(x) || !isFinite(y)) return;
    
    ctx.save();
    
    // Yakınlık efekti - glow
    if (isNearby) {
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 25;
    }
    
    // Duruma göre gradient renkler
    const fieldStyles = {
      empty: { 
        gradient: ['#8b7355', '#6b5b47'], 
        pattern: '🟫',
        glow: '#8b7355'
      },
      plowed: { 
        gradient: ['#a3a3a3', '#737373'], 
        pattern: '🟤',
        glow: '#a3a3a3'
      },
      planted: { 
        gradient: ['#a3e635', '#84cc16'], 
        pattern: '🌱',
        glow: '#a3e635'
      },
      growing: { 
        gradient: ['#22c55e', '#16a34a'], 
        pattern: '🌿',
        glow: '#22c55e'
      },
      flowering: { 
        gradient: ['#fbbf24', '#f59e0b'], 
        pattern: '🌸',
        glow: '#fbbf24'
      },
      ready: { 
        gradient: ['#f59e0b', '#d97706'], 
        pattern: '🌾',
        glow: '#f59e0b'
      },
      harvested: { 
        gradient: ['#6b7280', '#4b5563'], 
        pattern: '📦',
        glow: '#6b7280'
      }
    };
    
    const style = fieldStyles[state] || fieldStyles.empty;
    
    // Tarla arka planı - gradient
    const fieldGradient = ctx.createLinearGradient(x, y, x + 80, y + 80);
    fieldGradient.addColorStop(0, style.gradient[0]);
    fieldGradient.addColorStop(1, style.gradient[1]);
    ctx.fillStyle = fieldGradient;
    ctx.fillRect(x, y, 80, 80);
    
    // Kenar çizgisi - gradient
    const borderGradient = ctx.createLinearGradient(x, y, x + 80, y + 80);
    borderGradient.addColorStop(0, isNearby ? '#10b981' : '#4b5563');
    borderGradient.addColorStop(1, isNearby ? '#059669' : '#374151');
    ctx.strokeStyle = borderGradient;
    ctx.lineWidth = isNearby ? 5 : 2;
    ctx.strokeRect(x, y, 80, 80);
    
    // Duruma göre içerik
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const emoji = style.pattern;
    if (emoji) {
      ctx.fillText(emoji, x + 40, y + 40);
    }
    
    // Bitki türü göstergesi
    if (state !== 'empty' && state !== 'harvested') {
      const cropEmojis = {
        wheat: '🌾',
        corn: '🌽',
        tomato: '🍅',
        potato: '🥔',
        carrot: '🥕'
      };
      
      const cropEmoji = cropEmojis[cropType];
      if (cropEmoji) {
        ctx.font = '24px Arial';
        ctx.fillText(cropEmoji, x + 60, y + 20);
      }
    }
    
    // Kalite göstergesi
    if (quality > 1.0) {
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 16px Arial';
      ctx.fillText('⭐', x + 70, y + 70);
    }
    
    // Büyüme çubuğu - gradient
    if (state === 'growing' || state === 'flowering') {
      const progressGradient = ctx.createLinearGradient(x + 5, y + 75, x + 75, y + 75);
      progressGradient.addColorStop(0, '#22c55e');
      progressGradient.addColorStop(1, '#16a34a');
      ctx.fillStyle = progressGradient;
      ctx.fillRect(x + 5, y + 75, 70, 4);
      
      const progress = Math.min(field.growthTime / field.maxGrowthTime, 1);
      const fillGradient = ctx.createLinearGradient(x + 5, y + 75, x + 5 + 70 * progress, y + 75);
      fillGradient.addColorStop(0, '#10b981');
      fillGradient.addColorStop(1, '#059669');
      ctx.fillStyle = fillGradient;
      ctx.fillRect(x + 5, y + 75, 70 * progress, 4);
    }
    
    ctx.restore();
  };

  // Hava durumu çizimi
  const drawWeather = (ctx) => {
    // Arka plan efekti
    if (weather === 'rain') {
      const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.3)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    } else if (weather === 'snow') {
      const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.3)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    } else if (weather === 'sunny') {
      const gradient = ctx.createRadialGradient(CANVAS_WIDTH/2, 0, 0, CANVAS_WIDTH/2, 0, CANVAS_HEIGHT);
      gradient.addColorStop(0, 'rgba(251, 191, 36, 0.1)');
      gradient.addColorStop(1, 'rgba(251, 191, 36, 0.05)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    // Hava durumu parçacıkları
    weatherParticlesRef.current.forEach(particle => {
      ctx.save();
      ctx.globalAlpha = particle.life;
      ctx.fillStyle = particle.color;
      
      if (particle.type === 'sunbeam') {
        ctx.globalAlpha *= 0.4;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    });
  };

  // Süper şık parçacık çizimi
  const drawParticles = (ctx) => {
    particlesRef.current.forEach(particle => {
      ctx.save();
      ctx.globalAlpha = particle.life;
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      
      // Gradient parçacık
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size);
      gradient.addColorStop(0, particle.color);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    });
  };

  // Ana çizim fonksiyonu
  const draw = useCallback((frame) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Temizle
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Süper şık arka plan gradient (mevsim bazlı)
    const seasonGradients = {
      spring: ['#86efac', '#22c55e', '#16a34a'],
      summer: ['#fde047', '#eab308', '#ca8a04'],
      autumn: ['#fb923c', '#ea580c', '#c2410c'],
      winter: ['#e0e7ff', '#a5b4fc', '#6366f1']
    };
    
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    const colors = seasonGradients[season] || seasonGradients.spring;
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.5, colors[1]);
    gradient.addColorStop(1, colors[2]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Hava durumu
    drawWeather(ctx);
    
    // Süper şık bulutlar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    for (let i = 0; i < 5; i++) {
      const cloudX = (frame * 0.03 + i * 200) % (CANVAS_WIDTH + 100) - 50;
      const cloudY = 50 + i * 50;
      
      ctx.beginPath();
      ctx.arc(cloudX, cloudY, 30, 0, Math.PI * 2);
      ctx.arc(cloudX + 35, cloudY, 35, 0, Math.PI * 2);
      ctx.arc(cloudX + 70, cloudY, 30, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Tarlalar
    fields.forEach(field => drawField(ctx, field, frame));
    
    // Parçacıklar
    drawParticles(ctx);
    
    // Çiftçi
    drawFarmer(ctx, frame);
    
    // Animasyon devam et
    animationRef.current = requestAnimationFrame(() => draw(frame + 1));
  }, [farmerPosition, farmerDirection, isMoving, currentAction, fields, nearbyFieldId, equipment, weather, season, CANVAS_WIDTH, CANVAS_HEIGHT]);

  // Eylem efekti ekle
  const addActionEffect = (actionType) => {
    const { x, y } = farmerPosition;
    for (let i = 0; i < 20; i++) {
      particlesRef.current.push(createParticle(x + 25, y, actionType));
    }
  };

  // Canvas başlatma
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Güvenli boyutlar
    const safeWidth = Math.max(800, Math.min(2000, CANVAS_WIDTH));
    const safeHeight = Math.max(600, Math.min(1500, CANVAS_HEIGHT));
    
    canvas.width = safeWidth;
    canvas.height = safeHeight;
    
    draw(0);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [draw]);

  // Parçacık güncelleme
  useEffect(() => {
    const interval = setInterval(() => {
      updateParticles();
      updateWeatherParticles();
    }, 16);
    return () => clearInterval(interval);
  }, []);

  // Eylem efekti
  useEffect(() => {
    if (currentAction) {
      addActionEffect(currentAction);
    }
  }, [currentAction]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="rounded-3xl shadow-2xl border-4 border-green-300"
        style={{ width: '100%', maxWidth: '1200px', height: 'auto' }}
      />
      
      {/* Süper şık tam ekran butonu */}
      <button
        onClick={onToggleFullscreen}
        className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg font-bold"
      >
        {isFullscreen ? '📱 Küçült' : '🖥️ Tam Ekran'}
      </button>
      
      {/* Süper şık kontrol bilgisi */}
      <div className="absolute top-4 left-4 bg-gradient-to-r from-black to-gray-800 text-white px-6 py-3 rounded-xl shadow-lg">
        <div className="text-sm font-bold">🎮 Kontroller</div>
        <div className="text-xs">WASD: Hareket | Space: Eylem | E: Ekipman</div>
      </div>
    </div>
  );
};

export default SuperStylishFarmCanvas;
