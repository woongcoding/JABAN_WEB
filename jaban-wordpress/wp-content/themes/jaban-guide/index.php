<?php defined( 'ABSPATH' ) || exit; get_header(); ?>
<section><h1><?php echo esc_html( get_bloginfo( 'name' ) ); ?></h1>
<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
<article><h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2><?php the_excerpt(); ?></article>
<?php endwhile; the_posts_navigation(); else : ?><p>표시할 콘텐츠를 준비 중입니다.</p><?php endif; ?></section>
<?php get_footer(); ?>
