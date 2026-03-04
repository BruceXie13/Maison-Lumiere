import { useState } from 'react';
import { useCommissions, useAgents } from '../../../hooks/useApi';
import { mockCommissions, mockAgents } from '../../data/mockData';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Briefcase, Clock, Tag, ArrowRight, Plus, Filter, Zap } from 'lucide-react';

export function CommissionBoardRoom() {
  const [selectedCommission, setSelectedCommission] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'in-progress' | 'completed'>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const navigate = useNavigate();

  const { data: apiCommissions } = useCommissions(5000);
  const { data: apiAgents } = useAgents(10000);
  const commissions = apiCommissions ?? mockCommissions;
  const agents = apiAgents ?? mockAgents;

  const allTypes = ['all', ...new Set(commissions.map((c) => c.type))];

  const filteredCommissions = commissions.filter((c) => {
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    if (filterType !== 'all' && c.type !== filterType) return false;
    return true;
  });

  const openCommissions = commissions.filter((c) => c.status === 'open');
  const inProgressCommissions = commissions.filter((c) => c.status === 'in-progress');
  const completedCommissions = commissions.filter((c) => c.status === 'completed');

  const commission = selectedCommission
    ? commissions.find((c) => c.id === selectedCommission)
    : null;

  const statusColors: Record<string, string> = {
    open: '#22C55E',
    'in-progress': '#F59E0B',
    completed: '#8B5CF6',
  };

  const ticketColors = ['#FCE7F3', '#F3E8FF', '#DCFCE7', '#DBEAFE', '#FEF3C7', '#FFF7ED'];
  const ticketBorders = ['#EC4899', '#8B5CF6', '#22C55E', '#3B82F6', '#F59E0B', '#F97316'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #F59E0B, #F97316)',
              boxShadow: '0 3px 0 #B45309, 0 4px 8px rgba(245, 158, 11, 0.25)',
            }}
          >
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="pixel-heading text-2xl">Commission Board</h1>
            <p className="pixel-text-muted text-xs mt-1">Browse jobs · Post commissions · Track progress</p>
          </div>
        </div>
        <button className="pixel-button flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          Post Commission
        </button>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-4 gap-3">
        <div className="pixel-panel-dark p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: 'var(--pixel-success)' }}>
            <span className="text-sm">📋</span>
          </div>
          <div>
            <div className="text-lg font-bold" style={{ color: 'var(--pixel-success)' }}>{openCommissions.length}</div>
            <div className="pixel-text-muted text-[10px] uppercase">Open</div>
          </div>
        </div>
        <div className="pixel-panel-dark p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: 'var(--pixel-warning)' }}>
            <span className="text-sm">⏳</span>
          </div>
          <div>
            <div className="text-lg font-bold" style={{ color: 'var(--pixel-warning)' }}>{inProgressCommissions.length}</div>
            <div className="pixel-text-muted text-[10px] uppercase">In Progress</div>
          </div>
        </div>
        <div className="pixel-panel-dark p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: 'var(--pixel-accent-plum)' }}>
            <span className="text-sm">✅</span>
          </div>
          <div>
            <div className="text-lg font-bold" style={{ color: 'var(--pixel-accent-plum)' }}>{completedCommissions.length}</div>
            <div className="pixel-text-muted text-[10px] uppercase">Completed</div>
          </div>
        </div>
        <div className="pixel-panel-dark p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: 'var(--pixel-exchange-brass)' }}>
            <span className="text-sm">💰</span>
          </div>
          <div>
            <div className="text-lg font-bold" style={{ color: 'var(--pixel-exchange-brass)' }}>
              {commissions.reduce((sum, c) => sum + c.budget, 0).toLocaleString()}
            </div>
            <div className="pixel-text-muted text-[10px] uppercase">Total Value</div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="pixel-panel p-3 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 pixel-text-muted" />
          <span className="pixel-text text-xs font-medium">Status:</span>
          <div className="flex gap-1">
            {(['all', 'open', 'in-progress', 'completed'] as const).map((status) => (
              <button
                key={status}
                className={filterStatus === status ? 'pixel-button px-3 py-1 text-xs' : 'pixel-button-secondary px-3 py-1 text-xs'}
                onClick={() => setFilterStatus(status)}
              >
                {status === 'all' ? 'All' : status === 'in-progress' ? 'Active' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="w-px h-6" style={{ backgroundColor: 'var(--pixel-bg-light)' }} />
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 pixel-text-muted" />
          <span className="pixel-text text-xs font-medium">Type:</span>
          <div className="flex gap-1 flex-wrap">
            {allTypes.map((type) => (
              <button
                key={type}
                className={filterType === type ? 'pixel-button px-3 py-1 text-xs' : 'pixel-button-secondary px-3 py-1 text-xs'}
                onClick={() => setFilterType(type)}
              >
                {type === 'all' ? 'All' : type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-3">
          {filteredCommissions.length === 0 ? (
            <div className="pixel-panel p-8 text-center">
              <p className="pixel-text-muted">No commissions match your filters</p>
            </div>
          ) : (
            filteredCommissions.map((comm, index) => (
              <motion.div
                key={comm.id}
                className="pixel-panel pixel-card-hover cursor-pointer overflow-hidden"
                onClick={() => setSelectedCommission(comm.id)}
                whileHover={{ y: -2 }}
              >
                <div className="flex">
                  <div
                    className="w-2 flex-shrink-0 rounded-l-lg"
                    style={{ backgroundColor: ticketBorders[index % ticketBorders.length] }}
                  />
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="pixel-text font-medium text-sm truncate">{comm.title}</h3>
                        </div>
                        <p className="pixel-text-muted text-xs line-clamp-1">{comm.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <div
                          className="pixel-badge text-[10px] px-2 py-0.5"
                          style={{
                            backgroundColor: statusColors[comm.status],
                            color: 'var(--pixel-bg-dark)',
                          }}
                        >
                          {comm.status === 'in-progress' ? 'active' : comm.status}
                        </div>
                        <span className="font-bold text-sm" style={{ color: 'var(--pixel-exchange-brass)' }}>
                          {comm.budget} cr
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="px-2 py-0.5 text-[10px] rounded" style={{ backgroundColor: 'var(--pixel-bg-light)', color: 'var(--pixel-text-muted)' }}>
                        {comm.type}
                      </span>
                      <span className="pixel-text-muted text-[10px] flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {comm.deadline}
                      </span>
                      {comm.artistId && (
                        <span className="pixel-text-muted text-[10px] flex items-center gap-1">
                          🎨 {agents.find(a => a.id === comm.artistId)?.name || 'Assigned'}
                        </span>
                      )}
                      <div className="flex gap-1 ml-auto">
                        {comm.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: 'var(--pixel-bg-dark)', color: 'var(--pixel-text-muted)' }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          <div className="pixel-panel p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4" style={{ color: 'var(--pixel-exchange-amber)' }} />
              <h3 className="pixel-heading text-lg">Hot Commission</h3>
            </div>
            {openCommissions[0] && (
              <div
                className="p-3 rounded cursor-pointer"
                style={{
                  backgroundColor: ticketColors[0],
                  border: '3px solid rgba(0,0,0,0.15)',
                  boxShadow: '3px 3px 0 rgba(0,0,0,0.2)',
                }}
                onClick={() => setSelectedCommission(openCommissions[0].id)}
              >
                <div className="text-sm font-bold mb-1" style={{ color: '#1a1625' }}>{openCommissions[0].title}</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(0,0,0,0.15)', color: '#1a1625' }}>
                    {openCommissions[0].budget} cr
                  </span>
                  <span className="text-xs" style={{ color: 'rgba(26,22,37,0.7)' }}>{openCommissions[0].type}</span>
                </div>
              </div>
            )}
          </div>

          <div className="pixel-panel p-4">
            <h3 className="pixel-heading text-lg mb-3">🎨 Active Studios</h3>
            <div className="space-y-2">
              {inProgressCommissions.map((comm) => {
                const artist = comm.artistId ? agents.find(a => a.id === comm.artistId) : null;
                return (
                  <div
                    key={comm.id}
                    className="pixel-panel-dark p-3 cursor-pointer hover:brightness-110 transition-all"
                    onClick={() => navigate(`/studio/${comm.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="pixel-text text-xs font-medium truncate">{comm.title}</div>
                        <div className="pixel-text-muted text-[10px] mt-0.5 flex items-center gap-1">
                          <div className="status-dot status-dot-active w-2 h-2" />
                          {artist?.name || 'Working...'}
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 pixel-text-muted flex-shrink-0" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pixel-panel p-4">
            <h3 className="pixel-heading text-lg mb-3">🏷️ Popular Tags</h3>
            <div className="flex flex-wrap gap-1.5">
              {Array.from(new Set(commissions.flatMap(c => c.tags))).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-[10px] rounded cursor-pointer transition-all hover:brightness-125"
                  style={{ backgroundColor: 'var(--pixel-bg-light)', color: 'var(--pixel-text-bright)' }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="pixel-panel-dark p-3">
            <div className="text-[10px] pixel-text-muted leading-relaxed">
              💡 <strong className="pixel-text">Tip:</strong> Click any commission to view details. Open commissions can be accepted to start a studio collaboration.
            </div>
          </div>
        </div>
      </div>

      {/* Commission Detail Modal */}
      {commission && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedCommission(null)}
        >
          <motion.div
            className="pixel-panel p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto pixel-scroll"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="pixel-heading text-2xl mb-2">{commission.title}</h3>
                <div className="flex gap-2">
                  <div
                    className="pixel-badge"
                    style={{
                      backgroundColor: statusColors[commission.status],
                      color: 'var(--pixel-bg-dark)',
                    }}
                  >
                    {commission.status}
                  </div>
                  <div className="pixel-badge pixel-badge-artist">{commission.type}</div>
                </div>
              </div>
              <button className="pixel-button-secondary px-3 py-2 text-xs" onClick={() => setSelectedCommission(null)}>✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="pixel-text-muted text-xs uppercase mb-2">Description</p>
                <p className="pixel-text text-sm leading-relaxed">{commission.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="pixel-panel-dark p-3 text-center">
                  <div className="text-xl font-bold" style={{ color: 'var(--pixel-accent-yellow)' }}>{commission.budget} cr</div>
                  <div className="pixel-text-muted text-xs mt-1">Budget</div>
                </div>
                <div className="pixel-panel-dark p-3 text-center">
                  <div className="text-sm font-bold" style={{ color: 'var(--pixel-accent-pink)' }}>{commission.deadline}</div>
                  <div className="pixel-text-muted text-xs mt-1">Deadline</div>
                </div>
                <div className="pixel-panel-dark p-3 text-center">
                  <div className="text-sm font-bold" style={{ color: 'var(--pixel-accent-green)' }}>{commission.createdAt?.split('T')[0] || commission.createdAt}</div>
                  <div className="pixel-text-muted text-xs mt-1">Posted</div>
                </div>
              </div>

              <div>
                <p className="pixel-text-muted text-xs uppercase mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {commission.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 text-xs rounded" style={{ backgroundColor: 'var(--pixel-bg-light)', color: 'var(--pixel-text-bright)' }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {commission.status === 'open' && (
                <button className="pixel-button w-full py-3" onClick={() => navigate(`/studio/${commission.id}`)}>
                  Accept Commission
                </button>
              )}
              {commission.status === 'in-progress' && (
                <button className="pixel-button-secondary pixel-button w-full py-3" onClick={() => navigate(`/studio/${commission.id}`)}>
                  View Studio
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
