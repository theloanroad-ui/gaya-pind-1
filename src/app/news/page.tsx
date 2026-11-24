import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import { CATEGORIES, getCategorySlug } from '@/data/categories';
import { getArticleSummaries, getCategories, getSiteConfig } from '@/data/db';
import { getSiteBaseUrl } from '@/lib/articlePageHelpers';
import NewsClient from './NewsClient';

export const dynamic = 'force-dynamic';

interface NewsPageProps {
  searchParams: Promise<{
    category?: string;
    sub?: string;
    region?: string;
  }>;
}

export async function generateMetadata({ searchParams }: NewsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const siteConfig = getSiteConfig();
  const baseUrl = getSiteBaseUrl();
  const rawCat = params.category?.trim();
  const sub = params.sub?.trim();

  if (rawCat && rawCat.toLowerCase() !== 'all') {
    const slug = getCategorySlug(rawCat);
    const catObj = CATEGORIES.find(
      (c) => c.slug.toLowerCase() === slug.toLowerCase() || c.name.toLowerCase() === rawCat.toLowerCase()
    );
    const catName = catObj?.name || rawCat.charAt(0).toUpperCase() + rawCat.slice(1);
    const canonicalUrl = sub
      ? `${baseUrl}/category/${slug}?sub=${encodeURIComponent(sub)}`
      : `${baseUrl}/category/${slug}`;

    const title = `${catName} Archive | ${siteConfig.name}`;
    const description =
      catObj?.description ||
      `Explore latest ${catName} reporting, executive interviews, and industry intelligence on ${siteConfig.name}.`;

    return {
      title,
      description,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: siteConfig.name,
        type: 'website',
      },
      twitter: {
        card: 'summary',
        title,
        description,
      },
    };
  }

  const archiveUrl = `${baseUrl}/news`;
  const defaultTitle = `Editorial Archive | ${siteConfig.name}`;
  const defaultDescription =
    'Explore global journalism, founder interviews, market intelligence, technology coverage, and lifestyle features on Entrepreneur Mirror.';

  return {
    title: defaultTitle,
    description: defaultDescription,
    alternates: { canonical: archiveUrl },
    openGraph: {
      title: defaultTitle,
      description: defaultDescription,
      url: archiveUrl,
      siteName: siteConfig.name,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: defaultTitle,
      description: defaultDescription,
    },
  };
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams;
  const siteConfig = getSiteConfig();
  const baseUrl = getSiteBaseUrl();
  const rawCat = params.category?.trim();
  const sub = params.sub?.trim();

  if (params.category !== undefined) {
    if (!rawCat || rawCat.toLowerCase() === 'all') {
      permanentRedirect('/category');
    }
    const cleanSlug = getCategorySlug(rawCat);
    permanentRedirect(
      sub ? `/category/${cleanSlug}?sub=${encodeURIComponent(sub)}` : `/category/${cleanSlug}`
    );
  }

  const pageTitle = `Editorial Archive | ${siteConfig.name}`;
  const pageDescription =
    'Explore global journalism, founder interviews, market intelligence, technology coverage, and lifestyle features on Entrepreneur Mirror.';
  const pageUrl = `${baseUrl}/news`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${pageUrl}#collection`,
        url: pageUrl,
        name: pageTitle,
        description: pageDescription,
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
          { '@type': 'ListItem', position: 2, name: 'Archive', item: pageUrl },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense
        fallback={
          <div className="nf-container py-16 text-center">
            <div className="text-[18px] font-bold text-[#020a1c]">
              Loading {siteConfig.name} Newsroom Archive...
            </div>
            <p className="text-[13px] text-[#657285] mt-2">
              Fetching editorial intelligence &amp; dispatches...
            </p>
          </div>
        }
      >
        <NewsClient
          initialArticles={getArticleSummaries()}
          initialCategories={getCategories()}
        />
      </Suspense>
    </>
  );
}
