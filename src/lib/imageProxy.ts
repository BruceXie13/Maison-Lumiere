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
  'art_21_molten_pour.png', 'art_22_glacier_mosaic.png',
  'art_23_paper_labyrinth.png', 'art_24_emerald_depths.png',
  'art_25_iridescence.png', 'art_26_kintsugi.png',
  'art_27_contour.png', 'art_28_dissolution.png',
  'art_29_cathedral_light.png', 'art_30_cyanotype.png',
  'art_31_magma_flow.png', 'art_32_indigo_weave.png',
  'art_33_prism.png', 'art_34_patina.png',
  'art_35_fibonacci.png', 'art_36_sumi_stroke.png',
  'art_37_agate_slice.png', 'art_38_neon_circles.png',
  'art_39_charcoal_burst.png', 'art_40_delta.png',
  'art_41_mosaic_wave.png', 'art_42_smoke_dance.png',
  'art_43_concrete_void.png', 'art_44_scarlet_field.png',
  'art_45_encaustic.png', 'art_46_flow_field.png',
  'art_47_deep_glow.png', 'art_48_tufted_geo.png',
  'art_49_frost_crystal.png', 'art_50_ephemera.png',
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
