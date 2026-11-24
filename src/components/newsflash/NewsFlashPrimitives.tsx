'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Article } from '@/types';
import { getBlogUrl } from '@/lib/blogUrl';
import { formatNfDate, normalizeCatName } from '@/lib/newsflashFormat';

export { formatNfDate, normalizeCatName };

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200';

export function NewsFlashImg({
  src,
  alt,
  className = '',
  eager = false,
}: {
  src?: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_IMAGE);

  return (
    <img
      src={imgSrc || FALLBACK_IMAGE}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => {
        if (imgSrc !== FALLBACK_IMAGE) setImgSrc(FALLBACK_IMAGE);
      }}
      className={`block w-full h-full object-cover ${className}`}
    />
  );
}

export function SectionTitle({
  title,
  href,
  showLine = true,
  showViewAll = true,
  highlight = false,
  dark = false,
  className = '',
}: {
  title: string;
  href?: string;
  showLine?: boolean;
  showViewAll?: boolean;
  highlight?: boolean;
  dark?: boolean;
  className?: string;
}) {
  if (highlight) {
    return (
      <span className={`nf-badge-red ${className}`}>
        {title}
      </span>
    );
  }

  return (
    <div className={`w-full flex items-center gap-4 ${className}`}>
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <span
          className="inline-block w-[4px] h-[15px] flex-shrink-0 rounded-[1px]"
          style={{ backgroundColor: 'var(--nf-red)' }}
        />
        <h2
          className="text-[14px] sm:text-[15px] font-medium tracking-[-0.01em] whitespace-nowrap"
          style={{ color: dark ? '#ffffff' : 'var(--nf-ink)' }}
        >
          {title}
        </h2>
      </div>

      {showLine ? (
        <div
          className="flex-1 h-[1px]"
          style={{
            backgroundColor: dark
              ? 'rgba(255, 255, 255, 0.16)'
              : 'rgba(203, 213, 225, 0.45)',
          }}
        />
      ) : (
        <div className="flex-1" />
      )}

      {showViewAll && href && (
        <Link href={href} className="nf-view-all flex-shrink-0">
          <span>view all</span>
          <ChevronRight className="w-3.5 h-3.5 stroke-[2]" />
        </Link>
      )}
    </div>
  );
}

export function MetaDotDate({
  category,
  date,
  light = false,
}: {
  category?: string;
  date?: string;
  light?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5 text-[12px] leading-[15.6px] whitespace-nowrap">
      <span
        className="font-normal"
        style={{
          color: light ? 'rgba(255, 255, 255, 0.85)' : 'var(--nf-muted)',
        }}
      >
        {normalizeCatName(category)}
      </span>
      <span
        className="w-[3px] h-[3px] rounded-full flex-shrink-0"
        style={{
          backgroundColor: light
            ? 'rgba(255, 255, 255, 0.6)'
            : 'var(--nf-border)',
        }}
      />
      <span
        className="font-normal"
        style={{
          color: light ? 'rgba(255, 255, 255, 0.85)' : 'var(--nf-muted)',
        }}
      >
        {formatNfDate(date)}
      </span>
    </div>
  );
}

export function PhotoBelowCard({
  article,
  imageHeightClass = 'h-[200px]',
  showCategoryMeta = true,
}: {
  article: Article;
  imageHeightClass?: string;
  showCategoryMeta?: boolean;
}) {
  return (
    <Link
      href={getBlogUrl(article)}
      className="nf-card group flex flex-col items-start gap-3 w-full no-underline"
    >
      <figure className={`nf-img-wrap w-full ${imageHeightClass}`}>
        <NewsFlashImg src={article.image} alt={article.title} />
      </figure>
      <div className="flex flex-col gap-1 px-0.5 w-full">
        {showCategoryMeta && (
          <MetaDotDate category={article.category} date={article.date} />
        )}
        <h3 className="nf-card-title text-[16px] leading-[21px] font-medium line-clamp-3">
          {article.title}
        </h3>
      </div>
    </Link>
  );
}

export function SmallPhotoRightCard({
  article,
  thumbSizeClass = 'w-[125px] h-[100px]',
}: {
  article: Article;
  thumbSizeClass?: string;
}) {
  return (
    <Link
      href={getBlogUrl(article)}
      className="nf-card group flex flex-row items-center gap-3 w-full no-underline"
    >
      <figure
        className={`nf-img-wrap flex-shrink-0 ${thumbSizeClass}`}
      >
        <NewsFlashImg src={article.image} alt={article.title} />
      </figure>
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <MetaDotDate category={article.category} date={article.date} />
        <h3 className="nf-card-title text-[15px] leading-[20px] font-medium line-clamp-3">
          {article.title}
        </h3>
      </div>
    </Link>
  );
}

export function TextOnlyRow({
  article,
  hasBorder = true,
  className = '',
}: {
  article: Article;
  hasBorder?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={getBlogUrl(article)}
      className={`nf-text-row group flex flex-col gap-1 w-full no-underline ${
        hasBorder ? 'pb-4 border-b border-[#cbd5e1]/45' : ''
      } ${className}`}
    >
      <MetaDotDate category={article.category} date={article.date} />
      <h3 className="nf-text-link text-[15px] sm:text-[16px] leading-[21px] font-medium line-clamp-3">
        {article.title}
      </h3>
    </Link>
  );
}

export function OverlayFeatureCard({
  article,
  heightClass = 'min-h-[420px] sm:min-h-[520px]',
  badgeLabel,
}: {
  article: Article;
  heightClass?: string;
  badgeLabel?: string;
}) {
  return (
    <Link
      href={getBlogUrl(article)}
      className={`nf-overlay-card group block w-full h-full ${heightClass} no-underline`}
    >
      <div className="absolute inset-0">
        <NewsFlashImg
          src={article.image}
          alt={article.title}
          className="nf-overlay-img"
        />
      </div>
      <div className="nf-overlay-mask absolute inset-0" />
      <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col items-start gap-1.5">
        <MetaDotDate
          category={badgeLabel || article.category}
          date={article.date}
          light
        />
        <h3 className="text-white text-[18px] sm:text-[20px] leading-[1.25] font-semibold line-clamp-3">
          {article.title}
        </h3>
      </div>
    </Link>
  );
}

