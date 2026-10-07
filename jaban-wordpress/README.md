# jaban.co.kr · 워드프레스 개발

맞춤 테마는 `wp-content/themes/`, 맞춤 플러그인은 `wp-content/plugins/`에 작성한다.
`wp-content/themes/jaban-guide/`에 설치 가능한 맞춤 테마가 있으며 카페24 임시 주소에서 활성화되어 있습니다. 맞춤 플러그인은 아직 없습니다.

- 회사 소개·레시피·영상·FAQ·자료·문의 화면을 담당한다.
- 구매는 gorebob의 실제 상품·카테고리로 연결한다.
- 계산기의 산식과 실제 상품 데이터 연결은 구현 전에 확정한다.
- 운영 글·사진·회원 DB는 파일 저장소와 별도로 백업한다.
- 워드프레스 코어·`wp-config.php`·운영 업로드는 Git 관리 대상에서 제외한다.

## 로컬 초안 (2026-10-07 · v2.2)

`prototype/index.html`을 브라우저로 열면 고등어 중심 홈과 7개 안내 페이지를 검토할 수 있습니다. 본문은 `prototype/content/*.html`, 공통 머리말·꼬리말은 `prototype/build.py`에서 수정하고 생성기를 실행합니다. 스타일은 `style.css`, 화면 상호작용은 외부 의존성 없는 `site.js`에서 관리합니다.

조리 목적 탭과 상담 목적 선택은 작동합니다. 실제 상품 규격·구매 링크·사진·품질 자료·레시피는 검수 대기이며 개인정보 입력과 상담 접수는 비활성입니다. `desktop.png`, `mobile.png`는 최신 홈 첫 화면 캡처입니다.

이번 개정은 로컬 화면입니다. WordPress 적용 전 패키징 도구에 `site.js` 복사·enqueue와 공통 메뉴의 현재 페이지 처리를 추가하고 시험해야 합니다. 기존 테마/임시 서버에는 아직 이번 화면을 적용하지 않았습니다.

## 워드프레스 구동 (2026-10-06)

- 실행 주소: https://sh8945.mycafe24.com/
- 테마: `wp-content/themes/jaban-guide/` (Jaban Guide 0.1.0).
- 홈·회사·품질·제품 가이드·레시피·지원·고등어를 WordPress 페이지로 등록했습니다. 본문은 관리자 페이지의 사용자 정의 HTML 블록에서 수정할 수 있습니다.
- 설치 파일 재생성: `python3 jaban-wordpress/tools/build-wordpress-theme.py` (저장소 루트 기준). `jaban-wordpress/dist/jaban-guide.zip`과 `pages.json`을 생성합니다.
- 자세한 수정·적용·복구 범위는 [워드프레스 시험 적용 기록](../docs/wordpress-test-deployment.md)을 참고합니다.
