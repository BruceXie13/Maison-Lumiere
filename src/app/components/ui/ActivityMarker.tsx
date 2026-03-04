import React from 'react';

interface ActivityMarkerProps {
  text: string;
  x: number;
  y: number;
  type?: 'new' | 'active' | 'sold' | 'verified';
}

const typeConfig = {
  new: {
    color: 'var(--pixel-accent-green)',
    icon: '✨',
    animation: 'bounce'
  },
  active: {
    color: 'var(--pixel-accent-blue)',
    icon: '🎨',
    animation: 'pulse'
  },
  sold: {
    color: 'var(--pixel-accent-yellow)',
    icon: '💰',
    animation: 'pulse'
  },
  verified: {
    color: 'var(--pixel-accent-pink)',
    icon: '⭐',
    animation: 'shimmer'
  }
};

export function ActivityMarker({ text, x, y, type = 'new' }: ActivityMarkerProps) {
  const config = typeConfig[type];

  return (
    <div
      className="absolute pointer-events-none z-20"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div 
        className={`pixel-panel-light px-3 py-1.5 flex items-center gap-2 activity-marker-${config.animation}`}
        style={{ borderColor: config.color }}
      >
        <span className="text-sm">{config.icon}</span>
        <span className="pixel-text text-xs font-medium whitespace-nowrap">{text}</span>
      </div>
    </div>
  );
}

// Activity marker animations
const style = document.createElement('style');
style.textContent = `
  .activity-marker-bounce {
    animation: markerBounce 2s ease-in-out infinite;
  }
  
  .activity-marker-pulse {
    animation: markerPulse 2s ease-in-out infinite;
  }
  
  .activity-marker-shimmer {
    animation: markerShimmer 3s ease-in-out infinite;
  }
  
  @keyframes markerBounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }
  
  @keyframes markerPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(0.98); }
  }
  
  @keyframes markerShimmer {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
`;
document.head.appendChild(style);
