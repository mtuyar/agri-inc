import React, { useState, useEffect, useRef, useCallback } from 'react';

// Gelişmiş Canvas tabanlı oyun alanı
const EnhancedFarmCanvas = ({ 
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

  // Canvas boyutları
  const CANVAS_WIDTH = isFullscreen ? window.innerWidth - 40 : 1000;
  const CANVAS_HEIGHT = isFullscreen ? window.innerHeight - 200 : 700;

  // Hava durumu efektleri
  const createWeatherParticle = (type) => {
    const particles = {
      rain: {
        x: Math.random() * CANVAS_WIDTH,
        y: -10,
        vx: 0,
        vy: Math.random() * 8 + 4,
        life: 1.0,
        decay: 0.02,
        size: Math.random() * 2 + 1,
        color: '#3b82f6',
        type: 'rain'
      },
      snow: {
        x: Math.random() * CANVAS_WIDTH,
        y: -10,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 3 + 1,
        life: 1.0,
        decay: 0.01,
        size: Math.random() * 3 + 2,
        color: '#ffffff',
        type: 'snow'
      },
      sunbeam: {
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT,
        vx: 0,
        vy: 0,
        life: 1.0,
        decay: 0.005,
        size: Math.random() * 20 + 10,
        color: '#fbbf24',
        type: 'sunbeam'
      }
    };
    return particles[type] || particles.rain;
  };

  // Parçacık sistemi
  const createParticle = (x, y, type) => {
    const colors = {
      planting: '#22c55e',
      watering: '#3b82f6', 
      fertilizing: '#f59e0b',
      harvesting: '#ef4444',
      plowing: '#8b4513',
      seeding: '#10b981'
    };
    
    return {
      x: x + (Math.random() - 0.5) * 30,
      y: y + (Math.random() - 0.5) * 30,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6 - 3,
      life: 1.0,
      decay: 0.015,
      size: Math.random() * 10 + 5,
      color: colors[type] || '#22c55e',
      type: type
    };
  };

  // Hava durumu parçacıklarını güncelle
  const updateWeatherParticles = () => {
    // Yağmur/snow ekle
    if (weather === 'rain' && Math.random() < 0.3) {
      weatherParticlesRef.current.push(createWeatherParticle('rain'));
    }
    if (weather === 'snow' && Math.random() < 0.2) {
      weatherParticlesRef.current.push(createWeatherParticle('snow'));
    }
    if (weather === 'sunny' && Math.random() < 0.1) {
      weatherParticlesRef.current.push(createWeatherParticle('sunbeam'));
    }

    // Parçacıkları güncelle
    weatherParticlesRef.current = weatherParticlesRef.current.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= particle.decay;
      
      if (particle.type === 'rain' || particle.type === 'snow') {
        if (particle.y > CANVAS_HEIGHT) {
          particle.y = -10;
          particle.x = Math.random() * CANVAS_WIDTH;
        }
      }
      
      return particle.life > 0;
    });
  };

  // Parçacık güncelleme
  const updateParticles = () => {
    particlesRef.current = particlesRef.current.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.15; // Gravity
      particle.life -= particle.decay;
      particle.size *= 0.97;
      return particle.life > 0;
    });
  };

  // Çiftçi ve ekipman çizimi
  const drawFarmer = (ctx, frame) => {
    const { x, y } = farmerPosition;
    
    // Gölge
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(x + 20, y + 35, 18, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Ekipman çizimi
    if (equipment === 'tractor') {
      // Traktör
      ctx.save();
      if (farmerDirection === 'left') {
        ctx.scale(-1, 1);
        ctx.translate(-x - 80, 0);
      }
      
      // Traktör gövdesi
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(x - 20, y + 15, 60, 25);
      
      // Tekerlekler
      ctx.fillStyle = '#374151';
      ctx.beginPath();
      ctx.arc(x - 10, y + 40, 8, 0, Math.PI * 2);
      ctx.arc(x + 30, y + 40, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Kabin
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(x, y + 5, 25, 20);
      
      ctx.restore();
    } else if (equipment === 'harvester') {
      // Biçerdöver
      ctx.save();
      if (farmerDirection === 'left') {
        ctx.scale(-1, 1);
        ctx.translate(-x - 100, 0);
      }
      
      // Biçerdöver gövdesi
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(x - 30, y + 10, 80, 30);
      
      // Tekerlekler
      ctx.fillStyle = '#374151';
      ctx.beginPath();
      ctx.arc(x - 20, y + 40, 10, 0, Math.PI * 2);
      ctx.arc(x + 40, y + 40, 10, 0, Math.PI * 2);
      ctx.fill();
      
      // Kabin
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(x - 10, y, 30, 25);
      
      ctx.restore();
    } else {
      // Normal çiftçi
      ctx.save();
      if (farmerDirection === 'left') {
        ctx.scale(-1, 1);
        ctx.translate(-x - 40, 0);
      }
      
      // Şapka
      ctx.fillStyle = '#8b4513';
      ctx.beginPath();
      ctx.arc(x + 20, y + 8, 12, 0, Math.PI * 2);
      ctx.fill();
      
      // Yüz
      ctx.fillStyle = '#fdbcb4';
      ctx.beginPath();
      ctx.arc(x + 20, y + 15, 10, 0, Math.PI * 2);
      ctx.fill();
      
      // Gözler
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(x + 17, y + 13, 2, 0, Math.PI * 2);
      ctx.arc(x + 23, y + 13, 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Gülümseme
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x + 20, y + 18, 4, 0, Math.PI);
      ctx.stroke();
      
      // Vücut
      ctx.fillStyle = '#4a90e2';
      ctx.fillRect(x + 12, y + 20, 16, 20);
      
      // Kollar (hareket animasyonu)
      const armOffset = isMoving ? Math.sin(frame * 0.3) * 3 : 0;
      ctx.fillStyle = '#fdbcb4';
      ctx.fillRect(x + 8, y + 22 + armOffset, 4, 12);
      ctx.fillRect(x + 28, y + 22 - armOffset, 4, 12);
      
      // Bacaklar (hareket animasyonu)
      const legOffset = isMoving ? Math.sin(frame * 0.3 + Math.PI) * 2 : 0;
      ctx.fillStyle = '#2c5282';
      ctx.fillRect(x + 14, y + 40 + legOffset, 4, 12);
      ctx.fillRect(x + 22, y + 40 - legOffset, 4, 12);
      
      ctx.restore();
    }

    // Eylem efekti
    if (currentAction) {
      const effectY = y - 25;
      ctx.save();
      ctx.globalAlpha = 0.9;
      ctx.font = 'bold 20px Arial';
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      
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

  // Gelişmiş tarla çizimi
  const drawField = (ctx, field, frame) => {
    const { x, y, state, cropType, quality } = field;
    const isNearby = field.id === nearbyFieldId;
    
    // Tarla arka planı
    ctx.save();
    
    // Yakınlık efekti
    if (isNearby) {
      ctx.shadowColor = '#22c55e';
      ctx.shadowBlur = 20;
    }
    
    // Duruma göre renk ve doku
    const fieldStyles = {
      empty: { color: '#8b7355', pattern: '🟫' },
      plowed: { color: '#a3a3a3', pattern: '🟤' },
      planted: { color: '#a3e635', pattern: '🌱' },
      growing: { color: '#22c55e', pattern: '🌿' },
      flowering: { color: '#fbbf24', pattern: '🌸' },
      ready: { color: '#f59e0b', pattern: '🌾' },
      harvested: { color: '#6b7280', pattern: '📦' }
    };
    
    const style = fieldStyles[state] || fieldStyles.empty;
    
    // Tarla arka planı
    ctx.fillStyle = style.color;
    ctx.fillRect(x, y, 70, 70);
    
    // Kenar çizgisi
    ctx.strokeStyle = isNearby ? '#22c55e' : '#4b5563';
    ctx.lineWidth = isNearby ? 4 : 2;
    ctx.strokeRect(x, y, 70, 70);
    
    // Duruma göre içerik
    ctx.font = '28px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const emoji = style.pattern;
    if (emoji) {
      ctx.fillText(emoji, x + 35, y + 35);
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
        ctx.font = '20px Arial';
        ctx.fillText(cropEmoji, x + 50, y + 15);
      }
    }
    
    // Kalite göstergesi
    if (quality > 1.0) {
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 12px Arial';
      ctx.fillText('⭐', x + 60, y + 60);
    }
    
    // Büyüme çubuğu
    if (state === 'growing' || state === 'flowering') {
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(x + 5, y + 65, 60, 3);
      
      ctx.fillStyle = '#16a34a';
      const progress = Math.min(field.growthTime / field.maxGrowthTime, 1);
      ctx.fillRect(x + 5, y + 65, 60 * progress, 3);
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
        ctx.globalAlpha *= 0.3;
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

  // Parçacık çizimi
  const drawParticles = (ctx) => {
    particlesRef.current.forEach(particle => {
      ctx.save();
      ctx.globalAlpha = particle.life;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
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
    
    // Arka plan gradient (mevsim bazlı)
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
    
    // Bulutlar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 4; i++) {
      const cloudX = (frame * 0.05 + i * 200) % (CANVAS_WIDTH + 100) - 50;
      const cloudY = 50 + i * 40;
      
      ctx.beginPath();
      ctx.arc(cloudX, cloudY, 25, 0, Math.PI * 2);
      ctx.arc(cloudX + 30, cloudY, 30, 0, Math.PI * 2);
      ctx.arc(cloudX + 60, cloudY, 25, 0, Math.PI * 2);
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
    for (let i = 0; i < 15; i++) {
      particlesRef.current.push(createParticle(x + 20, y, actionType));
    }
  };

  // Canvas başlatma
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    
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
        className="rounded-2xl shadow-2xl border-4 border-green-300"
        style={{ width: '100%', maxWidth: '1000px', height: 'auto' }}
      />
      
      {/* Tam ekran butonu */}
      <button
        onClick={onToggleFullscreen}
        className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all"
      >
        {isFullscreen ? '📱 Küçült' : '🖥️ Tam Ekran'}
      </button>
      
      {/* Kontrol bilgisi */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg">
        <div className="text-sm font-semibold">🎮 Kontroller</div>
        <div className="text-xs">WASD: Hareket | Space: Eylem | E: Ekipman</div>
      </div>
    </div>
  );
};

export default EnhancedFarmCanvas;
