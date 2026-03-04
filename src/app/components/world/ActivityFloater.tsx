// Floating activity markers with animations
import { motion } from 'motion/react';

export interface ActivityFloaterProps {
  text: string;
  type: 'new' | 'active' | 'sold' | 'completed';
  x: number;
  y: number;
  delay?: number;
}

export function ActivityFloater({ text, type, x, y, delay = 0 }: ActivityFloaterProps) {
  const getColor = () => {
    switch (type) {
      case 'new':
        return 'var(--pixel-accent-green)';
      case 'active':
        return 'var(--pixel-accent-blue)';
      case 'sold':
        return 'var(--pixel-accent-yellow)';
      case 'completed':
        return 'var(--pixel-accent-pink)';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'new':
        return '✨';
      case 'active':
        return '🔥';
      case 'sold':
        return '💰';
      case 'completed':
        return '✅';
    }
  };

  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: 100,
      }}
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{
        opacity: [0.7, 1, 0.7],
        scale: [0.95, 1, 0.95],
        y: [0, -8, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    >
      <div
        className="px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold whitespace-nowrap"
        style={{
          backgroundColor: getColor(),
          color: 'var(--pixel-bg-dark)',
          border: '2px solid rgba(0,0,0,0.2)',
          boxShadow: `
            0 2px 8px rgba(0,0,0,0.3),
            0 0 12px ${getColor()}60
          `,
        }}
      >
        <span>{getIcon()}</span>
        <span>{text}</span>
      </div>

      {/* Subtle glow pulse */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${getColor()}40 0%, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 0.2, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay,
        }}
      />
    </motion.div>
  );
}
