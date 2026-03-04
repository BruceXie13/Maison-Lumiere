import React from 'react';
import { X } from 'lucide-react';

interface AgentProfilePopoverProps {
  agent: {
    name: string;
    avatar: string;
    role: string;
    specialties: string[];
    stats: {
      commissionsCompleted: number;
      completionRate: number;
      avgScore: number;
      credits: number;
    };
  };
  onClose: () => void;
}

export function AgentProfilePopover({ agent, onClose }: AgentProfilePopoverProps) {
  const roleColor = agent.role === 'artist' 
    ? 'var(--pixel-accent-pink)' 
    : agent.role === 'critic'
    ? 'var(--pixel-accent-blue)'
    : 'var(--pixel-accent-green)';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div className="pixel-panel p-6 max-w-md w-full relative" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-[var(--pixel-bg-light)] transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Agent header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="text-6xl">{agent.avatar}</div>
          <div className="flex-1">
            <h2 className="pixel-heading text-xl mb-2">{agent.name}</h2>
            <div 
              className="inline-block pixel-badge text-xs px-3 py-1 mb-3"
              style={{ 
                background: roleColor, 
                borderColor: roleColor,
                color: 'var(--pixel-bg-dark)'
              }}
            >
              {agent.role}
            </div>
          </div>
        </div>

        {/* Specialties */}
        <div className="mb-6">
          <h3 className="pixel-heading text-sm mb-3">Specialties</h3>
          <div className="flex flex-wrap gap-2">
            {agent.specialties.map((specialty, index) => (
              <span 
                key={index}
                className="pixel-panel-dark px-3 py-1 text-xs pixel-text-muted"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="pixel-panel-dark p-3 text-center">
            <div className="text-2xl font-bold" style={{ color: 'var(--pixel-accent-yellow)' }}>
              {agent.stats.commissionsCompleted}
            </div>
            <div className="pixel-text-muted text-[10px] uppercase mt-1">Completed</div>
          </div>
          
          <div className="pixel-panel-dark p-3 text-center">
            <div className="text-2xl font-bold" style={{ color: 'var(--pixel-accent-green)' }}>
              {agent.stats.completionRate}%
            </div>
            <div className="pixel-text-muted text-[10px] uppercase mt-1">Success Rate</div>
          </div>
          
          <div className="pixel-panel-dark p-3 text-center">
            <div className="text-2xl font-bold" style={{ color: 'var(--pixel-accent-blue)' }}>
              {agent.stats.avgScore}
            </div>
            <div className="pixel-text-muted text-[10px] uppercase mt-1">Avg Score</div>
          </div>
          
          <div className="pixel-panel-dark p-3 text-center">
            <div className="text-2xl font-bold" style={{ color: 'var(--pixel-accent-pink)' }}>
              {agent.stats.credits}
            </div>
            <div className="pixel-text-muted text-[10px] uppercase mt-1">Credits</div>
          </div>
        </div>

        {/* Action button */}
        <button className="pixel-button pixel-button-success w-full mt-6 text-sm">
          View Full Profile
        </button>
      </div>
    </div>
  );
}
