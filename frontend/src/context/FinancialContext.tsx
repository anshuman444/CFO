'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  calculateMetrics as apiCalculate,
  StartupData,
  Metrics,
  ChatMessage,
  SessionSummary,
  listSessions,
  getSession,
  clearSession,
} from '@/lib/api';

interface FinancialContextType {
  // Financial data
  data: StartupData;
  metrics: Metrics | null;
  loading: boolean;
  updateData: (newData: Partial<StartupData>) => void;
  refresh: () => void;

  // Chat session management
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  activeChatSessionId: string;
  setActiveChatSessionId: (id: string) => void;
  chatSessions: SessionSummary[];
  refreshSessions: () => Promise<void>;
  createNewSession: () => void;
  switchSession: (id: string) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

function generateId() {
  return `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function FinancialProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StartupData>({
    name: "Nimbus Labs",
    revenue: 120000.0,
    burn: 85000.0,
    cash: 320000.0,
    ltv: 1200.0,
    cac: 350.0,
    new_revenue_pm: 15000.0,
    growth_rate: 12.0,
    employees: 24,
    cogs: 24000.0,
    opex: 61000.0,
    churn: 2.5
  });

  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);

  // Chat state (lifted from Chat component)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [activeChatSessionId, setActiveChatSessionIdRaw] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lumenxo_active_session') || generateId();
    }
    return generateId();
  });
  const [chatSessions, setChatSessions] = useState<SessionSummary[]>([]);

  // Persist active session ID
  const setActiveChatSessionId = (id: string) => {
    setActiveChatSessionIdRaw(id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lumenxo_active_session', id);
    }
  };

  // Refresh financial metrics
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiCalculate(data);
      setMetrics(res.metrics);
    } catch (error) {
      console.error("Calculation failed", error);
    } finally {
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    refresh();
  }, [data, refresh]);

  // Load sessions list from backend
  const refreshSessions = useCallback(async () => {
    try {
      const res = await listSessions();
      setChatSessions(res.sessions || []);
    } catch (error) {
      console.error("Failed to load sessions", error);
    }
  }, []);

  // Load sessions on mount
  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);

  // Load chat messages for the active session on mount / session change
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const sessionData = await getSession(activeChatSessionId);
        if (sessionData && sessionData.messages && sessionData.messages.length > 0) {
          setChatMessages(sessionData.messages);
        } else {
          setChatMessages([]);
        }
      } catch {
        setChatMessages([]);
      }
    };
    loadMessages();
  }, [activeChatSessionId]);

  const createNewSession = () => {
    const newId = generateId();
    setActiveChatSessionId(newId);
    setChatMessages([]);
  };

  const switchSession = async (id: string) => {
    setActiveChatSessionId(id);
    // Messages will be loaded by the useEffect above
  };

  const deleteSessionHandler = async (id: string) => {
    try {
      await clearSession(id);
      setChatSessions(prev => prev.filter(s => s.id !== id));
      if (id === activeChatSessionId) {
        createNewSession();
      }
    } catch (error) {
      console.error("Failed to delete session", error);
    }
  };

  const updateData = (newData: Partial<StartupData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  return (
    <FinancialContext.Provider value={{
      data, metrics, loading, updateData, refresh,
      chatMessages, setChatMessages,
      activeChatSessionId, setActiveChatSessionId,
      chatSessions, refreshSessions,
      createNewSession, switchSession,
      deleteSession: deleteSessionHandler,
    }}>
      {children}
    </FinancialContext.Provider>
  );
}

export function useFinancials() {
  const context = useContext(FinancialContext);
  if (context === undefined) {
    throw new Error('useFinancials must be used within a FinancialProvider');
  }
  return context;
}
