<?php
/**
 * Template Name: 식재료 조리 & 공정 영상 갤러리 | 자반고래밥
 * Template Post Type: page
 */
defined( 'ABSPATH' ) || exit;
get_header();
?>

    
    <!-- Sub-Hero -->
    <section class="subpage-hero">
      <div class="section-container">
        <span class="eyebrow" style="background:#fee2e2; color:#ef4444;">YOUTUBE VIDEO GALLERY</span>
        <h1>생선 식재료 동영상 갤러리</h1>
        <p>
          긴 글보다 명쾌한 30초 실증 영상! 급식실 콤비오븐 대량 조리부터 1초 언패킹 직화 팬 구이, 
          안전한 가시 제거 공정까지 유튜브에 등록된 생생한 조리 영상을 한곳에서 확인하세요.
        </p>
      </div>
    </section>

    <!-- 비디오 갤러리 섹션 -->
    <section class="section">
      <div class="section-container">
        
        <div class="section-header" style="display:flex; justify-content:space-between; align-items:flex-end;">
          <div>
            <span class="eyebrow">VIDEO PLAYLIST</span>
            <h2 class="section-title">주방 현장 실증 영상 목록</h2>
            <p class="section-desc">원하시는 영상을 클릭하시면 플레이어 팝업으로 즉시 시청하실 수 있습니다.</p>
          </div>

          <div style="font-size:0.9rem; color:var(--color-text-muted);">
            총 <strong>6개</strong>의 실증 영상 등록됨
          </div>
        </div>

        <div class="video-gallery-grid">
          
          <!-- Video 1 -->
          <article class="video-gallery-card" onclick="openVideoPlayer('shorts_oven')">
            <div class="gallery-thumb-wrap">
              <img src="<?php echo esc_url( get_template_directory_uri() . "/assets/shorts_oven.jpg" ); ?>" alt="콤비오븐 조리 영상">
              <div class="play-overlay-icon">▶</div>
              <span class="recipe-time-badge" style="background:rgba(239,68,68,0.9);">0:30 SHORTS</span>
            </div>
            <div class="gallery-card-body">
              <div class="gallery-tag">#대량조리 #콤비오븐 #단체급식</div>
              <h4>"10분 만에 50토막 끝!" 급식실 콤비오븐 세팅 쾌감</h4>
              <p>포장 뜯고 오븐 트레이에 정렬하는 데 단 48초. 껍질 바삭한 고등어 콤비오븐 세팅 공식.</p>
            </div>
          </article>

          <!-- Video 2 -->
          <article class="video-gallery-card" onclick="openVideoPlayer('shorts_unpack')">
            <div class="gallery-thumb-wrap">
              <img src="<?php echo esc_url( get_template_directory_uri() . "/assets/shorts_unpack.jpg" ); ?>" alt="1초 언패킹 영상">
              <div class="play-overlay-icon">▶</div>
              <span class="recipe-time-badge" style="background:rgba(239,68,68,0.9);">0:20 SHORTS</span>
            </div>
            <div class="gallery-card-body">
              <div class="gallery-tag">#식당구이 #비린내ZERO #1초조리</div>
              <h4>손에 물 한 방울 안 묻히는 1초 언패킹 & 직화 팬 구이</h4>
              <p>싱크대 청소 제로! 가위로 뜯어 달궈진 팬에 미끄러뜨리는 간편 조리 실증.</p>
            </div>
          </article>

          <!-- Video 3 -->
          <article class="video-gallery-card" onclick="openVideoPlayer('shorts_braise')">
            <div class="gallery-thumb-wrap">
              <img src="<?php echo esc_url( get_template_directory_uri() . "/assets/shorts_braise.jpg" ); ?>" alt="뚝배기 조림 영상">
              <div class="play-overlay-icon">▶</div>
              <span class="recipe-time-badge" style="background:rgba(239,68,68,0.9);">0:35 SHORTS</span>
            </div>
            <div class="gallery-card-body">
              <div class="gallery-tag">#조림요리 #살안부서짐 #양념흡수</div>
              <h4>끓여도 살이 부서지지 않는 단단한 정량 토막 비법</h4>
              <p>센 불에 20분 이상 졸여도 형태가 유지되고 무와 국물에 감칠맛이 배는 비결.</p>
            </div>
          </article>

          <!-- Video 4 -->
          <article class="video-gallery-card" onclick="openVideoPlayer('video_teriyaki')">
            <div class="gallery-thumb-wrap">
              <img src="<?php echo esc_url( get_template_directory_uri() . "/assets/fillets_display.jpg" ); ?>" alt="삼치 데리야끼 조리 영상" style="object-position:center;">
              <div class="play-overlay-icon">▶</div>
              <span class="recipe-time-badge" style="background:rgba(239,68,68,0.9);">0:45 SHORTS</span>
            </div>
            <div class="gallery-card-body">
              <div class="gallery-tag">#삼치 #가시제로 #학생급식1위</div>
              <h4>가시 컴플레인 없는 순살 삼치 데리야끼 글레이즈 조리법</h4>
              <p>부드러운 살코기에 윤기 나는 데리야끼 소스를 얹어 학생 급식 배식하는 현장 컷.</p>
            </div>
          </article>

          <!-- Video 5 -->
          <article class="video-gallery-card" onclick="openVideoPlayer('video_factory')">
            <div class="gallery-thumb-wrap">
              <img src="<?php echo esc_url( get_template_directory_uri() . "/assets/step_metal.jpg" ); ?>" alt="위생 공정 영상">
              <div class="play-overlay-icon">▶</div>
              <span class="recipe-time-badge" style="background:rgba(239,68,68,0.9);">0:40 CLIP</span>
            </div>
            <div class="gallery-card-body">
              <div class="gallery-tag">#HACCP #CCP2P #금속검출기</div>
              <h4>자반고래밥 HACCP 공장 금속검출 CCP-2P 및 핀셋 가시제거</h4>
              <p>미세 낚싯바늘과 잔가시를 걸러내는 7단계 위생 검증 라인 현장 영상.</p>
            </div>
          </article>

          <!-- Video 6 -->
          <article class="video-gallery-card" onclick="openVideoPlayer('video_crispy')">
            <div class="gallery-thumb-wrap">
              <img src="<?php echo esc_url( get_template_directory_uri() . "/assets/step_tray.jpg" ); ?>" alt="종이호일 팁 영상">
              <div class="play-overlay-icon">▶</div>
              <span class="recipe-time-badge" style="background:rgba(239,68,68,0.9);">0:30 SHORTS</span>
            </div>
            <div class="gallery-card-body">
              <div class="gallery-tag">#오븐청소꿀팁 #종이호일 #타공법</div>
              <h4>생선 껍질 1도 안 눌어붙는 콤비오븐 타공 종이호일 세팅 공식</h4>
              <p>팬 설거지 시간을 80% 줄이고 기름은 쏙 빠지는 조리실 꿀팁 영상.</p>
            </div>
          </article>

        </div>

        <!-- 유튜브 채널 구독 안내 -->
        <div style="margin-top:3.5rem; background:var(--color-bg-subtle); border:1px solid var(--color-border); border-radius:var(--radius-md); padding:2rem; text-align:center;">
          <h4 style="font-size:1.25rem; font-weight:800; color:var(--color-primary); margin-bottom:0.5rem;">
            더 많은 업소용 조리 영상과 꿀팁을 유튜브 채널에서 확인하세요
          </h4>
          <p style="font-size:0.95rem; color:var(--color-text-muted); margin-bottom:1.5rem;">
            매주 새로운 어종 손질법, 대용량 오븐 세팅 노하우, 잔반 줄이기 팁이 업로드됩니다.
          </p>
          <a href="https://www.youtube.com" class="btn-primary" target="_blank" rel="noopener" style="background:#ff0000;">
            ▶ 자반고래밥 유튜브 공식 채널 바로가기 ↗
          </a>
        </div>

      </div>
    </section>

  
<?php
get_footer();
