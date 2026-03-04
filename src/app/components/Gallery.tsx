import { useState } from 'react';
import { Link } from 'react-router';
import { Heart, Eye, Plus, Filter } from 'lucide-react';
import { mockGalleryItems } from '../data/mockData';
import galleryRoomImg from 'figma:asset/0b26cd882fee9cbe0f5e383cb30a0965065a92f1.png';

export function Gallery() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'verified' | 'recent'>('all');

  const verifiedItems = mockGalleryItems.filter(item => item.verified);
  const recentItems = mockGalleryItems.slice(0, 8);

  // Featured artworks for the gallery walls
  const featuredArtworks = [
    {
      id: 'featured-1',
      title: 'Abstract Dreams',
      imageUrl: 'https://images.unsplash.com/photo-1713188090500-a4fb0d2cf309?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRpZ2l0YWwlMjBhcnQlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzI0ODU4NjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      artist: 'PixelArtist-07',
      likes: 234,
      verified: true,
    },
    {
      id: 'featured-2',
      title: 'Surreal Landscapes',
      imageUrl: 'https://images.unsplash.com/photo-1770034285769-4a5a3f410346?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXJyZWFsJTIwZmFudGFzeSUyMGxhbmRzY2FwZSUyMHBhaW50aW5nfGVufDF8fHx8MTc3MjUwNjU3OXww&ixlib=rb-4.1.0&q=80&w=1080',
      artist: 'DreamWeaver-AI',
      likes: 189,
      verified: true,
    },
    {
      id: 'featured-3',
      title: 'Geometric Harmony',
      imageUrl: 'https://images.unsplash.com/photo-1761156254622-7b66649b1f69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtaW5pbWFsaXN0JTIwZ2VvbWV0cmljJTIwYXJ0fGVufDF8fHx8MTc3MjUwNjU4MHww&ixlib=rb-4.1.0&q=80&w=1080',
      artist: 'MinimalBot-03',
      likes: 167,
      verified: false,
    },
    {
      id: 'featured-4',
      title: 'Neon Nights',
      imageUrl: 'https://images.unsplash.com/photo-1743582377749-a399b8ce466f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBuZW9uJTIwYXJ0d29ya3xlbnwxfHx8fDE3NzI1MDY1ODB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      artist: 'CyberArtist-12',
      likes: 312,
      verified: true,
    },
  ];

  const currentItems = selectedFilter === 'all' ? mockGalleryItems : 
                       selectedFilter === 'verified' ? verifiedItems : recentItems;

  return (
    <div className="space-y-6">
      {/* Compact Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="pixel-heading text-2xl mb-1">🖼️ Gallery</h1>
          <p className="text-sm text-[var(--pixel-text-muted)]">Browse and license artworks</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="pixel-button text-sm px-4 py-2 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Gallery View */}
        <div className="col-span-9">
          {/* Gallery Room Scene - More Compact */}
          <div className="pixel-panel p-4 mb-6">
            <h2 className="text-sm font-semibold mb-3 text-[var(--pixel-text-bright)]">Featured Exhibition</h2>
            <div className="relative pixel-frame" style={{ aspectRatio: '16/9' }}>
              <div className="relative w-full h-full overflow-hidden">
                {/* Pixel Art Gallery Room Background */}
                <img 
                  src={galleryRoomImg} 
                  alt="Gallery Room"
                  className="w-full h-full object-cover"
                  style={{ imageRendering: 'pixelated' }}
                />
                
                {/* Positioned Artworks on Wall Frames */}
                {/* Left Wall - Large Frame */}
                <div className="absolute" style={{ 
                  left: '4.5%', 
                  top: '14%', 
                  width: '17.5%', 
                  height: '50%'
                }}>
                  <Link to="/gallery/featured-1" className="block w-full h-full group">
                    <img 
                      src={featuredArtworks[0].imageUrl}
                      alt={featuredArtworks[0].title}
                      className="w-full h-full object-cover transition-all group-hover:scale-105"
                      style={{ imageRendering: 'auto' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </Link>
                </div>

                {/* Back Wall - Left Frame */}
                <div className="absolute" style={{ 
                  left: '30%', 
                  top: '18%', 
                  width: '17%', 
                  height: '38%'
                }}>
                  <Link to="/gallery/featured-2" className="block w-full h-full group">
                    <img 
                      src={featuredArtworks[1].imageUrl}
                      alt={featuredArtworks[1].title}
                      className="w-full h-full object-cover transition-all group-hover:scale-105"
                      style={{ imageRendering: 'auto' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </Link>
                </div>

                {/* Back Wall - Right Frame */}
                <div className="absolute" style={{ 
                  left: '55%', 
                  top: '18%', 
                  width: '17%', 
                  height: '38%'
                }}>
                  <Link to="/gallery/featured-3" className="block w-full h-full group">
                    <img 
                      src={featuredArtworks[2].imageUrl}
                      alt={featuredArtworks[2].title}
                      className="w-full h-full object-cover transition-all group-hover:scale-105"
                      style={{ imageRendering: 'auto' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </Link>
                </div>

                {/* Right Wall - Large Frame */}
                <div className="absolute" style={{ 
                  right: '4%', 
                  top: '14%', 
                  width: '17.5%', 
                  height: '50%'
                }}>
                  <Link to="/gallery/featured-4" className="block w-full h-full group">
                    <img 
                      src={featuredArtworks[3].imageUrl}
                      alt={featuredArtworks[3].title}
                      className="w-full h-full object-cover transition-all group-hover:scale-105"
                      style={{ imageRendering: 'auto' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    {featuredArtworks[3].verified && (
                      <div className="absolute top-2 right-2 pixel-badge pixel-badge-verified text-[10px] px-2 py-0.5">
                        ⭐
                      </div>
                    )}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs - Inline */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 text-sm font-medium transition-all ${
                selectedFilter === 'all' 
                  ? 'pixel-button' 
                  : 'pixel-panel-dark hover:bg-[var(--pixel-bg-light)]'
              }`}
              style={selectedFilter !== 'all' ? {
                boxShadow: '0 0 0 2px var(--pixel-bg-light)'
              } : {}}
            >
              All ({mockGalleryItems.length})
            </button>
            <button
              onClick={() => setSelectedFilter('verified')}
              className={`px-4 py-2 text-sm font-medium transition-all ${
                selectedFilter === 'verified' 
                  ? 'pixel-button' 
                  : 'pixel-panel-dark hover:bg-[var(--pixel-bg-light)]'
              }`}
              style={selectedFilter !== 'verified' ? {
                boxShadow: '0 0 0 2px var(--pixel-bg-light)'
              } : {}}
            >
              ⭐ Verified ({verifiedItems.length})
            </button>
            <button
              onClick={() => setSelectedFilter('recent')}
              className={`px-4 py-2 text-sm font-medium transition-all ${
                selectedFilter === 'recent' 
                  ? 'pixel-button' 
                  : 'pixel-panel-dark hover:bg-[var(--pixel-bg-light)]'
              }`}
              style={selectedFilter !== 'recent' ? {
                boxShadow: '0 0 0 2px var(--pixel-bg-light)'
              } : {}}
            >
              Recent ({recentItems.length})
            </button>
          </div>

          {/* Gallery Grid - Denser Layout */}
          <div className="grid grid-cols-4 gap-4">
            {currentItems.slice(0, 12).map((item) => (
              <Link key={item.id} to={`/gallery/${item.id}`} className="group">
                <div className="pixel-panel-dark overflow-hidden transition-all hover:translate-y-[-2px]" style={{
                  boxShadow: '0 0 0 2px var(--pixel-bg-light), 2px 2px 0 rgba(0, 0, 0, 0.3)'
                }}>
                  <div className="aspect-square overflow-hidden bg-[var(--pixel-bg-dark)] relative">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {item.verified && (
                      <div className="absolute top-2 right-2 pixel-badge pixel-badge-verified text-[10px] px-1.5 py-0.5">
                        ⭐
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold mb-1 line-clamp-1 text-[var(--pixel-text-bright)]">{item.title}</h3>
                    <div className="flex items-center justify-between text-xs text-[var(--pixel-text-muted)]">
                      <span className="flex items-center gap-1 font-mono">
                        <Heart className="w-3 h-3" /> {item.likes}
                      </span>
                      <span className="font-mono">{item.price} cr</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-3 space-y-6">
          {/* Featured Artists */}
          <div className="pixel-panel p-4">
            <h2 className="pixel-heading text-base mb-3">🌟 Featured Artists</h2>
            <div className="space-y-3">
              {featuredArtworks.map((artwork) => (
                <div key={artwork.id} className="flex items-center gap-2">
                  <div className="w-10 h-10 overflow-hidden" style={{
                    boxShadow: 'inset 1px 1px 0 rgba(0, 0, 0, 0.3)'
                  }}>
                    <img src={artwork.imageUrl} alt={artwork.artist} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-[var(--pixel-text-bright)] line-clamp-1">{artwork.artist}</h3>
                    <p className="text-[10px] text-[var(--pixel-text-muted)] font-mono">{artwork.likes} likes</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="pixel-panel p-4">
            <h2 className="pixel-heading text-base mb-3">📊 Gallery Stats</h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--pixel-text-muted)]">Total Items</span>
                <span className="font-mono font-semibold">284</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--pixel-text-muted)]">Verified</span>
                <span className="font-mono font-semibold" style={{ color: 'var(--pixel-accent-pink)' }}>127</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--pixel-text-muted)]">This Week</span>
                <span className="font-mono font-semibold" style={{ color: 'var(--pixel-accent-green)' }}>42</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--pixel-text-muted)]">Avg Price</span>
                <span className="font-mono font-semibold" style={{ color: 'var(--pixel-accent-yellow)' }}>850 cr</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="pixel-panel p-4">
            <h2 className="pixel-heading text-base mb-3">🎨 Categories</h2>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-xs hover:bg-[var(--pixel-bg-light)] transition-colors pixel-panel-dark" style={{
                boxShadow: '0 0 0 1px var(--pixel-bg-light)'
              }}>
                <div className="flex justify-between items-center">
                  <span>Abstract</span>
                  <span className="text-[var(--pixel-text-muted)] font-mono">87</span>
                </div>
              </button>
              <button className="w-full text-left px-3 py-2 text-xs hover:bg-[var(--pixel-bg-light)] transition-colors pixel-panel-dark" style={{
                boxShadow: '0 0 0 1px var(--pixel-bg-light)'
              }}>
                <div className="flex justify-between items-center">
                  <span>Landscape</span>
                  <span className="text-[var(--pixel-text-muted)] font-mono">64</span>
                </div>
              </button>
              <button className="w-full text-left px-3 py-2 text-xs hover:bg-[var(--pixel-bg-light)] transition-colors pixel-panel-dark" style={{
                boxShadow: '0 0 0 1px var(--pixel-bg-light)'
              }}>
                <div className="flex justify-between items-center">
                  <span>Portrait</span>
                  <span className="text-[var(--pixel-text-muted)] font-mono">52</span>
                </div>
              </button>
              <button className="w-full text-left px-3 py-2 text-xs hover:bg-[var(--pixel-bg-light)] transition-colors pixel-panel-dark" style={{
                boxShadow: '0 0 0 1px var(--pixel-bg-light)'
              }}>
                <div className="flex justify-between items-center">
                  <span>Geometric</span>
                  <span className="text-[var(--pixel-text-muted)] font-mono">43</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}