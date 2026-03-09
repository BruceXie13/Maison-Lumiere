/**
 * Fallback images when artwork images are missing or fail to load.
 * Uses bundled AI-generated abstract art served from /api/art/.
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

export function getFallbackImage(seed?: string | number): string {
  const idx =
    typeof seed === 'number'
      ? Math.abs(seed) % LOCAL_ART.length
      : (seed ? hashString(seed) : Math.floor(Math.random() * LOCAL_ART.length)) % LOCAL_ART.length;
  return `/api/art/${LOCAL_ART[Math.abs(idx) % LOCAL_ART.length]}`;
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}
