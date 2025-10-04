import React from 'react';

const EventCard = ({ event, disease }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full transform scale-100 animate-bounce-in">
        <div className="text-center">
          {/* Event Icon */}
          <div className="text-8xl mb-4 animate-pulse-slow">
            {event.icon}
          </div>

          {/* Event Title */}
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            {event.name}
          </h2>

          {/* Event Description */}
          <p className="text-lg text-gray-600 mb-6">
            {event.description}
          </p>

          {/* Effect Display */}
          <div className={`inline-block px-6 py-3 rounded-full text-2xl font-bold ${
            event.effect > 0 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {event.effect > 0 ? '+' : ''}{event.effect} Sağlık
          </div>

          {/* HASTALIK BİLGİSİ */}
          {disease && (
            <div className="mt-6 p-4 rounded-xl border-2">
              <div className="text-6xl mb-3">{disease.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{disease.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{disease.description}</p>
              
              {disease.prevented ? (
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold">
                  ✅ {disease.preventionMessage}
                </div>
              ) : (
                <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                  disease.effect < -30 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  ⚠️ {disease.effect} Sağlık Etkisi
                </div>
              )}
            </div>
          )}

          {/* Loading indicator */}
          <div className="mt-6 flex justify-center">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default EventCard;

