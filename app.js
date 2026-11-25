(function(){
"use strict";
var D = window.DATA, I = window.SDI, T = I.T, L = I.L;
var $main = document.getElementById("main"), $q = document.getElementById("q");
var st = {q: "", cat: "*", ncat: "*"};
var NODE_BY_NAME = {}, REC_BY_ID = {}, NCAT = {};
D.nodes.forEach(function(n){ NODE_BY_NAME[n.name] = n; });
D.recipes.forEach(function(r){ REC_BY_ID[r.id] = r; });
D.ncats.forEach(function(c){ NCAT[c.ko] = c; });
var CATS = {}; D.cats.forEach(function(c){ CATS[c.ko] = c; });

function esc(s){ return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
function norm(s){ return String(s || "").toLowerCase().replace(/\s+/g, ""); }
function each(sel, fn, root){ Array.prototype.forEach.call((root || document).querySelectorAll(sel), fn); }
function lang(){ return I.lang; }
function en(s){ return lang() === "en" && D.strEn[s] != null ? D.strEn[s] : s; }
function catName(c){ return CATS[c] ? L(CATS[c]) : c; }
function ncatName(c){ return NCAT[c] ? L(NCAT[c]) : c; }
function img(stem, si, vi){ return "img/" + stem + "_s" + si + "_v" + vi + ".webp"; }
function thumb(stem, si, vi){ return "thumb/" + stem + "_s" + si + "_v" + vi + ".webp"; }
function firstVi(s){ var b = s.base || 0; if(s.variants[b]) return b; for(var i = 0; i < s.variants.length; i++) if(s.variants[i]) return i; return -1; }
function cover(item){ var s = item.series[0]; if(!s) return ""; var v = firstVi(s); return v < 0 ? "" : thumb(item.stem, 0, v); }
function nDone(item){ return item.series.reduce(function(a, s){ return a + s.done; }, 0); }
function nTotal(item){ return item.series.reduce(function(a, s){ return a + s.total; }, 0); }

/* ---------- patch-compressed clips/trees ---------- */
function clone(x){ return JSON.parse(JSON.stringify(x)); }
function unpack(pk, vi){
  if(!pk) return null; var k = pk.idx.indexOf(vi); if(k < 0) return null;
  var d = clone(pk.t), p = pk.p[k]; if(!p) return d;
  for(var i = 0; i < p.length; i++){
    var path = p[i][0], v = p[i][1]; if(!path.length) return clone(v);
    var x = d; for(var j = 0; j < path.length - 1; j++) x = x[path[j]]; x[path[path.length - 1]] = v;
  }
  return d;
}
function mapStrings(x){                  /* Korean labels/material names -> English in the copied JSON + diagram */
  if(lang() !== "en") return x;
  if(typeof x === "string") return en(x);
  if(Array.isArray(x)) return x.map(mapStrings);
  if(x && typeof x === "object"){ var o = {}; Object.keys(x).forEach(function(k){ o[k] = (k === "script" || k === "ies") ? x[k] : mapStrings(x[k]); }); return o; }
  return x;
}
function clipFor(stem, si, vi){ var c = unpack((window.CLIPS || {})[stem + "_s" + si], vi); return c ? mapStrings(c) : null; }
function treeFor(stem, si, vi){ var t = unpack((window.TREES || {})[stem + "_s" + si], vi); return t ? mapStrings(t) : null; }

/* ---------- value formatting ---------- */
function fmt(v){
  if(typeof v === "number") return (Math.round(v * 1000) / 1000).toString();
  if(Array.isArray(v)){ if(v.length === 4 && v.every(function(x){ return typeof x === "number"; })) return "■"; return "(" + v.map(fmt).join(", ") + ")"; }
  if(typeof v === "boolean") return v ? T("on") : T("off");
  return en(String(v));
}
function seriesTitle(s){ return lang() === "en" ? s.title_en : s.title; }
function varyOf(s){ return lang() === "en" ? s.vary_en : s.vary; }
function valueLabel(s, vi){
  var V = varyOf(s), raw = s.vary;
  return V.map(function(v, k){ var val = raw[k][2][vi]; return v[0] + " › " + v[1] + " = " + fmt(val); }).join(" · ");
}

/* ---------- header / tabs ---------- */
function setTab(t){ each("#tabs a", function(a){ a.classList.toggle("on", a.getAttribute("data-tab") === t); }); }
function chrome(){
  document.title = T("docTitle");
  var md = document.querySelector('meta[name="description"]'); if(md) md.setAttribute("content", T("metaDesc", {nN: D.nN, nR: D.nR}));
  document.getElementById("brandT").textContent = T("siteTitle");
  document.getElementById("brandS").textContent = T("siteSub");
  var tabs = {recipes: T("tabRecipes", {n: D.nR}), nodes: T("tabNodes", {n: D.nN}), textures: T("tabTextures"), engines: T("tabEngines"), photo: T("tabPhoto"), immersive: T("tabImmersive"), basics: T("tabBasics")};
  each("#tabs a", function(a){ var k = a.getAttribute("data-tab"); if(tabs[k]) a.textContent = tabs[k]; });
  $q.placeholder = T("search"); $q.setAttribute("aria-label", T("search"));
  var lb = document.getElementById("langbtn"); lb.textContent = T("lang"); lb.setAttribute("aria-label", T("langLabel") + ": " + T("lang"));
  document.getElementById("foot").textContent = T("footer");
}
function chips(list, cur, counts, attr, nameFn){
  return '<div class="chips" role="toolbar">' + ["*"].concat(list).map(function(c){
    return '<button class="chip' + (c === cur ? " on" : "") + '" ' + attr + '="' + esc(c) + '">' + esc(c === "*" ? T("all") : nameFn(c)) + '<span class="n">' + (counts[c] || 0) + "</span></button>";
  }).join("") + "</div>";
}
function engBadge(e){
  if(!e || e === "둘 다" || e === "Both") return '<span class="badge">' + esc(T("both")) + "</span>";
  if(/Cycles/.test(e) && !/EEVEE|Eevee/.test(e)) return '<span class="badge c">' + esc(e) + "</span>";
  return '<span class="badge e">' + esc(e) + "</span>";
}

/* ---------- lists ---------- */
function hayR(r){ return norm([r.id, r.stem, r.ko.name, r.en.name, r.ko.one, r.en.one, r.cat, catName(r.cat), r.chain, r.ko.use, r.en.use, r.ko.settings, r.en.settings, r.nodes.join(" ")].join(" ")); }
function hayN(n){ return norm([n.name, n.stem, n.cat, ncatName(n.cat), n.ko.desc, n.en.desc, n.ko.one, n.en.one, n.ko.analogy, n.en.analogy].join(" ")); }
function renderRecipes(){
  setTab("recipes");
  var q = norm(st.q), hits = D.recipes.filter(function(r){ return !q || hayR(r).indexOf(q) >= 0; });
  var counts = {"*": hits.length}; hits.forEach(function(r){ counts[r.cat] = (counts[r.cat] || 0) + 1; });
  var shown = hits.filter(function(r){ return st.cat === "*" || r.cat === st.cat; });
  var h = '<p class="info">' + esc(L(D.text.intro).replace("{nR}", D.nR).replace("{nN}", D.nN)) + "</p>" + chips(D.cats.map(function(c){ return c.ko; }), st.cat, counts, "data-cat", catName);
  h += '<p class="info" id="count">' + esc(T("nRecipes", {n: shown.length})) + (st.q ? " · " + esc(T("query", {q: st.q})) : "") + "</p>";
  if(!shown.length) h += '<div class="empty">' + esc(T("noHits")) + "</div>";
  h += '<div class="grid" id="grid">' + shown.map(function(r){
    var c = cover(r);
    return '<a class="card" href="#/r/' + r.id + '" data-id="' + r.stem + '">' + (c ? '<img loading="lazy" src="' + c + '" alt="' + esc(L(r, "name")) + '" width="168" height="168">' : '<div class="noimg">⏳</div>') +
      '<div class="t"><div class="num">' + r.stem + " · " + esc(catName(r.cat)) + (r.est ? ' <span class="badge est">' + esc(T("est")) + "</span>" : "") + '</div><div class="nm">' + esc(L(r, "name")) + '</div><div class="cone">' + esc(L(r, "one")) + '</div><div class="cat">' + esc(T("variants", {n: nDone(r)})) + " " + engBadge(L(r, "engine")) + "</div></div></a>";
  }).join("") + "</div>";
  $main.innerHTML = h;
  each("[data-cat]", function(b){ b.onclick = function(){ st.cat = b.getAttribute("data-cat"); renderRecipes(); }; }, $main);
}
function renderNodes(){
  setTab("nodes");
  var q = norm(st.q), hits = D.nodes.filter(function(n){ return !q || hayN(n).indexOf(q) >= 0; });
  var counts = {"*": hits.length}; hits.forEach(function(n){ counts[n.cat] = (counts[n.cat] || 0) + 1; });
  var shown = hits.filter(function(n){ return st.ncat === "*" || n.cat === st.ncat; });
  var h = '<p class="info">' + esc(L(D.text.nodeNote)) + "</p>" + chips(D.ncats.map(function(c){ return c.ko; }), st.ncat, counts, "data-ncat", ncatName);
  h += '<p class="info" id="count">' + esc(T("nNodes", {n: shown.length})) + (st.q ? " · " + esc(T("query", {q: st.q})) : "") + "</p>";
  if(!shown.length) h += '<div class="empty">' + esc(T("noHits")) + "</div>";
  h += '<div class="grid" id="grid">' + shown.map(function(n){
    var c = cover(n), col = (NCAT[n.cat] || {}).color || "#666";
    return '<a class="card' + (n.removed ? " removed" : "") + '" href="#/n/' + n.idx + '" data-id="' + n.stem + '">' + (c ? '<img loading="lazy" src="' + c + '" alt="' + esc(n.name) + '" width="168" height="168">' : '<div class="noimg">' + (n.removed ? "✕" : "⏳") + "</div>") +
      '<div class="t"><div class="num">' + n.stem + ' · <span style="color:' + col + '">■</span> ' + esc(ncatName(n.cat)) + (n.new53 ? ' <span class="badge new">' + esc(T("new53")) + "</span>" : "") + (n.removed ? ' <span class="badge rm">' + esc(T("removed")) + "</span>" : "") +
      '</div><div class="nm">' + esc(n.name) + '</div><div class="cat">' + esc(L(n, "one")) + "</div></div></a>";
  }).join("") + "</div>";
  $main.innerHTML = h;
  each("[data-ncat]", function(b){ b.onclick = function(){ st.ncat = b.getAttribute("data-ncat"); renderNodes(); }; }, $main);
}

/* ---------- node diagram (SVG) ---------- */
function lin2s(c){ c = Math.max(0, Math.min(1, c)); return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055; }
function rgb(a){ return "rgb(" + a.slice(0, 3).map(function(x){ return Math.round(lin2s(x) * 255); }).join(",") + ")"; }
function sockColor(s){
  if(/BSDF|Shader|Volume|Emission|Background|Holdout|Surface|Closure/.test(s)) return "#63c763";
  if(/Color|Albedo|Diffuse|Glossy|Transmission|Image/.test(s)) return "#c7c729";
  if(/Vector|Normal|UV|Generated|Object|Camera|Window|Reflection|Position|Tangent|Location|Incoming|Parametric|Displacement|Offset|Coordinates/.test(s)) return "#6363c7";
  return "#a1a1a1";
}
var CATCOL = {"셰이더":"#2f7a55","텍스처":"#a8611d","컬러":"#8d7414","벡터":"#3b4aa8","컨버터":"#2c7aa8","입력":"#8f2b20","출력":"#555b61","유틸리티":"#6a3584","레이아웃":"#4d4d4d"};
function okey(l){ return l.length > 4 ? l[1] + "#" + l[4] : l[1]; }
function ikey(l){ return l.length > 5 ? l[3] + "#" + l[5] : l[3]; }
function sname(k){ return k.split("#")[0]; }
function titles(t){
  if(t._titles) return t._titles;
  var base = {}, cnt = {}, seen = {}, out = {};
  t.nodes.forEach(function(n){ var b = n.label && n.label !== n.name ? n.label : (n.dict || n.name); base[n.name] = b; cnt[b] = (cnt[b] || 0) + 1; });
  t.nodes.forEach(function(n){ var b = base[n.name]; if(cnt[b] > 1){ seen[b] = (seen[b] || 0) + 1; out[n.name] = b + " " + seen[b]; } else out[n.name] = b; });
  t._titles = out; return out;
}
function varyMap(t, vary){
  /* vary entries name a node by label or name; map to tree node names */
  var m = {};
  (vary || []).forEach(function(v){
    var hit = t.nodes.filter(function(n){ return n.label === v[0] || n.name === v[0] || n.dict === v[0] || titles(t)[n.name] === v[0]; })[0];
    if(hit) (m[hit.name] = m[hit.name] || []).push(v[1]);
  });
  return m;
}
function diagram(t, vary, opts){
  opts = opts || {};
  var nodes = t.nodes.filter(function(n){ return n.type !== "NodeFrame"; }), links = t.links, byName = {};
  nodes.forEach(function(n){ byName[n.name] = n; n._in = []; n._out = []; });
  links.forEach(function(l){ if(byName[l[0]] && byName[l[2]]){ byName[l[2]]._in.push(l); byName[l[0]]._out.push(l); } });
  var depth = {};
  function dep(n, seen){ if(depth[n.name] != null) return depth[n.name]; if(seen[n.name]) return 0; seen[n.name] = 1; var d = 0; n._out.forEach(function(l){ d = Math.max(d, dep(byName[l[2]], seen) + 1); }); depth[n.name] = d; return d; }
  nodes.forEach(function(n){ dep(n, {}); });
  var maxd = 0; nodes.forEach(function(n){ maxd = Math.max(maxd, depth[n.name]); });
  var cols = []; nodes.forEach(function(n){ var c = maxd - depth[n.name]; (cols[c] = cols[c] || []).push(n); });
  var W = 184, GX = 46, PAD = 12, RH = 17, HH = 24, varied = varyMap(t, vary);
  nodes.forEach(function(n){
    var outs = [], ins = [];
    n._out.forEach(function(l){ if(outs.indexOf(okey(l)) < 0) outs.push(okey(l)); });
    n._in.forEach(function(l){ if(ins.indexOf(ikey(l)) < 0) ins.push(ikey(l)); });
    function idx(k){ var m = k.split("#"); return m.length > 1 ? +m[1] : 0; }
    outs.sort(function(a, b){ return idx(a) - idx(b); }); ins.sort(function(a, b){ return idx(a) - idx(b); });
    var insNames = ins.map(sname), vals = [], hotp = varied[n.name] || [];
    Object.keys(n.inputs || {}).forEach(function(k){ if(insNames.indexOf(k) < 0) vals.push({k: k, v: n.inputs[k], hot: hotp.indexOf(k) >= 0}); });
    Object.keys(n.props || {}).forEach(function(k){ vals.push({k: k, v: n.props[k], hot: hotp.some(function(p){ return p.toLowerCase() === k.toLowerCase(); })}); });
    if(n.ramp) vals.push({k: "Ramp", v: n.ramp.map(function(s){ return fmt(s[0]); }).join(" / ")});
    vals.sort(function(a, b){ return (b.hot ? 1 : 0) - (a.hot ? 1 : 0); });
    var lim = opts.maxVals || 4;
    n._outs = outs; n._ins = ins; n._vals = vals.slice(0, lim); n._more = vals.length - n._vals.length;
    n._h = HH + 4 + (outs.length + ins.length + n._vals.length) * RH + (n._more > 0 ? 14 : 0) + 6;
  });
  var colH = cols.map(function(c){ return (c || []).reduce(function(a, n){ return a + n._h + 16; }, 0); });
  var H = Math.max.apply(null, colH.concat([60])) + PAD * 2, Wt = cols.length * (W + GX) - GX + PAD * 2;
  cols.forEach(function(c, ci){ var y = PAD + (H - PAD * 2 - colH[ci]) / 2; (c || []).forEach(function(n){ n._x = PAD + ci * (W + GX); n._y = y; y += n._h + 16; }); });
  function outY(n, k){ return n._y + HH + 4 + n._outs.indexOf(k) * RH + RH / 2; }
  function inY(n, k){ return n._y + HH + 4 + (n._outs.length + n._ins.indexOf(k)) * RH + RH / 2; }
  var sv = '<svg xmlns="http://www.w3.org/2000/svg" width="' + Wt + '" height="' + H + '" style="width:100%;min-width:' + Math.round(Math.min(Wt, Wt * 0.72)) + 'px;max-width:' + Wt + 'px;height:auto" viewBox="0 0 ' + Wt + " " + H + '" font-family="Noto Sans KR, Malgun Gothic, Apple SD Gothic Neo, sans-serif" role="img" aria-label="' + esc(T("diagTitle")) + '">';
  links.forEach(function(l){
    var a = byName[l[0]], b = byName[l[2]]; if(!a || !b) return;
    var x1 = a._x + W, y1 = outY(a, okey(l)), x2 = b._x, y2 = inY(b, ikey(l)), mx = (x1 + x2) / 2; if(x2 <= x1) mx = x1 + 40;
    sv += '<path d="M' + x1 + "," + y1 + " C" + mx + "," + y1 + " " + mx + "," + y2 + " " + x2 + "," + y2 + '" stroke="' + sockColor(l[1]) + '" stroke-width="2.6" fill="none"><title>' + esc(l[0] + " [" + l[1] + "] → [" + l[3] + "] " + l[2]) + "</title></path>";
  });
  nodes.forEach(function(n){
    var hc = CATCOL[n.cat] || (/Output/.test(n.type) ? "#555b61" : "#3d4148"), hot = (varied[n.name] || []).length > 0, title = titles(t)[n.name];
    var link = n.dict && NODE_BY_NAME[n.dict] ? NODE_BY_NAME[n.dict].idx : 0;
    sv += '<g class="nbox" ' + (link ? 'data-node="' + link + '"' : "") + "><title>" + esc((n.dict || n.type) + (link ? T("toNode") : "")) + "</title>";
    sv += '<rect x="' + n._x + '" y="' + n._y + '" width="' + W + '" height="' + n._h + '" rx="7" fill="#3a3c42" stroke="' + (hot ? "#ffcf3f" : "#17181b") + '" stroke-width="' + (hot ? 3 : 1) + '"/>';
    sv += '<path d="M' + n._x + "," + (n._y + HH) + " v-17 a7,7 0 0 1 7,-7 h" + (W - 14) + " a7,7 0 0 1 7,7 v17 z" + '" fill="' + hc + '"/>';
    sv += '<text x="' + (n._x + 8) + '" y="' + (n._y + 16.5) + '" fill="#fff" font-size="13.5" font-weight="700">' + esc(title.length > 24 ? title.slice(0, 23) + "…" : title) + "</text>";
    var y = n._y + HH + 4;
    n._outs.forEach(function(k){ var o = sname(k); sv += '<text x="' + (n._x + W - 10) + '" y="' + (y + 12.5) + '" fill="#fff" font-size="12.5" text-anchor="end">' + esc(o) + '</text><circle cx="' + (n._x + W) + '" cy="' + (y + RH / 2) + '" r="5" fill="' + sockColor(o) + '" stroke="#111"/>'; y += RH; });
    n._ins.forEach(function(k){ var o = sname(k), same = n._ins.filter(function(x){ return sname(x) === o; }); if(same.length > 1) o += " " + (same.indexOf(k) + 1); sv += '<circle cx="' + n._x + '" cy="' + (y + RH / 2) + '" r="5" fill="' + sockColor(o) + '" stroke="#111"/><text x="' + (n._x + 10) + '" y="' + (y + 12.5) + '" fill="#fff" font-size="12.5">' + esc(o) + "</text>"; y += RH; });
    n._vals.forEach(function(Lv){
      var col = Lv.hot ? "#ffd75e" : "#c9ccd1", val = Lv.v;
      sv += '<text x="' + (n._x + 10) + '" y="' + (y + 12.5) + '" fill="' + col + '" font-size="12">' + esc(Lv.k.length > 17 ? Lv.k.slice(0, 16) + "…" : Lv.k) + "</text>";
      if(Array.isArray(val) && val.length === 4 && val.every(function(x){ return typeof x === "number"; })) sv += '<rect x="' + (n._x + W - 44) + '" y="' + (y + 3) + '" width="34" height="12" rx="2" fill="' + rgb(val) + '" stroke="#111"/>';
      else { var t2 = fmt(val); if(t2.length > 13) t2 = t2.slice(0, 12) + "…"; sv += '<text x="' + (n._x + W - 10) + '" y="' + (y + 12.5) + '" fill="' + (Lv.hot ? "#ffd75e" : "#fff") + '" font-size="12" text-anchor="end">' + esc(t2) + "</text>"; }
      y += RH;
    });
    if(n._more > 0) sv += '<text x="' + (n._x + 10) + '" y="' + (y + 10) + '" fill="#9aa0a8" font-size="10.5">' + esc(T("moreVals", {n: n._more})) + "</text>";
    sv += "</g>";
  });
  return sv + "</svg>";
}
function connList(t){
  var tt = titles(t);
  function nm(x){ return tt[x] || x; }
  function insock(l){
    var same = t.links.filter(function(m){ return m[2] === l[2] && m[3] === l[3]; });
    if(same.length < 2 || l.length < 6) return l[3];
    var ids = same.map(function(m){ return m[5]; }).sort(function(a, b){ return a - b; });
    return l[3] + " " + (ids.indexOf(l[5]) + 1) + " " + (ids.indexOf(l[5]) === 0 ? T("top") : T("bottom"));
  }
  var lvl = {}; t.nodes.forEach(function(n){ lvl[n.name] = 0; });
  for(var it = 0; it < 30; it++) t.links.forEach(function(l){ if(lvl[l[2]] < lvl[l[0]] + 1) lvl[l[2]] = lvl[l[0]] + 1; });
  var order = t.links.slice().sort(function(a, b){ return (lvl[a[0]] - lvl[b[0]]) || (lvl[a[2]] - lvl[b[2]]); });
  return '<ol class="conn">' + order.map(function(l){
    return "<li><b>" + esc(nm(l[0])) + '</b> <span class="sock" style="border-color:' + sockColor(l[1]) + '">' + esc(l[1]) + '</span> <span class="ar">→</span> <span class="sock" style="border-color:' + sockColor(l[3]) + '">' + esc(insock(l)) + "</span> <b>" + esc(nm(l[2])) + "</b></li>";
  }).join("") + "</ol>";
}
function curveName(t, i){ if(t === "ShaderNodeFloatCurve") return ""; if(t === "ShaderNodeVectorCurve") return ["X", "Y", "Z"][i]; return ["R", "G", "B", T("curveAll")][i]; }
function hex(a){ return "#" + a.slice(0, 3).map(function(x){ var v = Math.round(lin2s(x) * 255).toString(16).toUpperCase(); return v.length < 2 ? "0" + v : v; }).join(""); }
function sw(a){ return '<span class="sw" style="background:' + rgb(a) + '"></span>'; }
function valueTable(t, vary){
  var rows = [], hotm = varyMap(t, vary);
  t.nodes.forEach(function(n){
    var kv = [], hot = hotm[n.name] || [];
    Object.keys(n.inputs || {}).forEach(function(k){ var v = n.inputs[k]; kv.push('<span class="kv1' + (hot.indexOf(k) >= 0 ? " hot" : "") + '"><span class="k">' + esc(k) + "</span> = " + (Array.isArray(v) && v.length === 4 ? sw(v) + " Hex " + hex(v) : "<b>" + esc(fmt(v)) + "</b>") + "</span>"); });
    Object.keys(n.props || {}).forEach(function(k){ kv.push('<span class="kv1' + (hot.some(function(p){ return p.toLowerCase() === k.toLowerCase(); }) ? " hot" : "") + '"><span class="k">' + esc(k) + "</span> = <b>" + esc(fmt(n.props[k])) + "</b></span>"); });
    if(n.curves) n.curves.forEach(function(c){ kv.push('<span class="kv1"><span class="k">' + esc(T("curvePts", {c: curveName(n.type, c[0])})) + "</span> = <b>" + c[1].map(function(p){ return "(" + fmt(p[0]) + ", " + fmt(p[1]) + ")"; }).join(" ") + "</b></span>"); });
    if(n.ramp) kv.push('<span class="kv1"><span class="k">' + esc(T("rampStops")) + "</span> = " + n.ramp.map(function(s){ return "<b>" + fmt(s[0]) + "</b> " + sw(s[1]) + hex(s[1]); }).join(" · ") + "</span>");
    if(kv.length) rows.push('<div class="vrow"><div class="vn">' + esc(titles(t)[n.name]) + '</div><div class="vv">' + kv.join("") + "</div></div>");
  });
  return rows.length ? rows.join("") : '<div class="vrow">' + esc(T("allDefault")) + "</div>";
}
function treeSection(t, vary, preview){
  if(!t) return "";
  var h = '<div class="sec big"><h3>' + esc(T("diagTitle")) + " <small>" + esc(t.title) + '</small></h3><p class="hint">' + esc(T("diagHint")) + (preview ? esc(T("previewHint")) : "") + '</p><div class="diag" id="diag">' + diagram(t, vary) + "</div>";
  t.nodes.forEach(function(n){ if(n.group) h += '<p class="hint">' + esc(T("groupInside", {g: n.label || n.name})) + '</p><div class="diag">' + diagram(n.group, []) + "</div>"; });
  h += "<h4>" + esc(T("connOrder")) + "</h4>" + connList(t) + "</div>";
  h += '<div class="sec big"><h3>' + esc(T("valsTitle")) + " <small>" + esc(T("valsSub")) + '</small></h3><div class="vals">' + valueTable(t, vary) + '</div><p class="hint">' + esc(T("valsHint")) + "</p></div>";
  return h;
}

/* ---------- copy ---------- */
function copyText(txt, msg){
  function ok(){ msg.textContent = T("copied"); msg.className = "copymsg ok"; }
  function fail(){
    msg.textContent = T("copyFail"); msg.className = "copymsg bad";
    var ta = document.getElementById("copyfallback"); if(!ta){ ta = document.createElement("textarea"); ta.id = "copyfallback"; ta.className = "copyfallback"; ta.setAttribute("aria-label", "JSON"); msg.parentNode.appendChild(ta); }
    ta.value = txt; ta.focus(); ta.select();
  }
  function legacy(){
    var ta = document.createElement("textarea"); ta.value = txt; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.top = "-1000px"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select(); var good = false;
    try { good = document.execCommand("copy"); } catch(e){ good = false; }
    document.body.removeChild(ta); good ? ok() : fail();
  }
  window.__lastCopied = txt;
  if(navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext !== false) navigator.clipboard.writeText(txt).then(ok, legacy);
  else legacy();
}

/* ---------- viewer: fine slider + crossfade; value shown == value copied ---------- */
function viewerHtml(item){
  var h = '<div class="viewer">';
  if(item.series.length > 1) h += '<div class="stabs" id="stabs" role="tablist" aria-label="' + esc(T("seriesPick")) + '">' + item.series.map(function(s, i){ return '<button class="stab" role="tab" data-s="' + i + '">' + esc(seriesTitle(s)) + "</button>"; }).join("") + "</div>";
  else h += '<div class="stitle">' + esc(seriesTitle(item.series[0])) + "</div>";
  h += '<div class="xf" id="xf"><img class="big a" id="bigA" alt="" width="512" height="512"><img class="big b" id="bigB" alt="" width="512" height="512" aria-hidden="true"><div class="pending" id="pending" hidden>⏳ ' + esc(T("noImg")) + "</div></div>";
  h += '<div class="slider"><button id="prev" aria-label="' + esc(T("prev")) + '">◀</button><input type="range" id="rng" min="0" step="1" aria-label="' + esc(T("seriesPick")) + '"><button id="next" aria-label="' + esc(T("next")) + '">▶</button></div>';
  h += '<div class="vlabel" id="vlabel" aria-live="polite"></div><div class="strip" id="strip"></div><div class="explain" id="explain"></div>';
  h += '<div class="copyrow"><button class="copybtn" id="copybtn" title="' + esc(T("copyTip")) + '">' + esc(T("copy")) + '</button><span class="copymsg" id="copymsg" role="status" aria-live="polite"></span><a class="copyhelp" href="#/basics/addon">' + esc(T("addonHelp")) + "</a></div>";
  h += '<div class="meta" id="vmeta"></div></div>';
  return h;
}
function wireViewer(item, sel, onChange){
  var $A = document.getElementById("bigA"), $B = document.getElementById("bigB"), $rng = document.getElementById("rng"), $lab = document.getElementById("vlabel"), $strip = document.getElementById("strip"), $pend = document.getElementById("pending");
  var front = $A;
  function avail(s){ var a = []; s.variants.forEach(function(v, i){ if(v) a.push(i); }); return a; }
  function swap(src, alt){
    if(front.getAttribute("src") === src) return;
    var back = front === $A ? $B : $A;
    back.onload = function(){ back.classList.add("show"); front.classList.remove("show"); back.removeAttribute("aria-hidden"); front.setAttribute("aria-hidden", "true"); front = back; };
    back.alt = alt; back.src = src;
  }
  function show(){
    var s = item.series[sel.s], av = avail(s);
    each("#stabs .stab", function(b){ var on = +b.getAttribute("data-s") === sel.s; b.classList.toggle("on", on); b.setAttribute("aria-selected", on); });
    document.getElementById("explain").innerHTML = L(s, "explain") ? '<span class="q">' + esc(T("whatIf")) + "</span> " + esc(L(s, "explain")) : "";
    if(!av.length){ $pend.hidden = false; $A.classList.remove("show"); $B.classList.remove("show"); $lab.textContent = valueLabel(s, s.base || 0); $strip.innerHTML = ""; document.getElementById("copybtn").disabled = true; onChange(s, -1); return; }
    $pend.hidden = true;
    if(av.indexOf(sel.v) < 0) sel.v = av.reduce(function(a, b){ return Math.abs(b - sel.v) < Math.abs(a - sel.v) ? b : a; }, av[0]);
    var k = av.indexOf(sel.v), v = s.variants[sel.v];
    $rng.max = av.length - 1; $rng.value = k;
    var label = valueLabel(s, sel.v);
    swap(img(item.stem, sel.s, sel.v), L(item, "name") || item.name + " — " + label);
    $rng.setAttribute("aria-valuetext", label);
    $lab.innerHTML = '<span class="stepn">' + esc(T("step", {i: k + 1, n: av.length})) + "</span> " + esc(label) + (sel.v === (s.base || 0) ? ' <span class="basev">(' + esc(T("baseVal")) + ")</span>" : "") + (av.length < s.total ? ' <span class="pend">' + esc(T("rendering", {d: av.length, t: s.total})) + "</span>" : "");
    document.getElementById("vmeta").textContent = v.engine + " · " + v.samples + " " + T("samples") + " · 512×512 · Blender " + D.blender;
    $strip.innerHTML = av.map(function(i){ return '<img src="' + thumb(item.stem, sel.s, i) + '" data-v="' + i + '" class="' + (i === sel.v ? "on" : "") + '" alt="' + esc(valueLabel(s, i)) + '" title="' + esc(valueLabel(s, i)) + '" width="56" height="56" loading="lazy">'; }).join("");
    each("img", function(im){ im.onclick = function(){ sel.v = +im.getAttribute("data-v"); show(); }; }, $strip);
    var cb = document.getElementById("copybtn"); cb.disabled = false;
    cb.setAttribute("data-key", item.stem + "_s" + sel.s + "_v" + sel.v);
    cb.onclick = function(){ var c = clipFor(item.stem, sel.s, sel.v); if(c){ c.variant = label; copyText(JSON.stringify(c), document.getElementById("copymsg")); } };
    document.getElementById("copymsg").textContent = "";
    onChange(s, sel.v);
  }
  $rng.oninput = function(){ var av = avail(item.series[sel.s]); sel.v = av[+$rng.value]; show(); };
  function step(d){ var av = avail(item.series[sel.s]); if(!av.length) return; var k = (av.indexOf(sel.v) + d + av.length) % av.length; sel.v = av[k]; show(); }
  document.getElementById("prev").onclick = function(){ step(-1); };
  document.getElementById("next").onclick = function(){ step(1); };
  each("#stabs .stab", function(b){ b.onclick = function(){ sel.s = +b.getAttribute("data-s"); sel.v = item.series[sel.s].base || 0; show(); }; });
  show();
}
function wireDiagram(){ each("#diag .nbox[data-node]", function(g){ g.onclick = function(){ location.hash = "#/n/" + g.getAttribute("data-node"); }; }); }
function chainHtml(c){
  if(!c) return "";
  return '<div class="chain">' + c.split(/\s*(→|\+)\s*/).map(function(p){
    if(p === "→" || p === "+") return '<span class="ar">' + p + "</span>";
    var nm = p.replace(/\(.*?\)/g, "").trim(), hit = NODE_BY_NAME[nm];
    return hit ? '<a class="nd" href="#/n/' + hit.idx + '">' + esc(p) + "</a>" : '<span class="nd">' + esc(p) + "</span>";
  }).join("") + "</div>";
}
function row(k, v){ return v ? '<div class="kv"><span class="k">' + esc(T(k)) + "</span><span>" + esc(v) + "</span></div>" : ""; }

function renderRecipe(id){
  var r = REC_BY_ID[id]; if(!r){ renderRecipes(); return; }
  setTab("recipes");
  var sel = {s: 0, v: r.series[0] ? (r.series[0].base || 0) : 0};
  var h = '<a class="back" href="#/recipes">' + esc(T("back")) + "</a>";
  h += '<div class="dhead"><div class="num">' + r.stem + " · " + esc(catName(r.cat)) + " " + engBadge(L(r, "engine")) + (r.est ? ' <span class="badge est">' + esc(T("est")) + "</span>" : "") + "</div><h1>" + esc(L(r, "name")) + '</h1><p class="one">' + esc(L(r, "one")) + "</p>";
  if(r.est) h += '<p class="estnote">⚠️ ' + esc(T("estNote")) + ' <a href="#/immersive">→</a></p>';
  h += "</div>";
  h += '<div class="detail"><div class="dl">' + viewerHtml(r) + '</div><div class="dr"><div class="sec">' + row("use", L(r, "use")) + row("settings", L(r, "settings")) + row("note", L(r, "note")) + row("caption", L(r, "caption")) + row("classRef", L(r, "cls"));
  if(r.chain) h += '<div class="kv"><span class="k">' + esc(T("chain")) + "</span>" + chainHtml(r.chain) + "</div>";
  h += '<div class="kv"><span class="k">' + esc(T("nodesUsed")) + '</span><span class="nlinks">' + r.nodes.map(function(nm){ var n = NODE_BY_NAME[nm]; return n ? '<a href="#/n/' + n.idx + '">' + esc(nm) + "</a>" : ""; }).join(" ") + "</span></div></div></div></div>";
  h += '<div id="treebox"></div>';
  $main.innerHTML = h; window.scrollTo(0, 0);
  wireViewer(r, sel, function(s, vi){ var t = vi >= 0 ? treeFor(r.stem, sel.s, vi) : null; document.getElementById("treebox").innerHTML = treeSection(t, varyOf(s).map(function(v, k){ return [s.vary[k][0], s.vary[k][1]]; }), false); wireDiagram(); });
}
function renderNode(idx){
  var n = D.nodes[idx - 1]; if(!n){ renderNodes(); return; }
  setTab("nodes");
  var col = (NCAT[n.cat] || {}).color || "#666";
  var h = '<a class="back" href="#/nodes">' + esc(T("back")) + "</a>";
  h += '<div class="dhead"><div class="num">' + n.stem + ' · <span style="color:' + col + '">■</span> ' + esc(ncatName(n.cat)) + (n.new53 ? ' <span class="badge new">' + esc(T("new53")) + "</span>" : "") + (n.removed ? ' <span class="badge rm">' + esc(T("removed")) + "</span>" : "") + "</div><h1>" + esc(n.name) + '</h1><p class="one">' + esc(L(n, "one")) + "</p></div>";
  var side = '<div class="sec">' + row("desc", L(n, "desc")) + row("analogy", L(n, "analogy")) + row("caption", L(n, "caption")) + row("classRef", L(n, "cls"));
  if(n.recipes.length) side += '<div class="kv"><span class="k">' + esc(T("usedIn")) + '</span><span class="nlinks">' + n.recipes.map(function(id){ var r = REC_BY_ID[id]; return '<a href="#/r/' + id + '">' + r.stem + " " + esc(L(r, "name")) + "</a>"; }).join(" ") + "</span></div>";
  side += "</div>";
  if(n.removed || !n.series.length){
    h += '<div class="detail"><div class="dl"><div class="sec removednote">✕ ' + esc(T("removedNote")) + '</div></div><div class="dr">' + side + "</div></div>";
    $main.innerHTML = h; window.scrollTo(0, 0); return;
  }
  var sel = {s: 0, v: n.series[0].base || 0};
  h += '<div class="detail"><div class="dl">' + viewerHtml(n) + '</div><div class="dr">' + side + "</div></div><div id=\"treebox\"></div>";
  $main.innerHTML = h; window.scrollTo(0, 0);
  wireViewer(n, sel, function(s, vi){ var t = vi >= 0 ? treeFor(n.stem, sel.s, vi) : null; document.getElementById("treebox").innerHTML = treeSection(t, s.vary.map(function(v){ return [v[0], v[1]]; }), n.preview); wireDiagram(); });
}
function renderBasics(sub){
  setTab("basics");
  var h = '<div class="sec"><h2>' + esc(T("steps")) + "</h2>" + L(D.text.steps).map(function(s){ return '<div class="kv"><span class="k">' + esc(s[0]) + "</span><span>" + esc(s[1]) + "</span></div>"; }).join("") + "</div>";
  h += '<div class="sec">' + L(D.text.callouts).map(function(s){ return "<h3>" + esc(s[0]) + "</h3><p>" + esc(s[1]) + "</p>"; }).join("") + "</div>";
  h += '<div class="sec"><h2>' + esc(T("glossary")) + '</h2><dl class="gloss">' + D.text.glossary.map(function(g){ var x = L(g); return "<dt>" + esc(x[0]) + "</dt><dd>" + esc(x[1]) + "</dd>"; }).join("") + "</dl></div>";
  h += '<div class="sec" id="addon">' + (window.SD_ADDON ? window.SD_ADDON() : "") + "</div>";
  $main.innerHTML = h;
  if(sub === "addon"){ var a = document.getElementById("addon"); if(a) a.scrollIntoView(); }
}

/* ---------- router ---------- */
var EXTRA = {};          /* tab modules register here: SD_API.register("engines", fn($main)) */
function route(){
  chrome();
  var hsh = location.hash.replace(/^#\/?/, "").replace(/[?&]lang=\w+/, ""), p = hsh.split("/");
  document.body.setAttribute("data-route", p[0] || "recipes");
  if(p[0] === "r" && p[1]) renderRecipe(+p[1]);
  else if(p[0] === "n" && p[1]) renderNode(+p[1]);
  else if(p[0] === "nodes") renderNodes();
  else if(p[0] === "basics") renderBasics(p[1]);
  else if(EXTRA[p[0]]){ setTab(p[0]); EXTRA[p[0]]($main, p.slice(1)); }
  else renderRecipes();
}
window.SD_API = {D: D, T: T, L: L, esc: esc, norm: norm, each: each, setTab: setTab, copyText: copyText, clipFor: clipFor, treeFor: treeFor, img: img, thumb: thumb, cover: cover, chainHtml: chainHtml, connList: connList, seriesTitle: seriesTitle, valueLabel: valueLabel, varyOf: varyOf,
  NODE_BY_NAME: NODE_BY_NAME, REC_BY_ID: REC_BY_ID, catName: catName, diagram: diagram, valueTable: valueTable, mapStrings: mapStrings, route: route,
  register: function(name, fn){ EXTRA[name] = fn; if(document.readyState !== "loading" && (location.hash.replace(/^#\/?/, "").split("/")[0]) === name) route(); }, get q(){ return st.q; }};
var qt = null;
$q.addEventListener("input", function(){
  clearTimeout(qt); qt = setTimeout(function(){
    st.q = $q.value.trim();
    var r = (location.hash.replace(/^#\/?/, "").split("/")[0]) || "recipes";
    if(r === "r" || r === "recipes" || r === "") { if(location.hash !== "#/recipes") location.hash = "#/recipes"; else renderRecipes(); }
    else if(r === "n" || r === "nodes"){ if(location.hash !== "#/nodes") location.hash = "#/nodes"; else renderNodes(); }
    else if(EXTRA[r]) route();
    else location.hash = "#/recipes";
  }, 160);
});
document.getElementById("langbtn").onclick = function(){ I.setLang(I.lang === "ko" ? "en" : "ko"); };
window.addEventListener("sdlang", route);
window.addEventListener("hashchange", route);
/* 11-25: tab scripts (photo.js after the 1.6 MB photo_data.js) may register after a 0 ms timer fires -> wait for all scripts */
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", route); else setTimeout(route, 0);
})();
