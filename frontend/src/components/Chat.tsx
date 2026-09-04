'use client';

import React, { useState, useRef, useEffect } from 'react';
import { askChat, ChatMessage, StartupData } from '@/lib/api';
import { ArrowUp, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useFinancials } from '@/context/FinancialContext';

interface ChatProps {
  sessionId: string;
  startupData: StartupData;
}

const QUICK_PROMPTS = [
  'Runway & cash sensitivity analysis',
  'Burn rate optimization advice',
  'Unit economics & CAC payback',
  'Fundraise readiness assessment',
];

const Chat = ({ sessionId, startupData }: ChatProps) => {
  const {
    chatMessages: messages,
    setChatMessages: setMessages,
    refreshSessions,
  } = useFinancials();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (content?: string) => {
    const text = content || input;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: text };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);

    try {
      const res = await askChat({
        session_id: sessionId,
        messages: newMsgs,
        startup_data: startupData,
      });
      setMessages([...newMsgs, { role: 'assistant', content: res.response }]);
      refreshSessions();
    } catch {
      setMessages([
        ...newMsgs,
        {
          role: 'assistant',
          content:
            'Unable to reach the financial advisory engine. Verify that the backend server is running.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[var(--paper)]">
      {/* ── Header ── */}
      <div className="px-6 py-4 border-b border-[var(--line)] flex items-center justify-between bg-[var(--surface)]">
        <div>
          <h2 className="text-[14px] font-semibold text-[var(--ink)] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            AI advisory
          </h2>
          <p className="text-[11px] text-[var(--ink-muted)] mt-0.5">
            Strategic commentary based on live financials
          </p>
        </div>
        {loading && (
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--ink-muted)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
            <span>Analyzing model...</span>
          </div>
        )}
      </div>

      {/* ── Chat Messages Stream ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-6 space-y-6"
      >
        {messages.length === 0 ? (
          <div className="max-w-xl mx-auto py-12 text-center space-y-4">
            <h3 className="text-[16px] font-semibold text-[var(--ink)]" style={{ fontFamily: 'var(--font-display)' }}>
              Virtual CFO strategic consultation
            </h3>
            <p className="text-[13px] text-[var(--ink-muted)] leading-relaxed">
              Ask questions regarding runway forecasts, scenario modeling, hiring plans, or board presentation points.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-2">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="text-[12px] text-[var(--accent)] hover:text-[var(--accent-hover)] bg-[var(--surface)] hover:bg-[var(--surface-subtle)] border border-[var(--line)] px-3 py-1.5 rounded-[4px] transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={idx}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                {isUser ? (
                  // Founder message: right-aligned, surface bg, hairline line border
                  <div className="max-w-xl chat-bubble-user px-4 py-3 shadow-none">
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                ) : (
                  // AI response: left-aligned plain text on paper, Newsreader serif, no bubble
                  <div className="max-w-2xl w-full group relative">
                    <div className="chat-ai-editorial text-[var(--ink)]">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>

                    <div className="mt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleCopy(msg.content, idx)}
                        className="text-[11px] text-[var(--ink-muted)] hover:text-[var(--ink)] flex items-center gap-1 transition-colors"
                      >
                        {copiedIdx === idx ? (
                          <>
                            <Check className="w-3 h-3 text-[var(--accent)]" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy note</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}

        {loading && (
          <div className="max-w-2xl text-[14px] text-[var(--ink-muted)] italic font-serif">
            Synthesizing advisory guidance...
          </div>
        )}
      </div>

      {/* ── Input Bar ── */}
      <div className="p-4 border-t border-[var(--line)] bg-[var(--surface)]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="max-w-3xl mx-auto flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your Virtual CFO a question about cash, burn, or strategy..."
            className="flex-1 instrument-input py-2.5 px-3.5 text-[13px] bg-[var(--surface-subtle)] border border-[var(--line)]"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="btn-accent px-3 py-2.5 flex items-center justify-center disabled:opacity-40"
            aria-label="Send query"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
