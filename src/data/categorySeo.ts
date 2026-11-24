export interface CategorySeoData {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  introContent?: string;
  keywords: string;
}

export const CATEGORY_SEO_DATA: Record<string, CategorySeoData> = {
  'all': {
    slug: 'all',
    metaTitle: 'Latest News & Editorial Stories | Entrepreneur Mirror',
    metaDescription:
      'Explore breaking news, business strategy, executive interviews, technology, real estate, crypto, and global affairs on Entrepreneur Mirror.',
    h1: 'Latest News & Dispatches',
    introContent:
      'Comprehensive journalism across business, technology, executive interviews, global markets, real estate, health, and digital economies.',
    keywords: 'entrepreneur mirror, business news, executive interviews, technology trends, world news',
  },
  'business': {
    slug: 'business',
    metaTitle: 'Business Strategy, Markets & Enterprise News | Entrepreneur Mirror',
    metaDescription:
      'Enterprise developments, financial markets, corporate leadership, and global business insights from Entrepreneur Mirror.',
    h1: 'Business',
    introContent:
      'Global enterprise strategies, financial markets, corporate governance, and industrial shifts shaping the modern economy.',
    keywords: 'business news, enterprise strategy, corporate markets, global economy',
  },
  'technology': {
    slug: 'technology',
    metaTitle: 'Technology, AI & Digital Systems | Entrepreneur Mirror',
    metaDescription:
      'Breakthroughs in artificial intelligence, enterprise software, cybersecurity, hardware, and emerging tech.',
    h1: 'Technology',
    introContent:
      'Artificial intelligence breakthroughs, software infrastructure, automation, and the platforms redefining global industries.',
    keywords: 'technology news, artificial intelligence, enterprise tech, software innovation',
  },
  'interview': {
    slug: 'interview',
    metaTitle: 'Executive & Founder Interviews | Entrepreneur Mirror',
    metaDescription:
      'Exclusive conversations with CEOs, founders, creators, and visionaries shaping global business and technology.',
    h1: 'Interview',
    introContent:
      'In-depth Q&As and dialogues with chief executives, deep-tech founders, and leaders driving transformative ventures.',
    keywords: 'ceo interviews, founder interviews, executive dialogues, leadership profiles',
  },
  'news': {
    slug: 'news',
    metaTitle: 'Breaking News & Market Dispatches | Entrepreneur Mirror',
    metaDescription:
      'Real-time headlines, policy shifts, corporate developments, and international news coverage.',
    h1: 'News',
    introContent:
      'Timely dispatches covering major headlines, policy developments, and economic milestones around the world.',
    keywords: 'breaking news, global dispatches, market news, current affairs',
  },
  'world': {
    slug: 'world',
    metaTitle: 'World Affairs & Geopolitics | Entrepreneur Mirror',
    metaDescription:
      'International affairs, geopolitical transitions, sovereign policy, and global trade developments.',
    h1: 'World',
    introContent:
      'Geopolitical shifts, diplomacy, global trade corridors, and international events shaping business and society.',
    keywords: 'world news, geopolitics, international trade, global affairs',
  },
  'lifestyle': {
    slug: 'lifestyle',
    metaTitle: 'Lifestyle, Culture & Modern Living | Entrepreneur Mirror',
    metaDescription:
      'Executive wellness, luxury travel, culture, design, and contemporary living stories.',
    h1: 'Lifestyle',
    introContent:
      'Curated features spanning culture, modern living, luxury hospitality, travel, design, and personal excellence.',
    keywords: 'lifestyle, luxury travel, modern culture, design architecture',
  },
  'opinion': {
    slug: 'opinion',
    metaTitle: 'Opinion & Editorial Commentary | Entrepreneur Mirror',
    metaDescription:
      'Perspectives, analyses, and op-eds from industry executives, researchers, and commentators.',
    h1: 'Opinion',
    introContent:
      'Authoritative commentary and analytical perspectives on business ethics, leadership, emerging tech, and public policy.',
    keywords: 'opinion columns, editorial analysis, business commentary',
  },
  'health': {
    slug: 'health',
    metaTitle: 'Health, Healthcare & Biotech | Entrepreneur Mirror',
    metaDescription:
      'Healthcare policy, medical research, longevity, biotech innovation, and public wellness reporting.',
    h1: 'Health',
    introContent:
      'Clinical breakthroughs, digital healthcare transformation, biotech ventures, and public health insights.',
    keywords: 'health news, healthcare innovation, biotech, medical research',
  },
  'real-estate': {
    slug: 'real-estate',
    metaTitle: 'Real Estate & Urban Development | Entrepreneur Mirror',
    metaDescription:
      'Commercial property markets, luxury residential developments, proptech, and architecture news.',
    h1: 'Real Estate',
    introContent:
      'Real estate trends, commercial projects, urban architecture, and international property investment intelligence.',
    keywords: 'real estate news, commercial property, urban development, proptech',
  },
  'crypto': {
    slug: 'crypto',
    metaTitle: 'Crypto, Blockchain & Digital Assets | Entrepreneur Mirror',
    metaDescription:
      'Cryptocurrency markets, blockchain infrastructure, regulation, and decentralized finance reporting.',
    h1: 'Crypto',
    introContent:
      'Digital asset markets, institutional blockchain adoption, DeFi protocols, and evolving regulatory frameworks.',
    keywords: 'crypto news, blockchain, digital assets, defi',
  },
  'metaverse': {
    slug: 'metaverse',
    metaTitle: 'Metaverse & Spatial Computing | Entrepreneur Mirror',
    metaDescription:
      'Virtual environments, XR hardware, Web3 worlds, and spatial computing innovations.',
    h1: 'Metaverse',
    introContent:
      'Immersive digital ecosystems, virtual commerce, XR interfaces, and next-generation spatial platforms.',
    keywords: 'metaverse news, spatial computing, virtual reality, web3',
  },
  'press-release': {
    slug: 'press-release',
    metaTitle: 'Press Releases & Corporate Announcements | Entrepreneur Mirror',
    metaDescription:
      'Official company announcements, funding milestones, partnerships, and executive releases.',
    h1: 'Press Release',
    introContent:
      'Verified announcements, product launches, organizational updates, and official releases from leading firms.',
    keywords: 'press release, corporate announcements, product launches',
  },
  'biography': {
    slug: 'biography',
    metaTitle: 'Biographies & Leader Profiles | Entrepreneur Mirror',
    metaDescription:
      'Career trajectories and biographies of notable founders, industrialists, and public figures.',
    h1: 'Biography',
    introContent:
      'Detailed profiles examining the careers, milestones, and impact of influential business and cultural figures.',
    keywords: 'biography, founder profiles, entrepreneur stories',
  },
  'career': {
    slug: 'career',
    metaTitle: 'Career & Workplace Strategy | Entrepreneur Mirror',
    metaDescription:
      'Executive hiring, leadership development, future of work, and career growth insights.',
    h1: 'Career',
    introContent:
      'Practical guidance on executive leadership, talent strategy, organizational culture, and career advancement.',
    keywords: 'career strategy, leadership growth, future of work',
  },
};

export function getCategorySeo(slug?: string): CategorySeoData {
  if (!slug) return CATEGORY_SEO_DATA.all;
  const clean = slug.toLowerCase().trim().replace(/[-\s]/g, '');

  for (const [key, val] of Object.entries(CATEGORY_SEO_DATA)) {
    if (key.replace(/[-\s]/g, '') === clean) {
      return val;
    }
  }

  const formatted = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return {
    slug,
    metaTitle: `${formatted} | Entrepreneur Mirror`,
    metaDescription: `Explore ${formatted} reporting, interviews, and industry insights on Entrepreneur Mirror.`,
    h1: formatted,
    introContent: `In-depth reporting, executive perspectives, and market analysis across ${formatted}.`,
    keywords: `${slug}, entrepreneur mirror, business news`,
  };
}
