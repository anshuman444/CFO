'use client';

import React, { useState } from 'react';
import { Printer, Copy, Check, X } from 'lucide-react';
import { StartupData, Metrics } from '@/lib/api';

interface BoardMemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: StartupData;
  metrics: Metrics;
  activeScenario: string;
  activeLevers: string[];
  computedRunway: number;
  computedZeroCashDate: string;
  computedNetBurn: number;
}

export default function BoardMemoModal({
  isOpen,
  onClose,
  data,
  metrics,
  activeScenario,
  activeLevers,
  computedRunway,
  computedZeroCashDate,
  computedNetBurn,
}: BoardMemoModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const todayStr = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const isPastSafetyWindow = computedRunway < 6;
  const safetyDeficitMins = isPastSafetyWindow ? (6 - computedRunway).toFixed(1) : '0';

  const talkingPoints = [
    {
      title: 'Runway & Fundraise Stance',
      body: isPastSafetyWindow
        ? `CURRENT ALERT: Cash runway is ${computedRunway.toFixed(1)} months with projected zero-cash date on ${computedZeroCashDate}. Company is currently ${safetyDeficitMins} months past the 6-month fundraise safety lead time window. Immediate capital raise or burn cuts required.`
        : `Runway stands at ${computedRunway.toFixed(1)} months with zero-cash projected for ${computedZeroCashDate}. Runway extends beyond the 6-month fundraise safety window, allowing disciplined execution.`,
    },
    {
      title: 'Capital Efficiency & Burn Multiple',
      body: `Burn multiple is currently ${metrics.burn_multiple.toFixed(2)}x (SaaS benchmark median is 1.4x). Monthly net burn is $${Math.abs(computedNetBurn).toLocaleString()}. ${
        metrics.burn_multiple > 2.5
          ? 'Burn rate remains elevated relative to net ARR growth.'
          : 'Capital efficiency is within normal venture operating bands.'
      }`,
    },
    {
      title: 'Unit Economics & Margin Profile',
      body: `Gross margin is ${metrics.gross_margin}% (${metrics.gross_margin >= 70 ? 'top-quartile SaaS benchmark' : 'below target 70% threshold'}). LTV/CAC ratio is ${metrics.ltv_cac.toFixed(1)}x ($${data.ltv} LTV vs $${data.cac} CAC).`,
    },
    {
      title: 'Active Model Assumptions & Levers',
      body: `Model scenario: ${activeScenario}. Active operating levers applied: ${
        activeLevers.length > 0 ? activeLevers.join(', ') : 'None (Baseline)'
      }. Total impact: ${activeLevers.length > 0 ? 'Cash preservation active' : 'Baseline trajectory'}.`,
    },
  ];

  const handleCopyMarkdown = () => {
    const md = `# Board Financial Brief — ${data.name}
Date: ${todayStr}
Model Scenario: ${activeScenario}
Zero-Cash Date: ${computedZeroCashDate} (${computedRunway.toFixed(1)} months remaining)

## Key Metrics
- Monthly Revenue: $${data.revenue.toLocaleString()}
- Monthly Net Burn: $${Math.abs(computedNetBurn).toLocaleString()}
- Cash Reserve: $${data.cash.toLocaleString()}
- Gross Margin: ${metrics.gross_margin}%
- Burn Multiple: ${metrics.burn_multiple.toFixed(2)}x
- LTV / CAC: ${metrics.ltv_cac.toFixed(1)}x

## Executive Talking Points
${talkingPoints.map((tp, i) => `${i + 1}. **${tp.title}**: ${tp.body}`).join('\n\n')}
`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="card w-full max-w-3xl bg-[var(--surface)] border border-[var(--line)] shadow-lg overflow-hidden flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:border-none print:w-full">
        {/* Modal Action Header (Hidden in Print) */}
        <div className="px-6 py-4 border-b border-[var(--line)] flex items-center justify-between bg-[var(--chrome)] print:hidden">
          <div>
            <h3 className="text-[14px] font-semibold text-[var(--ink)] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Executive Board Memo
            </h3>
            <p className="text-[11px] text-[var(--ink-muted)] mt-0.5">
              Print-ready financial summary & investor briefing
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="btn-subtle text-[12px] flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[var(--accent)]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="btn-accent text-[12px] flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-[var(--ink-muted)] hover:text-[var(--ink)] p-1 rounded ml-2"
              aria-label="Close memo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Memo Body */}
        <div className="p-8 overflow-y-auto space-y-6 bg-[var(--surface)] text-[var(--ink)]">
          {/* Memo Header */}
          <div className="pb-4 border-b border-[var(--line)] flex justify-between items-start">
            <div>
              <h1 className="text-[20px] font-semibold text-[var(--ink)] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                {data.name} — Board Financial Brief
              </h1>
              <p className="text-[12px] text-[var(--ink-muted)] mt-1">
                Prepared on {todayStr} • Model: <span className="font-semibold text-[var(--ink)]">{activeScenario}</span>
              </p>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-[var(--ink-muted)] uppercase tracking-wider">Zero-Cash Projection</div>
              <div className="text-[15px] font-semibold text-[var(--ink)]" style={{ fontFamily: 'var(--font-display)' }}>
                {computedZeroCashDate}
              </div>
              <div className={`text-[11px] font-medium ${isPastSafetyWindow ? 'text-[var(--risk-red)]' : 'text-[var(--accent)]'}`}>
                {computedRunway.toFixed(1)} months remaining
              </div>
            </div>
          </div>

          {/* Core Ledger Table */}
          <div>
            <h2 className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-muted)] mb-3">
              Financial Summary Ledger
            </h2>
            <table className="w-full text-[12px] border-collapse border border-[var(--line)]">
              <thead>
                <tr className="bg-[var(--chrome)] text-[var(--ink-muted)] text-left font-medium border-b border-[var(--line)]">
                  <th className="p-2.5">Metric</th>
                  <th className="p-2.5 text-right">Value</th>
                  <th className="p-2.5 text-left">Benchmark / Context</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)] font-variant-numeric tabular-nums">
                <tr>
                  <td className="p-2.5 font-medium">Monthly Revenue</td>
                  <td className="p-2.5 text-right font-semibold">${data.revenue.toLocaleString()}</td>
                  <td className="p-2.5 text-[var(--ink-muted)]">${(data.revenue * 12 / 1000).toFixed(0)}k ARR pace</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">Monthly Net Burn</td>
                  <td className="p-2.5 text-right font-semibold">${Math.abs(computedNetBurn).toLocaleString()}</td>
                  <td className="p-2.5 text-[var(--ink-muted)]">Gross burn: ${data.burn.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">Cash Reserve</td>
                  <td className="p-2.5 text-right font-semibold">${data.cash.toLocaleString()}</td>
                  <td className="p-2.5 text-[var(--ink-muted)]">Bank balance at period start</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">Gross Margin</td>
                  <td className="p-2.5 text-right font-semibold">{metrics.gross_margin}%</td>
                  <td className="p-2.5 text-[var(--ink-muted)]">{metrics.gross_margin >= 70 ? 'Top 25% SaaS quartile' : 'Below 70% benchmark'}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">Burn Multiple</td>
                  <td className="p-2.5 text-right font-semibold">{metrics.burn_multiple.toFixed(2)}x</td>
                  <td className="p-2.5 text-[var(--ink-muted)]">SaaS median is 1.4x</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">LTV / CAC Ratio</td>
                  <td className="p-2.5 text-right font-semibold">{metrics.ltv_cac.toFixed(1)}x</td>
                  <td className="p-2.5 text-[var(--ink-muted)]">${data.ltv} LTV vs ${data.cac} CAC</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Talking Points */}
          <div className="space-y-4">
            <h2 className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
              Executive Talking Points for Investors
            </h2>
            <div className="space-y-3">
              {talkingPoints.map((tp, idx) => (
                <div key={idx} className="p-3 bg-[var(--chrome)] border border-[var(--line)] rounded-[4px]">
                  <h3 className="text-[12px] font-semibold text-[var(--ink)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                    {idx + 1}. {tp.title}
                  </h3>
                  <p className="text-[12px] leading-relaxed text-[var(--ink-muted)] font-sans">
                    {tp.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Sign-off */}
          <div className="pt-4 border-t border-[var(--line)] flex justify-between text-[11px] text-[var(--ink-faint)]">
            <span>Generated by LumenXo Virtual CFO</span>
            <span>Confidential — For Board Review Only</span>
          </div>
        </div>
      </div>
    </div>
  );
}
