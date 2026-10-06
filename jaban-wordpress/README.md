# jaban.co.kr · 워드프레스 개발

맞춤 테마는 `wp-content/themes/`, 맞춤 플러그인은 `wp-content/plugins/`에 작성한다.
`wp-content/themes/jaban-guide/`에 설치 가능한 맞춤 테마가 있으며 카페24 임시 주소에서 활성화되어 있습니다. 맞춤 플러그인은 아직 없습니다.

- 회사 소개·레시피·영상·FAQ·자료·문의 화면을 담당한다.
- 구매는 gorebob의 실제 상품·카테고리로 연결한다.
- 계산기의 산식과 실제 상품 데이터 연결은 구현 전에 확정한다.
- 운영 글·사진·회원 DB는 파일 저장소와 별도로 백업한다.
- 워드프레스 코어·`wp-config.php`·운영 업로드는 Git 관리 대상에서 제외한다.

## 로컬 초안 (2026-10-04)

`prototype/index.html`을 브라우저로 열면 홈과 고등어 상세를 검토할 수 있습니다. 외부 라이브러리나 서버 없이 실행됩니다. `prototype/build.py`로 HTML을 재생성하며 공통 스타일은 `prototype/style.css`에 있습니다. 설치 가능한 워드프레스 테마는 아직 아닙니다. 상품별 연결과 실사·품질·상담 자료는 검수 후 반영합니다.

## 워드프레스 구동 (2026-10-06)

- 실행 주소: https://sh8945.mycafe24.com/
- 테마: `wp-content/themes/jaban-guide/` (Jaban Guide 0.1.0).
- 홈·회사·품질·제품 가이드·레시피·지원·고등어를 WordPress 페이지로 등록했습니다. 본문은 관리자 페이지의 사용자 정의 HTML 블록에서 수정할 수 있습니다.
- 설치 파일 재생성: `python3 jaban-wordpress/tools/build-wordpress-theme.py` (저장소 루트 기준). `jaban-wordpress/dist/jaban-guide.zip`과 `pages.json`을 생성합니다.
- 자세한 수정·적용·복구 범위는 [워드프레스 시험 적용 기록](../docs/wordpress-test-deployment.md)을 참고합니다.
