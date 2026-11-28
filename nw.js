/* Node Wrangler shortcuts tab (#/nw), bilingual. Data = nw_data.js, generated from the REAL keymaps of the bundled add-on in Blender 5.3.0 / 4.5.4
   and real key-press tests (Xvfb + xdotool) — see nw/gen_nw.py. Search uses the global search box; group chips (#nwgrp) and the
   'shader only' / 'favourites' checkboxes are remembered by tabstate.js. */
(function(){
"use strict";
var A = window.SD_API, esc = A.esc, N = window.NW_DATA; if(!A || !N) return;
function lang(){ return window.SDI.lang === "en" ? "en" : "ko"; }
function L(o){ return o == null ? "" : (o[lang()] != null ? o[lang()] : o.ko); }
function B(ko, en){ return {ko: ko, en: en}; }
var K = {
  title: B("Node Wrangler 단축키", "Node Wrangler shortcuts"),
  intro: B("Node Wrangler는 블렌더에 같이 들어 있는 무료 애드온이에요. 켜 두면 노드 에디터에서 텍스처 연결, 노드 합치기, 미리보기 같은 일을 키 한두 개로 할 수 있어요. 아래 목록은 블렌더 5.3.0과 4.5.4에 들어 있는 Node Wrangler의 실제 단축키 설정을 그대로 읽어 만들었고, 대부분은 이 사이트를 만든 컴퓨터에서 실제로 키를 눌러 확인했어요.",
           "Node Wrangler is a free add-on that ships with Blender. With it on, texture setup, merging nodes and more take one or two keys in the Node Editor. This list was read straight from the real Node Wrangler keymap in Blender 5.3.0 and 4.5.4, and most entries were checked by actually pressing the keys."),
  howH: B("켜는 법 (5.3 · 4.5 똑같아요)", "How to enable it (same in 5.3 and 4.5)"),
  how: B(["위 메뉴 Edit(편집) → Preferences(환경 설정…)를 열어요.", "왼쪽 목록에서 Add-ons(애드온)를 눌러요. (Get Extensions가 아니에요. 따로 내려받을 필요 없어요.)", "검색창에 Node Wrangler를 입력하고 이름 앞 체크 칸을 켜요. 한국어 화면의 5.3에서는 이름이 ‘노드 랭글러’로 보일 수 있어요.", "기본은 꺼져 있어요. 설정은 자동 저장되니 한 번만 켜면 돼요(자동 저장을 꺼 뒀다면 왼쪽 아래 ☰ 메뉴에서 Save Preferences)."],
         ["Open Edit → Preferences… from the top menu.", "Click Add-ons in the left list (not Get Extensions — nothing to download).", "Type Node Wrangler in the search box and tick the checkbox in front of its name.", "It is off by default. Preferences auto-save, so you do this once (if auto-save is off, use ☰ → Save Preferences at the bottom left)."]),
  howNote: B("단축키는 마우스가 노드 에디터(셰이더 에디터) 위에 있을 때만 먹어요. 대부분 노드를 먼저 클릭해 고른 다음 눌러요.", "Shortcuts work only while the mouse is over the Node (Shader) Editor. Most need you to click-select nodes first."),
  all: B("전체", "All"), shaderOnly: B("셰이더 에디터에서 쓰는 것만", "Only what works in the Shader Editor"), starOnly: B("자주 쓰는 것만 ★", "Favourites only ★"),
  n: B("{n}개", "{n} shown"), q: B(" · 검색: “{q}”", " · search: “{q}”"), none: B("맞는 단축키가 없어요. 검색어나 필터를 바꿔 보세요.", "No shortcut matches. Try another search or filter."),
  or: B("또는", "or"), more: B("다른 키 조합 {n}개 더 보기", "{n} more key combos"), when: B("셰이더 작업에서:", "For shader work:"),
  tested: B("✓ 실제 키로 확인", "✓ key-tested"), regOnly: B("단축키 등록만 확인", "keymap entry checked"), only45: B("4.5에만 있음", "4.5 only"),
  noShader: B("셰이더 에디터에선 안 됨", "not in Shader Editor"), confirm: B("확인 창이 뜸", "asks to confirm"),
  drag: B("RMB = 마우스 오른쪽 버튼을 누른 채 노드에서 노드로 끌기 · LMB = 왼쪽 클릭", "RMB = drag from node to node with the right mouse button held · LMB = left click"),
  part: B("키로 눌러 본 조합: {k} (나머지 조합은 단축키 등록만 확인)", "Key-tested combos: {k} (the other combos: keymap entry checked)"),
  s45: B("4.5에서 눌러 봄: 안내 창만 뜸", "pressed in 4.5: shows only a notice"),
  x11: B("기능은 직접 실행해 확인했어요. 리눅스(X11) 가상 키보드에선 Shift+=가 ‘+’로 들어와 키로는 확인을 못 했어요(윈도우·맥은 이 박스에서 확인 못 함).", "The operator was checked by running it directly. On the Linux (X11) virtual keyboard used here Shift+= arrived as ‘+’, so the key itself couldn't be confirmed (Windows/macOS not tested here)."),
  coreH: B("블렌더 기본 단축키 (Node Wrangler 아님)", "Built-in Blender shortcut (NOT Node Wrangler)"),
  coreNote: B("예전에는 Node Wrangler 기능으로 많이 알려졌지만, 지금은 블렌더에 원래 들어 있어요. Node Wrangler를 꺼도 돼요.", "Often remembered as a Node Wrangler feature, but it is built into Blender now. Works with Node Wrangler off."),
  coreBadge: B("블렌더 기본 · NW 필요 없음", "built-in · no NW needed"),
  verH: B("버전 차이 (5.3 vs 4.5)", "Version differences (5.3 vs 4.5)"),
  ver: B(["Node Wrangler 버전: 5.3.0에는 4.1.0, 4.5.4에는 3.55가 들어 있어요. 단축키 개수는 5.3이 {n53}개, 4.5가 {n45}개예요.", "Shift+S(노드 종류 바꾸기 메뉴)는 4.5에만 있고, 4.5에서도 ‘기능이 없어졌다’는 안내만 떠요. 5.3에서 Shift+S는 블렌더 기본 Swap(노드 바꾸기) 메뉴예요.", "Ctrl+Numpad .(깊이 합치기)는 내부 이름만 바뀌었고(4.5 Z-Combine → 5.3 Depth Combine) 둘 다 컴포지터 전용이에요.", "그 밖의 키 조합은 두 버전이 완전히 같아요(메뉴 이름 대소문자만 조금 달라요)."],
        ["Node Wrangler version: 4.1.0 in Blender 5.3.0, 3.55 in 4.5.4. Keymap entries: {n53} in 5.3, {n45} in 4.5.", "Shift+S (switch node type menu) exists only in 4.5, and even there it only shows a ‘removed’ notice. In 5.3 Shift+S is Blender's own Swap menu.", "Ctrl+Numpad . (depth combine) only changed its internal name (4.5 Z-Combine → 5.3 Depth Combine); both are Compositor only.", "All other key combos are identical in both versions (only some menu names changed case)."]),
  testH: B("어떻게 확인했나요", "How this was checked"),
  test: B("블렌더 5.3.0과 4.5.4를 깨끗한 설정으로 켜고 Node Wrangler를 켠 다음, ① 애드온 원본의 단축키 목록과 블렌더에 실제로 등록된 노드 에디터 단축키가 하나도 빠짐없이 같은지 비교했고(5.3 {n53}개 · 4.5 {n45}개 일치), ② 셰이더 에디터에서 가상 키보드·마우스로 진짜 키를 눌러 결과(노드가 생겼는지, 값이 바뀌었는지, 메뉴가 떴는지)를 검사했어요: 5.3 {p53}/{t53}, 4.5 {p45}/{t45} 통과. ‘등록만 확인’ 표시는 키로 눌러 보지는 않은 항목이에요.",
          "Blender 5.3.0 and 4.5.4 were started with clean settings and Node Wrangler on. (1) The add-on's own shortcut list was compared with what Blender really registered in the Node Editor keymap — all {n53} (5.3) / {n45} (4.5) match. (2) Real keys and mouse drags were sent with a virtual keyboard in the Shader Editor and the result checked (node created, value changed, menu shown): 5.3 {p53}/{t53}, 4.5 {p45}/{t45} passed. ‘Keymap entry checked’ marks items that were not key-tested."),
  back: B("관련: 기본·애드온 탭", "See also: Basics & add-on tab")
};
var grp = "*";
function fmt(s, o){ return String(s).replace(/\{(\w+)\}/g, function(m, k){ return o[k] != null ? o[k] : m; }); }
function kbd(c){ return '<span class="nwk">' + c.map(function(p){ return "<kbd>" + esc(p) + "</kbd>"; }).join("<i>+</i>") + "</span>"; }
function hay(r){ return A.norm([r.keys.map(function(c){ return c.join("+"); }).join(" "), r.desc.ko, r.desc.en, r.tip.ko, r.tip.en, r.id].join(" ")); }
function badges(r){
  var b = [], S = N.summary;
  if(r.only === "45") b.push('<span class="badge rm">' + esc(L(K.only45)) + "</span>");
  if(r.noshader) b.push('<span class="badge">' + esc(L(K.noShader)) + "</span>");
  if(r.confirm) b.push('<span class="badge">' + esc(L(K.confirm)) + "</span>");
  var vs = r.vers.slice().sort().reverse().map(function(v){ return v === "53" ? "5.3" : "4.5"; }).join(" · ");
  var allPass = r.vers.every(function(v){ return r.test[v] === "pass"; });
  if(r.only === "45") b.push('<span class="badge">' + esc(L(K.s45)) + "</span>");
  else if(allPass && !r.x11) b.push('<span class="badge c" title="' + esc(vs) + '">' + esc(vs) + " " + esc(L(K.tested)) + "</span>");
  else b.push('<span class="badge" title="' + esc(vs) + '">' + esc(vs) + " · " + esc(L(K.regOnly)) + "</span>");
  return b.join("");
}
function rowHtml(r){
  var ks = r.keys, first = ks.slice(0, 4), rest = ks.slice(4);
  var h = '<div class="nwrow' + (r.noshader ? " dim" : "") + '" data-nw="' + esc(r.id) + '"><div class="nwkeys">' + (r.star ? '<span class="nwstar" title="★">★</span>' : "") + first.map(kbd).join('<span class="nwor">' + esc(L(K.or)) + "</span>");
  if(rest.length) h += '<details class="nwmore"><summary>' + esc(fmt(L(K.more), {n: rest.length})) + "</summary>" + rest.map(kbd).join(" ") + "</details>";
  h += '</div><div class="nwtxt"><p>' + esc(L(r.desc)) + '</p><p class="hint"><b>' + esc(L(K.when)) + "</b> " + esc(L(r.tip)) + "</p>";
  if(r.x11) h += '<p class="hint nwx">ⓘ ' + esc(L(K.x11)) + "</p>";
  if(r.tk && r.tk.length && r.tk.length < r.keys.length && !r.only) h += '<p class="hint nwpart">' + esc(fmt(L(K.part), {k: r.tk.map(function(k){ return k.split(" ").join("+"); }).join(", ")})) + "</p>";
  h += '<p class="nwb">' + badges(r) + "</p></div></div>";
  return h;
}
function render($main){
  A.setTab("nw");
  var S = N.summary, q = A.norm(A.q);
  var so = document.getElementById("nwshader"), st = document.getElementById("nwstarf");
  var shaderOnly = so ? so.checked : false, starOnly = st ? st.checked : false;
  var hits = N.rows.filter(function(r){ return (!q || hay(r).indexOf(q) >= 0) && (!shaderOnly || (!r.noshader && r.only !== "45")) && (!starOnly || r.star); });
  var counts = {"*": hits.length}; hits.forEach(function(r){ counts[r.g] = (counts[r.g] || 0) + 1; });
  if(grp !== "*" && !N.groups.some(function(g){ return g.id === grp; })) grp = "*";
  var shown = hits.filter(function(r){ return grp === "*" || r.g === grp; });
  var core = N.core.filter(function(c){ return !q || A.norm([c.keys[0].join("+"), c.desc.ko, c.desc.en, "preview 미리보기"].join(" ")).indexOf(q) >= 0; });
  var h = '<div class="nwpage"><h1 class="nwh1">⌨️ ' + esc(L(K.title)) + '</h1><p class="info">' + esc(L(K.intro)) + "</p>";
  h += '<div class="sec nwhow"><h3>' + esc(L(K.howH)) + "</h3><ol>" + L(K.how).map(function(s){ return "<li>" + esc(s) + "</li>"; }).join("") + '</ol><p class="hint">' + esc(L(K.howNote)) + "</p></div>";
  h += '<div class="nwctl"><div class="chips" id="nwgrp" role="toolbar">' + [{id: "*", name: K.all}].concat(N.groups).map(function(g){
    return '<button type="button" class="chip' + (g.id === grp ? " on" : "") + '" data-g="' + esc(g.id) + '">' + esc(L(g.name)) + '<span class="n">' + (counts[g.id] || 0) + "</span></button>"; }).join("") + "</div>";
  h += '<label class="nwchk"><input type="checkbox" id="nwshader"' + (shaderOnly ? " checked" : "") + "> " + esc(L(K.shaderOnly)) + '</label> <label class="nwchk"><input type="checkbox" id="nwstarf"' + (starOnly ? " checked" : "") + "> " + esc(L(K.starOnly)) + "</label></div>";
  h += '<p class="info" id="nwcount">' + esc(fmt(L(K.n), {n: shown.length})) + (A.q ? esc(fmt(L(K.q), {q: A.q})) : "") + " · " + esc(L(K.drag)) + "</p>";
  if(core.length && (grp === "*" || grp === "link")) {
    h += '<div class="sec nwcore"><h3>' + esc(L(K.coreH)) + '</h3><p class="hint">' + esc(L(K.coreNote)) + "</p>";
    core.forEach(function(c){ h += '<div class="nwrow" data-nw="core-' + esc(c.id) + '"><div class="nwkeys">' + c.keys.map(kbd).join(" ") + '</div><div class="nwtxt"><p>' + esc(L(c.desc)) + '</p><p class="hint"><b>' + esc(L(K.when)) + "</b> " + esc(L(c.tip)) + '</p><p class="nwb"><span class="badge e">' + esc(L(K.coreBadge)) + '</span><span class="badge c">5.3 · 4.5 ' + esc(L(K.tested)) + "</span></p></div></div>"; });
    h += "</div>";
  }
  if(!shown.length) h += '<div class="empty">' + esc(L(K.none)) + "</div>";
  N.groups.forEach(function(g){
    var rs = shown.filter(function(r){ return r.g === g.id; }); if(!rs.length) return;
    h += '<div class="sec nwgrp" id="nwg-' + esc(g.id) + '"><h3>' + esc(L(g.name)) + " <small>" + rs.length + "</small></h3>" + rs.map(rowHtml).join("") + "</div>";
  });
  var vt = {n53: S["53"].registered, n45: S["45"].registered, p53: S["53"].real_pass, t53: S["53"].real_total, p45: S["45"].real_pass, t45: S["45"].real_total};
  h += '<div class="sec"><h3>' + esc(L(K.verH)) + "</h3><ul>" + L(K.ver).map(function(s){ return "<li>" + esc(fmt(s, vt)) + "</li>"; }).join("") + "</ul></div>";
  h += '<div class="sec"><h3>' + esc(L(K.testH)) + '</h3><p class="hint">' + esc(fmt(L(K.test), vt)) + '</p><p><a href="#/basics">' + esc(L(K.back)) + "</a></p></div></div>";
  $main.innerHTML = h;
  A.each("#nwgrp .chip", function(b){ b.onclick = function(){ grp = b.getAttribute("data-g"); render($main); }; }, $main);
  ["nwshader", "nwstarf"].forEach(function(id){ var el = document.getElementById(id); if(el) el.onchange = function(){ render($main); }; });
}
A.register("nw", function($main){ render($main); });
})();
