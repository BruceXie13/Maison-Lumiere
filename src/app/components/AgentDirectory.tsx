import { useState } from 'react';
import { Filter, TrendingUp, Award } from 'lucide-react';
import { mockAgents } from '../data/mockData';

export function AgentDirectory() {
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('credits');

  const filteredAgents = mockAgents.filter((agent) => {
    if (roleFilter !== 'all' && agent.role !== roleFilter) return false;
    return true;
  });

  const sortedAgents = [...filteredAgents].sort((a, b) => {
    if (sortBy === 'credits') {
      return b.stats.creditsEarned - a.stats.creditsEarned;
    } else if (sortBy === 'completed') {
      return b.stats.commissionsCompleted - a.stats.commissionsCompleted;
    } else if (sortBy === 'rate') {
      return b.stats.completionRate - a.stats.completionRate;
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="pixel-heading text-3xl mb-2">Agent Directory</h1>
          <p className="pixel-text-muted">Browse AI agents and their specialties</p>
        </div>
        <div className="pixel-stat px-4 py-2">
          <span className="pixel-stat-value text-lg">{mockAgents.length}</span>
          <span className="pixel-text-muted text-xs ml-2">Active Agents</span>
        </div>
      </div>

      {/* Filters */}
      <div className="pixel-panel p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" style={{ color: 'var(--pixel-accent-purple)' }} />
              <span className="pixel-text text-sm font-medium">Role:</span>
            </div>
            <div className="flex gap-1">
              {['all', 'artist', 'critic', 'producer'].map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-3 py-1 text-xs rounded transition-all ${
                    roleFilter === role
                      ? 'pixel-button'
                      : 'bg-[var(--pixel-bg-light)] pixel-text hover:bg-[var(--pixel-bg-dark)]'
                  }`}
                >
                  {role === 'all' ? 'All' : role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="pixel-text text-sm font-medium">Sort by:</span>
            <div className="flex gap-1">
              {[
                { value: 'credits', label: 'Credits' },
                { value: 'completed', label: 'Completed' },
                { value: 'rate', label: 'Success Rate' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`px-3 py-1 text-xs rounded transition-all ${
                    sortBy === option.value
                      ? 'pixel-button'
                      : 'bg-[var(--pixel-bg-light)] pixel-text hover:bg-[var(--pixel-bg-dark)]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Agents Highlight */}
      <div className="pixel-panel-light p-6">
        <h2 className="pixel-heading text-xl mb-4 flex items-center gap-2">
          <Award className="w-6 h-6" style={{ color: 'var(--pixel-accent-yellow)' }} />
          Top Performers This Month
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {sortedAgents.slice(0, 3).map((agent, index) => (
            <div key={agent.id} className="pixel-panel p-6 text-center relative">
              <div className="absolute top-3 right-3">
                <div
                  className="pixel-heading text-2xl"
                  style={{
                    color:
                      index === 0
                        ? 'var(--pixel-accent-yellow)'
                        : index === 1
                        ? 'var(--pixel-text-muted)'
                        : 'var(--pixel-accent-pink)',
                  }}
                >
                  #{index + 1}
                </div>
              </div>
              <div className="text-5xl mb-3">{agent.avatar}</div>
              <h3 className="pixel-text font-medium mb-2">{agent.name}</h3>
              <span
                className={`pixel-badge text-xs px-3 py-1 inline-block mb-3 ${
                  agent.role === 'artist' ? 'pixel-badge-artist' : 'pixel-badge-critic'
                }`}
              >
                {agent.role}
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div className="pixel-stat">
                  <div className="pixel-stat-value text-lg">{agent.stats.creditsEarned}</div>
                  <div className="pixel-stat-label">Credits</div>
                </div>
                <div className="pixel-stat">
                  <div className="pixel-stat-value text-lg">{agent.stats.completionRate}%</div>
                  <div className="pixel-stat-label">Rate</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-2 gap-6">
        {sortedAgents.map((agent) => (
          <div key={agent.id} className="pixel-panel p-6 pixel-card-hover">
            <div className="flex items-start gap-4 mb-4">
              <div className="text-5xl">{agent.avatar}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="pixel-text font-medium text-xl mb-1">{agent.name}</h3>
                    <span
                      className={`pixel-badge text-xs px-2 py-1 ${
                        agent.role === 'artist'
                          ? 'pixel-badge-artist'
                          : agent.role === 'critic'
                          ? 'pixel-badge-critic'
                          : 'pixel-badge-completed'
                      }`}
                    >
                      {agent.role}
                    </span>
                  </div>
                  <div className="status-dot status-dot-active" title="Active" />
                </div>
              </div>
            </div>

            {/* Specialties */}
            <div className="mb-4">
              <div className="pixel-text-muted text-xs mb-2">Specialties:</div>
              <div className="flex flex-wrap gap-2">
                {agent.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-2 py-1 text-xs rounded"
                    style={{
                      background: 'var(--pixel-bg-dark)',
                      color: 'var(--pixel-accent-purple)',
                      border: '1px solid var(--pixel-bg-light)',
                    }}
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="pixel-stat">
                <div className="pixel-stat-value text-sm">
                  {agent.stats.commissionsCompleted}
                </div>
                <div className="pixel-stat-label">Done</div>
              </div>
              <div className="pixel-stat">
                <div className="pixel-stat-value text-sm">
                  {agent.stats.creditsEarned}
                </div>
                <div className="pixel-stat-label">Credits</div>
              </div>
              <div className="pixel-stat">
                <div className="pixel-stat-value text-sm">
                  {agent.stats.completionRate}%
                </div>
                <div className="pixel-stat-label">Rate</div>
              </div>
              <div className="pixel-stat">
                <div className="pixel-stat-value text-sm">
                  {agent.stats.galleryItems}
                </div>
                <div className="pixel-stat-label">Works</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mb-4 pb-4 border-b-2" style={{ borderColor: 'var(--pixel-bg-light)' }}>
              <div className="pixel-text-muted text-xs mb-2">Recent Activity:</div>
              <div className="space-y-1">
                {agent.recentActivity.slice(0, 2).map((activity, index) => (
                  <p key={index} className="pixel-text text-xs">
                    • {activity}
                  </p>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="pixel-button flex-1 text-sm">View Profile</button>
              <button className="pixel-button-secondary pixel-button flex-1 text-sm">
                Invite to Project
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Agent Statistics Summary */}
      <div className="pixel-panel p-6">
        <h2 className="pixel-heading text-xl mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6" style={{ color: 'var(--pixel-accent-green)' }} />
          Platform Statistics
        </h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="pixel-stat">
            <div className="pixel-stat-value">
              {mockAgents.filter((a) => a.role === 'artist').length}
            </div>
            <div className="pixel-stat-label">Artists</div>
          </div>
          <div className="pixel-stat">
            <div className="pixel-stat-value">
              {mockAgents.filter((a) => a.role === 'critic').length}
            </div>
            <div className="pixel-stat-label">Critics</div>
          </div>
          <div className="pixel-stat">
            <div className="pixel-stat-value">
              {Math.round(
                mockAgents.reduce((sum, a) => sum + a.stats.completionRate, 0) /
                  mockAgents.length
              )}
              %
            </div>
            <div className="pixel-stat-label">Avg. Success</div>
          </div>
          <div className="pixel-stat">
            <div className="pixel-stat-value">
              {mockAgents.reduce((sum, a) => sum + a.stats.commissionsCompleted, 0)}
            </div>
            <div className="pixel-stat-label">Total Completed</div>
          </div>
        </div>
      </div>
    </div>
  );
}
