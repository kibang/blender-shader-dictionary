/* 'Basics & add-on' → add-on v1.2 guide (bilingual). Downloads are copied to site/addon/ by build_app2.py. */
(function(){
"use strict";
function lang(){ return (window.SDI && window.SDI.lang) || "ko"; }
function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]; }); }
var A = window.SD_ADDON_INFO || {lite: "shader_dict_paste-1.2.1-lite.zip", liteKB: 12, packs: [], shots: []};
var K = {
 ko: {
  h: "블렌더로 복사 → 애드온으로 붙여넣기 (애드온 v1.2)",
  lead: "레시피·노드·텍스처 화면의 <b>📋 블렌더로 복사</b> 버튼은 그 단계의 노드 트리(노드 종류, 바꾼 값, ColorRamp 스톱, 커브, 연결)를 글자(JSON)로 복사해요. 블렌더에 <b>쉐이더 사전 붙여넣기</b> 애드온을 한 번 설치해 두면 버튼 하나로 똑같은 노드가 만들어져요. <b>블렌더 4.2 ~ 5.3</b>에서 써요(4.5·5.3에서 시험).",
  dl: "⬇ 애드온 받기", dlNote: "코드만 든 가벼운 zip", packs: "⬇ 텍스처 묶음 (선택)",
  packNote: "이미지 텍스처를 쓰는 레시피·텍스처 세트용 CC0 이미지 533개예요. 받은 zip을 <b>다운로드·바탕 화면·문서</b> 폴더에 그대로 풀면 애드온이 알아서 찾아요. 다른 곳에 풀었다면 애드온 설정의 <b>텍스처 폴더</b>에 지정하세요.",
  inst: "설치 (처음 한 번만)",
  i1: "블렌더에서 <kbd>Edit</kbd> › <kbd>Preferences…</kbd> › 왼쪽 <b>Get Extensions</b>(또는 <b>Add-ons</b>)를 눌러요.",
  i2: "오른쪽 위 <b>▾</b> 메뉴 › <b>Install from Disk…</b> › 받은 zip을 골라요. 압축을 풀 필요 없어요.",
  i3: "<b>Shader Dictionary Paste (쉐이더 사전 붙여넣기)</b>가 켜졌는지 확인해요. 같은 자리에서 <b>언어</b>(자동·한국어·English)를 고를 수 있어요. 자동은 블렌더 인터페이스 언어를 따라가요.",
  use: "사용 (매번)",
  u1: "이 사이트에서 원하는 단계를 고르고 <b>📋 블렌더로 복사</b>를 눌러요. “복사됨 ✓”이 보이면 성공.",
  u2: "블렌더에서 재질을 넣을 오브젝트를 클릭해 선택해요. (월드 레시피는 선택 필요 없음, 조명 노드는 라이트를 선택)",
  u3: "<b>Shading</b> 작업 공간의 Shader Editor 위에서 <kbd>N</kbd> 키 › 오른쪽 사이드바의 <b>쉐이더 사전</b> 탭을 열어요.",
  btns: "버튼 두 개",
  bNew: "새 재질로 붙여넣기", bNewD: "복사한 노드로 <b>새 재질</b>을 만들어 선택한 오브젝트에 바로 넣어요. 원래 재질은 지워지지 않고 목록에 남아요. 처음 따라 할 때는 이 버튼.",
  bAdd: "지금 재질에 섞어 넣기", bAddD: "지금 오브젝트의 재질 안에 복사한 노드를 <b>프레임으로 묶어 아래쪽에 추가</b>해요. 원래 노드는 그대로이고, 붙여넣은 출력 노드는 꺼 두니 원하는 소켓끼리 직접 연결해 섞으세요.",
  tip: "버튼 위에 마우스를 올리면 같은 설명이 툴팁으로 나와요.",
  notes: "알아 두면 좋은 점",
  n1: "이미지 파일을 못 찾으면 <b>임시 격자 이미지</b>를 넣고 알려 줘요. Image Texture 노드의 <b>Open</b>으로 바꾸면 돼요.",
  n2: "이 사이트의 값은 블렌더 5.3 기준이에요. 4.x에서 붙여 넣으면 5.x에서 바뀐 기본값(예: Mix Factor, Subsurface Scale)을 자동으로 맞춰 줘요. 5.x에만 있는 노드(Raycast 등)는 건너뛰고 알려 줘요.",
  n3: "렌더 설정(엔진, 컴포지터 후처리, 조명·카메라)은 복사되지 않아요. 레시피의 <b>추천 설정</b>을 따라 해 주세요.",
  n4: "복사 버튼이 막히는 브라우저에서는 글자 칸이 나타나요. 그 칸에서 <kbd>Ctrl</kbd>+<kbd>C</kbd> 하면 똑같이 쓸 수 있어요.",
  n5: "오류·안내는 화면 아래 상태 줄과 Info 창에 떠요(한국어/영어).",
  mb: "MB", kb: "KB"
 },
 en: {
  h: "Copy to Blender → paste with the add-on (add-on v1.2)",
  lead: "The <b>📋 Copy to Blender</b> button on recipe, node and texture pages copies that step's node tree (node types, changed values, ColorRamp stops, curves, links) as text (JSON). Install the <b>Shader Dictionary Paste</b> add-on once and one click rebuilds the same nodes. Works in <b>Blender 4.2 – 5.3</b> (tested in 4.5 and 5.3).",
  dl: "⬇ Download the add-on", dlNote: "small code-only zip", packs: "⬇ Texture packs (optional)",
  packNote: "533 CC0 images for recipes and texture sets that use image textures. Unzip them as they are into your <b>Downloads, Desktop or Documents</b> folder and the add-on finds them automatically. If you unzip elsewhere, set the <b>Texture folder</b> in the add-on preferences.",
  inst: "Install (once)",
  i1: "In Blender open <kbd>Edit</kbd> › <kbd>Preferences…</kbd> › <b>Get Extensions</b> (or <b>Add-ons</b>) on the left.",
  i2: "Top-right <b>▾</b> menu › <b>Install from Disk…</b> › pick the downloaded zip. No need to unzip it.",
  i3: "Check that <b>Shader Dictionary Paste</b> is enabled. In the same place you can choose the <b>Language</b> (Auto, Korean, English). Auto follows Blender's interface language.",
  use: "Use (every time)",
  u1: "Pick a step on this site and press <b>📋 Copy to Blender</b>. “Copied ✓” means it worked.",
  u2: "In Blender, click the object that should get the material. (World recipes need no selection; light nodes need a light selected.)",
  u3: "In the <b>Shading</b> workspace, hover the Shader Editor, press <kbd>N</kbd> and open the <b>Shader Dict</b> tab in the right sidebar.",
  btns: "The two buttons",
  bNew: "Paste as New Material", bNewD: "Creates a <b>new material</b> from the copied nodes and puts it on the selected object. The old material is not deleted. Use this when following a recipe for the first time.",
  bAdd: "Mix into Current Material", bAddD: "Adds the copied nodes <b>inside the object's current material, grouped in a frame below</b> the existing nodes. Your nodes stay as they are and the pasted output node is inactive, so wire the sockets you want to mix.",
  tip: "Hover a button to see the same explanation as a tooltip.",
  notes: "Good to know",
  n1: "If an image file is not found, a <b>temporary grid image</b> is used and you are told. Replace it with <b>Open</b> on the Image Texture node.",
  n2: "Values on this site are from Blender 5.3. Pasting into 4.x automatically restores defaults that changed in 5.x (e.g. Mix Factor, Subsurface Scale). Nodes that only exist in 5.x (Raycast etc.) are skipped with a warning.",
  n3: "Render settings (engine, compositor effects, lights and camera) are not copied. Follow the recipe's <b>recommended settings</b>.",
  n4: "In browsers that block the copy button a text box appears. Press <kbd>Ctrl</kbd>+<kbd>C</kbd> in it and paste the same way.",
  n5: "Errors and notes appear in the status bar and the Info editor (Korean/English).",
  mb: "MB", kb: "KB"
 }
};
function figs(a, b){
  var l = lang();
  return (A.shots || []).slice(a, b).map(function(f){
    return '<figure><img src="addon/guide/' + esc(f[l === "en" ? 1 : 0]) + '" alt="' + esc(f[l === "en" ? 3 : 2]) + '" loading="lazy"><figcaption>' + esc(f[l === "en" ? 3 : 2]) + "</figcaption></figure>";
  }).join("");
}
window.SD_ADDON = function(){
  var k = K[lang()] || K.ko, h = '<div class="addon"><h2>' + k.h + "</h2><p>" + k.lead + "</p>";
  h += '<p><a class="dl" href="addon/' + esc(A.lite) + '" download>' + k.dl + " (" + esc(A.lite) + ", " + A.liteKB + " " + k.kb + ")</a> <span class=\"muted\">" + k.dlNote + "</span></p>";
  if(A.packs && A.packs.length){
    h += "<p><b>" + k.packs + "</b><br>" + A.packs.map(function(p){ return '<a class="dl" href="addon/' + esc(p[0]) + '" download>' + esc(p[0]) + " (" + p[1] + " " + k.mb + ")</a>"; }).join(" ") + "</p><p class=\"muted\">" + k.packNote + "</p>";
  }
  h += "<h3>" + k.inst + "</h3><ol><li>" + k.i1 + "</li><li>" + k.i2 + "</li><li>" + k.i3 + "</li></ol>" + figs(0, 1);
  h += "<h3>" + k.use + "</h3><ol><li>" + k.u1 + "</li><li>" + k.u2 + "</li><li>" + k.u3 + "</li></ol>" + figs(1, 2);
  h += "<h3>" + k.btns + '</h3><dl class="gloss"><dt>📋 ' + k.bNew + "</dt><dd>" + k.bNewD + "</dd><dt>➕ " + k.bAdd + "</dt><dd>" + k.bAddD + "</dd></dl><p class=\"muted\">" + k.tip + "</p>" + figs(2, 9);
  h += "<h3>" + k.notes + "</h3><ul><li>" + k.n1 + "</li><li>" + k.n2 + "</li><li>" + k.n3 + "</li><li>" + k.n4 + "</li><li>" + k.n5 + "</li></ul></div>";
  return h;
};
})();
