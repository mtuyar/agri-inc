import React from 'react';

const CropHealth = ({ health }) => {
  const getHealthStatus = () => {
    if (health >= 70) return { text: 'Mükemmel', color: 'green', emoji: '😊' };
    if (health >= 50) return { text: 'İyi', color: 'yellow', emoji: '😐' };
    if (health >= 30) return { text: 'Zayıf', color: 'orange', emoji: '😟' };
    return { text: 'Kritik', color: 'red', emoji: '😰' };
  };

  const status = getHealthStatus();

  const getBarColor = () => {
    if (health >= 70) return 'bg-gradient-to-r from-green-400 to-green-600';
    if (health >= 50) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
    if (health >= 30) return 'bg-gradient-to-r from-orange-400 to-orange-600';
    return 'bg-gradient-to-r from-red-400 to-red-600';
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{status.emoji}</span>
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Bitki Sağlığı (NDVI)</h3>
            <p className="text-xs text-gray-500">Normalized Difference Vegetation Index</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-800">{Math.round(health)}%</div>
          <div className={`text-sm font-semibold text-${status.color}-600`}>{status.text}</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full ${getBarColor()} transition-all duration-700 ease-out flex items-center justify-end pr-3`}
          style={{ width: `${health}%` }}
        >
          <span className="text-white font-bold text-sm drop-shadow">
            {Math.round(health)}%
          </span>
        </div>
      </div>

      {/* Health indicators */}
      <div className="grid grid-cols-4 gap-2 mt-3">
        <div className={`text-center p-2 rounded ${health >= 75 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
          <div className="text-xs font-semibold">75+</div>
          <div className="text-xs">Harika</div>
        </div>
        <div className={`text-center p-2 rounded ${health >= 50 && health < 75 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-400'}`}>
          <div className="text-xs font-semibold">50-74</div>
          <div className="text-xs">İyi</div>
        </div>
        <div className={`text-center p-2 rounded ${health >= 25 && health < 50 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-400'}`}>
          <div className="text-xs font-semibold">25-49</div>
          <div className="text-xs">Zayıf</div>
        </div>
        <div className={`text-center p-2 rounded ${health < 25 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-400'}`}>
          <div className="text-xs font-semibold">0-24</div>
          <div className="text-xs">Kritik</div>
        </div>
      </div>
    </div>
  );
};

export default CropHealth;

