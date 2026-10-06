/**
 * 자반고래밥 브랜드 웹사이트 (jaban.co.kr) 프로토타입 인터랙션 스크립트
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
  initAuditMode();
  initDeepLinkGuards();
});

// 테마 스위처 (모던 B2B 신뢰형 vs 장인 스토리형)
function initThemeSwitcher() {
  const savedTheme = localStorage.getItem('jaban_proto_theme') || 'trust';
  applyTheme(savedTheme);

  document.querySelectorAll('[data-set-theme]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const theme = e.currentTarget.getAttribute('data-set-theme');
      applyTheme(theme);
    });
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('jaban_proto_theme', theme);

  document.querySelectorAll('[data-set-theme]').forEach(btn => {
    if (btn.getAttribute('data-set-theme') === theme) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// 사내 검수 모드 토글 (미확인 사실 및 검수 대기 강조)
function initAuditMode() {
  const savedAudit = localStorage.getItem('jaban_proto_audit') || 'on';
  applyAuditMode(savedAudit === 'on');

  const toggleBtn = document.getElementById('btn-toggle-audit');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.body.classList.contains('audit-mode-active');
      applyAuditMode(!current);
    });
  }
}

function applyAuditMode(isActive) {
  const toggleBtn = document.getElementById('btn-toggle-audit');
  if (isActive) {
    document.body.classList.add('audit-mode-active');
    localStorage.setItem('jaban_proto_audit', 'on');
    if (toggleBtn) {
      toggleBtn.classList.add('active');
      toggleBtn.innerHTML = '🔍 사내 검수 모드: <strong>ON</strong>';
    }
    // 검수 대기 블록 표시
    document.querySelectorAll('.audit-callout, .audit-badge').forEach(el => {
      el.style.display = '';
    });
  } else {
    document.body.classList.remove('audit-mode-active');
    localStorage.setItem('jaban_proto_audit', 'off');
    if (toggleBtn) {
      toggleBtn.classList.remove('active');
      toggleBtn.innerHTML = '🔍 사내 검수 모드: <strong>OFF</strong>';
    }
    // 검수 대기 블록 숨김 (일반 고객 뷰 시뮬레이션)
    document.querySelectorAll('.audit-callout').forEach(el => {
      el.style.display = 'none';
    });
  }
}

// 쇼핑몰 딥링크 안내 가드
function initDeepLinkGuards() {
  document.querySelectorAll('a[href*="gorebob.com"]').forEach(link => {
    link.addEventListener('click', (e) => {
      // 프로토타입 단계에서는 이동 전 토스트 알림 표시
      console.log('이동 대상 쇼핑몰 SKU URL:', link.getAttribute('href'));
    });
  });
}
