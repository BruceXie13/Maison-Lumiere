import { useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useAgent, useGallery } from '../../hooks/useApi';
import { motion } from 'motion/react';
import { ArtworkImage } from './ui/ArtworkImage';
import type { GalleryItem } from '../data/mockData';

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

export function AgentDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: agent, loading: agentLoading } = useAgent(id || '');
  const { data: gallery, refetch } = useGallery({ owner_id: id || '', per_page: 50 }, 5000);

  useEffect(() => {
    if (id) refetch();
  }, [id, refetch]);

  const items = gallery?.items ?? [];

  if (!agent) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm" style={{ color: 'var(--g-text-tertiary)' }}>
          {agentLoading ? 'Loading agent...' : 'Agent not found'}
        </p>
        {!agentLoading && <Link to="/agents" className="pixel-button mt-4 inline-block text-sm">Back to Agents</Link>}
      </div>
    );
  }

  const avatar = agent.avatar && agent.avatar !== '??' ? agent.avatar : (roleEmoji[agent.role] ?? '🤖');

  return (
    <div className="space-y-8">
      <Link to="/agents" className="inline-flex items-center gap-1.5 text-sm" style={{ color: 'var(--g-text-secondary)' }}>
        ← Back to Agents
      </Link>

      <div className="flex items-start gap-6 flex-wrap">
        <div className="rounded-lg p-6" style={{ border: '1px solid var(--g-border)', background: 'var(--g-bg-card)', minWidth: 200 }}>
          <div className="text-center mb-4">
            <div className="text-5xl mb-3">{avatar}</div>
            <h1 className="pixel-heading text-2xl mb-1">{agent.name}</h1>
            <div
              className="text-sm font-medium capitalize"
              style={{ color: roleColors[agent.role] ?? 'var(--g-text-secondary)' }}
            >
              {agent.role}
            </div>
          </div>
          <div className="flex justify-center gap-6 pt-4" style={{ borderTop: '1px solid var(--g-border)' }}>
            <div className="text-center">
              <div className="text-lg font-semibold" style={{ color: 'var(--g-gold)' }}>
                {agent.stats?.creditsEarned?.toLocaleString() ?? 0}
              </div>
              <div className="text-[10px]" style={{ color: 'var(--g-text-tertiary)' }}>credits</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{agent.stats?.galleryItems ?? 0}</div>
              <div className="text-[10px]" style={{ color: 'var(--g-text-tertiary)' }}>owned</div>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="pixel-heading text-xl mb-4">Collection</h2>
          {items.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--g-text-tertiary)' }}>No artworks in collection yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((item: GalleryItem) => (
                <Link key={item.id} to={`/gallery/${item.id}`} className="block">
                  <motion.div
                    className="rounded-lg overflow-hidden group"
                    style={{ border: '1px solid var(--g-border)', background: 'var(--g-bg-card)' }}
                    whileHover={{ y: -2 }}
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                      <ArtworkImage
                        src={(item as any).imageUrl || (item as any).image_url}
                        alt={item.title}
                        seed={item.id}
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-sm font-medium truncate mb-0.5" style={{ fontFamily: 'var(--font-heading)' }}>{item.title}</h3>
                      <div className="text-xs font-semibold" style={{ color: 'var(--g-gold)' }}>
                        {item.price.toLocaleString()} cr
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
