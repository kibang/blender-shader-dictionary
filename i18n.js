/* UI strings + language handling. Default Korean; ?lang=en|ko overrides and is remembered (localStorage "sd_lang"). */
(function(){
"use strict";
var UI = {
ko: {
  siteTitle: "블렌더 셰이더 사전", siteSub: "Blender 5.3 · 실제 렌더 · 블렌더로 바로 복사",
  docTitle: "블렌더 셰이더 사전 — Blender 5.3 실제 렌더판",
  metaDesc: "블렌더 5.3 셰이더 노드 {nN}개와 재질 레시피 {nR}개를 실제 렌더 그림과 쉬운 설명으로. 슬라이더로 값을 바꿔 보고 그대로 블렌더에 붙여 넣을 수 있어요.",
  tabRecipes: "레시피 {n}", tabNodes: "노드 {n}", tabTextures: "텍스처", tabEngines: "엔진", tabPhoto: "사진으로 찾기", tabImmersive: "이머시브", tabBasics: "기본·애드온",
  search: "검색 (예: 유리, 나무, 금속, HDRI, Noise)", all: "전체", nRecipes: "레시피 {n}개", nNodes: "노드 {n}개", query: "검색어 “{q}”", noHits: "검색 결과가 없어요.",
  variants: "그림 {n}장", both: "둘 다", engine: "엔진", est: "추정/재현", new53: "5.x 신규", removed: "5.0에서 삭제",
  back: "← 목록", prev: "이전", next: "다음", baseVal: "기준값", noImg: "이 단계의 그림은 아직 렌더 중이에요.", whatIf: "값을 바꾸면?",
  copy: "📋 블렌더로 복사", copyTip: "이 단계의 노드 트리를 복사 → 블렌더 애드온 '새 재질로 붙여넣기' 또는 '지금 재질에 섞어 넣기'",
  copied: "복사됨 ✓ — 블렌더 Shader Editor › N 패널 › 셰이더 사전 › [새 재질로 붙여넣기]", copyFail: "자동 복사가 막혔어요. 아래 칸이 선택되면 Ctrl+C를 누르세요.",
  addonHelp: "애드온 설치·사용법", step: "{i}/{n}단계", copying: "복사할 값", samples: "샘플",
  use: "쓰임", settings: "설정 요령", note: "주의", chain: "노드 사슬", caption: "그림 설명", classRef: "수업 자료", nodesUsed: "이 레시피에 쓰인 노드", usedIn: "이 노드를 쓰는 레시피",
  analogy: "비유", desc: "한 줄 설명", diagTitle: "① 노드 연결도", diagHint: "왼쪽 노드의 출력 소켓(오른쪽 점)을 오른쪽 노드의 입력 소켓(왼쪽 점)에 이어요. 노란 테두리 = 지금 슬라이더로 바꾸는 노드. 노드를 누르면 노드 사전으로 가요.",
  previewHint: " 마지막 Emission → Material Output은 Node Wrangler 미리보기(Ctrl+Shift+클릭)처럼 값을 그대로 보여 주는 연결이에요.",
  groupInside: "그룹 “{g}” 안쪽 (Tab으로 들어가서 보는 모습)", connOrder: "연결 순서 (이 순서대로 선을 이으세요)", valsTitle: "② 입력할 값", valsSub: "이 그림과 똑같이 만들려면",
  valsHint: "적혀 있지 않은 값은 기본값 그대로예요. 색은 색 선택 창의 Hex 칸에 그대로 입력하면 돼요.", allDefault: "모든 값이 기본값 그대로예요. 노드만 연결하면 돼요.",
  moreVals: "+ 값 {n}개 더 (아래 ‘입력할 값’)", toNode: " — 누르면 노드 사전으로", top: "(위)", bottom: "(아래)", curvePts: "커브 {c} 점", curveAll: "C(전체)", rampStops: "ColorRamp 스톱",
  on: "켬", off: "끔", removedNote: "이 노드는 블렌더 5.0에서 없어져 그림 없이 안내만 남겼어요.", estNote: "이 항목은 공식 발표가 아니라 공개 자료를 바탕으로 한 추정/재현 방법이에요. 출처는 이머시브 탭 아래에 있어요.",
  rendering: "렌더 진행 {d}/{t}", glossary: "용어 풀이", steps: "기본 사용법", lang: "English", langLabel: "언어", footer: "모든 그림은 Blender 5.3으로 실제 노드를 연결해 렌더한 결과예요(Cycles CPU, EEVEE 전용 노드는 EEVEE). 텍스처·HDRI: Poly Haven·ambientCG 등 CC0. 출처는 각 탭 아래에.",
  fade: "부드럽게 바뀌기", seriesPick: "바꿔 볼 값", openBig: "크게 보기", close: "닫기"
},
en: {
  siteTitle: "Blender Shader Dictionary", siteSub: "Blender 5.3 · real renders · copy straight into Blender",
  docTitle: "Blender Shader Dictionary — real Blender 5.3 renders",
  metaDesc: "{nN} Blender 5.3 shader nodes and {nR} material recipes with real renders and plain explanations. Drag a slider to change values and paste the exact setup into Blender.",
  tabRecipes: "Recipes {n}", tabNodes: "Nodes {n}", tabTextures: "Textures", tabEngines: "Engines", tabPhoto: "Find by photo", tabImmersive: "Immersive", tabBasics: "Basics & add-on",
  search: "Search (e.g. glass, wood, metal, HDRI, Noise)", all: "All", nRecipes: "{n} recipes", nNodes: "{n} nodes", query: "search “{q}”", noHits: "No results.",
  variants: "{n} images", both: "Both", engine: "Engine", est: "Estimate", new53: "New in 5.x", removed: "Removed in 5.0",
  back: "← List", prev: "Previous", next: "Next", baseVal: "base value", noImg: "This step is still being rendered.", whatIf: "What changes?",
  copy: "📋 Copy to Blender", copyTip: "Copy this step's node tree → Blender add-on 'Paste as new material' or 'Mix into current material'",
  copied: "Copied ✓ — Blender Shader Editor › N panel › Shader Dictionary › [Paste as new material]", copyFail: "Automatic copy was blocked. When the box below is selected, press Ctrl+C.",
  addonHelp: "Add-on install & use", step: "step {i}/{n}", copying: "Value copied", samples: "samples",
  use: "Use", settings: "Settings", note: "Note", chain: "Node chain", caption: "About the image", classRef: "Class notes", nodesUsed: "Nodes in this recipe", usedIn: "Recipes using this node",
  analogy: "Analogy", desc: "In one line", diagTitle: "① Node diagram", diagHint: "Connect an output socket (right dot) of a left node to an input socket (left dot) of a right node. Yellow outline = the node the slider changes. Click a node to open it in the dictionary.",
  previewHint: " The final Emission → Material Output simply displays the value, like a Node Wrangler preview (Ctrl+Shift+click).",
  groupInside: "Inside group “{g}” (what you see after pressing Tab)", connOrder: "Connection order (link in this order)", valsTitle: "② Values to enter", valsSub: "to match this image exactly",
  valsHint: "Anything not listed stays at its default. Colours can be typed straight into the Hex field of the colour picker.", allDefault: "Every value is at its default — just connect the nodes.",
  moreVals: "+ {n} more values (see 'Values to enter')", toNode: " — click to open in the dictionary", top: "(top)", bottom: "(bottom)", curvePts: "Curve {c} points", curveAll: "C (combined)", rampStops: "ColorRamp stops",
  on: "On", off: "Off", removedNote: "This node was removed in Blender 5.0, so only a note remains (no render).", estNote: "This entry is an estimate / reproduction method based on public sources, not an official statement. Sources are listed at the bottom of the Immersive tab.",
  rendering: "rendered {d}/{t}", glossary: "Glossary", steps: "Basics", lang: "한국어", langLabel: "Language", footer: "Every image is a real Blender 5.3 render of the connected nodes (Cycles CPU; EEVEE-only nodes in EEVEE). Textures and HDRIs: CC0 from Poly Haven, ambientCG and others. Credits at the bottom of each tab.",
  fade: "Smooth fade", seriesPick: "Value to change", openBig: "View large", close: "Close"
}};
function qsLang(){ var m = /[?&]lang=(ko|en)\b/.exec(location.search) || /[?&#]lang=(ko|en)\b/.exec(location.hash); return m ? m[1] : null; }
var stored = null; try { stored = localStorage.getItem("sd_lang"); } catch(e){}
var LANG = qsLang() || (stored === "en" || stored === "ko" ? stored : "ko");
try { if(qsLang()) localStorage.setItem("sd_lang", LANG); } catch(e){}
function T(k, vars){
  var s = (UI[LANG] && UI[LANG][k]); if(s == null) s = UI.ko[k]; if(s == null) s = k;
  if(vars) s = s.replace(/\{(\w+)\}/g, function(m, n){ return vars[n] != null ? vars[n] : m; });
  return s;
}
function L(o, f){                    /* pick language from {ko:..,en:..} or obj[f] / obj[f+"_en"] */
  if(o == null) return "";
  if(f == null) return typeof o === "object" && !Array.isArray(o) ? (o[LANG] != null ? o[LANG] : o.ko) : o;
  if(o[LANG] && typeof o[LANG] === "object" && o[LANG][f] != null) return o[LANG][f];
  if(LANG === "en" && o[f + "_en"] != null) return o[f + "_en"];
  return o[f];
}
function setLang(l){
  LANG = l; try { localStorage.setItem("sd_lang", l); } catch(e){}
  var u = new URL(location.href); u.searchParams.set("lang", l); history.replaceState(null, "", u.pathname + u.search + u.hash);
  document.documentElement.lang = l;
  window.dispatchEvent(new Event("sdlang"));
}
window.SDI = { UI: UI, T: T, L: L, setLang: setLang, get lang(){ return LANG; } };
document.documentElement.lang = LANG;
})();
