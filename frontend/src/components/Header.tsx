'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-8 py-3.5 flex justify-between items-center bg-[#07090E]/90 backdrop-blur-md border-b border-white/10 select-none">
      {/* Left: Quiet Wordmark */}
      <Link href="/" className="flex items-center gap-2.5 group">
        <img
          src="/logo.png"
          alt="LumenXo Logo"
          className="h-7 w-auto object-contain drop-shadow-[0_0_12px_rgba(37,99,235,0.6)] transition-transform group-hover:scale-105"
        />
        <div className="flex items-baseline gap-1">
          <span className="text-[15px] font-bold tracking-tight text-[var(--ink)] font-display">
            LumenXo
          </span>
          <span className="text-[15px] font-bold tracking-tight text-[#3B82F6] font-display">
            CFO
          </span>
        </div>
      </Link>

      {/* Center-Right Nav Links & CFO Button */}
      <div className="flex items-center gap-7">
        <nav className="hidden md:flex items-center gap-6 text-[13px] text-[var(--ink-muted)] font-medium">
          <Link
            href="/"
            className={`hover:text-white transition-colors ${
              pathname === '/' ? 'text-white font-semibold' : ''
            }`}
          >
            Product
          </Link>
          <Link
            href="/support"
            className={`hover:text-white transition-colors ${
              pathname === '/support' ? 'text-white font-semibold' : ''
            }`}
          >
            Support
          </Link>
          <Link
            href="/contact"
            className={`hover:text-white transition-colors ${
              pathname === '/contact' ? 'text-white font-semibold' : ''
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* The CFO Button Contract — Solid --accent fill, white text, max 6px radius, no arrow/icon */}
        <Link
          href="/dashboard"
          className="bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] text-[12px] font-semibold px-4 py-1.5 rounded-[6px] transition-all inline-block shadow-[0_0_16px_rgba(37,99,235,0.45)]"
        >
          Open CFO Dashboard
        </Link>
      </div>
    </header>
  );
}
