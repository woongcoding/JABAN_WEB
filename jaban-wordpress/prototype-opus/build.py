#!/usr/bin/env python3
"""시안 C 정적 페이지 생성기.

src/pages/*.html 본문(첫 줄 JSON 머리말)에 공통 머리말·꼬리말을 붙여 루트에 HTML을 만든다.
WordPress 전환 시 HEADER/FOOTER는 header.php/footer.php, 본문은 페이지 템플릿에 대응한다.
사용: python3 build.py
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PAGES = ROOT / "src" / "pages"

NAV = [
    ("mackerel", "mackerel.html", "고등어 가이드"),
    ("guides", "guides.html", "어종·형태 찾기"),
    ("recipes", "recipes.html", "레시피"),
    ("tools", "tools.html", "계산·확인 도구"),
    ("quality", "quality.html", "제조·품질"),
    ("support", "support.html", "고객지원"),
]

FISH = (
    '<svg viewBox="0 0 88 44" aria-hidden="true"><path d="M4 22c10-13 30-18 50-12 6 2 11 5 16 9l12-9-4 12 4 12-12-9'
    'c-5 4-10 7-16 9-20 6-40 1-50-12z" fill="#1d5c63"/><path d="M14 17c8-6 20-8 32-6M20 13c8-3 18-3 26-1" stroke="#0e3940" '
    'stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M8 24c14 8 34 10 54 2" stroke="#d8e7e3" stroke-width="3" '
    'fill="none" stroke-linecap="round"/><circle cx="15" cy="20" r="2.2" fill="#f3efe6"/></svg>'
)

HEAD = """<!DOCTYPE html>
<html lang="ko" class="no-js">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<title>{title} | 자반고래밥 (시안 C)</title>
<meta name="description" content="{desc}">
<link rel="icon" href="data:,">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&family=IBM+Plex+Sans+KR:wght@400;500;600;700&family=Nanum+Myeongjo:wght@700;800&display=swap">
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
<a class="skip" href="#main">본문 바로가기</a>
<div class="draftbar"><div class="wrap">
  <span><strong>시안 C</strong> · 검토용 화면입니다. 예시 정보가 포함되어 있으며 접수·다운로드·결제 기능은 없습니다.</span>
  <button type="button" id="status-toggle" aria-pressed="false">검수 표시 켜기</button>
</div></div>
<header class="site-header">
  <div class="wrap">
    <a class="logo" href="index.html" aria-label="자반고래밥 홈">{fish}<span><b>자반고래밥</b><small>수산물 선택 · 조리 안내</small></span></a>
    <button type="button" class="menu-toggle" aria-expanded="false" aria-controls="site-nav"><span class="bars" aria-hidden="true"></span><span class="t">메뉴</span></button>
    <nav class="nav" id="site-nav" aria-label="주 메뉴">
{nav}
    </nav>
    <div class="head-tools">
      <button type="button" class="btn-size" aria-pressed="false" aria-label="글자 크게 보기">가+</button>
      <a class="btn btn-shop btn-small ext" href="https://gorebob.com/" data-shop>고래밥몰 </a>
    </div>
  </div>
</header>
<main id="main">
"""

FOOT = """</main>
<footer class="site-footer">
  <div class="wrap">
    <div class="foot">
      <div>
        <h2>자반고래밥</h2>
        <p>이 사이트는 제품 선택·조리·품질 정보를 안내합니다.<br>주문·결제·회원·주문조회는 고래밥몰에서 이용합니다.</p>
        <a class="btn btn-shop btn-small ext" href="https://gorebob.com/" data-shop>고래밥몰로 이동 </a>
      </div>
      <div>
        <h3>안내</h3>
        <ul>
          <li><a href="mackerel.html">고등어 가이드</a></li>
          <li><a href="guides.html">어종·형태 찾기</a></li>
          <li><a href="recipes.html">레시피</a></li>
          <li><a href="tools.html">계산·확인 도구</a></li>
        </ul>
      </div>
      <div>
        <h3>회사 · 지원</h3>
        <ul>
          <li><a href="quality.html">제조·품질</a></li>
          <li><a href="quality.html#docs">품질 자료 요청</a></li>
          <li><a href="support.html#faq">자주 묻는 질문</a></li>
          <li><a href="support.html#memo">상담 메모 작성</a></li>
        </ul>
      </div>
    </div>
    <div class="foot-legal">
      상호·대표자·사업자등록번호·주소·연락처: <span data-status="pending">사업체 표기 확인 후 게시</span><br>
      시안 C · 로컬 검토용 · 검색 수집 제외(noindex)
    </div>
  </div>
</footer>
<div class="mbar" aria-label="빠른 이동">
  <a class="btn" href="support.html#memo">상담 메모</a>
  <a class="btn btn-shop ext" href="https://gorebob.com/" data-shop>고래밥몰 </a>
</div>
<script src="assets/js/data.js"></script>
<script src="assets/js/app.js"></script>
</body>
</html>
"""


def build():
    count = 0
    for src in sorted(PAGES.glob("*.html")):
        text = src.read_text(encoding="utf-8")
        m = re.match(r"<!--\s*(\{.*?\})\s*-->\s*\n", text, re.S)
        if not m:
            raise SystemExit(f"{src.name}: 첫 줄에 JSON 머리말이 없습니다")
        meta = json.loads(m.group(1))
        body = text[m.end():]
        current = ' aria-current="page"'
        nav = "\n".join(
            f'      <a href="{href}"{current if key == meta.get("nav") else ""}>{label}</a>'
            for key, href, label in NAV
        )
        html = HEAD.format(title=meta["title"], desc=meta["desc"], fish=FISH, nav=nav) + body + FOOT
        (ROOT / src.name).write_text(html, encoding="utf-8")
        count += 1
    print(f"{count}개 페이지 생성")


if __name__ == "__main__":
    build()
