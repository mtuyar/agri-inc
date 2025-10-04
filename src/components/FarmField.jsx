import React, { useState, useEffect } from 'react';

const FarmField = ({ 
  fieldId, 
  position, 
  state, 
  onAction, 
  isPlayerNearby, 
  season,
  cropType = 'wheat'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [actionCooldown, setActionCooldown] = useState(0);

  useEffect(() => {
    if (actionCooldown > 0) {
      const timer = setTimeout(() => setActionCooldown(actionCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [actionCooldown]);

  const getFieldStyle = () => {
    const baseStyle = {
      position: 'absolute',
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: '60px',
      height: '60px',
      borderRadius: '8px',
      cursor: isPlayerNearby && actionCooldown === 0 ? 'pointer' : 'default',
      transition: 'all 0.3s ease',
      border: isPlayerNearby ? '2px solid #10b981' : '1px solid #6b7280',
      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
      zIndex: 5,
    };

    // Duruma göre arka plan rengi
    switch (state) {
      case 'empty':
        baseStyle.backgroundColor = '#f3f4f6';
        baseStyle.borderColor = '#9ca3af';
        break;
      case 'planted':
        baseStyle.backgroundColor = '#dcfce7';
        baseStyle.borderColor = '#22c55e';
        break;
      case 'growing':
        baseStyle.backgroundColor = '#bbf7d0';
        baseStyle.borderColor = '#16a34a';
        break;
      case 'ready':
        baseStyle.backgroundColor = '#fef3c7';
        baseStyle.borderColor = '#f59e0b';
        break;
      case 'harvested':
        baseStyle.backgroundColor = '#f3f4f6';
        baseStyle.borderColor = '#6b7280';
        break;
      default:
        baseStyle.backgroundColor = '#f3f4f6';
    }

    return baseStyle;
  };

  const getFieldEmoji = () => {
    if (actionCooldown > 0) {
      return '⏳';
    }

    switch (state) {
      case 'empty':
        return '🟫';
      case 'planted':
        return '🌱';
      case 'growing':
        return season === 3 ? '🌾' : '🌿';
      case 'ready':
        return '🌾';
      case 'harvested':
        return '📦';
      default:
        return '🟫';
    }
  };

  const getFieldText = () => {
    if (actionCooldown > 0) return `${actionCooldown}s`;
    
    switch (state) {
      case 'empty':
        return isPlayerNearby ? 'Ekmek için Space' : '';
      case 'planted':
        return isPlayerNearby ? 'Sulamak için Space' : '';
      case 'growing':
        return isPlayerNearby ? 'Gübrelemek için Space' : '';
      case 'ready':
        return isPlayerNearby ? 'Hasat için Space' : '';
      case 'harvested':
        return 'Hasat edildi';
      default:
        return '';
    }
  };

  const handleClick = () => {
    if (isPlayerNearby && actionCooldown === 0) {
      onAction(fieldId);
      setActionCooldown(3); // 3 saniye cooldown
    }
  };

  return (
    <div
      style={getFieldStyle()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      className="flex flex-col items-center justify-center text-xs font-semibold"
    >
      <div className="text-2xl mb-1">
        {getFieldEmoji()}
      </div>
      <div className="text-xs text-center leading-tight">
        {getFieldText()}
      </div>
      
      {/* Büyüme çubuğu */}
      {state === 'growing' && (
        <div className="absolute -bottom-1 left-1 right-1 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-1000"
            style={{ width: '60%' }}
          />
        </div>
      )}
      
      {/* Parçacık efektleri */}
      {state === 'planted' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-lg animate-bounce">
            🌱
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmField;
