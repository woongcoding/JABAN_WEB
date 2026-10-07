<?php defined( 'ABSPATH' ) || exit; ?>
</main>


  <!-- Video Player Modal Dialog -->
  <div class="modal-overlay" id="videoPlayerModal">
    <div class="modal-box" style="max-width: 540px;">
      <div class="modal-header">
        <h3 id="modalVideoTitle">조리 실증 숏폼 영상</h3>
        <button type="button" class="modal-close-btn" onclick="closeVideoPlayer()">✕</button>
      </div>
      <div class="modal-body" style="padding:0;">
        <div style="width:100%; aspect-ratio:9/14; background:#000; position:relative;">
          <img id="modalVideoThumb" src="<?php echo esc_url( get_template_directory_uri() . "/assets/shorts_oven.jpg" ); ?>" alt="영상 화면" style="width:100%; height:100%; object-fit:cover;">
          <div style="position:absolute; bottom:1.5rem; left:1.5rem; right:1.5rem; background:rgba(15,23,42,0.92); padding:1.25rem; border-radius:var(--radius-sm); color:#fff; backdrop-filter:blur(4px);">
            <div style="display:inline-block; font-size:0.75rem; font-weight:800; background:var(--color-secondary); color:#fff; padding:0.2rem 0.5rem; border-radius:4px; margin-bottom:0.5rem;">자반고래밥 30초 실증 클립</div>
            <p id="modalVideoDesc" style="font-size:0.85rem; line-height:1.5; margin-bottom:0.85rem; color:#cbd5e1;"></p>
            <a href="https://gorebob.com/" class="btn-shop" style="width:100%; justify-content:center;" target="_blank" rel="noopener">
              영상 속 제품 고래밥몰에서 주문 ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Recipe Detail Modal Dialog -->
  <div class="modal-overlay" id="recipeModal">
    <div class="modal-box" style="max-width: 600px;">
      <div class="modal-header">
        <h3 id="modalRecipeTitle">단체급식 표준 레시피</h3>
        <button type="button" class="modal-close-btn" onclick="closeRecipeModal()">✕</button>
      </div>
      <div class="modal-body" id="modalRecipeBody" style="padding: 1.5rem;">
        <!-- JS 동적 렌더링 -->
      </div>
    </div>
  </div>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-top">
        <div class="footer-brand">
          <h4>(주)자반고래밥 공식 규격 정보관</h4>
          <p>식당과 단체급식을 위한 신선 수산물 직영 가공 제조 전문</p>
        </div>
        <div class="footer-links">
          <a href="<?php echo esc_url( home_url( "/species/" ) ); ?>">생선·규격·레시피</a>
          <a href="<?php echo esc_url( home_url( "/process/" ) ); ?>">구매·발주 요령</a>
          <a href="<?php echo esc_url( home_url( "/company/" ) ); ?>">제조 핵심가치</a>
          <a href="<?php echo esc_url( home_url( "/docs/" ) ); ?>">서류 자료실</a>
          <a href="<?php echo esc_url( home_url( "/media/" ) ); ?>">영상 갤러리</a>
          <a href="https://gorebob.com/" target="_blank" rel="noopener"><strong>고래밥몰 주문 ↗</strong></a>
        </div>
      </div>

      <div class="footer-bottom">
        <p>상호: (주)자반 | 대표: 김지웅 | 사업자등록번호: 000-00-00000 | 본사 및 가공공장: 부산광역시 사하구</p>
        <p>고객센터: 051-000-0000 | 이메일: fineplanning@gmail.com | © JABAN All rights reserved.</p>
      </div>
    </div>
  </footer>

  <script src="site.js"></script>

<?php wp_footer(); ?>
</body>
</html>
