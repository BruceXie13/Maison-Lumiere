import { useState, useEffect, useCallback, useRef } from 'react';

interface UseApiOptions {
  pollInterval?: number;
  enabled?: boolean;
}

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useApiData<T>(
  fetcher: () => Promise<T>,
  options: UseApiOptions = {},
): UseApiResult<T> {
  const { pollInterval, enabled = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const doFetch = useCallback(async (isInitial = false) => {
    if (!enabled) return;
    if (isInitial) setLoading(true);
    try {
      const result = await fetcherRef.current();
      if (mountedRef.current) {
        setData(result);
        setError(null);
      }
    } catch (err: unknown) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    } finally {
      if (mountedRef.current && isInitial) setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    mountedRef.current = true;
    doFetch(true);

    let timer: ReturnType<typeof setInterval> | undefined;
    if (pollInterval && pollInterval > 0) {
      timer = setInterval(() => doFetch(false), pollInterval);
    }

    return () => {
      mountedRef.current = false;
      if (timer) clearInterval(timer);
    };
  }, [doFetch, pollInterval]);

  return { data, loading, error, refetch: () => doFetch(true) };
}

// ── Convenience hooks ─────────────────────────────────

import {
  fetchAgents, fetchAgent, fetchCommissions, fetchCommission,
  fetchGallery, fetchGalleryItem, fetchTransactions,
  fetchStudio, fetchStudioEvents, fetchFeed, fetchState, fetchMetrics,
  fetchExchangeSummary,
} from '../lib/api';
import type { Agent, Commission, GalleryItem, Transaction } from '../app/data/mockData';
import type { AppState, Metrics, FeedEntry, ExchangeSummary, StudioSession, PaginatedGallery } from '../lib/api';

export function useAgents(pollInterval = 5000) {
  return useApiData<Agent[]>(() => fetchAgents(), { pollInterval });
}

export function useAgent(id: string) {
  return useApiData<Agent>(() => fetchAgent(id), { enabled: !!id });
}

export function useCommissions(pollInterval = 5000) {
  return useApiData<Commission[]>(() => fetchCommissions(), { pollInterval });
}

export function useCommission(id: string) {
  return useApiData<Commission>(() => fetchCommission(id), { enabled: !!id });
}

export function useGallery(params?: { tag?: string; artist_id?: string; owner_id?: string; sort?: string; page?: number; per_page?: number }, pollInterval = 5000) {
  return useApiData<PaginatedGallery>(() => fetchGallery(params), { pollInterval });
}

export function useGalleryItem(id: string) {
  return useApiData<GalleryItem>(() => fetchGalleryItem(id), { enabled: !!id });
}

export function useTransactions(pollInterval = 5000) {
  return useApiData<Transaction[]>(() => fetchTransactions(), { pollInterval });
}

export function useStudio(commissionId: string) {
  return useApiData<StudioSession>(() => fetchStudio(commissionId), { enabled: !!commissionId, pollInterval: 3000 });
}

export function useStudioEvents(commissionId: string) {
  return useApiData(() => fetchStudioEvents(commissionId), { enabled: !!commissionId, pollInterval: 3000 });
}

export function useFeed(pollInterval = 3000) {
  return useApiData<FeedEntry[]>(() => fetchFeed(), { pollInterval });
}

export function useAppState(pollInterval = 5000) {
  return useApiData<AppState>(() => fetchState(), { pollInterval });
}

export function useMetrics(pollInterval = 5000) {
  return useApiData<Metrics>(() => fetchMetrics(), { pollInterval });
}

export function useExchangeSummary(pollInterval = 5000) {
  return useApiData<ExchangeSummary>(() => fetchExchangeSummary(), { pollInterval });
}
