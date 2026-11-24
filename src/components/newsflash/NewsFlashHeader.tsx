'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Menu,
  X,
  CloudSun,
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react';
import { CATEGORIES } from '@/data/categories';
import { Article, Category } from '@/types';
import { getBlogUrl } from '@/lib/blogUrl';
import { formatNfDate, normalizeCatName } from './NewsFlashPrimitives';

let cachedHeaderSearchArticles: Article[] | null = null;

export default function NewsFlashHeader() {
  const pathname = usePathname();
  const [categories] = useState<Category[]>(CATEGORIES);
  const [articles, setArticles] = useState<Article[]>(() => cachedHeaderSearchArticles || []);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [todayLabel, setTodayLabel] = useState('Global Edition');

  const isAdmin = pathname?.startsWith('/admin');

  useEffect(() => {
    setTodayLabel(
      new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    );

    const handleScroll = () => setScrolled(window.scrollY > 8);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDrawerOpen(false);
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!isSearchOpen || articles.length > 0 || loadingSearch) return;
    setLoadingSearch(true);
    fetch('/api/articles?summary=1')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          cachedHeaderSearchArticles = data;
          setArticles(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingSearch(false));
  }, [isSearchOpen, articles.length, loadingSearch]);

  useEffect(() => {
    setIsDrawerOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return articles.slice(0, 6);
    return articles
      .filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          (a.category || '').toLowerCase().includes(q) ||
          (a.excerpt || '').toLowerCase().includes(q)
      )
      .slice(0, 10);
  }, [articles, searchQuery]);

  if (isAdmin) return null;

  const visibleCats = categories.filter((c) => c.slug !== 'home' && c.isVisible !== false);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md transition-shadow duration-200 ${
          scrolled
            ? 'shadow-[0_2px_18px_rgba(2,10,28,0.06)] border-b border-[#cbd5e1]/60'
            : 'border-b border-[#cbd5e1]/45'
        }`}
      >
        {/* TIER 1: Topnav Bar (64px) */}
        <div className="h-[64px] w-full flex items-center">
          <div className="nf-container flex items-center justify-between gap-4">
            {/* Left Content (Date + Quick Search trigger) */}
            <div className="hidden md:flex items-center gap-4 w-[240px]">
              <span className="nf-font-mono text-[12px] text-[#657285] whitespace-nowrap">
                {todayLabel}
              </span>
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="inline-flex items-center gap-1.5 text-[12px] text-[#657285] hover:text-[#020a1c] transition-colors cursor-pointer"
                aria-label="Search stories"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </div>

            {/* Mobile Left Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                type="button"
                onClick={() => setIsDrawerOpen((v) => !v)}
                className="w-9 h-9 flex items-center justify-center rounded-[6px] text-[#020a1c] hover:bg-[#f7fafc] transition-colors cursor-pointer"
                aria-label="Toggle Menu"
              >
                {isDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Center Brand Logo (NewsFlash heavy geometric wordmark aesthetic) */}
            <Link
              href="/"
              className="flex items-center gap-2 no-underline group flex-shrink-0"
              aria-label="Entrepreneur Mirror Home"
            >
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-[6px] bg-[#020a1c] group-hover:bg-[#cc0000] transition-colors">
                <span className="w-1.5 h-4 rounded-[1px] bg-[#cc0000] group-hover:bg-white transition-colors" />
              </span>
              <span className="text-[20px] sm:text-[23px] font-extrabold tracking-[-0.04em] text-[#020a1c] leading-none lowercase">
                entrepreneur<span className="text-[#cc0000]">.</span>mirror
              </span>
            </Link>

            {/* Right Content (City + Weather + Desktop Company Menu / Mobile Search) */}
            <div className="flex items-center justify-end gap-3 md:w-[240px]">
              <div className="hidden lg:flex items-center gap-1.5 text-[12px] text-[#657285] whitespace-nowrap">
                <span>New York, US:</span>
                <span className="font-medium text-[#020a1c]">18°C</span>
                <CloudSun className="w-4 h-4 text-[#657285]" />
              </div>

              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="flex md:hidden w-9 h-9 items-center justify-center rounded-[6px] text-[#020a1c] hover:bg-[#f7fafc] transition-colors cursor-pointer"
                aria-label="Open search"
              >
                <Search className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsDrawerOpen((v) => !v)}
                className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] text-[13px] font-medium transition-colors cursor-pointer ${
                  isDrawerOpen
                    ? 'bg-[#cc0000] text-white'
                    : 'bg-[#f7fafc] text-[#020a1c] hover:bg-[#e2e8f0]/60'
                }`}
                aria-label="Open edition directory"
              >
                {isDrawerOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                <span>Menu</span>
              </button>
            </div>
          </div>
        </div>

        {/* TIER 2: Subnav Bar (40px horizontal scrollable category links + fade masks) */}
        <div className="h-[40px] w-full border-t border-[#e2e8f0]/60 relative bg-white">
          <div className="nf-container h-full relative flex items-center">
            <div className="nf-subnav-fade-left absolute left-4 top-0 bottom-0 w-5 z-10 hidden sm:block" />
            <div className="nf-subnav-fade-right absolute right-4 top-0 bottom-0 w-8 z-10" />

            <nav
              aria-label="Categories"
              className="nf-no-scrollbar flex items-center gap-5 overflow-x-auto h-full pr-10 w-full"
            >
              <Link
                href="/news"
                className={`nf-subnav-link text-[13px] sm:text-[14px] whitespace-nowrap no-underline flex items-center gap-1.5 ${
                  pathname === '/news'
                    ? 'text-[#cc0000] font-semibold'
                    : 'text-[#020a1c] font-medium'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#cc0000]" />
                Latest News
              </Link>

              <span className="w-[1px] h-[14px] bg-[#cbd5e1] flex-shrink-0" />

              {visibleCats.map((cat) => {
                const href = `/category/${cat.slug}`;
                const active = pathname === href;
                return (
                  <Link
                    key={cat.slug}
                    href={href}
                    className={`nf-subnav-link text-[13px] sm:text-[14px] whitespace-nowrap no-underline ${
                      active
                        ? 'text-[#cc0000] font-semibold'
                        : 'text-[#020a1c] font-normal'
                    }`}
                  >
                    {normalizeCatName(cat.name)}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Company & Directory Dropdown Drawer */}
        {isDrawerOpen && (
          <div className="border-t border-[#cbd5e1]/60 bg-white shadow-[0_18px_40px_rgba(2,10,28,0.12)] nf-reveal">
            <div className="nf-container py-6 grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-4 flex flex-col gap-3">
                <p className="text-[12px] uppercase tracking-wider text-[#657285] font-semibold">
                  Entrepreneur Mirror
                </p>
                <p className="text-[14px] text-[#657285] leading-relaxed">
                  Global business reporting, executive interviews, technology breakthroughs, and market intelligence curated for builders and leaders.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    href="/write-for-us"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[6px] bg-[#cc0000] text-white text-[13px] font-medium no-underline hover:bg-[#a80000] transition-colors"
                  >
                    <span>Write for Us</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[6px] bg-[#f7fafc] border border-[#cbd5e1] text-[#020a1c] text-[13px] font-medium no-underline hover:bg-[#e2e8f0]/50 transition-colors"
                  >
                    <span>Contact Desk</span>
                  </Link>
                </div>
              </div>

              <div className="md:col-span-5 flex flex-col gap-3">
                <p className="text-[12px] uppercase tracking-wider text-[#657285] font-semibold">
                  Editorial Sections
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
                  {visibleCats.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      className="text-[14px] text-[#020a1c] hover:text-[#cc0000] no-underline flex items-center gap-1 transition-colors"
                    >
                      <ChevronRight className="w-3 h-3 text-[#cc0000]" />
                      <span>{normalizeCatName(cat.name)}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="md:col-span-3 flex flex-col gap-2.5 border-t md:border-t-0 md:border-l border-[#cbd5e1]/50 pt-4 md:pt-0 md:pl-6">
                <p className="text-[12px] uppercase tracking-wider text-[#657285] font-semibold">
                  Platform
                </p>
                <Link href="/news" className="text-[14px] text-[#020a1c] hover:text-[#cc0000] no-underline">
                  All Dispatches
                </Link>
                <Link href="/category" className="text-[14px] text-[#020a1c] hover:text-[#cc0000] no-underline">
                  Category Directory
                </Link>
                <Link href="/write-for-us" className="text-[14px] text-[#020a1c] hover:text-[#cc0000] no-underline">
                  Editorial Submissions
                </Link>
                <Link href="/contact" className="text-[14px] text-[#020a1c] hover:text-[#cc0000] no-underline">
                  Advertise &amp; Contact
                </Link>
                <Link href="/privacy" className="text-[14px] text-[#657285] hover:text-[#020a1c] no-underline">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-[14px] text-[#657285] hover:text-[#020a1c] no-underline">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* NewsFlash Quick Search Modal */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-[100] bg-[#020a1c]/55 backdrop-blur-xs flex items-start justify-center pt-20 px-4"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-[10px] shadow-2xl border border-[#cbd5e1] overflow-hidden nf-reveal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#e2e8f0]">
              <Search className="w-5 h-5 text-[#cc0000]" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Entrepreneur Mirror headlines, founders, or categories..."
                className="flex-1 text-[15px] text-[#020a1c] placeholder-[#657285] focus:outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-1 rounded hover:bg-[#f7fafc] text-[#657285] cursor-pointer"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[420px] overflow-y-auto divide-y divide-[#e2e8f0]/60">
              {loadingSearch && searchResults.length === 0 ? (
                <div className="py-12 text-center text-[14px] text-[#657285]">
                  Loading stories index...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="py-12 text-center text-[14px] text-[#657285]">
                  No stories matched &ldquo;{searchQuery}&rdquo;.
                </div>
              ) : (
                searchResults.map((item) => (
                  <Link
                    key={item.slug}
                    href={getBlogUrl(item)}
                    className="flex items-center gap-3.5 p-3.5 hover:bg-[#f7fafc] transition-colors no-underline group"
                  >
                    <div className="w-16 h-12 rounded-[6px] overflow-hidden flex-shrink-0 bg-[#f1f5f9]">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-[11px] text-[#657285]">
                        <span className="text-[#cc0000] font-semibold">
                          {normalizeCatName(item.category)}
                        </span>
                        <span>•</span>
                        <span>{formatNfDate(item.date)}</span>
                      </div>
                      <h4 className="text-[14px] font-medium text-[#020a1c] group-hover:text-[#cc0000] truncate mt-0.5">
                        {item.title}
                      </h4>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

