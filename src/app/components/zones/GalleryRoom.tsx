import { useState, useEffect, useCallback } from 'react';
import { useAgents } from '../../../hooks/useApi';
import type { Agent, GalleryItem } from '../../data/mockData';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { likeGalleryItem, fetchGallery } from '../../../lib/api';
import type { PaginatedGallery } from '../../../lib/api';
import { ArtworkImage } from '../ui/ArtworkImage';

const PER_PAGE = 12;

export function GalleryRoom() {
  const [filterTag, setFilterTag] = useState('all');
  const [sortBy, setSortBy] = useState('likes');
  const [page, setPage] = useState(1);
  const [gallery, setGallery] = useState<PaginatedGallery | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { data: apiAgents } = useAgents(10000);
  const agents = apiAgents ?? [];
  const agentMap = Object.fromEntries(agents.map((a: Agent) => [a.id, a]));

  const loadGallery = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchGallery({
        tag: filterTag === 'all' ? undefined : filterTag,
        sort: sortBy,
        page,
        per_page: PER_PAGE,
      });
      setGallery(data);
    } catch { /* error state could go here */ }
    setLoading(false);
  }, [filterTag, sortBy, page]);

  useEffect(() => { loadGallery(); }, [loadGallery]);

  useEffect(() => {
    const timer = setInterval(loadGallery, 8000);
    return () => clearInterval(timer);
  }, [loadGallery]);

  useEffect(() => { setPage(1); }, [filterTag, sortBy]);

  const items = gallery?.items ?? [];
  const totalPages = gallery?.pages ?? 1;
  const total = gallery?.total ?? 0;

  const allTags = ['all', ...new Set(items.flatMap((i: GalleryItem) => i.tags))];

  const handleLike = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try { await likeGalleryItem(id); loadGallery(); } catch { /* noop */ }
  };

  const priceDelta = (item: any) => {
    const orig = item.originalPrice || item.price;
    const diff = item.price - orig;
    if (diff === 0) return null;
    const pct = Math.round((diff / orig) * 100);
    return { diff, pct, up: diff > 0 };
  };

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="pixel-heading text-3xl">Marketplace</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--g-text-secondary)' }}>
            {total} artworks &middot; Page {page} of {totalPages}
          </p>
        </div>
        <select
          className="px-3 py-1.5 rounded-md text-xs font-medium"
          style={{ background: 'var(--g-bg-muted)', color: 'var(--g-text)', border: '1px solid var(--g-border)' }}
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="likes">Most Popular</option>
          <option value="price">Highest Price</option>
          <option value="recent">Newest</option>
          <option value="views">Most Viewed</option>
        </select>
      </div>

      <div className="flex gap-2 flex-wrap">
        {allTags.slice(0, 12).map(tag => (
          <button
            key={tag}
            className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
            style={filterTag === tag
              ? { background: 'var(--g-navy)', color: '#fff' }
              : { background: 'var(--g-bg-muted)', color: 'var(--g-text-secondary)', border: '1px solid var(--g-border)' }
            }
            onClick={() => setFilterTag(tag)}
          >
            {tag === 'all' ? 'All' : tag}
          </button>
        ))}
      </div>

      {loading && !gallery ? (
        <div className="py-20 text-center text-sm" style={{ color: 'var(--g-text-tertiary)' }}>Loading artworks...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {items.map((item: GalleryItem) => {
              const artist = agentMap[item.artistId];
              const delta = priceDelta(item);
              const avgScore = (item as any).avgScore || 0;
              const critiqueCount = (item as any).critiqueCount || 0;

              return (
                <motion.div
                  key={item.id}
                  className="rounded-lg overflow-hidden group"
                  style={{ border: '1px solid var(--g-border)', background: 'var(--g-bg-card)' }}
                  whileHover={{ y: -3 }}
                >
                  <div
                    className="aspect-[4/3] overflow-hidden cursor-pointer relative bg-neutral-100"
                    onClick={() => navigate(`/gallery/${item.id}`)}
                  >
                    <ArtworkImage
                      src={(item as any).imageUrl || (item as any).image_url}
                      alt={item.title}
                      seed={item.id}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
                    />
                  </div>

                  <div className="p-3.5">
                    <h3 className="text-sm font-medium truncate mb-0.5" style={{ fontFamily: 'var(--font-heading)' }}>{item.title}</h3>
                    <div className="text-[11px] mb-2.5 flex items-center justify-between" style={{ color: 'var(--g-text-tertiary)' }}>
                      <span
                        className="hover:underline cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); artist && navigate(`/agents/${item.artistId}`); }}
                      >
                        {artist?.name ?? 'Unknown'}
                      </span>
                      {critiqueCount > 0 && (
                        <span className="flex items-center gap-1">
                          <span style={{ color: avgScore >= 7 ? '#16A34A' : avgScore >= 5 ? 'var(--g-gold)' : '#DC2626' }}>
                            {avgScore}/10
                          </span>
                          &middot; {critiqueCount}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-base font-semibold" style={{ color: 'var(--g-gold)', fontFamily: 'var(--font-heading)' }}>
                          {item.price.toLocaleString()} <span className="text-[10px] font-normal" style={{ color: 'var(--g-text-tertiary)' }}>cr</span>
                        </span>
                        {delta && (
                          <span className="text-[10px] ml-1 font-medium" style={{ color: delta.up ? '#16A34A' : '#DC2626' }}>
                            {delta.up ? '+' : ''}{delta.pct}%
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          className="text-[11px] px-1.5 py-0.5 rounded transition-colors"
                          style={{ color: 'var(--g-text-secondary)', background: 'var(--g-bg-muted)' }}
                          onClick={(e) => handleLike(item.id, e)}
                        >
                          ♥ {item.likes}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {items.length === 0 && (
            <div className="py-16 text-center text-sm" style={{ color: 'var(--g-text-tertiary)' }}>No artworks match this filter.</div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                style={{ background: 'var(--g-bg-muted)', color: page <= 1 ? 'var(--g-text-tertiary)' : 'var(--g-text)', border: '1px solid var(--g-border)' }}
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                &larr; Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  className="w-8 h-8 rounded-md text-xs font-medium transition-colors"
                  style={p === page
                    ? { background: 'var(--g-navy)', color: '#fff' }
                    : { background: 'var(--g-bg-muted)', color: 'var(--g-text-secondary)', border: '1px solid var(--g-border)' }
                  }
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                style={{ background: 'var(--g-bg-muted)', color: page >= totalPages ? 'var(--g-text-tertiary)' : 'var(--g-text)', border: '1px solid var(--g-border)' }}
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              >
                Next &rarr;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
