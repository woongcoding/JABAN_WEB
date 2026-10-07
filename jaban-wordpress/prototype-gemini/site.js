/**
 * 자반고래밥 (jaban.co.kr) - 인터랙션 & 서브페이지 통합 스크립트
 */

// 1. 레시피 상세 데이터
const recipeData = {
  1: {
    title: '콤비오븐 겉바속촉 고등어구이 (50인분)',
    tag: '고등어 · 콤비오븐 대량 조리',
    specs: '추천 규격: 노르웨이 순살 필렛 110g 저염 규격',
    ingredients: '자반고래밥 고등어 순살 필렛 50쪽, 종이호일, 식용유 약간(선택), 레몬 슬라이스',
    steps: [
      '조리 전날 냉장실(0~4℃)에서 12시간 완만 자연해동합니다.',
      '오븐 타공 팬에 종이호일을 깔고, 가위로 십자 모양의 미세 타공을 내어 기름 배출로를 만듭니다.',
      '고등어 껍질이 위를 향하도록 일정한 간격(2~3cm)으로 정렬합니다.',
      '콤비오븐 200℃ (습도 20%)에서 12분간 조리합니다.',
      '마지막 2분간 건열(Hot Air) 모드로 전환하여 수분을 날려 껍질의 바삭함을 완성합니다.'
    ]
  },
  2: {
    title: '시래기 묵은지 고등어조림 (대형솥 100인분)',
    tag: '고등어 · 대형솥 조림 요리',
    specs: '추천 규격: 자반고래밥 정량 무염 토막 70g 규격',
    ingredients: '고등어 무염 토막 100개, 삶은 시래기 5kg, 묵은지 8kg, 무 4개, 대파, 양파, 조림 양념장',
    steps: [
      '대형 솥 바닥에 도톰하게 썬 무와 묵은지, 삶은 시래기를 넉넉히 깝니다.',
      '그 위에 해동된 고등어 정량 토막을 겹치지 않게 고르게 얹습니다.',
      '진간장, 고춧가루, 다진 마늘, 생강즙, 물엿으로 배합한 조림 양념장을 끼얹습니다.',
      '센 불에서 끓어오르면 중불로 줄여 20분간 은근히 졸여 양념이 살코기와 무에 깊게 배게 합니다.',
      '불을 끄기 5분 전 어슷 썬 대파와 청양고추를 올려 완성합니다.'
    ]
  },
  3: {
    title: '달콤 짭조름 삼치 데리야끼구이 (학생 급식 1위)',
    tag: '삼치 · 오븐 글레이즈 구이',
    specs: '추천 규격: 삼치 순살 필렛 80g 규격',
    ingredients: '삼치 순살 필렛 100쪽, 데리야끼 소스(간장, 맛술, 올리고당, 다시마육수), 볶은 통깨',
    steps: [
      '삼치 순살 필렛의 물기를 키친타월로 가볍게 닦아냅니다.',
      '콤비오븐 190℃ (습도 10%)에서 10분간 1차 초벌 구이합니다.',
      '초벌된 삼치 윗면에 붓으로 데리야끼 글레이즈 소스를 듬뿍 바릅니다.',
      '오븐 온도를 210℃로 올려 3~4분간 소스에 윤기가 돌 때까지 구워냅니다.',
      '배식 전 볶은 통깨와 실파를 뿌려 마무리합니다.'
    ]
  },
  4: {
    title: '잔반율 0% 순살 삼치 탕수 강정',
    tag: '삼치 · 단체급식 튀김 특식',
    specs: '추천 규격: 삼치 큐브 컷 50g 규격',
    ingredients: '삼치 큐브 50g 100개, 전분가루, 튀김가루, 달콤새콤 탕수 소스, 파프리카, 양파, 목이버섯',
    steps: [
      '해동된 삼치 큐브에 후춧가루와 생강술을 살짝 뿌려 밑간합니다.',
      '전분가루 80%와 튀김가루 20%를 섞어 얇고 고르게 묻힙니다.',
      '175℃로 달궈진 튀김 솥에서 3분 30초간 바삭하게 튀겨 건집니다.',
      '배식 직전 뜨거운 탕수 소스를 버무리거나 얹어 제공합니다.'
    ]
  },
  5: {
    title: '버터 갈릭 임연수 오븐구이',
    tag: '임연수 · 생선구이 전문점 비법',
    specs: '추천 규격: 임연수 필렛 130g 규격',
    ingredients: '임연수 필렛 50쪽, 녹인 버터, 다진 마늘, 파슬리 가루, 레몬즙',
    steps: [
      '녹인 버터에 다진 마늘과 파슬리 가루를 섞어 갈릭 버터 소스를 준비합니다.',
      '오븐 트레이에 종이호일을 깔고 임연수 껍질 쪽이 위로 가도록 정렬합니다.',
      '콤비오븐 200℃에서 10분간 구워냅니다.',
      '오븐에서 꺼내 살코기와 껍질에 갈릭 버터 소스를 바른 뒤 2분간 추가 구이합니다.'
    ]
  },
  6: {
    title: '칼칼한 임연수 감자 고추장 조림',
    tag: '임연수 · 뚝배기/솥 조림',
    specs: '추천 규격: 임연수 반건조 토막 규격',
    ingredients: '임연수 토막 50개, 감자, 양파, 대파, 고추장 3스푼, 고춧가루, 진간장, 마늘',
    steps: [
      '냄비 바닥에 감자를 도톰하게 썰어 깔고 육수를 자작하게 붓습니다.',
      '감자 위에 임연수 토막을 올리고 고추장 양념장을 골고루 끼얹습니다.',
      '센 불에서 끓이다가 끓어오르면 뚜껑을 열고 중불에서 15분간 졸여 비린내를 날립니다.'
    ]
  }
};

function openRecipeModal(id) {
  const modal = document.getElementById('recipeModal');
  const title = document.getElementById('modalRecipeTitle');
  const body = document.getElementById('modalRecipeBody');
  const data = recipeData[id];

  if (!data) return;

  title.innerText = data.title;
  body.innerHTML = `
    <div style="margin-bottom:1rem;">
      <span class="eyebrow" style="margin-bottom:0.25rem;">${data.tag}</span>
      <p style="font-size:0.85rem; font-weight:700; color:var(--color-secondary);">${data.specs}</p>
    </div>

    <div style="background:var(--color-bg-subtle); padding:1rem; border-radius:var(--radius-sm); margin-bottom:1.25rem; font-size:0.85rem;">
      <strong>준비 재료:</strong> ${data.ingredients}
    </div>

    <h4 style="font-size:1rem; font-weight:800; color:var(--color-primary); margin-bottom:0.5rem;">단계별 표준 조리 순서:</h4>
    <ol style="padding-left:1.2rem; font-size:0.9rem; line-height:1.7; color:var(--color-text); margin-bottom:1.5rem;">
      ${data.steps.map(step => `<li>${step}</li>`).join('')}
    </ol>

    <div style="display:flex; gap:0.5rem;">
      <a href="https://gorebob.com/" class="btn-shop" style="flex:1; justify-content:center;" target="_blank" rel="noopener">
        이 레시피에 사용된 생선 고래밥몰에서 주문 ↗
      </a>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeRecipeModal() {
  const modal = document.getElementById('recipeModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

// 2. 비디오 플레이어 모달 데이터
const videoDetails = {
  shorts_oven: {
    title: '"10분 만에 50토막 끝!" 급식실 콤비오븐 세팅 쾌감',
    desc: '포장 뜯고 오븐 트레이에 정렬하는 데 걸린 시간 단 48초! 콤비모드(습도 20%) 200℃ 12분으로 완성되는 겉바속촉 고등어 필렛 실증 영상입니다.',
    thumb: 'assets/shorts_oven.jpg'
  },
  shorts_unpack: {
    title: '손에 물 한 방울 안 묻히는 1초 언패킹 & 직화 팬 구이',
    desc: '가위로 팩 상단을 뜯어 바로 달궈진 팬에 미끄러뜨리는 1초 언패킹 쾌감! 싱크대에 비린내와 핏물 뒷정리가 전혀 남지 않습니다.',
    thumb: 'assets/shorts_unpack.jpg'
  },
  shorts_braise: {
    title: '끓여도 살이 부서지지 않는 단단한 정량 토막 비법',
    desc: '대형 솥에서 무, 묵은지와 함께 센 불로 20분 이상 졸여도 형태가 흐트러지지 않는 자반고래밥 정량 토막 생선의 육질과 양념 흡수력.',
    thumb: 'assets/shorts_braise.jpg'
  },
  video_teriyaki: {
    title: '가시 컴플레인 없는 순살 삼치 데리야끼 글레이즈 조리법',
    desc: '가시를 1차 제거한 삼치 순살 필렛에 비법 글레이즈 소스를 얹어 학생 급식 배식하는 실시간 조리실 현장 컷입니다.',
    thumb: 'assets/fillets_display.jpg'
  },
  video_factory: {
    title: '자반고래밥 HACCP 공장 금속검출 CCP-2P 및 핀셋 가시제거',
    desc: '포장 직전 미세 낚싯바늘과 금속 이물을 걸러내는 최신 디지털 금속검출기 통과 및 수작업 핀셋 검수 라인.',
    thumb: 'assets/step_metal.jpg'
  },
  video_crispy: {
    title: '생선 껍질 1도 안 눌어붙는 콤비오븐 타공 종이호일 세팅 공식',
    desc: '오븐 팬 세척 시간을 80% 줄이고 기름은 쏙 빠져 껍질의 바삭함을 극대화하는 타공 종이호일 실전 세팅법.',
    thumb: 'assets/step_tray.jpg'
  }
};

function openVideoPlayer(id) {
  const modal = document.getElementById('videoPlayerModal');
  const title = document.getElementById('modalVideoTitle');
  const desc = document.getElementById('modalVideoDesc');
  const thumb = document.getElementById('modalVideoThumb');
  const data = videoDetails[id];

  if (!data) return;

  title.innerText = data.title;
  desc.innerText = data.desc;
  thumb.src = data.thumb;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeVideoPlayer() {
  const modal = document.getElementById('videoPlayerModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

// 3. 서류 미리보기 모달 데이터
const docDetails = {
  haccp: {
    title: '식약처 HACCP 적용업소 지정서 (사본)',
    body: `
      <div style="background:var(--color-bg-subtle); padding:1.25rem; border-radius:var(--radius-sm); border:1px solid var(--color-border); font-size:0.9rem; line-height:1.7;">
        <p><strong>• 지정 번호:</strong> 제 2021-0000호</p>
        <p><strong>• 업소명:</strong> (주)자반</p>
        <p><strong>• 소재지:</strong> 부산광역시 사하구 다대로</p>
        <p><strong>• 적용 품목:</strong> 어류가공품 (냉동수산물 전처리 및 염장)</p>
        <p><strong>• 인증 기관:</strong> 식품의약품안전처 (한국식품안전관리인증원)</p>
        <p><strong>• 중요 관리점:</strong> CCP-1B (세척/소독), CCP-2P (금속검출 공정)</p>
      </div>
      <p style="margin-top:1rem; font-size:0.85rem; color:var(--color-text-muted);">
        ※ 학교 및 공공기관 단체급식 품의 시 첨부 가능한 공식 인증 사본 서류입니다.
      </p>
    `
  },
  test_report: {
    title: '자가품질검사 시험성적서 (공인시험기관)',
    body: `
      <div style="background:var(--color-bg-subtle); padding:1.25rem; border-radius:var(--radius-sm); border:1px solid var(--color-border); font-size:0.9rem; line-height:1.7;">
        <p><strong>• 검사 기관:</strong> 공인 시험연구원</p>
        <p><strong>• 시료명:</strong> 자반고래밥 냉동 고등어 순살 필렛</p>
        <p><strong>• 세균수 / 대장균군:</strong> 기준치 이하 (적합)</p>
        <p><strong>• 장염비브리오 / 살모넬라:</strong> 음성 (불검출, 적합)</p>
        <p><strong>• 중금속(납, 카드뮴, 총수은):</strong> 기준치 이하 (적합)</p>
        <p><strong>• 방사능(요오드, 세슘):</strong> 불검출 (적합)</p>
      </div>
      <p style="margin-top:1rem; font-size:0.85rem; color:var(--color-text-muted);">
        ※ 분기별 정기 전수 검사를 통해 안전성이 입증된 시험성적서입니다.
      </p>
    `
  },
  biz_cert: {
    title: '사업자등록증 & 영업신고증 사본',
    body: `
      <div style="background:var(--color-bg-subtle); padding:1.25rem; border-radius:var(--radius-sm); border:1px solid var(--color-border); font-size:0.9rem; line-height:1.7;">
        <p><strong>• 법인명:</strong> (주)자반</p>
        <p><strong>• 사업자등록번호:</strong> 000-00-00000</p>
        <p><strong>• 대표자:</strong> 김지웅</p>
        <p><strong>• 업태 / 종목:</strong> 제조업 / 수산물 가공 및 저장처리업</p>
        <p><strong>• 식품제조가공업 영업신고번호:</strong> 부산사하 제000호</p>
      </div>
    `
  },
  origin: {
    title: '원산지 증명원 & 수입신고필증',
    body: `
      <div style="background:var(--color-bg-subtle); padding:1.25rem; border-radius:var(--radius-sm); border:1px solid var(--color-border); font-size:0.9rem; line-height:1.7;">
        <p><strong>• 어종:</strong> 노르웨이산 고등어 (Scomber scombrus)</p>
        <p><strong>• 어획 해역:</strong> FAO 27 (북대서양 노르웨이 해역)</p>
        <p><strong>• 수입통관:</strong> 부산세관 정식 정밀검역 통관 완료</p>
        <p><strong>• 이력번호:</strong> 국립수산물품질관리원 수산물이력추적 연계</p>
      </div>
    `
  },
  insurance: {
    title: '생산물 배상책임보험 증권 사본',
    body: `
      <div style="background:var(--color-bg-subtle); padding:1.25rem; border-radius:var(--radius-sm); border:1px solid var(--color-border); font-size:0.9rem; line-height:1.7;">
        <p><strong>• 보험사:</strong> 현대해상화재보험</p>
        <p><strong>• 담보명:</strong> 생산물배상책임(음식물배상) 보장</p>
        <p><strong>• 보장 한도:</strong> 1사고당 1억원 / 1인당 1억원</p>
        <p><strong>• 피보험자:</strong> (주)자반 제조 전 제품</p>
      </div>
    `
  },
  spec_doc: {
    title: '단체급식 표준 제품 규격서 양식',
    body: `
      <div style="background:var(--color-bg-subtle); padding:1.25rem; border-radius:var(--radius-sm); border:1px solid var(--color-border); font-size:0.9rem; line-height:1.7;">
        <p><strong>• 규격서 서식:</strong> 표준 어종별 규격/영양성분표 명세</p>
        <p><strong>• 포함 항목:</strong> 영양성분 9종(열량, 단백질, 지방, 나트륨 등)</p>
        <p><strong>• 알레르기 유발물질:</strong> 고등어 함유 표기</p>
        <p><strong>• 보관 및 유통기한:</strong> -18℃ 이하 냉동 24개월</p>
      </div>
    `
  }
};

function openDocModal(id) {
  const modal = document.getElementById('docModal');
  const title = document.getElementById('modalDocTitle');
  const body = document.getElementById('modalDocBody');
  const data = docDetails[id];

  if (!data) return;

  title.innerText = data.title;
  body.innerHTML = `
    ${data.body}
    <div style="margin-top:1.5rem; text-align:right;">
      <button type="button" class="btn-primary" onclick="alert('${data.title} 정식 PDF 발송이 요청되었습니다. 고객센터에서 즉시 회신드립니다.')">
        공식 PDF 사본 발송 요청 ↓
      </button>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeDocModal() {
  const modal = document.getElementById('docModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

// 4. 공통 인터랙션 및 초기화
document.addEventListener('DOMContentLoaded', () => {
  // 조리 목적별 탭
  const tabBtns = document.querySelectorAll('.cook-tab-btn');
  const tabPanels = document.querySelectorAll('.cook-tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetMenu = btn.getAttribute('data-menu');
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const activePanel = document.getElementById(`panel-${targetMenu}`);
      if (activePanel) activePanel.classList.add('active');
    });
  });

  // 발주 프로세스 듀얼 탭 (식당 vs 급식소)
  const processTabBtns = document.querySelectorAll('.process-tab-btn');
  const processTabPanels = document.querySelectorAll('.process-tab-panel');

  processTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTrack = btn.getAttribute('data-track');
      processTabBtns.forEach(b => b.classList.remove('active'));
      processTabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const activePanel = document.getElementById(`process-panel-${targetTrack}`);
      if (activePanel) activePanel.classList.add('active');
    });
  });

  // 모달 배경 클릭 시 닫기
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  });
});

// 모바일 내비게이션 드로어 토글
function toggleMobileMenu() {
  const drawer = document.getElementById('mobileDrawer');
  if (drawer) {
    drawer.classList.toggle('active');
  }
}
