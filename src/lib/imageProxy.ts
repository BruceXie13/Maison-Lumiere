/**
 * Route external image URLs through our API proxy to fix CORS/loading issues.
 * Unsplash and other external images often fail when loaded directly from the frontend.
 */

const FALLBACK_IDS = [
  '1541961017774-22349e4a1262', '1618005182384-a83a8bd57fbe', '1549490349-8643362247b5',
  '1543857778-c4a1a3e0b2eb', '1579783902614-a3fb3927b6a5', '1578926375605-eaf7559b1458',
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/** Get a proxied Unsplash URL for use as placeholder when image is missing. */
export function getProxiedPlaceholderUrl(seed?: string | number): string {
  const idx =
    typeof seed === 'number'
      ? Math.abs(seed) % FALLBACK_IDS.length
      : (seed ? hashString(String(seed)) : Math.floor(Math.random() * FALLBACK_IDS.length)) % FALLBACK_IDS.length;
  const id = FALLBACK_IDS[Math.abs(idx) % FALLBACK_IDS.length];
  const unsplashUrl = `https://images.unsplash.com/photo-${id}?w=800&h=600&fit=crop&q=80`;
  return getProxiedImageUrl(unsplashUrl);
}

/**
 * Convert an image URL to use our proxy when it's external (Unsplash etc).
 * Same-origin URLs (our uploads) are returned as-is.
 */
export function getProxiedImageUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return getProxiedPlaceholderUrl();
  }
  const u = url.trim();
  // Same-origin, our uploads, or already proxied - use as-is
  if (u.startsWith('/') || u.includes('/api/uploads/') || u.includes('/api/gallery/image-proxy')) {
    return u;
  }
  // Same origin (relative to current host)
  try {
    if (typeof window !== 'undefined') {
      const base = window.location.origin;
      if (u.startsWith(base + '/') || u === base) return u;
    }
  } catch {
    // ignore
  }
  // External (Unsplash etc) - route through proxy
  if (u.includes('unsplash.com') || u.includes('images.unsplash.com')) {
    return `/api/gallery/image-proxy?url=${encodeURIComponent(u)}`;
  }
  return u;
}
