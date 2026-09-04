'use client';

import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import Chat from '@/components/Chat';
import CommandCenter from '@/components/CommandCenter';
import BoardMemoModal from '@/components/BoardMemoModal';
import { useFinancials } from '@/context/FinancialContext';
import gsap from 'gsap';
import { FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function DashboardApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMemoOpen, setIsMemoOpen] = useState(false);
  const { data, metrics, loading, refresh, activeChatSessionId } = useFinancials();
  const containerRef = useRef<HTMLDivElement>(null);

  // Interaction Point 4: GSAP cross-fade view switching (150-200ms)
  useEffect(() => {
    if (containerRef.current) {
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }
      gsap.fromTo(
        containerRef.current,
        { opacity: 0.6, y: 3 },
        { opacity: 1, y: 0, duration: 0.18, ease: 'power1.out' }
      );
    }
  }, [activeTab]);

  const computedRunway = metrics?.runway ?? 3.8;
  const computedNetBurn = data.burn - data.revenue;
  const zeroCashDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + Math.round(computedRunway * 30.4));
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <main className="flex min-h-screen bg-[var(--paper)] overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 ml-[220px] h-screen overflow-y-auto flex flex-col">
        {/* ── App Header ── */}
        <header className="sticky top-0 z-30 px-8 py-3 flex justify-between items-center bg-[var(--paper)] border-b border-[var(--line)]">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-[12px] text-[var(--ink-muted)] hover:text-[var(--ink)] flex items-center gap-1 transition-colors"
              title="Return to Product site"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Site</span>
            </Link>
            <span className="text-[var(--line)] text-sm">•</span>
            <h1 className="text-[14px] font-semibold text-[var(--ink)] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              {activeTab === 'dashboard' ? 'Executive overview' : 'AI advisory'}
            </h1>
            <span className="text-[var(--line)] text-sm">•</span>
            <span className="text-[12px] text-[var(--ink-muted)]">
              {data.name || 'Startup'}
            </span>
          </div>

          {/* Header Health-Pill Matrix & Board Memo Action */}
          <div className="flex items-center gap-4">
            {metrics && (
              <div className="hidden lg:flex items-center gap-2">
                <span className={`benchmark-pill ${computedRunway < 6 ? 'benchmark-pill-red' : 'benchmark-pill-accent'}`}>
                  Runway: {computedRunway.toFixed(1)} mo
                </span>
                <span className={`benchmark-pill ${metrics.burn_multiple > 2.5 ? 'benchmark-pill-amber' : 'benchmark-pill'}`}>
                  Burn Mult: {metrics.burn_multiple.toFixed(2)}x
                </span>
                <span className="benchmark-pill">
                  Margin: {metrics.gross_margin}%
                </span>
                <span className={`benchmark-pill ${metrics.risk.toLowerCase().includes('safe') ? 'benchmark-pill-accent' : 'benchmark-pill-amber'}`}>
                  {metrics.risk}
                </span>
              </div>
            )}

            <div className="h-4 w-px bg-[var(--line)] hidden lg:block" />

            <button
              onClick={() => setIsMemoOpen(true)}
              className="btn-subtle text-[12px] flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-[var(--ink-muted)]" />
              <span>Generate board memo</span>
            </button>

            <button
              onClick={refresh}
              disabled={loading}
              className="btn-subtle text-[12px] flex items-center gap-1.5 disabled:opacity-50"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-[var(--risk-amber)] animate-pulse' : 'bg-[var(--accent)]'}`} />
              <span>{loading ? 'Recalculating...' : 'Sync'}</span>
            </button>
          </div>
        </header>

        {/* ── Main App Workspace ── */}
        <div ref={containerRef} className="p-8 max-w-[1600px] w-full mx-auto flex-1">
          {activeTab === 'dashboard' ? (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              <div className="xl:col-span-9">
                <Dashboard />
              </div>
              <div className="xl:col-span-3 h-[calc(100vh-140px)] sticky top-24">
                <CommandCenter />
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] card overflow-hidden">
              <Chat sessionId={activeChatSessionId} startupData={data} />
            </div>
          )}
        </div>
      </div>

      {/* Board Memo Modal Overlay */}
      {metrics && (
        <BoardMemoModal
          isOpen={isMemoOpen}
          onClose={() => setIsMemoOpen(false)}
          data={data}
          metrics={metrics}
          activeScenario="Base Case"
          activeLevers={[]}
          computedRunway={computedRunway}
          computedZeroCashDate={zeroCashDate()}
          computedNetBurn={computedNetBurn}
        />
      )}
    </main>
  );
}

export default function DashboardPage() {
  return <DashboardApp />;
}
