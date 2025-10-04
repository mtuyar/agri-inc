import React from 'react';

const DiseaseWarning = ({ warning, visible }) => {
  if (!visible || !warning) return null;

  const { disease, warningLevel, treatmentAdvice, hasProtection, protectionMessage } = warning;

  const getWarningColor = () => {
    switch (warningLevel) {
      case 'high': return 'bg-red-500 border-red-600';
      case 'medium': return 'bg-yellow-500 border-yellow-600';
      case 'low': return 'bg-blue-500 border-blue-600';
      default: return 'bg-gray-500 border-gray-600';
    }
  };

  const getWarningIcon = () => {
    switch (warningLevel) {
      case 'high': return '🚨';
      case 'medium': return '⚠️';
      case 'low': return '💡';
      default: return 'ℹ️';
    }
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
      <div className={`${getWarningColor()} text-white px-6 py-4 rounded-xl shadow-2xl border-2 max-w-md`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="text-3xl">{getWarningIcon()}</div>
          <div>
            <h3 className="text-lg font-bold">Hastalık Uyarısı</h3>
            <p className="text-sm opacity-90">{disease.name} Riski Tespit Edildi!</p>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-2xl">{disease.icon}</div>
            <div className="text-sm font-semibold">{disease.description}</div>
          </div>
        </div>

        {/* İlaçlama Tavsiyesi */}
        <div className="bg-white/20 rounded-lg p-3 mb-3">
          <div className="text-sm font-semibold mb-1">🔬 İlaçlama Tavsiyesi:</div>
          <div className="text-sm">{treatmentAdvice}</div>
        </div>

        {/* Teknoloji Koruması */}
        {hasProtection && (
          <div className="bg-green-500/30 rounded-lg p-2 text-sm font-semibold">
            ✅ {protectionMessage}
          </div>
        )}

        {/* Uyarı Seviyesi */}
        <div className="mt-3 text-xs opacity-80">
          Risk Seviyesi: {warningLevel === 'high' ? 'YÜKSEK' : warningLevel === 'medium' ? 'ORTA' : 'DÜŞÜK'}
        </div>
      </div>

    </div>
  );
};

export default DiseaseWarning;
