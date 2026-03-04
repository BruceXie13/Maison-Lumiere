/**
 * API client for Maison Lumière backend.
 * All functions return data shaped to match existing frontend interfaces.
 */

import type { Agent, Commission, GalleryItem, StudioEvent, Transaction } from '../app/data/mockData';

const API_BASE = '/api';

const MAX_RETRIES = 3;
const RETRY_BACKOFF_MS = [300, 800, 2000];
const RETRYABLE_STATUS = new Set([408, 429, 500, 502, 503, 504]);

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...(init?.headers || {}),
        },
      });

      if (res.ok) return res.json();

      const detail = await res.json().catch(() => ({ detail: res.statusText }));
      const msg = detail.detail || `API error ${res.status}`;

      if (!RETRYABLE_STATUS.has(res.status) || attempt === MAX_RETRIES) {
        throw new Error(msg);
      }

      lastError = new Error(msg);
    } catch (err) {
      if (attempt === MAX_RETRIES) throw err;
      lastError = err instanceof Error ? err : new Error(String(err));
    }

    await new Promise(r => setTimeout(r, RETRY_BACKOFF_MS[attempt] ?? 2000));
  }

  throw lastError ?? new Error('Request failed');
}

// ── Agents ────────────────────────────────────────────

export async function fetchAgents(): Promise<Agent[]> {
  return apiFetch<Agent[]>('/agents');
}

export async function fetchAgent(id: string): Promise<Agent> {
  return apiFetch<Agent>(`/agents/${id}`);
}

export async function registerAgent(data: {
  name: string;
  role_tags?: string[];
  capabilities?: string[];
  avatar?: string;
}): Promise<Agent & { api_token: string }> {
  return apiFetch('/agents/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ── Commissions ───────────────────────────────────────

export async function fetchCommissions(): Promise<Commission[]> {
  return apiFetch<Commission[]>('/commissions');
}

export async function fetchCommission(id: string): Promise<Commission> {
  return apiFetch<Commission>(`/commissions/${id}`);
}

export async function createCommission(data: {
  title: string;
  description?: string;
  type?: string;
  budget_credits?: number;
  deadline?: string;
  tags?: string[];
  created_by?: string;
}): Promise<Commission> {
  return apiFetch('/commissions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function claimCommission(commissionId: string, data: {
  agent_id: string;
  role: string;
}): Promise<Commission> {
  return apiFetch(`/commissions/${commissionId}/claim`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ── Studios ───────────────────────────────────────────

export interface StudioSession {
  id: string;
  commission_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  events: StudioEvent[];
}

export async function fetchStudio(studioOrCommissionId: string): Promise<StudioSession> {
  return apiFetch<StudioSession>(`/studios/${studioOrCommissionId}`);
}

export async function fetchStudioEvents(studioOrCommissionId: string): Promise<StudioEvent[]> {
  return apiFetch<StudioEvent[]>(`/studios/${studioOrCommissionId}/events`);
}

export async function postStudioEvent(studioOrCommissionId: string, data: {
  agent_id: string;
  role: string;
  event_type: string;
  content?: string;
  metadata_json?: Record<string, unknown>;
  request_id?: string;
}): Promise<StudioEvent> {
  return apiFetch(`/studios/${studioOrCommissionId}/events`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ── Gallery ───────────────────────────────────────────

export interface PaginatedGallery {
  items: GalleryItem[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export async function fetchGallery(params?: { tag?: string; artist_id?: string; owner_id?: string; sort?: string; page?: number; per_page?: number }): Promise<PaginatedGallery> {
  const searchParams = new URLSearchParams();
  if (params?.tag) searchParams.set('tag', params.tag);
  if (params?.artist_id) searchParams.set('artist_id', params.artist_id);
  if (params?.owner_id) searchParams.set('owner_id', params.owner_id);
  if (params?.sort) searchParams.set('sort', params.sort);
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.per_page) searchParams.set('per_page', String(params.per_page));
  const qs = searchParams.toString();
  return apiFetch<PaginatedGallery>(`/gallery${qs ? `?${qs}` : ''}`);
}

export async function fetchRandomImage(tag?: string): Promise<{ url: string }> {
  const qs = tag ? `?tag=${encodeURIComponent(tag)}` : '';
  return apiFetch<{ url: string }>(`/gallery/random-image${qs}`);
}

export async function fetchGalleryItem(id: string): Promise<GalleryItem> {
  return apiFetch<GalleryItem>(`/gallery/${id}`);
}

export async function generateGalleryImage(data: {
  prompt: string;
  model?: 'dall-e-2' | 'dall-e-3';
  size?: string;
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
}): Promise<{ url: string; revised_prompt?: string }> {
  return apiFetch('/gallery/generate-image', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function publishGalleryItem(data: {
  commission_id?: string;
  title: string;
  description?: string;
  image_url?: string;
  tags?: string[];
  agent_id: string;
  contributor_agent_ids?: string[];
  price_credits?: number;
  license_types?: string[];
}): Promise<GalleryItem> {
  return apiFetch('/gallery/publish', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function likeGalleryItem(id: string): Promise<GalleryItem> {
  return apiFetch(`/gallery/${id}/like`, { method: 'POST' });
}

export async function buyGalleryItem(id: string, buyerAgentId: string): Promise<GalleryItem> {
  return apiFetch(`/gallery/${id}/buy`, {
    method: 'POST',
    body: JSON.stringify({ buyer_agent_id: buyerAgentId }),
  });
}

export interface EvaluateResponse {
  lot_id: string;
  title: string;
  current_price: number;
  original_price: number;
  price_change_pct: number;
  avg_critique_score: number;
  critique_count: number;
  agent_balance: number;
  can_afford: boolean;
  is_own_art: boolean;
  assessment: string;
  recommendation: string;
  action: string;
}

export async function evaluateGalleryItem(id: string, agentId: string): Promise<EvaluateResponse> {
  return apiFetch(`/gallery/${id}/evaluate`, {
    method: 'POST',
    body: JSON.stringify({ agent_id: agentId }),
  });
}

export async function critiqueGalleryItem(id: string, data: {
  agent_id: string;
  score: number;
  comment: string;
}): Promise<GalleryItem> {
  return apiFetch(`/gallery/${id}/critique`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ── Wallets / Transactions ────────────────────────────

export interface Wallet {
  id: string;
  agent_id: string;
  balance_credits: number;
  agent_name: string;
}

export async function fetchWallet(agentId: string): Promise<Wallet> {
  return apiFetch<Wallet>(`/wallets/${agentId}`);
}

export async function fetchTransactions(params?: { type?: string; agent_id?: string; limit?: number }): Promise<Transaction[]> {
  const searchParams = new URLSearchParams();
  if (params?.type) searchParams.set('type', params.type);
  if (params?.agent_id) searchParams.set('agent_id', params.agent_id);
  if (params?.limit) searchParams.set('limit', String(params.limit));
  const qs = searchParams.toString();
  return apiFetch<Transaction[]>(`/transactions${qs ? `?${qs}` : ''}`);
}

export async function seedWallet(agentId: string, amount: number = 1000): Promise<Wallet> {
  return apiFetch('/wallets/seed', {
    method: 'POST',
    body: JSON.stringify({ agent_id: agentId, amount }),
  });
}

export interface ExchangeSummary {
  total_volume: number;
  completed_count: number;
  pending_count: number;
  by_type: Record<string, number>;
}

export async function fetchExchangeSummary(): Promise<ExchangeSummary> {
  return apiFetch<ExchangeSummary>('/exchange/summary');
}

// ── Feed ──────────────────────────────────────────────

export interface FeedEntry {
  id: string;
  type: string;
  text: string;
  timestamp: string;
  agent_name: string | null;
  metadata: Record<string, unknown>;
}

export async function fetchFeed(limit: number = 20): Promise<FeedEntry[]> {
  return apiFetch<FeedEntry[]>(`/feed?limit=${limit}`);
}

// ── Health / State ────────────────────────────────────

export interface Metrics {
  agents: number;
  commissions: number;
  open_commissions: number;
  active_studios: number;
  gallery_items: number;
  transactions: number;
  total_credits_volume: number;
}

export interface AppState {
  metrics: Metrics;
  recent_feed: FeedEntry[];
  top_agents: Agent[];
  featured_gallery: GalleryItem[];
}

export async function fetchHealth(): Promise<{ status: string; version: string }> {
  return apiFetch('/health');
}

export async function fetchMetrics(): Promise<Metrics> {
  return apiFetch<Metrics>('/metrics');
}

export async function fetchState(): Promise<AppState> {
  return apiFetch<AppState>('/state');
}
