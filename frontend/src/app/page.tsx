'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  CreditCard,
  PieChart,
  Shield,
  Zap,
  TrendingUp,
  Activity,
  Layers,
  Lock,
  BarChart3,
  Sliders,
  Users,
  Code,
  FileText,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Sample preview chart data for the centerpiece instrument view
const previewChartData = [
  { month: 'Jan', spend: 35000, revenue: 18000 },
  { month: 'Feb', spend: 42000, revenue: 22000 },
  { month: 'Mar', spend: 38000, revenue: 28000 },
  { month: 'Apr', spend: 45000, revenue: 34000 },
  { month: 'May', spend: 39000, revenue: 41000 },
  { month: 'Jun', spend: 52000, revenue: 58000 },
  { month: 'Jul', spend: 48000, revenue: 65000 },
];

export default function DarkElectricBlueLandingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const dashboardRef = useRef<HTMLDivElement>(null);

  // GSAP Smooth Scroll Reveal for Centerpiece Hero Dashboard
  useEffect(() => {
    if (dashboardRef.current) {
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }
      gsap.fromTo(
        dashboardRef.current,
        { scale: 0.93, y: 40, opacity: 0.7 },
        {
          scale: 1,
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
        }
      );
    }
  }, []);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-[#F3F5F8] font-sans antialiased selection:bg-[#2563EB]/30 selection:text-white overflow-x-hidden relative">
      
      {/* ═══ GLOBAL FULL-SCREEN AURORA VEIL & SPARKLING DOT GRID BACKGROUND CANVAS ═══ */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Veil 1: Top Center Sapphire Blue Wave */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1300px] h-[750px] aurora-veil-1 opacity-90" />

        {/* Veil 2: Left Side Indigo Ribbon */}
        <div className="absolute top-[25%] left-[-15%] w-[950px] h-[800px] aurora-veil-2 opacity-85" />

        {/* Veil 3: Right Side Cyan Shimmer */}
        <div className="absolute top-[15%] right-[-15%] w-[950px] h-[800px] aurora-veil-3 opacity-85" />

        {/* Veil 4: Bottom Section Flow */}
        <div className="absolute bottom-[-10%] left-1/3 w-[1100px] h-[650px] aurora-veil-1 opacity-75" />

        {/* Shining Dot Matrix Grid Pattern */}
        <div className="absolute inset-0 bg-dot-grid-shining opacity-90" />
      </div>

      {/* ── HEADER ── */}
      <div className="relative z-50">
        <Header />
      </div>

      {/* ── HERO SECTION WITH AURORA VEIL & SPARKLING DOT GRID EFFECT ── */}
      <section className="pt-32 pb-20 px-6 lg:px-12 text-center max-w-5xl mx-auto space-y-8 relative z-10">

        {/* Eyebrow Pill Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/50 text-xs font-semibold uppercase tracking-widest text-blue-400 shadow-[0_0_25px_rgba(37,99,235,0.4)] backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span>AI Financial Engine</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-7xl font-bold tracking-tight leading-[1.1] font-display max-w-4xl mx-auto">
          Financial Infrastructure for <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-blue-400 to-cyan-300">Company Spend</span>
        </h1>

        {/* Subhead */}
        <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-sm">
          LumenXo unifies live runway tracking, burn multiple analytics, and AI advisory in one system, so your finance team can focus on strategy instead of spreadsheets.
        </p>

        {/* CTA Group */}
        <div className="pt-2 flex flex-col items-center gap-3">
          <Link
            href="/dashboard"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm px-7 py-3 rounded-[6px] transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(37,99,235,0.55)] hover:shadow-[0_0_40px_rgba(37,99,235,0.75)]"
          >
            Open CFO Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* ── CENTERPIECE HERO DASHBOARD ── */}
        <div className="relative pt-10 max-w-5xl mx-auto">

          {/* GSAP CENTERPIECE DASHBOARD CARD */}
          <div ref={dashboardRef} className="relative z-10">
            <div className="rounded-2xl border border-blue-500/40 bg-[#0F131D]/90 p-4 sm:p-6 shadow-[0_10px_60px_-5px_rgba(37,99,235,0.4)] text-left overflow-hidden relative backdrop-blur-md">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Mini Sidebar */}
                <div className="hidden lg:block lg:col-span-3 space-y-4 border-r border-white/10 pr-4 text-xs font-medium text-gray-400">
                  <div className="flex items-center gap-2 text-white font-bold pb-2 border-b border-white/10 font-display">
                    <img src="/logo.png" alt="LumenXo Logo" className="w-5 h-5 object-contain drop-shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
                    LumenXo CFO
                  </div>
                  <div className="space-y-1">
                    <div className="px-2.5 py-1.5 rounded-md bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/40 flex items-center gap-2">
                      <LayoutDashboard className="w-3.5 h-3.5" /> Overview
                    </div>
                    <div className="px-2.5 py-1.5 rounded-md hover:bg-white/5 flex items-center gap-2 transition-colors">
                      <CreditCard className="w-3.5 h-3.5" /> Runway Engine
                    </div>
                    <div className="px-2.5 py-1.5 rounded-md hover:bg-white/5 flex items-center gap-2 transition-colors">
                      <PieChart className="w-3.5 h-3.5" /> Burn Analytics
                    </div>
                    <div className="px-2.5 py-1.5 rounded-md hover:bg-white/5 flex items-center gap-2 transition-colors">
                      <Zap className="w-3.5 h-3.5" /> AI Advisory
                    </div>
                    <div className="px-2.5 py-1.5 rounded-md hover:bg-white/5 flex items-center gap-2 transition-colors">
                      <FileText className="w-3.5 h-3.5" /> Board Memos
                    </div>
                  </div>
                </div>

                {/* Main Preview Content */}
                <div className="lg:col-span-9 space-y-5">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <h3 className="text-sm font-bold text-white font-display">Executive Overview</h3>
                    <div className="px-2.5 py-1 rounded bg-[#161C2B] border border-white/10 text-xs text-gray-400 flex items-center gap-1">
                      Last 30 days <ChevronDown className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Top 3 Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-[#141926] border border-white/10 shadow-sm">
                      <span className="text-xs text-gray-400 block font-medium">Total Cash</span>
                      <span className="text-xl font-bold text-white font-display block mt-1">₹3,20,00,000</span>
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded mt-1.5 inline-block border border-emerald-500/20">
                        +12.4% MoM
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#141926] border border-white/10 shadow-sm">
                      <span className="text-xs text-gray-400 block font-medium">Cash Runway</span>
                      <span className="text-xl font-bold text-white font-display block mt-1">14.2 Mo</span>
                      <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded mt-1.5 inline-block border border-blue-500/20">
                        In Progress
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#141926] border border-white/10 shadow-sm">
                      <span className="text-xs text-gray-400 block font-medium">Gross Margin</span>
                      <span className="text-xl font-bold text-white font-display block mt-1">70%</span>
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded mt-1.5 inline-block border border-emerald-500/20">
                        ✓ Optimal
                      </span>
                    </div>
                  </div>

                  {/* Chart & Category Breakdown Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    <div className="lg:col-span-7 bg-[#141926] p-3.5 rounded-xl border border-white/10">
                      <div className="text-xs font-semibold text-gray-400 mb-2">Monthly Spend Trajectory</div>
                      <div className="h-[140px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={previewChartData}>
                            <defs>
                              <linearGradient id="spendGradBlue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.6} />
                                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#8E96A4', fontSize: 10 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8E96A4', fontSize: 10 }} tickFormatter={(v) => `₹${v/1000}k`} width={38} />
                            <Area type="monotone" dataKey="spend" stroke="#3B82F6" strokeWidth={2.5} fill="url(#spendGradBlue)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="lg:col-span-5 bg-[#141926] p-3.5 rounded-xl border border-white/10 space-y-2.5 text-xs">
                      <div className="font-semibold text-gray-400">Spend by Category</div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#3B82F6] shadow-[0_0_6px_#3B82F6]" /> Headcount</span>
                          <span className="font-mono text-white font-bold">₹11.8L</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#A855F7] shadow-[0_0_6px_#A855F7]" /> Cloud & Infra</span>
                          <span className="font-mono text-white font-bold">₹7.6L</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#06B6D4] shadow-[0_0_6px_#06B6D4]" /> Marketing</span>
                          <span className="font-mono text-white font-bold">₹5.1L</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#8E96A4]" /> Operations</span>
                          <span className="font-mono text-white font-bold">₹3.8L</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: THE PLATFORM ── */}
      <section id="platform" className="py-24 px-6 lg:px-12 max-w-6xl mx-auto space-y-12 relative z-10">
        <div className="text-center space-y-4">
          <span className="px-4 py-1.5 rounded-full bg-blue-950/50 border border-blue-500/40 text-xs font-semibold uppercase tracking-widest text-blue-400 backdrop-blur-md">
            The Platform
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white font-display">
            Everything Your Team Needs to <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-400">Control Spend</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-base">
            Break free from disconnected spreadsheets and tools. Manage expenses, budgets, approvals, and reporting from one connected system.
          </p>
        </div>

        {/* 4 Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-2xl bg-[#0F131D]/90 border border-white/10 hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(37,99,235,0.2)] transition-all space-y-4 relative group backdrop-blur-md">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-[0_0_12px_rgba(37,99,235,0.4)]">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase border border-blue-500/30">NEW</span>
            </div>
            <h3 className="text-xl font-bold text-white font-display">Runway & Cash Forecasting</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Every transaction is automatically captured, categorized, and checked for anomalies as it happens, projecting zero-cash dates.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#0F131D]/90 border border-white/10 hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(37,99,235,0.2)] transition-all space-y-4 group backdrop-blur-md">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-[0_0_12px_rgba(37,99,235,0.4)]">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white font-display">Emergency Scenario Levers</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Set flexible budgets by team or vendor and watch usage update live before you go over. Test hiring freezes & spend cuts in 1-click.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#0F131D]/90 border border-white/10 hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(37,99,235,0.2)] transition-all space-y-4 group backdrop-blur-md">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-[0_0_12px_rgba(37,99,235,0.4)]">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white font-display">AI CFO Advisory Stream</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Get 24/7 strategic commentary based on live general ledger metrics. Ask questions about hiring, burn, and fundraise timing.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#0F131D]/90 border border-white/10 hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(37,99,235,0.2)] transition-all space-y-4 relative group backdrop-blur-md">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-[0_0_12px_rgba(37,99,235,0.4)]">
                <FileText className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-gray-300 text-[10px] font-bold uppercase border border-white/10">IN BETA</span>
            </div>
            <h3 className="text-xl font-bold text-white font-display">Board Memo Generator</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Turn every metric into a clear, shareable PDF or markdown report for investors without spending a weekend in spreadsheets.
            </p>
          </div>
        </div>

        {/* Compliance Footer Strip */}
        <div className="pt-6 border-t border-white/10 text-center space-y-3">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
            Independently audited and compliant with standards enterprises trust
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-gray-400">
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-blue-400" /> SOC 2 Type II</span>
            <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-blue-400" /> PCI DSS Level 1</span>
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-blue-400" /> ISO 27001</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-400" /> GDPR</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-blue-400" /> CCPA</span>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: FEATURES GRID ── */}
      <section id="features" className="py-24 px-6 lg:px-12 bg-[#0A0D14]/80 border-y border-white/10 relative z-10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto space-y-14">
          <div className="text-center space-y-4">
            <span className="px-4 py-1.5 rounded-full bg-blue-950/50 border border-blue-500/40 text-xs font-semibold uppercase tracking-widest text-blue-400">
              Features
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white font-display">
              One Platform for <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-400">Every Spend Decision</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-base">
              Tools are part of our business and we make sure that the products we create incorporate all the features you need.
            </p>
          </div>

          {/* 3x3 Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Automatic Categorization', desc: 'Every transaction is sorted into the right category the moment it happens, no manual tagging required.', icon: Layers },
              { title: 'Live Spend Tracking', desc: 'Watch spend update in real time across every team, card, and vendor.', icon: Activity },
              { title: 'Anomaly Detection', desc: 'Unusual charges and duplicate subscriptions get flagged automatically before they become a problem.', icon: Shield },
              { title: 'Multi-Entity Support', desc: 'Manage budgets and spend across multiple entities, subsidiaries, or currencies from one dashboard.', icon: CreditCard },
              { title: 'Bank-Grade Security', desc: 'End-to-end encryption and SOC 2 controls keep every transaction and every login protected.', icon: Lock },
              { title: 'Spend Analytics', desc: 'Real-time dashboards turn raw transactions into decisions your team can act on.', icon: TrendingUp },
              { title: 'Custom Approval Rules', desc: 'Configure approval chains by department, amount, or vendor without writing a line of code.', icon: Sliders },
              { title: 'Team Collaboration', desc: 'Give finance, ops, and department leads shared visibility into the numbers that matter to them.', icon: Users },
              { title: 'Open API & Integrations', desc: 'Connect LumenXo to your accounting, HR, and card provider stack with a fully documented REST API.', icon: Code },
            ].map((feat, i) => {
              const IconComp = feat.icon;
              return (
                <div key={i} className="p-6 rounded-2xl bg-[#0F131D]/90 border border-white/10 hover:border-blue-500/40 transition-all space-y-3 backdrop-blur-md">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-[0_0_12px_rgba(37,99,235,0.3)]">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-white font-display">{feat.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-6 lg:px-12 max-w-6xl mx-auto space-y-14 relative z-10">
        <div className="text-center space-y-4">
          <span className="px-4 py-1.5 rounded-full bg-blue-950/50 border border-blue-500/40 text-xs font-semibold uppercase tracking-widest text-blue-400">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white font-display">
            From Scattered Accounts to <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-400">Full Financial Clarity</span>
          </h2>
        </div>

        {/* 4 Step Process Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { num: '✓', title: 'Connect', desc: 'Link your bank accounts, cards, and existing tools in minutes, not months.', isCheck: true },
            { num: '✓', title: 'Configure', desc: 'Set your budgets, spend categories, and approval workflows once.', isCheck: true },
            { num: '3', title: 'Automate', desc: 'Expense categorization, budget alerts, and reports run without manual work.', isCheck: false },
            { num: '4', title: 'Scale', desc: 'Add teams, departments, and spend volume without adding headcount.', isCheck: false },
          ].map((step, i) => (
            <div key={i} className="p-6 rounded-2xl bg-[#0F131D]/90 border border-white/10 space-y-4 backdrop-blur-md">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                step.isCheck
                  ? 'bg-gradient-to-tr from-[#2563EB] to-[#60A5FA] text-white shadow-[0_0_16px_rgba(37,99,235,0.5)]'
                  : 'bg-white/10 text-gray-300 border border-white/10'
              }`}>
                {step.num}
              </div>
              <h3 className="text-lg font-bold text-white font-display">{step.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <Link
            href="/dashboard"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs px-6 py-2.5 rounded-[6px] transition-all inline-flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          >
            Open CFO Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* ── SECTION 5: PRICING ── */}
      <section id="pricing" className="py-24 px-6 lg:px-12 bg-[#0A0D14]/80 border-t border-white/10 relative z-10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <span className="px-4 py-1.5 rounded-full bg-blue-950/50 border border-blue-500/40 text-xs font-semibold uppercase tracking-widest text-blue-400">
              Pricing
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white font-display">
              Pricing That Scales with Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-400">Finance Team</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-base">
              Deploy and scale when you are ready. Every plan includes the core LumenXo platform, with no setup fees and no lock-in.
            </p>

            {/* Toggle */}
            <div className="pt-4 flex items-center justify-center gap-3">
              <div className="p-1 rounded-full bg-[#0F131D] border border-white/10 flex items-center gap-1 text-xs">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-1.5 rounded-full font-semibold transition-all ${
                    billingCycle === 'monthly' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-gray-400'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-4 py-1.5 rounded-full font-semibold transition-all ${
                    billingCycle === 'yearly' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-gray-400'
                  }`}
                >
                  Yearly
                </button>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold border border-blue-500/30">
                Save 20%
              </span>
            </div>
          </div>

          {/* 3 Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Starter */}
            <div className="p-8 rounded-2xl bg-[#0F131D]/90 border border-white/10 flex flex-col justify-between space-y-6 backdrop-blur-md">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white font-display">Starter</h3>
                <div>
                  <span className="text-4xl font-bold text-white font-display">
                    ₹{billingCycle === 'yearly' ? '2,300' : '2,900'}
                  </span>
                  <span className="text-xs text-gray-400">/mo</span>
                  <p className="text-[11px] text-gray-500 mt-0.5">billed {billingCycle}</p>
                </div>
                <p className="text-xs text-gray-400">For small teams putting spend on autopilot.</p>
                <div className="space-y-2 pt-2 text-xs text-gray-300">
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Up to 10 users</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Expense tracking & receipts</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Monthly budgets</div>
                  <div className="flex items-center gap-2 text-gray-600"><span className="w-3.5 h-3.5 text-center">✕</span> Integrations</div>
                  <div className="flex items-center gap-2 text-gray-600"><span className="w-3.5 h-3.5 text-center">✕</span> Priority support</div>
                  <div className="flex items-center gap-2 text-gray-600"><span className="w-3.5 h-3.5 text-center">✕</span> SSO and SAML</div>
                </div>
              </div>
              <Link
                href="/dashboard"
                className="w-full text-center py-2.5 rounded-[6px] bg-white/5 border border-white/10 text-white font-semibold text-xs hover:bg-white/10 transition-all"
              >
                Get Started &gt;
              </Link>
            </div>

            {/* Pro (MOST POPULAR - ELECTRIC BLUE HIGHLIGHT) */}
            <div className="p-8 rounded-2xl bg-[#131926]/95 border-2 border-blue-500 shadow-[0_0_35px_rgba(37,99,235,0.3)] flex flex-col justify-between space-y-6 relative backdrop-blur-md">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white font-display">Pro</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(37,99,235,0.5)]">
                    MOST POPULAR
                  </span>
                </div>
                <div>
                  <span className="text-4xl font-bold text-white font-display">
                    ₹{billingCycle === 'yearly' ? '6,300' : '7,900'}
                  </span>
                  <span className="text-xs text-gray-400">/mo</span>
                  <p className="text-[11px] text-gray-500 mt-0.5">billed {billingCycle}</p>
                </div>
                <p className="text-xs text-gray-300">For growing finance teams that need control.</p>
                <div className="space-y-2 pt-2 text-xs text-gray-200">
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Unlimited users</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Approval workflows</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Multi entity and currency</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> All integrations</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Advanced reporting</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Priority support</div>
                </div>
              </div>
              <Link
                href="/dashboard"
                className="w-full text-center py-2.5 rounded-[6px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all"
              >
                Get Started &gt;
              </Link>
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-2xl bg-[#0F131D]/90 border border-white/10 flex flex-col justify-between space-y-6 backdrop-blur-md">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white font-display">Enterprise</h3>
                <div>
                  <span className="text-3xl font-bold text-white font-display">Custom</span>
                </div>
                <p className="text-xs text-gray-400">For finance organizations operating at scale.</p>
                <div className="space-y-2 pt-2 text-xs text-gray-300">
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Everything in Pro</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Slack channel</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Dedicated success manager</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Custom SLAs and uptime</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Advanced audit controls</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> SSO and SAML</div>
                </div>
              </div>
              <Link
                href="/contact"
                className="w-full text-center py-2.5 rounded-[6px] bg-white/5 border border-white/10 text-white font-semibold text-xs hover:bg-white/10 transition-all"
              >
                Talk to sales &gt;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: FAQ ACCORDION ── */}
      <section id="faq" className="py-24 px-6 lg:px-12 max-w-4xl mx-auto space-y-10 relative z-10">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mx-auto shadow-[0_0_16px_rgba(37,99,235,0.4)]">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-display">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-gray-400">
            Everything you need to know about LumenXo CFO, security, formulas, and advisory.
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'How does LumenXo compute cash runway and zero-cash dates?',
              a: 'Runway is computed in real time as Net Monthly Burn divided by Total Cash in Bank. Zero-cash dates project the exact calendar day cash reaches zero based on your active burn trends and growth rates.',
            },
            {
              q: 'Is my general ledger and bank data secure?',
              a: 'Yes. LumenXo uses end-to-end AES-256 encryption at rest and TLS 1.3 in transit. We maintain read-only access with SOC 2 Type II audited protocols.',
            },
            {
              q: 'How do Emergency Quick Levers work during scenario modeling?',
              a: 'Quick Levers allow founders to toggle hypothetical hiring freezes, paid acquisition cuts, or cloud expense delays in 1-click. All metrics, zero-cash dates, and projection lines recompute instantly in memory.',
            },
            {
              q: 'Can I export board memos for investor meetings?',
              a: 'Yes. Clicking "Generate Board Memo" creates a clean, printable PDF report and Markdown brief summarizing your core metrics, active scenario deltas, and investor talking points.',
            },
            {
              q: 'How does the AI CFO Advisory stream generate recommendations?',
              a: 'The AI CFO analyzes your live revenue, burn multiple, gross margin, and Rule of 40 score to provide actionable, numbers-driven strategic advice set in an un-bubbled editorial format.',
            },
          ].map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-[#0F131D]/90 border border-white/10 overflow-hidden transition-all hover:border-blue-500/40 backdrop-blur-md"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-white font-display text-sm hover:bg-white/5 transition-colors"
                >
                  <span>{item.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-blue-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-gray-400 leading-relaxed border-t border-white/10 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
