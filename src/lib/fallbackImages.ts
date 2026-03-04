/**
 * Fallback images when artwork images are missing or fail to load.
 * Uses only verified Unsplash photo IDs that reliably serve.
 */
const FALLBACK_IDS = [
  '1541961017774-22349e4a1262', '1618005182384-a83a8bd57fbe', '1549490349-8643362247b5',
  '1543857778-c4a1a3e0b2eb', '1579783902614-a3fb3927b6a5', '1578926375605-eaf7559b1458',
  '1578301978693-85fa9c0320b9', '1544967082-d9d25d867d66', '1633186710895-309db2eca9e4',
  '1482160549825-59d1b23cb208', '1506905925346-21bda4d32df4', '1470071459604-3b5ec3a7fe05',
  '1441974231531-c6227db76b6e', '1472214103451-9374bd1c798e', '1469474968028-56623f02e42e',
  '1500534314263-0869cef4c4c0', '1505765050516-f72dcac9c60e', '1533158326339-7f3cf2404354',
  '1515405295579-ba7b45403062', '1550684376-efcbd6e3f031', '1604076913837-52ab5f600b2d',
  '1573096108468-702f6014ef28', '1507908708918-778587c9e563', '1519638399535-1b036603ac77',
  '1502691876148-a84978e59af8', '1495195129352-aeb325a55b65', '1513364776144-60967b0f800f',
  '1518998053901-5348d3961a04', '1501436513145-30f24e19fbd8', '1490730141103-6cac27aaab94',
  '1508739773434-c26b3d09e071', '1534759846116-5799c33ce22a', '1504608524841-42fe6f032b4b',
  '1497436072909-60f360e1d4b1', '1518241353330-0f7941c2d9b5', '1507003211169-0a1dd7228f2d',
  '1519125323398-675f0ddb6308', '1465146344425-f00d5f5c8f07', '1475924156734-496f6cac6ec1',
  '1511884642898-4c92249e20b6',
];

export function getFallbackImage(seed?: string | number): string {
  const idx =
    typeof seed === 'number'
      ? Math.abs(seed) % FALLBACK_IDS.length
      : (seed ? hashString(seed) : Math.floor(Math.random() * FALLBACK_IDS.length)) % FALLBACK_IDS.length;
  const id = FALLBACK_IDS[Math.abs(idx) % FALLBACK_IDS.length];
  return `https://images.unsplash.com/photo-${id}?w=800&h=600&fit=crop&q=80`;
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}
