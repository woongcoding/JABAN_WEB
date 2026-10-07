"""로컬 검토용 7개 페이지 생성. 실행: python3 jaban-wordpress/prototype/build.py"""
from pathlib import Path
from html import escape

ROOT = Path(__file__).resolve().parent
PAGES = [
    ('index', '자반고래밥 · 식당과 급식에 맞는 생선 선택'),
    ('mackerel', '고등어 제품 안내'),
    ('guides', '생선·규격 안내'),
    ('quality', '제조·품질'),
    ('recipes', '레시피·활용'),
    ('company', '회사 소개'),
    ('support', '고객지원·거래 문의'),
]
MENU = [('guides', '생선·규격 안내'), ('quality', '제조·품질'),
        ('recipes', '레시피·활용'), ('company', '회사 소개'), ('support', '고객지원')]


def render(name, title):
    nav = ''.join(f'<a href="{key}.html"' + (' aria-current="page"' if key == name else '')
                  + f'>{label}</a>' for key, label in MENU)
    body = (ROOT / 'content' / f'{name}.html').read_text()
    for component in ['checklist', 'cooking', 'consult']:
        token = '{{' + component + '}}'
        if token in body:
            body = body.replace(token, (ROOT / 'content' / f'_{component}.html').read_text())
    return f'''<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>{escape(title)} · 로컬 초안</title>
<link rel="stylesheet" href="style.css">
<script src="site.js" defer></script>
</head>
<body>
<a class="skip" href="#main">본문으로 이동</a>
<div class="draft">로컬 검토용 초안 · 상품 정보 검수 중 · 상담은 접수되지 않습니다</div>
<header>
<a class="brand" href="index.html">자반고래밥<span>제품 선택부터 조리까지</span></a>
<nav class="desktop-nav" aria-label="전체 메뉴">{nav}</nav>
<details class="menu"><summary>메뉴</summary><nav aria-label="주 메뉴">{nav}</nav></details>
<a class="shop" href="https://gorebob.com/">고래밥몰에서 주문 ↗</a>
</header>
<main id="main">{body}</main>
<footer>
<div><a class="brand" href="index.html">자반고래밥</a><p>식당과 급식을 위한 생선 선택·조리 안내</p><p class="muted">제품 정보는 jaban.co.kr · 주문과 결제는 gorebob.com</p></div>
<nav aria-label="하단 메뉴">{nav}<a href="https://gorebob.com/">고래밥몰에서 주문 ↗</a></nav>
<p class="footer-note">검토용 화면입니다. 실제 상품·사진·품질 자료·상담 운영 조건은 확인 후 반영합니다.</p>
</footer>
</body>
</html>
'''


if __name__ == '__main__':
    for name, title in PAGES:
        (ROOT / f'{name}.html').write_text(render(name, title))
    print(f'{len(PAGES)}개 로컬 페이지 생성 완료')
