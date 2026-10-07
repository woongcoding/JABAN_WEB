"""Package the approved prototype-gemini as a fully featured WordPress theme and page set."""
import os, sys, re, json, shutil, zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'prototype-gemini'
THEME = ROOT / 'wp-content/themes/jaban-guide'
DIST = ROOT / 'dist'
THEME.mkdir(parents=True, exist_ok=True)
DIST.mkdir(parents=True, exist_ok=True)

# 1. Assets Copy
THEME_ASSETS = THEME / 'assets'
THEME_ASSETS.mkdir(exist_ok=True)
src_assets = SOURCE / 'assets'
if src_assets.exists():
    for f in src_assets.iterdir():
        if f.is_file():
            shutil.copy2(f, THEME_ASSETS / f.name)
print(f"Copied {len(list(THEME_ASSETS.iterdir()))} asset files to theme.")

# 2. Pages Definition
PAGES = [
    {
        'file': 'index.html',
        'slug': 'jaban-home',
        'title': '자반고래밥 | 식당 · 단체급식을 위한 신선 생선 가공 규격 및 발주 안내',
        'template': 'front-page.php',
        'is_home': True
    },
    {
        'file': 'process.html',
        'slug': 'process',
        'title': '구매 프로세스 & 주문 요령 | 자반고래밥 B2B 발주 안내',
        'template': 'page-process.php',
        'is_home': False
    },
    {
        'file': 'mackerel.html',
        'slug': 'mackerel',
        'title': '고등어 대표 규격 기준관 | 자반고래밥 수산물 표준',
        'template': 'page-mackerel.php',
        'is_home': False
    },
    {
        'file': 'species.html',
        'slug': 'species',
        'title': '어종별 가공 규격 & 단체급식 레시피 | 자반고래밥',
        'template': 'page-species.php',
        'is_home': False
    },
    {
        'file': 'company.html',
        'slug': 'company',
        'title': '제조 핵심가치 & 위생 가공 공정 | (주)자반고래밥',
        'template': 'page-company.php',
        'is_home': False
    },
    {
        'file': 'docs.html',
        'slug': 'docs',
        'title': '행정 서류 자료실 (HACCP·성적서) | (주)자반고래밥',
        'template': 'page-docs.php',
        'is_home': False
    },
    {
        'file': 'media.html',
        'slug': 'media',
        'title': '식재료 조리 & 공정 영상 갤러리 | 자반고래밥',
        'template': 'page-media.php',
        'is_home': False
    }
]

SLUG_MAP = {
    'index.html': 'jaban-home',
    'process.html': 'process',
    'mackerel.html': 'mackerel',
    'species.html': 'species',
    'company.html': 'company',
    'docs.html': 'docs',
    'media.html': 'media'
}

def replace_links_and_assets(markup):
    # Replace links to .html files with WP page links
    def link_repl(m):
        fname = m.group(1)
        anchor = m.group(2) or ''
        slug = SLUG_MAP.get(fname, '')
        if slug == 'jaban-home':
            url_code = '<?php echo esc_url( home_url( "/" )' + ((' . ' + repr(anchor)) if anchor else '') + ' ); ?>'
        elif slug:
            url_code = '<?php echo esc_url( home_url( "/' + slug + '/" )' + ((' . ' + repr(anchor)) if anchor else '') + ' ); ?>'
        else:
            url_code = m.group(0)
        return f'href="{url_code}"'
    
    markup = re.sub(r'href="([a-z0-9_-]+\.html)(#[^"]*)?"', link_repl, markup)
    
    # Replace relative assets paths to get_template_directory_uri()
    markup = re.sub(
        r'(src|poster)=["\']assets/([^"\']+)["\']',
        r'\1="<?php echo esc_url( get_template_directory_uri() . "/assets/\2" ); ?>"',
        markup
    )
    return markup

# 3. Create header.php
home_html = (SOURCE / 'index.html').read_text(encoding='utf-8')
header_raw = home_html.split('<body>', 1)[1].split('<main id="main">', 1)[0]
header_php = '''<?php defined( 'ABSPATH' ) || exit; ?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo( 'charset' ); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
  <?php wp_head(); ?>
  <script>window.JABAN_THEME_URI = "<?php echo esc_url( get_template_directory_uri() ); ?>/";</script>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
''' + replace_links_and_assets(header_raw) + '<main id="main">\n'
(THEME / 'header.php').write_text(header_php, encoding='utf-8')

# 4. Create footer.php
# Collect modals and footer from index.html
footer_raw = home_html.split('</main>', 1)[1].split('</body>', 1)[0]
footer_php = '''<?php defined( 'ABSPATH' ) || exit; ?>
</main>
''' + replace_links_and_assets(footer_raw) + '''
<?php wp_footer(); ?>
</body>
</html>
'''
(THEME / 'footer.php').write_text(footer_php, encoding='utf-8')

# 5. Create style.css
css_raw = (SOURCE / 'style.css').read_text(encoding='utf-8')
theme_css = '''/*
Theme Name: Jaban Guide
Theme URI: https://jaban.co.kr/
Description: (주)자반고래밥 B2B 공식 규격 정보관 테마 (식당 vs 단체급식 듀얼 트랙 완전 통합본)
Author: (주)자반 김지웅
Version: 1.0.0
Requires at least: 6.0
Requires PHP: 7.4
Text Domain: jaban-guide
*/
''' + css_raw
(THEME / 'style.css').write_text(theme_css, encoding='utf-8')

# 6. Create site.js
js_raw = (SOURCE / 'site.js').read_text(encoding='utf-8')
# Enhance site.js so that videoDetails thumbs use JABAN_THEME_URI
js_enhanced = js_raw.replace("thumb: 'assets/", "thumb: (window.JABAN_THEME_URI || '') + 'assets/")
(THEME / 'site.js').write_text(js_enhanced, encoding='utf-8')

# 7. Create Page Templates and Extract Bodies for WordPress Pages
pages_json = []

for page in PAGES:
    html_content = (SOURCE / page['file']).read_text(encoding='utf-8')
    main_body = html_content.split('<main id="main">', 1)[1].split('</main>', 1)[0]
    
    # Process for PHP Template
    tpl_code = f'''<?php
/**
 * Template Name: {page['title']}
 * Template Post Type: page
 */
defined( 'ABSPATH' ) || exit;
get_header();
?>
{replace_links_and_assets(main_body)}
<?php
get_footer();
'''
    (THEME / page['template']).write_text(tpl_code, encoding='utf-8')
    
    # Process body for WordPress Page Content (Gutenberg HTML block)
    # Inside WP content filter, assets and links will be converted dynamically by functions.php
    pages_json.append({
        'slug': page['slug'],
        'title': page['title'],
        'template': page['template'],
        'content': f'<!-- wp:html -->\n{main_body.strip()}\n<!-- /wp:html -->',
        'status': 'publish',
        'is_home': page['is_home']
    })

# Also write index.php, page.php, 404.php
(THEME / 'page.php').write_text('''<?php
defined( 'ABSPATH' ) || exit;
get_header();
while ( have_posts() ) : the_post();
    the_content();
endwhile;
get_footer();
''', encoding='utf-8')

(THEME / 'index.php').write_text('''<?php
defined( 'ABSPATH' ) || exit;
get_header();
if ( have_posts() ) :
    while ( have_posts() ) : the_post();
        the_content();
    endwhile;
else :
    echo '<section class="section"><div class="section-container"><p>콘텐츠를 준비 중입니다.</p></div></section>';
endif;
get_footer();
''', encoding='utf-8')

(THEME / '404.php').write_text('''<?php
defined( 'ABSPATH' ) || exit;
get_header();
?>
<section class="section" style="padding:6rem 0; text-align:center;">
  <div class="section-container">
    <h1 style="font-size:2.5rem; font-weight:900; color:var(--color-primary); margin-bottom:1rem;">페이지를 찾을 수 없습니다</h1>
    <p style="font-size:1.1rem; color:var(--color-text-muted); margin-bottom:2rem;">요청하신 페이지가 삭제되었거나 주소가 변경되었습니다.</p>
    <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="btn-primary">홈으로 이동하기 →</a>
  </div>
</section>
<?php
get_footer();
''', encoding='utf-8')

# 8. Create functions.php
functions_php = '''<?php
/**
 * Jaban Guide Theme Functions & Definitions
 */
defined( 'ABSPATH' ) || exit;

function jaban_guide_setup() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script' ) );
    register_nav_menus( array(
        'primary' => __( '메인 네비게이션', 'jaban-guide' ),
    ) );
}
add_action( 'after_setup_theme', 'jaban_guide_setup' );

function jaban_guide_scripts() {
    wp_enqueue_style( 'jaban-guide-style', get_stylesheet_uri(), array(), '1.0.0' );
    wp_enqueue_script( 'jaban-guide-script', get_template_directory_uri() . '/site.js', array(), '1.0.0', true );
}
add_action( 'wp_enqueue_scripts', 'jaban_guide_scripts' );

// URL resolver helper
function jaban_guide_url( $slug ) {
    $map = array(
        'index' => '/',
        'jaban-home' => '/',
        'process' => '/process/',
        'mackerel' => '/mackerel/',
        'species' => '/species/',
        'company' => '/company/',
        'docs' => '/docs/',
        'media' => '/media/',
        // Aliases from old versions
        'guides' => '/species/',
        'quality' => '/docs/',
        'recipes' => '/species/',
        'support' => '/process/'
    );
    $path = isset( $map[ $slug ] ) ? $map[ $slug ] : '/' . $slug . '/';
    return home_url( $path );
}

// Convert links in content dynamically
function jaban_filter_content_links( $content ) {
    $content = preg_replace_callback( '/href="([a-z0-9_-]+)\\.html(#[^"]*)?"/', function( $m ) {
        $file = $m[1];
        $anchor = $m[2] ?? '';
        return 'href="' . esc_url( jaban_guide_url( $file ) . $anchor ) . '"';
    }, $content );
    
    // Convert assets relative path in content
    $content = preg_replace(
        '/(src|poster)=["\\\']assets\\/([^"\\\']+)["\\\']/',
        '$1="' . esc_url( get_template_directory_uri() . '/assets/' ) . '$2"',
        $content
    );
    return $content;
}
add_filter( 'the_content', 'jaban_filter_content_links', 9 );

// Review headers for temporary development environment
add_filter( 'wp_robots', 'wp_robots_no_robots' );
function jaban_review_headers() {
    if ( ! headers_sent() ) {
        header( 'X-Robots-Tag: noindex, nofollow', true );
    }
}
add_action( 'send_headers', 'jaban_review_headers' );
'''
(THEME / 'functions.php').write_text(functions_php, encoding='utf-8')

# 9. Save pages.json
(DIST / 'pages.json').write_text(json.dumps(pages_json, ensure_ascii=False, indent=2), encoding='utf-8')
print(f"Saved {len(pages_json)} pages in {DIST / 'pages.json'}")

# 10. Create ZIP package
zip_path = DIST / 'jaban-guide.zip'
with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as z:
    for root, dirs, files in os.walk(THEME):
        for f in files:
            full_path = Path(root) / f
            rel_path = full_path.relative_to(THEME.parent)
            z.write(full_path, str(rel_path))
print(f"Built Theme ZIP package: {zip_path} ({zip_path.stat().st_size} bytes)")
