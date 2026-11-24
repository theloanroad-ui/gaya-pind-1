import React, { Suspense } from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ChevronRight } from 'lucide-react';
import { CATEGORIES, getCategorySlug } from '@/data/categories';
import { getCategorySeo } from '@/data/categorySeo';
import { getArticleSummaries, getCategories, getSiteConfig } from '@/data/db';
import { getArticlesFromDB } from '@/lib/supabaseService';
import { stripArticleForSummary } from '@/lib/articleSummary';
import { getBlogUrl } from '@/lib/blogUrl';
import { getSiteBaseUrl } from '@/lib/articlePageHelpers';
import { SectionTitle } from '@/components/newsflash/NewsFlashPrimitives';
import NewsClient from '@/app/news/NewsClient';

export const dynamic = 'force-dynamic';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

function normalizeCatKey(value?: string): string {
  return (value || '').replace(/[-\s_]/g, '').toLowerCase();
}

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const catSlug = slug.toLowerCase();
  const seo = getCategorySeo(catSlug);
  const siteConfig = getSiteConfig();
  const baseUrl = getSiteBaseUrl();
  const canonicalUrl = `${baseUrl}/category/${catSlug}`;

  return {
    title: { absolute: seo.metaTitle },
    description: seo.metaDescription,
    keywords: seo.keywords,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: seo.metaTitle,
      description: seo.metaDescription,
      url: canonicalUrl,
      siteName: siteConfig.name,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.metaTitle,
      description: seo.metaDescription,
    },
  };
}

export default async function CategorySlugPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const catSlug = slug.toLowerCase();
  const seo = getCategorySeo(catSlug);
  const siteConfig = getSiteConfig();
  const baseUrl = getSiteBaseUrl();

  const catObj = CATEGORIES.find(
    (c) => normalizeCatKey(c.slug) === normalizeCatKey(catSlug)
  );
  const catName = catObj?.name || catSlug.charAt(0).toUpperCase() + catSlug.slice(1);

  const dbArticles = await getArticlesFromDB();
  const allArticles =
    dbArticles && dbArticles.length > 0
      ? dbArticles.map(stripArticleForSummary)
      : getArticleSummaries();
  const categories = getCategories();
  const normCat = normalizeCatKey(catSlug);

  const categoryArticles = allArticles.filter((a) => {
    if (normalizeCatKey(a.category) === normCat) return true;
    if (
      Array.isArray(a.categories) &&
      a.categories.some((c) => normalizeCatKey(c) === normCat)
    ) {
      return true;
    }
    return false;
  });

  const pageUrl = `${baseUrl}/category/${catSlug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${pageUrl}#collection`,
        url: pageUrl,
        name: seo.metaTitle,
        description: seo.metaDescription,
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${baseUrl}/#website`,
          name: siteConfig.name,
          url: baseUrl,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
          { '@type': 'ListItem', position: 2, name: 'Categories', item: `${baseUrl}/category` },
          { '@type': 'ListItem', position: 3, name: catName, item: pageUrl },
        ],
      },
      {
        '@type': 'ItemList',
        itemListElement: categoryArticles.slice(0, 12).map((art, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `${baseUrl}${getBlogUrl(art)}`,
          name: art.title,
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

      {/* NewsFlash Section Masthead */}
      <section className="nf-container pt-6 sm:pt-10 pb-2">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 pb-4 mb-6 border-b border-[#cbd5e1]/45 text-[12px] text-[#657285]"
        >
          <Link href="/" className="hover:text-[#cc0000] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#cbd5e1]" />
          <Link href="/category" className="hover:text-[#cc0000] transition-colors">
            Categories
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#cbd5e1]" />
          <span className="text-[#020a1c] font-medium">{catName}</span>
        </nav>

        <header className="pb-6 border-b border-[#cbd5e1]/45 flex flex-col items-start gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <SectionTitle title={catName} highlight />
            <span className="text-[12px] text-[#657285]">
              {categoryArticles.length} {categoryArticles.length === 1 ? 'dispatch' : 'dispatches'}
            </span>
          </div>

          <h1 className="nf-font-display text-[30px] sm:text-[42px] font-bold leading-[1.14] tracking-[-0.025em] text-[#020a1c]">
            {seo.h1}
          </h1>

          <p className="text-[15px] sm:text-[16px] leading-[1.6] text-[#657285] max-w-4xl">
            {seo.introContent}
          </p>
        </header>
      </section>

      <Suspense
        fallback={
          <div className="nf-container py-14 text-center">
            <p className="text-[16px] font-semibold text-[#020a1c]">
              Loading {catName} coverage...
            </p>
          </div>
        }
      >
        <NewsClient
          initialCategory={getCategorySlug(catName)}
          initialArticles={allArticles}
          initialCategories={categories}
        />
      </Suspense>
    </>
  );
}
