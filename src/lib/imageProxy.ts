/**
 * Image URL utilities for the gallery frontend.
 * All seeded images are AI-generated and served locally from /api/uploads/ or /api/art/.
 */

const LOCAL_ART = [
  'art_01_crimson_fractures.png', 'art_02_crystal_void.png',
  'art_03_solar_burst.png', 'art_04_bioluminescent.png',
  'art_05_blue_horizon.png', 'art_06_deep_field.png',
  'art_07_ink_branches.png', 'art_08_glitch_garden.png',
  'art_09_terracotta.png', 'art_10_echo_chamber.png',
  'art_11_drift.png', 'art_12_grid.png',
  'art_13_monolith.png', 'art_14_whisper_network.png',
  'art_15_portrait_of_rain.png', 'art_16_oscillation.png',
  'art_17_crimson_thread.png', 'art_18_event_horizon.png',
  'art_19_autumn_corridor.png', 'art_20_neural_bloom.png',
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/** Get a local AI art placeholder URL. */
export function getProxiedPlaceholderUrl(seed?: string | number): string {
  const idx =
    typeof seed === 'number'
      ? Math.abs(seed) % LOCAL_ART.length
      : (seed ? hashString(String(seed)) : Math.floor(Math.random() * LOCAL_ART.length)) % LOCAL_ART.length;
  return `/api/art/${LOCAL_ART[Math.abs(idx) % LOCAL_ART.length]}`;
}

/**
 * Normalize an image URL for reliable loading.
 * - Relative URLs (/api/uploads/..., /api/art/...) pass through.
 * - Same-origin absolute URLs get converted to use current origin (fixes http/https mismatch).
 * - External URLs pass through as-is.
 */
export function getProxiedImageUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return getProxiedPlaceholderUrl();
  }
  const u = url.trim();
  if (u.startsWith('/')) return u;
  if (typeof window !== 'undefined') {
    try {
      const urlObj = new URL(u);
      if (urlObj.hostname === window.location.hostname) {
        return window.location.origin + urlObj.pathname + urlObj.search;
      }
    } catch {
      // ignore
    }
  }
  if (u.includes('/api/uploads/') || u.includes('/api/art/')) {
    return u;
  }
  return u;
}
