/* Textures tab (bilingual): 120 CC0 PBR/HDRI sets from Poly Haven and ambientCG, with credits. */
(function(){
"use strict";
var A = window.SD_API, L = A.L, esc = A.esc, X = window.TEX || {sets: [], cats: [], clips: {}}, BY = {}, tcat = "all";
X.sets.forEach(function(s){ BY[s.id] = s; });
var K = {
 ko: {all: "전체", intro: "PBR 재질 세트와 HDRI 120개예요(모두 CC0, 출처 표기). 카드를 눌러 맵 종류와 연결 방법을 보고, <b>블렌더로 복사</b> → 애드온의 <b>새 재질로 붙여넣기</b>로 바로 쓸 수 있어요. 텍스처 파일은 애드온 zip 안에 함께 들어 있어서 애드온이 자동으로 찾아요.",
      n: "{n}개 세트", q: " · 검색어 “{q}”", none: "검색 결과가 없습니다.", back: "← 텍스처 목록", prev: "미리보기", hdriPrev: " (톤맵한 HDRI)", zoom: "클릭하면 커져요", copy: "📋 블렌더로 복사",
      copyTip: "이 세트의 노드 연결을 JSON으로 복사 → 블렌더 애드온에서 붙여넣기", help: "애드온 설치·사용법", pbr: "PBR 재질 세트", hdri: "월드 조명 HDRI", how: "블렌더에서 연결하는 법",
      src: "출처", auth: "만든 사람", lic: "라이선스", open: "원본 페이지 ↗", noset: "없는 텍스처 세트입니다.", res: "해상도", file: "파일",
      howPbr: "미리 준비된 PBR 맵을 Principled BSDF에 연결한 재질이에요. 색상 맵은 sRGB, 노멀·거칠기·변위·금속·AO 맵은 Non-Color로 열어요. 노멀 맵은 Normal Map 노드를 거쳐 Normal에(OpenGL 기준), 변위 맵은 Displacement 노드로 Material Output의 Displacement에 이어요(Scale 0.05부터). Cycles에서 실제 굴곡을 보려면 재질 설정의 Displacement를 ‘Displacement Only’ 또는 ‘Displacement and Bump’로 바꾸세요.",
      howHdri: "재질이 아니라 장면 전체를 비추는 HDRI예요. 붙여넣으면 월드에 Environment Texture → Background → World Output이 만들어져요(Image Texture가 아님). 밝기는 Background의 Strength로 조절하세요.",
      tip: {color: "Image Texture(sRGB) → Principled BSDF의 Base Color", normal: "Image Texture(Non-Color) → Normal Map → Principled의 Normal. OpenGL 맵이에요.", roughness: "Image Texture(Non-Color) → Principled의 Roughness. 흰 부분이 더 거칠어요.",
            displacement: "Image Texture(Non-Color) → Displacement → Material Output의 Displacement. Scale은 0.05부터.", ao: "파일만 들어 있어요. 색과 곱하면 틈새가 더 살아나요(복사 연결에는 넣지 않음).", metalness: "Image Texture(Non-Color) → Principled의 Metallic.",
            hdri: "World의 Environment Texture → Background → World Output. 밝기는 Strength로."},
      credit: "텍스처·HDRI 출처: <a href='https://polyhaven.com/' target='_blank' rel='noopener'>Poly Haven</a> (<a href='https://polyhaven.com/license' target='_blank' rel='noopener'>CC0</a>), <a href='https://ambientcg.com/' target='_blank' rel='noopener'>ambientCG</a> (<a href='https://docs.ambientcg.com/license/' target='_blank' rel='noopener'>CC0</a>). CC0라 표기 의무는 없지만 만든 분들께 감사하는 마음으로 세트마다 출처와 작가를 적었어요.", close: "닫기"},
 en: {all: "All", intro: "120 PBR material sets and HDRIs (all CC0, credited). Open a card to see its maps and how to wire them, then press <b>Copy to Blender</b> → <b>Paste as new material</b> in the add-on. The texture files ship inside the add-on zip, so the add-on finds them automatically.",
      n: "{n} sets", q: " · search “{q}”", none: "No results.", back: "← All textures", prev: "Preview", hdriPrev: " (tone-mapped HDRI)", zoom: "click to enlarge", copy: "📋 Copy to Blender",
      copyTip: "Copy this set's node setup as JSON → paste with the Blender add-on", help: "Add-on install & use", pbr: "PBR material set", hdri: "World lighting HDRI", how: "How to wire it in Blender",
      src: "Source", auth: "Author", lic: "Licence", open: "Original page ↗", noset: "No such texture set.", res: "Resolution", file: "File",
      howPbr: "A material built by wiring ready-made PBR maps into a Principled BSDF. Open the colour map as sRGB and the normal, roughness, displacement, metallic and AO maps as Non-Color. The normal map goes through a Normal Map node into Normal (OpenGL convention); the displacement map goes through a Displacement node into the Material Output's Displacement (start Scale at 0.05). To see real relief in Cycles, set the material's Displacement setting to 'Displacement Only' or 'Displacement and Bump'.",
      howHdri: "Not a material but an HDRI that lights the whole scene. Pasting creates Environment Texture → Background → World Output in the World (not an Image Texture). Adjust brightness with the Background's Strength.",
      tip: {color: "Image Texture (sRGB) → Principled BSDF Base Color", normal: "Image Texture (Non-Color) → Normal Map → Principled Normal. This is an OpenGL map.", roughness: "Image Texture (Non-Color) → Principled Roughness. White areas are rougher.",
            displacement: "Image Texture (Non-Color) → Displacement → Material Output Displacement. Start Scale at 0.05.", ao: "Included as a file only. Multiply it with the colour to deepen crevices (not wired by the copy).", metalness: "Image Texture (Non-Color) → Principled Metallic.",
            hdri: "World: Environment Texture → Background → World Output. Brightness via Strength."},
      credit: "Textures and HDRIs: <a href='https://polyhaven.com/' target='_blank' rel='noopener'>Poly Haven</a> (<a href='https://polyhaven.com/license' target='_blank' rel='noopener'>CC0</a>), <a href='https://ambientcg.com/' target='_blank' rel='noopener'>ambientCG</a> (<a href='https://docs.ambientcg.com/license/' target='_blank' rel='noopener'>CC0</a>). CC0 needs no attribution, but every set lists its source and authors as a thank-you.", close: "Close"}
};
function k(){ return K[window.SDI.lang] || K.ko; }
function fmt(s, v){ return s.replace(/\{(\w+)\}/g, function(m, n){ return v[n]; }); }
function size(s){ return s.w + "×" + s.h + " · " + (s.bytes / 1048576).toFixed(1) + " MB"; }
function kind(s){ return s.kind === "hdri" ? "HDRI" + (s.hk ? " · " + L(X.hk[s.hk]) : "") : L(catOf(s.cat)); }
function catOf(c){ for(var i = 0; i < X.cats.length; i++) if(X.cats[i].id === c) return X.cats[i]; return {ko: c, en: c}; }
function title(s){ return window.SDI.lang === "en" ? s.en : s.ko; }
function match(s, q){ if(!q) return true; return A.norm([s.title, s.ko, s.en, s.cat, catOf(s.cat).ko, s.src, (s.authors || []).join(" ")].join(" ")).indexOf(q) >= 0; }
function card(s){
  return '<a class="card texcard setcard' + (s.kind === "hdri" ? " hdri" : "") + '" href="#/textures/' + encodeURIComponent(s.id) + '"><img loading="lazy" src="' + esc(s.thumb) + '" alt="' + esc(title(s)) + '"><div class="t"><div class="num">' + esc(kind(s)) + ' · CC0</div><div class="nm">' + esc(s.title) + '</div><div class="cat">' + esc(s.maps.map(function(m){ return L(m); }).join(" · ")) + "<br>" + esc(s.src) + " · " + esc(size(s)) + "</div></div></a>";
}
function list($main){
  var K1 = k(), q = A.norm(A.q), hits = X.sets.filter(function(s){ return match(s, q); }), counts = {all: hits.length};
  hits.forEach(function(s){ counts[s.cat] = (counts[s.cat] || 0) + 1; });
  var shown = hits.filter(function(s){ return tcat === "all" || s.cat === tcat; });
  var h = '<p class="info">' + K1.intro + '</p><div class="chips" role="toolbar">' + [{id: "all", ko: K1.all, en: K1.all}].concat(X.cats).map(function(c){
    return '<button class="chip' + (c.id === tcat ? " on" : "") + '" data-tcat="' + esc(c.id) + '">' + esc(L(c)) + '<span class="n">' + (counts[c.id] || 0) + "</span></button>"; }).join("") + "</div>";
  h += '<p class="info" id="count">' + fmt(K1.n, {n: shown.length}) + (A.q ? fmt(K1.q, {q: esc(A.q)}) : "") + "</p>";
  if(!shown.length) h += '<div class="empty">' + esc(K1.none) + "</div>";
  h += '<div class="grid texgrid" id="grid">' + shown.map(card).join("") + '</div><p class="texcredit">' + K1.credit + "</p>";
  $main.innerHTML = h;
  A.each("[data-tcat]", function(b){ b.onclick = function(){ tcat = b.getAttribute("data-tcat"); list($main); }; }, $main);
}
function detail($main, id){
  var K1 = k(), s = BY[id]; if(!s){ $main.innerHTML = '<div class="empty">' + esc(K1.noset) + "</div>"; return; }
  var i = X.sets.indexOf(s), pv = X.sets[i - 1], nx = X.sets[i + 1];
  var h = '<a class="back" href="#/textures">' + esc(K1.back) + "</a> ";
  if(pv) h += '<a class="back" href="#/textures/' + encodeURIComponent(pv.id) + '" style="margin-left:12px">‹ ' + esc(pv.title) + "</a>";
  if(nx) h += '<a class="back" href="#/textures/' + encodeURIComponent(nx.id) + '" style="margin-left:12px">' + esc(nx.title) + " ›</a>";
  h += '<div class="detail texdetail"><div class="viewer texview"><button type="button" class="zoomhit" id="texzoom" title="' + esc(K1.zoom) + '"><img class="big texbig' + (s.kind === "hdri" ? " hdri" : "") + '" src="' + esc(s.preview) + '" alt="' + esc(title(s)) + '"></button>';
  h += '<p class="meta">' + esc(K1.prev) + (s.kind === "hdri" ? esc(K1.hdriPrev) : "") + " · " + esc(K1.zoom) + "</p>";
  h += '<div class="mapstrip">' + s.maps.map(function(m){ return '<button type="button" class="mapchip" data-src="' + esc(m.thumb) + '" data-title="' + esc(L(m)) + '"><img loading="lazy" src="' + esc(m.thumb) + '" alt="' + esc(L(m)) + '"><small>' + esc(L(m)) + " · " + esc(m.cs) + "</small></button>"; }).join("") + "</div>";
  h += '<div class="copyrow"><button class="copybtn" id="copybtn" title="' + esc(K1.copyTip) + '">' + esc(K1.copy) + '</button><span class="copymsg" id="copymsg" role="status" aria-live="polite"></span><a class="copyhelp" href="#/basics/addon">' + esc(K1.help) + "</a></div>";
  h += '</div><div class="panel"><div class="kick">' + esc(kind(s)) + "</div><h1>" + esc(s.title) + '</h1><p class="one">' + esc(s.kind === "hdri" ? K1.hdri : K1.pbr) + " · " + esc(size(s)) + "</p>";
  h += '<div class="sec"><dl class="kv"><dt>' + esc(K1.src) + "</dt><dd>" + esc(s.src) + ' — <a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(K1.open) + "</a></dd>" + (s.authors.length ? "<dt>" + esc(K1.auth) + "</dt><dd>" + esc(s.authors.join(", ")) + "</dd>" : "") + "<dt>" + esc(K1.lic) + "</dt><dd>CC0 1.0</dd><dt>" + esc(K1.res) + "</dt><dd>" + esc(size(s)) + "</dd></dl></div>";
  h += '<div class="sec big"><h3>' + esc(K1.how) + "</h3><p>" + esc(s.kind === "hdri" ? K1.howHdri : K1.howPbr) + '</p><ul class="maphow">' + s.maps.map(function(m){ return "<li><b>" + esc(L(m)) + "</b> (<code>" + esc(m.file) + "</code>) — " + esc(K1.tip[m.role] || "") + "</li>"; }).join("") + "</ul></div></div></div>";
  h += '<p class="texcredit">' + K1.credit + "</p>";
  $main.innerHTML = h; window.scrollTo(0, 0);
  document.getElementById("texzoom").onclick = function(){ lightbox(s.preview, title(s)); };
  A.each(".mapchip", function(b){ b.onclick = function(){ lightbox(b.getAttribute("data-src"), s.title + " — " + b.getAttribute("data-title")); }; }, $main);
  var c = X.clips[s.id], cb = document.getElementById("copybtn");
  cb.disabled = !c; cb.onclick = function(){ A.copyText(JSON.stringify(c[window.SDI.lang] || c.ko), document.getElementById("copymsg")); };
}
function lightbox(src, t){
  closeLB(); var ov = document.createElement("div"); ov.className = "lightbox"; ov.id = "lightbox"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true");
  ov.innerHTML = '<button type="button" class="lb-close" id="lbclose" aria-label="' + esc(k().close) + '">×</button><img src="' + esc(src) + '" alt="' + esc(t) + '"><p>' + esc(t) + "</p>";
  document.body.appendChild(ov); document.body.classList.add("lb-on");
  document.getElementById("lbclose").onclick = closeLB; ov.onclick = function(e){ if(e.target === ov) closeLB(); }; document.addEventListener("keydown", lbKey);
}
function lbKey(e){ if(e.key === "Escape") closeLB(); }
function closeLB(){ var o = document.getElementById("lightbox"); if(o) o.parentNode.removeChild(o); document.body.classList.remove("lb-on"); document.removeEventListener("keydown", lbKey); }
A.register("textures", function($main, rest){ closeLB(); if(rest[0]) detail($main, decodeURIComponent(rest[0])); else list($main); });
})();
