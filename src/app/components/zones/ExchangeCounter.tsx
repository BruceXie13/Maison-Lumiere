import { useState } from 'react';
import { useTransactions, useExchangeSummary } from '../../../hooks/useApi';
export function ExchangeCounter() {
  const [filterType, setFilterType] = useState('all');
  const { data: apiTx } = useTransactions(5000);
  const { data: summary } = useExchangeSummary(8000);
  const transactions = apiTx ?? [];

  const allTypes = ['all', ...new Set(transactions.map(t => t.type))];
  const filtered = filterType === 'all' ? transactions : transactions.filter(t => t.type === filterType);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="pixel-heading text-3xl">Trade History</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--g-text-secondary)' }}>
            {transactions.length} total trades
          </p>
        </div>
        <div className="flex gap-6 text-center">
          <div>
            <div className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--g-gold)' }}>
              {(summary?.total_volume ?? 0).toLocaleString()}
            </div>
            <div className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--g-text-tertiary)' }}>Volume (cr)</div>
          </div>
          <div>
            <div className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
              {summary?.completed_count ?? 0}
            </div>
            <div className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--g-text-tertiary)' }}>Completed</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {allTypes.map(type => (
          <button
            key={type}
            className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
            style={filterType === type
              ? { background: 'var(--g-navy)', color: '#fff' }
              : { background: 'var(--g-bg-muted)', color: 'var(--g-text-secondary)', border: '1px solid var(--g-border)' }
            }
            onClick={() => setFilterType(type)}
          >
            {type === 'all' ? 'All' : type.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Transactions */}
      <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--g-border)' }}>
        {filtered.map((tx, i) => (
          <div
            key={tx.id}
            className="flex items-center gap-4 px-5 py-3"
            style={{
              borderBottom: i < filtered.length - 1 ? '1px solid var(--g-border)' : undefined,
              background: i % 2 === 0 ? 'var(--g-bg-card)' : 'var(--g-bg-muted)',
            }}
          >
            <div className="flex-1 min-w-0">
              <div className="text-sm truncate">{tx.description}</div>
              <div className="text-[11px] mt-0.5 flex items-center gap-1" style={{ color: 'var(--g-text-tertiary)' }}>
                {tx.fromAgent && <span>{tx.fromAgent}</span>}
                {tx.fromAgent && tx.toAgent && <span>&rarr;</span>}
                {tx.toAgent && <span>{tx.toAgent}</span>}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-sm font-semibold" style={{ color: 'var(--g-gold)' }}>{tx.amount} cr</div>
              <div className="text-[11px]" style={{ color: 'var(--g-text-tertiary)' }}>
                {new Date(tx.timestamp).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm" style={{ color: 'var(--g-text-tertiary)' }}>No transactions found.</div>
        )}
      </div>
    </div>
  );
}
