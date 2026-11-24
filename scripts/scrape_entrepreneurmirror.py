import urllib.request
import json
import ssl
import html
import re
import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE_URL = 'https://entrepreneurmirror.com'
POSTS_PER_PAGE = 100
MAX_WORKERS = 4
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'scraped_data')
os.makedirs(OUTPUT_DIR, exist_ok=True)

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
}

def clean_html_text(raw_html):
    if not raw_html:
        return ''
    text = re.sub(r'<[^>]+>', ' ', raw_html)
    text = html.unescape(text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def calculate_read_time(content_html):
    words = len(clean_html_text(content_html).split())
    minutes = max(1, round(words / 200))
    return f"{minutes} min read"

def fetch_json(url, retries=3):
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=30, context=ctx) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                total_posts = resp.headers.get('X-WP-Total')
                total_pages = resp.headers.get('X-WP-TotalPages')
                return data, total_posts, total_pages
        except Exception as e:
            if attempt == retries - 1:
                print(f"❌ Failed to fetch {url} after {retries} attempts: {e}")
                return None, None, None
            time.sleep(2 * (attempt + 1))

def fetch_categories():
    print("📡 Fetching categories from WordPress API...")
    url = f"{BASE_URL}/wp-json/wp/v2/categories?per_page=100"
    data, _, _ = fetch_json(url)
    if not data:
        return {}
    
    cat_map = {}
    for c in data:
        cat_map[c['id']] = {
            'id': c['id'],
            'name': html.unescape(c['name']),
            'slug': c['slug'],
            'count': c['count']
        }
    print(f"✅ Loaded {len(cat_map)} categories successfully.")
    with open(os.path.join(OUTPUT_DIR, 'categories.json'), 'w', encoding='utf-8') as f:
        json.dump(list(cat_map.values()), f, indent=2, ensure_ascii=False)
    return cat_map

def parse_post(p, cat_map):
    embedded = p.get('_embedded', {})
    
    # 1. Featured image
    image_url = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200'
    if 'wp:featuredmedia' in embedded and embedded['wp:featuredmedia']:
        media = embedded['wp:featuredmedia'][0]
        if isinstance(media, dict) and media.get('source_url'):
            image_url = media['source_url']
            
    # 2. Author
    author_name = 'Entrepreneur Mirror'
    if 'author' in embedded and embedded['author']:
        author_info = embedded['author'][0]
        if isinstance(author_info, dict) and author_info.get('name'):
            author_name = html.unescape(author_info['name'])
            
    # 3. Categories
    post_cat_ids = p.get('categories', [])
    category_names = [cat_map[cid]['name'] for cid in post_cat_ids if cid in cat_map]
    primary_cat = category_names[0] if category_names else 'Business'
    
    # Ignore 'Uncategorized' if other categories exist
    if primary_cat.lower() == 'uncategorized' and len(category_names) > 1:
        primary_cat = category_names[1]

    # 4. Content & Excerpt
    raw_content = p.get('content', {}).get('rendered', '')
    raw_excerpt = p.get('excerpt', {}).get('rendered', '')
    clean_excerpt = clean_html_text(raw_excerpt)
    if not clean_excerpt and raw_content:
        clean_excerpt = clean_html_text(raw_content)[:220] + '...'

    # 5. Date formatting
    date_iso = p.get('date', '2026-01-01T00:00:00')
    try:
        date_str = date_iso.split('T')[0]
    except Exception:
        date_str = '2026-01-01'

    clean_title = html.unescape(p.get('title', {}).get('rendered', '')).strip()
    slug = p.get('slug', '').strip()

    return {
        'id': slug or f"post-{p.get('id')}",
        'wp_id': p.get('id'),
        'slug': slug,
        'title': clean_title,
        'category': primary_cat,
        'categories': category_names,
        'region': 'Global',
        'contentType': 'News',
        'tag': primary_cat,
        'date': date_str,
        'publishDate': date_str,
        'author': author_name,
        'authorRole': 'Editor',
        'authorAvatar': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
        'image': image_url,
        'readTime': calculate_read_time(raw_content),
        'excerpt': clean_excerpt,
        'content': raw_content,
        'status': 'Published',
        'originalLink': p.get('link', ''),
    }

def fetch_page(page_num, cat_map):
    url = f"{BASE_URL}/wp-json/wp/v2/posts?per_page={POSTS_PER_PAGE}&page={page_num}&_embed"
    data, _, _ = fetch_json(url)
    if not data or not isinstance(data, list):
        print(f"⚠️ Page {page_num}: No data returned")
        return []
    
    parsed = [parse_post(item, cat_map) for item in data]
    print(f"✓ Page {page_num} finished ({len(parsed)} posts)")
    return parsed

def main():
    start_time = time.time()
    print("🚀 STARTING FULL SCRAPING PIPELINE: https://entrepreneurmirror.com")
    cat_map = fetch_categories()
    
    # First get total pages
    first_url = f"{BASE_URL}/wp-json/wp/v2/posts?per_page={POSTS_PER_PAGE}&page=1"
    _, total_posts, total_pages = fetch_json(first_url)
    
    if not total_pages:
        print("❌ Could not determine total pages.")
        sys.exit(1)
        
    total_pages = int(total_pages)
    total_posts = int(total_posts)
    print(f"📊 TARGET METRICS: {total_posts} total posts across {total_pages} pages ({POSTS_PER_PAGE}/page)")

    all_articles = []
    
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {executor.submit(fetch_page, p, cat_map): p for p in range(1, total_pages + 1)}
        for future in as_completed(futures):
            p = futures[future]
            try:
                posts = future.result()
                all_articles.extend(posts)
            except Exception as e:
                print(f"❌ Error processing page {p}: {e}")

    # Sort articles by date descending
    all_articles.sort(key=lambda x: x.get('date', ''), reverse=True)

    print(f"\n🎉 SCRAPING COMPLETE! Successfully gathered {len(all_articles)} out of {total_posts} posts.")
    print(f"⏱️ Total duration: {time.time() - start_time:.2f} seconds.")

    out_file = os.path.join(OUTPUT_DIR, 'all_posts_entrepreneurmirror.json')
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(all_articles, f, indent=2, ensure_ascii=False)
        
    print(f"💾 Full dataset saved to: {out_file} ({os.path.getsize(out_file) / (1024*1024):.2f} MB)")

if __name__ == '__main__':
    main()

