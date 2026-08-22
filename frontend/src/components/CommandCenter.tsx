'use client';

import React, { useState } from 'react';
import { useFinancials } from '@/context/FinancialContext';
import {
  Building2,
  TrendingUp,
  LineChart,
  Wallet,
  Activity,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from 'lucide-react';

interface SectionConfig {
  title: string;
  icon: React.ComponentType<any>;
  color: string;
  fields: { label: string; key: string; type: string; placeholder?: string; prefix?: string; suffix?: string }[];
}

const CommandCenter = () => {
  const { data, updateData } = useFinancials();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'Venture Profile': true, 'Core Financials': true, 'Growth & Acquisition': true, 'Unit Economics': true,
  });

  const toggleSection = (title: string) => setExpandedSections(prev => ({ ...prev, [title]: !prev[title] }));

  const sections: SectionConfig[] = [
    {
      title: 'Venture Profile', icon: Building2, color: '#F2994A',
      fields: [
        { label: 'Venture Name', key: 'name', type: 'text', placeholder: 'Startup Inc' },
        { label: 'Headcount', key: 'employees', type: 'number', placeholder: '10', suffix: 'people' },
      ]
    },
    {
      title: 'Core Financials', icon: Wallet, color: '#4E8AFF',
      fields: [
        { label: 'Monthly Revenue', key: 'revenue', type: 'number', prefix: '$' },
        { label: 'Monthly Burn', key: 'burn', type: 'number', prefix: '$' },
        { label: 'Cash Reserve', key: 'cash', type: 'number', prefix: '$' },
      ]
    },
    {
      title: 'Growth & Acquisition', icon: TrendingUp, color: '#00D68F',
      fields: [
        { label: 'New Revenue/Mo', key: 'new_revenue_pm', type: 'number', prefix: '$' },
        { label: 'Growth Rate', key: 'growth_rate', type: 'number', suffix: '%' },
      ]
    },
    {
      title: 'Unit Economics', icon: LineChart, color: '#FFD666',
      fields: [
        { label: 'Customer LTV', key: 'ltv', type: 'number', prefix: '$' },
        { label: 'CAC', key: 'cac', type: 'number', prefix: '$' },
      ]
    }
  ];

  return (
    <div className="glass-card-static flex flex-col h-[calc(100vh-140px)] overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(148,163,184,0.04)', background: 'linear-gradient(135deg, rgba(242,153,74,0.04) 0%, transparent 100%)' }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #F2994A, #E87D2F)', boxShadow: '0 3px 10px rgba(242,153,74,0.2)' }}
          >
            <Activity className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>Live Parameters</h2>
            <p className="text-[9px] font-medium text-text-muted">Real-time engine</p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(0,214,143,0.08)', border: '1px solid rgba(0,214,143,0.1)' }}
        >
          <div className="w-1.5 h-1.5 bg-signal-profit rounded-full animate-pulse-glow" />
          <span className="text-[9px] font-bold text-signal-profit">LIVE</span>
        </div>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
        {sections.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSections[section.title] !== false;
          return (
            <div key={section.title} className="rounded-md overflow-hidden"
              style={{ background: 'rgba(10,16,32,0.3)', border: '1px solid rgba(148,163,184,0.03)' }}
            >
              <button onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-bg-elevated/20 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <Icon className="w-3 h-3" style={{ color: section.color }} />
                  <span className="text-[11px] font-bold text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>{section.title}</span>
                </div>
                {isExpanded ? <ChevronUp className="w-3 h-3 text-text-muted" /> : <ChevronDown className="w-3 h-3 text-text-muted" />}
              </button>
              {isExpanded && (
                <div className="px-3 pb-3 space-y-2 animate-fade-in" style={{ animationDuration: '0.2s' }}>
                  {section.fields.map((field) => (
                    <div key={field.key} className="space-y-0.5">
                      <label className="text-[9px] font-bold text-text-muted uppercase tracking-wider">{field.label}</label>
                      <div className="relative">
                        {field.prefix && <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-text-muted">{field.prefix}</span>}
                        <input type={field.type} value={(data as any)[field.key]}
                          onChange={(e) => updateData({ [field.key]: field.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value })}
                          className={`w-full premium-input py-2 text-[12px] font-medium ${field.prefix ? 'pl-6 pr-2.5' : 'px-2.5'} ${field.type === 'number' ? 'font-mono' : ''}`}
                          placeholder={field.placeholder || '0'}
                        />
                        {field.suffix && <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-text-muted">{field.suffix}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Reset */}
      <div className="p-3" style={{ borderTop: '1px solid rgba(148,163,184,0.04)' }}>
        <button onClick={() => updateData({ name: "Nimbus Labs", revenue: 120000, burn: 85000, cash: 320000, ltv: 1200, cac: 350, new_revenue_pm: 15000, growth_rate: 12, employees: 24 })}
          className="w-full btn-ghost py-1.5 text-[10px] font-bold flex items-center justify-center gap-1.5">
          <RotateCcw className="w-3 h-3" /> Reset to Defaults
        </button>
      </div>
    </div>
  );
};

export default CommandCenter;
