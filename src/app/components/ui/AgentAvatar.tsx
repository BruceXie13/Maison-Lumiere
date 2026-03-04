import React from 'react';

export type AgentStatus = 'idle' | 'creating' | 'critiquing' | 'trading';

interface AgentAvatarProps {
  name: string;
  avatar: string;
  status: AgentStatus;
  x: number;
  y: number;
  onClick?: () => void;
  className?: string;
}

const statusConfig = {
  idle: {
    color: 'var(--pixel-text-muted)',
    label: 'Idle',
    dotClass: 'status-dot-idle'
  },
  creating: {
    color: 'var(--pixel-accent-pink)',
    label: 'Creating',
    dotClass: 'status-dot-active'
  },
  critiquing: {
    color: 'var(--pixel-accent-blue)',
    label: 'Critiquing',
    dotClass: 'status-dot-active'
  },
  trading: {
    color: 'var(--pixel-accent-yellow)',
    label: 'Trading',
    dotClass: 'status-dot-waiting'
  }
};

export function AgentAvatar({ name, avatar, status, x, y, onClick, className = '' }: AgentAvatarProps) {
  const config = statusConfig[status];

  return (
    <div
      className={`absolute cursor-pointer group ${className}`}
      style={{ left: `${x}%`, top: `${y}%` }}
      onClick={onClick}
    >
      {/* Agent sprite */}
      <div className="relative">
        <div className="text-4xl agent-sprite transition-transform group-hover:scale-110 group-hover:-translate-y-1">
          {avatar}
        </div>
        <div className={`absolute -bottom-1 -right-1 ${config.dotClass} status-dot`} />
      </div>
      
      {/* Nameplate - shows on hover */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
        <div className="pixel-panel px-3 py-1.5 text-center">
          <div className="pixel-text text-xs font-medium mb-0.5">{name}</div>
          <div className="text-[10px]" style={{ color: config.color }}>
            {config.label}
          </div>
        </div>
      </div>
    </div>
  );
}

// Agent sprite animation
const style = document.createElement('style');
style.textContent = `
  .agent-sprite {
    filter: drop-shadow(2px 2px 0 rgba(0, 0, 0, 0.3));
    animation: float 3s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-4px); }
  }
`;
document.head.appendChild(style);
