import os
import json
import urllib.request
import ssl

SCRAPED_POSTS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'scraped_data', 'all_posts_entrepreneurmirror.json')
SCRAPED_CATS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'scraped_data', 'categories.json')
CATEGORIES_TS = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src', 'data', 'categories.ts')
CATEGORIES_JSON = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src', 'data', 'categories.json')
ARTICLES_TS = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src', 'data', 'articles.ts')
ARTICLES_JSON = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src', 'data', 'articles.json')
CATEGORY_SEO_TS = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src', 'data', 'categorySeo.ts')
ENV_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.env.local')

# Clean target categories from entrepreneurmirror.com with appropriate layouts
TARGET_CATEGORIES = [
    {
        "name": "Business",
        "slug": "business",
        "description": "Global enterprise strategies, financial markets, venture capital allocations, corporate governance, and economic trends.",
        "layout": "business-layout",
        "order": 1,
        "isVisible": True,
        "subcategories": [
            {"name": "Startups & Funding", "slug": "startups-funding", "description": "Venture funding rounds, accelerators, and startup scaling."},
            {"name": "Corporate Strategy", "slug": "corporate-strategy", "description": "Enterprise leadership, mergers, and market dynamics."},
            {"name": "Finance & Markets", "slug": "finance-markets", "description": "Global capital allocators and equity trends."}
        ]
    },
    {
        "name": "Technology",
        "slug": "technology",
        "description": "Artificial intelligence breakthroughs, software innovation, cloud computing infrastructure, and technological disruption.",
        "layout": "tech-layout",
        "order": 2,
        "isVisible": True,
        "subcategories": [
            {"name": "Artificial Intelligence", "slug": "ai", "description": "Neural nets, frontier models, and autonomous agents."},
            {"name": "Software & SaaS", "slug": "software-saas", "description": "Enterprise tools and digital systems."},
            {"name": "Hardware & Devices", "slug": "hardware-devices", "description": "Computing chips, robotics, and hardware."}
        ]
    },
    {
        "name": "Interview",
        "slug": "interview",
        "description": "Exclusive dialogues with CEOs, founders, industry pioneers, and transformative leaders shaping modern enterprise.",
        "layout": "world-layout",
        "order": 3,
        "isVisible": True,
        "subcategories": [
            {"name": "CEO Dialogues", "slug": "ceo-dialogues", "description": "Boardroom conversations with chief executives."},
            {"name": "Founder Stories", "slug": "founder-stories", "description": "Journeys of builders and creators."},
            {"name": "Executive Perspectives", "slug": "executive-perspectives", "description": "Thought leaders on the future of work."}
        ]
    },
    {
        "name": "News",
        "slug": "news",
        "description": "Breaking international headlines, investigative journalism, strategic briefs, and real-time executive coverage.",
        "layout": "world-layout",
        "order": 4,
        "isVisible": True,
        "subcategories": [
            {"name": "Global News", "slug": "global-news", "description": "Worldwide political and industrial dispatches."},
            {"name": "Market Alerts", "slug": "market-alerts", "description": "Breaking financial updates."}
        ]
    },
    {
        "name": "World",
        "slug": "world",
        "description": "Global geopolitics, sovereign economic policies, international trade corridors, and diplomatic affairs.",
        "layout": "world-layout",
        "order": 5,
        "isVisible": True,
        "subcategories": [
            {"name": "Americas", "slug": "americas", "description": "North and Latin American affairs."},
            {"name": "EMEA", "slug": "emea", "description": "Europe, Middle East, and Africa."},
            {"name": "Asia Pacific", "slug": "asia-pacific", "description": "APAC markets and trade corridors."}
        ]
    },
    {
        "name": "Lifestyle",
        "slug": "lifestyle",
        "description": "Executive wellness, luxury hospitality, high-end travel, culture, and architecture for global professionals.",
        "layout": "lifestyle-layout",
        "order": 6,
        "isVisible": True,
        "subcategories": [
            {"name": "Executive Travel", "slug": "executive-travel", "description": "Bespoke destinations and aviation."},
            {"name": "Design & Culture", "slug": "design-culture", "description": "Living, arts, and architectural excellence."}
        ]
    },
    {
        "name": "Opinion",
        "slug": "opinion",
        "description": "Authoritative op-eds, provocative perspectives, and editorial commentary from recognized industry voices.",
        "layout": "culture-layout",
        "order": 7,
        "isVisible": True,
        "subcategories": [
            {"name": "Guest Columns", "slug": "guest-columns", "description": "Perspectives from industry practitioners."},
            {"name": "Editorial Stance", "slug": "editorial-stance", "description": "Institutional views on regulatory and market shifts."}
        ]
    },
    {
        "name": "Press Release",
        "slug": "press-release",
        "description": "Official company announcements, product launches, corporate partnerships, and corporate dispatches.",
        "layout": "business-layout",
        "order": 8,
        "isVisible": True,
        "subcategories": [
            {"name": "Corporate Dispatches", "slug": "corporate-dispatches", "description": "Official statements and announcements."},
            {"name": "Product Launches", "slug": "product-launches", "description": "New releases and enterprise rollouts."}
        ]
    },
    {
        "name": "Metaverse",
        "slug": "metaverse",
        "description": "Spatial computing, virtual environments, augmented reality frameworks, and digital identity ecosystems.",
        "layout": "tech-layout",
        "order": 9,
        "isVisible": True,
        "subcategories": [
            {"name": "Spatial Computing", "slug": "spatial-computing", "description": "AR/VR interfaces and hardware."},
            {"name": "Virtual Worlds", "slug": "virtual-worlds", "description": "Decentralized worlds and 3D simulation."}
        ]
    },
    {
        "name": "Crypto",
        "slug": "crypto",
        "description": "Decentralized finance, digital assets, tokenomics, blockchain architecture, and sovereign regulatory frameworks.",
        "layout": "tech-layout",
        "order": 10,
        "isVisible": True,
        "subcategories": [
            {"name": "DeFi", "slug": "defi", "description": "Lending protocols, automated liquidity, and yields."},
            {"name": "Regulation", "slug": "crypto-regulation", "description": "SEC, MiCA, and global compliance."}
        ]
    },
    {
        "name": "Real Estate",
        "slug": "real-estate",
        "description": "Commercial developments, prime residential portfolios, architectural landmarks, and property investment trusts.",
        "layout": "business-layout",
        "order": 11,
        "isVisible": True,
        "subcategories": [
            {"name": "Commercial Assets", "slug": "commercial-assets", "description": "Office parks, logistics hubs, and data centres."},
            {"name": "Luxury Residential", "slug": "luxury-residential", "description": "Ultra-prime developments and private estates."}
        ]
    },
    {
        "name": "Career",
        "slug": "career",
        "description": "Executive talent strategy, future of work, organizational culture, board appointments, and C-suite mobility.",
        "layout": "business-layout",
        "order": 12,
        "isVisible": True,
        "subcategories": [
            {"name": "Leadership Pathways", "slug": "leadership-pathways", "description": "Executive ascension and career transitions."},
            {"name": "Workplace Evolution", "slug": "workplace-evolution", "description": "Remote culture, AI workforce integration."}
        ]
    },
    {
        "name": "Health",
        "slug": "health",
        "description": "Biotech innovation, longevity protocols, preventive health science, and healthcare system modernization.",
        "layout": "lifestyle-layout",
        "order": 13,
        "isVisible": True,
        "subcategories": [
            {"name": "Longevity Science", "slug": "longevity-science", "description": "Cellular health, biohacking, and vitality."},
            {"name": "Biopharma", "slug": "biopharma", "description": "Therapeutics, drug development, and digital medicine."}
        ]
    },
    {
        "name": "Biography",
        "slug": "biography",
        "description": "In-depth profiles, retrospective life chronicles, visionary journeys, and historical chronicles of transformative figures.",
        "layout": "culture-layout",
        "order": 14,
        "isVisible": True,
        "subcategories": [
            {"name": "Tech Titans", "slug": "tech-titans", "description": "Profiles of digital innovators."},
            {"name": "Historical Figures", "slug": "historical-figures", "description": "Chronicles of transformative leaders."}
        ]
    },
    {
        "name": "Sports",
        "slug": "sports",
        "description": "Sports business, franchise valuations, performance analytics, athletic sponsorship, and athletic culture.",
        "layout": "lifestyle-layout",
        "order": 15,
        "isVisible": True,
        "subcategories": [
            {"name": "Franchise Economics", "slug": "franchise-economics", "description": "Team valuations, media rights, and stadium deals."},
            {"name": "Athletic Excellence", "slug": "athletic-excellence", "description": "Elite competitions and sports science."}
        ]
    },
    {
        "name": "Entertainment",
        "slug": "entertainment",
        "description": "Media economics, streaming platforms, film finance, gaming industries, and creative sector teardowns.",
        "layout": "culture-layout",
        "order": 16,
        "isVisible": True,
        "subcategories": [
            {"name": "Media & Streaming", "slug": "media-streaming", "description": "Production studios, IP rights, and distribution."},
            {"name": "Gaming & Esports", "slug": "gaming-esports", "description": "Interactive entertainment ecosystems."}
        ]
    }
]

def generate_categories_ts():
    # 1. Write categories.json
    with open(CATEGORIES_JSON, 'w', encoding='utf-8') as f:
        json.dump(TARGET_CATEGORIES, f, indent=2, ensure_ascii=False)
    print(f"✅ Generated {CATEGORIES_JSON} with {len(TARGET_CATEGORIES)} categories.")

    # 2. Write categories.ts
    slug_map = {}
    for c in TARGET_CATEGORIES:
        slug_map[c['slug']] = c['slug']
        slug_map[c['name'].lower()] = c['slug']

    slug_map_lines = [f"  '{k}': '{v}'," for k, v in slug_map.items()]

    ts_content = f"""import {{ Category }} from '@/types';

export const CATEGORIES: Category[] = {json.dumps(TARGET_CATEGORIES, indent=2, ensure_ascii=False)};

export const CATEGORY_SLUG_MAP: Record<string, string> = {{
{os.linesep.join(slug_map_lines)}
}};

export function getCategorySlug(input: string): string {{
  if (!input) return 'business';
  const clean = input.toLowerCase().trim();
  return CATEGORY_SLUG_MAP[clean] || clean.replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}}

export function getCategoryName(slug: string): string {{
  const found = CATEGORIES.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
  if (found) return found.name;
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}}
"""
    with open(CATEGORIES_TS, 'w', encoding='utf-8') as f:
        f.write(ts_content)
    print(f"✅ Generated {CATEGORIES_TS} successfully.")

def generate_category_seo_ts():
    seo_data = {}
    for c in TARGET_CATEGORIES:
        seo_data[c['slug']] = {
            "metaTitle": f"{c['name']} News, Insights & In-Depth Analysis | Entrepreneur Mirror",
            "metaDescription": c['description'],
            "h1": f"{c['name']} Coverage & Analysis",
            "introContent": c['description'],
            "keywords": [
                f"{c['name'].lower()}",
                f"{c['name'].lower()} news",
                f"{c['name'].lower()} analysis",
                "entrepreneur mirror",
                "business intelligence",
                "executive reporting"
            ]
        }

    seo_data['all'] = {
        "metaTitle": "All Editorial Categories & Archives | Entrepreneur Mirror",
        "metaDescription": "Browse all editorial sections covering Business, Technology, Executive Interviews, World News, Lifestyle, and Market Perspectives on Entrepreneur Mirror.",
        "h1": "Editorial Categories Archive",
        "introContent": "Comprehensive index of all specialized departments and reporting desks across Entrepreneur Mirror.",
        "keywords": ["editorial categories", "business archive", "news archive", "entrepreneur mirror"]
    }

    ts_content = f"""export interface CategorySeoData {{
  metaTitle: string;
  metaDescription: string;
  h1: string;
  introContent: string;
  keywords: string[];
}}

export const CATEGORY_SEO_DATA: Record<string, CategorySeoData> = {json.dumps(seo_data, indent=2, ensure_ascii=False)};

export function getCategorySeo(slug?: string): CategorySeoData {{
  if (!slug) return CATEGORY_SEO_DATA.all;
  const clean = slug.toLowerCase().trim();
  return CATEGORY_SEO_DATA[clean] || {{
    metaTitle: `${{slug.charAt(0).toUpperCase() + slug.slice(1)}} News & Insights | Entrepreneur Mirror`,
    metaDescription: `Explore in-depth reporting and intelligence in ${{slug}} on Entrepreneur Mirror.`,
    h1: `${{slug.charAt(0).toUpperCase() + slug.slice(1)}} Archive`,
    introContent: `Latest news, perspectives, and executive reporting in ${{slug}}.`,
    keywords: [slug, `${{slug}} news`, 'entrepreneur mirror'],
  }};
}}
"""
    with open(CATEGORY_SEO_TS, 'w', encoding='utf-8') as f:
        f.write(ts_content)
    print(f"✅ Generated {CATEGORY_SEO_TS} with complete SEO blocks.")

def curate_articles_across_all_categories():
    with open(SCRAPED_POSTS_FILE, 'r', encoding='utf-8') as f:
        all_posts = json.load(f)

    print(f"📦 Total raw posts available: {len(all_posts)}")

    # Index posts by category
    by_cat = {}
    for c in TARGET_CATEGORIES:
        by_cat[c['name']] = []

    for p in all_posts:
        cat = p.get('category')
        all_cats = p.get('categories', [])
        # Check primary or secondary
        matched = False
        for c in TARGET_CATEGORIES:
            cname = c['name']
            if cat.lower() == cname.lower() or any(cname.lower() == x.lower() for x in all_cats):
                by_cat[cname].append(p)
                matched = True
                break
        if not matched:
            by_cat['Business'].append(p)

    curated = []
    
    # 1. Top 3 Hero Lead stories
    hero_posts = all_posts[:3]
    for idx, p in enumerate(hero_posts):
        curated.append((p, 'top3', True if idx == 0 else False, True if idx < 2 else False))

    # 2. Pick balanced articles for EVERY single category
    for c in TARGET_CATEGORIES:
        cname = c['name']
        cat_posts = by_cat.get(cname, [])
        # Take up to 10 posts per category
        selected = cat_posts[:10]
        for p in selected:
            if not any(x[0]['slug'] == p['slug'] for x in curated):
                curated.append((p, 'category', False, False))

    print(f"📊 Curated {len(curated)} balanced articles covering all {len(TARGET_CATEGORIES)} categories!")

    final_list = []
    for idx, (p, placement, is_breaking, is_featured) in enumerate(curated):
        cat = p['category']
        # Normalize category
        norm_cat = 'Business'
        for c in TARGET_CATEGORIES:
            if c['name'].lower() == cat.lower():
                norm_cat = c['name']
                break

        final_list.append({
            'id': p['slug'] or p['id'],
            'slug': p['slug'],
            'title': p['title'],
            'category': norm_cat,
            'subcategory': p.get('categories', [norm_cat])[0] if p.get('categories') else norm_cat,
            'region': 'Global',
            'contentType': 'Interview' if norm_cat == 'Interview' else ('Opinion' if norm_cat == 'Opinion' else 'News'),
            'tag': norm_cat,
            'date': p['date'],
            'author': p.get('author') or 'Entrepreneur Mirror',
            'authorRole': 'Editor',
            'authorAvatar': p.get('authorAvatar', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300'),
            'image': p['image'] or 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200',
            'readTime': p.get('readTime', '4 min read'),
            'excerpt': p.get('excerpt', ''),
            'content': p.get('content', ''),
            'placement': placement,
            'homepagePriority': 'Top Story' if idx == 0 else ('High' if idx < 5 else 'Normal'),
            'isBreaking': is_breaking,
            'featured': is_featured,
            'trending': idx < 10,
            'status': 'Published',
            'publishDate': p['date'],
            'publishTime': '09:00',
            'publishTimezone': 'GST',
            'paragraphs': [],
            'sections': []
        })

    with open(ARTICLES_JSON, 'w', encoding='utf-8') as f:
        json.dump(final_list, f, indent=2, ensure_ascii=False)
    print(f"✅ Saved {ARTICLES_JSON} with {len(final_list)} articles.")

    ts_code = "import { Article } from '@/types';\n\nexport const ARTICLES: Article[] = " + json.dumps(final_list, indent=2, ensure_ascii=False) + ";\n"
    with open(ARTICLES_TS, 'w', encoding='utf-8') as f:
        f.write(ts_code)
    print(f"✅ Saved {ARTICLES_TS} with {len(final_list)} articles.")

def sync_categories_to_supabase():
    env = {}
    if os.path.exists(ENV_FILE):
        with open(ENV_FILE, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    k, v = line.split('=', 1)
                    env[k.strip()] = v.strip()

    supabase_url = env.get('NEXT_PUBLIC_SUPABASE_URL')
    service_key = env.get('SUPABASE_SERVICE_ROLE_KEY') or env.get('NEXT_PUBLIC_SUPABASE_ANON_KEY')

    if not supabase_url or not service_key:
        print("⚠️ Supabase not configured in .env.local, skipping DB categories push.")
        return

    print("🚀 Syncing target categories to Supabase...")
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    headers = {
        'apikey': service_key,
        'Authorization': f'Bearer {service_key}',
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
    }

    # 1. Clean old categories or upsert new ones
    rows = []
    for c in TARGET_CATEGORIES:
        rows.append({
            'name': c['name'],
            'slug': c['slug'],
            'description': c['description'],
            'layout': c['layout'],
            'display_order': c['order'],
            'is_visible': True,
            'subcategories': c.get('subcategories', [])
        })

    endpoint = f"{supabase_url}/rest/v1/categories"
    payload = json.dumps(rows).encode('utf-8')
    req = urllib.request.Request(endpoint, data=payload, headers=headers, method='POST')

    try:
        with urllib.request.urlopen(req, timeout=15, context=ctx) as resp:
            print(f"✓ Synced {len(rows)} categories to Supabase (Status: {resp.status})")
    except Exception as e:
        print(f"❌ Failed to sync categories to Supabase: {e}")

if __name__ == '__main__':
    generate_categories_ts()
    generate_category_seo_ts()
    curate_articles_across_all_categories()
    sync_categories_to_supabase()
