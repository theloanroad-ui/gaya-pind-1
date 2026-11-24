import React from 'react';
import Link from 'next/link';
import { ChevronRight, Clock, User } from 'lucide-react';
import { Article } from '@/types';
import { getCategorySlug } from '@/data/categories';
import { linkifyText, linkifyHtml } from '@/lib/linkify';
import ShareButtons from '@/app/news/[slug]/ShareButtons';
import ArticleViewTracker from '@/components/ArticleViewTracker';
import NewsFlashSidebarNewsletter from './NewsFlashSidebarNewsletter';
import {
  SectionTitle,
  NewsFlashImg,
  PhotoBelowCard,
  TextOnlyRow,
} from './NewsFlashPrimitives';
import { formatNfDate, normalizeCatName } from '@/lib/newsflashFormat';

interface NewsFlashArticleViewProps {
  article: Article;
  relatedArticles: Article[];
  topSidebarArticles: Article[];
  showFeaturedImage?: boolean;
  shouldShowPopularPosts?: boolean;
  siteName?: string;
}

export default function NewsFlashArticleView({
  article,
  relatedArticles,
  topSidebarArticles,
  showFeaturedImage = true,
  shouldShowPopularPosts = true,
  siteName = 'Entrepreneur Mirror',
}: NewsFlashArticleViewProps) {
  const catSlug = getCategorySlug(article.category);
  const catLabel = normalizeCatName(article.category);
  const authorName = article.author || `${siteName} Editorial`;
  const authorInitial = authorName.charAt(0).toUpperCase();

  return (
    <>
      <ArticleViewTracker slug={article.slug} />

      <article
        className="nf-container py-6 sm:py-10"
        itemScope
        itemType="https://schema.org/NewsArticle"
      >
        {/* Top Breadcrumb Bar (NewsFlash Hairline Chrome) */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 pb-4 mb-6 border-b border-[#cbd5e1]/45 text-[12px] text-[#657285] overflow-x-auto nf-no-scrollbar whitespace-nowrap"
        >
          <Link href="/" className="hover:text-[#cc0000] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#cbd5e1] flex-shrink-0" />
          <Link
            href={`/category/${catSlug}`}
            className="hover:text-[#cc0000] transition-colors"
          >
            {catLabel}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#cbd5e1] flex-shrink-0" />
          <span
            className="text-[#020a1c] font-medium truncate max-w-[260px] sm:max-w-[440px]"
            title={article.title}
          >
            {article.title}
          </span>
        </nav>

        {/* Main 3fr Article Column + 1fr Sticky Sidebar */}
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-10">
          {/* LEFT MAIN ARTICLE COLUMN */}
          <div className="w-full lg:flex-[3] min-w-0">
            {/* Header Block */}
            <header className="flex flex-col items-start gap-3 mb-5">
              <h1
                itemProp="headline"
                className="nf-font-display text-[28px] sm:text-[36px] lg:text-[40px] font-bold leading-[1.15] tracking-[-0.025em] text-[#020a1c]"
              >
                {linkifyText(article.title)}
              </h1>

              {/* Author + Date + ReadTime Strip */}
              <div className="w-full pt-3 border-t border-[#cbd5e1]/45 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {article.authorAvatar ? (
                    <img
                      src={article.authorAvatar}
                      alt={authorName}
                      className="w-9 h-9 rounded-full object-cover border border-[#cbd5e1]/60 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#020a1c] text-white text-[13px] font-semibold flex items-center justify-center flex-shrink-0">
                      {authorInitial}
                    </div>
                  )}

                  <div className="flex flex-col">
                    <span
                      itemProp="author"
                      className="text-[14px] font-semibold text-[#020a1c] leading-tight"
                    >
                      {authorName}
                    </span>
                    <div className="flex items-center gap-2 text-[12px] text-[#657285] mt-0.5">
                      <time dateTime={article.date} itemProp="datePublished">
                        {formatNfDate(article.date)}
                      </time>
                      {article.readTime && (
                        <>
                          <span className="w-[3px] h-[3px] rounded-full bg-[#cc0000]" />
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#657285]" />
                            {article.readTime}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Hero Image (Rounded 8px Framer Treatment) */}
            {showFeaturedImage && article.image && (
              <figure className="mb-6">
                <div className="nf-img-wrap w-full aspect-[16/9] max-h-[520px]">
                  <NewsFlashImg
                    src={article.image}
                    alt={article.title}
                    eager
                  />
                </div>
                <figcaption className="mt-2 text-[12px] text-[#657285] flex items-center justify-between gap-2">
                  <span>{catLabel} Dispatch — {siteName}</span>
                </figcaption>
              </figure>
            )}

            {/* Social Share Row */}
            <ShareButtons title={article.title} />

            {/* Rich Article Content Body */}
            <div itemProp="articleBody" className="nf-article-body my-6">
              {article.content ? (
                <div
                  dangerouslySetInnerHTML={{ __html: linkifyHtml(article.content) }}
                />
              ) : (
                <>
                  {article.paragraphs && article.paragraphs.length > 0 && (
                    <p className="text-[17px] leading-[1.7] text-[#020a1c] font-medium mb-6">
                      {linkifyText(article.paragraphs[0])}
                    </p>
                  )}

                  {article.sections && article.sections.length > 0 ? (
                    article.sections.map((sec, idx) => (
                      <section key={idx} className="my-7">
                        <h2>{linkifyText(sec.heading)}</h2>
                        <p>{linkifyText(sec.content)}</p>
                      </section>
                    ))
                  ) : (
                    article.paragraphs?.slice(1).map((p, idx) => (
                      <p key={idx}>{linkifyText(p)}</p>
                    ))
                  )}
                </>
              )}
            </div>

            {/* Category Tags Bar */}
            {(article.categories && article.categories.length > 0) && (
              <div className="pt-5 pb-2 border-t border-[#cbd5e1]/45 flex flex-wrap items-center gap-2">
                <span className="text-[12px] font-medium text-[#657285] mr-1">
                  Filed under:
                </span>
                {article.categories.map((cat) => (
                  <Link
                    key={cat}
                    href={`/category/${getCategorySlug(cat)}`}
                    className="nf-badge-red no-underline hover:opacity-85 transition-opacity"
                  >
                    {normalizeCatName(cat)}
                  </Link>
                ))}
              </div>
            )}

            {/* Author Card (#f7fafc Surface) */}
            <div className="mt-8 p-6 rounded-[8px] bg-[#f7fafc] border border-[#cbd5e1]/45 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {article.authorAvatar ? (
                <img
                  src={article.authorAvatar}
                  alt={authorName}
                  className="w-12 h-12 rounded-full object-cover border border-[#cbd5e1] flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#020a1c] text-white text-[16px] font-semibold flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[15px] font-bold text-[#020a1c]">
                    {authorName}
                  </span>
                  <span className="text-[12px] font-medium text-[#cc0000]">
                    {article.authorRole || `${siteName} Editorial Desk`}
                  </span>
                </div>
                <p className="text-[13px] leading-[1.55] text-[#657285] mt-1">
                  Covering global entrepreneurship, executive interviews, venture innovation, and macroeconomic shifts for {siteName}.
                </p>
              </div>
              <Link
                href={`/category/${catSlug}`}
                className="text-[13px] font-medium text-[#020a1c] hover:text-[#cc0000] inline-flex items-center gap-1 whitespace-nowrap transition-colors"
              >
                <span>More in {catLabel}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* RIGHT STICKY SIDEBAR */}
          <aside className="w-full lg:w-[320px] xl:w-[340px] flex-shrink-0 lg:sticky lg:top-[128px] flex flex-col gap-6">
            {shouldShowPopularPosts && topSidebarArticles.length > 0 && (
              <div className="p-5 sm:p-6 rounded-[8px] bg-[#f7fafc] border border-[#cbd5e1]/45 flex flex-col gap-4">
                <SectionTitle title="Latest Dispatches" href="/news" />
                <div className="flex flex-col gap-4">
                  {topSidebarArticles.slice(0, 6).map((item, idx, arr) => (
                    <TextOnlyRow
                      key={item.slug}
                      article={item}
                      hasBorder={idx < arr.length - 1}
                    />
                  ))}
                </div>
              </div>
            )}

            <NewsFlashSidebarNewsletter />
          </aside>
        </div>

        {/* RELATED STORIES BAND */}
        {relatedArticles.length > 0 && (
          <section className="mt-14 pt-10 border-t border-[#cbd5e1]/45">
            <SectionTitle
              title={`More from ${catLabel}`}
              href={`/category/${catSlug}`}
              className="mb-6"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.slice(0, 3).map((rel) => (
                <PhotoBelowCard
                  key={rel.slug}
                  article={rel}
                  imageHeightClass="h-[205px]"
                />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}

