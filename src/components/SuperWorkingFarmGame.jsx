import React, { useState, useEffect, useCallback } from 'react';
import SuperStylishFarmCanvas from './SuperStylishFarmCanvas';

const SuperWorkingFarmGame = ({ onGameComplete, onBackToMain }) => {
  const [gameState, setGameState] = useState({
    farmerPosition: { x: 150, y: 150 },
    farmerDirection: 'right',
    isMoving: false,
    currentAction: null,
    score: 0,
    timeLeft: 600, // 10 dakika
    season: 'spring',
    weather: 'sunny',
    inventory: {
      seeds: { wheat: 50, corn: 50, tomato: 50, potato: 50, carrot: 50 }, // Çok fazla tohum
      water: 200, // Çok fazla su
      fertilizer: 200, // Çok fazla gübre
      fuel: 500 // Çok fazla yakıt
    },
    level: 1,
    experience: 0,
    money: 50000, // Çok fazla para
    equipment: 'none',
    unlockedEquipment: ['none'],
    achievements: []
  });

  const [fields, setFields] = useState(() => {
    // 8x6 tarla oluştur
    const fieldArray = [];
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 8; col++) {
        fieldArray.push({
          id: `field-${row}-${col}`,
          position: { x: 50 + col * 90, y: 50 + row * 90 },
          state: 'empty',
          cropType: 'wheat',
          growthTime: 0,
          maxGrowthTime: 8,
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

  // Ekipman fiyatları - ucuzlaştırıldı
  const equipmentPrices = {
    tractor: 1000,
    harvester: 2000,
    irrigation: 1500,
    plow: 500
  };

  // Bitki fiyatları ve özellikleri
  const cropData = {
    wheat: { price: 50, growthTime: 6, waterNeed: 2, fertilizerNeed: 1 },
    corn: { price: 80, growthTime: 8, waterNeed: 3, fertilizerNeed: 2 },
    tomato: { price: 120, growthTime: 10, waterNeed: 4, fertilizerNeed: 3 },
    potato: { price: 90, growthTime: 9, waterNeed: 3, fertilizerNeed: 2 },
    carrot: { price: 70, growthTime: 7, waterNeed: 2, fertilizerNeed: 1 }
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
        const speed = prev.equipment === 'tractor' ? 8 : prev.equipment === 'harvester' ? 6 : 4;

        // Hareket kontrolleri
        if (keys['w'] || keys['arrowup']) {
          newPosition.y = Math.max(50, newPosition.y - speed);
          isMoving = true;
        }
        if (keys['s'] || keys['arrowdown']) {
          newPosition.y = Math.min(500, newPosition.y + speed);
          isMoving = true;
        }
        if (keys['a'] || keys['arrowleft']) {
          newPosition.x = Math.max(50, newPosition.x - speed);
          isMoving = true;
          direction = 'left';
        }
        if (keys['d'] || keys['arrowright']) {
          newPosition.x = Math.min(700, newPosition.x + speed);
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
          } else if (newGrowthTime >= field.maxGrowthTime * 0.6) {
            return { ...field, state: 'flowering', growthTime: newGrowthTime };
          } else if (newGrowthTime >= field.maxGrowthTime * 0.3) {
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

  // Hava durumu değişimi
  useEffect(() => {
    const weatherInterval = setInterval(() => {
      const weathers = ['sunny', 'rain', 'cloudy', 'snow'];
      const randomWeather = weathers[Math.floor(Math.random() * weathers.length)];
      
      setGameState(prev => ({
        ...prev,
        weather: randomWeather
      }));
    }, 20000); // Her 20 saniyede hava durumu değişir

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
      return distance < 100; // 100px yakınlık
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

  // Eylem sistemi - TAM ÇALIŞAN VERSİYON
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
            newScore += 30;
            newExperience += 10;
            newInventory.fuel -= 1;
          }
          break;
        case 'plowed':
          // Bitki seçimi
          const availableCrops = Object.keys(newInventory.seeds).filter(crop => newInventory.seeds[crop] > 0);
          if (availableCrops.length > 0) {
            const selectedCrop = availableCrops[0];
            newInventory.seeds[selectedCrop]--;
            actionType = 'seeding';
            newScore += 40;
            newExperience += 15;
          }
          break;
        case 'planted':
          if (newInventory.water > 0) {
            newInventory.water -= 1;
            actionType = 'watering';
            newScore += 50;
            newExperience += 20;
          }
          break;
        case 'growing':
        case 'flowering':
          if (newInventory.fertilizer > 0) {
            newInventory.fertilizer -= 1;
            actionType = 'fertilizing';
            newScore += 60;
            newExperience += 25;
          }
          break;
        case 'ready':
          if (prev.equipment === 'harvester') {
            actionType = 'harvesting';
            const harvestValue = Math.floor(150 * nearbyField.quality);
            newScore += harvestValue;
            newExperience += 30;
            newMoney += harvestValue;
            newInventory.fuel -= 2;
          } else {
            actionType = 'harvesting';
            const harvestValue = Math.floor(100 * nearbyField.quality);
            newScore += harvestValue;
            newExperience += 25;
            newMoney += harvestValue;
          }
          break;
        default:
          return prev;
      }

      // Seviye kontrolü
      const newLevel = Math.floor(newExperience / 100) + 1;
      if (newLevel > prev.level) {
        // Seviye atladı!
        newMoney += 1000;
        newInventory.water += 50;
        newInventory.fertilizer += 50;
        newInventory.fuel += 100;
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

    // Tarla durumunu güncelle - TAM ÇALIŞAN VERSİYON
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
      <div className="max-w-8xl mx-auto">
        {/* Süper şık Header */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-6 border border-white/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-5xl animate-bounce-slow">🌾</div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Süper Çiftçilik
                </h1>
                <p className="text-gray-600 text-lg">Tam çalışan, süper şık grafiklerle!</p>
              </div>
            </div>
            <button
              onClick={onBackToMain}
              className="px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all transform hover:scale-105 shadow-lg font-bold"
            >
              ← Ana Menü
            </button>
          </div>
        </div>

        {/* Süper şık HUD */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 text-center border border-white/30">
            <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
              {gameState.score}
            </div>
            <div className="text-sm text-gray-600 font-semibold">Puan</div>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 text-center border border-white/30">
            <div className="text-4xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              {formatTime(gameState.timeLeft)}
            </div>
            <div className="text-sm text-gray-600 font-semibold">Süre</div>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 text-center border border-white/30">
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
              {gameState.level}
            </div>
            <div className="text-sm text-gray-600 font-semibold">Seviye</div>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 text-center border border-white/30">
            <div className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              {gameState.money.toLocaleString()}₺
            </div>
            <div className="text-sm text-gray-600 font-semibold">Para</div>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 text-center border border-white/30">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
              {gameState.weather === 'sunny' ? '☀️' : gameState.weather === 'rain' ? '🌧️' : gameState.weather === 'snow' ? '❄️' : '☁️'}
            </div>
            <div className="text-sm text-gray-600 font-semibold">Hava</div>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 text-center border border-white/30">
            <div className="text-4xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
              {gameState.equipment === 'tractor' ? '🚜' : gameState.equipment === 'harvester' ? '🚜' : gameState.equipment === 'irrigation' ? '💧' : '👨‍🌾'}
            </div>
            <div className="text-sm text-gray-600 font-semibold">Ekipman</div>
          </div>
        </div>

        {/* Süper şık Canvas Oyun Alanı */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/30 mb-6">
          <SuperStylishFarmCanvas
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

        {/* Süper şık Envanter ve Ekipman */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Süper şık Envanter */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/30">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-3xl">🎒</span>
              Süper Envanter
            </h3>
            <div className="grid grid-cols-2 gap-4">
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
              <div className="text-center bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4">
                <div className="text-3xl mb-2">⛽</div>
                <div className="text-2xl font-bold text-red-600">{gameState.inventory.fuel}</div>
                <div className="text-sm text-gray-600 font-semibold">Yakıt</div>
              </div>
              <div className="text-center bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                <div className="text-3xl mb-2">🌱</div>
                <div className="text-2xl font-bold text-green-600">{Object.values(gameState.inventory.seeds).reduce((a, b) => a + b, 0)}</div>
                <div className="text-sm text-gray-600 font-semibold">Tohum</div>
              </div>
            </div>
          </div>

          {/* Süper şık Ekipman Menüsü */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/30">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-3xl">🚜</span>
              Süper Ekipmanlar
            </h3>
            <div className="space-y-3">
              {Object.entries(equipmentPrices).map(([equipment, price]) => (
                <div key={equipment} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">
                      {equipment === 'tractor' ? '🚜' : 
                       equipment === 'harvester' ? '🚜' : 
                       equipment === 'irrigation' ? '💧' : '🔧'}
                    </span>
                    <div>
                      <div className="font-bold capitalize text-lg">{equipment}</div>
                      <div className="text-sm text-gray-600">{price}₺</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {gameState.unlockedEquipment.includes(equipment) ? (
                      <button
                        onClick={() => changeEquipment(equipment)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold ${
                          gameState.equipment === equipment 
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                            : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 hover:from-gray-400 hover:to-gray-500'
                        }`}
                      >
                        {gameState.equipment === equipment ? 'Aktif' : 'Seç'}
                      </button>
                    ) : (
                      <button
                        onClick={() => buyEquipment(equipment)}
                        disabled={gameState.money < price}
                        className="px-4 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-500"
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

        {/* Süper şık Tutorial Modal */}
        {showTutorial && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl w-full">
              <div className="text-center mb-6">
                <div className="text-8xl mb-4">🚜</div>
                <h2 className="text-4xl font-bold text-gray-800 mb-2">Süper Çiftçilik Oyunu</h2>
                <p className="text-gray-600 text-lg">Tam çalışan, süper şık grafiklerle!</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <h3 className="font-bold text-green-800 mb-2 text-lg">🎯 Hedef</h3>
                  <p className="text-sm text-gray-700">10 dakikada en yüksek skoru yapın!</p>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <h3 className="font-bold text-blue-800 mb-2 text-lg">⌨️ Kontroller</h3>
                  <p className="text-sm text-gray-700">WASD: Hareket | Space: Eylem | E: Ekipman</p>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
                  <h3 className="font-bold text-yellow-800 mb-2 text-lg">🌱 Oyun Akışı</h3>
                  <p className="text-sm text-gray-700">Sürme → Ekme → Sulama → Gübreleme → Hasat</p>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <h3 className="font-bold text-purple-800 mb-2 text-lg">🚜 Ekipmanlar</h3>
                  <p className="text-sm text-gray-700">Traktör, biçerdöver ve sulama sistemi</p>
                </div>
              </div>
              
              <button
                onClick={() => setShowTutorial(false)}
                className="w-full px-8 py-4 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white font-bold rounded-xl hover:from-green-600 hover:via-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg text-lg"
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

export default SuperWorkingFarmGame;
