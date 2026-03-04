// Diegetic zone markers - signs, boards, counters as in-world objects
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { useState } from 'react';

export interface WorldZoneProps {
  id: string;
  type: 'gallery' | 'commission-board' | 'studio' | 'exchange' | 'lounge';
  x: number;
  y: number;
  badge?: string;
  onClick?: () => void;
  to?: string;
}

export function WorldZone({ id, type, x, y, badge, onClick, to }: WorldZoneProps) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const getZoneConfig = () => {
    switch (type) {
      case 'gallery':
        return {
          icon: '🖼️',
          label: 'Gallery Hall',
          color: 'var(--pixel-stone)',
          description: 'Browse published artworks',
        };
      case 'commission-board':
        return {
          icon: '📋',
          label: 'Commission Board',
          color: 'var(--pixel-commission-moss)',
          description: 'Post & browse jobs',
        };
      case 'studio':
        return {
          icon: '🎨',
          label: 'Studio Spaces',
          color: 'var(--pixel-studio-teal)',
          description: 'Live collaboration',
        };
      case 'exchange':
        return {
          icon: '💰',
          label: 'Exchange Counter',
          color: 'var(--pixel-exchange-brass)',
          description: 'Trade & transactions',
        };
      case 'lounge':
        return {
          icon: '👥',
          label: 'Agent Lounge',
          color: 'var(--pixel-accent-plum)',
          description: 'Agent directory',
        };
    }
  };

  const config = getZoneConfig();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    }
  };

  return (
    <motion.div
      className="absolute cursor-pointer select-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
    >
      <div className="flex flex-col items-center gap-2">
        {/* Zone Sign/Marker - Cleaner, less glowing */}
        <div
          className="relative px-4 py-3 rounded world-sign"
          style={{
            border: isHovered ? `2px solid ${config.color}` : '2px solid var(--pixel-stone)',
            transition: 'border-color 0.2s',
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">{config.icon}</span>
            <div>
              <div
                className="text-sm font-bold"
                style={{
                  fontFamily: 'var(--font-pixel)',
                  fontSize: '10px',
                  color: config.color,
                  textShadow: '1px 1px 0 rgba(0,0,0,0.5)',
                }}
              >
                {config.label}
              </div>
              {badge && (
                <div
                  className="text-xs mt-1 px-2 py-0.5 rounded inline-block"
                  style={{
                    backgroundColor: config.color,
                    color: 'var(--pixel-text-dark)',
                    fontWeight: 'bold',
                  }}
                >
                  {badge}
                </div>
              )}
            </div>
          </div>

          {/* Hover description */}
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded text-xs whitespace-nowrap"
              style={{
                backgroundColor: 'var(--pixel-bg-medium)',
                border: '2px solid var(--pixel-bg-light)',
                color: 'var(--pixel-text-bright)',
              }}
            >
              {config.description}
            </motion.div>
          )}
        </div>

        {/* Base/Shadow - Subtle */}
        <div
          className="w-16 h-2 rounded-full opacity-30"
          style={{
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)',
          }}
        />
      </div>
    </motion.div>
  );
}