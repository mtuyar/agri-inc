import React, { useState, useEffect, useCallback } from 'react';
import EnhancedFarmCanvas from './EnhancedFarmCanvas';

const EnhancedInteractiveFarmGame = ({ onGameComplete, onBackToMain }) => {
  const [gameState, setGameState] = useState({
    farmerPosition: { x: 100, y: 100 },
    farmerDirection: 'right',
    isMoving: false,
    currentAction: null,
    score: 0,
    timeLeft: 600, // 10 dakika
    season: 'spring',
    weather: 'sunny',
    inventory: {
      seeds: { wheat: 20, corn: 15, tomato: 10, potato: 12, carrot: 8 },
      water: 50,
      fertilizer: 30,
      fuel: 100
    },
    level: 1,
    experience: 0,
    money: 1000,
    equipment: 'none', // none, tractor, harvester, irrigation
    unlockedEquipment: ['none'],
    achievements: []
  });

  const [fields, setFields] = useState(() => {
    // 8x6 tarla oluştur (daha büyük)
    const fieldArray = [];
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 8; col++) {
        fieldArray.push({
          id: `field-${row}-${col}`,
          position: { x: 50 + col * 80, y: 50 + row * 80 },
          state: 'empty',
          cropType: 'wheat',
          growthTime: 0,
          maxGrowthTime: 10,
          quality: 1.0,
          waterLevel: 0,
          fertilizerLevel: 0,
          plowed: false
        });
      }
    }
    return fieldArray;
  });

  const [keys, setKeys] = useState({});
  const [showTutorial, setShowTutorial] = useState(true);
  const [showEquipmentMenu, setShowEquipmentMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Ekipman fiyatları
  const equipmentPrices = {
    tractor: 2000,
    harvester: 5000,
    irrigation: 3000,
    plow: 1000
  };

  // Bitki fiyatları ve özellikleri
  const cropData = {
    wheat: { price: 50, growthTime: 8, waterNeed: 3, fertilizerNeed: 2 },
    corn: { price: 80, growthTime: 10, waterNeed: 4, fertilizerNeed: 3 },
    tomato: { price: 120, growthTime: 12, waterNeed: 5, fertilizerNeed: 4 },
    potato: { price: 90, growthTime: 11, waterNeed: 3, fertilizerNeed: 3 },
    carrot: { price: 70, growthTime: 9, waterNeed: 2, fertilizerNeed: 2 }
  };

  // Klavye olayları
  useEffect(() => {
    const handleKeyDown = (e) => {
      setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: true }));
      
      if (e.key.toLowerCase() === ' ') {
        e.preventDefault();
        handleAction();
      }
      
      if (e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setShowEquipmentMenu(!showEquipmentMenu);
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
  }, [showEquipmentMenu]);

  // Hareket mantığı
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setGameState(prev => {
        const newPosition = { ...prev.farmerPosition };
        let isMoving = false;
        let direction = prev.farmerDirection;

        // Hareket hızı ekipmana göre değişir
        const speed = prev.equipment === 'tractor' ? 6 : prev.equipment === 'harvester' ? 4 : 3;

        // Hareket kontrolleri
        if (keys['w'] || keys['arrowup']) {
          newPosition.y = Math.max(50, newPosition.y - speed);
          isMoving = true;
        }
        if (keys['s'] || keys['arrowdown']) {
          newPosition.y = Math.min(450, newPosition.y + speed);
          isMoving = true;
        }
        if (keys['a'] || keys['arrowleft']) {
          newPosition.x = Math.max(50, newPosition.x - speed);
          isMoving = true;
          direction = 'left';
        }
        if (keys['d'] || keys['arrowright']) {
          newPosition.x = Math.min(600, newPosition.x + speed);
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
        if (field.state === 'planted' || field.state === 'growing' || field.state === 'flowering') {
          const newGrowthTime = field.growthTime + 1;
          
          if (newGrowthTime >= field.maxGrowthTime) {
            return { ...field, state: 'ready', growthTime: field.maxGrowthTime };
          } else if (newGrowthTime >= field.maxGrowthTime * 0.7) {
            return { ...field, state: 'flowering', growthTime: newGrowthTime };
          } else if (newGrowthTime >= field.maxGrowthTime * 0.3) {
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

  // Hava durumu değişimi
  useEffect(() => {
    const weatherInterval = setInterval(() => {
      const weathers = ['sunny', 'rain', 'cloudy', 'snow'];
      const randomWeather = weathers[Math.floor(Math.random() * weathers.length)];
      
      setGameState(prev => ({
        ...prev,
        weather: randomWeather
      }));
    }, 30000); // Her 30 saniyede hava durumu değişir

    return () => clearInterval(weatherInterval);
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
      return distance < 80; // 80px yakınlık
    });
  }, [gameState.farmerPosition, fields]);

  // Ekipman satın alma
  const buyEquipment = (equipmentType) => {
    const price = equipmentPrices[equipmentType];
    if (gameState.money >= price && !gameState.unlockedEquipment.includes(equipmentType)) {
      setGameState(prev => ({
        ...prev,
        money: prev.money - price,
        unlockedEquipment: [...prev.unlockedEquipment, equipmentType],
        equipment: equipmentType
      }));
    }
  };

  // Ekipman değiştirme
  const changeEquipment = (equipmentType) => {
    if (gameState.unlockedEquipment.includes(equipmentType)) {
      setGameState(prev => ({
        ...prev,
        equipment: equipmentType
      }));
    }
  };

  // Eylem sistemi
  const handleAction = () => {
    const nearbyField = getNearbyField();
    if (!nearbyField) return;

    setGameState(prev => {
      const newInventory = { ...prev.inventory };
      let newScore = prev.score;
      let actionType = null;
      let newExperience = prev.experience;
      let newMoney = prev.money;

      switch (nearbyField.state) {
        case 'empty':
          if (prev.equipment === 'plow' || prev.equipment === 'tractor') {
            actionType = 'plowing';
            newScore += 20;
            newExperience += 5;
            newInventory.fuel -= 2;
          }
          break;
        case 'plowed':
          // Bitki seçimi (basit sistem)
          const availableCrops = Object.keys(newInventory.seeds).filter(crop => newInventory.seeds[crop] > 0);
          if (availableCrops.length > 0) {
            const selectedCrop = availableCrops[0];
            newInventory.seeds[selectedCrop]--;
            actionType = 'seeding';
            newScore += 25;
            newExperience += 8;
          }
          break;
        case 'planted':
          if (newInventory.water > 0) {
            newInventory.water -= 2;
            actionType = 'watering';
            newScore += 30;
            newExperience += 10;
          }
          break;
        case 'growing':
        case 'flowering':
          if (newInventory.fertilizer > 0) {
            newInventory.fertilizer -= 1;
            actionType = 'fertilizing';
            newScore += 35;
            newExperience += 12;
          }
          break;
        case 'ready':
          if (prev.equipment === 'harvester') {
            actionType = 'harvesting';
            const harvestValue = Math.floor(100 * nearbyField.quality);
            newScore += harvestValue;
            newExperience += 20;
            newMoney += harvestValue;
            newInventory.fuel -= 5;
          } else {
            actionType = 'harvesting';
            const harvestValue = Math.floor(50 * nearbyField.quality);
            newScore += harvestValue;
            newExperience += 15;
            newMoney += harvestValue;
          }
          break;
        default:
          return prev;
      }

      // Seviye kontrolü
      const newLevel = Math.floor(newExperience / 200) + 1;
      if (newLevel > prev.level) {
        // Seviye atladı!
        newMoney += 500;
        newInventory.water += 20;
        newInventory.fertilizer += 15;
        newInventory.fuel += 50;
      }

      return {
        ...prev,
        inventory: newInventory,
        score: newScore,
        experience: newExperience,
        level: newLevel,
        money: newMoney,
        currentAction: actionType
      };
    });

    // Tarla durumunu güncelle
    setFields(prev => prev.map(field => {
      if (field.id === nearbyField.id) {
        switch (field.state) {
          case 'empty':
            return { ...field, state: 'plowed', plowed: true };
          case 'plowed':
            const availableCrops = Object.keys(gameState.inventory.seeds).filter(crop => gameState.inventory.seeds[crop] > 0);
            if (availableCrops.length > 0) {
              const selectedCrop = availableCrops[0];
              return { ...field, state: 'planted', cropType: selectedCrop, growthTime: 0 };
            }
            return field;
          case 'planted':
            return { ...field, state: 'growing', growthTime: field.maxGrowthTime * 0.2 };
          case 'growing':
          case 'flowering':
            return { ...field, growthTime: Math.min(field.maxGrowthTime, field.growthTime + 2), quality: Math.min(2.0, field.quality + 0.1) };
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
    }, 1500);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const nearbyField = getNearbyField();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-50 to-yellow-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Modern Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl animate-bounce-slow">🌾</div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Gelişmiş Çiftçilik
                </h1>
                <p className="text-gray-600">Ekipmanlar, mevsimler ve hava durumu ile</p>
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
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
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
            <div className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              {gameState.money}₺
            </div>
            <div className="text-sm text-gray-600 font-semibold">Para</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 text-center border border-white/20">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
              {gameState.weather === 'sunny' ? '☀️' : gameState.weather === 'rain' ? '🌧️' : gameState.weather === 'snow' ? '❄️' : '☁️'}
            </div>
            <div className="text-sm text-gray-600 font-semibold">Hava</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 text-center border border-white/20">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
              {gameState.equipment === 'tractor' ? '🚜' : gameState.equipment === 'harvester' ? '🚜' : gameState.equipment === 'irrigation' ? '💧' : '👨‍🌾'}
            </div>
            <div className="text-sm text-gray-600 font-semibold">Ekipman</div>
          </div>
        </div>

        {/* Canvas Oyun Alanı */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 mb-6">
          <EnhancedFarmCanvas
            farmerPosition={gameState.farmerPosition}
            farmerDirection={gameState.farmerDirection}
            isMoving={gameState.isMoving}
            currentAction={gameState.currentAction}
            fields={fields}
            onFieldAction={handleAction}
            nearbyFieldId={nearbyField?.id}
            equipment={gameState.equipment}
            weather={gameState.weather}
            season={gameState.season}
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
          />
        </div>

        {/* Envanter ve Ekipman */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Envanter */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">🎒</span>
              Envanter
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                <div className="text-2xl mb-2">💧</div>
                <div className="text-lg font-bold text-blue-600">{gameState.inventory.water}</div>
                <div className="text-sm text-gray-600 font-semibold">Su</div>
              </div>
              <div className="text-center bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4">
                <div className="text-2xl mb-2">🌿</div>
                <div className="text-lg font-bold text-yellow-600">{gameState.inventory.fertilizer}</div>
                <div className="text-sm text-gray-600 font-semibold">Gübre</div>
              </div>
              <div className="text-center bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4">
                <div className="text-2xl mb-2">⛽</div>
                <div className="text-lg font-bold text-red-600">{gameState.inventory.fuel}</div>
                <div className="text-sm text-gray-600 font-semibold">Yakıt</div>
              </div>
              <div className="text-center bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                <div className="text-2xl mb-2">🌱</div>
                <div className="text-lg font-bold text-green-600">{Object.values(gameState.inventory.seeds).reduce((a, b) => a + b, 0)}</div>
                <div className="text-sm text-gray-600 font-semibold">Tohum</div>
              </div>
            </div>
          </div>

          {/* Ekipman Menüsü */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">🚜</span>
              Ekipmanlar
            </h3>
            <div className="space-y-3">
              {Object.entries(equipmentPrices).map(([equipment, price]) => (
                <div key={equipment} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {equipment === 'tractor' ? '🚜' : 
                       equipment === 'harvester' ? '🚜' : 
                       equipment === 'irrigation' ? '💧' : '🔧'}
                    </span>
                    <div>
                      <div className="font-semibold capitalize">{equipment}</div>
                      <div className="text-sm text-gray-600">{price}₺</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {gameState.unlockedEquipment.includes(equipment) ? (
                      <button
                        onClick={() => changeEquipment(equipment)}
                        className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                          gameState.equipment === equipment 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                        }`}
                      >
                        {gameState.equipment === equipment ? 'Aktif' : 'Seç'}
                      </button>
                    ) : (
                      <button
                        onClick={() => buyEquipment(equipment)}
                        disabled={gameState.money < price}
                        className="px-3 py-1 rounded-lg text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500"
                      >
                        Satın Al
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tutorial Modal */}
        {showTutorial && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-3xl w-full">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🚜</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Gelişmiş Çiftçilik Oyunu</h2>
                <p className="text-gray-600">Ekipmanlar, mevsimler ve hava durumu ile</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-green-50 rounded-xl">
                  <h3 className="font-bold text-green-800 mb-2">🎯 Hedef</h3>
                  <p className="text-sm text-gray-700">10 dakikada en yüksek skoru yapın!</p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-xl">
                  <h3 className="font-bold text-blue-800 mb-2">⌨️ Kontroller</h3>
                  <p className="text-sm text-gray-700">WASD: Hareket | Space: Eylem | E: Ekipman</p>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-xl">
                  <h3 className="font-bold text-yellow-800 mb-2">🌱 Oyun Akışı</h3>
                  <p className="text-sm text-gray-700">Sürme → Ekme → Sulama → Gübreleme → Hasat</p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-xl">
                  <h3 className="font-bold text-purple-800 mb-2">🚜 Ekipmanlar</h3>
                  <p className="text-sm text-gray-700">Traktör, biçerdöver ve sulama sistemi</p>
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

export default EnhancedInteractiveFarmGame;

