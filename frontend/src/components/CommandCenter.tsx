'use client';

import React from 'react';
import { useFinancials } from '@/context/FinancialContext';

interface InputGroup {
  title: string;
  fields: {
    label: string;
    key: string;
    type: string;
    placeholder?: string;
    prefix?: string;
    suffix?: string;
  }[];
}

const CommandCenter = () => {
  const { data, updateData } = useFinancials();

  const groups: InputGroup[] = [
    {
      title: 'Venture profile',
      fields: [
        { label: 'Venture name', key: 'name', type: 'text', placeholder: 'Acme Corp' },
        { label: 'Headcount', key: 'employees', type: 'number', placeholder: '24', suffix: 'people' },
      ],
    },
    {
      title: 'Core financials',
      fields: [
        { label: 'Monthly revenue', key: 'revenue', type: 'number', prefix: '$' },
        { label: 'Monthly burn', key: 'burn', type: 'number', prefix: '$' },
        { label: 'Cash in bank', key: 'cash', type: 'number', prefix: '$' },
      ],
    },
    {
      title: 'Growth & acquisition',
      fields: [
        { label: 'New revenue / mo', key: 'new_revenue_pm', type: 'number', prefix: '$' },
        { label: 'Monthly growth rate', key: 'growth_rate', type: 'number', suffix: '%' },
      ],
    },
    {
      title: 'Unit economics',
      fields: [
        { label: 'Customer LTV', key: 'ltv', type: 'number', prefix: '$' },
        { label: 'Customer CAC', key: 'cac', type: 'number', prefix: '$' },
      ],
    },
  ];

  const handleReset = () => {
    updateData({
      name: 'Nimbus Labs',
      revenue: 120000,
      burn: 85000,
      cash: 320000,
      ltv: 1200,
      cac: 350,
      new_revenue_pm: 15000,
      growth_rate: 12,
      employees: 24,
    });
  };

  return (
    <div className="card-chrome h-full flex flex-col overflow-hidden bg-[var(--chrome)] border border-[var(--line)]">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[var(--line)] flex items-center justify-between bg-[var(--chrome)]">
        <div>
          <h2 className="text-[13px] font-semibold text-[var(--ink)] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Model parameters
          </h2>
          <p className="text-[11px] text-[var(--ink-muted)] mt-0.5">
            Real-time projection assumptions
          </p>
        </div>
      </div>

      {/* Inputs Form */}
      <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-[var(--line)]">
        {groups.map((group, groupIdx) => (
          <div key={group.title} className={groupIdx === 0 ? 'pb-4' : 'py-4'}>
            <h3 className="text-[11px] font-medium text-[var(--ink-muted)] uppercase tracking-wider mb-3">
              {group.title}
            </h3>
            <div className="space-y-3">
              {group.fields.map((field) => {
                const rawVal = (data as any)[field.key];
                const value = rawVal !== undefined && rawVal !== null ? rawVal : '';
                return (
                  <div key={field.key} className="space-y-1">
                    <label
                      htmlFor={`input-${field.key}`}
                      className="block text-[12px] text-[var(--ink-muted)] tracking-[0.01em]"
                    >
                      {field.label}
                    </label>
                    <div className="relative flex items-center">
                      {field.prefix && (
                        <span className="absolute left-2.5 text-[12px] font-medium text-[var(--ink-muted)] pointer-events-none">
                          {field.prefix}
                        </span>
                      )}
                      <input
                        id={`input-${field.key}`}
                        type={field.type}
                        value={value}
                        onChange={(e) => {
                          const val = field.type === 'number'
                            ? (e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)
                            : e.target.value;
                          updateData({ [field.key]: val });
                        }}
                        className={`w-full instrument-input bg-[var(--surface)] ${field.prefix ? 'pl-6 pr-2.5' : field.suffix ? 'pl-2.5 pr-12' : 'px-2.5'}`}
                        placeholder={field.placeholder || '0'}
                      />
                      {field.suffix && (
                        <span className="absolute right-2.5 text-[11px] text-[var(--ink-muted)] pointer-events-none">
                          {field.suffix}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Reset Link */}
      <div className="px-5 py-3 border-t border-[var(--line)] bg-[var(--chrome)] flex items-center justify-between">
        <button
          type="button"
          onClick={handleReset}
          className="text-[12px] text-[var(--ink-muted)] hover:text-[var(--ink)] hover:underline transition-colors"
        >
          Reset to default baseline
        </button>
      </div>
    </div>
  );
};

export default CommandCenter;
