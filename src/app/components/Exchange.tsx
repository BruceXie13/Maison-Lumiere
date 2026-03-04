import { useState } from 'react';
import { Coins, TrendingUp, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { mockTransactions, mockAgents, mockGalleryItems } from '../data/mockData';
import { AgentAvatar } from './ui/AgentAvatar';

export function Exchange() {
  const [selectedView, setSelectedView] = useState<'wallet' | 'trending' | 'transactions'>('wallet');

  const totalCredits = 2450;
  const totalEarned = 8750;
  const totalSpent = 6300;

  const topSellingWorks = mockGalleryItems
    .sort((a, b) => b.price - a.price)
    .slice(0, 5);

  const topEarningAgents = mockAgents
    .sort((a, b) => b.stats.creditsEarned - a.stats.creditsEarned)
    .slice(0, 5);

  const recentTransactions = mockTransactions.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="pixel-panel-light p-4 text-center">
        <h1 className="pixel-heading text-3xl">💰 Exchange Counter 💰</h1>
        <p className="pixel-text-muted text-sm mt-2">Manage credits • View market trends • Track transactions</p>
      </div>

      {/* Exchange Counter Scene */}
      <div className="relative pixel-frame mx-auto" style={{ maxWidth: '1200px', minHeight: '600px' }}>
        <div className="relative w-full h-full bg-gradient-to-b from-[#1a1625] via-[#2d2640] to-[#1a1625] p-8">
          {/* Counter Desk */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--pixel-frame-inner)] to-[var(--pixel-frame-border)] border-t-4 border-[var(--pixel-frame-border)]" />
          
          {/* Terminal Screens on Counter */}
          <div className="relative z-10 grid grid-cols-3 gap-6 mb-20">
            {/* Wallet Terminal */}
            <div className="pixel-panel-light p-6 border-4 border-[var(--pixel-accent-yellow)]">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">💳</div>
                <div className="pixel-heading text-sm" style={{ color: 'var(--pixel-accent-yellow)' }}>
                  WALLET TERMINAL
                </div>
              </div>
              
              <div className="pixel-panel-dark p-4 mb-3">
                <div className="pixel-text-muted text-xs mb-1">Current Balance</div>
                <div className="text-3xl font-bold" style={{ color: 'var(--pixel-accent-yellow)' }}>
                  {totalCredits}
                </div>
                <div className="pixel-text-muted text-xs">credits</div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="pixel-panel-dark p-2 text-center">
                  <div className="text-sm font-bold" style={{ color: 'var(--pixel-accent-green)' }}>
                    +{totalEarned}
                  </div>
                  <div className="pixel-text-muted text-[10px]">Earned</div>
                </div>
                <div className="pixel-panel-dark p-2 text-center">
                  <div className="text-sm font-bold" style={{ color: 'var(--pixel-accent-pink)' }}>
                    -{totalSpent}
                  </div>
                  <div className="pixel-text-muted text-[10px]">Spent</div>
                </div>
              </div>

              <button className="pixel-button-success pixel-button w-full text-xs">
                Buy Credits
              </button>
            </div>

            {/* Trending Board */}
            <div className="pixel-panel-light p-6 border-4 border-[var(--pixel-accent-pink)]">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">📊</div>
                <div className="pixel-heading text-sm" style={{ color: 'var(--pixel-accent-pink)' }}>
                  TRENDING BOARD
                </div>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto pixel-scroll">
                {topSellingWorks.map((work, index) => (
                  <div key={work.id} className="pixel-panel-dark p-2">
                    <div className="flex items-center gap-2">
                      <div className="text-lg font-bold" style={{ color: 'var(--pixel-accent-yellow)' }}>
                        #{index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="pixel-text text-xs font-medium line-clamp-1">
                          {work.title}
                        </div>
                        <div className="pixel-text-muted text-[10px]">
                          💰 {work.price} cr
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ticker Terminal */}
            <div className="pixel-panel-light p-6 border-4 border-[var(--pixel-accent-blue)]">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">📈</div>
                <div className="pixel-heading text-sm" style={{ color: 'var(--pixel-accent-blue)' }}>
                  TOP EARNERS
                </div>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto pixel-scroll">
                {topEarningAgents.map((agent, index) => (
                  <div key={agent.id} className="pixel-panel-dark p-2">
                    <div className="flex items-center gap-2">
                      <div className="text-base">{agent.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <div className="pixel-text text-xs font-medium line-clamp-1">
                          {agent.name}
                        </div>
                        <div className="pixel-text-muted text-[10px]">
                          💰 {agent.stats.creditsEarned} cr
                        </div>
                      </div>
                      <div className="text-xs font-bold" style={{ color: 'var(--pixel-accent-yellow)' }}>
                        #{index + 1}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Agents at Exchange Counter */}
          <AgentAvatar
            name="TraderBot-AI"
            avatar="💱"
            status="trading"
            x={15}
            y={75}
            onClick={() => {}}
          />

          <AgentAvatar
            name="MarketWatch-07"
            avatar="📊"
            status="idle"
            x={48}
            y={78}
            onClick={() => {}}
          />

          <AgentAvatar
            name="CryptoCollector"
            avatar="💎"
            status="trading"
            x={82}
            y={75}
            onClick={() => {}}
          />
        </div>
      </div>

      {/* Transaction History */}
      <div className="pixel-panel p-6 max-w-6xl mx-auto">
        <h2 className="pixel-heading text-xl mb-4">💳 Recent Transactions</h2>
        
        <div className="space-y-2">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="activity-log-item">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {transaction.type === 'buy' || transaction.type === 'license' ? '📥' : '📤'}
                  </div>
                  <div>
                    <div className="pixel-text text-sm font-medium">
                      {transaction.description}
                    </div>
                    <div className="pixel-text-muted text-xs mt-1">
                      {transaction.timestamp}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div 
                    className="text-lg font-bold"
                    style={{ 
                      color: transaction.type === 'buy' || transaction.type === 'license'
                        ? 'var(--pixel-accent-pink)' 
                        : 'var(--pixel-accent-green)' 
                    }}
                  >
                    {transaction.type === 'buy' || transaction.type === 'license' ? '-' : '+'}
                    {transaction.amount}
                  </div>
                  <div className="pixel-text-muted text-xs">credits</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-3 gap-4 max-w-6xl mx-auto">
        <div className="pixel-panel p-4 text-center">
          <div className="text-2xl font-bold mb-1" style={{ color: 'var(--pixel-accent-yellow)' }}>
            {mockGalleryItems.length}
          </div>
          <div className="pixel-text-muted text-xs uppercase">Items Listed</div>
        </div>

        <div className="pixel-panel p-4 text-center">
          <div className="text-2xl font-bold mb-1" style={{ color: 'var(--pixel-accent-green)' }}>
            {mockTransactions.filter(t => t.status === 'completed').length}
          </div>
          <div className="pixel-text-muted text-xs uppercase">Completed Deals</div>
        </div>

        <div className="pixel-panel p-4 text-center">
          <div className="text-2xl font-bold mb-1" style={{ color: 'var(--pixel-accent-blue)' }}>
            24/7
          </div>
          <div className="pixel-text-muted text-xs uppercase">Market Open</div>
        </div>
      </div>
    </div>
  );
}