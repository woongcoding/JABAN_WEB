"""Deploy the approved prototype-gemini theme and pages to Cafe24 WordPress."""
import os, sys, re, json
from pathlib import Path
from html.parser import HTMLParser
from html import unescape
from urllib.parse import urljoin, urlsplit
from datetime import datetime
import requests
from dotenv import dotenv_values

ROOT = Path(__file__).resolve().parents[2]
DIST = ROOT / 'jaban-wordpress' / 'dist'
ZIP_PATH = DIST / 'jaban-guide.zip'
PAGES_PATH = DIST / 'pages.json'

class Form(HTMLParser):
    def __init__(self, markup):
        super().__init__()
        self.values = {}
        self.action = ''
        self.feed(markup)
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'form':
            self.action = a.get('action', '')
        if tag == 'input' and 'name' in a:
            if a.get('type') in ('radio', 'checkbox') and 'checked' not in a:
                return
            if a.get('type') in ('file', 'submit', 'button'):
                return
            self.values[a['name']] = a.get('value', '')

def first_form(markup, marker):
    forms = re.findall(r'<form\b[^>]*>.*?</form>', markup, re.S)
    matches = [f for f in forms if marker in f]
    if len(matches) != 1:
        raise RuntimeError(f'Expected one {marker} form, found {len(matches)}')
    return Form(matches[0])

def main():
    config = dotenv_values(ROOT / '.env', interpolate=False)
    site = config['WP_SITE_URL'].rstrip('/').replace('http:', 'https:')
    print(f"Connecting to {site} as {config['WP_ADMIN_USER']}...")

    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': site + '/wp-admin/'
    })

    def get(path, headers=None):
        h = {'Referer': site + '/wp-admin/'}
        if headers:
            h.update(headers)
        res = session.get(site + path, headers=h, timeout=45)
        if not res.ok:
            raise RuntimeError(f"GET {path} failed: HTTP {res.status_code}")
        return res

    def post(path, headers=None, **kwargs):
        h = {'Referer': site + '/wp-admin/'}
        if headers:
            h.update(headers)
        res = session.post(site + path, headers=h, timeout=90, **kwargs)
        if not res.ok:
            raise RuntimeError(f"POST {path} failed: HTTP {res.status_code}")
        return res

    # 1. Login
    get('/wp-login.php')
    login_res = post('/wp-login.php', data={
        'log': config['WP_ADMIN_USER'],
        'pwd': config['WP_ADMIN_PASSWORD'],
        'wp-submit': 'Log In',
        'redirect_to': site + '/wp-admin/',
        'testcookie': '1'
    })
    if 'id="wpadminbar"' not in login_res.text:
        raise RuntimeError("WordPress login failed! Check credentials.")
    print("Authentication successful!")

    # 2. Helper for REST API Nonce
    def get_nonce():
        post_edit = get('/wp-admin/post.php?post=10&action=edit').text
        match = re.search(r'"root":"([^"]+)".*?"nonce":"([^"]+)"', post_edit)
        if not match:
            # Fallback check on post-new.php
            p_new = get('/wp-admin/post-new.php?post_type=page').text
            match = re.search(r'"root":"([^"]+)".*?"nonce":"([^"]+)"', p_new)
            if not match:
                raise RuntimeError("REST API root/nonce not found in editor page.")
        return match.group(1), match.group(2)

    root, nonce = get_nonce()

    def api_get(endpoint):
        nonlocal nonce, root
        h = {'X-WP-Nonce': nonce, 'Referer': site + '/wp-admin/', 'Accept': 'application/json, */*'}
        res = session.get(root + 'wp/v2/' + endpoint, headers=h, timeout=45)
        if res.status_code == 403:
            root, nonce = get_nonce()
            h['X-WP-Nonce'] = nonce
            res = session.get(root + 'wp/v2/' + endpoint, headers=h, timeout=45)
        if not res.ok:
            raise RuntimeError(f"API GET {endpoint} failed: {res.text[:200]}")
        return res.json()

    def api_post(endpoint, data):
        nonlocal nonce, root
        h = {'X-WP-Nonce': nonce, 'Referer': site + '/wp-admin/', 'Accept': 'application/json, */*'}
        res = session.post(root + 'wp/v2/' + endpoint, headers=h, json=data, timeout=45)
        if res.status_code == 403:
            root, nonce = get_nonce()
            h['X-WP-Nonce'] = nonce
            res = session.post(root + 'wp/v2/' + endpoint, headers=h, json=data, timeout=45)
        if not res.ok:
            raise RuntimeError(f"API POST {endpoint} failed: {res.text[:200]}")
        return res.json()

    # 3. Upload Theme ZIP via theme-install.php
    print(f"Uploading theme ZIP ({ZIP_PATH.stat().st_size} bytes)...")
    theme_install_html = get('/wp-admin/theme-install.php?tab=upload').text
    upload_form = first_form(theme_install_html, 'themezip')
    action_url = urljoin(site, upload_form.action)

    with open(ZIP_PATH, 'rb') as f:
        upload_res = session.post(
            action_url,
            data={**upload_form.values, 'install-theme-submit': '지금 설치'},
            files={'themezip': ('jaban-guide.zip', f, 'application/zip')},
            headers={'Referer': site + '/wp-admin/theme-install.php?tab=upload', 'Origin': site},
            timeout=120
        )
    
    print(f"Theme upload response received (HTTP {upload_res.status_code})")
    
    # Check if overwrite/replace confirmation is needed
    if '업로드된 파일로 교체' in upload_res.text or 'Replace active with uploaded' in upload_res.text or 'update-theme' in upload_res.text:
        print("Existing theme found. Confirming replacement with uploaded package...")
        replace_links = re.findall(r'href=["\']([^"\']*(?:update-theme|replace)[^"\']*)["\']', upload_res.text)
        if replace_links:
            rep_url = urljoin(site + '/wp-admin/', unescape(replace_links[0]))
            print(f"Executing replace URL: {rep_url[:80]}...")
            rep_res = get(urlsplit(rep_url).path + ('?' + urlsplit(rep_url).query if urlsplit(rep_url).query else ''), headers={'Referer': upload_res.url})
            print("Theme replaced successfully!")
        else:
            # Look for form submission
            forms = re.findall(r'<form\b[^>]*action=["\']([^"\']+)["\'][^>]*>.*?</form>', upload_res.text, re.S)
            print(f"Found {len(forms)} forms on replace page.")
    elif '테마를 성공적으로 설치했습니다' in upload_res.text or 'Theme installed successfully' in upload_res.text:
        print("Theme installed successfully on first try!")
    else:
        print("Theme install notice: checking installed themes...")

    # Activate theme if not already active
    themes = api_get('themes?context=edit')
    active_theme = next((t for t in themes if t.get('status') == 'active'), None)
    print(f"Active theme: {active_theme.get('name') if active_theme else 'Unknown'}")
    if not active_theme or active_theme.get('stylesheet') != 'jaban-guide':
        print("Activating jaban-guide theme...")
        themes_page = get('/wp-admin/themes.php').text
        match = re.search(r'"activate":"([^"\n]+stylesheet=jaban-guide[^"\n]+)"', themes_page)
        if match:
            act_url = unescape(json.loads('"' + match.group(1) + '"'))
            get(urlsplit(act_url).path + '?' + urlsplit(act_url).query)
            print("Theme activated!")
        else:
            print("Could not find activate link; trying API or direct activation...")

    # 4. Synchronize 7 Pages via REST API
    desired_pages = json.loads(PAGES_PATH.read_text(encoding='utf-8'))
    existing_pages = api_get('pages?context=edit&per_page=100')
    existing_by_slug = {p['slug']: p for p in existing_pages}
    
    print(f"Existing pages count: {len(existing_pages)}")
    created_or_updated = {}

    for p in desired_pages:
        slug = p['slug']
        page_data = {
            'slug': slug,
            'title': p['title'],
            'content': p['content'],
            'template': p['template'],
            'status': 'publish'
        }
        if slug in existing_by_slug:
            pid = existing_by_slug[slug]['id']
            print(f"Updating existing page '{slug}' (ID {pid})...")
            updated = api_post(f"pages/{pid}", page_data)
            created_or_updated[slug] = updated['id']
        else:
            print(f"Creating new page '{slug}'...")
            created = api_post("pages", page_data)
            created_or_updated[slug] = created['id']
    
    # Also handle previous pages: guides -> species, quality -> docs, recipes -> media, support -> process
    # If they exist, update them or ensure their slug links work
    for old_slug, new_target in [('guides', 'species'), ('quality', 'docs'), ('recipes', 'species'), ('support', 'process')]:
        if old_slug in existing_by_slug and old_slug not in created_or_updated:
            print(f"Note: old page '{old_slug}' (ID {existing_by_slug[old_slug]['id']}) exists.")

    # 5. Set front page
    reading_html = get('/wp-admin/options-reading.php').text
    reading_form = first_form(reading_html, 'options.php')
    home_id = created_or_updated.get('jaban-home')
    if home_id:
        print(f"Setting front page to 'jaban-home' (ID {home_id})...")
        post('/wp-admin/options.php', data={
            **reading_form.values,
            'show_on_front': 'page',
            'page_on_front': str(home_id),
            'page_for_posts': '0',
            'blog_public': '0'
        })
        print("Front page set successfully!")

    print("\n=== DEPLOYMENT COMPLETED SUCCESSFULLY ===")
    for slug, pid in created_or_updated.items():
        print(f"- {slug} -> ID {pid} (https://sh8945.mycafe24.com/{slug if slug != 'jaban-home' else ''})")

if __name__ == '__main__':
    main()
