import React, { useState, useEffect, useCallback } from 'react';
import FarmerCharacter from './FarmerCharacter';
import FarmField from './FarmField';

const InteractiveFarmGame = ({ onGameComplete, onBackToMain }) => {
  const [gameState, setGameState] = useState({
    farmerPosition: { x: 100, y: 100 },
    farmerDirection: 'right',
    isMoving: false,
    currentAction: null,
    score: 0,
    timeLeft: 300, // 5 dakika
    season: 1,
    inventory: {
      seeds: 10,
      water: 20,
      fertilizer: 15
    }
  });

  const [fields, setFields] = useState(() => {
    // 5x5 tarla oluştur
    const fieldArray = [];
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        fieldArray.push({
          id: `field-${row}-${col}`,
          position: { x: 50 + col * 70, y: 50 + row * 70 },
          state: 'empty',
          cropType: 'wheat',
          growthTime: 0,
          maxGrowthTime: 10
        });
      }
    }
    return fieldArray;
  });

  const [keys, setKeys] = useState({});

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
          newPosition.y = Math.max(50, newPosition.y - 5);
          isMoving = true;
        }
        if (keys['s'] || keys['arrowdown']) {
          newPosition.y = Math.min(350, newPosition.y + 5);
          isMoving = true;
        }
        if (keys['a'] || keys['arrowleft']) {
          newPosition.x = Math.max(50, newPosition.x - 5);
          isMoving = true;
          direction = 'left';
        }
        if (keys['d'] || keys['arrowright']) {
          newPosition.x = Math.min(350, newPosition.x + 5);
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
    }, 50);

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
          } else if (newGrowthTime >= field.maxGrowthTime * 0.5) {
            return { ...field, state: 'growing', growthTime: newGrowthTime };
          } else {
            return { ...field, growthTime: newGrowthTime };
          }
        }
        return field;
      }));
    }, 2000); // Her 2 saniyede bir büyüme

    return () => clearInterval(growthInterval);
  }, []);

  // Zaman sayacı
  useEffect(() => {
    const timer = setInterval(() => {
      setGameState(prev => {
        const newTimeLeft = prev.timeLeft - 1;
        
        if (newTimeLeft <= 0) {
          // Oyun bitti
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
      return distance < 50; // 50px yakınlık
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

      switch (nearbyField.state) {
        case 'empty':
          if (newInventory.seeds > 0) {
            newInventory.seeds--;
            actionType = 'planting';
            newScore += 10;
          }
          break;
        case 'planted':
          if (newInventory.water > 0) {
            newInventory.water--;
            actionType = 'watering';
            newScore += 15;
          }
          break;
        case 'growing':
          if (newInventory.fertilizer > 0) {
            newInventory.fertilizer--;
            actionType = 'fertilizing';
            newScore += 20;
          }
          break;
        case 'ready':
          actionType = 'harvesting';
          newScore += 50;
          newInventory.seeds += 2; // Hasat bonusu
          break;
        default:
          return prev;
      }

      return {
        ...prev,
        inventory: newInventory,
        score: newScore,
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
            return { ...field, state: 'growing', growthTime: field.maxGrowthTime * 0.3 };
          case 'growing':
            return { ...field, growthTime: Math.min(field.maxGrowthTime, field.growthTime + 2) };
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
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-yellow-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Oyun Başlığı */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-green-700">🌾 Interaktif Çiftçilik</h1>
              <p className="text-gray-600">Klavye ile çiftçiliği öğren!</p>
            </div>
            <button
              onClick={onBackToMain}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              ← Ana Menü
            </button>
          </div>
        </div>

        {/* Oyun HUD */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{gameState.score}</div>
            <div className="text-sm text-gray-600">Puan</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{formatTime(gameState.timeLeft)}</div>
            <div className="text-sm text-gray-600">Kalan Süre</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{gameState.season}</div>
            <div className="text-sm text-gray-600">Sezon</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center">
            <div className="text-lg font-bold text-purple-600">
              {fields.filter(f => f.state === 'ready').length}
            </div>
            <div className="text-sm text-gray-600">Hasat Hazır</div>
          </div>
        </div>

        {/* Envanter */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">🎒 Envanter</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl mb-1">🌱</div>
              <div className="text-lg font-bold text-green-600">{gameState.inventory.seeds}</div>
              <div className="text-xs text-gray-600">Tohum</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">💧</div>
              <div className="text-lg font-bold text-blue-600">{gameState.inventory.water}</div>
              <div className="text-xs text-gray-600">Su</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">🌿</div>
              <div className="text-lg font-bold text-yellow-600">{gameState.inventory.fertilizer}</div>
              <div className="text-xs text-gray-600">Gübre</div>
            </div>
          </div>
        </div>

        {/* Oyun Alanı */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="relative bg-gradient-to-br from-green-200 to-green-300 rounded-xl h-96 overflow-hidden">
            {/* Tarla alanları */}
            {fields.map(field => (
              <FarmField
                key={field.id}
                fieldId={field.id}
                position={field.position}
                state={field.state}
                onAction={handleAction}
                isPlayerNearby={nearbyField?.id === field.id}
                season={gameState.season}
                cropType={field.cropType}
              />
            ))}

            {/* Çiftçi karakteri */}
            <FarmerCharacter
              position={gameState.farmerPosition}
              direction={gameState.farmerDirection}
              isMoving={gameState.isMoving}
              currentAction={gameState.currentAction}
            />

            {/* Yakınlık göstergesi */}
            {nearbyField && (
              <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg">
                <div className="text-sm font-semibold">
                  {nearbyField.state === 'empty' && '🌱 Ekmek için Space'}
                  {nearbyField.state === 'planted' && '💧 Sulamak için Space'}
                  {nearbyField.state === 'growing' && '🌿 Gübrelemek için Space'}
                  {nearbyField.state === 'ready' && '🌾 Hasat için Space'}
                  {nearbyField.state === 'harvested' && '✅ Hasat edildi'}
                </div>
              </div>
            )}
          </div>

          {/* Kontroller */}
          <div className="mt-6 bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-3">🎮 Kontroller</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl mb-1">⬆️</div>
                <div className="font-semibold">W / ↑</div>
                <div className="text-gray-600">Yukarı</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">⬇️</div>
                <div className="font-semibold">S / ↓</div>
                <div className="text-gray-600">Aşağı</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">⬅️</div>
                <div className="font-semibold">A / ←</div>
                <div className="text-gray-600">Sol</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">➡️</div>
                <div className="font-semibold">D / →</div>
                <div className="text-gray-600">Sağ</div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <div className="text-2xl mb-1">⏰</div>
              <div className="font-semibold">Space</div>
              <div className="text-gray-600">Eylem Yap</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveFarmGame;
