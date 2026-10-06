"""Deploy the reviewed theme/pages to the explicitly selected Cafe24 test site.
Credentials stay in .env; rollback snapshots stay in ignored private/.
"""
from pathlib import Path
from html.parser import HTMLParser
from html import unescape
from urllib.parse import urljoin,urlsplit
from datetime import datetime
import json,re,sys
import requests
from dotenv import dotenv_values

ROOT=Path(__file__).resolve().parents[2]
SITE_ALLOWED='https://sh8945.mycafe24.com'
class Form(HTMLParser):
    def __init__(self,markup):
        super().__init__(); self.values={}; self.action=''; self.feed(markup)
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='form': self.action=a.get('action','')
        if tag=='input' and 'name' in a:
            if a.get('type') in ('radio','checkbox') and 'checked' not in a: return
            if a.get('type') in ('file','submit','button'): return
            self.values[a['name']]=a.get('value','')
def first_form(markup,marker):
    forms=re.findall(r'<form\b[^>]*>.*?</form>',markup,re.S)
    matches=[f for f in forms if marker in f]
    if len(matches)!=1: raise RuntimeError('Expected one '+marker+' form')
    return Form(matches[0])
def require(response):
    
    if not response.ok:
        try: code=response.json().get('code','')
        except ValueError: code=''
        title=re.search(r'<title>(.*?)</title>',response.text,re.S)
        raise RuntimeError('HTTP '+str(response.status_code)+' '+urlsplit(response.url).path+' '+str(code)+' '+(title.group(1)[:100] if title else ''))
    return response

def main():
    config=dotenv_values(ROOT/'.env',interpolate=False)
    site=config['WP_SITE_URL'].rstrip('/').replace('http:','https:')
    if site!=SITE_ALLOWED: raise RuntimeError('Unexpected deployment host')
    session=requests.Session()
    session.headers['User-Agent']='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36'
    def get(path): return require(session.get(site+path,timeout=45))
    def post(path,**kwargs): return require(session.post(site+path,timeout=60,**kwargs))
    get('/wp-login.php')
    r=post('/wp-login.php',data={'log':config['WP_ADMIN_USER'],'pwd':config['WP_ADMIN_PASSWORD'],'wp-submit':'Log In','redirect_to':site+'/wp-admin/','testcookie':'1'})
    if 'id="wpadminbar"' not in r.text: raise RuntimeError('Authentication failed')
    page=get('/wp-admin/post-new.php?post_type=page')
    api=re.search(r'(?:var )?wpApiSettings\s*=\s*({.*?});',page.text)
    match=re.search(r'"nonce"\s*:\s*"([^"]+)"',page.text)
    if not api and not match: raise RuntimeError('REST configuration unavailable')
    nonce=json.loads(api.group(1))['nonce'] if api else match.group(1)
    headers={'X-WP-Nonce':nonce}
    def api_get(path): return require(session.get(site+'/wp-json/wp/v2/'+path,headers=headers,timeout=45)).json()
    def api_post(path,data): return require(session.post(site+'/wp-json/wp/v2/'+path,headers=headers,json=data,timeout=45)).json()
    existing=api_get('pages?context=edit&per_page=100')
    themes=api_get('themes?context=edit')
    reading_html=get('/wp-admin/options-reading.php').text
    reading=first_form(reading_html,'options.php')
    # Store rollback input/settings before making any write. Nonces/cookies are omitted.
    backup=ROOT/'private'/('wp-before-jaban-'+datetime.now().strftime('%Y%m%d-%H%M%S')+'.json')
    snapshot={'site':site,'themes':themes,'pages':existing,'reading':{k:v for k,v in reading.values.items() if 'nonce' not in k and 'referer' not in k},'created_pages':[]}
    backup.write_text(json.dumps(snapshot,ensure_ascii=False,indent=2)+'\n'); backup.chmod(0o600)
    print('Authenticated; previous themes/pages/settings saved privately.',flush=True)
    if any(t['stylesheet']=='jaban-guide' for t in themes): raise RuntimeError('Theme already installed; stop to avoid overwriting')
    desired=json.loads((ROOT/'jaban-wordpress/dist/pages.json').read_text())
    collisions=[p['slug'] for p in existing if p['slug'] in {d['slug'] for d in desired}]
    if collisions: raise RuntimeError('Existing page slugs require review: '+', '.join(collisions))
    upload=first_form(get('/wp-admin/theme-install.php?tab=upload').text,'themezip')
    action=urljoin(site,upload.action)
    if urlsplit(action).hostname!=urlsplit(site).hostname: raise RuntimeError('Unexpected upload destination')
    with (ROOT/'jaban-wordpress/dist/jaban-guide.zip').open('rb') as file:
        result=require(session.post(action,data={**upload.values,'install-theme-submit':'Install Now'},files={'themezip':('jaban-guide.zip',file,'application/zip')},headers={'Referer':site+'/wp-admin/theme-install.php?tab=upload','Origin':site},timeout=90))
    installed=api_get('themes?context=edit')
    if not any(t['stylesheet']=='jaban-guide' for t in installed):
        # Redacted notices are not printed because responses can contain credentials.
        raise RuntimeError('Theme was not installed; see server administrator')
    print('Jaban Guide theme installed.',flush=True)
    activation_links=re.findall(r'href=["\']([^"\']+)["\']',result.text)
    activation=[urljoin(site,x.replace('&amp;','&')) for x in activation_links if 'action=activate' in x and 'stylesheet=jaban-guide' in x]
    if len(activation)!=1:
        text=get('/wp-admin/themes.php').text
        action_match=re.search(r'"activate":"([^"\n]+stylesheet=jaban-guide[^"\n]+)"',text)
        if not action_match: raise RuntimeError('Activation link unavailable')
        activation=[unescape(json.loads('"'+action_match.group(1)+'"'))]
    ids={}
    for data in desired:
        created=api_post('pages',data)
        ids[data['slug']]=created['id']; snapshot['created_pages'].append(created['id'])
        backup.write_text(json.dumps(snapshot,ensure_ascii=False,indent=2)+'\n')
        print('Created page:',data['slug'],created['id'],flush=True)
    fresh=first_form(get('/wp-admin/options-reading.php').text,'options.php')
    # WordPress requires both front-page selectors; the posts page remains unset.
    data={**fresh.values,'show_on_front':'page','page_on_front':str(ids['jaban-home']),'page_for_posts':'0','blog_public':'0'}
    post('/wp-admin/options.php',data=data)
    if urlsplit(activation[0]).hostname!=urlsplit(site).hostname: raise RuntimeError('Unexpected activation destination')
    require(session.get(activation[0],timeout=60))
    active=api_get('themes?context=edit')
    if not any(t['stylesheet']=='jaban-guide' and t['status']=='active' for t in active): raise RuntimeError('Activation verification failed')
    public=requests.get(site+'/?jaban_check='+datetime.now().strftime('%H%M%S'),timeout=45)
    require(public)
    if '생선 선택에 필요한 정보' not in public.text or '/themes/jaban-guide/style.css' not in public.text: raise RuntimeError('Front page verification failed')
    report={'site':site,'theme':'jaban-guide','page_ids':ids,'rollback_snapshot':backup.name,'http_status':public.status_code,'robots':public.headers.get('X-Robots-Tag')}
    (ROOT/'private/wp-jaban-deployment.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(report,ensure_ascii=False),flush=True)
    session.cookies.clear()

if __name__=='__main__':
    try: main()
    except Exception as e:
        print('Deployment stopped:',type(e).__name__,str(e) if isinstance(e,RuntimeError) else 'Request failed; credentials were not printed.',flush=True)
        sys.exit(1)
