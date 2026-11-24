'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function NewsFlashSidebarNewsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <div className="rounded-[8px] overflow-hidden bg-[#020a1c] text-white border border-white/10">
      <div className="h-[4px] w-full bg-[#cc0000]" />
      <div className="p-6 flex flex-col gap-3">
        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#cc0000]">
          Executive Briefing
        </span>
        <h3 className="nf-font-display text-[20px] leading-[1.25] font-bold tracking-[-0.015em] text-white">
          Morning Intelligence from Entrepreneur Mirror
        </h3>
        <p className="text-[13px] leading-[1.55] text-white/70">
          Daily dispatches on founders, global markets, leadership profiles, and emerging technology.
        </p>

        {subscribed ? (
          <div className="mt-2 flex items-center gap-2 rounded-md bg-white/10 px-3.5 py-2.5 text-[13px] text-white">
            <CheckCircle2 className="w-4 h-4 text-[#cc0000] flex-shrink-0" />
            <span>Subscribed to the Entrepreneur Mirror briefing.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-2.5">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="nf-footer-input w-full h-10 px-3.5 rounded-md text-[13px]"
            />
            <button
              type="submit"
              className="w-full h-10 rounded-md bg-[#cc0000] hover:bg-[#b30000] text-white text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Subscribe</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

