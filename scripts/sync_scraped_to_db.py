import os
import json

SCRAPED_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'scraped_data', 'all_posts_entrepreneurmirror.json')
LOCAL_ARTICLES_JSON = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src', 'data', 'articles.json')
LOCAL_ARTICLES_TS = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src', 'data', 'articles.ts')

def update_local_fallback(top_n=100):
    if not os.path.exists(SCRAPED_FILE):
        print(f"❌ Scraped file not found: {SCRAPED_FILE}")
        return
        
    with open(SCRAPED_FILE, 'r', encoding='utf-8') as f:
        posts = json.load(f)
        
    print(f"📖 Loaded {len(posts)} total posts from scraped data.")
    
    curated = posts[:top_n]
    
    local_list = []
    for idx, p in enumerate(curated):
        # Assign placements dynamically to power the Next.js homepage slots:
        # First 3 -> Hero / Top 3
        # Next 6 -> Latest News
        # Next 5 -> Best This Month / Trending
        # Next 10 -> Top 10 Ranked
        placement = 'category'
        if idx == 0:
            placement = 'top3'
        elif idx == 1:
            placement = 'top3'
        elif idx == 2:
            placement = 'top3'
        elif 3 <= idx < 9:
            placement = 'latest-news'
        elif 9 <= idx < 14:
            placement = 'best-month'
        elif 14 <= idx < 24:
            placement = 'top10'

        cat = p['category']
        # If category is World or Uncategorized, map to Business or News
        if cat.lower() in ('uncategorized', 'world'):
            cat = 'Business' if idx % 2 == 0 else 'News'

        local_list.append({
            'id': p['slug'] or p['id'],
            'slug': p['slug'],
            'title': p['title'],
            'category': cat,
            'subcategory': p.get('categories', [cat])[0] if p.get('categories') else None,
            'region': 'Global',
            'contentType': 'Interview' if 'interview' in cat.lower() else 'News',
            'tag': cat,
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
            'isBreaking': idx < 2,
            'featured': idx < 4,
            'trending': idx < 8,
            'status': 'Published',
            'publishDate': p['date'],
            'publishTime': '09:00',
            'publishTimezone': 'GST',
            'paragraphs': [],
            'sections': []
        })

    # Ensure we have at least 3 interview articles for the right-side interview slider in hero grid
    interview_count = sum(1 for a in local_list if a['category'].lower() == 'interview' or a['placement'] == 'interview')
    if interview_count < 3:
        # Mark items 25, 26, 27 as interview
        for j in range(25, min(28, len(local_list))):
            local_list[j]['category'] = 'Interview'
            local_list[j]['placement'] = 'interview'

    # 1. Write articles.json
    with open(LOCAL_ARTICLES_JSON, 'w', encoding='utf-8') as f:
        json.dump(local_list, f, indent=2, ensure_ascii=False)
    print(f"✅ Updated {LOCAL_ARTICLES_JSON} with {len(local_list)} curated articles.")

    # 2. Write articles.ts
    ts_code = "import { Article } from '@/types';\n\nexport const ARTICLES: Article[] = " + json.dumps(local_list, indent=2, ensure_ascii=False) + ";\n"
    with open(LOCAL_ARTICLES_TS, 'w', encoding='utf-8') as f:
        f.write(ts_code)
    print(f"✅ Updated {LOCAL_ARTICLES_TS} with {len(local_list)} curated articles.")

if __name__ == '__main__':
    update_local_fallback(100)
