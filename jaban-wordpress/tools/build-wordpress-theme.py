"""Package the reviewed static prototype as an editable classic WordPress theme."""
from pathlib import Path
import json,re,zipfile
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'prototype'
THEME=ROOT/'wp-content/themes/jaban-guide'
THEME.mkdir(parents=True,exist_ok=True)
SLUGS={'index':'jaban-home', **{x:x for x in ['company','quality','guides','recipes','support','mackerel']}}

def links(markup):
    def replace(m):
        filename,anchor=m.group(1),m.group(2) or ''
        if filename not in SLUGS: raise ValueError(filename)
        return 'href="<?php echo esc_url( jaban_guide_url( '+repr(filename)+' ) +ANCHOR ); ?>"'.replace(' +ANCHOR', ' . '+repr(anchor) if anchor else '')
    return re.sub(r'href="([a-z]+)\.html(#[^"]*)?"',replace,markup)

home=(SOURCE/'index.html').read_text()
header=home.split('<body>',1)[1].split('<main id="main">',1)[0]
header=header.replace('로컬 검토용 초안','워드프레스 검토용 초안')
footer=home.split('</main>',1)[1].split('</body>',1)[0].replace('로컬 초안','워드프레스 초안')
(THEME/'header.php').write_text('''<?php defined( 'ABSPATH' ) || exit; ?>
<!doctype html><html <?php language_attributes(); ?>><head><meta charset="<?php bloginfo( 'charset' ); ?>"><meta name="viewport" content="width=device-width,initial-scale=1"><?php wp_head(); ?></head><body <?php body_class(); ?>><?php wp_body_open(); ?>
'''+links(header)+'<main id="main">\n')
(THEME/'footer.php').write_text('<?php defined( \'ABSPATH\' ) || exit; ?>\n</main>'+links(footer)+'<?php wp_footer(); ?></body></html>\n')
(THEME/'functions.php').write_text('''<?php
/** Theme helpers for the reviewed Jaban information site. */
defined( 'ABSPATH' ) || exit;
function jaban_guide_setup() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script' ) );
}
add_action( 'after_setup_theme', 'jaban_guide_setup' );
function jaban_guide_assets() {
    wp_enqueue_style( 'jaban-guide', get_stylesheet_uri(), array(), wp_get_theme()->get( 'Version' ) );
}
add_action( 'wp_enqueue_scripts', 'jaban_guide_assets' );
function jaban_guide_url( $name ) {
    $slugs = array( 'index' => 'jaban-home', 'company' => 'company', 'quality' => 'quality', 'guides' => 'guides', 'recipes' => 'recipes', 'support' => 'support', 'mackerel' => 'mackerel' );
    if ( ! isset( $slugs[ $name ] ) ) { return home_url( '/' ); }
    if ( 'index' === $name ) { return set_url_scheme( home_url( '/' ) ); }
    $page = get_page_by_path( $slugs[ $name ], OBJECT, 'page' );
    return $page ? set_url_scheme( get_permalink( $page ) ) : set_url_scheme( home_url( '/' ) );
}
function jaban_guide_content_links( $content ) {
    return preg_replace_callback( '/href="([a-z]+)\\.html(#[^"]*)?"/', function( $match ) {
        return 'href="' . esc_url( jaban_guide_url( $match[1] ) . ( $match[2] ?? '' ) ) . '"';
    }, $content );
}
add_filter( 'the_content', 'jaban_guide_content_links', 9 );
// This theme is currently for review on the temporary hosting domain.
add_filter( 'wp_robots', 'wp_robots_no_robots' );
function jaban_guide_review_headers() {
    if ( ! headers_sent() ) { header( 'X-Robots-Tag: noindex, nofollow', true ); }
}
add_action( 'send_headers', 'jaban_guide_review_headers' );
''')
(THEME/'page.php').write_text('''<?php defined( 'ABSPATH' ) || exit; get_header(); ?>
<?php while ( have_posts() ) : the_post(); the_content(); endwhile; ?>
<?php get_footer(); ?>
''')
(THEME/'front-page.php').write_text("<?php defined( 'ABSPATH' ) || exit; get_template_part( 'page' ); ?>\n")
(THEME/'index.php').write_text('''<?php defined( 'ABSPATH' ) || exit; get_header(); ?>
<section><h1><?php echo esc_html( get_bloginfo( 'name' ) ); ?></h1>
<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
<article><h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2><?php the_excerpt(); ?></article>
<?php endwhile; the_posts_navigation(); else : ?><p>表示할 콘텐츠를 준비 중입니다.</p><?php endif; ?></section>
<?php get_footer(); ?>
'''.replace('表示할','표시할'))
(THEME/'404.php').write_text('''<?php defined( 'ABSPATH' ) || exit; get_header(); ?>
<section><h1>페이지를 찾을 수 없습니다</h1><p>주소를 확인하거나 홈에서 필요한 정보를 찾아보세요.</p><a class="button" href="<?php echo esc_url( jaban_guide_url( 'index' ) ); ?>">홈으로 이동</a></section>
<?php get_footer(); ?>
''')
(THEME/'style.css').write_text('''/*
Theme Name: Jaban Guide
Description: 자반고래밥 제품 선택·조리 안내 검토용 테마
Version: 0.1.0
Requires at least: 6.0
Requires PHP: 7.4
Text Domain: jaban-guide
*/
'''+(SOURCE/'style.css').read_text()+'\n@media(prefers-reduced-motion:reduce){.portal-card{transition:none}.portal-card:hover{transform:none}}\n')
pages=[]
for filename,slug in SLUGS.items():
    html=(SOURCE/(filename+'.html')).read_text()
    body=html.split('<main id="main">',1)[1].split('</main>',1)[0]
    title=re.search('<title>(.*?)</title>',html).group(1).removesuffix(' · 로컬 초안')
    pages.append({'slug':slug,'title':title,'content':'<!-- wp:html -->\n'+body+'\n<!-- /wp:html -->','status':'publish'})
DIST=ROOT/'dist'; DIST.mkdir(exist_ok=True)
(DIST/'pages.json').write_text(json.dumps(pages,ensure_ascii=False,indent=2)+'\n')
with zipfile.ZipFile(DIST/'jaban-guide.zip','w',zipfile.ZIP_DEFLATED) as z:
    for file in sorted(THEME.iterdir()): z.write(file,'jaban-guide/'+file.name)
print('Built theme ZIP and 7 editable page bodies.')
