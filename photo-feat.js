/* 사진으로 찾기 — visual feature extractor + similarity (single source of truth: used by the app in the browser
   AND by build_photo.py through node, so render features and photo features are computed by the same code). */
function phtr(s){ var f = (typeof window !== "undefined") && window.PH_TR; return f ? f(s) : s; }
(function(root){
"use strict";
var N = 128;
function srgb2lin(c){ c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
var LUT = new Float64Array(256); for(var i = 0; i < 256; i++) LUT[i] = srgb2lin(i);
function fLab(t){ return t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116; }
function rgb2lab(r, g, b){
  var R = LUT[r], G = LUT[g], B = LUT[b];
  var X = (0.4124 * R + 0.3576 * G + 0.1805 * B) / 0.95047, Y = 0.2126 * R + 0.7152 * G + 0.0722 * B, Z = (0.0193 * R + 0.1192 * G + 0.9505 * B) / 1.08883;
  var fx = fLab(X), fy = fLab(Y), fz = fLab(Z);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}
function r3(x){ return Math.round(x * 1000) / 1000; }

/* rgba: Uint8(Clamped)Array W*H*4. mask: null or array W*H (0..255) = object pixels (renders). */
function extract(rgba, W, H, mask){
  var cx0 = 0, cy0 = 0, side = Math.min(W, H), useMask = false;
  if(mask){
    var x0 = W, y0 = H, x1 = -1, y1 = -1, cnt = 0;
    for(var y = 0; y < H; y++) for(var x = 0; x < W; x++) if(mask[y * W + x] >= 128){ cnt++; if(x < x0) x0 = x; if(x > x1) x1 = x; if(y < y0) y0 = y; if(y > y1) y1 = y; }
    if(cnt >= 0.02 * W * H){
      useMask = true;
      side = Math.max(x1 - x0 + 1, y1 - y0 + 1); side = Math.min(side, W, H);
      cx0 = Math.round((x0 + x1 + 1) / 2 - side / 2); cy0 = Math.round((y0 + y1 + 1) / 2 - side / 2);
      cx0 = Math.max(0, Math.min(W - side, cx0)); cy0 = Math.max(0, Math.min(H - side, cy0));
      // look at the inside of the object (less silhouette shading / background): 65% square around the mask centroid,
      // used only when the object covers >= 60% of it (thin shapes like rings keep the whole box)
      var sx = 0, sy = 0; for(y = 0; y < H; y++) for(x = 0; x < W; x++) if(mask[y * W + x] >= 128){ sx += x; sy += y; }
      var s2 = Math.max(8, Math.round(side * 0.65)), ix = Math.round(sx / cnt - s2 / 2), iy = Math.round(sy / cnt - s2 / 2);
      ix = Math.max(0, Math.min(W - s2, ix)); iy = Math.max(0, Math.min(H - s2, iy));
      var cov = 0; for(y = iy; y < iy + s2; y++) for(x = ix; x < ix + s2; x++) if(mask[y * W + x] >= 128) cov++;
      if(cov >= 0.6 * s2 * s2){ side = s2; cx0 = ix; cy0 = iy; }
    }
  }
  if(!useMask){ cx0 = Math.floor((W - side) / 2); cy0 = Math.floor((H - side) / 2); }
  // area resize to N x N
  var L = new Float64Array(N * N), A = new Float64Array(N * N), Bc = new Float64Array(N * N), M = new Float64Array(N * N);
  for(var oy = 0; oy < N; oy++){
    var sy0 = cy0 + Math.floor(oy * side / N), sy1 = Math.max(sy0 + 1, cy0 + Math.floor((oy + 1) * side / N));
    for(var ox = 0; ox < N; ox++){
      var sx0 = cx0 + Math.floor(ox * side / N), sx1 = Math.max(sx0 + 1, cx0 + Math.floor((ox + 1) * side / N));
      var sr = 0, sg = 0, sb = 0, sm = 0, n = 0;
      for(var yy = sy0; yy < sy1; yy++) for(var xx = sx0; xx < sx1; xx++){
        var p = (yy * W + xx) * 4; sr += rgba[p]; sg += rgba[p + 1]; sb += rgba[p + 2]; n++;
        sm += useMask ? (mask[yy * W + xx] >= 128 ? 1 : 0) : 1;
      }
      var lab = rgb2lab(Math.round(sr / n), Math.round(sg / n), Math.round(sb / n)), k = oy * N + ox;
      L[k] = lab[0]; A[k] = lab[1]; Bc[k] = lab[2]; M[k] = sm / n;
    }
  }
  var w = new Uint8Array(N * N), inner = new Uint8Array(N * N), cntW = 0;
  for(k = 0; k < N * N; k++){ w[k] = M[k] >= 0.5 ? 1 : 0; cntW += w[k]; }
  for(y = 1; y < N - 1; y++) for(x = 1; x < N - 1; x++){
    var ok = 1; for(var dy = -1; dy <= 1 && ok; dy++) for(var dx = -1; dx <= 1; dx++) if(!w[(y + dy) * N + x + dx]){ ok = 0; break; }
    inner[y * N + x] = ok;
  }
  // basic stats
  var sL = 0, sL2 = 0, sA = 0, sB = 0, sC = 0, Ls = [];
  var hist = new Float64Array(25);
  for(k = 0; k < N * N; k++){ if(!w[k]) continue;
    var l = L[k], a = A[k], b = Bc[k], c = Math.sqrt(a * a + b * b);
    sL += l; sL2 += l * l; sA += a; sB += b; sC += c; Ls.push(l);
    // colour histogram that ignores lightness (photo exposure varies): grey (C<8) + 12 hues x 2 chroma levels
    if(c < 8) hist[0] += 1;
    else { var hdeg = (Math.atan2(b, a) * 180 / Math.PI + 360) % 360, hb = Math.floor(hdeg / 30) % 12, cb = c < 25 ? 0 : 1; hist[1 + hb * 2 + cb] += 1; }
  }
  var nW = Math.max(1, cntW), mL = sL / nW, stdL = Math.sqrt(Math.max(0, sL2 / nW - mL * mL));
  Ls.sort(function(p, q){ return p - q; });
  var p5 = Ls.length ? Ls[Math.floor(0.05 * (Ls.length - 1))] : 0, p95 = Ls.length ? Ls[Math.floor(0.95 * (Ls.length - 1))] : 0;
  // smoothed, normalised histogram (hue neighbours share 20%)
  var hs = new Float64Array(25); hs[0] = hist[0];
  for(var hb2 = 0; hb2 < 12; hb2++) for(var cb2 = 0; cb2 < 2; cb2++){
    var v = hist[1 + hb2 * 2 + cb2]; hs[1 + hb2 * 2 + cb2] += 0.6 * v; hs[1 + ((hb2 + 1) % 12) * 2 + cb2] += 0.2 * v; hs[1 + ((hb2 + 11) % 12) * 2 + cb2] += 0.2 * v;
  }
  var tot = 0; for(i = 0; i < 25; i++) tot += hs[i]; for(i = 0; i < 25; i++) hs[i] = tot ? hs[i] / tot : 0;
  // highlight / glow
  var thr = Math.max(80, mL + 2 * stdL), spec = 0, glow = 0;
  for(k = 0; k < N * N; k++){ if(!w[k]) continue; var cc = Math.sqrt(A[k] * A[k] + Bc[k] * Bc[k]);
    if(L[k] > thr && cc < 20) spec++; if(L[k] > 60 && cc > 40) glow++; }
  spec /= nW; glow /= nW;
  // gradients (fine, 128) + structure tensor
  var ef = 0, ne = 0, jxx = 0, jyy = 0, jxy = 0;
  for(y = 1; y < N - 1; y++) for(x = 1; x < N - 1; x++){ k = y * N + x; if(!inner[k]) continue;
    var gx = (L[k - N + 1] + 2 * L[k + 1] + L[k + N + 1] - L[k - N - 1] - 2 * L[k - 1] - L[k + N - 1]) / 8;
    var gy = (L[k + N - 1] + 2 * L[k + N] + L[k + N + 1] - L[k - N - 1] - 2 * L[k - N] - L[k - N + 1]) / 8;
    ef += Math.sqrt(gx * gx + gy * gy); jxx += gx * gx; jyy += gy * gy; jxy += gx * gy; ne++; }
  ef = ne ? ef / ne : 0;
  var coh = (jxx + jyy) > 1e-9 ? Math.sqrt((jxx - jyy) * (jxx - jyy) + 4 * jxy * jxy) / (jxx + jyy) : 0;
  // coarse gradients (32x32 blocks)
  var C = 32, S = N / C, Lc = new Float64Array(C * C), Mc = new Uint8Array(C * C);
  for(y = 0; y < C; y++) for(x = 0; x < C; x++){ var s = 0, m = 0; for(dy = 0; dy < S; dy++) for(dx = 0; dx < S; dx++){ k = (y * S + dy) * N + x * S + dx; s += L[k]; m += w[k]; } Lc[y * C + x] = s / (S * S); Mc[y * C + x] = m === S * S ? 1 : 0; }
  var ec = 0, nc = 0;
  for(y = 1; y < C - 1; y++) for(x = 1; x < C - 1; x++){ k = y * C + x; var all = 1; for(dy = -1; dy <= 1; dy++) for(dx = -1; dx <= 1; dx++) if(!Mc[k + dy * C + dx]) all = 0; if(!all) continue;
    gx = (Lc[k - C + 1] + 2 * Lc[k + 1] + Lc[k + C + 1] - Lc[k - C - 1] - 2 * Lc[k - 1] - Lc[k + C - 1]) / 8;
    gy = (Lc[k + C - 1] + 2 * Lc[k + C] + Lc[k + C + 1] - Lc[k - C - 1] - 2 * Lc[k - C] - Lc[k - C + 1]) / 8;
    ec += Math.sqrt(gx * gx + gy * gy); nc++; }
  ec = nc ? ec / nc : 0;
  // uniform LBP on 64x64 (2x2 average), tolerance 1.5 L
  var H2 = 64, L2 = new Float64Array(H2 * H2), M2 = new Uint8Array(H2 * H2);
  for(y = 0; y < H2; y++) for(x = 0; x < H2; x++){ k = 2 * y * N + 2 * x; L2[y * H2 + x] = (L[k] + L[k + 1] + L[k + N] + L[k + N + 1]) / 4; M2[y * H2 + x] = (w[k] & w[k + 1] & w[k + N] & w[k + N + 1]); }
  var lbp = new Float64Array(10), nl = 0, off = [[-1,-1],[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0]];
  for(y = 1; y < H2 - 1; y++) for(x = 1; x < H2 - 1; x++){ k = y * H2 + x; if(!M2[k]) continue;
    var all2 = 1; for(var o = 0; o < 8; o++) if(!M2[k + off[o][1] * H2 + off[o][0]]) all2 = 0; if(!all2) continue;
    var bits = [], ones = 0; for(o = 0; o < 8; o++){ var bt = L2[k + off[o][1] * H2 + off[o][0]] >= L2[k] + 1.5 ? 1 : 0; bits.push(bt); ones += bt; }
    var tr = 0; for(o = 0; o < 8; o++) if(bits[o] !== bits[(o + 1) % 8]) tr++;
    lbp[tr <= 2 ? ones : 9] += 1; nl++; }
  for(i = 0; i < 10; i++) lbp[i] = nl ? lbp[i] / nl : 0;
  // dominant colours: k-means k=4 (deterministic init at L quantiles)
  var pts = []; for(y = 0; y < N; y += 2) for(x = 0; x < N; x += 2){ k = y * N + x; if(w[k]) pts.push([L[k], A[k], Bc[k]]); }
  var dom = [];
  if(pts.length){
    var srt = pts.slice().sort(function(p, q){ return p[0] - q[0]; }), K = 4, cen = [];
    for(i = 0; i < K; i++) cen.push(srt[Math.floor((i + 0.5) / K * (srt.length - 1))].slice());
    var asg = new Int32Array(pts.length);
    for(var it = 0; it < 10; it++){
      var acc = []; for(i = 0; i < K; i++) acc.push([0, 0, 0, 0]);
      for(var pi = 0; pi < pts.length; pi++){ var best = 0, bd = 1e18; for(i = 0; i < K; i++){ var d0 = pts[pi][0] - cen[i][0], d1 = pts[pi][1] - cen[i][1], d2 = pts[pi][2] - cen[i][2], dd = d0 * d0 + d1 * d1 + d2 * d2; if(dd < bd){ bd = dd; best = i; } } asg[pi] = best; var ac = acc[best]; ac[0] += pts[pi][0]; ac[1] += pts[pi][1]; ac[2] += pts[pi][2]; ac[3]++; }
      for(i = 0; i < K; i++) if(acc[i][3]) cen[i] = [acc[i][0] / acc[i][3], acc[i][1] / acc[i][3], acc[i][2] / acc[i][3]];
      if(it === 9) for(i = 0; i < K; i++) cen[i][3] = acc[i][3] / pts.length;
    }
    dom = cen.filter(function(c){ return c[3] > 0; }).sort(function(p, q){ return q[3] - p[3]; }).map(function(c){ return [Math.round(c[0] * 10) / 10, Math.round(c[1] * 10) / 10, Math.round(c[2] * 10) / 10, r3(c[3])]; });
  }
  return {h: Array.prototype.map.call(hs, r3), d: dom, g: Array.prototype.map.call(lbp, r3),
    s: [mL, stdL, sA / nW, sB / nW, sC / nW, ef, ec, coh, spec, glow, p5, p95].map(function(v){ return Math.round(v * 1000) / 1000; }), m: useMask ? 1 : 0};
}
// scalar index names
var SI = {mL:0, sd:1, ma:2, mb:3, C:4, ef:5, ec:6, coh:7, spec:8, glow:9, p5:10, p95:11};
function dE(p, q){ var a = p[0] - q[0], b = p[1] - q[1], c = p[2] - q[2]; return Math.sqrt(a * a + b * b + c * c); }
function domDist(da, db){
  if(!da.length || !db.length) return 50;
  function one(x, y){ var s = 0, ws = 0; x.forEach(function(c){ var m = 1e9; y.forEach(function(e){ m = Math.min(m, dE(c, e)); }); s += c[3] * m; ws += c[3]; }); return ws ? s / ws : 50; }
  return (one(da, db) + one(db, da)) / 2;
}
var WEIGHTS = {color:0.30, dom:0.15, bright:0.07, contrast:0.08, edge:0.15, lbp:0.12, aniso:0.05, spec:0.04, glow:0.04};
// '질감만 비교' (ignore colour): only pattern / gloss / light features
var WEIGHTS_TEX = {color:0, dom:0, bright:0.10, contrast:0.16, edge:0.30, lbp:0.24, aniso:0.10, spec:0.05, glow:0.05};
function similarity(a, b, texOnly){
  var p = {}, i, s = 0, Wt = texOnly ? WEIGHTS_TEX : WEIGHTS;
  var inter = 0; for(i = 0; i < a.h.length; i++) inter += Math.min(a.h[i], b.h[i]); p.color = inter;
  p.dom = Math.exp(-domDist(a.d, b.d) / 22);
  p.bright = Math.exp(-Math.abs(a.s[0] - b.s[0]) / 18);
  p.contrast = Math.exp(-Math.abs(a.s[1] - b.s[1]) / 9);
  function lr(x, y){ return Math.abs(Math.log((x + 0.3) / (y + 0.3))); }
  p.edge = Math.exp(-(lr(a.s[5], b.s[5]) + lr(a.s[6], b.s[6])) * 0.6);
  var l1 = 0; for(i = 0; i < 10; i++) l1 += Math.abs(a.g[i] - b.g[i]); p.lbp = 1 - l1 / 2;
  p.aniso = 1 - Math.abs(a.s[7] - b.s[7]);
  p.spec = Math.exp(-Math.abs(a.s[8] - b.s[8]) / 0.03);
  p.glow = Math.exp(-Math.abs(a.s[9] - b.s[9]) / 0.05);
  for(var k in Wt) s += Wt[k] * p[k];
  return {score: s, parts: p};
}
// Korean colour name from Lab
function colorName(L, a, b){
  var C = Math.sqrt(a * a + b * b), h = (Math.atan2(b, a) * 180 / Math.PI + 360) % 360;
  if(C < 10){ return L > 85 ? phtr("흰색") : L < 22 ? phtr("검정") : L > 60 ? phtr("밝은 회색") : phtr("회색"); }
  var n;
  if(h < 20 || h >= 345) n = phtr("분홍·빨강"); else if(h < 45) n = (L < 55 && C < 45) ? phtr("갈색") : phtr("빨강"); else if(h < 75) n = L < 60 ? phtr("갈색") : phtr("주황"); else if(h < 100) n = L < 55 ? phtr("갈색") : phtr("노랑·베이지");
  else if(h < 140) n = phtr("연두·올리브"); else if(h < 190) n = phtr("초록"); else if(h < 230) n = phtr("청록"); else if(h < 290) n = phtr("파랑"); else if(h < 320) n = phtr("보라"); else n = phtr("분홍");
  if(n === phtr("노랑·베이지") && C < 25) n = phtr("베이지");
  return (L < 30 && n !== phtr("갈색") ? phtr("어두운 ") : "") + n;
}
function texWord(f){ var e = f.s[5] + f.s[6]; return e < 1.2 ? 0 : e < 3.5 ? 1 : 2; }   // 0 매끈 1 약간 2 많음
function explain(a, b, texOnly){   // a = 사진, b = 렌더
  var r = similarity(a, b, texOnly), p = r.parts, good = [], bad = [];
  var ca = a.d[0] ? colorName(a.d[0][0], a.d[0][1], a.d[0][2]) : "", cb = b.d[0] ? colorName(b.d[0][0], b.d[0][1], b.d[0][2]) : "";
  if(p.color > 0.55 || p.dom > 0.6) good.push(phtr("색이 비슷해요") + (cb ? " (" + cb + phtr(" 계열)") : ""));
  else bad.push(ca === cb ? phtr("같은 ") + ca + phtr(" 계열이지만 색의 섞임(분포)이 달라요") : phtr("색이 달라요 (사진: ") + ca + phtr(", 레시피: ") + cb + ")");
  var ta = texWord(a), tb = texWord(b);
  if(p.edge > 0.6){ good.push(ta === 2 ? phtr("얼룩·무늬가 많은 점이 비슷해요") : ta === 0 ? phtr("매끈하고 무늬가 적은 점이 비슷해요") : phtr("무늬의 양이 비슷해요")); }
  else bad.push((a.s[5] + a.s[6]) > (b.s[5] + b.s[6]) ? phtr("사진 쪽 무늬가 더 많고 거칠어요") : phtr("레시피 쪽 무늬가 더 많아요"));
  if(p.lbp > 0.8 && p.edge > 0.5) good.push(phtr("결(작은 무늬의 모양)이 닮았어요"));
  if(a.s[7] > 0.3 && b.s[7] > 0.3) good.push(phtr("한 방향으로 난 결·줄무늬가 있어요"));
  if(a.s[8] > 0.01 && b.s[8] > 0.01) good.push(phtr("반짝이는 하이라이트가 있어요"));
  if(a.s[9] > 0.03 && b.s[9] > 0.03 && a.s[0] < 50) good.push(phtr("어두운 곳에서 진한 색이 빛나요"));
  if(p.bright > 0.7) good.push(phtr("전체 밝기가 비슷해요")); else bad.push(a.s[0] > b.s[0] ? phtr("사진이 더 밝아요") : phtr("사진이 더 어두워요"));
  if(p.contrast < 0.4) bad.push(a.s[1] > b.s[1] ? phtr("사진의 명암 차이가 더 커요") : phtr("레시피의 명암 차이가 더 커요"));
  return {score: r.score, parts: p, good: good, bad: bad.slice(0, 2), photoColor: ca, renderColor: cb};
}
function lab2rgb(L, a, b){
  var fy = (L + 16) / 116, fx = fy + a / 500, fz = fy - b / 200;
  function inv(t){ return t * t * t > 0.008856 ? t * t * t : (t - 16 / 116) / 7.787; }
  var X = inv(fx) * 0.95047, Y = inv(fy), Z = inv(fz) * 1.08883;
  var R = 3.2406 * X - 1.5372 * Y - 0.4986 * Z, G = -0.9689 * X + 1.8758 * Y + 0.0415 * Z, B = 0.0557 * X - 0.2040 * Y + 1.0570 * Z;
  return [R, G, B].map(function(c){ c = Math.max(0, Math.min(1, c)); c = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055; return Math.round(c * 255); });
}
var API = {extract: extract, similarity: similarity, explain: explain, colorName: colorName, lab2rgb: lab2rgb, N: N, WEIGHTS: WEIGHTS, WEIGHTS_TEX: WEIGHTS_TEX, SI: SI};
if(typeof module !== "undefined" && module.exports) module.exports = API; else root.PhotoFeat = API;
})(typeof window !== "undefined" ? window : this);
