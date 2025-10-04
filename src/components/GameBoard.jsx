import React from 'react';
import TurkeyMap from './TurkeyMap';
import CropHealth from './CropHealth';
import { SEASONS } from '../utils/gameLogic';

const GameBoard = ({ cropHealth, season, totalSeasons }) => {
  const seasonInfo = SEASONS[season] || SEASONS[1];
  const isCritical = seasonInfo.critical;
  
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Gelişmiş Sezon Göstergesi - ZAMAN SİMÜLASYONU */}
      <div className="mb-6 bg-gradient-to-r from-amber-50 via-green-50 to-blue-50 rounded-xl p-5 shadow-md border-2 border-amber-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <div className="text-5xl animate-bounce">{seasonInfo.icon}</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{seasonInfo.name}</h2>
              <p className="text-sm text-gray-600 font-semibold">
                📅 {seasonInfo.period} • 🌡️ {seasonInfo.temp}
              </p>
              <p className="text-xs text-gray-500 italic mt-1">{seasonInfo.description}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-green-700">
              {season === 1 && '🍂'}
              {season === 2 && '❄️'}
              {season === 3 && '🌸'}
              {season === 4 && '☀️'}
              <span className="ml-2 text-2xl">{season}/4</span>
            </p>
            <p className="text-xs text-gray-500 font-medium mt-1">1 Yıllık Döngü</p>
            {isCritical && (
              <span className="inline-block mt-2 px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-full animate-pulse shadow-lg">
                ⚠️ KRİTİK DÖNEM
              </span>
            )}
          </div>
        </div>
        
        {/* Zaman çizelgesi - Mevsim geçişi */}
        <div className="flex items-center gap-3 mt-4">
          <div className="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden shadow-inner">
            <div 
              className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-amber-400 via-green-400 to-blue-400 relative"
              style={{ width: `${(season / totalSeasons) * 100}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            </div>
          </div>
          <span className="text-sm font-bold text-gray-700 whitespace-nowrap px-3 py-1 bg-white rounded-full shadow">
            {season === 1 ? '🌱 EKİM' : season === 2 ? '💤 KIŞ' : season === 3 ? '🌿 BÜYÜME' : '🌾 HASAT'}
          </span>
        </div>

        {/* Ay göstergesi */}
        <div className="mt-3 flex gap-1">
          {season === 1 && (
            <>
              <div className="flex-1 h-2 bg-amber-400 rounded animate-pulse"></div>
              <div className="flex-1 h-2 bg-amber-300 rounded"></div>
            </>
          )}
          {season === 2 && (
            <>
              <div className="flex-1 h-2 bg-blue-300 rounded animate-pulse"></div>
              <div className="flex-1 h-2 bg-blue-200 rounded"></div>
              <div className="flex-1 h-2 bg-blue-100 rounded"></div>
            </>
          )}
          {season === 3 && (
            <>
              <div className="flex-1 h-2 bg-green-400 rounded animate-pulse"></div>
              <div className="flex-1 h-2 bg-green-300 rounded animate-pulse"></div>
              <div className="flex-1 h-2 bg-green-200 rounded animate-pulse"></div>
            </>
          )}
          {season === 4 && (
            <>
              <div className="flex-1 h-2 bg-yellow-400 rounded animate-pulse"></div>
              <div className="flex-1 h-2 bg-yellow-300 rounded"></div>
            </>
          )}
        </div>
      </div>

      {/* Turkey Map with Field - MEVSIM BAZLI */}
      <TurkeyMap cropHealth={cropHealth} season={season} />

      {/* Crop Health Display */}
      <CropHealth health={cropHealth} />

      {/* NASA Data Indicators */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-blue-600 font-semibold mb-1">NASA IMERG</div>
              <div className="text-sm text-gray-700">Yağış Verisi</div>
            </div>
            <div className="text-3xl">💧</div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-blue-700">
              {Math.round(Math.random() * 50 + 20)}%
            </div>
            <div className="text-xs text-gray-600">Olasılık</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-green-600 font-semibold mb-1">NASA NDVI</div>
              <div className="text-sm text-gray-700">Bitki Sağlığı</div>
            </div>
            <div className="text-3xl">📊</div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-green-700">
              {(cropHealth / 100).toFixed(2)}
            </div>
            <div className="text-xs text-gray-600">İndeks</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;

