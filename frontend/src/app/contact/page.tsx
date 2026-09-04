'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = 'Valid work email is required.';
    if (!formData.message.trim()) newErrors.message = 'Message content is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[var(--paper)] flex flex-col justify-between">
      <div>
        <Header />

        <main className="max-w-5xl mx-auto px-6 py-12">
          <div className="mb-8 space-y-2">
            <h1 className="text-[24px] font-semibold text-[var(--ink)] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Contact & Inquiries
            </h1>
            <p className="text-[13px] text-[var(--ink-muted)]">
              Direct line to our finance product team and technical support engineers.
            </p>
          </div>

          <div className="border-t border-[var(--line)] mb-10" />

          {/* Desktop Two-Column Split Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            {/* Left Column: Direct Contact Info (Plain Text) */}
            <div className="md:col-span-5 space-y-6 text-[13px] text-[var(--ink)]">
              <div>
                <h3 className="font-semibold text-[var(--ink)] uppercase tracking-wider text-[11px] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                  Contact Email
                </h3>
                <p className="text-[var(--ink-muted)] font-mono">
                  <a href="mailto:info@lumenxo.com" className="hover:underline text-[var(--ink)]">
                    info@lumenxo.com
                  </a>
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[var(--ink)] uppercase tracking-wider text-[11px] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                  Response SLA
                </h3>
                <p className="text-[var(--ink-muted)]">
                  All technical and model inquiries receive a response within 2 hours during market hours (9:00 AM – 6:00 PM EST).
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[var(--ink)] uppercase tracking-wider text-[11px] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                  Institutional & Venture Partners
                </h3>
                <p className="text-[var(--ink-muted)] leading-relaxed">
                  For venture capital firms, venture studios, or CFO advisory practices seeking multi-portfolio deployment, specify your portfolio headcount in the message or write directly to{' '}
                  <a href="mailto:info@lumenxo.com" className="font-mono text-[var(--ink)] underline">
                    info@lumenxo.com
                  </a>
                  .
                </p>
              </div>
            </div>

            {/* Right Column: Command-Style Minimal Form */}
            <div className="md:col-span-7 card p-6 bg-[var(--surface)] border border-[var(--line)]">
              {submitted ? (
                <div className="py-8 space-y-3">
                  <h3 className="text-[15px] font-semibold text-[var(--accent)]" style={{ fontFamily: 'var(--font-display)' }}>
                    Inquiry Received
                  </h3>
                  <p className="text-[13px] text-[var(--ink-muted)] leading-relaxed">
                    Thank you, {formData.name}. Our financial product team has logged your query and will reply to <span className="font-mono text-[var(--ink)]">{formData.email}</span> within our 2-hour SLA.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label htmlFor="name" className="block text-[12px] text-[var(--ink-muted)]">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full instrument-input ${errors.name ? 'border-[var(--risk-red)] bg-[var(--risk-red-soft)]' : ''}`}
                      placeholder="Jane Doe"
                    />
                    {errors.name && (
                      <p className="text-[11px] text-[var(--risk-red)] mt-0.5">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="email" className="block text-[12px] text-[var(--ink-muted)]">
                      Work Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full instrument-input ${errors.email ? 'border-[var(--risk-red)] bg-[var(--risk-red-soft)]' : ''}`}
                      placeholder="jane@company.com"
                    />
                    {errors.email && (
                      <p className="text-[11px] text-[var(--risk-red)] mt-0.5">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="company" className="block text-[12px] text-[var(--ink-muted)]">
                      Company / Fund Name
                    </label>
                    <input
                      id="company"
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full instrument-input"
                      placeholder="Acme Ventures"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="message" className="block text-[12px] text-[var(--ink-muted)]">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={`w-full instrument-input resize-none ${errors.message ? 'border-[var(--risk-red)] bg-[var(--risk-red-soft)]' : ''}`}
                      placeholder="Specify your inquiry or portfolio headcount..."
                    />
                    {errors.message && (
                      <p className="text-[11px] text-[var(--risk-red)] mt-0.5">{errors.message}</p>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="btn-subtle w-full text-[12px] font-medium py-2 text-[var(--ink)]"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
