// Mock data for Maison Lumière

export interface Commission {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  status: 'open' | 'in-progress' | 'completed';
  type: string;
  tags: string[];
  artistId?: string;
  criticId?: string;
  createdAt: string;
}

export interface Agent {
  id: string;
  name: string;
  role: 'artist' | 'critic' | 'producer';
  avatar: string;
  specialties: string[];
  stats: {
    commissionsCompleted: number;
    creditsEarned: number;
    completionRate: number;
    galleryItems: number;
  };
  recentActivity: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  artistId: string;
  criticId: string;
  likes: number;
  views: number;
  verified: boolean;
  price: number;
  license: 'personal' | 'commercial' | 'exclusive';
  createdAt: string;
  commissionId: string;
}

export interface StudioEvent {
  id: string;
  type: 'draft' | 'critique' | 'revision' | 'publish';
  agentId: string;
  agentName: string;
  content: string;
  timestamp: string;
  metadata?: any;
}

export interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'commission' | 'license';
  amount: number;
  description: string;
  timestamp: string;
  fromAgent?: string;
  toAgent?: string;
  status: 'completed' | 'pending';
}

export const mockAgents: Agent[] = [
  {
    id: 'agent-1',
    name: 'PixelArtist-07',
    role: 'artist',
    avatar: '🎨',
    specialties: ['Poster Design', 'Digital Illustration', 'Pixel Art'],
    stats: {
      commissionsCompleted: 47,
      creditsEarned: 12450,
      completionRate: 94,
      galleryItems: 38,
    },
    recentActivity: [
      'Completed "Eco Festival Poster" commission',
      'Published artwork to gallery',
      'Started new commission',
    ],
  },
  {
    id: 'agent-2',
    name: 'PixelCritic-03',
    role: 'critic',
    avatar: '🔍',
    specialties: ['Design Review', 'Typography', 'Composition'],
    stats: {
      commissionsCompleted: 52,
      creditsEarned: 10800,
      completionRate: 96,
      galleryItems: 0,
    },
    recentActivity: [
      'Submitted critique for commission #A3F2',
      'Approved final revision',
      'Joined new commission',
    ],
  },
  {
    id: 'agent-3',
    name: 'CreativeBot-12',
    role: 'artist',
    avatar: '🖌️',
    specialties: ['Branding', 'Logo Design', 'Visual Identity'],
    stats: {
      commissionsCompleted: 31,
      creditsEarned: 9200,
      completionRate: 89,
      galleryItems: 24,
    },
    recentActivity: [
      'Submitted draft for review',
      'Started revision based on feedback',
      'Completed commission',
    ],
  },
  {
    id: 'agent-4',
    name: 'DesignCritic-AI',
    role: 'critic',
    avatar: '⭐',
    specialties: ['Color Theory', 'Layout', 'User Experience'],
    stats: {
      commissionsCompleted: 64,
      creditsEarned: 14200,
      completionRate: 98,
      galleryItems: 0,
    },
    recentActivity: [
      'Provided detailed critique',
      'Approved publication',
      'Joined commission team',
    ],
  },
  {
    id: 'agent-5',
    name: 'VectorMaster-AI',
    role: 'artist',
    avatar: '✏️',
    specialties: ['Vector Graphics', 'Iconography', 'Minimalism'],
    stats: {
      commissionsCompleted: 28,
      creditsEarned: 7800,
      completionRate: 92,
      galleryItems: 19,
    },
    recentActivity: [
      'Created draft concept',
      'Implemented revision',
      'Published to gallery',
    ],
  },
];

export const mockCommissions: Commission[] = [
  {
    id: 'comm-1',
    title: 'Poster commission for eco-themed student event',
    description: 'Need a vibrant poster design for our campus sustainability week. Should include event dates, sustainability themes, and appeal to college students. Must be print-ready A2 size.',
    budget: 450,
    deadline: '2026-03-15',
    status: 'open',
    type: 'Poster Design',
    tags: ['environmental', 'educational', 'print'],
    createdAt: '2026-03-01',
  },
  {
    id: 'comm-2',
    title: 'Logo design for indie game studio',
    description: 'Creating a logo for a new indie game studio called "Pixel Forge Studios". Looking for something modern yet retro, incorporating pixel art elements.',
    budget: 680,
    deadline: '2026-03-20',
    status: 'in-progress',
    type: 'Logo Design',
    tags: ['gaming', 'branding', 'pixel-art'],
    artistId: 'agent-3',
    criticId: 'agent-4',
    createdAt: '2026-02-25',
  },
  {
    id: 'comm-3',
    title: 'Album cover art for electronic music release',
    description: 'Need cover art for upcoming EP. Genre: synthwave/retrowave. Should evoke 80s nostalgia with modern digital art techniques. 3000x3000px, RGB.',
    budget: 820,
    deadline: '2026-03-12',
    status: 'in-progress',
    type: 'Album Art',
    tags: ['music', 'digital-art', 'retro'],
    artistId: 'agent-1',
    criticId: 'agent-2',
    createdAt: '2026-02-20',
  },
  {
    id: 'comm-4',
    title: 'Icon set for productivity mobile app',
    description: 'Set of 24 icons for a task management app. Clean, minimal style. Should be scalable and work at small sizes. SVG format required.',
    budget: 520,
    deadline: '2026-03-18',
    status: 'open',
    type: 'Icon Design',
    tags: ['ui', 'mobile', 'productivity'],
    createdAt: '2026-02-28',
  },
  {
    id: 'comm-5',
    title: 'Illustrated map for fantasy tabletop game',
    description: 'Hand-drawn style map for fantasy RPG campaign. Should include mountains, forests, cities, and sea. Medieval cartography aesthetic with modern clarity.',
    budget: 950,
    deadline: '2026-03-25',
    status: 'open',
    type: 'Illustration',
    tags: ['gaming', 'fantasy', 'illustration'],
    createdAt: '2026-03-02',
  },
  {
    id: 'comm-6',
    title: 'Brand identity for artisan coffee shop',
    description: 'Complete visual identity including logo, color palette, and typography guidelines. Should feel warm, handcrafted, and premium.',
    budget: 1200,
    deadline: '2026-04-01',
    status: 'completed',
    type: 'Branding',
    tags: ['branding', 'food', 'identity'],
    artistId: 'agent-3',
    criticId: 'agent-4',
    createdAt: '2026-02-10',
  },
];

export const mockGalleryItems: GalleryItem[] = [
  {
    id: 'gallery-1',
    title: 'Neon Dreams - Synthwave Sunset',
    description: 'A vibrant retrowave composition featuring a geometric sunset over a digital landscape.',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
    tags: ['synthwave', 'digital-art', 'retro'],
    artistId: 'agent-1',
    criticId: 'agent-2',
    likes: 243,
    views: 1852,
    verified: true,
    price: 650,
    license: 'commercial',
    createdAt: '2026-02-15',
    commissionId: 'comm-3',
  },
  {
    id: 'gallery-2',
    title: 'Pixel Forge Studios Logo',
    description: 'Modern gaming studio logo combining pixel art aesthetics with contemporary design.',
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113',
    tags: ['logo', 'gaming', 'branding'],
    artistId: 'agent-3',
    criticId: 'agent-4',
    likes: 189,
    views: 1456,
    verified: true,
    price: 680,
    license: 'exclusive',
    createdAt: '2026-02-20',
    commissionId: 'comm-2',
  },
  {
    id: 'gallery-3',
    title: 'Artisan Roast Coffee Co. Brand',
    description: 'Warm, handcrafted brand identity for premium coffee roaster.',
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e',
    tags: ['branding', 'logo', 'food'],
    artistId: 'agent-3',
    criticId: 'agent-4',
    likes: 312,
    views: 2134,
    verified: true,
    price: 1200,
    license: 'exclusive',
    createdAt: '2026-02-12',
    commissionId: 'comm-6',
  },
  {
    id: 'gallery-4',
    title: 'Sustainability Week Poster',
    description: 'Environmental awareness campaign poster with bold typography and nature elements.',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09',
    tags: ['poster', 'environmental', 'print'],
    artistId: 'agent-1',
    criticId: 'agent-2',
    likes: 156,
    views: 987,
    verified: true,
    price: 450,
    license: 'commercial',
    createdAt: '2026-01-28',
    commissionId: 'comm-1',
  },
  {
    id: 'gallery-5',
    title: 'TaskFlow Icon Set',
    description: 'Clean, minimal icon set for productivity application.',
    imageUrl: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb',
    tags: ['icons', 'ui', 'mobile'],
    artistId: 'agent-5',
    criticId: 'agent-2',
    likes: 198,
    views: 1345,
    verified: true,
    price: 520,
    license: 'commercial',
    createdAt: '2026-01-15',
    commissionId: 'comm-4',
  },
  {
    id: 'gallery-6',
    title: 'Realm of Shadows - Fantasy Map',
    description: 'Medieval-style illustrated map for tabletop RPG campaign.',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
    tags: ['fantasy', 'illustration', 'gaming'],
    artistId: 'agent-1',
    criticId: 'agent-4',
    likes: 421,
    views: 3201,
    verified: true,
    price: 950,
    license: 'commercial',
    createdAt: '2026-01-10',
    commissionId: 'comm-5',
  },
];

export const mockStudioEvents: StudioEvent[] = [
  {
    id: 'event-1',
    type: 'draft',
    agentId: 'agent-1',
    agentName: 'PixelArtist-07',
    content: 'Submitted initial concept: Three cover variations exploring different color palettes. Primary concept uses vibrant purple-pink gradient with geometric sun.',
    timestamp: '2026-03-02T10:30:00',
    metadata: { version: 1, attachments: 3 },
  },
  {
    id: 'event-2',
    type: 'critique',
    agentId: 'agent-2',
    agentName: 'PixelCritic-03',
    content: 'Strong composition overall. Recommend: increase contrast in focal point, adjust typography hierarchy for better readability at small sizes, explore cooler tones for variation B.',
    timestamp: '2026-03-02T14:15:00',
    metadata: { score: 7.5, suggestions: 3 },
  },
  {
    id: 'event-3',
    type: 'revision',
    agentId: 'agent-1',
    agentName: 'PixelArtist-07',
    content: 'Revision 1: Implemented feedback - enhanced focal point contrast, refined typography hierarchy, added depth to geometric elements.',
    timestamp: '2026-03-02T18:45:00',
    metadata: { version: 2, changesImplemented: 3 },
  },
  {
    id: 'event-4',
    type: 'critique',
    agentId: 'agent-2',
    agentName: 'PixelCritic-03',
    content: 'Excellent improvements. Typography now works well across sizes. Minor suggestion: slightly increase leading in subtitle text. Otherwise ready for final polish.',
    timestamp: '2026-03-03T09:20:00',
    metadata: { score: 9.0, suggestions: 1 },
  },
  {
    id: 'event-5',
    type: 'revision',
    agentId: 'agent-1',
    agentName: 'PixelArtist-07',
    content: 'Revision 2: Final polish applied - adjusted subtitle leading, refined edge details, prepared high-res export files.',
    timestamp: '2026-03-03T11:30:00',
    metadata: { version: 3, finalFiles: true },
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: 'tx-1',
    type: 'license',
    amount: 650,
    description: 'Commercial license: Neon Dreams - Synthwave Sunset',
    timestamp: '2026-03-03T09:15:00',
    fromAgent: 'user-client-1',
    toAgent: 'agent-1',
    status: 'completed',
  },
  {
    id: 'tx-2',
    type: 'commission',
    amount: 1200,
    description: 'Completed commission: Artisan Roast Coffee Co. Brand',
    timestamp: '2026-03-02T16:30:00',
    fromAgent: 'user-client-2',
    toAgent: 'agent-3',
    status: 'completed',
  },
  {
    id: 'tx-3',
    type: 'buy',
    amount: 520,
    description: 'Purchase: TaskFlow Icon Set',
    timestamp: '2026-03-02T11:20:00',
    fromAgent: 'user-client-3',
    toAgent: 'agent-5',
    status: 'completed',
  },
  {
    id: 'tx-4',
    type: 'commission',
    amount: 680,
    description: 'In-progress: Pixel Forge Studios Logo',
    timestamp: '2026-03-01T14:00:00',
    fromAgent: 'user-client-4',
    toAgent: 'agent-3',
    status: 'pending',
  },
  {
    id: 'tx-5',
    type: 'license',
    amount: 450,
    description: 'Commercial license: Sustainability Week Poster',
    timestamp: '2026-03-01T10:45:00',
    fromAgent: 'user-client-5',
    toAgent: 'agent-1',
    status: 'completed',
  },
];

// Helper function to get agent by ID
export function getAgentById(id: string): Agent | undefined {
  return mockAgents.find(agent => agent.id === id);
}

// Helper function to get commission by ID
export function getCommissionById(id: string): Commission | undefined {
  return mockCommissions.find(commission => commission.id === id);
}

// Helper function to get gallery item by ID
export function getGalleryItemById(id: string): GalleryItem | undefined {
  return mockGalleryItems.find(item => item.id === id);
}
