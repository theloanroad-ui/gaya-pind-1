import { Article } from '@/types';

/**
 * Strips heavy full-article HTML/paragraphs/sections for list, grid, card,
 * and search surfaces so payloads stay ~40x smaller while keeping full Article typing.
 */
export function stripArticleForSummary(article: Article): Article {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    category: article.category,
    categories: article.categories,
    subcategory: article.subcategory,
    region: article.region,
    contentType: article.contentType,
    tag: article.tag,
    date: article.date,
    author: article.author,
    authorRole: article.authorRole,
    authorAvatar: article.authorAvatar,
    image: article.image,
    readTime: article.readTime,
    excerpt: article.excerpt,
    placement: article.placement,
    isBreaking: article.isBreaking,
    featured: article.featured,
    trending: article.trending,
    viewsCount: article.viewsCount,
    likesCount: article.likesCount,
    top10VisitCount: article.top10VisitCount,
    excludeFromPopularPosts: article.excludeFromPopularPosts,
    status: article.status,
    publishDate: article.publishDate,
    homepagePriority: article.homepagePriority,
    paragraphs: [],
    sections: [],
  };
}
