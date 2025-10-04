import React from 'react';

const UpgradePanel = ({ upgrades, budget, onUnlock }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">🚀 Teknolojiler</h2>
      
      <div className="space-y-3">
        {upgrades.map((upgrade) => (
          <div
            key={upgrade.id}
            className={`p-4 rounded-xl border-2 transition-all ${
              upgrade.unlocked
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start gap-3">
                <div className="text-3xl">{upgrade.icon}</div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">
                    {upgrade.name}
                    {upgrade.unlocked && (
                      <span className="ml-2 text-green-600 text-xs">✓ Aktif</span>
                    )}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">{upgrade.description}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="text-sm">
                <span className="text-yellow-600 font-bold">{upgrade.cost}₺</span>
              </div>
              
              {!upgrade.unlocked && (
                <button
                  onClick={() => onUnlock(upgrade.id)}
                  disabled={budget < upgrade.cost}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    budget >= upgrade.cost
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 cursor-pointer'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Satın Al
                </button>
              )}
            </div>

            {/* Effect display */}
            {upgrade.unlocked && (
              <div className="mt-2 text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
                ⚡ +{Math.round((upgrade.effect - 1) * 100)}% Verimlilik
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="mt-4 p-3 bg-purple-50 rounded-lg">
        <p className="text-xs text-purple-800">
          💎 <strong>Teknoloji:</strong> Yeni teknolojiler satın alarak üretim verimliliğinizi artırın ve zorluklara karşı daha dayanıklı olun.
        </p>
      </div>
    </div>
  );
};

export default UpgradePanel;

