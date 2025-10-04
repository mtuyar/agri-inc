import React from 'react';
import { DECISIONS, SEASONS } from '../utils/gameLogic';

const DecisionPanel = ({ gameState, onDecision, onConfirm, diseaseWarning }) => {
  const hasWaterDecision = gameState.decisions.some(d => d.id === 'water' || d.id === 'no_water');
  const hasFertilizeDecision = gameState.decisions.some(d => d.id === 'fertilize' || d.id === 'no_fertilize');
  
  const seasonInfo = SEASONS[gameState.season] || SEASONS[1];
  const waterOptions = DECISIONS.water.getOptions(gameState.season);
  const fertilizeOptions = DECISIONS.fertilize.getOptions(gameState.season);

  const handleDecisionClick = (decision) => {
    // Eğer bu tip karar zaten verildiyse, izin verme
    if (decision.id.includes('water') && hasWaterDecision) return;
    if (decision.id.includes('fertilize') && hasFertilizeDecision) return;
    
    // Bütçe yeterli mi kontrol et
    if (gameState.budget < decision.cost) {
      alert('Yetersiz bütçe!');
      return;
    }

    onDecision(decision);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">🎯 Kararlarınız</h2>
        <p className="text-xs text-gray-500 mt-1">{seasonInfo.name} - {seasonInfo.period}</p>
      </div>
      
      {/* Sezon Uyarısı */}
      {seasonInfo.critical && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded">
          <p className="text-sm text-red-800 font-semibold">
            ⚠️ Kritik Dönem! Kararlarınız çok önemli.
          </p>
        </div>
      )}
      
      {/* Sulama Kararları */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
          💧 Sulama
          {hasWaterDecision && <span className="text-green-600">✓</span>}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {waterOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleDecisionClick(option)}
              disabled={hasWaterDecision}
              className={`p-4 rounded-xl border-2 transition-all ${
                hasWaterDecision
                  ? gameState.decisions.some(d => d.id === option.id)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-gray-50 opacity-50'
                  : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer'
              }`}
            >
              <div className="text-3xl mb-2">{option.icon}</div>
              <div className="text-sm font-semibold text-gray-800">{option.label}</div>
              <div className="text-xs text-gray-600 mt-1">
                {option.cost > 0 ? `${option.cost}₺` : 'Ücretsiz'}
              </div>
              <div className={`text-xs mt-1 ${option.effect > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {option.effect > 0 ? '+' : ''}{option.effect} sağlık
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Gübreleme Kararları */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
          🌱 Gübreleme
          {hasFertilizeDecision && <span className="text-green-600">✓</span>}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {fertilizeOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleDecisionClick(option)}
              disabled={hasFertilizeDecision}
              className={`p-4 rounded-xl border-2 transition-all ${
                hasFertilizeDecision
                  ? gameState.decisions.some(d => d.id === option.id)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-gray-50 opacity-50'
                  : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer'
              }`}
            >
              <div className="text-3xl mb-2">{option.icon}</div>
              <div className="text-sm font-semibold text-gray-800">{option.label}</div>
              <div className="text-xs text-gray-600 mt-1">
                {option.cost > 0 ? `${option.cost}₺` : 'Ücretsiz'}
              </div>
              <div className={`text-xs mt-1 font-bold ${option.effect > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {option.effect > 0 ? '+' : ''}{option.effect} sağlık
              </div>
              {option.seasonAdvice && (
                <div className="text-xs mt-1.5 font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {option.seasonAdvice}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Onay Butonu */}
      <button
        onClick={onConfirm}
        disabled={!hasWaterDecision || !hasFertilizeDecision}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
          hasWaterDecision && hasFertilizeDecision
            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transform hover:scale-105 shadow-lg cursor-pointer'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {hasWaterDecision && hasFertilizeDecision ? '✓ Kararları Onayla' : '⏳ Karar Bekliyor...'}
      </button>

      {/* HASTALIK UYARI BİLGİSİ */}
      {diseaseWarning && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-2xl">{diseaseWarning.disease.icon}</div>
            <div>
              <p className="text-sm text-red-900 font-semibold">
                ⚠️ {diseaseWarning.disease.name} Riski!
              </p>
              <p className="text-xs text-red-700">{diseaseWarning.disease.description}</p>
            </div>
          </div>
          
          <div className="bg-white/50 rounded p-2 mb-2">
            <p className="text-xs text-red-800 font-semibold mb-1">🔬 İlaçlama Tavsiyesi:</p>
            <p className="text-xs text-red-700">{diseaseWarning.treatmentAdvice}</p>
          </div>
          
          {diseaseWarning.hasProtection && (
            <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
              ✅ {diseaseWarning.protectionMessage}
            </div>
          )}
        </div>
      )}

      {/* Bilgi Notu - Sezona göre */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
        <p className="text-xs text-blue-900 font-semibold mb-1">
          💡 Sezon Önerisi
        </p>
        <p className="text-xs text-blue-800">
          {seasonInfo.phase === 'ekim' && '🍂 EKİM ZAMANI: Tohum çimlenmesi için nem şart! Toprak ıslak olmalı. Sulama ve gübreleme önemli!'}
          {seasonInfo.phase === 'kis' && '❄️ KIŞ UYKUSU: Bitkiler TOPRAK ALTINDA, göremezsiniz! Kar suyu yeterli. SULAMA GEREKSIZ - para biriktirin!'}
          {seasonInfo.phase === 'ilkbahar' && '⚠️ EN KRİTİK 3 AY! Mart-Mayıs: Bitkiler büyüyor! Sapa kalkma + Başaklanma. Su ve gübre ŞART!'}
          {seasonInfo.phase === 'hasat' && '☀️ HASAT: Tahıl olgunlaşıyor, altın rengine dönüyor. Kuru hava ideal - SULAMA ZARARLI!'}
        </p>
      </div>
    </div>
  );
};

export default DecisionPanel;

