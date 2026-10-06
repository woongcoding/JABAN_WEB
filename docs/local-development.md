# 다른 컴퓨터에서 초안 작업하기

GitHub 저장소를 복제한 후 저장소 루트에서 작업합니다. Python 3과 Git이 필요합니다.

## 미리보기

최신 개정본은 `jaban-wordpress/prototype/index.html`입니다. 파일을 브라우저로 직접 열거나 아래 명령으로 로컬 서버를 실행합니다.

```sh
python3 -m http.server 8080 --bind 127.0.0.1 --directory jaban-wordpress/prototype
```

브라우저에서 `http://127.0.0.1:8080/`을 엽니다. 종료는 Ctrl+C입니다.

## 수정과 동기화

- HTML 원본 생성기는 `jaban-wordpress/prototype/build.py`입니다. 본문·공통 메뉴를 수정한 뒤 `python3 jaban-wordpress/prototype/build.py`로 7개 HTML을 다시 생성합니다. 생성된 HTML도 함께 커밋합니다.
- 디자인은 `jaban-wordpress/prototype/style.css`에서 수정합니다.
- `shared/wireframes/`는 참고 화면이며 최신 개정본과 구분합니다.
- 작업 전에 `git pull --ff-only`로 동기화하고, `git switch -c codex/작업명`으로 작업 브랜치를 만듭니다. 완료 후 커밋하고 `git push -u origin 브랜치명`으로 공유합니다.
- 기존 업무 자료가 없는 컴퓨터에서는 `JABAN_WEB.code-workspace` 대신 이 저장소 폴더만 열어도 됩니다.

비밀정보가 없어도 정적 초안은 실행됩니다. `.env`, `private/`, 운영 DB와 고객 자료는 공유하지 않습니다. 아직 설치 가능한 워드프레스 테마가 아니며, 실제 상품·사진·품질 자료·상담 채널은 검수 대기입니다.
