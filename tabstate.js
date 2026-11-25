/* Per-tab state memory (T-tabstate), Shader Dictionary v2 port. Self-contained: load AFTER app.js / tab modules (after immersive.js).
   v2 differences: hashes are "#/<route>" (+ optional ?lang=xx, ignored), default "#/recipes"; first snapshot waits for the app's first route();
   re-applies saved controls after a language switch (sdlang re-render).
   - Every top tab (#tabs a[data-tab]) and every sub tab (.subtabs a) remembers the last page (hash) you were on inside it;
     clicking a tab you are NOT on brings you back there. Clicking the tab you ARE on goes to its normal start page.
   - Every page (hash) remembers scroll position, open <details>, search boxes / selects / checkboxes with an id,
     and the selected chip in any .chips[id] group. Kept in sessionStorage (survives reload, cleared when the browser tab closes).
   - Scroll is restored on tab/sub-tab return, back-link (.crumbs) clicks, browser back/forward and reload; a normal
     in-page link (card, prev/next) opens the new page at the top as before.
   Works for new tabs/sub tabs automatically: it only reads which tab link the app marked ".on".
   Opt out for an element (and its children): data-nostate. Password/file inputs and ids like ai*, *key*, *token* are never stored. */
(function(){
"use strict";
var SK = "sd.tabstate.v1", MAXP = 300;
var S = (function(){ try { return JSON.parse(sessionStorage.getItem(SK)) || {}; } catch(e){ return {}; } })();
S.last = S.last || {}; S.pages = S.pages || {}; S.order = S.order || [];
var main = document.getElementById("main"); if(!main) return;
if("scrollRestoration" in history) history.scrollRestoration = "manual";
function key(){ var h = location.hash.replace(/^#\/?/, "").replace(/[?&]lang=\w+/g, "").replace(/[?&]$/, ""); return "#/" + (h || "recipes"); }
var cur = key(), restoring = 0, mode = "restore", saveT = 0, snapT = 0;
function persist(){ clearTimeout(saveT); saveT = 0; try { sessionStorage.setItem(SK, JSON.stringify(S)); } catch(e){} }
function persistSoon(){ if(!saveT) saveT = setTimeout(persist, 250); }
function page(k){
  var p = S.pages[k]; if(!p){ p = S.pages[k] = {y: 0}; }
  var i = S.order.indexOf(k); if(i >= 0) S.order.splice(i, 1); S.order.push(k);
  while(S.order.length > MAXP){ delete S.pages[S.order.shift()]; }
  return p;
}
function banned(el){ var id = el.id || "", ty = (el.type || "").toLowerCase(); return ty === "password" || ty === "file" || ty === "hidden" || /^ai|key|token|secret|pass/i.test(id) || el.closest("[data-nostate]"); }
function controls(){ return Array.prototype.filter.call(main.querySelectorAll("input[id], select[id], textarea[id]"), function(el){ return !banned(el); }); }
function chipGroups(){ return Array.prototype.filter.call(main.querySelectorAll(".chips[id]"), function(g){ return !g.closest("[data-nostate]"); }); }
function dets(){ return Array.prototype.filter.call(main.querySelectorAll("details"), function(d){ return !d.classList.contains("nt") && !d.closest("[data-nostate]"); }); }
/* ---------- snapshot of the visible page ---------- */
function snap(){
  clearTimeout(snapT); snapT = 0;
  var p = page(cur), c = {}, old = p.c || {};
  Object.keys(old).forEach(function(k){ c[k] = old[k]; });
  controls().forEach(function(el){ var ty = (el.type || "").toLowerCase(); c[el.id] = (ty === "checkbox" || ty === "radio") ? (el.checked ? 1 : 0) : el.value; });
  chipGroups().forEach(function(g){ var bs = g.querySelectorAll("button"), on = -1; for(var i = 0; i < bs.length; i++) if(bs[i].classList.contains("on")) on = i; if(on >= 0) c["chips:" + g.id] = on; });
  p.c = c; var ds = dets(); if(ds.length) p.d = ds.map(function(d){ return d.open ? 1 : 0; });
  if(!restoring) p.y = Math.round(window.scrollY);
  persistSoon();
}
function snapSoon(){ if(!snapT) snapT = setTimeout(snap, 0); }
/* ---------- which tab / sub tab is this page in (read from the app's own .on marks) ---------- */
function remember(){
  var tab = document.querySelector("#tabs a.on"); if(tab) S.last["tab:" + (tab.getAttribute("data-tab") || tab.getAttribute("href"))] = cur;
  var sub = main.querySelector(".subtabs a.on"); if(sub) S.last["sub:" + sub.getAttribute("href")] = cur;
  persistSoon();
}
/* ---------- restore ---------- */
var firing = 0;
function fire(el, n){ firing++; try { el.dispatchEvent(new Event(n, {bubbles: true})); } finally { firing--; } }
var done = new WeakSet();
function restoreUI(p){
  if(!p) return;
  var c = p.c || {};
  chipGroups().forEach(function(g){ if(done.has(g)) return; done.add(g); var i = c["chips:" + g.id]; if(i == null) return; var b = g.querySelectorAll("button")[i]; if(b && !b.classList.contains("on")) b.click(); });
  controls().forEach(function(el){
    if(done.has(el)) return; done.add(el);
    if(!(el.id in c)) return; var ty = (el.type || "").toLowerCase(), v = c[el.id];
    if(ty === "checkbox" || ty === "radio"){ if(!!el.checked !== !!v){ el.checked = !!v; fire(el, "input"); fire(el, "change"); } }
    else if(el.value !== v){ if(el.tagName === "SELECT" && !Array.prototype.some.call(el.options, function(o){ return o.value === v; })) return; el.value = v; fire(el, "input"); fire(el, "change"); }
  });
  var ds = dets(); if(p.d && ds.length && p.d.length === ds.length && !done.has(ds[0])){ ds.forEach(function(d, i){ done.add(d); d.open = !!p.d[i]; }); }
}
var stopT = 0;
function restoreScroll(y){
  restoring++; var tok = restoring, t0 = Date.now();
  function cancel(){ if(firing) return; if(tok === restoring){ restoring = 0; } off(); }
  function off(){ ["wheel", "touchstart", "keydown", "mousedown", "input", "change"].forEach(function(n){ window.removeEventListener(n, cancel, true); }); }
  ["wheel", "touchstart", "keydown", "mousedown", "input", "change"].forEach(function(n){ window.addEventListener(n, cancel, true); });
  (function step(){
    if(tok !== restoring) return;
    window.scrollTo({top: y, left: 0, behavior: "instant"});
    var ok = Math.abs(window.scrollY - y) < 2, late = Date.now() - t0 > 4000;
    if(ok && Date.now() - t0 > 300 || late){ restoring = 0; off(); var p = S.pages[cur]; if(p){ p.y = Math.round(window.scrollY); persistSoon(); } document.documentElement.setAttribute("data-ts-restored", cur + "@" + Math.round(window.scrollY)); return; }
    setTimeout(step, 50);
  })();
}
var mo = null, moT = 0;
function watch(p){
  if(mo) mo.disconnect(); clearTimeout(moT); if(!p || !window.MutationObserver) return;
  var k = cur;
  /* key() check: a new page's render (inside the app's hashchange handler) must not be matched against the old page's saved values */
  mo = new MutationObserver(function(){ if(k !== cur || key() !== k) return; remember(); restoreUI(p); });
  mo.observe(main, {childList: true, subtree: true});
  moT = setTimeout(function(){ if(mo){ mo.disconnect(); mo = null; } }, 4000);
}
function arrive(how){
  cur = key(); var p = S.pages[cur];
  remember();
  restoreUI(p); watch(p);
  if(how === "restore" && p && p.y > 0) restoreScroll(p.y);
  else { restoring = 0; document.documentElement.setAttribute("data-ts-restored", cur + "@top"); }
  snap();
}
/* ---------- events ---------- */
document.addEventListener("click", function(e){
  if(e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  var a = e.target.closest && e.target.closest('a[href^="#"]'); if(!a) return;
  snap(); persist();
  var href = a.getAttribute("href"), tab = a.closest("#tabs"), sub = a.closest(".subtabs");
  if(tab || sub){
    mode = "restore";
    if(!a.classList.contains("on")){
      var mem = S.last[tab ? "tab:" + (a.getAttribute("data-tab") || href) : "sub:" + href];
      if(mem && mem !== key()){ e.preventDefault(); location.hash = mem; }
    }
  } else mode = a.closest(".crumbs") ? "restore" : "top";
}, true);
window.addEventListener("hashchange", function(){ var how = mode; mode = "restore"; arrive(how); });
window.addEventListener("scroll", function(){ if(restoring || key() !== cur) return; var p = S.pages[cur] || page(cur); p.y = Math.round(window.scrollY); persistSoon(); }, {passive: true});
main.addEventListener("input", snapSoon, true); main.addEventListener("change", snapSoon, true);
main.addEventListener("click", snapSoon); document.addEventListener("toggle", function(e){ if(main.contains(e.target)) snapSoon(); }, true);
window.addEventListener("pagehide", function(){ snap(); persist(); });
document.addEventListener("visibilitychange", function(){ if(document.visibilityState === "hidden"){ snap(); persist(); } });
/* language switch: app re-renders the same page synchronously (and scrolls to top) -> re-apply controls and the scroll we had */
window.addEventListener("sdlang", function(){ var p = S.pages[cur], y = p ? p.y : 0; setTimeout(function(){ remember(); restoreUI(p); watch(p); if(y > 0) restoreScroll(y); }, 0); });
window.SD_TABSTATE = {state: function(){ return S; }, reset: function(){ S = {last: {}, pages: {}, order: []}; persist(); }};
/* app.js routes on DOMContentLoaded (+0 ms) -> arrive after that first render */
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(function(){ arrive("restore"); }, 30); });
else setTimeout(function(){ arrive("restore"); }, 30);
})();
