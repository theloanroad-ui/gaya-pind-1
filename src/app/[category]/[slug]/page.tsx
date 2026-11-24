import React from 'react';
import { notFound, permanentRedirect } from 'next/navigation';
import { Metadata } from 'next';
import { getArticles, getArticleBySlug, getSiteConfig } from '@/data/db';
import { getArticlesFromDB } from '@/lib/supabaseService';
import { getCategorySlug } from '@/data/categories';
import NewsFlashArticleView from '@/components/newsflash/NewsFlashArticleView';
import {
  getSiteBaseUrl,
  buildArticleMetadata,
  buildArticleJsonLd,
  selectArticleRecommendations,
} from '@/lib/articlePageHelpers';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const dbArticles = await getArticlesFromDB();
  const articles = dbArticles && dbArticles.length > 0 ? dbArticles : getArticles();
  return articles.map((article) => ({
    category: getCategorySlug(article.category),
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const dbArticles = await getArticlesFromDB();
  const article =
    dbArticles?.find((a) => a.slug === slug || a.id === slug) || getArticleBySlug(slug);
  return buildArticleMetadata(article);
}

export default async function CategoryArticleDetailPage({ params }: PageProps) {
  const { category, slug } = await params;
  const dbArticles = await getArticlesFromDB();
  const article =
    dbArticles?.find((a) => a.slug === slug || a.id === slug) || getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const expectedCatSlug = getCategorySlug(article.category);
  if (category.toLowerCase() !== expectedCatSlug.toLowerCase()) {
    permanentRedirect(`/${expectedCatSlug}/${article.slug}`);
  }

  const siteConfig = getSiteConfig();
  const baseUrl = getSiteBaseUrl();
  const allArticles = dbArticles && dbArticles.length > 0 ? dbArticles : getArticles();
  const { relatedArticles, topSidebarArticles } = selectArticleRecommendations(
    allArticles,
    article
  );

  const shouldShowFeaturedImage =
    article.showFeaturedImage !== false &&
    article.showFeaturedImage !== 'No' &&
    article.showFeaturedImage !== 'no';
  const shouldShowPopularPosts = !article.disablePopularPostsDisplay;
  const articleUrl = `${baseUrl}/${expectedCatSlug}/${article.slug}`;
  const jsonLd = buildArticleJsonLd(article, articleUrl);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NewsFlashArticleView
        article={article}
        relatedArticles={relatedArticles}
        topSidebarArticles={topSidebarArticles}
        showFeaturedImage={shouldShowFeaturedImage}
        shouldShowPopularPosts={shouldShowPopularPosts}
        siteName={siteConfig.name}
      />
    </>
  );
}
