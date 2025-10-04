import React from 'react';

const ScoreBoard = ({ gameState }) => {
  return (
    <div className="flex gap-4 flex-wrap">
      {/* Budget */}
      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 px-4 py-3 rounded-xl shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💰</span>
          <div>
            <div className="text-xs text-yellow-700 font-semibold">Bütçe</div>
            <div className="text-xl font-bold text-yellow-800">{gameState.budget}₺</div>
          </div>
        </div>
      </div>

      {/* Season Progress */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-3 rounded-xl shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📅</span>
          <div>
            <div className="text-xs text-blue-700 font-semibold">Sezon</div>
            <div className="text-xl font-bold text-blue-800">
              {gameState.season} / {gameState.totalSeasons}
            </div>
          </div>
        </div>
      </div>

      {/* Active Upgrades */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 px-4 py-3 rounded-xl shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚀</span>
          <div>
            <div className="text-xs text-purple-700 font-semibold">Teknoloji</div>
            <div className="text-xl font-bold text-purple-800">{gameState.upgrades.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;

