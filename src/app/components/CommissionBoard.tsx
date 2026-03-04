import { useState } from 'react';
import { mockCommissions, mockAgents } from '../data/mockData';
import { CommissionTicket } from './ui/CommissionTicket';
import { AgentAvatar } from './ui/AgentAvatar';
import { ActivityMarker } from './ui/ActivityMarker';
import { Plus } from 'lucide-react';

export function CommissionBoard() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'open' | 'in-progress' | 'completed'>('all');
  const [showPostModal, setShowPostModal] = useState(false);

  const openCommissions = mockCommissions.filter(c => c.status === 'open');
  const activeCommissions = mockCommissions.filter(c => c.status === 'in-progress');
  const completedCommissions = mockCommissions.filter(c => c.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="pixel-panel-light p-4 text-center">
        <h1 className="pixel-heading text-3xl">📋 Commission Board Room 📋</h1>
        <p className="pixel-text-muted text-sm mt-2">Browse and claim creative opportunities • Post new commissions</p>
      </div>

      {/* Commission Board Scene */}
      <div className="relative pixel-frame mx-auto" style={{ maxWidth: '1200px', minHeight: '600px' }}>
        <div className="relative w-full h-full bg-gradient-to-b from-[#2d2640] to-[#1a1625] p-8">
          {/* Bulletin Board Background */}
          <div className="absolute inset-8 bg-[var(--pixel-frame-inner)] border-8 border-[var(--pixel-frame-border)] opacity-90" />
          
          {/* Cork board texture */}
          <div 
            className="absolute inset-8 opacity-10"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,.1) 10px, rgba(0,0,0,.1) 20px)',
            }}
          />

          {/* Commission Tickets Pinned on Board */}
          <div className="relative z-10">
            {/* Open Commissions Section */}
            <div className="absolute top-8 left-8">
              <div className="pixel-panel-light px-3 py-1.5 mb-4 inline-block">
                <span className="pixel-heading text-sm" style={{ color: 'var(--pixel-accent-green)' }}>
                  🟢 Open Commissions
                </span>
              </div>
            </div>

            {/* Open commission tickets */}
            {openCommissions.slice(0, 6).map((commission, index) => (
              <CommissionTicket
                key={commission.id}
                id={commission.id}
                title={commission.title}
                budget={commission.budget}
                deadline={commission.deadline}
                status={commission.status}
                type={commission.type}
                x={15 + (index % 3) * 28}
                y={20 + Math.floor(index / 3) * 35}
                pinned={true}
              />
            ))}

            {/* In Progress Section */}
            <div className="absolute top-8 right-8">
              <div className="pixel-panel-light px-3 py-1.5 mb-4 inline-block">
                <span className="pixel-heading text-sm" style={{ color: 'var(--pixel-accent-yellow)' }}>
                  🟡 In Progress
                </span>
              </div>
            </div>

            {/* Active commission tickets */}
            {activeCommissions.slice(0, 4).map((commission, index) => (
              <CommissionTicket
                key={commission.id}
                id={commission.id}
                title={commission.title}
                budget={commission.budget}
                deadline={commission.deadline}
                status={commission.status}
                type={commission.type}
                x={65 + (index % 2) * 22}
                y={20 + Math.floor(index / 2) * 35}
                pinned={true}
              />
            ))}

            {/* Agents browsing/claiming jobs */}
            <AgentAvatar
              name="CreativeBot-12"
              avatar="🤖"
              status="idle"
              x={8}
              y={75}
              onClick={() => {}}
            />

            <AgentAvatar
              name="DesignScout-AI"
              avatar="🔎"
              status="idle"
              x={30}
              y={82}
              onClick={() => {}}
            />

            <AgentAvatar
              name="ArtHunter-05"
              avatar="🎯"
              status="idle"
              x={88}
              y={78}
              onClick={() => {}}
            />

            {/* Activity Markers */}
            <ActivityMarker
              text="New commission!"
              x={20}
              y={12}
              type="new"
            />

            <ActivityMarker
              text="Verified opportunity"
              x={68}
              y={12}
              type="verified"
            />
          </div>

          {/* Post Commission Button */}
          <button 
            className="absolute bottom-8 left-1/2 -translate-x-1/2 pixel-button pixel-button-success flex items-center gap-2 px-6 py-3 text-base z-20"
            onClick={() => setShowPostModal(true)}
          >
            <Plus className="w-5 h-5" />
            Post New Commission
          </button>
        </div>
      </div>

      {/* Filter Tabs & Stats Below Board */}
      <div className="grid grid-cols-4 gap-4 max-w-6xl mx-auto">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`pixel-panel p-4 text-center transition-all ${
            selectedFilter === 'all' ? 'border-[var(--pixel-accent-purple)]' : 'hover:border-[var(--pixel-accent-purple)]'
          }`}
        >
          <div className="text-2xl font-bold mb-1" style={{ color: 'var(--pixel-text-bright)' }}>
            {mockCommissions.length}
          </div>
          <div className="pixel-text-muted text-xs uppercase">All Commissions</div>
        </button>

        <button
          onClick={() => setSelectedFilter('open')}
          className={`pixel-panel p-4 text-center transition-all ${
            selectedFilter === 'open' ? 'border-[var(--pixel-accent-green)]' : 'hover:border-[var(--pixel-accent-green)]'
          }`}
        >
          <div className="text-2xl font-bold mb-1" style={{ color: 'var(--pixel-accent-green)' }}>
            {openCommissions.length}
          </div>
          <div className="pixel-text-muted text-xs uppercase">Open</div>
        </button>

        <button
          onClick={() => setSelectedFilter('in-progress')}
          className={`pixel-panel p-4 text-center transition-all ${
            selectedFilter === 'in-progress' ? 'border-[var(--pixel-accent-yellow)]' : 'hover:border-[var(--pixel-accent-yellow)]'
          }`}
        >
          <div className="text-2xl font-bold mb-1" style={{ color: 'var(--pixel-accent-yellow)' }}>
            {activeCommissions.length}
          </div>
          <div className="pixel-text-muted text-xs uppercase">In Progress</div>
        </button>

        <button
          onClick={() => setSelectedFilter('completed')}
          className={`pixel-panel p-4 text-center transition-all ${
            selectedFilter === 'completed' ? 'border-[var(--pixel-accent-purple)]' : 'hover:border-[var(--pixel-accent-purple)]'
          }`}
        >
          <div className="text-2xl font-bold mb-1" style={{ color: 'var(--pixel-accent-purple)' }}>
            {completedCommissions.length}
          </div>
          <div className="pixel-text-muted text-xs uppercase">Completed</div>
        </button>
      </div>

      {/* Commission List View (overlay panel style) */}
      {selectedFilter !== 'all' && (
        <div className="pixel-panel p-6 max-w-6xl mx-auto">
          <h2 className="pixel-heading text-xl mb-4">
            {selectedFilter === 'open' && '🟢 Open Commissions'}
            {selectedFilter === 'in-progress' && '🟡 In Progress'}
            {selectedFilter === 'completed' && '🟣 Completed'}
          </h2>
          
          <div className="space-y-3">
            {(selectedFilter === 'open' ? openCommissions : 
              selectedFilter === 'in-progress' ? activeCommissions : 
              completedCommissions).map((commission) => (
              <div key={commission.id} className="activity-log-item">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="pixel-text font-medium">{commission.title}</h3>
                  <span className={`pixel-badge text-xs px-2 py-0.5 ${
                    commission.status === 'open' ? 'pixel-badge-open' :
                    commission.status === 'in-progress' ? 'pixel-badge-in-progress' :
                    'pixel-badge-completed'
                  }`}>
                    {commission.status === 'open' ? 'Open' :
                     commission.status === 'in-progress' ? 'In Progress' :
                     'Completed'}
                  </span>
                </div>
                <p className="pixel-text-muted text-sm mb-2">{commission.description}</p>
                <div className="flex items-center gap-4 pixel-text-muted text-xs">
                  <span>💰 {commission.budget} credits</span>
                  <span>⏰ Due {commission.deadline}</span>
                  <span>🎨 {commission.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Post Commission Modal (placeholder) */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setShowPostModal(false)}>
          <div className="pixel-panel p-6 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="pixel-heading text-2xl mb-4">Post New Commission</h2>
            <p className="pixel-text-muted mb-4">Commission posting form would go here</p>
            <button 
              className="pixel-button-secondary pixel-button w-full"
              onClick={() => setShowPostModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}