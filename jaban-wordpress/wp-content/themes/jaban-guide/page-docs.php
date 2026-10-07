<?php
/**
 * Template Name: 행정 서류 자료실 (HACCP·성적서) | (주)자반고래밥
 * Template Post Type: page
 */
defined( 'ABSPATH' ) || exit;
get_header();
?>

    
    <!-- Sub-Hero -->
    <section class="subpage-hero">
      <div class="section-container">
        <span class="eyebrow">QUALITY ASSURANCE & DOCUMENTS</span>
        <h1>품질 증빙 및 행정 서류 자료실</h1>
        <p>
          학교, 병원, 기업 구내식당 및 프랜차이즈 본사 품의에 필요한<br>
          식약처 HACCP 지정서, 자가품질검사 성적서, 원산지 증명원을 원클릭으로 열람하고 사본을 다운로드하세요.
        </p>
      </div>
    </section>

    <!-- 서류 목록 그리드 -->
    <section class="section">
      <div class="section-container">
        
        <div class="section-header">
          <span class="eyebrow">DOWNLOAD CENTER</span>
          <h2 class="section-title">급식 품의용 필수 제출 서류 목록</h2>
          <p class="section-desc">모든 서류는 최신 유효기간 기준으로 관리되며, 미리보기 버튼을 통해 주요 기재사항을 확인하실 수 있습니다.</p>
        </div>

        <div class="doc-responsive-grid">
          
          <!-- Doc 1: HACCP 지정서 -->
          <div class="doc-card" style="padding:1.75rem;">
            <div>
              <div class="icon">📜</div>
              <span class="badge" style="color:var(--color-secondary); font-weight:700; font-size:0.75rem;">식품의약품안전처</span>
              <h4 style="font-size:1.15rem; margin-top:0.25rem;">HACCP 적용업소 지정서</h4>
              <p>원물 세척부터 금속검출, 급속동결까지 안전관리기준 적합 판정을 받은 공식 인증서 사본입니다.</p>
              <div style="font-size:0.8rem; color:var(--color-text-muted); background:var(--color-bg-subtle); padding:0.5rem; border-radius:4px; margin-bottom:1rem;">
                • 적용 품목: 어류가공품 (수산물)<br>
                • 관리 기준: CCP-2P 금속검출 공정 포함
              </div>
            </div>
            <div style="display:flex; gap:0.5rem;">
              <button type="button" class="btn-outline" style="flex:1; padding:0.5rem; font-size:0.8rem;" onclick="openDocModal('haccp')">미리보기</button>
              <button type="button" class="btn-primary" style="flex:1; padding:0.5rem; font-size:0.8rem;" onclick="alert('HACCP 지정서 PDF 다운로드가 준비되었습니다.')">PDF 다운 ↓</button>
            </div>
          </div>

          <!-- Doc 2: 시험검사 성적서 -->
          <div class="doc-card" style="padding:1.75rem;">
            <div>
              <div class="icon">🔬</div>
              <span class="badge" style="color:var(--color-secondary); font-weight:700; font-size:0.75rem;">공인인증 검사기관</span>
              <h4 style="font-size:1.15rem; margin-top:0.25rem;">자가품질검사 시험성적서</h4>
              <p>미생물, 식중독균, 중금속(납, 카드뮴, 총수은), 방사능 전수 검사 결과 불검출/적합 성적서입니다.</p>
              <div style="font-size:0.8rem; color:var(--color-text-muted); background:var(--color-bg-subtle); padding:0.5rem; border-radius:4px; margin-bottom:1rem;">
                • 검사 항목: 장염비브리오, 살모넬라, 방사능<br>
                • 판정 결과: 전 항목 적합 (음성)
              </div>
            </div>
            <div style="display:flex; gap:0.5rem;">
              <button type="button" class="btn-outline" style="flex:1; padding:0.5rem; font-size:0.8rem;" onclick="openDocModal('test_report')">미리보기</button>
              <button type="button" class="btn-primary" style="flex:1; padding:0.5rem; font-size:0.8rem;" onclick="alert('시험성적서 사본 다운로드가 준비되었습니다.')">PDF 다운 ↓</button>
            </div>
          </div>

          <!-- Doc 3: 사업자등록증 & 영업신고증 -->
          <div class="doc-card" style="padding:1.75rem;">
            <div>
              <div class="icon">🏢</div>
              <span class="badge" style="color:var(--color-secondary); font-weight:700; font-size:0.75rem;">행정 확인용</span>
              <h4 style="font-size:1.15rem; margin-top:0.25rem;">사업자등록증 & 영업신고증</h4>
              <p>(주)자반의 사업자등록증 사본 및 관할 구청 식품제조가공업 영업허가 신고증입니다.</p>
              <div style="font-size:0.8rem; color:var(--color-text-muted); background:var(--color-bg-subtle); padding:0.5rem; border-radius:4px; margin-bottom:1rem;">
                • 업태/종목: 제조업 / 수산물가공식품<br>
                • 통신판매업 및 공장등록 완료
              </div>
            </div>
            <div style="display:flex; gap:0.5rem;">
              <button type="button" class="btn-outline" style="flex:1; padding:0.5rem; font-size:0.8rem;" onclick="openDocModal('biz_cert')">미리보기</button>
              <button type="button" class="btn-primary" style="flex:1; padding:0.5rem; font-size:0.8rem;" onclick="alert('사업자등록증 사본 다운로드가 준비되었습니다.')">PDF 다운 ↓</button>
            </div>
          </div>

          <!-- Doc 4: 원산지 증명원 -->
          <div class="doc-card" style="padding:1.75rem;">
            <div>
              <div class="icon">🌐</div>
              <span class="badge" style="color:var(--color-secondary); font-weight:700; font-size:0.75rem;">통관 및 이력추적</span>
              <h4 style="font-size:1.15rem; margin-top:0.25rem;">원산지 증명서 & 수입신고필증</h4>
              <p>노르웨이 북대서양 정식 수입 통관 서류 및 국내산 원물의 위판 증명 사본입니다.</p>
              <div style="font-size:0.8rem; color:var(--color-text-muted); background:var(--color-bg-subtle); padding:0.5rem; border-radius:4px; margin-bottom:1rem;">
                • 노르웨이 수산물위원회 인증 연계<br>
                • 수산물 이력추적관리 등록
              </div>
            </div>
            <div style="display:flex; gap:0.5rem;">
              <button type="button" class="btn-outline" style="flex:1; padding:0.5rem; font-size:0.8rem;" onclick="openDocModal('origin')">미리보기</button>
              <button type="button" class="btn-primary" style="flex:1; padding:0.5rem; font-size:0.8rem;" onclick="alert('원산지 증명서 다운로드가 준비되었습니다.')">PDF 다운 ↓</button>
            </div>
          </div>

          <!-- Doc 5: 배상책임보험 -->
          <div class="doc-card" style="padding:1.75rem;">
            <div>
              <div class="icon">🛡️</div>
              <span class="badge" style="color:var(--color-secondary); font-weight:700; font-size:0.75rem;">안전 보장</span>
              <h4 style="font-size:1.15rem; margin-top:0.25rem;">생산물 배상책임보험 증권</h4>
              <p>식품 섭취로 인한 사고 발생 시 최대 1억원을 보장하는 현대해상 생산물배상책임보험 가입 증명원입니다.</p>
              <div style="font-size:0.8rem; color:var(--color-text-muted); background:var(--color-bg-subtle); padding:0.5rem; border-radius:4px; margin-bottom:1rem;">
                • 보장 한도: 1사고당 1억원<br>
                • 대상 품목: (주)자반 전 가공 수산물
              </div>
            </div>
            <div style="display:flex; gap:0.5rem;">
              <button type="button" class="btn-outline" style="flex:1; padding:0.5rem; font-size:0.8rem;" onclick="openDocModal('insurance')">미리보기</button>
              <button type="button" class="btn-primary" style="flex:1; padding:0.5rem; font-size:0.8rem;" onclick="alert('보험 증권 사본 다운로드가 준비되었습니다.')">PDF 다운 ↓</button>
            </div>
          </div>

          <!-- Doc 6: 표준 납품 규격서 -->
          <div class="doc-card" style="padding:1.75rem;">
            <div>
              <div class="icon">📋</div>
              <span class="badge" style="color:var(--color-secondary); font-weight:700; font-size:0.75rem;">급식 품의용</span>
              <h4 style="font-size:1.15rem; margin-top:0.25rem;">단체급식 표준 제품 규격서</h4>
              <p>어종별 영양성분표, 알레르기 유발물질 표시사항, 절단 규격 및 포장 재질 명세서입니다.</p>
              <div style="font-size:0.8rem; color:var(--color-text-muted); background:var(--color-bg-subtle); padding:0.5rem; border-radius:4px; margin-bottom:1rem;">
                • 규격서 서식: 품의서 첨부용 양식<br>
                • 개당 중량 허용 오차 범위 명시
              </div>
            </div>
            <div style="display:flex; gap:0.5rem;">
              <button type="button" class="btn-outline" style="flex:1; padding:0.5rem; font-size:0.8rem;" onclick="openDocModal('spec_doc')">미리보기</button>
              <button type="button" class="btn-primary" style="flex:1; padding:0.5rem; font-size:0.8rem;" onclick="alert('제품 규격서 다운로드가 준비되었습니다.')">PDF 다운 ↓</button>
            </div>
          </div>

        </div>

      </div>
    </section>

  
<?php
get_footer();
