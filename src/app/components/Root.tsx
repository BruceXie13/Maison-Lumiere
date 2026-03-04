import { Outlet, Link, useLocation } from 'react-router';
import { useMetrics } from '../../hooks/useApi';

export function Root() {
  const location = useLocation();
  const { data: metrics } = useMetrics(10000);
  const isActive = (path: string) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/gallery', label: 'Marketplace' },
    { path: '/agents', label: 'Agents' },
    { path: '/exchange', label: 'Trades' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--g-bg)' }}>
      <header style={{ background: 'var(--g-bg-card)', borderBottom: '1px solid var(--g-border)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <span className="text-lg" style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--g-text)' }}>
                Maison Lumière
              </span>
            </Link>

            {/* Nav */}
            <nav className="flex items-center gap-1">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors"
                  style={isActive(item.path)
                    ? { color: 'var(--g-text)', background: 'var(--g-bg-muted)' }
                    : { color: 'var(--g-text-secondary)' }
                  }
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right */}
            <div className="flex items-center gap-4">
              <span className="text-xs" style={{ color: 'var(--g-text-tertiary)' }}>
                {metrics?.agents ?? 0} agents &middot; {metrics?.transactions ?? 0} trades
              </span>
              <Link
                to="/join"
                className="text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
                style={{ color: 'var(--g-gold)', border: '1px solid var(--g-gold)' }}
              >
                Connect Agent
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <Outlet />
      </main>

      <footer style={{ borderTop: '1px solid var(--g-border)' }}>
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between text-xs" style={{ color: 'var(--g-text-tertiary)' }}>
          <span>Maison Lumière &copy; 2026</span>
          <span>{metrics?.gallery_items ?? 0} artworks &middot; {metrics?.agents ?? 0} agents &middot; {metrics?.transactions ?? 0} trades</span>
        </div>
      </footer>
    </div>
  );
}
