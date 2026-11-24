import os
import json
import urllib.request
import ssl
import time

SCRAPED_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'scraped_data', 'all_posts_entrepreneurmirror.json')
ENV_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.env.local')

def get_env_vars():
    env = {}
    if os.path.exists(ENV_FILE):
        with open(ENV_FILE, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    k, v = line.split('=', 1)
                    env[k.strip()] = v.strip()
    return env

def upload_to_supabase(batch_size=100):
    env = get_env_vars()
    supabase_url = env.get('NEXT_PUBLIC_SUPABASE_URL')
    service_key = env.get('SUPABASE_SERVICE_ROLE_KEY') or env.get('NEXT_PUBLIC_SUPABASE_ANON_KEY')

    if not supabase_url or not service_key:
        print("❌ Supabase URL or Key missing from .env.local")
        return

    if not os.path.exists(SCRAPED_FILE):
        print(f"❌ Scraped file missing: {SCRAPED_FILE}")
        return

    with open(SCRAPED_FILE, 'r', encoding='utf-8') as f:
        posts = json.load(f)

    print(f"🚀 Preparing to sync {len(posts)} articles to Supabase ({supabase_url})...")

    endpoint = f"{supabase_url}/rest/v1/articles"
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    headers = {
        'apikey': service_key,
        'Authorization': f'Bearer {service_key}',
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
    }

    total_uploaded = 0
    total_batches = (len(posts) + batch_size - 1) // batch_size

    for i in range(0, len(posts), batch_size):
        batch = posts[i:i + batch_size]
        batch_num = (i // batch_size) + 1
        
        # Map to Supabase table column names
        rows = []
        for p in batch:
            rows.append({
                'slug': p['slug'],
                'title': p['title'],
                'category': p['category'],
                'region': p.get('region', 'Global'),
                'content_type': 'News',
                'tag': p['category'],
                'date_text': p['date'],
                'author_name': p.get('author', 'Entrepreneur Mirror'),
                'author_role': 'Editor',
                'author_avatar': p.get('authorAvatar', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300'),
                'image_url': p.get('image', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200'),
                'read_time': p.get('readTime', '4 min read'),
                'excerpt': p.get('excerpt', ''),
                'content': p.get('content', ''),
                'placement': 'category',
                'status': 'Published',
                'publish_date': p.get('date', '2026-01-01'),
                'publish_time': '09:00',
                'publish_timezone': 'GST',
            })

        payload = json.dumps(rows).encode('utf-8')
        req = urllib.request.Request(endpoint, data=payload, headers=headers, method='POST')

        try:
            with urllib.request.urlopen(req, timeout=30, context=ctx) as resp:
                if resp.status in (200, 201):
                    total_uploaded += len(rows)
                    print(f"✓ Batch {batch_num}/{total_batches} synced ({total_uploaded}/{len(posts)} articles)")
                else:
                    print(f"⚠️ Batch {batch_num} status {resp.status}")
        except Exception as e:
            print(f"❌ Batch {batch_num} failed: {e}")

        time.sleep(0.3)

    print(f"\n🎉 ALL SUPABASE SYNC COMPLETED: {total_uploaded} articles synced successfully!")

if __name__ == '__main__':
    upload_to_supabase()

