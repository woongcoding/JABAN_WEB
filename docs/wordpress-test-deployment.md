# 워드프레스 시험 적용 · 2026-10-06

실제 작업 저장소는 `/Users/jiwoongkim/JABAN_project/JABAN_WEB`입니다. 별도 `/Users/jiwoongkim/JABAN_WEB`은 이전 자료가 있는 폴더입니다.

## 실행 화면

https://sh8945.mycafe24.com/

| 화면 | 주소 | WordPress ID |
|---|---|---|
| 홈 | `/` | 10 |
| 회사 소개 | `/company/` | 11 |
| 제조·품질 | `/quality/` | 12 |
| 제품 선택 가이드 | `/guides/` | 13 |
| 레시피·활용 | `/recipes/` | 14 |
| 고객지원·거래 문의 | `/support/` | 15 |
| 고등어 상세 | `/mackerel/` | 16 |

테마는 Jaban Guide 0.1.0입니다. 콘텐츠는 WordPress의 ‘페이지’에서 해당 페이지의 사용자 정의 HTML 블록으로 편집합니다. 공통 메뉴/푸터/스타일은 로컬 테마 코드에서 수정합니다. 편집 본문에 남아 있는 `guides.html` 등의 상대 링크는 테마가 현재 페이지 주소로 변환합니다.

## 코드와 재생성

- 원래 화면: `jaban-wordpress/prototype/`.
- 테마: `jaban-wordpress/wp-content/themes/jaban-guide/`.
- `python3 jaban-wordpress/tools/build-wordpress-theme.py`는 로컬 테마·설치 ZIP·페이지 본문 JSON을 재생성합니다. 서버에는 자동 적용하지 않습니다.
- `deploy-wordpress.py`는 `.env`의 계정으로 지정 임시 호스트에만 최초 설치하는 도구입니다. 기존 테마 또는 같은 페이지 슬러그가 발견되면 덮어쓰지 않고 중단합니다. Python requests/python-dotenv가 필요하며, 암호는 코드/ZIP에 포함하지 않습니다.
- 서버에서 본문을 수정한 이후에는 과거 로컬 HTML을 다시 가져오기 전에 서버 수정 내용을 보존해야 합니다.

## 검토 및 공개 조건

검수 대기 안내, 실제 사진/상품 규격/품질 자료/상담 채널 준비 상태, 구매 버튼 보류를 그대로 유지했습니다. 임시 사이트는 공개 URL로 접근할 수 있으나 WordPress 읽기 설정 및 테마에서 noindex/nofollow를 적용했습니다. 이는 비밀번호 보호가 아닙니다. 운영 공개 전에 콘텐츠 검수와 수집 설정을 별도로 확정해야 합니다.

운영 사이트 및 DNS·메일·주문 시스템은 변경하지 않았습니다. 일반 설정의 기존 사이트 주소/시간대는 이번 적용에서 변경하지 않았고, 사이트 제목만 자반고래밥으로 설정했습니다.

## 복구

적용 전 상태의 기록은 Git 제외 `private/wp-before-jaban-*.json`, 제목 변경 전 일반 설정은 `private/wp-settings-before-brand.json`에 있습니다. 실제 신규 페이지 ID는 위 표와 `private/wp-jaban-deployment.json`을 참고합니다.

이전 표시로 돌아가려면 관리자 ‘외모 → 테마’에서 Twenty Twenty-Five를 활성화하고 ‘설정 → 읽기’에서 이전 최신 글 표시로 되돌립니다. 신규 페이지는 휴지통으로 보내되 기존 Sample Page와 Hello world 글은 보존합니다. 검색 수집 설정은 검토용 상태를 유지하는 것을 기본으로 하고, 이전 값으로 되돌릴 필요가 있으면 기록값을 확인합니다. 제목도 기록값으로 복구할 수 있습니다. 전체 DB/파일 복구를 시험한 것은 아닙니다.

## 확인 결과

PHP 문법 검사 통과. 7개 실제 페이지와 스타일은 HTTP 200, 내부 링크는 HTTPS WordPress 주소, 미존재 페이지는 HTTP 404와 한국어 안내입니다. Chrome 데스크톱 홈 및 390px 모바일 홈/고등어 상세를 확인했고, 모바일 메뉴와 가이드 이동을 확인했습니다. 고등어의 미검수 상품별 구매 버튼은 비활성입니다.

구현은 [WordPress 클래식 테마 필수 파일](https://developer.wordpress.org/themes/releasing-your-theme/required-theme-files/)과 [테마 설치·활성화 안내](https://wordpress.org/documentation/article/work-with-themes/)를 참고했습니다.
