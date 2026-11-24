import React from 'react';
import { getArticleSummaries } from '@/data/db';
import { getArticlesFromDB } from '@/lib/supabaseService';
import { stripArticleForSummary } from '@/lib/articleSummary';
import NewsFlashMainAndSidebar from '@/components/newsflash/NewsFlashMainAndSidebar';
import NewsFlashBands from '@/components/newsflash/NewsFlashBands';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const dbArticles = await getArticlesFromDB();
  const articles =
    dbArticles && dbArticles.length > 0
      ? dbArticles.map(stripArticleForSummary)
      : getArticleSummaries();

  return (
    <div id="main" className="flex flex-col w-full bg-white text-[#020a1c]">
      {/* Band 1: Featured Asymmetric Hero + Latest News (3-col grid) + Top Stories (#f7fafc) | Sticky Right Sidebar (Technology) */}
      <NewsFlashMainAndSidebar articles={articles} />

      {/* Bands 2-6: World Strip, Health Shaded Spotlight, Business+Switcher Asymmetric, 4-Col Category Grid, Executive Interviews */}
      <NewsFlashBands articles={articles} />
    </div>
  );
}
