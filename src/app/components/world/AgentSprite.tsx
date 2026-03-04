// Pixel art agent sprite that moves in the world
import { motion } from 'motion/react';
import { useState } from 'react';

export interface AgentSpriteProps {
  id: string;
  name: string;
  role: 'artist' | 'critic' | 'collector' | 'producer';
  x: number; // percentage position
  y: number; // percentage position
  status: 'idle' | 'creating' | 'critiquing' | 'trading' | 'walking';
  onClick?: () => void;
}

export function AgentSprite({ id, name, role, x, y, status, onClick }: AgentSpriteProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getRoleColor = () => {
    switch (role) {
      case 'artist':
        return 'var(--pixel-accent-terracotta)';
      case 'critic':
        return 'var(--pixel-studio-slate)';
      case 'collector':
        return 'var(--pixel-exchange-brass)';
      case 'producer':
        return 'var(--pixel-success)';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'creating':
        return '✏️';
      case 'critiquing':
        return '🔍';
      case 'trading':
        return '💰';
      case 'walking':
        return '👣';
      default:
        return '';
    }
  };

  const getRoleIcon = () => {
    switch (role) {
      case 'artist':
        return '🎨';
      case 'critic':
        return '📝';
      case 'collector':
        return '💼';
      case 'producer':
        return '🎬';
    }
  };

  return (
    <motion.div
      className="absolute cursor-pointer select-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: Math.floor(y), // Depth sorting based on y position
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.1 }}
      animate={{
        y: status === 'walking' ? [0, -2, 0] : 0,
      }}
      transition={{
        duration: 0.6,
        repeat: status === 'walking' ? Infinity : 0,
      }}
    >
      {/* Agent sprite body */}
      <div className="relative flex flex-col items-center gap-1">
        {/* Main sprite - More grounded colors */}
        <div
          className="relative w-12 h-12 rounded flex items-center justify-center text-2xl object-shadow"
          style={{
            backgroundColor: getRoleColor(),
            border: '2px solid rgba(0,0,0,0.3)',
            boxShadow: `
              inset 1px 1px 0 rgba(255,255,255,0.15),
              inset -1px -1px 0 rgba(0,0,0,0.2),
              0 3px 6px rgba(0,0,0,0.4)
            `,
            imageRendering: 'pixelated',
          }}
        >
          {getRoleIcon()}
          
          {/* Status indicator - only show if active */}
          {status !== 'idle' && (
            <div
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs"
              style={{
                backgroundColor: 'var(--pixel-bg-dark)',
                border: '2px solid ' + getRoleColor(),
              }}
            >
              {getStatusIcon()}
            </div>
          )}
        </div>

        {/* Nameplate - Compact & only on hover */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="agent-nameplate"
          >
            {name}
          </motion.div>
        )}

        {/* Hover tooltip */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full mt-2 px-3 py-2 rounded text-xs whitespace-nowrap"
            style={{
              backgroundColor: 'var(--pixel-bg-medium)',
              border: '2px solid var(--pixel-bg-light)',
              color: 'var(--pixel-text-bright)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
              zIndex: 1000,
            }}
          >
            <div className="font-medium capitalize">{role}</div>
            <div className="text-[10px] mt-1" style={{ color: 'var(--pixel-text-muted)' }}>
              {status === 'creating' && '✏️ Creating artwork...'}
              {status === 'critiquing' && '🔍 Reviewing work...'}
              {status === 'trading' && '💰 At exchange...'}
              {status === 'walking' && '👣 Moving...'}
              {status === 'idle' && 'Click to view profile'}
            </div>
          </motion.div>
        )}

        {/* Shadow - Subtle */}
        <div
          className="absolute -bottom-2 w-10 h-2 rounded-full opacity-25"
          style={{
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)',
          }}
        />
      </div>
    </motion.div>
  );
}