'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import Chat from '@/components/Chat';
import CommandCenter from '@/components/CommandCenter';
import { FinancialProvider, useFinancials } from '@/context/FinancialContext';
import { RefreshCw, Sparkles, Clock } from 'lucide-react';

function DashboardShell() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { data, loading, refresh, activeChatSessionId } = useFinancials();
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex min-h-screen overflow-hidden relative" style={{ background: 'var(--bg-deep)' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 ml-[270px] h-screen overflow-y-auto custom-scrollbar relative z-10">
        {/* ── Header ── */}
        <header className="sticky top-0 z-40 px-6 py-3 flex justify-between items-center backdrop-blur-heavy"
          style={{ background: 'rgba(7,13,26,0.88)', borderBottom: '1px solid rgba(148,163,184,0.04)' }}
        >
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-sm font-bold tracking-tight text-text-primary flex items-center gap-1.5"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {activeTab === 'dashboard' ? 'Executive Intelligence' : 'Strategic Advisory'}
                <Sparkles className="w-3 h-3 text-brand-orange" />
              </h1>
              <p className="text-[10px] font-medium text-text-muted">
                <span className="text-brand-orange font-semibold">{data.name}</span> • LumenXo CFO Terminal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-text-muted">
              <Clock className="w-3 h-3" />
              <span className="text-[10px] font-mono font-semibold tabular-nums">{currentTime}</span>
            </div>

            <div className="flex flex-col items-end px-4"
              style={{ borderLeft: '1px solid rgba(148,163,184,0.04)', borderRight: '1px solid rgba(148,163,184,0.04)' }}
            >
              <span className="text-[8px] font-bold text-text-muted uppercase tracking-[0.15em]">Cash Reserve</span>
              <span className="text-base font-bold gradient-text tabular-nums tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                ${mounted ? data.cash.toLocaleString() : '---'}
              </span>
            </div>

            <button onClick={refresh} disabled={loading}
              className="btn-primary flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Sync
            </button>
          </div>
        </header>

        {/* ── Workspace — Both tabs always mounted ── */}
        <div className="p-6 max-w-[1600px] mx-auto">
          <div className={activeTab === 'dashboard' ? 'tab-panel-visible' : 'tab-panel-hidden'}>
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
              <div className="xl:col-span-9">
                <Dashboard />
              </div>
              <div className="xl:col-span-3 h-[calc(100vh-120px)]">
                <div className="sticky top-20 h-full">
                  <CommandCenter />
                </div>
              </div>
            </div>
          </div>

          <div className={activeTab === 'chat' ? 'tab-panel-visible' : 'tab-panel-hidden'}>
            <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] glass-card-static overflow-hidden">
              <Chat sessionId={activeChatSessionId} startupData={data} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <FinancialProvider>
      <DashboardShell />
    </FinancialProvider>
  );
}
