'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useFinancials } from '@/context/FinancialContext';
import gsap from 'gsap';
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  ReferenceLine,
} from 'recharts';

// ═══ GSAP ANIMATED NUMBER COMPONENT ═══
function GsapNumber({
  value,
  prefix = '',
  suffix = '',
  decimals = 1,
  className = '',
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const [displayVal, setDisplayVal] = useState(value);
  const tweenRef = useRef<{ val: number }>({ val: value });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayVal(value);
      tweenRef.current.val = value;
      return;
    }

    const obj = tweenRef.current;
    const tween = gsap.to(obj, {
      val: value,
      duration: 0.4,
      ease: 'power2.out',
      onUpdate: () => {
        setDisplayVal(obj.val);
      },
    });

    return () => {
      tween.kill();
    };
  }, [value]);

  const formatted =
    decimals === 0
      ? Math.round(displayVal).toLocaleString()
      : displayVal.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });

  return (
    <span className={`tabular-nums ${className}`} style={{ fontFamily: 'var(--font-display)' }}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

// ═══ MAIN DASHBOARD (v2) ═══
const Dashboard = () => {
  const { data, metrics } = useFinancials();

  // ── Component A: Scenario Matrix & Quick Levers State ──
  const [activeScenario, setActiveScenario] = useState<'base' | 'conservative' | 'aggressive'>('base');
  const [levers, setLevers] = useState({
    freeze_hiring: false,
    cut_paid_acq: false,
    delay_infra: false,
  });

  // ── Component Time Horizon Switcher State ──
  const [timeHorizon, setTimeHorizon] = useState<number>(12); // 6, 12, 18, 24 months

  // ── Interactive In-Memory Financial Model Computation ──
  const model = useMemo(() => {
    if (!data || !metrics) return null;

    // 1. Scenario Multipliers
    let growthMult = 1.0;
    let cacMult = 1.0;
    if (activeScenario === 'conservative') {
      growthMult = 0.7;
      cacMult = 1.25;
    } else if (activeScenario === 'aggressive') {
      growthMult = 1.4;
      cacMult = 0.85;
    }

    // 2. Active Lever Burn Cuts
    let totalLeverBurnCut = 0;
    if (levers.freeze_hiring) totalLeverBurnCut += 18000;
    if (levers.cut_paid_acq) totalLeverBurnCut += 14000;
    if (levers.delay_infra) totalLeverBurnCut += 4500;

    // Effective Monthly Financials
    const effectiveBurn = Math.max(10000, data.burn - totalLeverBurnCut);
    const effectiveRevenue = data.revenue;
    const effectiveNetBurn = effectiveBurn - effectiveRevenue;

    // Runway Months
    const calculatedRunway =
      effectiveNetBurn <= 0 ? 99 : Math.max(0.5, data.cash / Math.max(1, effectiveNetBurn));

    // Zero-Cash Calendar Date
    const zeroCashDateObj = new Date();
    zeroCashDateObj.setDate(zeroCashDateObj.getDate() + Math.round(calculatedRunway * 30.4));
    const formattedZeroCashDate = zeroCashDateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    // Effective Growth Rate & Burn Multiple
    const effectiveGrowthRate = data.growth_rate * growthMult;
    const netArrAddedMo = (data.new_revenue_pm * growthMult);
    const effectiveBurnMultiple =
      netArrAddedMo > 0 ? (effectiveNetBurn > 0 ? effectiveNetBurn / netArrAddedMo : 0.5) : 5.0;

    // Projections up to 24 months
    const projection = Array.from({ length: 24 }).map((_, i) => {
      const monthNum = i + 1;
      const monthRev = Math.round(effectiveRevenue * Math.pow(1 + effectiveGrowthRate / 100, i));
      const monthCash = Math.max(0, Math.round(data.cash - (effectiveBurn - monthRev) * i));
      const altCash = Math.max(0, Math.round(data.cash - (effectiveBurn * 0.8 - monthRev) * i));
      return {
        month: `M${monthNum}`,
        cash: monthCash,
        altCash: altCash,
        revenue: monthRev,
        burn: Math.round(effectiveBurn),
      };
    });

    return {
      totalLeverBurnCut,
      effectiveBurn,
      effectiveRevenue,
      effectiveNetBurn,
      calculatedRunway,
      formattedZeroCashDate,
      effectiveGrowthRate,
      effectiveBurnMultiple,
      projection,
    };
  }, [data, metrics, activeScenario, levers]);

  if (!metrics || !model) {
    return (
      <div className="card h-[400px] flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-5 h-5 border-2 border-[var(--ink-muted)] border-t-[var(--accent)] rounded-full animate-spin mx-auto" />
          <p className="text-[12px] text-[var(--ink-muted)]">Building financial model...</p>
        </div>
      </div>
    );
  }

  const isPastSafetyWindow = model.calculatedRunway < 6;
  const safetyDeficitMonths = (6 - model.calculatedRunway).toFixed(1);

  // Filter projection slice based on selected time horizon
  const visibleProjection = model.projection.slice(0, timeHorizon);

  // Expense breakdown percentages
  const headcountBurn = Math.round(model.effectiveBurn * 0.68);
  const cloudBurn = Math.round(model.effectiveBurn * 0.14);
  const marketingBurn = Math.round(model.effectiveBurn * 0.12);
  const gaBurn = Math.round(model.effectiveBurn * 0.06);

  // Rule of 40 Score: Growth Rate + Free Cash Flow Margin
  const fcfMargin = data.revenue > 0 ? ((data.revenue - model.effectiveBurn) / data.revenue) * 100 : -50;
  const ruleOf40Score = Math.round(model.effectiveGrowthRate + fcfMargin);

  const toggleLever = (key: keyof typeof levers) => {
    setLevers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      {/* ── Component A: Scenario Matrix & Quick Levers Bar ── */}
      <div className="card p-4 space-y-3 border border-[var(--line)]">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--line)]">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold text-[var(--ink)]" style={{ fontFamily: 'var(--font-display)' }}>
              Scenario Matrix:
            </span>
            <div className="inline-flex p-0.5 bg-[var(--chrome)] border border-[var(--line)] rounded-[4px]">
              {(['base', 'conservative', 'aggressive'] as const).map((scen) => {
                const isActive = activeScenario === scen;
                const labels = { base: 'Base Case', conservative: 'Conservative', aggressive: 'Aggressive Growth' };
                return (
                  <button
                    key={scen}
                    onClick={() => setActiveScenario(scen)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-[3px] transition-colors ${
                      isActive
                        ? 'bg-[var(--surface)] text-[var(--ink)] font-semibold shadow-xs border border-[var(--line)]'
                        : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {labels[scen]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-[11px] text-[var(--ink-muted)]">
            Active Assumptions: <span className="font-semibold text-[var(--ink)]">Growth {model.effectiveGrowthRate.toFixed(1)}%/mo</span>
          </div>
        </div>

        {/* Quick Levers Row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-medium text-[var(--ink-muted)] uppercase tracking-wider pr-1">
            Quick Levers:
          </span>

          <button
            onClick={() => toggleLever('freeze_hiring')}
            className={`px-3 py-1 text-[11px] font-medium rounded-[4px] border transition-colors flex items-center gap-1.5 ${
              levers.freeze_hiring
                ? 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent)] font-semibold'
                : 'bg-[var(--surface)] text-[var(--ink-muted)] border-[var(--line)] hover:text-[var(--ink)]'
            }`}
          >
            <span>Freeze non-eng hiring</span>
            <span className={levers.freeze_hiring ? 'font-semibold' : 'text-[var(--ink-faint)]'}>
              · +1.8 mo
            </span>
          </button>

          <button
            onClick={() => toggleLever('cut_paid_acq')}
            className={`px-3 py-1 text-[11px] font-medium rounded-[4px] border transition-colors flex items-center gap-1.5 ${
              levers.cut_paid_acq
                ? 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent)] font-semibold'
                : 'bg-[var(--surface)] text-[var(--ink-muted)] border-[var(--line)] hover:text-[var(--ink)]'
            }`}
          >
            <span>Cut paid acquisition 30%</span>
            <span className={levers.cut_paid_acq ? 'font-semibold' : 'text-[var(--ink-faint)]'}>
              · +2.4 mo
            </span>
          </button>

          <button
            onClick={() => toggleLever('delay_infra')}
            className={`px-3 py-1 text-[11px] font-medium rounded-[4px] border transition-colors flex items-center gap-1.5 ${
              levers.delay_infra
                ? 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent)] font-semibold'
                : 'bg-[var(--surface)] text-[var(--ink-muted)] border-[var(--line)] hover:text-[var(--ink)]'
            }`}
          >
            <span>Delay infra spend</span>
            <span className={levers.delay_infra ? 'font-semibold' : 'text-[var(--ink-faint)]'}>
              · +0.6 mo
            </span>
          </button>
        </div>
      </div>

      {/* ── Component B: Runway Drop-Dead Date & Milestone Gauge ── */}
      <div className="card p-5 border border-[var(--line)] space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2 pb-2">
          <div>
            <div className="text-[12px] font-medium text-[var(--ink-muted)] uppercase tracking-wider">
              Projected Zero-Cash Date
            </div>
            <div className="text-[24px] font-semibold text-[var(--ink)] tracking-tight mt-0.5" style={{ fontFamily: 'var(--font-display)' }}>
              Zero-cash: {model.formattedZeroCashDate}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[15px] font-semibold text-[var(--ink)] tabular-nums" style={{ fontFamily: 'var(--font-display)' }}>
              {model.calculatedRunway.toFixed(1)} months remaining
            </span>
            <div className="text-[11px] text-[var(--ink-muted)]">
              Based on ${Math.abs(model.effectiveNetBurn).toLocaleString()}/mo net outflow
            </div>
          </div>
        </div>

        {/* Timeline Gauge Bar */}
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-[var(--chrome)] border border-[var(--line)] rounded-[3px] overflow-hidden relative">
            {/* Safety Threshold Region (First 6 months or past marker) */}
            <div
              className="h-full bg-[var(--risk-red-soft)] absolute left-0"
              style={{ width: `${Math.min(100, (6 / Math.max(12, model.calculatedRunway)) * 100)}%` }}
            />
            {/* Active Runway Progress Fill */}
            <div
              className="h-full bg-[var(--accent)] transition-all duration-300 relative z-10"
              style={{ width: `${Math.min(100, (model.calculatedRunway / Math.max(12, model.calculatedRunway)) * 100)}%` }}
            />
            {/* 6-Month Safety Threshold Line Marker */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-[var(--ink)] z-20"
              style={{ left: `${Math.min(100, (6 / Math.max(12, model.calculatedRunway)) * 100)}%` }}
              title="6-Month Fundraise Safety Lead Time Threshold"
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-[var(--ink-muted)]">
            <span>Today</span>
            <span className="font-medium text-[var(--ink)]">
              6.0 mo Fundraise Lead Time Safety Marker
            </span>
            <span>Zero Cash ({model.formattedZeroCashDate})</span>
          </div>
        </div>

        {/* Safety Callout if Runway < 6 Months */}
        {isPastSafetyWindow && (
          <div className="p-3 bg-[var(--risk-red-soft)] border border-rgba(166,64,58,0.2) rounded-[4px] text-[12px] text-[var(--risk-red)] flex items-center justify-between">
            <span>
              <strong>Fundraise Lead Time Warning:</strong> Current runway position is{' '}
              <strong>{safetyDeficitMonths} months past</strong> the recommended 6-month fundraise safety window.
            </span>
            <span className="font-semibold underline cursor-pointer">Initiate bridge plan</span>
          </div>
        )}
      </div>

      {/* ── Fix Density Rule: Packed 5-Tile Grid with 3 Lines per Tile ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-px bg-[var(--line)] card overflow-hidden border border-[var(--line)]">
        {/* Tile 1: Cash Runway */}
        <div className="bg-[var(--surface)] p-3.5 flex flex-col justify-between">
          <span className="text-[12px] font-medium text-[var(--ink-muted)] block">Cash runway</span>
          <div className="my-2">
            <GsapNumber
              value={model.calculatedRunway}
              suffix=" mo"
              decimals={1}
              className="text-[26px] font-semibold text-[var(--ink)] tracking-tight block leading-none"
            />
          </div>
          <span className={`benchmark-pill ${isPastSafetyWindow ? 'benchmark-pill-red' : 'benchmark-pill-accent'}`}>
            {isPastSafetyWindow ? `Past safety window (${model.calculatedRunway.toFixed(1)} mo)` : `Sufficient runway`}
          </span>
        </div>

        {/* Tile 2: Burn Multiple */}
        <div className="bg-[var(--surface)] p-3.5 flex flex-col justify-between">
          <span className="text-[12px] font-medium text-[var(--ink-muted)] block">Burn multiple</span>
          <div className="my-2">
            <GsapNumber
              value={model.effectiveBurnMultiple}
              suffix="x"
              decimals={2}
              className="text-[26px] font-semibold text-[var(--ink)] tracking-tight block leading-none"
            />
          </div>
          <span className="benchmark-pill benchmark-pill-amber">
            High burn · median is 1.4x
          </span>
        </div>

        {/* Tile 3: Net Monthly Burn */}
        <div className="bg-[var(--surface)] p-3.5 flex flex-col justify-between">
          <span className="text-[12px] font-medium text-[var(--ink-muted)] block">Net monthly burn</span>
          <div className="my-2">
            <GsapNumber
              value={Math.abs(model.effectiveNetBurn)}
              prefix={model.effectiveNetBurn > 0 ? '-$' : '$'}
              decimals={0}
              className="text-[26px] font-semibold text-[var(--ink)] tracking-tight block leading-none"
            />
          </div>
          <span className="benchmark-pill">
            +${(model.totalLeverBurnCut / 1000).toFixed(1)}k saved via levers
          </span>
        </div>

        {/* Tile 4: Gross Margin */}
        <div className="bg-[var(--surface)] p-3.5 flex flex-col justify-between">
          <span className="text-[12px] font-medium text-[var(--ink-muted)] block">Gross margin</span>
          <div className="my-2">
            <GsapNumber
              value={metrics.gross_margin}
              suffix="%"
              decimals={1}
              className="text-[26px] font-semibold text-[var(--ink)] tracking-tight block leading-none"
            />
          </div>
          <span className={`benchmark-pill ${metrics.gross_margin >= 70 ? 'benchmark-pill-accent' : 'benchmark-pill-amber'}`}>
            {metrics.gross_margin >= 70 ? 'Top 25% SaaS quartile' : 'Below 70% median'}
          </span>
        </div>

        {/* Tile 5: Revenue / Headcount */}
        <div className="bg-[var(--surface)] p-3.5 flex flex-col justify-between">
          <span className="text-[12px] font-medium text-[var(--ink-muted)] block">Rev / Headcount</span>
          <div className="my-2">
            <GsapNumber
              value={Math.round(data.revenue / Math.max(1, data.employees))}
              prefix="$"
              decimals={0}
              className="text-[26px] font-semibold text-[var(--ink)] tracking-tight block leading-none"
            />
          </div>
          <span className="benchmark-pill">
            +12% YoY velocity
          </span>
        </div>
      </div>

      {/* ── Section: Cash Projection Chart + Horizon Switcher & Rule of 40 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Cash Trajectory Chart with Horizon Switcher (7 cols) */}
        <div className="lg:col-span-7 card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--line)] mb-4">
            <div>
              <h3 className="text-[14px] font-semibold text-[var(--ink)] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                Cash trajectory & scenario projection
              </h3>
              <p className="text-[11px] text-[var(--ink-muted)] mt-0.5">
                Current path vs. 20% reduced burn alternate path
              </p>
            </div>

            {/* Time Horizon Switcher Segmented Control */}
            <div className="inline-flex p-0.5 bg-[var(--chrome)] border border-[var(--line)] rounded-[4px]">
              {([6, 12, 18, 24] as const).map((horiz) => (
                <button
                  key={horiz}
                  onClick={() => setTimeHorizon(horiz)}
                  className={`px-2 py-0.5 text-[11px] font-medium rounded-[3px] transition-colors ${
                    timeHorizon === horiz
                      ? 'bg-[var(--surface)] text-[var(--ink)] font-semibold shadow-xs border border-[var(--line)]'
                      : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  {horiz}M
                </button>
              ))}
            </div>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visibleProjection} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--line)" />
                <XAxis
                  dataKey="month"
                  axisLine={{ stroke: 'var(--line)' }}
                  tickLine={false}
                  tick={{ fill: 'var(--ink-muted)', fontSize: 11 }}
                  dy={6}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--ink-muted)', fontSize: 11 }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  width={54}
                />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    `$${Number(val).toLocaleString()}`,
                    name === 'cash' ? 'Active scenario' : 'Alternate path',
                  ]}
                  labelFormatter={(lbl) => `Month: ${lbl}`}
                />
                <ReferenceLine y={0} stroke="var(--risk-red)" strokeWidth={1} strokeDasharray="4 4" />
                <Area
                  type="monotone"
                  dataKey="cash"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  fill="var(--accent-soft)"
                  isAnimationActive={true}
                  animationDuration={400}
                />
                <Line
                  type="monotone"
                  dataKey="altCash"
                  stroke="var(--ink-muted)"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                  isAnimationActive={true}
                  animationDuration={400}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rule of 40 Module + Revenue vs Burn (5 cols) */}
        <div className="lg:col-span-5 card p-5 flex flex-col justify-between">
          <div className="pb-4 border-b border-[var(--line)] mb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-[var(--ink)] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                Rule of 40 Gauge
              </h3>
              <span className="text-[12px] font-semibold text-[var(--ink)] tabular-nums" style={{ fontFamily: 'var(--font-display)' }}>
                {ruleOf40Score}% (Target: 40%+)
              </span>
            </div>
            <p className="text-[11px] text-[var(--ink-muted)] mt-0.5">
              Growth rate ({model.effectiveGrowthRate.toFixed(0)}%) + Free Cash Flow margin ({fcfMargin.toFixed(0)}%)
            </p>

            {/* Horizontal Gauge Bar */}
            <div className="mt-3 space-y-1">
              <div className="h-3 w-full bg-[var(--chrome)] border border-[var(--line)] rounded-[3px] relative overflow-hidden">
                {/* 40 Target Marker */}
                <div className="absolute top-0 bottom-0 left-[65%] w-0.5 bg-[var(--ink)] z-10" title="Rule of 40 Target" />
                {/* Score bar indicator */}
                <div
                  className={`h-full ${ruleOf40Score >= 40 ? 'bg-[var(--accent)]' : 'bg-[var(--risk-amber)]'}`}
                  style={{ width: `${Math.max(5, Math.min(100, ((ruleOf40Score + 50) / 100) * 100))}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[var(--ink-muted)]">
                <span>-50%</span>
                <span className="font-semibold text-[var(--ink)]">40% Benchmark</span>
                <span>+50%</span>
              </div>
            </div>
          </div>

          {/* Revenue & Net Burn Overview */}
          <div className="space-y-3">
            <h4 className="text-[12px] font-semibold text-[var(--ink)]" style={{ fontFamily: 'var(--font-display)' }}>
              Revenue & Outflow Momentum
            </h4>
            <div className="h-[140px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={visibleProjection.slice(0, 6)} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--line)" />
                  <XAxis dataKey="month" axisLine={{ stroke: 'var(--line)' }} tick={{ fill: 'var(--ink-muted)', fontSize: 10 }} />
                  <YAxis axisLine={false} tick={{ fill: 'var(--ink-muted)', fontSize: 10 }} tickFormatter={(v) => `$${v/1000}k`} width={40} />
                  <Bar dataKey="revenue" fill="var(--accent)" barSize={14} radius={[2, 2, 0, 0]} />
                  <Line type="monotone" dataKey="burn" stroke="var(--risk-amber)" strokeWidth={1.5} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* ── Component D: Expense Composition & Headcount Ledger ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Expense Composition Bar (5 cols) */}
        <div className="lg:col-span-5 card p-5 flex flex-col justify-between">
          <div className="pb-3 border-b border-[var(--line)] mb-4">
            <h3 className="text-[14px] font-semibold text-[var(--ink)] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Monthly Expense Composition
            </h3>
            <p className="text-[11px] text-[var(--ink-muted)] mt-0.5">
              Outflow breakdown (${model.effectiveBurn.toLocaleString()}/mo total)
            </p>
          </div>

          {/* Horizontal Stacked Bar */}
          <div className="space-y-3">
            <div className="h-5 w-full rounded-[3px] overflow-hidden flex border border-[var(--line)]">
              <div className="h-full bg-[#3D5A45]" style={{ width: '68%' }} title="Headcount: 68%" />
              <div className="h-full bg-[#6B6F6C]" style={{ width: '14%' }} title="Cloud & Infra: 14%" />
              <div className="h-full bg-[#9A9D99]" style={{ width: '12%' }} title="Marketing & CAC: 12%" />
              <div className="h-full bg-[#D8D5CD]" style={{ width: '6%' }} title="G&A: 6%" />
            </div>

            {/* Legend & Amounts */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#3D5A45]" />
                <span className="text-[var(--ink)]">Headcount (68%)</span>
                <span className="text-[var(--ink-muted)] ml-auto">${headcountBurn.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#6B6F6C]" />
                <span className="text-[var(--ink)]">Cloud/Infra (14%)</span>
                <span className="text-[var(--ink-muted)] ml-auto">${cloudBurn.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#9A9D99]" />
                <span className="text-[var(--ink)]">Marketing (12%)</span>
                <span className="text-[var(--ink-muted)] ml-auto">${marketingBurn.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#D8D5CD]" />
                <span className="text-[var(--ink)]">G&A (6%)</span>
                <span className="text-[var(--ink-muted)] ml-auto">${gaBurn.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Headcount Ledger Table (7 cols) */}
        <div className="lg:col-span-7 card p-5">
          <div className="pb-3 border-b border-[var(--line)] mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-[14px] font-semibold text-[var(--ink)] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                Headcount Ledger
              </h3>
              <p className="text-[11px] text-[var(--ink-muted)] mt-0.5">
                Departmental payroll & burn distribution ({data.employees} employees)
              </p>
            </div>
          </div>

          <table className="w-full text-[12px] border-collapse">
            <thead>
              <tr className="text-[var(--ink-muted)] border-b border-[var(--line)] text-left font-medium">
                <th className="pb-2">Department</th>
                <th className="pb-2 text-right">Headcount</th>
                <th className="pb-2 text-right">Monthly Cost</th>
                <th className="pb-2 text-right">% of Total Burn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)] font-variant-numeric tabular-nums text-[var(--ink)]">
              <tr>
                <td className="py-2 font-medium">Engineering & Product</td>
                <td className="py-2 text-right">14</td>
                <td className="py-2 text-right font-semibold">${Math.round(headcountBurn * 0.65).toLocaleString()}</td>
                <td className="py-2 text-right text-[var(--ink-muted)]">44.2%</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Sales & Growth GTM</td>
                <td className="py-2 text-right">6</td>
                <td className="py-2 text-right font-semibold">${Math.round(headcountBurn * 0.22).toLocaleString()}</td>
                <td className="py-2 text-right text-[var(--ink-muted)]">15.0%</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Operations & G&A</td>
                <td className="py-2 text-right">4</td>
                <td className="py-2 text-right font-semibold">${Math.round(headcountBurn * 0.13).toLocaleString()}</td>
                <td className="py-2 text-right text-[var(--ink-muted)]">8.8%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
