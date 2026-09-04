'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#05070B] border-t border-white/10 py-12 px-8 select-none text-xs">
      <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Column 1: Product */}
        <div className="space-y-2">
          <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] font-display">
            Product
          </h4>
          <ul className="space-y-1.5 text-gray-400">
            <li>
              <Link href="/dashboard" className="hover:text-[var(--accent)] transition-colors">
                Executive Overview
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-[var(--accent)] transition-colors">
                Runway & Cash Projections
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-[var(--accent)] transition-colors">
                Scenario Matrix & Levers
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-[var(--accent)] transition-colors">
                AI CFO Advisory Stream
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2: Documentation & Support */}
        <div className="space-y-2">
          <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] font-display">
            Support
          </h4>
          <ul className="space-y-1.5 text-gray-400">
            <li>
              <Link href="/support" className="hover:text-[var(--accent)] transition-colors">
                Understanding Metrics
              </Link>
            </li>
            <li>
              <Link href="/support" className="hover:text-[var(--accent)] transition-colors">
                Rule of 40 Benchmark Guide
              </Link>
            </li>
            <li>
              <Link href="/support" className="hover:text-[var(--accent)] transition-colors">
                Board Memo Generation
              </Link>
            </li>
            <li>
              <Link href="/support" className="hover:text-[var(--accent)] transition-colors">
                Data Integration & API
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Company */}
        <div className="space-y-2">
          <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] font-display">
            Company
          </h4>
          <ul className="space-y-1.5 text-gray-400">
            <li>
              <Link href="/contact" className="hover:text-[var(--accent)] transition-colors">
                Contact & Support
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[var(--accent)] transition-colors">
                Institutional & Partner Inquiries
              </Link>
            </li>
            <li>
              <span className="text-gray-500">SLA: 2-hour response window</span>
            </li>
          </ul>
        </div>

        {/* Column 4: Legal & System */}
        <div className="space-y-2">
          <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] font-display">
            Governance & Privacy
          </h4>
          <ul className="space-y-1.5 text-gray-400">
            <li>
              <span className="text-gray-400">SOC 2 Type II Audited</span>
            </li>
            <li>
              <span className="text-gray-400">AES-256 Encryption at Rest</span>
            </li>
            <li>
              <span className="text-gray-500">© {new Date().getFullYear()} LumenXo Technologies</span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
