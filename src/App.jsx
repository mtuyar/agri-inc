import { useState, useEffect } from 'react'
import GameBoard from './components/GameBoard'
import DecisionPanel from './components/DecisionPanel'
import EventCard from './components/EventCard'
import UpgradePanel from './components/UpgradePanel'
import ScoreBoard from './components/ScoreBoard'
import TutorialModal from './components/TutorialModal'
import DiseaseWarning from './components/DiseaseWarning'
import ActionFeedback from './components/ActionFeedback'
import { calculateCropHealth, getRandomEvent, getNasaBasedEvent, calculateHarvestScore, UPGRADES, SEASONS, DECISIONS, checkForDiseases, getDiseaseWarning } from './utils/gameLogic'

function App() {
  const [gameState, setGameState] = useState({
    cropHealth: 65,
    budget: 300,
    season: 1,
    totalSeasons: 4,
    score: 0,
    phase: 'decision', // decision, event, harvest
    currentEvent: null,
    decisions: [],
    upgrades: [],
    availableUpgrades: UPGRADES.map(u => ({ ...u, unlocked: false })),
  });

  const [showEventCard, setShowEventCard] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showActionFeedback, setShowActionFeedback] = useState(false);
  const [currentGameMode, setCurrentGameMode] = useState(null); // null, 'simulation'

  const handleDecision = (decision) => {
    setGameState(prev => ({
      ...prev,
      decisions: [...prev.decisions, decision],
      budget: prev.budget - decision.cost
    }));
  };

  const handleConfirmDecisions = () => {
    if (gameState.decisions.length < 2) {
      alert('Lütfen hem sulama hem de gübreleme kararı verin!');
      return;
    }

    // Aksiyon feedback'i göster
    setShowActionFeedback(true);
    setTimeout(() => setShowActionFeedback(false), 3000);

    // NASA VERİLERİNE GÖRE HAVA OLAYI SEÇ
    const event = getNasaBasedEvent(gameState.season, gameState.decisions);
    
    // HASTALIK KONTROLÜ VE UYARI SİSTEMİ
    const disease = checkForDiseases(gameState.season, gameState.cropHealth, gameState.decisions, event, gameState.upgrades);
    const diseaseWarning = getDiseaseWarning(gameState.season, gameState.cropHealth, gameState.decisions, event, gameState.upgrades);
    
    const newHealth = calculateCropHealth(
      gameState.cropHealth,
      gameState.decisions,
      event,
      gameState.upgrades,
      gameState.season
    );

    setGameState(prev => ({
      ...prev,
      cropHealth: newHealth,
      currentEvent: event,
      currentDisease: disease,
      currentDiseaseWarning: diseaseWarning,
      phase: 'event'
    }));

    setShowEventCard(true);
    setTimeout(() => {
      setShowEventCard(false);
      nextSeason();
    }, 3000);
  };

  const nextSeason = () => {
    setGameState(prev => {
      const newSeason = prev.season + 1;
      
      if (newSeason > prev.totalSeasons) {
        const finalScore = calculateHarvestScore(prev.cropHealth, prev.budget, prev.totalSeasons);
        return {
          ...prev,
          score: finalScore,
          phase: 'harvest'
        };
      }

      return {
        ...prev,
        season: newSeason,
        decisions: [],
        phase: 'decision'
      };
    });
  };

  const unlockUpgrade = (upgradeId) => {
    const upgrade = gameState.availableUpgrades.find(u => u.id === upgradeId);
    if (upgrade && gameState.budget >= upgrade.cost) {
      setGameState(prev => ({
        ...prev,
        budget: prev.budget - upgrade.cost,
        upgrades: [...prev.upgrades, upgradeId],
        availableUpgrades: prev.availableUpgrades.map(u =>
          u.id === upgradeId ? { ...u, unlocked: true } : u
        )
      }));
    }
  };

  const resetGame = () => {
    setGameState({
      cropHealth: 65,
      budget: 300,
      season: 1,
      totalSeasons: 4,
      score: 0,
      phase: 'decision',
      currentEvent: null,
      decisions: [],
      upgrades: [],
      availableUpgrades: UPGRADES.map(u => ({ ...u, unlocked: false })),
    });
    setGameStarted(false);
    setCurrentGameMode(null);
  };


  if (!gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        {/* Animasyonlu arka plan */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 text-6xl animate-float opacity-20" style={{ animationDuration: '8s' }}>🌾</div>
          <div className="absolute top-20 right-20 text-5xl animate-float opacity-20" style={{ animationDuration: '10s', animationDelay: '1s' }}>☀️</div>
          <div className="absolute bottom-20 left-1/4 text-6xl animate-float opacity-20" style={{ animationDuration: '9s', animationDelay: '2s' }}>💧</div>
          <div className="absolute bottom-32 right-1/4 text-5xl animate-float opacity-20" style={{ animationDuration: '11s', animationDelay: '0.5s' }}>🌱</div>
        </div>

        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center relative z-10 transform hover:scale-102 transition-transform">
          <div className="text-7xl mb-4 animate-bounce-slow">🌾</div>
          <h1 className="text-5xl font-bold text-green-700 mb-4">AgriInc</h1>
          <p className="text-2xl text-gray-700 mb-6">Tarım Yönetimi Simülasyonu</p>
          
          <div className="max-w-2xl mx-auto mb-8">
            {/* Simülasyon Oyunu */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-xl text-left shadow-inner hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">📊 Strateji Simülasyonu</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-3">🛰️</div>
                  <h3 className="font-bold text-green-700 mb-2">NASA Verileri</h3>
                  <p className="text-sm text-gray-600">Gerçek NDVI ve IMERG verilerine dayalı</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">🎯</div>
                  <h3 className="font-bold text-green-700 mb-2">Strateji</h3>
                  <p className="text-sm text-gray-600">4 sezon boyunca bilinçli kararlar alın</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">🚀</div>
                  <h3 className="font-bold text-green-700 mb-2">Teknoloji</h3>
                  <p className="text-sm text-gray-600">Yeni teknolojiler açarak verimliliği artırın</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-6">
            <button
              onClick={() => {
                setGameStarted(true);
                setCurrentGameMode('simulation');
                setShowTutorial(true);
              }}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-lg font-bold rounded-xl hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all shadow-lg"
            >
              📚 Simülasyon Tutorial
            </button>
            <button
              onClick={() => {
                setGameStarted(true);
                setCurrentGameMode('simulation');
              }}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-lg font-bold rounded-xl hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all shadow-lg"
            >
              🚀 Simülasyon Başla
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            💡 İlk kez oynuyorsanız tutorial'ı öneririz
          </p>
        </div>

      </div>
    );
  }

  if (gameState.phase === 'harvest') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {/* Confetti efekti */}
        {gameState.score >= 800 && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute text-3xl animate-fall"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-50px`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              >
                {['🌾', '⭐', '🎉', '🏆', '💚'][Math.floor(Math.random() * 5)]}
              </div>
            ))}
          </div>
        )}

        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center relative z-10 animate-slide-up">
          <div className="text-7xl mb-4 animate-bounce">
            {gameState.score >= 800 ? '🏆' : gameState.score >= 500 ? '🎉' : '🌾'}
          </div>
          <h1 className="text-5xl font-bold text-yellow-600 mb-4">Hasat Zamanı!</h1>
          <div className="my-8">
            <div className="text-7xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-2 animate-pulse">
              {gameState.score}
            </div>
            <div className="text-2xl text-gray-600">Toplam Puan</div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl shadow-md transform hover:scale-105 transition-transform">
              <div className="text-3xl font-bold text-green-600">{Math.round(gameState.cropHealth)}%</div>
              <div className="text-sm text-gray-600">Bitki Sağlığı</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl shadow-md transform hover:scale-105 transition-transform">
              <div className="text-3xl font-bold text-yellow-600">{gameState.budget}₺</div>
              <div className="text-sm text-gray-600">Kalan Bütçe</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl shadow-md transform hover:scale-105 transition-transform">
              <div className="text-3xl font-bold text-blue-600">{gameState.upgrades.length}</div>
              <div className="text-sm text-gray-600">Teknoloji</div>
            </div>
          </div>
          <div className="mb-6">
            {gameState.score >= 800 && (
              <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white p-5 rounded-xl mb-4 shadow-lg animate-pulse">
                <div className="text-3xl mb-2">⭐ 🏆 ⭐</div>
                <div className="text-xl font-bold">Mükemmel! Harika bir çiftçisiniz!</div>
                <div className="text-sm mt-2 opacity-90">NASA bile sizinle gurur duyar! 🛰️</div>
              </div>
            )}
            {gameState.score >= 500 && gameState.score < 800 && (
              <div className="bg-gradient-to-r from-green-400 to-blue-400 text-white p-5 rounded-xl mb-4 shadow-lg">
                <div className="text-3xl mb-2">👍 🌾 👍</div>
                <div className="text-xl font-bold">Çok iyi! Güzel bir hasat oldu.</div>
                <div className="text-sm mt-2 opacity-90">Biraz daha geliştirme ile mükemmel olabilir!</div>
              </div>
            )}
            {gameState.score < 500 && (
              <div className="bg-gradient-to-r from-gray-400 to-gray-500 text-white p-5 rounded-xl mb-4 shadow-lg">
                <div className="text-3xl mb-2">💪 🌱 💪</div>
                <div className="text-xl font-bold">Bir sonraki sefere daha iyi olacak!</div>
                <div className="text-sm mt-2 opacity-90">Her çiftçi deneyimle büyür. Tekrar deneyin!</div>
              </div>
            )}
          </div>
          <button
            onClick={resetGame}
            className="px-12 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-xl font-bold rounded-xl hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all shadow-lg"
          >
            🔄 Yeniden Oyna
          </button>
        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-green-700">🌾 AgriInc</h1>
              <p className="text-gray-600">Türkiye Buğday Üretimi</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowTutorial(true)}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-semibold text-sm"
              >
                📚 Yardım
              </button>
              <ScoreBoard gameState={gameState} />
            </div>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Game Board */}
          <div className="lg:col-span-2">
            <GameBoard 
              cropHealth={gameState.cropHealth}
              season={gameState.season}
              totalSeasons={gameState.totalSeasons}
            />
          </div>

          {/* Right Panel - Controls */}
          <div className="space-y-6">
            {gameState.phase === 'decision' && (
              <>
                <DecisionPanel
                  gameState={gameState}
                  onDecision={handleDecision}
                  onConfirm={handleConfirmDecisions}
                  diseaseWarning={gameState.currentDiseaseWarning}
                />
                <UpgradePanel
                  upgrades={gameState.availableUpgrades}
                  budget={gameState.budget}
                  onUnlock={unlockUpgrade}
                />
              </>
            )}
          </div>
        </div>

        {/* Hastalık Uyarısı */}
        {gameState.currentDiseaseWarning && (
          <DiseaseWarning 
            warning={gameState.currentDiseaseWarning} 
            visible={true} 
          />
        )}
        {showEventCard && gameState.currentEvent && (
          <EventCard event={gameState.currentEvent} disease={gameState.currentDisease} />
        )}
        
        {showTutorial && (
          <TutorialModal onClose={() => setShowTutorial(false)} />
        )}

        <ActionFeedback 
          decisions={gameState.decisions} 
          visible={showActionFeedback}
        />
      </div>
    </div>
  );
}

export default App

