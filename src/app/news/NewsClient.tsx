'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Search, Filter, X, ChevronDown, ArrowRight } from 'lucide-react';
import { Article, Category } from '@/types';
import { CATEGORIES as INITIAL_CATEGORIES } from '@/data/categories';
import { getBlogUrl } from '@/lib/blogUrl';
import {
  SectionTitle,
  MetaDotDate,
  NewsFlashImg,
  PhotoBelowCard,
  normalizeCatName,
} from '@/components/newsflash/NewsFlashPrimitives';

interface NewsClientProps {
  initialCategory?: string;
  initialArticles?: Article[];
  initialCategories?: Category[];
}

function normalizeKey(value?: string): string {
  return (value || '').toLowerCase().trim().replace(/[-\s_]/g, '');
}

function articleMatchesCategory(article: Article, targetNorm: string): boolean {
  if (!targetNorm || targetNorm === 'all') return true;
  if (normalizeKey(article.category) === targetNorm) return true;
  if (
    Array.isArray(article.categories) &&
    article.categories.some((c) => normalizeKey(c) === targetNorm)
  ) {
    return true;
  }
  if (
    targetNorm === 'interview' &&
    (article.placement === 'interview' ||
      article.tag?.toLowerCase().includes('interview') ||
      article.title?.toLowerCase().startsWith('interview:'))
  ) {
    return true;
  }
  if (
    (targetNorm === 'realestate' || targetNorm === 'realstate') &&
    article.tag?.toLowerCase().includes('real estate')
  ) {
    return true;
  }
  return false;
}

export default function NewsClient({
  initialCategory,
  initialArticles,
  initialCategories,
}: NewsClientProps = {}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [articles, setArticles] = useState<Article[]>(initialArticles || []);
  const [categories, setCategories] = useState<Category[]>(initialCategories || INITIAL_CATEGORIES);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const initialNorm = useMemo(
    () => (initialCategory ? initialCategory.toLowerCase().trim() : 'all'),
    [initialCategory]
  );

  const resolveStateFromUrl = useCallback(() => {
    const paramCat = searchParams.get('category');
    const paramSub = searchParams.get('sub');
    const pathCatMatch = pathname?.match(/^\/category\/([^/?#]+)/i);

    let activeCategory = initialNorm;
    if (paramCat) {
      activeCategory = paramCat;
    } else if (pathCatMatch?.[1]) {
      activeCategory = decodeURIComponent(pathCatMatch[1]);
    } else if (!pathname?.startsWith('/category/') && !initialCategory) {
      activeCategory = 'all';
    }

    return {
      category: activeCategory,
      sub: paramSub,
    };
  }, [searchParams, pathname, initialCategory, initialNorm]);

  const initialResolved = resolveStateFromUrl();
  const [activeCategory, setActiveCategory] = useState<string>(initialResolved.category);
  const [activeSub, setActiveSub] = useState<string | null>(initialResolved.sub);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const res = resolveStateFromUrl();
    setActiveCategory(res.category);
    setActiveSub(res.sub);
    setVisibleCount(12);

    const normResCat = normalizeKey(res.category);
    const catName = categories.find(
      (c) => normalizeKey(c.slug) === normResCat || normalizeKey(c.name) === normResCat
    )?.name;

    if (res.category && res.category !== 'all' && catName) {
      document.title = `${catName} | Entrepreneur Mirror`;
    } else if (!pathname?.startsWith('/category/')) {
      document.title = 'Editorial Archive | Entrepreneur Mirror';
    }
  }, [searchParams, pathname, categories, resolveStateFromUrl]);

  useEffect(() => {
    if (initialArticles && initialArticles.length > 0) return;

    const fetchFreshData = async () => {
      try {
        const [artRes, catRes] = await Promise.all([
          fetch('/api/articles?summary=1'),
          fetch('/api/categories'),
        ]);
        const artJson = await artRes.json();
        const catJson = await catRes.json();
        const artList = Array.isArray(artJson) ? artJson : artJson?.data;
        const catList = Array.isArray(catJson) ? catJson : catJson?.data;
        if (Array.isArray(artList) && artList.length > 0) setArticles(artList);
        if (Array.isArray(catList) && catList.length > 0) setCategories(catList);
      } catch (err) {
        console.warn('Could not load live archive updates:', err);
      }
    };
    fetchFreshData();
  }, [initialArticles]);

  const currentCategoryObj = useMemo(() => {
    const norm = normalizeKey(activeCategory);
    if (!norm || norm === 'all') return null;
    return (
      categories.find(
        (c) => normalizeKey(c.slug) === norm || normalizeKey(c.name) === norm
      ) || null
    );
  }, [categories, activeCategory]);

  const navigateWithParams = (nextCategory: string, nextSub: string | null) => {
    const norm = normalizeKey(nextCategory);
    if (!nextCategory || norm === 'all') {
      router.push('/news');
      return;
    }

    const matchedCat = categories.find(
      (c) => normalizeKey(c.slug) === norm || normalizeKey(c.name) === norm
    );
    const cleanSlug = matchedCat?.slug || nextCategory.toLowerCase().trim().replace(/\s+/g, '-');
    const url = nextSub
      ? `/category/${cleanSlug}?sub=${encodeURIComponent(nextSub)}`
      : `/category/${cleanSlug}`;
    router.push(url);
  };

  const handleCategoryChange = (catSlug: string) => {
    setLoading(true);
    setActiveCategory(catSlug);
    setActiveSub(null);
    setVisibleCount(12);
    setIsDrawerOpen(false);
    navigateWithParams(catSlug, null);
    setTimeout(() => setLoading(false), 180);
  };

  const handleSubChange = (subName: string | null) => {
    setActiveSub(subName);
    setVisibleCount(12);
    navigateWithParams(activeCategory, subName);
  };

  const filteredArticles = useMemo(() => {
    const normCat = normalizeKey(activeCategory);
    let list =
      normCat && normCat !== 'all'
        ? articles.filter((a) => articleMatchesCategory(a, normCat))
        : articles;

    if (activeSub) {
      const subLower = activeSub.toLowerCase();
      list = list.filter(
        (a) =>
          a.title?.toLowerCase().includes(subLower) ||
          a.excerpt?.toLowerCase().includes(subLower) ||
          a.tag?.toLowerCase().includes(subLower)
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.title?.toLowerCase().includes(q) ||
          a.excerpt?.toLowerCase().includes(q) ||
          a.author?.toLowerCase().includes(q) ||
          a.tag?.toLowerCase().includes(q) ||
          a.category?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [articles, activeCategory, activeSub, searchQuery]);

  const showLeadSplit = !searchQuery.trim() && filteredArticles.length > 0;
  const leadArticle = showLeadSplit ? filteredArticles[0] : null;
  const gridSource = showLeadSplit ? filteredArticles.slice(1) : filteredArticles;
  const displayedArticles = gridSource.slice(0, visibleCount);
  const remainingCount = Math.max(0, gridSource.length - displayedArticles.length);

  const sectionLabel = currentCategoryObj
    ? `${currentCategoryObj.name} Dispatches`
    : 'All Editorial Dispatches';

  return (
    <div className="nf-container py-6 sm:py-10">
      {/* Standalone /news Masthead (hidden when /category/[slug] already renders its H1 above) */}
      {!initialCategory && (
        <header className="mb-8 pb-6 border-b border-[#cbd5e1]/45 flex flex-col gap-3">
          <SectionTitle title="Newsroom Archive" highlight />
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h1 className="nf-font-display text-[30px] sm:text-[40px] font-bold leading-[1.15] tracking-[-0.025em] text-[#020a1c]">
              Entrepreneur Mirror Archive
            </h1>
            <p className="text-[14px] text-[#657285]">
              {articles.length} verified dispatches across {categories.length} sections
            </p>
          </div>
        </header>
      )}

      {/* Clean Search + Category Filter Bar */}
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Quick Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto nf-no-scrollbar pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => handleCategoryChange('all')}
              className={`px-3.5 h-9 rounded-md text-[13px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                normalizeKey(activeCategory) === 'all'
                  ? 'bg-[#020a1c] text-white'
                  : 'bg-[#f7fafc] text-[#020a1c] hover:bg-[#e2e8f0]/60 border border-[#cbd5e1]/50'
              }`}
            >
              All Stories ({articles.length})
            </button>

            {categories.slice(0, 6).map((cat) => {
              const isActive =
                normalizeKey(activeCategory) === normalizeKey(cat.slug);
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`px-3.5 h-9 rounded-md text-[13px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#cc0000] text-white'
                      : 'bg-[#f7fafc] text-[#020a1c] hover:text-[#cc0000] border border-[#cbd5e1]/50'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setIsDrawerOpen((prev) => !prev)}
              className="px-3.5 h-9 rounded-md text-[13px] font-medium whitespace-nowrap bg-[#ffffff] text-[#020a1c] border border-[#cbd5e1] hover:border-[#020a1c] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-[#cc0000]" />
              <span>All Sections ({categories.length})</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isDrawerOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-[280px] flex-shrink-0">
            <Search className="w-4 h-4 text-[#657285] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter headlines, authors..."
              className="w-full h-9 pl-9 pr-8 rounded-md bg-[#f7fafc] border border-[#cbd5e1]/70 text-[13px] text-[#020a1c] placeholder-[#657285] focus:outline-none focus:border-[#cc0000] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#657285] hover:text-[#020a1c] cursor-pointer"
                aria-label="Clear filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Expanded All-14-Categories Directory Drawer */}
        {isDrawerOpen && (
          <div className="p-5 rounded-[8px] bg-[#f7fafc] border border-[#cbd5e1]/60 nf-reveal">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-[#657285]">
                Browse All Editorial Sections
              </span>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="text-[#657285] hover:text-[#020a1c] cursor-pointer"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2">
              {categories.map((cat) => {
                const norm = normalizeKey(cat.slug);
                const isActive = normalizeKey(activeCategory) === norm;
                const count = articles.filter((a) => articleMatchesCategory(a, norm)).length;
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => handleCategoryChange(cat.slug)}
                    className={`flex items-center justify-between px-3 py-2 rounded-md text-[12px] font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#cc0000] text-white'
                        : 'bg-white text-[#020a1c] border border-[#cbd5e1]/50 hover:border-[#cc0000] hover:text-[#cc0000]'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className="text-[11px] opacity-70 ml-1">{count}</span>
                  </button>
                );
              })}
            </div>

            {currentCategoryObj?.subcategories && currentCategoryObj.subcategories.length > 0 && (
              <div className="mt-4 pt-3 border-t border-[#cbd5e1]/45 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#657285] mr-1">
                  Topics:
                </span>
                <button
                  type="button"
                  onClick={() => handleSubChange(null)}
                  className={`px-2.5 py-1 rounded text-[12px] font-medium cursor-pointer ${
                    !activeSub
                      ? 'bg-[#020a1c] text-white'
                      : 'bg-white text-[#657285] border border-[#cbd5e1]/50'
                  }`}
                >
                  All
                </button>
                {currentCategoryObj.subcategories.map((sub) => (
                  <button
                    key={sub.slug || sub.name}
                    type="button"
                    onClick={() => handleSubChange(sub.name)}
                    className={`px-2.5 py-1 rounded text-[12px] font-medium cursor-pointer ${
                      activeSub === sub.name
                        ? 'bg-[#020a1c] text-white'
                        : 'bg-white text-[#657285] border border-[#cbd5e1]/50 hover:text-[#cc0000]'
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Loading Indicator */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="flex flex-col gap-3 animate-pulse">
              <div className="w-full h-[205px] rounded-[8px] bg-[#f1f5f9]" />
              <div className="h-3 w-28 rounded bg-[#f1f5f9]" />
              <div className="h-5 w-full rounded bg-[#f1f5f9]" />
            </div>
          ))}
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="my-8 p-12 rounded-[8px] bg-[#f7fafc] border border-[#cbd5e1]/45 text-center flex flex-col items-center gap-3">
          <p className="text-[18px] font-semibold text-[#020a1c]">
            No stories matched your current filter
          </p>
          <p className="text-[14px] text-[#657285] max-w-md">
            Try clearing your search term or switching back to the full Entrepreneur Mirror archive.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              handleCategoryChange('all');
            }}
            className="mt-2 px-5 h-10 rounded-md bg-[#020a1c] hover:bg-[#cc0000] text-white text-[13px] font-medium transition-colors cursor-pointer"
          >
            View All Dispatches
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {/* Asymmetric Lead Feature Split (NewsFlash Category Hero Pattern) */}
          {leadArticle && (
            <Link
              href={getBlogUrl(leadArticle)}
              className="nf-card group flex flex-col md:flex-row items-center gap-6 md:gap-8 p-5 sm:p-6 rounded-[8px] bg-[#f7fafc] border border-[#cbd5e1]/45 no-underline"
            >
              <div className="w-full md:flex-1 flex flex-col items-start gap-3 order-2 md:order-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <SectionTitle
                    title={normalizeCatName(leadArticle.category)}
                    highlight
                  />
                  <span className="w-[3px] h-[3px] rounded-full bg-[#cbd5e1]" />
                  <MetaDotDate
                    category={leadArticle.readTime || 'Lead Story'}
                    date={leadArticle.date}
                  />
                </div>
                <h2 className="nf-card-title nf-font-display text-[22px] sm:text-[28px] font-bold leading-[1.2] tracking-[-0.02em] line-clamp-3">
                  {leadArticle.title}
                </h2>
                {leadArticle.excerpt && (
                  <p className="text-[15px] leading-[1.55] text-[#657285] line-clamp-3">
                    {leadArticle.excerpt}
                  </p>
                )}
                <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#cc0000] mt-1">
                  <span>Read Full Story</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>

              <figure className="nf-img-wrap w-full md:flex-[1.25] h-[230px] sm:h-[310px] order-1 md:order-2">
                <NewsFlashImg
                  src={leadArticle.image}
                  alt={leadArticle.title}
                  eager
                />
              </figure>
            </Link>
          )}

          {/* Section Title + 3-Column Photo-Below-Card Grid */}
          {displayedArticles.length > 0 && (
            <div className="flex flex-col gap-6">
              <SectionTitle title={sectionLabel} showViewAll={false} />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                {displayedArticles.map((article) => (
                  <PhotoBelowCard
                    key={article.slug}
                    article={article}
                    imageHeightClass="h-[205px]"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Load More Control */}
          {remainingCount > 0 && (
            <div className="pt-4 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 12)}
                className="px-6 h-11 rounded-md bg-[#020a1c] hover:bg-[#cc0000] text-white text-[14px] font-medium transition-colors cursor-pointer"
              >
                Load More Stories ({remainingCount} remaining)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
