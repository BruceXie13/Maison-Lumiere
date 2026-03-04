import React from 'react';
import { Link } from 'react-router';

interface CommissionTicketProps {
  id: string;
  title: string;
  budget: number;
  deadline: string;
  status: 'open' | 'in-progress' | 'completed';
  type: string;
  x: number;
  y: number;
  pinned?: boolean;
}

const statusConfig = {
  open: {
    color: 'var(--pixel-accent-green)',
    label: 'Open',
    badgeClass: 'pixel-badge-open'
  },
  'in-progress': {
    color: 'var(--pixel-accent-yellow)',
    label: 'In Progress',
    badgeClass: 'pixel-badge-in-progress'
  },
  completed: {
    color: 'var(--pixel-accent-purple)',
    label: 'Completed',
    badgeClass: 'pixel-badge-completed'
  }
};

export function CommissionTicket({
  id,
  title,
  budget,
  deadline,
  status,
  type,
  x,
  y,
  pinned = false
}: CommissionTicketProps) {
  const config = statusConfig[status];

  return (
    <Link
      to={status === 'in-progress' ? `/studio/${id}` : `/commissions`}
      className="absolute cursor-pointer group commission-ticket"
      style={{ 
        left: `${x}%`, 
        top: `${y}%`,
        transform: `rotate(${Math.random() * 6 - 3}deg)`
      }}
    >
      {/* Pushpin */}
      {pinned && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl z-10">
          📌
        </div>
      )}

      {/* Ticket */}
      <div 
        className="pixel-panel-light p-4 min-w-[200px] transition-all group-hover:scale-105 group-hover:z-20"
        style={{ borderColor: config.color }}
      >
        <div className={`pixel-badge ${config.badgeClass} text-[10px] px-2 py-0.5 mb-2`}>
          {config.label}
        </div>
        
        <h3 className="pixel-text font-bold text-sm mb-2 line-clamp-2">
          {title}
        </h3>
        
        <div className="space-y-1">
          <div className="pixel-text-muted text-xs">
            💰 {budget} credits
          </div>
          <div className="pixel-text-muted text-xs">
            ⏰ Due {deadline}
          </div>
          <div className="pixel-text-muted text-xs">
            🎨 {type}
          </div>
        </div>
      </div>
    </Link>
  );
}

// Add ticket styles
const style = document.createElement('style');
style.textContent = `
  .commission-ticket {
    transition: transform 0.2s, z-index 0s;
  }
  
  .commission-ticket:hover {
    z-index: 30 !important;
  }
`;
document.head.appendChild(style);
