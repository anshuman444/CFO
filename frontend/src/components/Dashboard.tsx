'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useFinancials } from '@/context/FinancialContext';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  ShieldCheck,
  Flame,
  Gauge,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  BarChart3,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import {
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  RadialBarChart,
  RadialBar,
  BarChart,
  ReferenceLine,
} from 'recharts';

// ═══ ANIMATED COUNTER HOOK ═══
function useAnimatedValue(target: number, duration = 1400) {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [target, duration]);

  return value;
}

// ═══ ANIMATED NUMBER DISPLAY ═══
function AnimatedNum({ value, prefix = '', suffix = '', decimals = 1, className = '' }: {
  value: number; prefix?: string; suffix?: string; decimals?: number; className?: string;
}) {
  const animated = useAnimatedValue(value, 1400);
  const display = decimals === 0 ? Math.round(animated) : animated.toFixed(decimals);
  return (
    <span className={`tabular-nums ${className}`} style={{ fontFamily: 'var(--font-display)' }}>
      {prefix}{display}{suffix}
    </span>
  );
}

// ═══ DYNAMIC SPARKLINE ═══
function Sparkline({ data, color, height = 28, width = 72 }: { data: number[]; color: string; height?: number; width?: number }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  const gradId = `spark-${color.replace('#', '')}`;

  return (
    <svg width={width} height={height} className="opacity-70">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${points} ${width},${height}`} fill={`url(#${gradId})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* End dot */}
      {data.length > 0 && (
        <circle
          cx={(data.length - 1) / (data.length - 1) * width}
          cy={height - ((data[data.length - 1] - min) / range) * (height - 4) - 2}
          r="2" fill={color}
        />
      )}
    </svg>
  );
}

// ═══ HEALTH RING ═══
function HealthRing({ score, size = 150 }: { score: number; size?: number }) {
  const animated = useAnimatedValue(score, 1800);
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;

  const getColor = (s: number) => s >= 70 ? '#00D68F' : s >= 40 ? '#FFD666' : '#FF6B6B';
  const getLabel = (s: number) => s >= 70 ? 'Strong' : s >= 40 ? 'Moderate' : 'At Risk';
  const color = getColor(score);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(148,163,184,0.05)" strokeWidth={strokeWidth} />
        <circle
          cx={size/2} cy={size/2} r={radius} fill="none"
          stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.8s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 6px ${color}30)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold tabular-nums" style={{ fontFamily: 'var(--font-display)', color }}>
          {Math.round(animated)}
        </span>
        <span className="text-[8px] font-bold uppercase tracking-[0.15em] mt-0.5" style={{ color }}>{getLabel(score)}</span>
      </div>
    </div>
  );
}

// ═══ LIVE TICKER ═══
function LiveTicker({ metrics, data }: { metrics: any; data: any }) {
  const items = [
    { label: 'ARR', value: `$${(metrics.arr / 1000).toFixed(0)}k`, color: '#F2994A' },
    { label: 'RUNWAY', value: `${metrics.runway.toFixed(1)} Mo`, color: metrics.runway >= 12 ? '#00D68F' : '#FF6B6B' },
    { label: 'BURN MULT', value: `${metrics.burn_multiple.toFixed(1)}x`, color: metrics.burn_multiple < 2 ? '#00D68F' : '#FFD666' },
    { label: 'LTV:CAC', value: `${metrics.ltv_cac.toFixed(1)}x`, color: metrics.ltv_cac >= 3 ? '#00D68F' : '#FFD666' },
    { label: 'MARGIN', value: `${metrics.gross_margin}%`, color: '#4E8AFF' },
    { label: 'EBITDA', value: `$${(metrics.ebitda / 1000).toFixed(1)}k`, color: metrics.ebitda >= 0 ? '#00D68F' : '#FF6B6B' },
    { label: 'CHURN', value: `${metrics.churn_rate}%`, color: metrics.churn_rate <= 3 ? '#00D68F' : '#FF6B6B' },
    { label: 'TEAM', value: `${data.employees}`, color: '#94A3B8' },
  ];

  return (
    <div className="ticker-strip rounded-lg px-2 py-1.5 mb-5"
      style={{ background: 'rgba(10,16,32,0.5)', border: '1px solid rgba(148,163,184,0.04)' }}
    >
      <div className="ticker-content">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 mx-4">
            <span className="text-[9px] font-bold text-text-muted tracking-wider">{item.label}</span>
            <span className="text-[10px] font-bold tabular-nums" style={{ color: item.color, fontFamily: 'var(--font-mono)' }}>
              {item.value}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ═══ MAIN DASHBOARD ═══
const Dashboard = () => {
  const { data, metrics } = useFinancials();
  const [liveOffset, setLiveOffset] = useState(0);

  // Simulate live micro-movement in charts
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveOffset(prev => (prev + 1) % 100);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!metrics || !metrics.projection) {
    return (
      <div className="h-[400px] flex items-center justify-center glass-card-static">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-brand-orange/20 border-t-brand-orange rounded-full animate-spin" />
          <p className="text-xs font-bold text-text-muted uppercase tracking-widest animate-pulse">
            Connecting to Advisory Engine...
          </p>
        </div>
      </div>
    );
  }

  // ── Dynamic Data Computations ──
  const netBurn = data.burn - data.revenue;
  const monthlyProfit = data.revenue - data.burn;
  const profitMarginPct = data.revenue > 0 ? ((monthlyProfit / data.revenue) * 100) : 0;
  const revPerEmployee = data.employees > 0 ? data.revenue / data.employees : 0;

  // Health score computation
  const computeHealth = () => {
    let s = 50;
    if (metrics.runway >= 18) s += 25; else if (metrics.runway >= 12) s += 15; else if (metrics.runway >= 6) s += 5; else s -= 15;
    if (metrics.ltv_cac >= 3) s += 15; else if (metrics.ltv_cac >= 2) s += 8; else s -= 5;
    if (metrics.burn_multiple < 2) s += 10; else if (metrics.burn_multiple < 4) s += 3; else s -= 10;
    if (metrics.gross_margin > 60) s += 5;
    if (profitMarginPct > 0) s += 5;
    return Math.max(0, Math.min(100, s));
  };

  const healthScore = computeHealth();

  // Dynamic projection data with micro-variance for "live" feel
  const dynamicProjection = metrics.projection.map((p: any, i: number) => {
    const jitter = Math.sin((liveOffset + i * 7) * 0.1) * (p.cash * 0.002);
    return {
      ...p,
      cash: Math.max(0, p.cash + jitter),
      revenue: p.revenue + Math.sin((liveOffset + i * 5) * 0.08) * (p.revenue * 0.003),
      burn: data.burn,
      profit: p.revenue - data.burn,
    };
  });

  // Monthly P&L breakdown for waterfall
  const pnlData = dynamicProjection.map((p: any) => ({
    month: p.month,
    revenue: p.revenue,
    costs: -data.burn,
    net: p.revenue - data.burn,
  }));

  // KPI data
  const kpis = [
    {
      label: 'Cash Runway',
      value: metrics.runway,
      suffix: ' Mo',
      status: metrics.risk,
      icon: Clock,
      color: metrics.runway >= 12 ? '#00D68F' : metrics.runway >= 6 ? '#FFD666' : '#FF6B6B',
      accentClass: metrics.runway >= 12 ? 'kpi-profit' : metrics.runway >= 6 ? 'kpi-caution' : 'kpi-loss',
      trend: metrics.runway >= 12 ? 'up' : 'down',
      context: metrics.runway >= 12 ? 'Healthy runway — no immediate action' : metrics.runway >= 6 ? 'Fundraise within 3 months' : 'URGENT: Bridge funding needed',
      sparkData: dynamicProjection.map((p: any) => p.cash),
    },
    {
      label: 'Burn Multiple',
      value: metrics.burn_multiple,
      suffix: 'x',
      status: metrics.burn_multiple < 2 ? 'EFFICIENT' : metrics.burn_multiple < 4 ? 'MODERATE' : 'HIGH',
      icon: Flame,
      color: metrics.burn_multiple < 2 ? '#00D68F' : metrics.burn_multiple < 4 ? '#FFD666' : '#FF6B6B',
      accentClass: metrics.burn_multiple < 2 ? 'kpi-profit' : 'kpi-caution',
      trend: metrics.burn_multiple < 2 ? 'up' : 'down',
      context: `$${(data.burn/1000).toFixed(0)}k burn / $${(data.new_revenue_pm/1000).toFixed(0)}k new rev`,
      sparkData: dynamicProjection.map((p: any) => p.revenue),
    },
    {
      label: 'LTV : CAC',
      value: metrics.ltv_cac,
      suffix: 'x',
      status: metrics.ltv_cac >= 3 ? 'STRONG' : metrics.ltv_cac >= 2 ? 'OK' : 'WEAK',
      icon: Target,
      color: metrics.ltv_cac >= 3 ? '#00D68F' : metrics.ltv_cac >= 2 ? '#FFD666' : '#FF6B6B',
      accentClass: metrics.ltv_cac >= 3 ? 'kpi-profit' : 'kpi-caution',
      trend: metrics.ltv_cac >= 3 ? 'up' : 'down',
      context: `$${data.ltv.toLocaleString()} LTV vs $${data.cac.toLocaleString()} CAC`,
      sparkData: [data.cac, data.ltv * 0.3, data.ltv * 0.5, data.ltv * 0.7, data.ltv],
    },
    {
      label: 'Magic Number',
      value: metrics.magic_number,
      suffix: '',
      status: metrics.magic_number >= 0.7 ? 'SCALE' : metrics.magic_number >= 0.5 ? 'GROW' : 'OPTIMIZE',
      icon: Zap,
      color: '#F2994A',
      accentClass: 'kpi-orange',
      trend: metrics.magic_number >= 0.7 ? 'up' : 'down',
      context: metrics.magic_number >= 0.7 ? 'Ready to accelerate spend' : 'Optimize GTM efficiency first',
      sparkData: dynamicProjection.map((p: any, i: number) => p.revenue * (1 + i * 0.015)),
    },
  ];

  const unitEconData = [
    { name: 'Customer LTV', value: data.ltv, fill: '#F2994A' },
    { name: 'Acq. Cost', value: data.cac, fill: '#4E8AFF' },
    { name: 'Net Value', value: Math.max(0, data.ltv - data.cac), fill: '#00D68F' },
  ];

  return (
    <div className="space-y-5">
      {/* ── Live Ticker ── */}
      <LiveTicker metrics={metrics} data={data} />

      {/* ── Row 1: Hero KPI Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {kpis.map((kpi, idx) => (
          <div
            key={kpi.label}
            className={`glass-card p-4 ${kpi.accentClass} animate-fade-in-up`}
            style={{ animationFillMode: 'both', animationDelay: `${idx * 60}ms` }}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
              <div className="p-1.5 rounded-md" style={{ background: `${kpi.color}12` }}>
                <kpi.icon className="w-3.5 h-3.5" style={{ color: kpi.color }} />
              </div>
              <span className={`stat-pill ${
                kpi.trend === 'up' ? 'stat-pill-profit' : 'stat-pill-loss'
              }`}>
                {kpi.trend === 'up' ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                {kpi.status}
              </span>
            </div>

            {/* Value */}
            <AnimatedNum
              value={kpi.value}
              suffix={kpi.suffix}
              decimals={kpi.suffix === ' Mo' ? 1 : 2}
              className="text-2xl font-bold text-text-primary block"
            />

            {/* Label + Context */}
            <p className="text-[10px] font-semibold text-text-muted mt-0.5">{kpi.label}</p>
            <p className="text-[9px] text-text-muted mt-1 opacity-60 leading-tight">{kpi.context}</p>

            {/* Sparkline */}
            <div className="mt-2 flex justify-end">
              <Sparkline data={kpi.sparkData} color={kpi.color} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Row 2: Cash Flow + Revenue vs Burn ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
        {/* Cash Depletion — Takes 3 cols */}
        <div className="lg:col-span-3 glass-card p-5 animate-fade-in-up stagger-2" style={{ animationFillMode: 'both' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>
                Cash Flow Trajectory
              </h3>
              <p className="text-[10px] font-medium text-text-muted mt-0.5">
                12-month projection • <span className="text-signal-profit">Live</span>
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-signal-profit animate-pulse-glow" />
              <span className="text-[9px] font-bold text-text-muted">REALTIME</span>
            </div>
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dynamicProjection}>
                <defs>
                  <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F2994A" stopOpacity={0.25} />
                    <stop offset="50%" stopColor="#F2994A" stopOpacity={0.05} />
                    <stop offset="95%" stopColor="#F2994A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.04)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={9} fontWeight={600} fill="#5A6678" dy={8} />
                <YAxis axisLine={false} tickLine={false} fontSize={9} fontWeight={600} fill="#5A6678" tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip
                  contentStyle={{ background: 'rgba(10,16,32,0.95)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '10px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
                  labelStyle={{ color: '#EDF2F7', fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: '12px' }}
                  itemStyle={{ color: '#94A3B8', fontWeight: 600, fontSize: '11px' }}
                  formatter={(value: any) => [`$${(Number(value)/1000).toFixed(1)}k`]}
                />
                {/* Zero line */}
                <ReferenceLine y={0} stroke="rgba(148,163,184,0.1)" strokeDasharray="3 3" />
                <Area type="monotone" dataKey="cash" stroke="#F2994A" strokeWidth={2} fillOpacity={1} fill="url(#cashGrad)" name="Cash Reserve" />
                <Line type="monotone" dataKey="revenue" stroke="#00D68F" strokeWidth={1.5} dot={false} strokeDasharray="4 2" name="Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Runway Gauge + Health — Takes 2 cols */}
        <div className="lg:col-span-2 grid grid-rows-2 gap-3">
          {/* Health Score */}
          <div className="glass-card p-4 flex items-center gap-5 animate-fade-in-up stagger-3" style={{ animationFillMode: 'both' }}>
            <HealthRing score={healthScore} size={100} />
            <div className="flex-1">
              <h3 className="text-xs font-bold text-text-primary mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Venture Health
              </h3>
              <div className="space-y-1.5">
                {[
                  { l: 'Runway', v: `${metrics.runway.toFixed(1)} mo`, ok: metrics.runway >= 12 },
                  { l: 'Unit Econ', v: `${metrics.ltv_cac.toFixed(1)}x`, ok: metrics.ltv_cac >= 3 },
                  { l: 'Efficiency', v: `${metrics.burn_multiple.toFixed(1)}x`, ok: metrics.burn_multiple < 2 },
                ].map(item => (
                  <div key={item.l} className="flex items-center justify-between">
                    <span className="text-[9px] font-semibold text-text-muted">{item.l}</span>
                    <span className={`text-[10px] font-bold tabular-nums ${item.ok ? 'text-signal-profit' : 'text-signal-caution'}`}>
                      {item.v} {item.ok ? <CheckCircle2 className="w-2.5 h-2.5 inline ml-0.5" /> : <AlertTriangle className="w-2.5 h-2.5 inline ml-0.5" />}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="glass-card p-4 animate-fade-in-up stagger-4" style={{ animationFillMode: 'both' }}>
            <h3 className="text-xs font-bold text-text-primary mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              Key Financials
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { l: 'ARR', v: `$${(metrics.arr/1000).toFixed(0)}k`, c: '#F2994A' },
                { l: 'Gross Margin', v: `${metrics.gross_margin}%`, c: '#00D68F' },
                { l: 'Net Burn', v: `$${(Math.abs(netBurn)/1000).toFixed(0)}k`, c: netBurn > 0 ? '#FF6B6B' : '#00D68F' },
                { l: 'Rev/Employee', v: `$${(revPerEmployee/1000).toFixed(1)}k`, c: '#4E8AFF' },
              ].map(item => (
                <div key={item.l} className="p-2 rounded-md text-center" style={{ background: 'rgba(10,16,32,0.4)' }}>
                  <p className="text-[8px] font-bold text-text-muted uppercase tracking-wider">{item.l}</p>
                  <p className="text-sm font-bold tabular-nums mt-0.5" style={{ color: item.c, fontFamily: 'var(--font-display)' }}>
                    {item.v}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 3: P&L Waterfall + Unit Economics + Runway Gauge ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Monthly P&L Waterfall */}
        <div className="glass-card p-5 animate-fade-in-up stagger-4" style={{ animationFillMode: 'both' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>Revenue vs Burn</h3>
              <p className="text-[10px] font-medium text-text-muted mt-0.5">Growth trajectory</p>
            </div>
            <BarChart3 className="w-4 h-4 text-text-muted" />
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={dynamicProjection}>
                <defs>
                  <linearGradient id="revBarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00D68F" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#00D68F" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.04)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={9} fontWeight={600} fill="#5A6678" dy={8} />
                <YAxis axisLine={false} tickLine={false} fontSize={9} fontWeight={600} fill="#5A6678" tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip
                  contentStyle={{ background: 'rgba(10,16,32,0.95)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '10px' }}
                  labelStyle={{ color: '#EDF2F7', fontWeight: 700, fontSize: '12px' }}
                  itemStyle={{ color: '#94A3B8', fontWeight: 600, fontSize: '11px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 600 }} />
                <Bar dataKey="revenue" fill="url(#revBarGrad)" radius={[3, 3, 0, 0]} barSize={12} name="Revenue" />
                <Line type="monotone" dataKey="burn" stroke="#FF6B6B" strokeWidth={1.5} dot={false} strokeDasharray="5 3" name="Burn Rate" />
                <ReferenceLine y={data.burn} stroke="rgba(255,107,107,0.2)" strokeDasharray="3 3" label={{ value: 'Breakeven', fill: '#5A6678', fontSize: 9, fontWeight: 600 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Unit Economics Donut */}
        <div className="glass-card p-5 animate-fade-in-up stagger-5" style={{ animationFillMode: 'both' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>Unit Economics</h3>
              <p className="text-[10px] font-medium text-text-muted mt-0.5">LTV / CAC breakdown</p>
            </div>
            <DollarSign className="w-4 h-4 text-text-muted" />
          </div>
          <div className="h-[220px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={unitEconData} cx="50%" cy="50%" innerRadius={55} outerRadius={78} paddingAngle={3} dataKey="value" stroke="none" cornerRadius={5}>
                  {unitEconData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'rgba(10,16,32,0.95)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '10px' }} itemStyle={{ fontWeight: 600, fontSize: '11px', color: '#94A3B8' }} />
                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '9px', fontWeight: 600, paddingTop: '6px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <AnimatedNum value={metrics.ltv_cac} suffix="x" decimals={1} className="text-2xl font-bold text-text-primary" />
              <p className="text-[8px] font-bold text-text-muted uppercase tracking-widest mt-0.5">Ratio</p>
            </div>
          </div>
        </div>

        {/* Runway Survival Gauge */}
        <div className="glass-card p-5 animate-fade-in-up stagger-6" style={{ animationFillMode: 'both' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>Survival Gauge</h3>
              <p className="text-[10px] font-medium text-text-muted mt-0.5">36-month horizon</p>
            </div>
            <Gauge className="w-4 h-4 text-text-muted" />
          </div>
          <div className="h-[180px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%" cy="50%" innerRadius="55%" outerRadius="80%"
                barSize={10}
                data={[{ name: 'Runway', value: Math.min(metrics.runway, 36), fill: metrics.runway >= 12 ? '#00D68F' : metrics.runway >= 6 ? '#FFD666' : '#FF6B6B' }]}
                startAngle={180} endAngle={-180}
              >
                <RadialBar dataKey="value" cornerRadius={5} background={{ fill: 'rgba(148,163,184,0.04)' }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute text-center pointer-events-none">
              <AnimatedNum value={metrics.runway} suffix="" decimals={1} className="text-2xl font-bold text-text-primary" />
              <p className="text-[8px] font-bold text-text-muted uppercase tracking-widest">Months</p>
            </div>
          </div>
          {/* Risk legend */}
          <div className="flex justify-between text-[8px] font-bold text-text-muted px-1 mt-1">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-signal-loss" />Critical &lt;6</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-signal-caution" />Caution 6-12</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-signal-profit" />Stable 12+</span>
          </div>
        </div>
      </div>

      {/* ── Row 4: Insight Strip ── */}
      <div className="glass-card p-4 animate-fade-in-up" style={{ animationFillMode: 'both', animationDelay: '350ms' }}>
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-3.5 h-3.5 text-brand-orange" />
          <h3 className="text-xs font-bold text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>AI Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {[
            {
              icon: metrics.runway >= 12 ? CheckCircle2 : AlertTriangle,
              color: metrics.runway >= 12 ? '#00D68F' : '#FF6B6B',
              text: metrics.runway >= 12
                ? `${metrics.runway.toFixed(0)} months of runway gives you strong negotiating power for your next round.`
                : `Only ${metrics.runway.toFixed(1)} months runway remaining. Initiate fundraise conversations immediately.`,
            },
            {
              icon: metrics.ltv_cac >= 3 ? TrendingUp : TrendingDown,
              color: metrics.ltv_cac >= 3 ? '#00D68F' : '#FFD666',
              text: metrics.ltv_cac >= 3
                ? `LTV:CAC of ${metrics.ltv_cac.toFixed(1)}x signals strong product-market fit. Consider increasing acquisition spend.`
                : `LTV:CAC at ${metrics.ltv_cac.toFixed(1)}x — focus on retention and reducing acquisition costs before scaling.`,
            },
            {
              icon: Activity,
              color: '#F2994A',
              text: `At $${(data.revenue/1000).toFixed(0)}k MRR with ${metrics.gross_margin}% gross margins, you're ${monthlyProfit >= 0 ? 'operating profitably' : `burning $${(Math.abs(monthlyProfit)/1000).toFixed(0)}k/mo net`}.`,
            },
          ].map((insight, i) => {
            const Icon = insight.icon;
            return (
              <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg" style={{ background: 'rgba(10,16,32,0.3)' }}>
                <Icon className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: insight.color }} />
                <p className="text-[10px] text-text-secondary leading-relaxed font-medium">{insight.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
