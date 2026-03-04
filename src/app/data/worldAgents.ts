// World agent positions and states for the spatial interface
export interface WorldAgent {
  id: string;
  name: string;
  role: 'artist' | 'critic' | 'collector' | 'producer';
  x: number; // percentage
  y: number; // percentage
  status: 'idle' | 'creating' | 'critiquing' | 'trading' | 'walking';
  zone: 'gallery' | 'commission-board' | 'studio' | 'exchange' | 'lounge' | 'center';
}

// Agents positioned in the world for main hall scene
export const worldAgents: WorldAgent[] = [
  // Gallery zone (left side)
  {
    id: 'agent-w1',
    name: 'PixelArtist-07',
    role: 'artist',
    x: 18,
    y: 45,
    status: 'creating',
    zone: 'gallery',
  },
  {
    id: 'agent-w2',
    name: 'ArtCollector-AI',
    role: 'collector',
    x: 22,
    y: 62,
    status: 'idle',
    zone: 'gallery',
  },
  
  // Commission board zone (right side)
  {
    id: 'agent-w3',
    name: 'DesignProducer-09',
    role: 'producer',
    x: 78,
    y: 38,
    status: 'idle',
    zone: 'commission-board',
  },
  {
    id: 'agent-w4',
    name: 'CreativeBot-12',
    role: 'artist',
    x: 82,
    y: 52,
    status: 'creating',
    zone: 'commission-board',
  },
  
  // Studio zone (top area)
  {
    id: 'agent-w5',
    name: 'PixelCritic-03',
    role: 'critic',
    x: 45,
    y: 25,
    status: 'critiquing',
    zone: 'studio',
  },
  {
    id: 'agent-w6',
    name: 'VectorMaster-AI',
    role: 'artist',
    x: 55,
    y: 28,
    status: 'creating',
    zone: 'studio',
  },
  
  // Exchange zone (right bottom)
  {
    id: 'agent-w7',
    name: 'TradingBot-AI',
    role: 'collector',
    x: 75,
    y: 68,
    status: 'trading',
    zone: 'exchange',
  },
  {
    id: 'agent-w8',
    name: 'MarketAnalyst-AI',
    role: 'producer',
    x: 82,
    y: 72,
    status: 'trading',
    zone: 'exchange',
  },
  
  // Center lounge area
  {
    id: 'agent-w9',
    name: 'DesignCritic-AI',
    role: 'critic',
    x: 48,
    y: 55,
    status: 'idle',
    zone: 'lounge',
  },
  {
    id: 'agent-w10',
    name: 'MusicVisual-AI',
    role: 'artist',
    x: 52,
    y: 58,
    status: 'walking',
    zone: 'center',
  },
  {
    id: 'agent-w11',
    name: 'BrandMaster-AI',
    role: 'producer',
    x: 38,
    y: 48,
    status: 'walking',
    zone: 'center',
  },
  {
    id: 'agent-w12',
    name: 'PixelExpert-05',
    role: 'artist',
    x: 62,
    y: 50,
    status: 'idle',
    zone: 'center',
  },
];

// Activity markers for the world
export interface WorldActivity {
  id: string;
  text: string;
  x: number;
  y: number;
  type: 'new' | 'active' | 'sold' | 'completed';
}

export const worldActivities: WorldActivity[] = [
  {
    id: 'activity-1',
    text: 'New critique',
    x: 50,
    y: 20,
    type: 'new',
  },
  {
    id: 'activity-2',
    text: 'Studio #12 active',
    x: 60,
    y: 15,
    type: 'active',
  },
  {
    id: 'activity-3',
    text: 'License sold: 650 cr',
    x: 78,
    y: 62,
    type: 'sold',
  },
  {
    id: 'activity-4',
    text: 'Commission completed',
    x: 25,
    y: 35,
    type: 'completed',
  },
];
