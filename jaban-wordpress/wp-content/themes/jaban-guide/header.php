<?php defined( 'ABSPATH' ) || exit; ?>
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


  <!-- Top Sticky Header -->
  <header class="site-header">
    <div class="header-inner">
      <div class="brand">
        <span class="logo-badge">공식 정보관</span>
        <a href="<?php echo esc_url( home_url( "/" ) ); ?>" class="logo-text">자반고래밥</a>
        <span class="sub-text">식당 · 급식 수산물 안내</span>
      </div>
      
      <nav class="main-nav" aria-label="메인 메뉴">
        <a href="<?php echo esc_url( home_url( "/species/" ) ); ?>" class="nav-link">생선·규격·레시피</a>
        <a href="<?php echo esc_url( home_url( "/process/" ) ); ?>" class="nav-link">구매·발주 요령</a>
        <a href="<?php echo esc_url( home_url( "/company/" ) ); ?>" class="nav-link">제조 핵심가치</a>
        <a href="<?php echo esc_url( home_url( "/docs/" ) ); ?>" class="nav-link">서류 자료실</a>
        <a href="<?php echo esc_url( home_url( "/media/" ) ); ?>" class="nav-link">영상 갤러리</a>
        <a href="#consult" class="nav-link">샘플 상담</a>
      </nav>

      <div class="header-cta">
        <a href="https://gorebob.com/" class="btn-shop" target="_blank" rel="noopener">
          고래밥몰에서 주문 ↗
        </a>
        <button type="button" class="mobile-menu-btn" onclick="toggleMobileMenu()" aria-label="메뉴 열기">
          <span></span><span></span><span></span>
        </button>
      </div>

      <!-- 모바일 드로어 메뉴 -->
      <div class="mobile-drawer" id="mobileDrawer">
        <a href="<?php echo esc_url( home_url( "/" ) ); ?>" class="nav-link">홈 (공식 메인)</a>
        <a href="<?php echo esc_url( home_url( "/mackerel/" ) ); ?>" class="nav-link">고등어 대표 기준관</a>
        <a href="<?php echo esc_url( home_url( "/species/" ) ); ?>" class="nav-link">생선·규격·레시피</a>
        <a href="<?php echo esc_url( home_url( "/process/" ) ); ?>" class="nav-link">구매·발주 요령 (식당 vs 급식)</a>
        <a href="<?php echo esc_url( home_url( "/company/" ) ); ?>" class="nav-link">제조 핵심가치</a>
        <a href="<?php echo esc_url( home_url( "/docs/" ) ); ?>" class="nav-link">서류 자료실</a>
        <a href="<?php echo esc_url( home_url( "/media/" ) ); ?>" class="nav-link">식재료 영상 갤러리</a>
      </div>
    </div>
  </header>

  <main id="main">
