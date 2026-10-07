/* 시안 C 화면 상호작용. 외부 라이브러리·서버 전송 없음. 저장은 이 브라우저의 localStorage만 사용한다. */
(function () {
  "use strict";
  var D = window.JABAN;
  var doc = document;
  doc.documentElement.classList.remove("no-js");

  /* ---------- 공통 유틸 ---------- */
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem("jaban-c:" + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem("jaban-c:" + k, JSON.stringify(v)); } catch (e) { /* 저장 불가 환경 */ } }
  };
  function $(s, r) { return (r || doc).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function stamp(s, optional) { return '<span class="stamp' + (optional ? " optional" : "") + '" data-s="' + s + '">' + D.statusLabel[s] + "</span>"; }
  function fmt(n, d) { return Number(n).toLocaleString("ko-KR", { maximumFractionDigits: d == null ? 1 : d, minimumFractionDigits: 0 }); }

  var toastEl;
  function toast(msg) {
    if (!toastEl) { toastEl = doc.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); doc.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add("on");
    clearTimeout(toastEl._t); toastEl._t = setTimeout(function () { toastEl.classList.remove("on"); }, 2200);
  }
  function copyText(text, okMsg) {
    function fallback() {
      var ta = doc.createElement("textarea"); ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      doc.body.appendChild(ta); ta.select();
      var ok = false; try { ok = doc.execCommand("copy"); } catch (e) { ok = false; }
      ta.remove(); toast(ok ? okMsg : "복사하지 못했습니다. 내용을 직접 선택해 복사해 주세요.");
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(function () { toast(okMsg); }, fallback);
    else fallback();
  }

  /* ---------- 머리말: 메뉴·글자 크기·검수 표시 ---------- */
  var menuBtn = $(".menu-toggle"), nav = $("#site-nav");
  if (menuBtn && nav) {
    function setMenu(open) { nav.classList.toggle("open", open); menuBtn.setAttribute("aria-expanded", String(open)); menuBtn.querySelector(".t").textContent = open ? "닫기" : "메뉴"; }
    menuBtn.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
    doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); menuBtn.focus(); } });
    $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  }

  var sizeBtn = $(".btn-size");
  function applySize(lg) { doc.documentElement.dataset.size = lg ? "lg" : ""; if (sizeBtn) sizeBtn.setAttribute("aria-pressed", String(lg)); }
  applySize(store.get("size-lg", false));
  if (sizeBtn) sizeBtn.addEventListener("click", function () { var lg = sizeBtn.getAttribute("aria-pressed") !== "true"; store.set("size-lg", lg); applySize(lg); toast(lg ? "글자를 크게 표시합니다" : "기본 글자 크기로 표시합니다"); });

  var statusBtn = $("#status-toggle");
  function applyStatus(on) { doc.body.classList.toggle("show-status", on); if (statusBtn) { statusBtn.setAttribute("aria-pressed", String(on)); statusBtn.textContent = on ? "검수 표시 끄기" : "검수 표시 켜기"; } }
  applyStatus(store.get("status", false));
  if (statusBtn) statusBtn.addEventListener("click", function () { var on = !doc.body.classList.contains("show-status"); store.set("status", on); applyStatus(on); });

  $$("[data-shop]").forEach(function (a) { a.href = D.shopUrl; });

  /* ---------- 홈: 방문 목적 ---------- */
  var purposeBtns = $$(".purpose-btn");
  var pathBox = $("#path");
  function renderPurpose(key, focus) {
    var p = D.purposes[key]; if (!p || !pathBox) return;
    purposeBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.purpose === key)); });
    pathBox.hidden = false;
    pathBox.innerHTML =
      '<div class="path-head"><h2 tabindex="-1">' + esc(p.label) + " 추천 순서</h2><p>" + esc(p.lead) + "</p></div>" +
      '<ol class="path-steps path-anim">' + p.steps.map(function (s) {
        return '<li><a href="' + esc(s.href) + '"' + (s.external ? ' class="ext-step"' : "") + "><b>" + esc(s.t) + (s.external ? " ↗" : "") + "</b><span>" + esc(s.d) + "</span></a></li>";
      }).join("") + "</ol>";
    if (focus) { pathBox.querySelector("h2").focus({ preventScroll: true }); pathBox.scrollIntoView({ behavior: "smooth", block: "nearest" }); }
    store.set("purpose", key);
  }
  purposeBtns.forEach(function (b) { b.addEventListener("click", function () { renderPurpose(b.dataset.purpose, true); }); });
  if (pathBox) { var saved = store.get("purpose", null); if (saved) renderPurpose(saved, false); }

  /* ---------- 어종 카드 ---------- */
  var spGrid = $("#species-grid");
  if (spGrid) {
    spGrid.innerHTML = D.species.map(function (s) {
      var main = s.id === "mackerel";
      return '<article class="sp' + (main ? " main" : "") + '" data-status="' + s.status + '">' +
        '<div class="sp-top"><span class="sp-tag">' + esc(s.tag) + "</span>" + stamp(s.status, true) + "</div>" +
        "<h3>" + esc(s.name) + '</h3><div class="origin">산지 · ' + esc(s.origin) + "</div>" +
        "<p>" + esc(s.note) + '</p><div class="chips">' + s.uses.map(function (u) { return '<span class="chip">' + esc(u) + "</span>"; }).join("") + "</div>" +
        '<a class="btn btn-small' + (main ? " btn-primary" : "") + '" href="' + s.href + '">' + (main ? "고등어 가이드 보기" : "이 어종 상담하기") + "</a></article>";
    }).join("");
  }

  /* ---------- 고등어 가공 형태 탭 내용 ---------- */
  var formTabs = $("#form-tabs");
  if (formTabs) {
    var list = $('[role="tablist"]', formTabs);
    D.forms.forEach(function (f, i) {
      list.insertAdjacentHTML("beforeend", '<button type="button" role="tab" id="tab-' + f.id + '" aria-controls="panel-' + f.id + '" data-key="' + f.id + '">' + esc(f.name) + "</button>");
      formTabs.insertAdjacentHTML("beforeend",
        '<div role="tabpanel" id="panel-' + f.id + '" aria-labelledby="tab-' + f.id + '" tabindex="0"' + (i ? " hidden" : "") + '><div class="form-panel">' +
        "<div><h3>" + esc(f.name) + '</h3><div class="sub">' + esc(f.sub) + "</div>" +
        '<p class="f-label">이럴 때 맞습니다</p><div class="chips" style="margin-bottom:1rem">' + f.fit.map(function (x) { return '<span class="chip">' + esc(x) + "</span>"; }).join("") + "</div>" +
        '<div class="note"><p><b>가시 안내</b> · ' + esc(f.bone) + "</p></div></div>" +
        '<div class="label-card" data-status="' + f.status + '"><div class="lc-head"><span>관련 상품</span>' + stamp(f.status) + '</div><div class="lc-body">' +
        '<p style="font-weight:700">' + esc(f.product) + "</p>" +
        '<p class="f-label">주문 전 확인할 것</p><ul class="list-check">' + f.check.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" +
        '<div class="btn-row"><button class="btn btn-small" type="button" disabled>상품 연결 검수 대기</button><a class="btn btn-small btn-shop ext" href="' + D.shopUrl + '">고래밥몰에서 찾기 </a></div>' +
        "</div></div></div></div>");
    });
  }

  /* ---------- 탭 (방향키 지원) ---------- */
  $$(".tabs").forEach(function (box) {
    var tabs = $$('[role="tab"]', box);
    function select(t, focus) {
      tabs.forEach(function (x) {
        var on = x === t; x.setAttribute("aria-selected", String(on)); x.tabIndex = on ? 0 : -1;
        $("#" + x.getAttribute("aria-controls")).hidden = !on;
      });
      if (focus) t.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t); });
      t.addEventListener("keydown", function (e) {
        var n = null;
        if (e.key === "ArrowRight") n = tabs[(i + 1) % tabs.length];
        if (e.key === "ArrowLeft") n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === "Home") n = tabs[0];
        if (e.key === "End") n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
    var hash = location.hash.replace("#", "");
    var fromHash = tabs.filter(function (t) { return t.dataset.key === hash; })[0];
    select(fromHash || tabs[0]);
  });

  /* ---------- 제품 찾기 ---------- */
  var finder = $("#finder-form");
  if (finder) {
    var out = $("#finder-out");
    var names = { butterfly: "버터플라이", trimmed: "손질 고등어", fillet: "순살 필렛", cut: "토막" };
    function run() {
      var v = {}; $$("input:checked", finder).forEach(function (i) { v[i.name] = i.value; });
      var answered = Object.keys(v).length;
      if (!answered) { out.innerHTML = '<p class="empty">왼쪽 질문에 답하면 맞는 가공 형태와 확인할 점이 여기에 나타납니다.</p>'; return; }
      var sc = { butterfly: 0, trimmed: 0, fillet: 0, cut: 0 }, why = { butterfly: [], trimmed: [], fillet: [], cut: [] };
      function add(k, n, r) { sc[k] += n; if (r) why[k].push(r); }
      if (v.biz === "restaurant") { add("butterfly", 3, "식당 구이 상차림에 쓰기 좋은 형태"); add("trimmed", 2, "주방에서 원하는 크기로 나누기 쉬움"); }
      if (v.biz === "catering") { add("fillet", 3, "급식 구이 배식에 맞는 형태"); add("cut", 3, "1인 1토막 배식이 쉬움"); }
      if (v.biz === "home") { add("fillet", 2, "가정에서 손질 없이 조리"); add("butterfly", 1); }
      if (v.method === "grill") { add("butterfly", 2, "구이용"); add("fillet", 2, "구이용"); }
      if (v.method === "braise") { add("cut", 3, "조림에 적합"); add("trimmed", 2, "조림에 활용 가능"); }
      if (v.method === "fry") { add("fillet", 3, "한입 크기로 썰어 튀기기 쉬움"); }
      if (v.method === "oven") { add("fillet", 3, "팬에 고르게 놓기 쉬움"); add("cut", 1); }
      if (v.bone === "strict") { add("fillet", 3, "뼈를 발라낸 형태(가시 처리 범위는 상담 필요)"); add("butterfly", -3); add("trimmed", -3); add("cut", -1); }
      if (v.look === "whole") { add("butterfly", 3, "한 마리 모양이 그대로 보임"); add("trimmed", 1); }
      if (v.look === "portion") { add("cut", 2, "크기를 맞추기 쉬움"); add("fillet", 2, "한 쪽 단위로 나누기 쉬움"); }
      var ranked = Object.keys(sc).sort(function (a, b) { return sc[b] - sc[a]; });
      var max = Math.max(1, sc[ranked[0]]);
      var top = ranked.slice(0, 3).filter(function (k) { return sc[k] > 0; });
      var other = v.method === "braise" ? "갈치" : (v.method === "fry" ? "삼치" : (v.method ? "삼치 · 임연수" : null));
      var html = top.map(function (k, i) {
        var f = D.forms.filter(function (x) { return x.id === k; })[0];
        var pct = Math.round(Math.max(0, sc[k]) / max * 100);
        return '<div class="rec"><div class="rec-top"><h4>' + (i === 0 ? "추천 · " : "") + "고등어 " + names[k] + "</h4>" + stamp(f.status) + "</div>" +
          '<div class="meter" aria-hidden="true"><i style="width:' + pct + '%"></i></div>' +
          "<ul>" + why[k].filter(Boolean).slice(0, 3).map(function (w) { return "<li>" + esc(w) + "</li>"; }).join("") + "<li>확인: " + esc(f.check.join(" · ")) + "</li></ul></div>";
      }).join("");
      if (!html) html = '<p class="empty">조건에 맞는 고등어 형태를 찾기 어렵습니다. 상담으로 확인해 주세요.</p>';
      if (v.bone === "strict") html += '<div class="note" style="margin-top:1rem"><p><b>가시에 민감한 배식</b> · 순살 상품도 잔가시가 남을 수 있습니다. 상품별 처리 범위를 상담으로 확인하세요.</p></div>';
      if (other) html += '<p style="margin-top:1rem;font-size:.92rem">함께 볼 어종: <b>' + esc(other) + "</b> — 메뉴 다양화가 필요할 때 상담으로 규격을 확인하세요.</p>";
      html += '<div class="btn-row" style="margin-top:1rem"><a class="btn btn-primary btn-small" href="mackerel.html#forms">고등어 가공 형태 자세히</a><a class="btn btn-small" href="support.html#memo">이 조건으로 상담 메모</a></div>';
      out.innerHTML = '<p class="count">' + answered + " / 4 질문 응답</p>" + html;
      store.set("finder", v);
    }
    var prev = store.get("finder", {});
    Object.keys(prev).forEach(function (k) { var el = finder.querySelector('input[name="' + k + '"][value="' + prev[k] + '"]'); if (el) el.checked = true; });
    finder.addEventListener("change", run);
    $("#finder-reset").addEventListener("click", function () { finder.reset(); store.set("finder", {}); run(); });
    run();
  }

  /* ---------- 필요량 계산기 ---------- */
  var calc = $("#calc-box");
  if (calc) {
    var mode = store.get("calc-mode", "weight");
    var modeBtns = $$("[data-mode]", calc);
    function num(id) { var v = parseFloat($("#" + id).value); return isFinite(v) ? v : NaN; }
    function setMode(m) {
      mode = m; store.set("calc-mode", m);
      modeBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.mode === m)); });
      $$("[data-for]", calc).forEach(function (el) { el.hidden = el.dataset.for !== m; });
      compute();
    }
    function compute() {
      var people = num("c-people"), extra = num("c-extra");
      var rows = [], total = "", unitText = "", note = "";
      var bad = !(people > 0) || !(extra >= 0);
      if (mode === "weight") {
        var g = num("c-portion"), y = num("c-yield"), unit = num("c-unit");
        bad = bad || !(g > 0) || !(y > 0 && y <= 100);
        if (!bad) {
          var serve = people * g / 1000;
          var withExtra = serve * (1 + extra / 100);
          var buy = withExtra / (y / 100);
          rows.push(["① 제공 총량", fmt(people, 0) + "명 × " + fmt(g, 0) + "g", fmt(serve) + " kg"]);
          rows.push(["② 여유분 반영", "① × (1 + " + fmt(extra, 0) + "%)", fmt(withExtra) + " kg"]);
          rows.push(["③ 구매 중량", "② ÷ 사용 비율 " + fmt(y, 0) + "%", fmt(buy) + " kg"]);
          if (unit > 0) {
            var n = Math.ceil(buy / unit - 1e-9);
            rows.push(["④ 판매 단위 수", "③ ÷ " + fmt(unit) + "kg, 올림", n + " 단위"]);
            total = n + " 단위"; unitText = "약 " + fmt(n * unit) + "kg 구매 · 남는 양 " + fmt(n * unit - buy) + "kg";
          } else { total = fmt(buy) + " kg"; unitText = "판매 단위 중량을 입력하면 단위 수를 계산합니다"; }
        }
      } else {
        var per = num("c-per"), pack = num("c-pack");
        bad = bad || !(per > 0);
        if (!bad) {
          var pieces = Math.ceil(people * per * (1 + extra / 100) - 1e-9);
          rows.push(["① 필요 개수", fmt(people, 0) + "명 × " + fmt(per) + "개 × (1 + " + fmt(extra, 0) + "%), 올림", fmt(pieces, 0) + " 개"]);
          if (pack > 0) {
            var boxes = Math.ceil(pieces / pack - 1e-9);
            rows.push(["② 박스·팩 수", "① ÷ 입수 " + fmt(pack, 0) + "개, 올림", boxes + " 단위"]);
            total = boxes + " 단위"; unitText = "총 " + fmt(boxes * pack, 0) + "개 · 남는 개수 " + fmt(boxes * pack - pieces, 0) + "개";
          } else { total = fmt(pieces, 0) + " 개"; unitText = "박스·팩당 입수를 입력하면 단위 수를 계산합니다"; }
        }
      }
      var box = $("#calc-out");
      if (bad) { box.innerHTML = '<p class="empty">입력값을 확인해 주세요. 인원과 제공량은 0보다 커야 하고, 사용 비율은 1~100% 사이여야 합니다.</p>'; return; }
      box.innerHTML = rows.map(function (r) { return '<div class="rline"><span>' + esc(r[0]) + "<small>" + esc(r[1]) + "</small></span><b>" + esc(r[2]) + "</b></div>"; }).join("") +
        '<div class="rtotal"><span>필요 수량</span><b>' + esc(total) + "</b></div><div>" + esc(unitText) + "</div>";
      calc._summary = "[필요량 계산 · " + (mode === "weight" ? "중량 기준" : "개수 기준") + "]\n" + rows.map(function (r) { return r[0] + ": " + r[1] + " = " + r[2]; }).join("\n") + "\n결과: " + total + " (" + unitText + ")\n※ 참고용 추정. 실제 판매 단위·가격은 상품에서 확인";
      store.set("calc-summary", calc._summary);
    }
    modeBtns.forEach(function (b) { b.addEventListener("click", function () { setMode(b.dataset.mode); }); });
    $$("input", calc).forEach(function (i) { i.addEventListener("input", compute); });
    $("#calc-copy").addEventListener("click", function () { if (calc._summary) copyText(calc._summary, "계산 내용을 복사했습니다"); });
    setMode(mode);
  }

  /* ---------- 구매 전 확인표 ---------- */
  $$("[data-checklist]").forEach(function (root) {
    var state = store.get("check", {});
    var all = [];
    root.innerHTML = '<div class="progress"><div class="bar" aria-hidden="true"><i></i></div><output aria-live="polite"></output>' +
      '<button type="button" class="btn btn-small" data-act="copy">남은 항목 복사</button><button type="button" class="btn btn-small" data-act="reset">처음부터</button></div>' +
      '<div class="checklist">' + D.checklist.map(function (g, gi) {
        return '<div class="ck-group"><h3>' + esc(g.group) + "</h3>" + g.items.map(function (it, ii) {
          var id = "ck-" + gi + "-" + ii; all.push({ id: id, text: it, group: g.group });
          return '<label class="ck"><input type="checkbox" id="' + id + '"' + (state[id] ? " checked" : "") + "><span>" + esc(it) + "</span></label>";
        }).join("") + "</div>";
      }).join("") + "</div>";
    function update() {
      var done = all.filter(function (a) { return $("#" + a.id, root).checked; }).length;
      $(".bar i", root).style.width = (done / all.length * 100) + "%";
      $("output", root).textContent = done + " / " + all.length;
    }
    root.addEventListener("change", function (e) { if (e.target.type === "checkbox") { state[e.target.id] = e.target.checked; store.set("check", state); update(); } });
    root.addEventListener("click", function (e) {
      var act = e.target.dataset && e.target.dataset.act;
      if (act === "reset") { state = {}; store.set("check", state); $$("input", root).forEach(function (i) { i.checked = false; }); update(); toast("확인표를 비웠습니다"); }
      if (act === "copy") {
        var left = all.filter(function (a) { return !$("#" + a.id, root).checked; });
        copyText(left.length ? "[주문 전 남은 확인 항목]\n" + left.map(function (a) { return "□ (" + a.group + ") " + a.text; }).join("\n") : "[주문 전 확인 항목] 모두 확인함", "남은 항목을 복사했습니다");
      }
    });
    update();
  });

  /* ---------- 레시피 ---------- */
  var rGrid = $("#recipe-grid");
  if (rGrid) {
    var f = { species: "전체", method: "전체", scale: "전체", q: "" };
    var params = new URLSearchParams(location.search);
    ["species", "method", "scale"].forEach(function (k) { if (params.get(k)) f[k] = params.get(k); });
    function buildFilter(key, values) {
      var row = $('[data-filter="' + key + '"]');
      row.insertAdjacentHTML("beforeend", ["전체"].concat(values).map(function (v) {
        return '<label class="opt"><input type="radio" name="f-' + key + '" value="' + esc(v) + '"' + (f[key] === v ? " checked" : "") + "><span>" + esc(v) + "</span></label>";
      }).join(""));
      row.addEventListener("change", function (e) { f[key] = e.target.value; render(); });
    }
    function uniq(k) { return D.recipes.map(function (r) { return r[k]; }).filter(function (v, i, a) { return a.indexOf(v) === i; }); }
    buildFilter("species", uniq("species")); buildFilter("method", uniq("method")); buildFilter("scale", uniq("scale"));
    $("#recipe-q").addEventListener("input", function (e) { f.q = e.target.value.trim(); render(); });
    function render() {
      var res = D.recipes.filter(function (r) {
        return (f.species === "전체" || r.species === f.species) && (f.method === "전체" || r.method === f.method) && (f.scale === "전체" || r.scale === f.scale) &&
          (!f.q || (r.title + r.form + r.gear).indexOf(f.q) > -1);
      });
      $("#recipe-count").textContent = "레시피 " + res.length + "개";
      rGrid.innerHTML = res.length ? res.map(function (r) {
        return '<button type="button" class="rc" data-id="' + r.id + '" aria-haspopup="dialog"><div class="rc-art m-' + esc(r.method) + '"><span>' + esc(r.species) + " · " + esc(r.method) + "</span><span>" + esc(r.scale) + "</span></div>" +
          '<div class="rc-body"><h3>' + esc(r.title) + '</h3><div class="meta">형태 ' + esc(r.form) + " · 장비 " + esc(r.gear) + "</div>" + stamp("pending", true) + "</div></button>";
      }).join("") : '<p class="empty">조건에 맞는 레시피가 없습니다. 필터를 줄여 보세요.</p>';
    }
    var dlg = $("#recipe-dlg");
    rGrid.addEventListener("click", function (e) {
      var card = e.target.closest(".rc"); if (!card) return;
      var r = D.recipes.filter(function (x) { return x.id === card.dataset.id; })[0];
      $("#dlg-title").textContent = r.title;
      $("#dlg-body").innerHTML =
        '<div class="video-ph">조리 영상 준비 중<br>영상 없이도 아래 순서로 조리할 수 있습니다</div>' +
        '<table class="spec"><tr><th>어종</th><td>' + esc(r.species) + "</td></tr><tr><th>상품 형태</th><td>" + esc(r.form) + "</td></tr><tr><th>장비</th><td>" + esc(r.gear) + "</td></tr><tr><th>규모</th><td>" + esc(r.scale) + "</td></tr></table>" +
        '<h3 style="font-size:1rem">조리 순서</h3><ol>' + r.steps.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ol>" +
        '<div class="note" data-status="pending"><p><b>확인 후 넣을 수치</b> · ' + esc(r.verify.join(", ")) + "<br>조리 담당 검수 전에는 온도·시간을 표시하지 않습니다. 상품 포장의 조리 안내를 우선하세요.</p></div>" +
        '<div class="btn-row" style="margin-top:1rem"><a class="btn btn-small btn-primary" href="' + (r.species === "고등어" ? "mackerel.html" : "support.html#memo") + '">' + (r.species === "고등어" ? "고등어 가이드" : "이 어종 상담") + '</a><a class="btn btn-small btn-shop ext" href="' + D.shopUrl + '">고래밥몰 </a></div>';
      dlg._from = card;
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
    });
    $(".dlg-close", dlg).addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("close", function () { if (dlg._from) dlg._from.focus(); });
    render();
  }

  /* ---------- FAQ 검색 ---------- */
  var faq = $("#faq-list");
  if (faq) {
    function drawFaq(q) {
      var hl = function (t) { return q ? esc(t).split(esc(q)).join("<mark>" + esc(q) + "</mark>") : esc(t); };
      var res = D.faq.filter(function (x) { return !q || (x.q + x.a + x.tags).indexOf(q) > -1; });
      faq.innerHTML = res.length ? res.map(function (x) { return "<details" + (q ? " open" : "") + "><summary>" + hl(x.q) + "</summary><p>" + hl(x.a) + "</p></details>"; }).join("")
        : '<p class="empty">“' + esc(q) + '”에 대한 답이 없습니다. 아래 상담 메모로 질문을 남겨 주세요.</p>';
      $("#faq-count").textContent = res.length + "개 질문";
    }
    $("#faq-q").addEventListener("input", function (e) { drawFaq(e.target.value.trim()); });
    drawFaq("");
  }

  /* ---------- 자료 요청 ---------- */
  var docBox = $("#doc-list");
  if (docBox) {
    var picked = store.get("docs", []);
    docBox.innerHTML = D.docs.map(function (d) {
      return '<label class="doc" data-status="pending"><input type="checkbox" value="' + d.id + '"' + (picked.indexOf(d.id) > -1 ? " checked" : "") + "><div><b>" + esc(d.name) + "</b><span>" + esc(d.note) + "</span></div></label>";
    }).join("");
    function syncDocs() {
      picked = $$("input:checked", docBox).map(function (i) { return i.value; });
      store.set("docs", picked);
      $("#doc-count").textContent = picked.length ? picked.length + "개 선택됨 — 상담 메모에 자동으로 담깁니다" : "필요한 자료를 선택하세요";
    }
    docBox.addEventListener("change", syncDocs); syncDocs();
  }

  /* ---------- 상담 메모 작성기 (전송하지 않음) ---------- */
  var memo = $("#memo-form");
  if (memo) {
    var outTa = $("#memo-out");
    var pf = store.get("finder", {});
    var labels = { biz: { restaurant: "식당·외식업", catering: "단체급식", home: "가정" }, method: { grill: "구이", braise: "조림", oven: "오븐 대량 구이", fry: "튀김" } };
    if (pf.biz && labels.biz[pf.biz]) { var r = memo.querySelector('input[name="m-biz"][value="' + labels.biz[pf.biz] + '"]'); if (r) r.checked = true; }
    function build() {
      var g = function (n) { var el = memo.querySelector('input[name="' + n + '"]:checked'); return el ? el.value : ""; };
      var sp = $$('input[name="m-sp"]:checked', memo).map(function (i) { return i.value; });
      var lines = ["[자반고래밥 상담 요청]"];
      lines.push("· 상담 목적: " + (g("m-purpose") || "(선택)"));
      lines.push("· 사업장 유형: " + (g("m-biz") || "(선택)"));
      lines.push("· 관심 어종: " + (sp.length ? sp.join(", ") : "(선택)"));
      var form = $("#m-form").value.trim(); if (form) lines.push("· 원하는 형태·규격: " + form);
      var qty = $("#m-qty").value.trim(); if (qty) lines.push("· 예상 수량·주기: " + qty);
      var when = $("#m-when").value.trim(); if (when) lines.push("· 희망 시작 시기: " + when);
      var docs = store.get("docs", []).map(function (id) { return (D.docs.filter(function (d) { return d.id === id; })[0] || {}).name; }).filter(Boolean);
      if (docs.length) lines.push("· 요청 자료: " + docs.join(", "));
      if ($("#m-calc").checked) { var cs = store.get("calc-summary", ""); if (cs) lines.push("", cs); }
      var etc = $("#m-etc").value.trim(); if (etc) lines.push("", "· 기타: " + etc);
      lines.push("", "(회신 연락처는 메시지를 보내는 채널에서 직접 확인해 주세요)");
      outTa.value = lines.join("\n");
      store.set("memo-draft", { form: form, qty: qty, when: when, etc: etc });
    }
    var draft = store.get("memo-draft", {});
    ["form", "qty", "when", "etc"].forEach(function (k) { if (draft[k]) $("#m-" + k).value = draft[k]; });
    var hasCalc = !!store.get("calc-summary", "");
    $("#m-calc").disabled = !hasCalc; $("#m-calc").checked = hasCalc;
    memo.addEventListener("input", build); memo.addEventListener("change", build);
    $("#memo-copy").addEventListener("click", function () { copyText(outTa.value, "상담 메모를 복사했습니다. 아래 채널에 붙여넣어 보내세요"); });
    $("#memo-clear").addEventListener("click", function () { memo.reset(); store.set("memo-draft", {}); build(); toast("메모를 비웠습니다"); });
    build();
  }

  /* ---------- 스크롤 등장 ---------- */
  var rv = $$(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px" });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add("in"); });
})();
