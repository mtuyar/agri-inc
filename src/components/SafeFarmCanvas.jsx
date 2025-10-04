import React, { useState, useEffect, useRef, useCallback } from 'react';

// Güvenli Canvas tabanlı oyun alanı
const SafeFarmCanvas = ({ 
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

  // Güvenli Canvas boyutları
  const CANVAS_WIDTH = isFullscreen ? Math.max(800, Math.min(2000, window.innerWidth - 20)) : 1200;
  const CANVAS_HEIGHT = isFullscreen ? Math.max(600, Math.min(1500, window.innerHeight - 150)) : 800;

  // Güvenli parçacık sistemi
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
      type: type
    };
  };

  // Parçacık güncelleme
  const updateParticles = () => {
    particlesRef.current = particlesRef.current.filter(particle => {
      particle.x = Math.max(0, Math.min(CANVAS_WIDTH, particle.x + particle.vx));
      particle.y = Math.max(0, Math.min(CANVAS_HEIGHT, particle.y + particle.vy));
      particle.vy += 0.2;
      particle.life -= particle.decay;
      particle.size = Math.max(0.1, particle.size * 0.98);
      return particle.life > 0 && particle.size > 0.1;
    });
  };

  // Güvenli çiftçi çizimi
  const drawFarmer = (ctx, frame) => {
    const { x, y } = farmerPosition;
    
    // Güvenli pozisyon kontrolü
    if (!isFinite(x) || !isFinite(y) || x < 0 || y < 0) return;
    
    // Gölge
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(x + 20, y + 35, 15, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Çiftçi çizimi
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
    
    // Kollar
    const armOffset = isMoving ? Math.sin(frame * 0.3) * 3 : 0;
    ctx.fillStyle = '#fdbcb4';
    ctx.fillRect(x + 8, y + 22 + armOffset, 4, 12);
    ctx.fillRect(x + 28, y + 22 - armOffset, 4, 12);
    
    // Bacaklar
    const legOffset = isMoving ? Math.sin(frame * 0.3 + Math.PI) * 2 : 0;
    ctx.fillStyle = '#2c5282';
    ctx.fillRect(x + 14, y + 40 + legOffset, 4, 12);
    ctx.fillRect(x + 22, y + 40 - legOffset, 4, 12);
    
    ctx.restore();

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

  // Güvenli tarla çizimi
  const drawField = (ctx, field, frame) => {
    const { x, y, state, cropType, quality } = field;
    const isNearby = field.id === nearbyFieldId;
    
    // Güvenli pozisyon kontrolü
    if (!isFinite(x) || !isFinite(y) || x < 0 || y < 0) return;
    
    ctx.save();
    
    // Yakınlık efekti
    if (isNearby) {
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 20;
    }
    
    // Duruma göre renk
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
    ctx.fillRect(x, y, 80, 80);
    
    // Kenar çizgisi
    ctx.strokeStyle = isNearby ? '#10b981' : '#4b5563';
    ctx.lineWidth = isNearby ? 4 : 2;
    ctx.strokeRect(x, y, 80, 80);
    
    // Duruma göre içerik
    ctx.font = '28px Arial';
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
        ctx.font = '20px Arial';
        ctx.fillText(cropEmoji, x + 60, y + 20);
      }
    }
    
    // Kalite göstergesi
    if (quality > 1.0) {
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 12px Arial';
      ctx.fillText('⭐', x + 70, y + 70);
    }
    
    // Büyüme çubuğu
    if (state === 'growing' || state === 'flowering') {
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(x + 5, y + 75, 70, 3);
      
      const progress = Math.min(field.growthTime / field.maxGrowthTime, 1);
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(x + 5, y + 75, 70 * progress, 3);
    }
    
    ctx.restore();
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
    
    // Arka plan gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#86efac');
    gradient.addColorStop(0.5, '#22c55e');
    gradient.addColorStop(1, '#16a34a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Bulutlar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 3; i++) {
      const cloudX = (frame * 0.05 + i * 200) % (CANVAS_WIDTH + 100) - 50;
      const cloudY = 50 + i * 50;
      
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
    if (!isFinite(x) || !isFinite(y)) return;
    
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
    const interval = setInterval(updateParticles, 16);
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
      
      {/* Tam ekran butonu */}
      <button
        onClick={onToggleFullscreen}
        className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg font-bold"
      >
        {isFullscreen ? '📱 Küçült' : '🖥️ Tam Ekran'}
      </button>
      
      {/* Kontrol bilgisi */}
      <div className="absolute top-4 left-4 bg-gradient-to-r from-black to-gray-800 text-white px-6 py-3 rounded-xl shadow-lg">
        <div className="text-sm font-bold">🎮 Kontroller</div>
        <div className="text-xs">WASD: Hareket | Space: Eylem | E: Ekipman</div>
      </div>
    </div>
  );
};

export default SafeFarmCanvas;
