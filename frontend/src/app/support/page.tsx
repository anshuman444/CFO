'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      title: 'Getting Started',
      articles: [
        { title: 'Connecting your bank & accounting software', snippet: 'How live sync connects with your general ledger.' },
        { title: 'Baseline model parameter configuration', snippet: 'Setting default headcount, revenue, and burn baselines.' },
        { title: 'Navigating the Executive Overview', snippet: 'Understanding the 5 KPI tiles, gauges, and ledgers.' },
      ],
    },
    {
      title: 'Understanding Your Metrics',
      articles: [
        {
          title: 'Cash Runway & Zero-Cash Date',
          snippet: 'Runway = Cash ÷ Net Monthly Burn. Zero-cash date projects when cash balance hits zero based on net monthly burn trends.',
        },
        {
          title: 'Burn Multiple (SaaS Benchmark)',
          snippet: 'Burn Multiple = Net Burn ÷ Net New ARR. Measures how much cash you burn to generate $1 of new ARR. Median is 1.4x; under 1.5x is top-quartile.',
        },
        {
          title: 'Gross Margin & Unit Payback',
          snippet: 'Gross Margin = (Revenue - COGS) ÷ Revenue. Top 25% SaaS quartile targets >70%. Higher margins reduce burn speed.',
        },
        {
          title: 'Rule of 40 Calculation',
          snippet: 'Rule of 40 = YoY Revenue Growth Rate (%) + Free Cash Flow Margin (%). Scores above 40% represent elite capital efficiency.',
        },
      ],
    },
    {
      title: 'Scenario Modeling & Levers',
      articles: [
        { title: 'Applying Base, Conservative, and Aggressive scenarios', snippet: 'How scenario matrix pills reweight growth rate and churn assumptions.' },
        { title: 'Using Quick Levers for emergency cash preservation', snippet: 'Toggling hiring freezes, paid acq cuts, and infra delays.' },
        { title: 'Adjusting projection time horizons (6M to 24M)', snippet: 'Filtering chart window slices without layout shift.' },
      ],
    },
    {
      title: 'AI Advisory & Board Memos',
      articles: [
        { title: 'Prompting your Virtual CFO for strategic guidance', snippet: 'Best practices for asking about hiring capacity, fundraise timing, and runway sensitivity.' },
        { title: 'Generating and exporting Board Memos', snippet: 'One-click PDF print briefs and markdown executive memos.' },
      ],
    },
    {
      title: 'Account & Data Governance',
      articles: [
        { title: 'Data encryption & security standards', snippet: 'AES-256 encryption at rest and read-only financial data access.' },
        { title: 'Managing workspace access & session history', snippet: 'Deleting past advisory sessions and managing context persistence.' },
      ],
    },
  ];

  const filteredCategories = categories.map((cat) => ({
    ...cat,
    articles: cat.articles.filter(
      (art) =>
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.snippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((cat) => cat.articles.length > 0);

  return (
    <div className="min-h-screen bg-[var(--paper)] flex flex-col justify-between">
      <div>
        <Header />

        <main className="max-w-4xl mx-auto px-6 py-12 space-y-10">
          {/* Header & Search Bar */}
          <div className="space-y-4">
            <h1 className="text-[24px] font-semibold text-[var(--ink)] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Support & Documentation
            </h1>
            <p className="text-[13px] text-[var(--ink-muted)]">
              Comprehensive reference guides for metrics, financial formulas, and model parameterization. For direct assistance, email{' '}
              <a href="mailto:support@lumenxo.com" className="font-mono text-[var(--ink)] underline">
                support@lumenxo.com
              </a>
              .
            </p>

            {/* Plain Bordered Search Bar — No Icon Soup */}
            <div className="pt-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documentation or metrics (e.g. burn multiple, runway, Rule of 40)..."
                className="w-full instrument-input py-2.5 px-3.5 text-[13px] bg-[var(--surface)] border border-[var(--line)]"
              />
            </div>
          </div>

          <div className="border-t border-[var(--line)]" />

          {/* Documentation Categories */}
          <div className="space-y-10">
            {filteredCategories.length === 0 ? (
              <div className="py-8 text-center text-[13px] text-[var(--ink-muted)]">
                No documentation matches "{searchQuery}".
              </div>
            ) : (
              filteredCategories.map((cat, catIdx) => (
                <div key={cat.title} className={catIdx > 0 ? 'pt-8 border-t border-[var(--line)]' : ''}>
                  <h2 className="text-[14px] font-semibold text-[var(--ink)] tracking-tight mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                    {cat.title}
                  </h2>

                  <div className="space-y-4">
                    {cat.articles.map((art) => (
                      <div key={art.title} className="space-y-1">
                        <h3 className="text-[13px] font-medium text-[var(--ink)] hover:underline cursor-pointer">
                          {art.title}
                        </h3>
                        <p className="text-[12px] text-[var(--ink-muted)] leading-relaxed font-sans">
                          {art.snippet}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quiet Bottom Link */}
          <div className="pt-8 border-t border-[var(--line)] text-[12px] text-[var(--ink-muted)] flex items-center justify-between">
            <span>
              Direct Support Email:{' '}
              <a href="mailto:support@lumenxo.com" className="font-mono text-[var(--ink)] font-semibold underline">
                support@lumenxo.com
              </a>
            </span>
            <Link href="/contact" className="text-[var(--ink)] font-medium underline">
              Contact Form & Inquiries →
            </Link>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
