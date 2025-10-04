import React, { useState, useEffect, useCallback } from 'react';
import ModernFarmCanvas from './ModernFarmCanvas';

const ModernInteractiveFarmGame = ({ onGameComplete, onBackToMain }) => {
  const [gameState, setGameState] = useState({
    farmerPosition: { x: 100, y: 100 },
    farmerDirection: 'right',
    isMoving: false,
    currentAction: null,
    score: 0,
    timeLeft: 300, // 5 dakika
    season: 1,
    inventory: {
      seeds: 15,
      water: 25,
      fertilizer: 20
    },
    level: 1,
    experience: 0
  });

  const [fields, setFields] = useState(() => {
    // 6x4 tarla oluştur (daha büyük)
    const fieldArray = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 6; col++) {
        fieldArray.push({
          id: `field-${row}-${col}`,
          position: { x: 50 + col * 70, y: 50 + row * 70 },
          state: 'empty',
          cropType: 'wheat',
          growthTime: 0,
          maxGrowthTime: 8,
          quality: 1.0
        });
      }
    }
    return fieldArray;
  });

  const [keys, setKeys] = useState({});
  const [showTutorial, setShowTutorial] = useState(true);
  const [achievements, setAchievements] = useState([]);

  // Klavye olayları
  useEffect(() => {
    const handleKeyDown = (e) => {
      setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: true }));
      
      if (e.key.toLowerCase() === ' ') {
        e.preventDefault();
        handleAction();
      }
    };

    const handleKeyUp = (e) => {
      setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Hareket mantığı
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setGameState(prev => {
        const newPosition = { ...prev.farmerPosition };
        let isMoving = false;
        let direction = prev.farmerDirection;

        // Hareket kontrolleri
        if (keys['w'] || keys['arrowup']) {
          newPosition.y = Math.max(50, newPosition.y - 4);
          isMoving = true;
        }
        if (keys['s'] || keys['arrowdown']) {
          newPosition.y = Math.min(280, newPosition.y + 4);
          isMoving = true;
        }
        if (keys['a'] || keys['arrowleft']) {
          newPosition.x = Math.max(50, newPosition.x - 4);
          isMoving = true;
          direction = 'left';
        }
        if (keys['d'] || keys['arrowright']) {
          newPosition.x = Math.min(400, newPosition.x + 4);
          isMoving = true;
          direction = 'right';
        }

        return {
          ...prev,
          farmerPosition: newPosition,
          isMoving,
          farmerDirection: direction
        };
      });
    }, 16); // 60 FPS

    return () => clearInterval(moveInterval);
  }, [keys]);

  // Büyüme sistemi
  useEffect(() => {
    const growthInterval = setInterval(() => {
      setFields(prev => prev.map(field => {
        if (field.state === 'planted' || field.state === 'growing') {
          const newGrowthTime = field.growthTime + 1;
          
          if (newGrowthTime >= field.maxGrowthTime) {
            return { ...field, state: 'ready', growthTime: field.maxGrowthTime };
          } else if (newGrowthTime >= field.maxGrowthTime * 0.4) {
            return { ...field, state: 'growing', growthTime: newGrowthTime };
          } else {
            return { ...field, growthTime: newGrowthTime };
          }
        }
        return field;
      }));
    }, 1500); // Her 1.5 saniyede bir büyüme

    return () => clearInterval(growthInterval);
  }, []);

  // Zaman sayacı
  useEffect(() => {
    const timer = setInterval(() => {
      setGameState(prev => {
        const newTimeLeft = prev.timeLeft - 1;
        
        if (newTimeLeft <= 0) {
          onGameComplete(prev.score);
          return prev;
        }
        
        return { ...prev, timeLeft: newTimeLeft };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onGameComplete]);

  // Yakındaki tarla kontrolü
  const getNearbyField = useCallback(() => {
    const farmerPos = gameState.farmerPosition;
    return fields.find(field => {
      const distance = Math.sqrt(
        Math.pow(field.position.x - farmerPos.x, 2) + 
        Math.pow(field.position.y - farmerPos.y, 2)
      );
      return distance < 60; // 60px yakınlık
    });
  }, [gameState.farmerPosition, fields]);

  // Eylem sistemi
  const handleAction = () => {
    const nearbyField = getNearbyField();
    if (!nearbyField) return;

    setGameState(prev => {
      const newInventory = { ...prev.inventory };
      let newScore = prev.score;
      let actionType = null;
      let newExperience = prev.experience;

      switch (nearbyField.state) {
        case 'empty':
          if (newInventory.seeds > 0) {
            newInventory.seeds--;
            actionType = 'planting';
            newScore += 15;
            newExperience += 5;
          }
          break;
        case 'planted':
          if (newInventory.water > 0) {
            newInventory.water--;
            actionType = 'watering';
            newScore += 20;
            newExperience += 8;
          }
          break;
        case 'growing':
          if (newInventory.fertilizer > 0) {
            newInventory.fertilizer--;
            actionType = 'fertilizing';
            newScore += 25;
            newExperience += 10;
          }
          break;
        case 'ready':
          actionType = 'harvesting';
          const harvestScore = Math.floor(50 * nearbyField.quality);
          newScore += harvestScore;
          newExperience += 15;
          newInventory.seeds += 3; // Hasat bonusu
          break;
        default:
          return prev;
      }

      // Seviye kontrolü
      const newLevel = Math.floor(newExperience / 100) + 1;
      if (newLevel > prev.level) {
        // Seviye atladı!
        newInventory.seeds += 5;
        newInventory.water += 5;
        newInventory.fertilizer += 5;
      }

      return {
        ...prev,
        inventory: newInventory,
        score: newScore,
        experience: newExperience,
        level: newLevel,
        currentAction: actionType
      };
    });

    // Tarla durumunu güncelle
    setFields(prev => prev.map(field => {
      if (field.id === nearbyField.id) {
        switch (field.state) {
          case 'empty':
            return { ...field, state: 'planted', growthTime: 0 };
          case 'planted':
            return { ...field, state: 'growing', growthTime: field.maxGrowthTime * 0.2 };
          case 'growing':
            return { ...field, growthTime: Math.min(field.maxGrowthTime, field.growthTime + 2), quality: Math.min(1.5, field.quality + 0.1) };
          case 'ready':
            return { ...field, state: 'harvested' };
          default:
            return field;
        }
      }
      return field;
    }));

    // Eylem animasyonu
    setTimeout(() => {
      setGameState(prev => ({ ...prev, currentAction: null }));
    }, 1000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const nearbyField = getNearbyField();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-50 to-yellow-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Modern Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl animate-bounce-slow">🌾</div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Modern Çiftçilik
                </h1>
                <p className="text-gray-600">Canvas tabanlı interaktif deneyim</p>
              </div>
            </div>
            <button
              onClick={onBackToMain}
              className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all transform hover:scale-105 shadow-lg"
            >
              ← Ana Menü
            </button>
          </div>
        </div>

        {/* Modern HUD */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 text-center border border-white/20">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
              {gameState.score}
            </div>
            <div className="text-sm text-gray-600 font-semibold">Puan</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 text-center border border-white/20">
            <div className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              {formatTime(gameState.timeLeft)}
            </div>
            <div className="text-sm text-gray-600 font-semibold">Süre</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 text-center border border-white/20">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
              {gameState.level}
            </div>
            <div className="text-sm text-gray-600 font-semibold">Seviye</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 text-center border border-white/20">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
              {fields.filter(f => f.state === 'ready').length}
            </div>
            <div className="text-sm text-gray-600 font-semibold">Hasat</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 text-center border border-white/20">
            <div className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              {gameState.experience}%
            </div>
            <div className="text-sm text-gray-600 font-semibold">XP</div>
          </div>
        </div>

        {/* Modern Envanter */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-white/20">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">🎒</span>
            Envanter
          </h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
              <div className="text-3xl mb-2">🌱</div>
              <div className="text-2xl font-bold text-green-600">{gameState.inventory.seeds}</div>
              <div className="text-sm text-gray-600 font-semibold">Tohum</div>
            </div>
            <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
              <div className="text-3xl mb-2">💧</div>
              <div className="text-2xl font-bold text-blue-600">{gameState.inventory.water}</div>
              <div className="text-sm text-gray-600 font-semibold">Su</div>
            </div>
            <div className="text-center bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4">
              <div className="text-3xl mb-2">🌿</div>
              <div className="text-2xl font-bold text-yellow-600">{gameState.inventory.fertilizer}</div>
              <div className="text-sm text-gray-600 font-semibold">Gübre</div>
            </div>
          </div>
        </div>

        {/* Canvas Oyun Alanı */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
          <ModernFarmCanvas
            farmerPosition={gameState.farmerPosition}
            farmerDirection={gameState.farmerDirection}
            isMoving={gameState.isMoving}
            currentAction={gameState.currentAction}
            fields={fields}
            onFieldAction={handleAction}
            nearbyFieldId={nearbyField?.id}
          />
        </div>

        {/* Modern Kontroller */}
        <div className="mt-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">🎮</span>
            Kontroller
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
              <div className="text-3xl mb-2">⬆️</div>
              <div className="font-bold text-blue-600">W / ↑</div>
              <div className="text-sm text-gray-600">Yukarı</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
              <div className="text-3xl mb-2">⬇️</div>
              <div className="font-bold text-green-600">S / ↓</div>
              <div className="text-sm text-gray-600">Aşağı</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
              <div className="text-3xl mb-2">⬅️</div>
              <div className="font-bold text-purple-600">A / ←</div>
              <div className="text-sm text-gray-600">Sol</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
              <div className="text-3xl mb-2">➡️</div>
              <div className="font-bold text-orange-600">D / →</div>
              <div className="text-sm text-gray-600">Sağ</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4">
              <div className="text-3xl mb-2">⏰</div>
              <div className="font-bold text-red-600">Space</div>
              <div className="text-sm text-gray-600">Eylem</div>
            </div>
          </div>
        </div>

        {/* Tutorial Modal */}
        {showTutorial && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🎮</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Modern Çiftçilik Oyunu</h2>
                <p className="text-gray-600">Canvas tabanlı interaktif deneyim</p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <h3 className="font-bold text-green-800">Hedef</h3>
                    <p className="text-sm text-gray-700">5 dakikada en yüksek skoru yapın!</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                  <span className="text-2xl">⌨️</span>
                  <div>
                    <h3 className="font-bold text-blue-800">Kontroller</h3>
                    <p className="text-sm text-gray-700">WASD ile hareket edin, Space ile eylem yapın</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-xl">
                  <span className="text-2xl">🌱</span>
                  <div>
                    <h3 className="font-bold text-yellow-800">Oyun Akışı</h3>
                    <p className="text-sm text-gray-700">Ekme → Sulama → Gübreleme → Hasat</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setShowTutorial(false)}
                className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-xl hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg"
              >
                🚀 Oyunu Başlat!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernInteractiveFarmGame;

