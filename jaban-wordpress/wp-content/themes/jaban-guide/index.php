<?php
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
