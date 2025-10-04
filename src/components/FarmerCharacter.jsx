import React, { useState, useEffect } from 'react';

const FarmerCharacter = ({ position, direction, isMoving, currentAction }) => {
  const [animationFrame, setAnimationFrame] = useState(0);

  useEffect(() => {
    if (isMoving) {
      const interval = setInterval(() => {
        setAnimationFrame(prev => (prev + 1) % 4);
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isMoving]);

  const getCharacterStyle = () => {
    const baseStyle = {
      position: 'absolute',
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: '40px',
      height: '40px',
      transition: isMoving ? 'none' : 'all 0.3s ease',
      zIndex: 10,
      transform: direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
    };

    return baseStyle;
  };

  const getCharacterEmoji = () => {
    if (currentAction === 'planting') return '🌱';
    if (currentAction === 'watering') return '💧';
    if (currentAction === 'fertilizing') return '🌿';
    if (isMoving) {
      const walkFrames = ['🚶', '🏃', '🚶', '🏃'];
      return walkFrames[animationFrame];
    }
    return '👨‍🌾';
  };

  return (
    <div style={getCharacterStyle()}>
      <div className="text-4xl animate-bounce-slow">
        {getCharacterEmoji()}
      </div>
      
      {/* Eylem efekti */}
      {currentAction && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
          {currentAction === 'planting' && (
            <div className="text-2xl animate-ping">🌱</div>
          )}
          {currentAction === 'watering' && (
            <div className="text-2xl animate-ping">💧</div>
          )}
          {currentAction === 'fertilizing' && (
            <div className="text-2xl animate-ping">🌿</div>
          )}
        </div>
      )}
      
      {/* Gölge efekti */}
      <div 
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-black opacity-20 rounded-full"
        style={{ 
          transform: `translateX(-50%) scale(${isMoving ? 1.2 : 1})`,
          transition: 'all 0.3s ease'
        }}
      />
    </div>
  );
};

export default FarmerCharacter;

