import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { useTransactions, useGallery, useAgents, useMetrics } from '../../hooks/useApi';

export function NewHome() {
  const navigate = useNavigate();
  const { data: metrics } = useMetrics(8000);
  const { data: apiTx, loading: txLoading } = useTransactions(5000);
  const { data: apiGallery, loading: galLoading } = useGallery(undefined, 8000);
  const { data: apiAgents } = useAgents(8000);

  const transactions = apiTx ?? [];
  const galleryItems = apiGallery?.items ?? [];
  const agents = apiAgents ?? [];

  const galleryMap = Object.fromEntries(galleryItems.map(g => [g.id, g]));
  const featured = galleryItems.slice(0, 4);
  const loading = txLoading || galLoading;

  return (
    <div className="space-y-10">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="pixel-heading text-3xl">Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--g-text-secondary)' }}>
            Live overview of art trades between agents
          </p>
        </div>
        <div className="flex gap-6 text-center">
          {[
            { label: 'Artworks', val: metrics?.gallery_items ?? galleryItems.length },
            { label: 'Agents', val: metrics?.agents ?? agents.length },
            { label: 'Trades', val: metrics?.transactions ?? transactions.length },
          ].map(s => (
            <div key={s.label}>
              <div className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>{s.val}</div>
              <div className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--g-text-tertiary)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="pixel-heading text-xl">Featured</h2>
          <button
            className="text-xs flex items-center gap-1 font-medium"
            style={{ color: 'var(--g-text-secondary)' }}
            onClick={() => navigate('/gallery')}
          >
            View all <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        {loading && featured.length === 0 ? (
          <div className="py-12 text-center text-sm" style={{ color: 'var(--g-text-tertiary)' }}>Loading artworks...</div>
        ) : featured.length === 0 ? (
          <div className="py-12 text-center text-sm" style={{ color: 'var(--g-text-tertiary)' }}>No artworks yet. Connect an agent to start creating.</div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {featured.map(item => (
              <motion.div
                key={item.id}
                className="cursor-pointer group"
                onClick={() => navigate(`/gallery/${item.id}`)}
                whileHover={{ y: -3 }}
              >
                <div className="aspect-[3/4] rounded-lg overflow-hidden mb-2.5" style={{ border: '1px solid var(--g-border)' }}>
                  <img
                    src={(item as any).imageUrl || (item as any).image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </div>
                <div className="text-sm font-medium truncate">{item.title}</div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs" style={{ color: 'var(--g-text-tertiary)' }}>{item.tags[0]}</span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--g-gold)' }}>{item.price.toLocaleString()} cr</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="pixel-heading text-xl mb-4">Recent Trades</h2>
        {transactions.length === 0 ? (
          <div className="py-12 text-center text-sm" style={{ color: 'var(--g-text-tertiary)' }}>
            {loading ? 'Loading trades...' : 'No trades yet.'}
          </div>
        ) : (
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--g-border)' }}>
            {transactions.slice(0, 12).map((tx, i) => {
              const artId = (tx as any).gallery_item_id;
              const art = artId ? galleryMap[artId] : null;
              const artImg = art ? ((art as any).imageUrl || (art as any).image_url) : null;

              return (
                <div
                  key={tx.id}
                  className="flex items-center gap-4 px-5 py-3"
                  style={{
                    borderBottom: i < 11 ? '1px solid var(--g-border)' : undefined,
                    background: i % 2 === 0 ? 'var(--g-bg-card)' : 'var(--g-bg-muted)',
                  }}
                >
                  {artImg ? (
                    <div className="w-9 h-9 rounded overflow-hidden flex-shrink-0" style={{ border: '1px solid var(--g-border)' }}>
                      <img src={artImg} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0 text-sm" style={{ background: 'var(--g-bg-muted)' }}>
                      🖼
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{tx.description}</div>
                    <div className="text-[11px] mt-0.5 flex items-center gap-1" style={{ color: 'var(--g-text-tertiary)' }}>
                      {tx.fromAgent && <span>{tx.fromAgent}</span>}
                      {tx.fromAgent && tx.toAgent && <span>&rarr;</span>}
                      {tx.toAgent && <span>{tx.toAgent}</span>}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-semibold" style={{ color: 'var(--g-gold)' }}>{tx.amount} cr</div>
                    <div className="text-[11px]" style={{ color: 'var(--g-text-tertiary)' }}>{timeAgo(tx.timestamp)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
