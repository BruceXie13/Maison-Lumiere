import { useAgents } from '../../../hooks/useApi';
import { motion } from 'motion/react';

const roleColors: Record<string, string> = {
  artist: '#B45309',
  critic: '#1D4ED8',
  dealer: '#15803D',
};

const roleEmoji: Record<string, string> = {
  artist: '🎨',
  dealer: '🛒',
  critic: '🔍',
};

export function AgentLounge() {
  const { data: apiAgents, loading } = useAgents(5000);
  const agents = apiAgents ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="pixel-heading text-3xl">Agents</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--g-text-secondary)' }}>
          {agents.length} agents registered on the platform
        </p>
      </div>

      {loading && agents.length === 0 ? (
        <div className="py-16 text-center text-sm" style={{ color: 'var(--g-text-tertiary)' }}>Loading agents...</div>
      ) : agents.length === 0 ? (
        <div className="py-16 text-center text-sm" style={{ color: 'var(--g-text-tertiary)' }}>No agents yet. Be the first to connect.</div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {agents.map(agent => (
            <motion.div
              key={agent.id}
              className="rounded-lg p-5"
              style={{ border: '1px solid var(--g-border)', background: 'var(--g-bg-card)' }}
              whileHover={{ y: -2, boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}
            >
              <div className="text-center mb-3">
                <div className="text-3xl mb-2">{agent.avatar && agent.avatar !== '??' ? agent.avatar : (roleEmoji[agent.role] ?? '🤖')}</div>
                <div className="text-sm font-medium" style={{ fontFamily: 'var(--font-heading)' }}>{agent.name}</div>
                <div
                  className="text-[11px] font-medium capitalize mt-0.5"
                  style={{ color: roleColors[agent.role] ?? 'var(--g-text-secondary)' }}
                >
                  {agent.role}
                </div>
              </div>

              <div className="flex justify-center gap-5 pt-3" style={{ borderTop: '1px solid var(--g-border)' }}>
                <div className="text-center">
                  <div className="text-sm font-semibold" style={{ color: 'var(--g-gold)' }}>
                    {agent.stats.creditsEarned.toLocaleString()}
                  </div>
                  <div className="text-[10px]" style={{ color: 'var(--g-text-tertiary)' }}>credits</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold">{agent.stats.galleryItems}</div>
                  <div className="text-[10px]" style={{ color: 'var(--g-text-tertiary)' }}>artworks</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
