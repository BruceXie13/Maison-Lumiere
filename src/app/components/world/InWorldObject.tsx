// In-world diegetic objects: frames, boards, counters, furniture
import { motion } from 'motion/react';
import { ReactNode, useState } from 'react';

export interface InWorldObjectProps {
  type: 'frame' | 'board' | 'counter' | 'easel' | 'desk' | 'sign' | 'terminal';
  x: number;
  y: number;
  width?: number;
  height?: number;
  content?: ReactNode;
  onClick?: () => void;
  badge?: string;
  isInteractive?: boolean;
}

export function InWorldObject({
  type,
  x,
  y,
  width = 60,
  height = 80,
  content,
  onClick,
  badge,
  isInteractive = true,
}: InWorldObjectProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getObjectStyle = () => {
    switch (type) {
      case 'frame':
        return {
          backgroundColor: '#2d2640',
          border: '4px solid var(--pixel-frame-border)',
          boxShadow: `
            inset 0 0 0 2px var(--pixel-frame-inner),
            4px 4px 0 rgba(0,0,0,0.3)
          `,
        };
      case 'board':
        return {
          backgroundColor: '#5a4a3a',
          border: '3px solid #3a2a1a',
          boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
        };
      case 'counter':
        return {
          backgroundColor: '#4a4460',
          border: '3px solid var(--pixel-bg-light)',
          boxShadow: 'inset 0 -8px 0 rgba(0,0,0,0.2), 4px 4px 0 rgba(0,0,0,0.3)',
        };
      case 'easel':
        return {
          backgroundColor: '#5a4a3a',
          border: '3px solid #3a2a1a',
          boxShadow: '2px 6px 0 rgba(0,0,0,0.3)',
        };
      case 'desk':
        return {
          backgroundColor: '#3d3552',
          border: '3px solid var(--pixel-bg-medium)',
          boxShadow: 'inset 0 -6px 0 rgba(0,0,0,0.2), 3px 3px 0 rgba(0,0,0,0.3)',
        };
      case 'sign':
        return {
          backgroundColor: 'var(--pixel-bg-dark)',
          border: '3px solid var(--pixel-accent-yellow)',
          boxShadow: '0 0 10px var(--pixel-accent-yellow)40',
        };
      case 'terminal':
        return {
          backgroundColor: '#1a1625',
          border: '3px solid var(--pixel-accent-blue)',
          boxShadow: '0 0 15px var(--pixel-accent-blue)60, inset 0 0 20px var(--pixel-accent-blue)20',
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      className={`absolute ${isInteractive ? 'cursor-pointer' : ''}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        width: `${width}px`,
        height: `${height}px`,
        zIndex: Math.floor(y) + 5,
      }}
      onClick={isInteractive ? onClick : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={isInteractive ? { scale: 1.02 } : {}}
    >
      <div
        className="relative w-full h-full rounded-sm flex items-center justify-center overflow-hidden"
        style={{
          ...getObjectStyle(),
          imageRendering: 'pixelated',
        }}
      >
        {content}

        {/* Badge indicator */}
        {badge && (
          <div
            className="absolute -top-2 -right-2 px-2 py-1 rounded text-xs font-bold"
            style={{
              backgroundColor: 'var(--pixel-accent-yellow)',
              color: 'var(--pixel-bg-dark)',
              border: '2px solid var(--pixel-bg-dark)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            {badge}
          </div>
        )}

        {/* Hover glow for interactive objects */}
        {isInteractive && isHovered && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            }}
          />
        )}
      </div>

      {/* Shadow */}
      <div
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-full h-2 rounded-full opacity-30"
        style={{
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)',
        }}
      />
    </motion.div>
  );
}
