import React from 'react';

const ActionFeedback = ({ decisions, visible }) => {
  if (!visible || !decisions || decisions.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-40 space-y-3 animate-slide-in-right">
      {decisions.map((decision, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-2xl p-4 border-l-4 border-green-500 transform transition-all hover:scale-105"
          style={{
            animation: `slideInRight 0.5s ease-out ${index * 0.2}s both, fadeOut 0.5s ease-in 2.5s both`
          }}
        >
          <div className="flex items-center gap-3">
            <div className="text-4xl">{decision.icon}</div>
            <div className="flex-1">
              <div className="font-bold text-gray-800 text-sm">{decision.label}</div>
              <div className="text-xs text-gray-600 mt-1">
                {decision.cost > 0 ? `${decision.cost}₺ harcandı` : 'Ücretsiz'}
              </div>
              <div className={`text-xs font-semibold mt-1 ${decision.effect > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {decision.effect > 0 ? '↑' : '↓'} {Math.abs(decision.effect)} sağlık etkisi
              </div>
            </div>
            <div className="text-green-600 text-2xl">✓</div>
          </div>
        </div>
      ))}

    </div>
  );
};

export default ActionFeedback;

