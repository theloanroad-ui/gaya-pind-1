import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ChevronRight } from 'lucide-react';
import { CATEGORIES } from '@/data/categories';
import { getArticles, getSiteConfig } from '@/data/db';
import { getArticlesFromDB } from '@/lib/supabaseService';
import { getSiteBaseUrl } from '@/lib/articlePageHelpers';
import { SectionTitle } from '@/components/newsflash/NewsFlashPrimitives';

export const dynamic = 'force-dynamic';

function normalizeCatKey(value?: string): string {
  return (value || '').replace(/[-\s_]/g, '').toLowerCase();
}

export function generateMetadata(): Metadata {
  const siteConfig = getSiteConfig();
  const baseUrl = getSiteBaseUrl();
  const canonicalUrl = `${baseUrl}/category`;

  return {
    title: `Editorial Sections & Categories | ${siteConfig.name}`,
    description:
      'Browse all Entrepreneur Mirror journalism sections: Business, Technology, World News, Executive Interviews, Opinion, Lifestyle, Health, Crypto, Metaverse, Real Estate, and more.',
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `Editorial Sections & Categories | ${siteConfig.name}`,
      description: 'Complete directory of Entrepreneur Mirror editorial desks and reporting beats.',
      url: canonicalUrl,
      siteName: siteConfig.name,
      type: 'website',
    },
  };
}

export default async function CategoriesIndexPage() {
  const siteConfig = getSiteConfig();
  const baseUrl = getSiteBaseUrl();
  const dbArticles = await getArticlesFromDB();
  const allArticles = dbArticles && dbArticles.length > 0 ? dbArticles : getArticles();

  const categoriesWithCounts = CATEGORIES.map((cat) => {
    const norm = normalizeCatKey(cat.slug);
    const matching = allArticles.filter(
      (a) =>
        normalizeCatKey(a.category) === norm ||
        (Array.isArray(a.categories) &&
          a.categories.some((c) => normalizeCatKey(c) === norm))
    );
    return {
      ...cat,
      count: matching.length,
      latestTitle: matching[0]?.title,
    };
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${baseUrl}/category#collection`,
        url: `${baseUrl}/category`,
        name: `Editorial Categories | ${siteConfig.name}`,
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${baseUrl}/#website`,
          name: siteConfig.name,
          url: baseUrl,
        },
      },
      {
        '@type': 'ItemList',
        itemListElement: categoriesWithCounts.map((c, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          url: `${baseUrl}/category/${c.slug}`,
          name: c.name,
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="nf-container py-8 sm:py-12">
        <header className="mb-10 pb-6 border-b border-[#cbd5e1]/45 flex flex-col items-start gap-3">
          <SectionTitle title="Section Directory" highlight />
          <h1 className="nf-font-display text-[32px] sm:text-[42px] font-bold leading-[1.14] tracking-[-0.025em] text-[#020a1c]">
            All Editorial Sections
          </h1>
          <p className="text-[15px] sm:text-[16px] leading-[1.6] text-[#657285] max-w-3xl">
            Navigate every desk across Entrepreneur Mirror — from executive interviews and venture intelligence to world dispatches, health, crypto, and lifestyle.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesWithCounts.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group p-6 rounded-[8px] bg-[#f7fafc] border border-[#cbd5e1]/50 hover:border-[#cc0000]/45 hover:bg-white transition-all flex flex-col justify-between gap-4 no-underline"
            >
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="nf-badge-red">{cat.name}</span>
                  <span className="text-[12px] font-medium text-[#657285]">
                    {cat.count} {cat.count === 1 ? 'story' : 'stories'}
                  </span>
                </div>

                {cat.description && (
                  <p className="text-[14px] leading-[1.55] text-[#657285] line-clamp-2">
                    {cat.description}
                  </p>
                )}

                {cat.latestTitle && (
                  <p className="text-[13px] font-medium text-[#020a1c] line-clamp-2 pt-2 border-t border-[#cbd5e1]/35">
                    Latest: {cat.latestTitle}
                  </p>
                )}
              </div>

              <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#020a1c] group-hover:text-[#cc0000] transition-colors">
                <span>Browse {cat.name}</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
