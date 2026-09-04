'use client';

import React, { useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useFinancials } from '@/context/FinancialContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const {
    chatSessions,
    activeChatSessionId,
    createNewSession,
    switchSession,
    deleteSession,
    refreshSessions,
  } = useFinancials();

  useEffect(() => {
    if (activeTab === 'chat') {
      refreshSessions();
    }
  }, [activeTab, refreshSessions]);

  const navItems = [
    { id: 'dashboard', label: 'Executive overview' },
    { id: 'chat', label: 'AI advisory' },
  ];

  const formatTime = (isoString: string) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <aside
      className="w-[220px] h-screen flex flex-col fixed left-0 top-0 z-40 bg-[var(--chrome)] select-none"
      style={{ borderRight: '1px solid var(--line)' }}
    >
      {/* ── Brand Header ── */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="LumenXo Logo" className="w-6 h-6 object-contain drop-shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
          <div className="flex items-baseline gap-1">
            <span className="text-[17px] font-semibold tracking-tight text-[var(--ink)]" style={{ fontFamily: 'var(--font-display)' }}>
              LumenXo
            </span>
            <span className="text-[17px] font-semibold tracking-tight text-[var(--accent)]" style={{ fontFamily: 'var(--font-display)' }}>
              CFO
            </span>
          </div>
        </div>
        <p className="text-[11px] text-[var(--ink-muted)] mt-1 font-normal tracking-wide">
          Financial Intelligence
        </p>
      </div>

      <div className="mx-5 border-t border-[var(--line)]" />

      {/* ── Navigation (Text Only, Accent Left Border) ── */}
      <nav className="py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-5 py-2 text-[13px] font-medium transition-colors flex items-center ${
                isActive
                  ? 'text-[var(--ink)] font-semibold border-l-2 border-[var(--accent)] pl-[18px] bg-[var(--paper)]'
                  : 'text-[var(--ink-muted)] hover:text-[var(--ink)] border-l-2 border-transparent'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mx-5 border-t border-[var(--line)]" />

      {/* ── Chat Sessions ── */}
      <div className="flex-1 flex flex-col mt-4 min-h-0 px-5">
        <div className="flex items-center justify-between pb-2">
          <span className="text-[11px] font-medium text-[var(--ink-muted)] uppercase tracking-wider">
            Conversations
          </span>
          <button
            onClick={() => {
              createNewSession();
              setActiveTab('chat');
            }}
            className="text-[var(--ink-muted)] hover:text-[var(--ink)] p-1 rounded transition-colors"
            title="New conversation"
            aria-label="New conversation"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto -mx-2 px-2 space-y-0.5">
          {chatSessions.length === 0 ? (
            <div className="py-6 text-left">
              <p className="text-[11px] text-[var(--ink-faint)]">No prior sessions</p>
            </div>
          ) : (
            chatSessions.map((session) => {
              const isActive = session.id === activeChatSessionId;
              return (
                <div
                  key={session.id}
                  onClick={() => {
                    switchSession(session.id);
                    setActiveTab('chat');
                  }}
                  className={`group relative flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors text-[12px] ${
                    isActive
                      ? 'bg-[var(--surface)] text-[var(--ink)] font-medium border border-[var(--line)] shadow-xs'
                      : 'text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--paper)]'
                  }`}
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="truncate leading-tight">{session.title || 'Untitled session'}</p>
                    <span className="text-[10px] text-[var(--ink-faint)] block mt-0.5">
                      {formatTime(session.last_updated)}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(session.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-[var(--ink-faint)] hover:text-[var(--risk-red)] transition-opacity"
                    title="Delete session"
                    aria-label="Delete session"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Status Footer ── */}
      <div className="p-5 border-t border-[var(--line)]">
        <div className="text-[11px] text-[var(--ink-muted)] flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
          <span>Ledger connected</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
