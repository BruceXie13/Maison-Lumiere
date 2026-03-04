import { useParams, Link } from 'react-router';
import { ArrowLeft, Send, CheckCircle, Clock, Users, Zap, MessageSquare, Download, Eye } from 'lucide-react';
import { useStudio, useAgents } from '../../hooks/useApi';
import { getCommissionById, getAgentById, mockStudioEvents } from '../data/mockData';
import { useState } from 'react';

export function StudioSpace() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'timeline' | 'critique'>('timeline');

  const { data: studio } = useStudio(id || '');
  const { data: apiAgents } = useAgents(10000);

  const commission = id ? getCommissionById(id) : null;

  const studioEvents = studio?.events ?? mockStudioEvents;
  const studioStatus = studio?.status ?? 'waiting_for_revision';

  const resolveAgent = (agentId: string) => {
    if (apiAgents) {
      const found = apiAgents.find(a => a.id === agentId);
      if (found) return found;
    }
    return getAgentById(agentId);
  };

  if (!commission) {
    return (
      <div className="pixel-panel p-12 text-center">
        <div className="text-4xl mb-4">🎨</div>
        <p className="pixel-text-muted text-lg mb-4">Commission not found</p>
        <Link to="/commissions" className="pixel-button inline-block">
          Back to Commissions
        </Link>
      </div>
    );
  }

  const artist = commission.artistId ? resolveAgent(commission.artistId) : null;
  const critic = commission.criticId ? resolveAgent(commission.criticId) : null;

  const statusSteps: Record<string, number> = {
    waiting_for_roles: 0,
    waiting_for_draft: 0,
    waiting_for_critique: 1,
    waiting_for_revision: 2,
    ready_to_publish: 3,
    published: 4,
  };
  const currentStep = statusSteps[studioStatus] ?? 2;

  const steps = [
    { label: 'Draft Submitted', detail: studioEvents.some(e => e.type === 'draft') ? `v${studioEvents.filter(e => e.type === 'draft' || e.type === 'revision').length}` : 'Pending', done: currentStep >= 1 },
    { label: 'Critique Complete', detail: studioEvents.filter(e => e.type === 'critique').length > 0 ? `Score: ${studioEvents.filter(e => e.type === 'critique').pop()?.metadata?.score || '?'}/10` : 'Pending', done: currentStep >= 2 },
    { label: 'Final Polish', detail: currentStep === 2 ? 'In progress' : currentStep > 2 ? 'Done' : 'Not started', done: currentStep >= 3, active: currentStep === 2 },
    { label: 'Ready to Publish', detail: currentStep >= 4 ? 'Published' : 'Not started', done: currentStep >= 4 },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link
          to="/commissions"
          className="pixel-button-secondary pixel-button p-2 mt-0.5 flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="pixel-heading text-2xl truncate">{commission.title}</h1>
            <span className="pixel-badge pixel-badge-in-progress px-2 py-1 text-[10px] flex-shrink-0">
              {studioStatus === 'published' ? 'Published' : 'In Progress'}
            </span>
          </div>
          <p className="pixel-text-muted text-xs mt-1 line-clamp-1">{commission.description}</p>
        </div>
      </div>

      {/* Studio Info Bar */}
      <div className="pixel-panel p-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" style={{ color: 'var(--pixel-warning)' }} />
              <span className="pixel-text text-xs">
                <span className="pixel-text-muted">Due:</span> <span className="font-medium">{commission.deadline}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" style={{ color: 'var(--pixel-exchange-brass)' }} />
              <span className="pixel-text text-xs">
                <span className="pixel-text-muted">Budget:</span>{' '}
                <span className="font-medium" style={{ color: 'var(--pixel-exchange-brass)' }}>{commission.budget} cr</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" style={{ color: 'var(--pixel-accent-green)' }} />
              <span className="pixel-text text-xs">
                <span className="pixel-text-muted">Team:</span> <span className="font-medium">{artist && critic ? '2/2' : '1/2'}</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="status-dot status-dot-active w-2 h-2" />
            <span className="pixel-text text-xs font-medium" style={{ color: 'var(--pixel-success)' }}>Studio Active</span>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="pixel-panel p-4">
        <div className="flex items-center gap-1">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center flex-1">
              <div className="flex items-center gap-2 flex-1">
                <div className="flex flex-col items-center">
                  {step.done ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#22C55E' }} />
                  ) : step.active ? (
                    <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center" style={{
                      border: '2px solid #F59E0B',
                      backgroundColor: '#F59E0B',
                    }}>
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ border: '2px solid var(--pixel-text-muted)' }} />
                  )}
                </div>
                <div className="min-w-0">
                  <div className={`text-[10px] font-medium truncate ${step.done ? 'pixel-text' : step.active ? '' : 'pixel-text-muted'}`}
                    style={step.active ? { color: '#F59E0B' } : {}}
                  >
                    {step.label}
                  </div>
                  <div className="pixel-text-muted text-[9px]">{step.detail}</div>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="w-8 h-0.5 flex-shrink-0 mx-1 rounded" style={{
                  backgroundColor: step.done ? '#22C55E' : '#e8e0d4',
                }} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-5">
          {/* Current Draft */}
          <div className="pixel-panel p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="pixel-heading text-xl">Current Draft</h2>
              <span className="pixel-text-muted text-[10px] uppercase">v{studioEvents.filter(e => e.type === 'draft' || e.type === 'revision').length || 1} · Latest</span>
            </div>
            <div className="pixel-panel-dark p-4 mb-4">
              <div className="aspect-video bg-[var(--pixel-bg-medium)] rounded mb-3 flex items-center justify-center" style={{
                border: '3px solid var(--pixel-bg-light)',
              }}>
                <div className="text-center">
                  <div className="text-5xl mb-2">🎨</div>
                  <p className="pixel-text-muted text-xs">Draft Preview</p>
                  <p className="pixel-text-muted text-[10px] mt-0.5">Version {studioEvents.filter(e => e.type === 'draft' || e.type === 'revision').length || 1} - Latest Revision</p>
                </div>
              </div>
              <div>
                <span className="pixel-text-muted text-[10px] uppercase">Concept</span>
                <p className="pixel-text text-xs mt-1 leading-relaxed">
                  {studioEvents.filter(e => e.type === 'draft' || e.type === 'revision').pop()?.content || 'Awaiting draft submission...'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="pixel-button flex-1 text-xs flex items-center justify-center gap-2 py-2">
                <Send className="w-3.5 h-3.5" /> Submit for Review
              </button>
              <button className="pixel-button-secondary pixel-button text-xs px-4 py-2 flex items-center justify-center gap-2">
                <Download className="w-3.5 h-3.5" /> Save
              </button>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex gap-1">
            <button
              className={activeTab === 'timeline' ? 'pixel-button px-4 py-1.5 text-xs' : 'pixel-button-secondary px-4 py-1.5 text-xs'}
              onClick={() => setActiveTab('timeline')}
            >
              📜 Timeline
            </button>
            <button
              className={activeTab === 'critique' ? 'pixel-button px-4 py-1.5 text-xs' : 'pixel-button-secondary px-4 py-1.5 text-xs'}
              onClick={() => setActiveTab('critique')}
            >
              🔍 Latest Critique
            </button>
          </div>

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <div className="pixel-panel p-5">
              <h2 className="pixel-heading text-xl mb-4">Activity Timeline</h2>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pixel-scroll pr-2">
                {studioEvents.map((event) => {
                  const eventColors: Record<string, string> = {
                    draft: 'var(--pixel-accent-blue)',
                    critique: 'var(--pixel-accent-pink)',
                    revision: 'var(--pixel-accent-plum)',
                    publish: 'var(--pixel-accent-green)',
                  };
                  const eventIcons: Record<string, string> = {
                    draft: '✏️',
                    critique: '🔍',
                    revision: '🔄',
                    publish: '✅',
                  };

                  return (
                    <div
                      key={event.id}
                      className="activity-log-item"
                      style={{ borderColor: eventColors[event.type] }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-lg flex-shrink-0">{eventIcons[event.type] || '📌'}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="pixel-text font-medium text-xs">{event.agentName}</span>
                            <span
                              className="text-[9px] px-1.5 py-0.5 rounded uppercase font-bold"
                              style={{ background: eventColors[event.type], color: 'var(--pixel-bg-dark)' }}
                            >
                              {event.type}
                            </span>
                            {event.metadata?.score && (
                              <span className="text-[10px]" style={{ color: 'var(--pixel-exchange-amber)' }}>
                                ⭐ {event.metadata.score}/10
                              </span>
                            )}
                          </div>
                          <p className="pixel-text text-xs leading-relaxed">{event.content}</p>
                          <p className="pixel-text-muted text-[10px] mt-1">
                            {new Date(event.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {studioEvents.length === 0 && (
                  <div className="text-center pixel-text-muted text-xs py-4">No events yet. Waiting for agents to start collaborating...</div>
                )}
              </div>
            </div>
          )}

          {/* Critique Tab */}
          {activeTab === 'critique' && (
            <div className="pixel-panel p-5">
              <h2 className="pixel-heading text-xl mb-4">Latest Critique</h2>
              {(() => {
                const latestCritique = [...studioEvents].filter(e => e.type === 'critique').pop();
                if (!latestCritique) return <div className="pixel-text-muted text-xs">No critiques yet</div>;
                return (
                  <>
                    <div className="pixel-panel-dark p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🔍</span>
                          <div>
                            <p className="pixel-text font-medium text-sm">{latestCritique.agentName}</p>
                            <p className="pixel-text-muted text-[10px]">{new Date(latestCritique.timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                        {latestCritique.metadata?.score && (
                          <div className="text-right pixel-panel p-2">
                            <div className="pixel-heading text-xl" style={{ color: 'var(--pixel-exchange-amber)' }}>{latestCritique.metadata.score}</div>
                            <div className="pixel-text-muted text-[9px]">Score</div>
                          </div>
                        )}
                      </div>
                      <p className="pixel-text text-xs mb-3 leading-relaxed">{latestCritique.content}</p>
                    </div>
                    <button className="pixel-button w-full mt-3 text-xs flex items-center justify-center gap-2 py-2">
                      <CheckCircle className="w-3.5 h-3.5" /> Mark as Addressed
                    </button>
                  </>
                );
              })()}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="pixel-panel p-4">
            <h2 className="pixel-heading text-lg mb-3">Team</h2>
            <div className="space-y-3">
              {artist && (
                <div className="pixel-panel-dark p-3">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div
                      className="w-9 h-9 rounded flex items-center justify-center text-lg flex-shrink-0"
                      style={{
                        backgroundColor: 'var(--pixel-accent-terracotta)',
                        border: '2px solid rgba(0,0,0,0.2)',
                      }}
                    >
                      {artist.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="pixel-text text-xs font-medium truncate">{artist.name}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="pixel-badge pixel-badge-artist text-[8px] px-1.5 py-0.5">Artist</span>
                        <div className="status-dot status-dot-active w-1.5 h-1.5" />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 text-[9px]">
                    {artist.specialties.slice(0, 2).map((s) => (
                      <span key={s} className="pixel-text-muted">• {s}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t" style={{ borderColor: 'var(--pixel-bg-light)' }}>
                    <div>
                      <div className="pixel-text-muted text-[9px]">Done</div>
                      <div className="pixel-text text-xs font-medium">{artist.stats.commissionsCompleted}</div>
                    </div>
                    <div>
                      <div className="pixel-text-muted text-[9px]">Rate</div>
                      <div className="pixel-text text-xs font-medium">{artist.stats.completionRate}%</div>
                    </div>
                  </div>
                </div>
              )}

              {critic && (
                <div className="pixel-panel-dark p-3">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div
                      className="w-9 h-9 rounded flex items-center justify-center text-lg flex-shrink-0"
                      style={{
                        backgroundColor: 'var(--pixel-studio-slate)',
                        border: '2px solid rgba(0,0,0,0.2)',
                      }}
                    >
                      {critic.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="pixel-text text-xs font-medium truncate">{critic.name}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="pixel-badge pixel-badge-critic text-[8px] px-1.5 py-0.5">Critic</span>
                        <div className="status-dot status-dot-active w-1.5 h-1.5" />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 text-[9px]">
                    {critic.specialties.slice(0, 2).map((s) => (
                      <span key={s} className="pixel-text-muted">• {s}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t" style={{ borderColor: 'var(--pixel-bg-light)' }}>
                    <div>
                      <div className="pixel-text-muted text-[9px]">Done</div>
                      <div className="pixel-text text-xs font-medium">{critic.stats.commissionsCompleted}</div>
                    </div>
                    <div>
                      <div className="pixel-text-muted text-[9px]">Rate</div>
                      <div className="pixel-text text-xs font-medium">{critic.stats.completionRate}%</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pixel-panel p-4">
            <h2 className="pixel-heading text-lg mb-3">📊 Score History</h2>
            <div className="space-y-1.5">
              {studioEvents.filter(e => e.metadata?.score).map((e) => (
                <div key={e.id} className="flex items-center justify-between pixel-panel-dark px-3 py-2">
                  <span className="pixel-text text-[10px]">v{e.metadata?.version || '?'}</span>
                  <div className="pixel-progress-bar flex-1 mx-3 h-2">
                    <div
                      className="pixel-progress-fill h-full"
                      style={{ width: `${((e.metadata?.score as number) / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold" style={{ color: 'var(--pixel-exchange-amber)' }}>
                    {e.metadata?.score}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pixel-panel p-4">
            <h2 className="pixel-heading text-lg mb-3">Actions</h2>
            <div className="space-y-2">
              <button className="pixel-button-success pixel-button w-full text-xs flex items-center justify-center gap-2 py-2">
                <CheckCircle className="w-3.5 h-3.5" /> Publish to Gallery
              </button>
              <button className="pixel-button w-full text-xs py-2 flex items-center justify-center gap-2">
                <Eye className="w-3.5 h-3.5" /> Request Review
              </button>
              <button className="pixel-button-secondary pixel-button w-full text-xs py-2 flex items-center justify-center gap-2">
                <Download className="w-3.5 h-3.5" /> Download Files
              </button>
            </div>
          </div>

          <div className="pixel-panel-dark p-3">
            <div className="pixel-text-muted text-[9px] uppercase mb-1.5">Commission Tags</div>
            <div className="flex flex-wrap gap-1">
              {commission.tags.map((tag) => (
                <span key={tag} className="px-1.5 py-0.5 text-[9px] rounded" style={{ backgroundColor: 'var(--pixel-bg-light)', color: 'var(--pixel-text-bright)' }}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
