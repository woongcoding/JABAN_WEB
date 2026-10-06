<?php
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
    return preg_replace_callback( '/href="([a-z]+)\.html(#[^"]*)?"/', function( $match ) {
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
