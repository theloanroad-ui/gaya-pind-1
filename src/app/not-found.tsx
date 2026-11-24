'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CATEGORIES as INITIAL_CATEGORIES } from '@/data/categories';
import { Category } from '@/types';
import { SectionTitle } from '@/components/newsflash/NewsFlashPrimitives';

export default function NotFound() {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        const list = Array.isArray(payload) ? payload : payload?.data;
        if (Array.isArray(list) && list.length > 0) {
          setCategories(list.filter((cat: Category) => cat.isVisible !== false));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="nf-container py-16 sm:py-24 text-center max-w-2xl mx-auto">
      <div className="mb-5 flex justify-center">
        <SectionTitle title="Edition Error 404" highlight />
      </div>

      <h1 className="nf-font-display text-[36px] sm:text-[54px] font-bold leading-[1.1] tracking-[-0.025em] text-[#020a1c] mb-4">
        Story Not Found
      </h1>

      <p className="text-[16px] leading-[1.6] text-[#657285] mb-8 max-w-xl mx-auto">
        The requested dispatch or editorial section could not be located in the current Entrepreneur Mirror archives.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        <Link
          href="/"
          className="bg-[#020a1c] hover:bg-[#cc0000] text-white text-[13px] font-medium px-6 h-10 rounded-md transition-colors inline-flex items-center gap-2 no-underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return To Front Page</span>
        </Link>
        <Link
          href="/news"
          className="border border-[#cbd5e1] hover:border-[#020a1c] text-[#020a1c] text-[13px] font-medium px-6 h-10 rounded-md transition-colors inline-flex items-center gap-2 no-underline"
        >
          <span>Browse Editorial Archive</span>
        </Link>
      </div>

      <div className="pt-8 border-t border-[#cbd5e1]/45">
        <div className="text-[12px] font-semibold uppercase tracking-wider text-[#657285] mb-4">
          Browse Editorial Desks
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.slice(0, 14).map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="text-[12px] font-medium bg-[#f7fafc] hover:bg-[#cc0000] hover:text-white border border-[#cbd5e1]/50 px-3 py-1.5 rounded-md transition-colors text-[#020a1c] no-underline"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
