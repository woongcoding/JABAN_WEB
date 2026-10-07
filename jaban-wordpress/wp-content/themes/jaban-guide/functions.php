<?php
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
    $content = preg_replace_callback( '/href="([a-z0-9_-]+)\.html(#[^"]*)?"/', function( $m ) {
        $file = $m[1];
        $anchor = $m[2] ?? '';
        return 'href="' . esc_url( jaban_guide_url( $file ) . $anchor ) . '"';
    }, $content );
    
    // Convert assets relative path in content
    $content = preg_replace(
        '/(src|poster)=["\']assets\/([^"\']+)["\']/',
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
