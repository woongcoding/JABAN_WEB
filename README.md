# 자반고래밥 웹사이트 개발 프로젝트

`jaban.co.kr`의 워드프레스 사이트와 `gorebob.com`의 카페24 화면·연결 기능을 개발하는 독립 프로젝트입니다.
생성일: 2026-10-03. 현재 단계: 카페24 임시 워드프레스에 맞춤 테마와 7개 검토용 페이지 적용 완료(2026-10-06).

## 시작하기

워드프레스 실행 주소는 [임시 사이트](https://sh8945.mycafe24.com/)입니다. 최근 개정 로컬 화면은 [홈 초안](jaban-wordpress/prototype/index.html)이며, 다른 컴퓨터의 실행·수정 방법은 [로컬 개발 안내](docs/local-development.md)를 참고합니다.

1. IDE에서 이 폴더를 열거나 `JABAN_WEB.code-workspace`를 열어 기존 업무 프로젝트도 함께 참고합니다.
2. AI 작업자는 먼저 [AGENTS.md](AGENTS.md), [프로젝트 개요](docs/project-brief.md), [현재 상태](docs/status.md)를 읽습니다.
3. 구축 전 [호스팅 준비 항목](docs/hosting-checklist.md)을 확인합니다.
4. 상세 제작 범위와 운영 절차는 [두 사이트 제작 및 운영 계획안](docs/website-production-operation-plan.md)을 참고합니다. 일정·담당·비용·기능 확대 기준은 검토용 제안입니다.
5. jaban.co.kr의 최신 초안 제작 범위와 고객 동선은 [초안 제작 계획 v3.0](docs/website_planning_proposal.md)을 기준으로 검토합니다. 로컬 대표 화면 8종과 사실 검수·시험 적용·공개 조건을 구분했습니다.

## GitHub 공유 및 시안 비교

[GitHub 저장소](https://github.com/woongcoding/JABAN_WEB)에 웹 프로젝트의 소스와 검토용 시안을 공유합니다.

| 경로 | 내용 |
|---|---|
| [기본 시안](jaban-wordpress/prototype/index.html) | 고등어 중심 v2.2 홈·제품 가이드 |
| [Gemini 시안](jaban-wordpress/prototype-gemini/index.html) | 사진과 발주·자료실 중심의 별도 검토 시안 |
| [Opus 시안](jaban-wordpress/prototype-opus/index.html) | 별도 비교 시안과 계산·확인 도구 화면 |

각 시안은 검토 중이며, 예시 정보나 미연동 기능이 포함될 수 있습니다. GitHub 소스 공유가 운영 사이트 배포나 상품 정보 검수를 의미하지 않습니다. 이번 공유 시 테마 폴더에는 Gemini 기반 변경도 포함되어 있습니다. 상세 이력은 `docs/status.md`를 참고하세요.

저장소 루트에서 `python3 -m http.server 8080 --bind 127.0.0.1 --directory jaban-wordpress`를 실행하고 `http://127.0.0.1:8080/prototype/`, `/prototype-gemini/`, `/prototype-opus/`에서 비교할 수 있습니다.

## 작업 위치

| 경로 | 담당 범위 |
|---|---|
| `jaban-wordpress/` | 홍보·레시피·영상·자료 사이트의 맞춤 테마와 플러그인 |
| `gorebob-cafe24/` | 쇼핑몰 스킨 수정과 웹사이트에서 쇼핑몰로 연결하는 기능 |
| `shared/` | 두 사이트의 공통 디자인 자산과 데이터 연결 규칙 |
| `docs/` | 사이트 운영 기준·결정 기록·개발 상태·배포 준비 |
| `docs/reference/` | 기존 계획서와 미완성 시연 코드의 참고 사본 |

상위 프로젝트 `../`(JABAN_project)는 상품·원가·영업 자료, 업무 자동화, 카페24 API 인증·연동의 원본을 유지합니다.
같은 파일을 두 곳에서 수정하지 않습니다. 참고 사본의 원본 위치와 해시는 [자료 목록](docs/reference/source-manifest.json)에 기록합니다.

## 현재 범위

- `jaban.co.kr`: 회사 소개, 검증된 품질 자료, 레시피, 유튜브, FAQ, 문의, 쇼핑몰 링크.
- `gorebob.com`: 기존 카페24의 회원·주문·결제·세금계산서 운영 유지.
- 계산기와 커뮤니티는 기본 콘텐츠 구축 이후 단계적으로 검토합니다.
- 워드프레스 코어, 운영 DB, 업로드 사진, 비밀정보를 저장소에 넣지 않습니다.
- 별도 Git 저장소를 초기화했습니다. 로컬 커밋이 있으며, GitHub 공유 상태는 `docs/status.md`를 참고합니다. 운영 도메인 전환은 아직 없습니다.

참고 사본은 동작이 검증된 완성품이 아닙니다. 특히 프로토타입은 [검토 메모](docs/reference/README.md)를 먼저 읽으세요.
