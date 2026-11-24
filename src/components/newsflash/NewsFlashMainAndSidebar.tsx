'use client';

import React from 'react';
import Link from 'next/link';
import { Article } from '@/types';
import { getBlogUrl } from '@/lib/blogUrl';
import {
  SectionTitle,
  MetaDotDate,
  NewsFlashImg,
  PhotoBelowCard,
  TextOnlyRow,
  OverlayFeatureCard,
  normalizeCatName,
} from './NewsFlashPrimitives';

interface Props {
  articles: Article[];
}

export default function NewsFlashMainAndSidebar({ articles }: Props) {
  if (!articles || articles.length === 0) return null;

  const usedSlugs = new Set<string>();
  const takeUnique = (pool: Article[], count: number): Article[] => {
    const out: Article[] = [];
    for (const a of pool) {
      if (!usedSlugs.has(a.slug)) {
        usedSlugs.add(a.slug);
        out.push(a);
        if (out.length >= count) break;
      }
    }
    return out;
  };

  // 1. Featured hero story (prefer explicit featured or first high-quality article)
  const featured =
    articles.find((a) => a.featured && a.image) ||
    articles[0];
  if (featured) usedSlugs.add(featured.slug);

  // 2. Latest News (6 vertical photo cards -> 2 rows x 3 cols)
  const latestArticles = takeUnique(articles, 6);

  // 3. Priority Sticky Sidebar: Executive Interviews & Press Releases (Replacing Technology Desk)
  const isCatMatch = (a: Article, targetSlug: string) =>
    (a.category || '').toLowerCase().replace(/[-\s]/g, '') === targetSlug ||
    Boolean(a.categories?.some((c) => c.toLowerCase().replace(/[-\s]/g, '') === targetSlug));

  const interviewPool = articles.filter((a) => isCatMatch(a, 'interview'));
  const sidebarInterviews = takeUnique(interviewPool, 4);
  const interviewLead = sidebarInterviews[0];
  const interviewRest = sidebarInterviews.slice(1, 4);

  const pressPool = articles.filter((a) => isCatMatch(a, 'pressrelease'));
  const sidebarPress = takeUnique(pressPool, 4);
  const pressLead = sidebarPress[0];
  const pressRest = sidebarPress.slice(1, 4);

  // 4. Top Stories Box (Left overlay photo + 4 text-only items right inside #f7fafc container)
  const topStories = takeUnique(articles, 5);
  const topStoryHero = topStories[0];
  const topStoryList = topStories.slice(1, 5);

  return (
    <section className="nf-container py-8 sm:py-12">
      <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-6">
        {/* LEFT COLUMN (3fr on Desktop): Featured + Latest News + Top Stories */}
        <div className="w-full lg:flex-[3] min-w-0 flex flex-col gap-12">
          {/* 1. Asymmetric Horizontal Featured Hero */}
          {featured && (
            <Link
              href={getBlogUrl(featured)}
              className="nf-card group flex flex-col md:flex-row items-center gap-6 md:gap-8 w-full no-underline"
            >
              {/* Text Left */}
              <div className="w-full md:flex-1 flex flex-col items-start gap-3 order-2 md:order-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <SectionTitle
                    title={normalizeCatName(featured.category)}
                    highlight
                  />
                  <span className="w-[3px] h-[3px] rounded-full bg-[#cbd5e1]" />
                  <MetaDotDate date={featured.date} category={featured.readTime || 'Featured'} />
                </div>

                <h1 className="nf-card-title nf-font-display text-[24px] sm:text-[26px] lg:text-[30px] font-bold leading-[1.2] tracking-[-0.02em] line-clamp-4">
                  {featured.title}
                </h1>

                {featured.excerpt && (
                  <p className="text-[15px] sm:text-[16px] leading-[1.5] text-[#657285] line-clamp-4">
                    {featured.excerpt}
                  </p>
                )}
              </div>

              {/* Rounded-8 Photo Right (flex-2 wide) */}
              <figure className="nf-img-wrap w-full md:flex-[1.35] h-[250px] sm:h-[340px] lg:h-[400px] order-1 md:order-2">
                <NewsFlashImg src={featured.image} alt={featured.title} eager />
              </figure>
            </Link>
          )}

          {/* 2. Latest News 3-Column Grid */}
          <div className="flex flex-col gap-6 w-full">
            <SectionTitle title="Latest News" href="/news" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8">
              {latestArticles.map((art) => (
                <PhotoBelowCard key={art.slug} article={art} />
              ))}
            </div>
          </div>

          {/* 3. Top Stories Shaded #f7fafc Card Box */}
          {topStoryHero && (
            <div className="w-full bg-[#f7fafc] border border-[#e2e8f0]/75 rounded-[8px] p-5 sm:p-6 flex flex-col gap-6">
              <SectionTitle title="Top Stories" href="/news" />

              <div className="flex flex-col md:flex-row items-stretch gap-6">
                <div className="w-full md:flex-[1.15]">
                  <OverlayFeatureCard
                    article={topStoryHero}
                    heightClass="min-h-[300px] md:min-h-[450px]"
                  />
                </div>

                <div className="w-full md:flex-1 bg-white rounded-[6px] p-5 border border-[#e2e8f0]/65 flex flex-col justify-between gap-4">
                  {topStoryList.map((item, idx) => (
                    <TextOnlyRow
                      key={item.slug}
                      article={item}
                      hasBorder={idx < topStoryList.length - 1}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* VERTICAL DIVIDER (Desktop only, 1px hairline matching Framer) */}
        <div className="hidden lg:block w-[1px] self-stretch bg-[#cbd5e1]/45 flex-shrink-0" />

        {/* RIGHT STICKY SIDEBAR (1fr on Desktop): Priority Interview & Press Release Desks */}
        <aside className="w-full lg:flex-1 lg:max-w-[310px] flex-shrink-0 lg:sticky lg:top-[120px] flex flex-col gap-7">
          {/* Priority Desk 1: Interview */}
          <div className="flex flex-col gap-4 w-full">
            <SectionTitle title="Interview" href="/category/interview" />

            {interviewLead && (
              <PhotoBelowCard
                article={interviewLead}
                imageHeightClass="h-[155px]"
              />
            )}

            <div className="w-full h-[1px] bg-[#cbd5e1]/45" />

            <div className="flex flex-col gap-3.5 w-full">
              {interviewRest.map((item, idx) => (
                <TextOnlyRow
                  key={item.slug}
                  article={item}
                  hasBorder={idx < interviewRest.length - 1}
                />
              ))}
            </div>
          </div>

          <div className="w-full h-[1px] bg-[#cbd5e1]/60" />

          {/* Priority Desk 2: Press Release */}
          <div className="flex flex-col gap-4 w-full">
            <SectionTitle title="Press Release" href="/category/press-release" />

            {pressLead && (
              <PhotoBelowCard
                article={pressLead}
                imageHeightClass="h-[155px]"
              />
            )}

            <div className="w-full h-[1px] bg-[#cbd5e1]/45" />

            <div className="flex flex-col gap-3.5 w-full">
              {pressRest.map((item, idx) => (
                <TextOnlyRow
                  key={item.slug}
                  article={item}
                  hasBorder={idx < pressRest.length - 1}
                />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

