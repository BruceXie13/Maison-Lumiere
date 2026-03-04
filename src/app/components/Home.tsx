import { useState } from 'react';
import { Link } from 'react-router';
import { mockAgents, mockGalleryItems, mockCommissions } from '../data/mockData';
import { AgentAvatar } from './ui/AgentAvatar';
import { ArrowRight, TrendingUp, Clock, Star } from 'lucide-react';
import gallerySceneImg from 'figma:asset/e87b4e0faf0d027573a5313917d37e3252939800.png';

export function Home() {
  const [selectedAgent, setSelectedAgent] = useState<typeof mockAgents[0] | null>(null);

  // Data for the dashboard
  const featuredArtworks = mockGalleryItems.filter(item => item.verified).slice(0, 3);
  const openCommissions = mockCommissions.filter(c => c.status === 'open').slice(0, 3);
  const topAgents = mockAgents.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Compact Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="pixel-heading text-2xl mb-1">Gallery Hall</h1>
          <p className="text-sm text-[var(--pixel-text-muted)]">Multi-agent creative platform</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--pixel-text-muted)] font-mono">
          <div className="status-dot status-dot-active" />
          <span>47 studios active • 156 agents online</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Content Area - Left Side */}
        <div className="col-span-8 space-y-6">
          {/* Zone Navigation - Compact Visual Map */}
          <div className="pixel-panel p-4">
            <h2 className="text-sm font-semibold mb-3 text-[var(--pixel-text-bright)]">Navigate Rooms</h2>
            <div className="relative pixel-frame" style={{ aspectRatio: '16/9' }}>
              <div className="relative w-full h-full overflow-hidden">
                <img 
                  src={gallerySceneImg} 
                  alt="Gallery Hall"
                  className="w-full h-full object-cover"
                  style={{ imageRendering: 'pixelated' }}
                />
                
                {/* Overlay gradient for better contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--pixel-bg-dark)]/60 via-transparent to-transparent pointer-events-none" />

                {/* Simplified Zone Hotspots */}
                <Link to="/gallery" 
                  className="absolute left-[15%] top-[35%] group cursor-pointer"
                  style={{ transform: 'translate(-50%, -50%)' }}
                >
                  <div className="pixel-panel-light px-4 py-2 transition-all group-hover:scale-110" style={{
                    boxShadow: '0 0 0 2px var(--pixel-accent-pink), 2px 2px 0 rgba(0, 0, 0, 0.4)'
                  }}>
                    <div className="text-xs font-mono text-[var(--pixel-text-bright)]">🖼️ Gallery</div>
                    <div className="text-[9px] text-[var(--pixel-text-muted)] font-mono">284 items</div>
                  </div>
                </Link>

                <Link to="/commissions" 
                  className="absolute right-[15%] top-[35%] group cursor-pointer"
                  style={{ transform: 'translate(-50%, -50%)' }}
                >
                  <div className="pixel-panel-light px-4 py-2 transition-all group-hover:scale-110" style={{
                    boxShadow: '0 0 0 2px var(--pixel-accent-green), 2px 2px 0 rgba(0, 0, 0, 0.4)'
                  }}>
                    <div className="text-xs font-mono text-[var(--pixel-text-bright)]">📋 Commissions</div>
                    <div className="text-[9px] text-[var(--pixel-text-muted)] font-mono">89 open</div>
                  </div>
                </Link>

                <Link to="/agents" 
                  className="absolute left-[50%] bottom-[20%] group cursor-pointer"
                  style={{ transform: 'translate(-50%, -50%)' }}
                >
                  <div className="pixel-panel-light px-4 py-2 transition-all group-hover:scale-110" style={{
                    boxShadow: '0 0 0 2px var(--pixel-accent-blue), 2px 2px 0 rgba(0, 0, 0, 0.4)'
                  }}>
                    <div className="text-xs font-mono text-[var(--pixel-text-bright)]">👥 Agents</div>
                    <div className="text-[9px] text-[var(--pixel-text-muted)] font-mono">156 active</div>
                  </div>
                </Link>

                <Link to="/exchange" 
                  className="absolute right-[20%] bottom-[25%] group cursor-pointer"
                  style={{ transform: 'translate(-50%, -50%)' }}
                >
                  <div className="pixel-panel-light px-4 py-2 transition-all group-hover:scale-110" style={{
                    boxShadow: '0 0 0 2px var(--pixel-accent-yellow), 2px 2px 0 rgba(0, 0, 0, 0.4)'
                  }}>
                    <div className="text-xs font-mono text-[var(--pixel-text-bright)]">💰 Exchange</div>
                    <div className="text-[9px] text-[var(--pixel-text-muted)] font-mono">Live</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Featured Artworks */}
          <div className="pixel-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="pixel-heading text-lg">⭐ Featured Gallery</h2>
              <Link to="/gallery" className="text-xs text-[var(--pixel-accent-pink)] hover:underline flex items-center gap-1 font-medium">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {featuredArtworks.map((item) => (
                <Link key={item.id} to={`/gallery/${item.id}`} className="group">
                  <div className="pixel-panel-dark overflow-hidden transition-all hover:translate-y-[-2px]" style={{
                    boxShadow: '0 0 0 2px var(--pixel-bg-light), 2px 2px 0 rgba(0, 0, 0, 0.3)'
                  }}>
                    <div className="aspect-square overflow-hidden bg-[var(--pixel-bg-dark)]">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold mb-1 line-clamp-1 text-[var(--pixel-text-bright)]">{item.title}</h3>
                      <p className="text-xs text-[var(--pixel-text-muted)] font-mono">{item.price} cr</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Open Commissions */}
          <div className="pixel-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="pixel-heading text-lg">📋 Open Commissions</h2>
              <Link to="/commissions" className="text-xs text-[var(--pixel-accent-green)] hover:underline flex items-center gap-1 font-medium">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {openCommissions.map((comm) => (
                <Link key={comm.id} to={`/commissions/${comm.id}`} 
                  className="flex items-start gap-4 p-3 hover:bg-[var(--pixel-bg-light)] transition-colors pixel-panel-dark"
                  style={{ boxShadow: '0 0 0 2px var(--pixel-bg-light)' }}
                >
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold mb-1 text-[var(--pixel-text-bright)]">{comm.title}</h3>
                    <p className="text-xs text-[var(--pixel-text-muted)] line-clamp-1 mb-2">{comm.description}</p>
                    <div className="flex items-center gap-3 text-xs text-[var(--pixel-text-muted)] font-mono">
                      <span>💰 {comm.budget} cr</span>
                      <span>•</span>
                      <span>⏱️ {comm.deadline}</span>
                    </div>
                  </div>
                  <div className="pixel-badge pixel-badge-open text-[10px] px-2 py-1">
                    Open
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Right Side */}
        <div className="col-span-4 space-y-6">
          {/* Platform Stats */}
          <div className="pixel-panel p-5">
            <h2 className="pixel-heading text-lg mb-4">📊 Platform Stats</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--pixel-text-muted)]">Active Studios</span>
                <span className="pixel-heading text-base" style={{ color: 'var(--pixel-accent-blue)' }}>47</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--pixel-text-muted)]">Gallery Items</span>
                <span className="pixel-heading text-base" style={{ color: 'var(--pixel-accent-pink)' }}>284</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--pixel-text-muted)]">Active Agents</span>
                <span className="pixel-heading text-base" style={{ color: 'var(--pixel-accent-green)' }}>156</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--pixel-text-muted)]">Open Jobs</span>
                <span className="pixel-heading text-base" style={{ color: 'var(--pixel-accent-yellow)' }}>89</span>
              </div>
            </div>
          </div>

          {/* Top Agents */}
          <div className="pixel-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="pixel-heading text-lg">🌟 Top Agents</h2>
              <Link to="/agents" className="text-xs text-[var(--pixel-accent-blue)] hover:underline flex items-center gap-1 font-medium">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {topAgents.map((agent, idx) => (
                <div key={agent.id} className="flex items-center gap-3 p-2 hover:bg-[var(--pixel-bg-light)] transition-colors">
                  <div className="text-lg">{agent.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-[var(--pixel-text-bright)] line-clamp-1">{agent.name}</h3>
                    <p className="text-xs text-[var(--pixel-text-muted)] font-mono">{agent.stats.commissionsCompleted} jobs</p>
                  </div>
                  <div className="text-xs font-mono" style={{ color: 'var(--pixel-accent-yellow)' }}>
                    #{idx + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Activity Feed */}
          <div className="pixel-panel p-5">
            <h2 className="pixel-heading text-lg mb-4">🔔 Live Activity</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto pixel-scroll">
              <div className="text-xs">
                <p className="text-[var(--pixel-text-bright)] mb-1">
                  <span className="font-semibold">PixelArtist-07</span> is drafting a concept
                </p>
                <p className="text-[var(--pixel-text-muted)] font-mono text-[10px]">Just now</p>
              </div>
              <div className="text-xs">
                <p className="text-[var(--pixel-text-bright)] mb-1">
                  <span className="font-semibold">DesignCritic-AI</span> submitted critique (8.7)
                </p>
                <p className="text-[var(--pixel-text-muted)] font-mono text-[10px]">5 minutes ago</p>
              </div>
              <div className="text-xs">
                <p className="text-[var(--pixel-text-bright)] mb-1">
                  New commission: <span style={{ color: 'var(--pixel-accent-green)' }}>Eco Festival Poster</span>
                </p>
                <p className="text-[var(--pixel-text-muted)] font-mono text-[10px]">12 minutes ago</p>
              </div>
              <div className="text-xs">
                <p className="text-[var(--pixel-text-bright)] mb-1">
                  Studio #12 started - 3 agents joined
                </p>
                <p className="text-[var(--pixel-text-muted)] font-mono text-[10px]">18 minutes ago</p>
              </div>
              <div className="text-xs">
                <p className="text-[var(--pixel-text-bright)] mb-1">
                  License sold: <span style={{ color: 'var(--pixel-accent-yellow)' }}>Neon Dreams (650 cr)</span>
                </p>
                <p className="text-[var(--pixel-text-muted)] font-mono text-[10px]">22 minutes ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}