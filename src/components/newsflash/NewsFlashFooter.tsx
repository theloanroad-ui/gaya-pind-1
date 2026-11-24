'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '@/data/categories';
import { SectionTitle, normalizeCatName } from './NewsFlashPrimitives';

export default function NewsFlashFooter() {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  if (pathname?.startsWith('/admin')) return null;

  const visibleCats = CATEGORIES.filter((c) => c.slug !== 'home' && c.isVisible !== false);
  const half = Math.ceil(visibleCats.length / 2);
  const leftCats = visibleCats.slice(0, half);
  const rightCats = visibleCats.slice(half);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="w-full bg-[#020a1c] text-white mt-auto">
      {/* Exact 5px Crimson #c00 top accent bar matching NewsFlash Footer */}
      <div className="w-full h-[5px] bg-[#cc0000]" />

      <div className="nf-container pt-16 pb-8 flex flex-col gap-16 sm:gap-20">
        {/* Top Area: Newsletter Left (375px) + Multi-column Links Right */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
          {/* Newsletter & Brand Summary */}
          <div className="w-full lg:w-[375px] flex flex-col gap-5">
            <Link
              href="/"
              className="flex items-center gap-2 no-underline group w-fit"
              aria-label="Entrepreneur Mirror Home"
            >
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-[6px] bg-white/10 group-hover:bg-[#cc0000] transition-colors">
                <span className="w-1.5 h-4 rounded-[1px] bg-[#cc0000] group-hover:bg-white transition-colors" />
              </span>
              <span className="text-[22px] font-extrabold tracking-[-0.04em] text-white leading-none lowercase">
                entrepreneur<span className="text-[#cc0000]">.</span>mirror
              </span>
            </Link>

            <SectionTitle
              title="Subscribe to Entrepreneur Mirror"
              showLine={false}
              showViewAll={false}
              dark
            />

            {subscribed ? (
              <div className="flex items-center gap-2.5 p-3.5 rounded-[6px] bg-white/10 border border-white/15 text-[14px] text-white">
                <CheckCircle2 className="w-4 h-4 text-[#cc0000] flex-shrink-0" />
                <span>You&apos;re subscribed to our weekly executive briefing.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="nf-footer-input flex-1 rounded-[6px] px-3.5 py-2.5 text-[14px]"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-[6px] bg-[#cc0000] hover:bg-[#b30000] text-white text-[14px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            <p className="text-[12px] leading-[1.6] text-[#657285]">
              We don&apos;t spam, promised. Curated interviews and global business intelligence, opt out anytime with one click.
            </p>
          </div>

          {/* Right Link Columns: Company + Categories (2 sub-cols) + Social Media */}
          <div className="flex flex-wrap sm:flex-nowrap items-start gap-12 sm:gap-14 lg:gap-16">
            {/* Company Column */}
            <div className="flex flex-col gap-3 min-w-[110px]">
              <SectionTitle
                title="Company"
                showLine={false}
                showViewAll={false}
                dark
              />
              <ul className="flex flex-col gap-2.5 text-[14px]">
                <li>
                  <Link href="/news" className="text-white/85 hover:text-white/55 no-underline transition-colors">
                    Latest News
                  </Link>
                </li>
                <li>
                  <Link href="/category" className="text-white/85 hover:text-white/55 no-underline transition-colors">
                    All Categories
                  </Link>
                </li>
                <li>
                  <Link href="/write-for-us" className="text-white/85 hover:text-white/55 no-underline transition-colors">
                    Write for Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-white/85 hover:text-white/55 no-underline transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-white/85 hover:text-white/55 no-underline transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-white/85 hover:text-white/55 no-underline transition-colors">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categories 2-Subcolumn Block */}
            <div className="flex flex-col gap-3">
              <SectionTitle
                title="Categories"
                showLine={false}
                showViewAll={false}
                dark
              />
              <div className="flex items-start gap-10 sm:gap-12 text-[14px]">
                <ul className="flex flex-col gap-2.5 whitespace-nowrap">
                  {leftCats.map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        href={`/category/${cat.slug}`}
                        className="text-white/85 hover:text-white/55 no-underline transition-colors"
                      >
                        {normalizeCatName(cat.name)}
                      </Link>
                    </li>
                  ))}
                </ul>
                <ul className="flex flex-col gap-2.5 whitespace-nowrap">
                  {rightCats.map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        href={`/category/${cat.slug}`}
                        className="text-white/85 hover:text-white/55 no-underline transition-colors"
                      >
                        {normalizeCatName(cat.name)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Social Media Column */}
            <div className="flex flex-col gap-3 min-w-[100px]">
              <SectionTitle
                title="Social Media"
                showLine={false}
                showViewAll={false}
                dark
              />
              <ul className="flex flex-col gap-2.5 text-[14px]">
                <li>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/85 hover:text-white/55 no-underline transition-colors"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/85 hover:text-white/55 no-underline transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/85 hover:text-white/55 no-underline transition-colors"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/85 hover:text-white/55 no-underline transition-colors"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/85 hover:text-white/55 no-underline transition-colors"
                  >
                    YouTube
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[13px] text-[#657285]">
          <div className="flex items-center gap-2 flex-wrap">
            <span>Copyright</span>
            <span className="w-1 h-1 rounded-full bg-[#657285]" />
            <span>© 2026 Entrepreneur Mirror</span>
            <span className="w-1 h-1 rounded-full bg-[#657285]" />
            <span>All Rights Reserved</span>
          </div>

          <span className="text-white/60">
            Global Business, Technology &amp; Executive Journalism
          </span>
        </div>
      </div>
    </footer>
  );
}

