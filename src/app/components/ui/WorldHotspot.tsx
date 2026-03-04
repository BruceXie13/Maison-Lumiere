import React from 'react';
import { Link } from 'react-router';

interface WorldHotspotProps {
  label: string;
  icon: string;
  to: string;
  x: number;
  y: number;
  badge?: string;
  badgeColor?: string;
  description?: string;
}

export function WorldHotspot({ 
  label, 
  icon, 
  to, 
  x, 
  y, 
  badge, 
  badgeColor = 'var(--pixel-accent-yellow)',
  description 
}: WorldHotspotProps) {
  return (
    <Link
      to={to}
      className="absolute group cursor-pointer"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {/* Hotspot marker */}
      <div className="relative">
        {/* Pulsing ring */}
        <div className="absolute inset-0 -m-2 rounded-full border-2 border-white/30 animate-ping" />
        
        {/* Icon container */}
        <div className="relative bg-[var(--pixel-bg-medium)] border-3 border-[var(--pixel-accent-purple)] px-4 py-3 transition-all group-hover:scale-110 group-hover:-translate-y-1 group-hover:border-[var(--pixel-accent-yellow)]">
          <div className="text-3xl">{icon}</div>
          
          {/* Badge indicator */}
          {badge && (
            <div 
              className="absolute -top-2 -right-2 pixel-badge text-[10px] px-2 py-0.5 font-bold"
              style={{ 
                background: badgeColor,
                color: 'var(--pixel-bg-dark)',
                borderColor: badgeColor 
              }}
            >
              {badge}
            </div>
          )}
        </div>
      </div>
      
      {/* Tooltip sign */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
        <div className="relative">
          {/* Sign post */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-4 bg-[var(--pixel-frame-inner)]" />
          
          {/* Sign board */}
          <div className="pixel-panel-light px-4 py-2 text-center relative">
            <div className="pixel-heading text-sm mb-1">{label}</div>
            {description && (
              <div className="pixel-text-muted text-[10px]">{description}</div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// Pulsing animation
const style = document.createElement('style');
style.textContent = `
  @keyframes ping {
    75%, 100% {
      transform: scale(1.5);
      opacity: 0;
    }
  }
  
  .animate-ping {
    animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
`;
document.head.appendChild(style);
