'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mic2, ArrowUpRight } from 'lucide-react';
import { Article } from '@/types';
import { getBlogUrl } from '@/lib/blogUrl';
import {
  SectionTitle,
  SmallPhotoRightCard,
  PhotoBelowCard,
  TextOnlyRow,
  OverlayFeatureCard,
  MetaDotDate,
} from './NewsFlashPrimitives';

interface Props {
  articles: Article[];
}

function byCategory(articles: Article[], target: string, limit: number): Article[] {
  const norm = target.toLowerCase().replace(/[-\s]/g, '');
  const exact = articles.filter(
    (a) =>
      (a.category || '').toLowerCase().replace(/[-\s]/g, '') === norm ||
      a.categories?.some((c) => c.toLowerCase().replace(/[-\s]/g, '') === norm)
  );
  if (exact.length >= limit) return exact.slice(0, limit);
  const existing = new Set(exact.map((a) => a.slug));
  const fallback = articles.filter((a) => !existing.has(a.slug)).slice(0, limit - exact.length);
  return [...exact, ...fallback];
}

export default function NewsFlashBands({ articles }: Props) {
  const [activeTab, setActiveTab] = useState<'lifestyle' | 'real-estate'>('lifestyle');

  if (!articles || articles.length === 0) return null;

  // Band 2: World / Global Politics (3 cols x 2 rows = 6 small horizontal photo-left cards)
  const worldArticles = byCategory(articles, 'world', 6);

  // Band 3: Full-width light shaded band -> Health (1 large overlay photo left + 4 small photo cards right)
  const healthArticles = byCategory(articles, 'health', 5);
  const healthHero = healthArticles[0];
  const healthList = healthArticles.slice(1, 5);

  // Band 4: Multi-section asymmetric (Business 2fr + Switcher 1fr Lifestyle/Real Estate)
  const businessArticles = byCategory(articles, 'business', 5);
  const businessHero = businessArticles[0];
  const businessList = businessArticles.slice(1, 5);

  const lifestyleTabArticles = byCategory(articles, 'lifestyle', 4);
  const realEstateTabArticles = byCategory(articles, 'real-estate', 4);
  const activeTabArticles =
    activeTab === 'lifestyle' ? lifestyleTabArticles : realEstateTabArticles;

  // Band 5: 4 Sections Strip (Opinion, Crypto, Metaverse, Technology — Press Release moved to Top Spotlight Sidebar)
  const fourDesks = [
    { title: 'Opinion', slug: 'opinion', items: byCategory(articles, 'opinion', 3) },
    { title: 'Crypto', slug: 'crypto', items: byCategory(articles, 'crypto', 3) },
    { title: 'Metaverse', slug: 'metaverse', items: byCategory(articles, 'metaverse', 3) },
    { title: 'Technology', slug: 'technology', items: byCategory(articles, 'technology', 3) },
  ];

  // Band 6: Executive Interviews (Podcast-style feature band #f7fafc, showcasing additional interviews beyond top sidebar)
  const allInterviews = byCategory(articles, 'interview', 9);
  const interviewPool = allInterviews.length > 5 ? allInterviews.slice(5, 9) : allInterviews;
  const interviewHero = interviewPool[0];
  const interviewList = interviewPool.slice(1, 4);

  return (
    <div className="flex flex-col w-full">
      {/* BAND 2: World Horizontal Strip (matches NewsFlash Politics section) */}
      <section className="nf-container py-10 border-t border-[#cbd5e1]/35">
        <div className="flex flex-col gap-6">
          <SectionTitle title="World" href="/category/world" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6">
            {worldArticles.map((art) => (
              <SmallPhotoRightCard key={art.slug} article={art} />
            ))}
          </div>
        </div>
      </section>

      {/* BAND 3: Full-Width Shaded Spotlight Band (#e2e8f033, matches NewsFlash Health section) */}
      <section
        className="w-full py-12"
        style={{ backgroundColor: 'var(--nf-band)' }}
      >
        <div className="nf-container flex flex-col gap-6">
          <SectionTitle title="Health" href="/category/health" />

          <div className="flex flex-col lg:flex-row items-stretch gap-6">
            {healthHero && (
              <div className="w-full lg:flex-[1.5]">
                <OverlayFeatureCard
                  article={healthHero}
                  heightClass="min-h-[300px] lg:min-h-[540px]"
                />
              </div>
            )}

            <div className="w-full lg:flex-1 bg-white rounded-[8px] p-5 border border-[#e2e8f0]/75 flex flex-col justify-between gap-4">
              {healthList.map((art, idx) => (
                <div
                  key={art.slug}
                  className={
                    idx < healthList.length - 1
                      ? 'pb-4 border-b border-[#cbd5e1]/40'
                      : ''
                  }
                >
                  <SmallPhotoRightCard article={art} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BAND 4: Multi-Section Asymmetric Band (Business #f7fafc 2fr + Tab Switcher 1fr) */}
      <section className="nf-container py-12">
        <div className="flex flex-col lg:flex-row items-stretch gap-6">
          {/* Left 2fr Business Box */}
          <div className="w-full lg:flex-[2] bg-[#f7fafc] border border-[#e2e8f0]/75 rounded-[8px] p-5 sm:p-6 flex flex-col gap-6">
            <SectionTitle title="Business" href="/category/business" />

            <div className="flex flex-col md:flex-row items-stretch gap-6 flex-1">
              <div className="w-full md:flex-1 bg-white rounded-[6px] p-5 border border-[#e2e8f0]/65 flex flex-col justify-between gap-4">
                {businessList.map((art, idx) => (
                  <TextOnlyRow
                    key={art.slug}
                    article={art}
                    hasBorder={idx < businessList.length - 1}
                  />
                ))}
              </div>

              {businessHero && (
                <div className="w-full md:flex-[1.15]">
                  <OverlayFeatureCard
                    article={businessHero}
                    heightClass="min-h-[300px] md:min-h-[430px]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Switcher Card (`Lifestyle | Real Estate` matching NewsFlash Fashion | Real Estate) */}
          <div className="w-full lg:w-[363px] flex-shrink-0 border border-[#cbd5e1]/55 rounded-[8px] bg-white overflow-hidden flex flex-col">
            <div className="grid grid-cols-2 h-[56px] border-b border-[#cbd5e1]/45 bg-[#f7fafc]/50">
              <button
                type="button"
                data-active={activeTab === 'lifestyle'}
                onClick={() => setActiveTab('lifestyle')}
                className={`nf-tab-btn text-[14px] font-medium flex items-center justify-center border-r border-[#cbd5e1]/40 cursor-pointer relative ${
                  activeTab === 'lifestyle'
                    ? 'text-[#020a1c] bg-white font-semibold'
                    : 'text-[#657285]'
                }`}
              >
                <span>Lifestyle</span>
                {activeTab === 'lifestyle' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#cc0000]" />
                )}
              </button>

              <button
                type="button"
                data-active={activeTab === 'real-estate'}
                onClick={() => setActiveTab('real-estate')}
                className={`nf-tab-btn text-[14px] font-medium flex items-center justify-center cursor-pointer relative ${
                  activeTab === 'real-estate'
                    ? 'text-[#020a1c] bg-white font-semibold'
                    : 'text-[#657285]'
                }`}
              >
                <span>Real Estate</span>
                {activeTab === 'real-estate' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#cc0000]" />
                )}
              </button>
            </div>

            <div
              key={activeTab}
              className="p-5 flex-1 flex flex-col justify-between gap-4 nf-reveal"
            >
              {activeTabArticles.map((art, idx) => (
                <div
                  key={art.slug}
                  className={
                    idx < activeTabArticles.length - 1
                      ? 'pb-4 border-b border-[#cbd5e1]/40'
                      : ''
                  }
                >
                  <SmallPhotoRightCard
                    article={art}
                    thumbSizeClass="w-[104px] h-[82px]"
                  />
                </div>
              ))}

              <div className="pt-2 border-t border-[#cbd5e1]/40 flex justify-end">
                <Link
                  href={`/category/${activeTab}`}
                  className="nf-view-all text-[13px] no-underline"
                >
                  <span>view all {activeTab === 'lifestyle' ? 'Lifestyle' : 'Real Estate'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BAND 5: 4 Sections Equal Columns (`Opinion`, `Crypto`, `Metaverse`, `Press Release`) */}
      <section className="nf-container py-10 border-t border-[#cbd5e1]/35">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {fourDesks.map((col) => {
            const lead = col.items[0];
            const rest = col.items.slice(1, 3);
            return (
              <div key={col.slug} className="flex flex-col gap-5 min-w-0">
                <SectionTitle
                  title={col.title}
                  href={`/category/${col.slug}`}
                  showLine={false}
                />

                {lead && (
                  <PhotoBelowCard
                    article={lead}
                    imageHeightClass="h-[155px]"
                  />
                )}

                <div className="flex flex-col gap-4 pt-2 border-t border-[#cbd5e1]/40">
                  {rest.map((item, idx) => (
                    <TextOnlyRow
                      key={item.slug}
                      article={item}
                      hasBorder={idx < rest.length - 1}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* BAND 6: Executive Interviews / Spotlight Band (#f7fafc, matches NewsFlash Podcast framer-4oXCr) */}
      {interviewHero && (
        <section className="w-full py-16 bg-[#f7fafc] border-t border-[#e2e8f0]/80">
          <div className="nf-container flex flex-col lg:flex-row items-stretch gap-6">
            <div className="w-full lg:flex-[1.8]">
              <OverlayFeatureCard
                article={interviewHero}
                heightClass="min-h-[320px] lg:min-h-[460px]"
                badgeLabel="Executive Interview"
              />
            </div>

            <div className="w-full lg:flex-1 bg-white rounded-[8px] p-6 border border-[#e2e8f0]/85 flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-2">
                <SectionTitle
                  title="Founder & CEO Dialogues"
                  href="/category/interview"
                />
                <p className="text-[14px] text-[#657285] leading-relaxed">
                  Exclusive conversations with founders, deep-tech builders, and global decision makers featured on Entrepreneur Mirror.
                </p>
              </div>

              <div className="flex flex-col divide-y divide-[#cbd5e1]/45">
                {interviewList.map((item, idx) => (
                  <Link
                    key={item.slug}
                    href={getBlogUrl(item)}
                    className="group py-4 first:pt-0 last:pb-0 flex items-start gap-3.5 no-underline"
                  >
                    <span className="w-8 h-8 rounded-[6px] bg-[#cc0000]/10 text-[#cc0000] flex items-center justify-center flex-shrink-0 group-hover:bg-[#cc0000] group-hover:text-white transition-colors mt-0.5">
                      <Mic2 className="w-4 h-4" />
                    </span>
                    <div className="min-w-0 flex-1 flex flex-col gap-1">
                      <MetaDotDate
                        category={`Dialogue 0${idx + 1}`}
                        date={item.date}
                      />
                      <h3 className="text-[15px] sm:text-[16px] font-medium text-[#020a1c] group-hover:text-[#cc0000] transition-colors line-clamp-2 leading-[21px]">
                        {item.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

