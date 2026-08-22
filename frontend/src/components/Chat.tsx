'use client';

import React, { useState, useRef, useEffect } from 'react';
import { askChat, ChatMessage, StartupData } from '@/lib/api';
import { Send, User, Bot, Loader2, Sparkles, Copy, Check, ArrowDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinancials } from '@/context/FinancialContext';

interface ChatProps { sessionId: string; startupData: StartupData; }

const QUICK_PROMPTS = [
  { icon: '📊', label: 'Runway analysis', prompt: 'Give me a detailed runway analysis based on current financials.' },
  { icon: '🔥', label: 'Burn rate advice', prompt: 'How can I optimize my burn rate while maintaining growth?' },
  { icon: '📈', label: 'Growth strategy', prompt: 'What growth strategy do you recommend based on my metrics?' },
  { icon: '💰', label: 'Fundraise readiness', prompt: 'Am I ready for my next fundraise? What should I improve?' },
];

const Chat = ({ sessionId, startupData }: ChatProps) => {
  const { chatMessages: messages, setChatMessages: setMessages, refreshSessions } = useFinancials();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    const c = scrollRef.current;
    if (!c) return;
    const onScroll = () => setShowScrollBtn(c.scrollHeight - c.scrollTop - c.clientHeight > 100);
    c.addEventListener('scroll', onScroll);
    return () => c.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToBottom = () => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });

  const handleSend = async (content?: string) => {
    const text = content || input;
    if (!text.trim() || loading) return;
    const userMsg: ChatMessage = { role: 'user', content: text };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);
    try {
      const res = await askChat({ session_id: sessionId, messages: newMsgs, startup_data: startupData });
      setMessages([...newMsgs, { role: 'assistant', content: res.response }]);
      refreshSessions();
    } catch {
      setMessages([...newMsgs, { role: 'assistant', content: "⚠️ **Connection Error**: Backend unreachable. Please verify the API server is running." }]);
    } finally { setLoading(false); }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center px-5 py-3" style={{ borderBottom: '1px solid rgba(148,163,184,0.05)', background: 'linear-gradient(135deg, rgba(242,153,74,0.03) 0%, transparent 100%)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F2994A, #E87D2F)' }}>
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>Strategy Terminal</h3>
            <p className="text-[9px] text-text-muted font-medium">AI-powered CFO advisory</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full"
          style={{ background: loading ? 'rgba(255,214,102,0.08)' : 'rgba(0,214,143,0.06)' }}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-signal-caution animate-pulse' : 'bg-signal-profit animate-pulse-glow'}`} />
          <span className={`text-[9px] font-bold ${loading ? 'text-signal-caution' : 'text-signal-profit'}`}>{loading ? 'THINKING' : 'READY'}</span>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-4 custom-scrollbar" style={{ background: 'rgba(6,11,24,0.3)' }}>
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-5 py-10">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center animate-float"
              style={{ background: 'linear-gradient(135deg, rgba(242,153,74,0.12), rgba(245,176,65,0.08))', border: '1px solid rgba(242,153,74,0.08)' }}
            >
              <Bot className="w-6 h-6 text-brand-orange" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-text-primary mb-1" style={{ fontFamily: 'var(--font-display)' }}>Private Strategic Advisor</h4>
              <p className="text-[11px] text-text-muted max-w-sm font-medium leading-relaxed">
                Ask anything about your venture's financials. Powered by real-time metrics.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full max-w-md">
              {QUICK_PROMPTS.map(qp => (
                <button key={qp.label} onClick={() => handleSend(qp.prompt)}
                  className="text-left px-3 py-2 rounded-lg transition-all hover:scale-[1.02] group"
                  style={{ background: 'rgba(14,22,40,0.5)', border: '1px solid rgba(148,163,184,0.04)' }}
                >
                  <span className="text-sm">{qp.icon}</span>
                  <p className="text-[10px] font-semibold text-text-secondary group-hover:text-text-primary mt-0.5 transition-colors">{qp.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''} group`}
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={msg.role === 'user' ? { background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.06)' } : { background: 'linear-gradient(135deg, #F2994A, #E87D2F)' }}
              >
                {msg.role === 'user' ? <User className="w-3 h-3 text-text-secondary" /> : <Bot className="w-3 h-3 text-white" />}
              </div>
              <div className={`max-w-[80%] relative ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'} px-3.5 py-2.5`}>
                <div className="chat-prose"><ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown></div>
                {msg.role === 'assistant' && (
                  <button onClick={() => handleCopy(msg.content, idx)}
                    className="absolute -bottom-1 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-bg-elevated"
                  >
                    {copiedIdx === idx ? <Check className="w-2.5 h-2.5 text-signal-profit" /> : <Copy className="w-2.5 h-2.5 text-text-muted" />}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F2994A, #E87D2F)' }}>
              <Bot className="w-3 h-3 text-white" />
            </div>
            <div className="chat-bubble-assistant px-3.5 py-2.5 flex items-center gap-2.5">
              <div className="flex gap-0.5">
                {[0, 150, 300].map(d => <span key={d} className="w-1 h-1 rounded-full bg-brand-orange animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
              </div>
              <span className="text-[10px] font-semibold text-text-muted italic">Analyzing financials...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Scroll FAB */}
      <AnimatePresence>
        {showScrollBtn && (
          <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToBottom} className="absolute bottom-20 right-5 w-7 h-7 rounded-full flex items-center justify-center z-10"
            style={{ background: 'rgba(242,153,74,0.9)', boxShadow: '0 4px 12px rgba(242,153,74,0.25)' }}
          >
            <ArrowDown className="w-3.5 h-3.5 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="p-4 pt-2" style={{ borderTop: '1px solid rgba(148,163,184,0.04)' }}>
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Ask anything about your venture..."
            className="w-full premium-input py-3 pl-4 pr-12 text-sm font-medium rounded-xl" disabled={loading}
          />
          <button type="submit" disabled={loading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
            style={{ background: 'linear-gradient(135deg, #F2994A, #E87D2F)' }}
          >
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </form>
        <p className="mt-1.5 text-[8px] text-center text-text-muted font-bold uppercase tracking-[0.15em]">
          Secured Intelligence • AES-256 Encrypted
        </p>
      </div>
    </div>
  );
};

export default Chat;
