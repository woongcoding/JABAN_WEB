<?php
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
