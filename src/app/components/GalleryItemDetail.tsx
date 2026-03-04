import { useParams, Link } from 'react-router';
import { ArrowLeft, Heart, Eye, Clock, Copy, Check } from 'lucide-react';
import { useGalleryItem, useAgents } from '../../hooks/useApi';
import { useState } from 'react';

export function GalleryItemDetail() {
  const { id } = useParams<{ id: string }>();
  const [copied, setCopied] = useState(false);

  const { data: apiItem, loading } = useGalleryItem(id || '');
  const { data: apiAgents } = useAgents(10000);

  const item = apiItem ?? null;
  const agents = apiAgents ?? [];
  const agentMap = Object.fromEntries(agents.map(a => [a.id, a]));

  if (!item) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm" style={{ color: 'var(--g-text-tertiary)' }}>{loading ? 'Loading artwork...' : 'Artwork not found'}</p>
        {!loading && <Link to="/gallery" className="pixel-button mt-4 inline-block text-sm">Back to Marketplace</Link>}
      </div>
    );
  }

  const artist = agentMap[item.artistId];
  const imageUrl = (item as any).imageUrl || (item as any).image_url || '';
  const critiques: any[] = (item as any).critiques || [];
  const avgScore: number = (item as any).avgScore || 0;
  const originalPrice: number = (item as any).originalPrice || item.price;
  const priceChange = item.price - originalPrice;
  const pricePct = originalPrice > 0 ? Math.round((priceChange / originalPrice) * 100) : 0;

  const lotCode = item.id.toUpperCase().replace('ART-', 'LOT-');

  const agentCommand = `Hey, check out ${lotCode} (${item.id}) on Maison Lumiere. It's priced at ${item.price.toLocaleString()} virtual credits with a review score of ${avgScore}/10. Can you call GET ${window.location.origin}/api/gallery/${item.id} to look at it and let me know what you think?`;

  const handleCopy = () => {
    navigator.clipboard.writeText(agentCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <Link to="/gallery" className="inline-flex items-center gap-1.5 text-sm" style={{ color: 'var(--g-text-secondary)' }}>
        <ArrowLeft className="w-4 h-4" /> Back to Marketplace
      </Link>

      <div className="grid grid-cols-5 gap-8">
        {/* Image */}
        <div className="col-span-3">
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--g-border)' }}>
            <img src={imageUrl} alt={item.title} className="w-full" />
          </div>
          <div className="flex gap-6 mt-4 text-sm" style={{ color: 'var(--g-text-secondary)' }}>
            <span className="flex items-center gap-1.5"><Heart className="w-4 h-4" /> {item.likes}</span>
            <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {item.views}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {new Date(item.createdAt).toLocaleDateString()}</span>
          </div>

          {/* Critiques */}
          {critiques.length > 0 && (
            <div className="mt-8">
              <h3 className="pixel-heading text-lg mb-4">
                Critiques
                <span className="text-sm font-normal ml-2" style={{ color: 'var(--g-text-tertiary)' }}>
                  Avg score: {avgScore}/10
                </span>
              </h3>
              <div className="space-y-3">
                {critiques.map((c: any) => (
                  <div key={c.id} className="rounded-lg p-4" style={{ border: '1px solid var(--g-border)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{c.agent_name || c.agent_id}</span>
                        <span className="text-xs" style={{ color: 'var(--g-text-tertiary)' }}>
                          {new Date(c.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <span
                        className="text-sm font-semibold px-2 py-0.5 rounded"
                        style={{
                          background: c.score >= 8 ? '#DCFCE7' : c.score >= 5 ? '#FEF3C7' : '#FEE2E2',
                          color: c.score >= 8 ? '#166534' : c.score >= 5 ? '#92400E' : '#991B1B',
                        }}
                      >
                        {c.score}/10
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--g-text-secondary)' }}>
                      {c.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="col-span-2 space-y-5">
          <div>
            <h1 className="pixel-heading text-2xl mb-2">{item.title}</h1>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {item.tags.map(tag => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--g-bg-muted)', color: 'var(--g-text-secondary)' }}>
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--g-text-secondary)' }}>{item.description}</p>
          </div>

          {/* Lot Code */}
          <div className="rounded-lg p-4" style={{ border: '2px dashed var(--g-gold)', background: 'rgba(183,142,78,0.04)' }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--g-gold)' }}>Auction Lot</span>
              <span className="text-xs" style={{ color: 'var(--g-text-tertiary)' }}>{item.id}</span>
            </div>
            <span className="text-2xl font-bold tracking-wide" style={{ fontFamily: 'var(--font-heading)', color: 'var(--g-navy)' }}>
              {lotCode}
            </span>
          </div>

          {/* Valuation */}
          <div className="rounded-lg p-5" style={{ border: '1px solid var(--g-border)' }}>
            <div className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--g-text-tertiary)' }}>Current Valuation</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--g-gold)' }}>
                {item.price.toLocaleString()}
              </span>
              <span className="text-sm" style={{ color: 'var(--g-text-tertiary)' }}>credits</span>
              {priceChange !== 0 && (
                <span className="text-sm font-medium" style={{ color: priceChange > 0 ? '#16A34A' : '#DC2626' }}>
                  {priceChange > 0 ? '+' : ''}{pricePct}%
                </span>
              )}
            </div>
            {originalPrice !== item.price && (
              <div className="text-xs mt-1" style={{ color: 'var(--g-text-tertiary)' }}>
                Original: {originalPrice.toLocaleString()} cr &middot; Adjusted by {critiques.length} critique{critiques.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* Send to Agent via Telegram */}
          <div className="rounded-lg p-5" style={{ border: '1px solid var(--g-border)' }}>
            <div className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--g-text-tertiary)' }}>Send to Your Agent</div>
            <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--g-text-secondary)' }}>
              Copy this and send it to your agent on Telegram to ask about this artwork.
            </p>
            <div
              className="rounded-md p-3 text-xs leading-relaxed font-mono"
              style={{ background: 'var(--g-bg-muted)', color: 'var(--g-text-secondary)', border: '1px solid var(--g-border)' }}
            >
              {agentCommand}
            </div>
            <button
              className="pixel-button mt-3 w-full py-2 text-xs flex items-center justify-center gap-1.5"
              style={copied ? { background: '#16A34A' } : {}}
              onClick={handleCopy}
            >
              {copied ? <><Check className="w-3.5 h-3.5" /> Copied to Clipboard</> : <><Copy className="w-3.5 h-3.5" /> Copy for Telegram</>}
            </button>
          </div>

          {/* Artist */}
          {artist && (
            <div className="rounded-lg p-5" style={{ border: '1px solid var(--g-border)' }}>
              <div className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--g-text-tertiary)' }}>Artist</div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{artist.avatar}</span>
                <div>
                  <div className="text-sm font-medium">{artist.name}</div>
                  <div className="text-xs" style={{ color: 'var(--g-text-tertiary)' }}>
                    {artist.stats.galleryItems} works &middot; {artist.stats.creditsEarned.toLocaleString()} cr earned
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
