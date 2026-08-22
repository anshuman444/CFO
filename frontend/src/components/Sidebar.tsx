'use client';

import React, { useEffect } from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  Plus,
  Trash2,
  ShieldCheck,
  Clock,
  MessageCircle,
} from 'lucide-react';
import { useFinancials } from '@/context/FinancialContext';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

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
    if (activeTab === 'chat') refreshSessions();
  }, [activeTab, refreshSessions]);

  const menuItems = [
    { id: 'dashboard', label: 'Executive Intelligence', icon: LayoutDashboard },
    { id: 'chat', label: 'Strategic Advisory', icon: MessageSquare },
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
    } catch { return ''; }
  };

  return (
    <div className="w-[270px] h-screen flex flex-col fixed left-0 top-0 z-50"
      style={{
        background: 'linear-gradient(180deg, #060B16 0%, #0A1020 100%)',
        borderRight: '1px solid rgba(148, 163, 184, 0.05)',
      }}
    >
      {/* ── Logo ── */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl mb-2">
          {/* Using the provided logo image - Please save it as public/logo.svg */}
          <div className="relative w-full h-10 flex items-center justify-center bg-transparent rounded-md">
            <img 
              src="/logo.svg" 
              alt="LumenXo CFO" 
              className="max-h-full max-w-full object-contain p-1"
              onError={(e) => {
                // Fallback if image isn't saved yet
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<span class="text-white font-black text-sm">lumen<span style="color:#F2994A">Xo</span></span>';
              }}
            />
          </div>
        </div>
        
        {/* Title Name updated to LumenXo CFO as requested */}
        <div className="flex items-baseline gap-1 mt-1 px-1">
          <span className="text-[16px] font-extrabold tracking-tight text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>
            LumenXo
          </span>
          <span className="text-[16px] font-extrabold tracking-tight text-brand-orange" style={{ fontFamily: 'var(--font-display)' }}>
            CFO
          </span>
        </div>
        <p className="text-[9px] text-text-muted font-medium mt-1 px-1 italic opacity-60">
          Empowering Innovation
        </p>
      </div>

      <div className="mx-5 mb-4" style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(242,153,74,0.15), transparent)' }} />

      {/* ── Navigation ── */}
      <div className="px-3 space-y-0.5">
        <p className="px-3 text-[9px] font-bold text-text-muted uppercase tracking-[0.2em] mb-2">
          Navigate
        </p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 group text-[13px] font-semibold ${
                isActive
                  ? 'text-text-primary'
                  : 'text-text-muted hover:text-text-secondary hover:bg-bg-elevated'
              }`}
              style={isActive ? {
                background: 'linear-gradient(135deg, rgba(242,153,74,0.10) 0%, rgba(242,153,74,0.03) 100%)',
                borderLeft: '2px solid var(--brand-orange)',
              } : { borderLeft: '2px solid transparent' }}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-brand-orange' : 'text-text-muted group-hover:text-text-secondary'}`} />
              <span style={{ fontFamily: 'var(--font-display)' }}>{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse-orange" />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Chat Sessions ── */}
      <div className="flex-1 flex flex-col mt-4 min-h-0">
        <div className="px-3 flex items-center justify-between mb-1.5">
          <p className="px-3 text-[9px] font-bold text-text-muted uppercase tracking-[0.2em]">
            Conversations
          </p>
          <button
            onClick={() => { createNewSession(); setActiveTab('chat'); }}
            className="p-1.5 rounded-md hover:bg-bg-elevated transition-all group"
            title="New conversation"
          >
            <Plus className="w-3.5 h-3.5 text-text-muted group-hover:text-brand-orange transition-colors" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-0.5 custom-scrollbar">
          <AnimatePresence>
            {chatSessions.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-3 py-6 text-center">
                <MessageCircle className="w-5 h-5 text-text-muted mx-auto mb-2 opacity-30" />
                <p className="text-[10px] text-text-muted">No conversations yet</p>
              </motion.div>
            ) : (
              chatSessions.map((session, idx) => {
                const isActive = session.id === activeChatSessionId;
                return (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ delay: idx * 0.03 }}
                    className={`group relative flex items-start gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-all duration-150 ${
                      isActive ? 'bg-bg-elevated' : 'hover:bg-bg-elevated/40'
                    }`}
                    onClick={() => { switchSession(session.id); setActiveTab('chat'); }}
                  >
                    <div className={`w-1 h-1 rounded-full mt-1.5 shrink-0 ${
                      isActive ? 'bg-signal-profit animate-pulse-glow' : 'bg-text-muted/20'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-[11px] font-medium truncate leading-tight ${
                        isActive ? 'text-text-primary' : 'text-text-secondary'
                      }`}>
                        {session.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[9px] text-text-muted flex items-center gap-0.5">
                          <Clock className="w-2 h-2" />
                          {formatTime(session.last_updated)}
                        </span>
                        <span className="text-[9px] text-text-muted">{session.message_count} msgs</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteSession(session.id); }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-signal-loss/10 transition-all"
                    >
                      <Trash2 className="w-2.5 h-2.5 text-text-muted hover:text-signal-loss" />
                    </button>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="p-3" style={{ borderTop: '1px solid rgba(148,163,184,0.04)' }}>
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg"
          style={{ background: 'rgba(10,16,32,0.4)', border: '1px solid rgba(148,163,184,0.04)' }}
        >
          <div className="w-7 h-7 rounded flex items-center justify-center text-[9px] font-black"
            style={{ background: 'linear-gradient(135deg, rgba(242,153,74,0.15), rgba(245,176,65,0.1))', color: '#F2994A' }}
          >
            CFO
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-text-primary truncate">Venture Partner</p>
            <p className="text-[9px] text-signal-profit font-medium flex items-center gap-0.5">
              <ShieldCheck className="w-2.5 h-2.5" /> Encrypted
            </p>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-signal-profit animate-pulse-glow" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
