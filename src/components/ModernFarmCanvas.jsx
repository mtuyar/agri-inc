import React, { useState, useEffect, useRef, useCallback } from 'react';

// Modern Canvas tabanlı oyun alanı
const ModernFarmCanvas = ({ 
  farmerPosition, 
  farmerDirection, 
  isMoving, 
  currentAction,
  fields,
  onFieldAction,
  nearbyFieldId 
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  // Canvas boyutları
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;

  // Parçacık sistemi
  const createParticle = (x, y, type) => {
    const colors = {
      planting: '#22c55e',
      watering: '#3b82f6', 
      fertilizing: '#f59e0b',
      harvesting: '#ef4444'
    };
    
    return {
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 20,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4 - 2,
      life: 1.0,
      decay: 0.02,
      size: Math.random() * 8 + 4,
      color: colors[type] || '#22c55e',
      type: type
    };
  };

  // Parçacık güncelleme
  const updateParticles = () => {
    particlesRef.current = particlesRef.current.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.1; // Gravity
      particle.life -= particle.decay;
      particle.size *= 0.98;
      return particle.life > 0;
    });
  };

  // Çiftçi animasyonu
  const drawFarmer = (ctx, frame) => {
    const { x, y } = farmerPosition;
    
    // Gölge
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(x + 20, y + 35, 15, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Çiftçi gövdesi
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

    // Eylem efekti
    if (currentAction) {
      const effectY = y - 20;
      ctx.save();
      ctx.globalAlpha = 0.8;
      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      
      const emojis = {
        planting: '🌱',
        watering: '💧',
        fertilizing: '🌿',
        harvesting: '🌾'
      };
      
      const emoji = emojis[currentAction];
      if (emoji) {
        ctx.strokeText(emoji, x + 5, effectY);
        ctx.fillText(emoji, x + 5, effectY);
      }
      ctx.restore();
    }
  };

  // Tarla çizimi
  const drawField = (ctx, field, frame) => {
    const { x, y, state } = field;
    const isNearby = field.id === nearbyFieldId;
    
    // Tarla arka planı
    ctx.save();
    
    // Yakınlık efekti
    if (isNearby) {
      ctx.shadowColor = '#22c55e';
      ctx.shadowBlur = 15;
    }
    
    // Duruma göre renk
    const colors = {
      empty: '#8b7355',
      planted: '#a3e635',
      growing: '#22c55e',
      ready: '#f59e0b',
      harvested: '#6b7280'
    };
    
    ctx.fillStyle = colors[state] || colors.empty;
    ctx.fillRect(x, y, 60, 60);
    
    // Kenar çizgisi
    ctx.strokeStyle = isNearby ? '#22c55e' : '#4b5563';
    ctx.lineWidth = isNearby ? 3 : 1;
    ctx.strokeRect(x, y, 60, 60);
    
    // Duruma göre içerik
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const emojis = {
      empty: '🟫',
      planted: '🌱',
      growing: '🌿',
      ready: '🌾',
      harvested: '📦'
    };
    
    const emoji = emojis[state];
    if (emoji) {
      ctx.fillText(emoji, x + 30, y + 30);
    }
    
    // Büyüme çubuğu
    if (state === 'growing') {
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(x + 5, y + 55, 50, 3);
      
      ctx.fillStyle = '#16a34a';
      const progress = Math.min(field.growthTime / field.maxGrowthTime, 1);
      ctx.fillRect(x + 5, y + 55, 50 * progress, 3);
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
    gradient.addColorStop(1, '#22c55e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Bulutlar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 3; i++) {
      const cloudX = (frame * 0.1 + i * 200) % (CANVAS_WIDTH + 100) - 50;
      const cloudY = 50 + i * 30;
      
      ctx.beginPath();
      ctx.arc(cloudX, cloudY, 20, 0, Math.PI * 2);
      ctx.arc(cloudX + 25, cloudY, 25, 0, Math.PI * 2);
      ctx.arc(cloudX + 50, cloudY, 20, 0, Math.PI * 2);
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
  }, [farmerPosition, farmerDirection, isMoving, currentAction, fields, nearbyFieldId]);

  // Eylem efekti ekle
  const addActionEffect = (actionType) => {
    const { x, y } = farmerPosition;
    for (let i = 0; i < 10; i++) {
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
        className="rounded-2xl shadow-2xl border-4 border-green-300"
        style={{ width: '100%', maxWidth: '800px', height: 'auto' }}
      />
      
      {/* Kontrol bilgisi */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg">
        <div className="text-sm font-semibold">🎮 Kontroller</div>
        <div className="text-xs">WASD: Hareket | Space: Eylem</div>
      </div>
    </div>
  );
};

export default ModernFarmCanvas;

