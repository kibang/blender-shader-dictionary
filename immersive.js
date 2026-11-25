/* Immersive tab (bilingual). Facts come only from the numbered sources at the bottom.
   Anything not in a source is marked with the '추정/재현 방법' (estimate / how to reproduce) badge.
   Images are only this dictionary's own Blender 5.3 renders — no venue photos. */
(function(){
"use strict";
var A = window.SD_API, L = A.L, esc = A.esc;
function B(ko, en){ return {ko: ko, en: en}; }
var SRC = [
  ["d'strict — ARTE MUSEUM JEJU (Art contents)", "https://www.dstrict.com/ART/?bmode=view&idx=8003295"],
  ["ARTE MUSEUM Jeju (official site)", "https://artemuseum.com/jeju/"],
  ["d'strict — Our exhibition (ARTE MUSEUM locations)", "https://www.dstrict.com/EXHIBITION"],
  ["d'strict — Public media art 'WAVE'", "https://www.dstrict.com/ART/?bmode=view&idx=8005064"],
  ["AV Magazine — Giant wave is 'world's largest anamorphic illusion' (2020-05-26)", "https://www.avinteractive.com/news/digital-signage-and-dooh/giant-wave-worlds-largest-anamorphic-illusion-26-05-2020/"],
  [B("빛의 벙커 보도자료 (뉴스와이어)", "Bunker de Lumières press kit (Newswire, in Korean)"), "https://file.newswire.co.kr/modules/download/downloadNewsFiles.php?newsid=1031837&no=10764"],
  [B("BI KOREA — 엡손, '빛의 벙커:클림트'전에 고광량 프로젝터 적용 (2018-11-19)", "BI KOREA — Epson installs high-brightness projectors for 'Bunker de Lumières: Klimt' (2018-11-19, in Korean)"), "http://www.bikorea.net/news/articleView.html?idxno=21850"],
  [B("메트로신문 — '빛의 벙커' 제주 성산에 개관 (2018-11-15)", "Metro Seoul — 'Bunker de Lumières' opens in Seongsan, Jeju (2018-11-15, in Korean)"), "https://www.metroseoul.co.kr/article/2018111500189"],
  ["Le Space — ICE PLANET (official site)", "https://lespace.co.kr/ice-planet/"],
  ["VISITKOREA — Le Space", "https://english.visitkorea.or.kr/svc/contents/contentsView.do?vcontsId=217316"],
  [B("뮤지엄헤이 공식 사이트 — 전시", "Museum Hei official site — Exhibition (in Korean)"), "https://www.museumhei.com/Exhibiton"],
  [B("열린관광 모두의 여행 (한국관광공사) — 뮤지엄헤이", "Accessible Travel for All (Korea Tourism Organization) — Museum Hei (in Korean)"), "https://access.visitkorea.or.kr/ms/detail.do?cotId=2b58b1bd-18c0-446e-a829-e20b11d59cbc"],
  ["teamLab — teamLab: LIFE (DDP, Seoul)", "https://www.teamlab.art/e/ddp/"],
  [B("ZDNet Korea — 한국엡손, '팀랩:라이프 전'에 고광량 프로젝터 설치 (2020-10-23)", "ZDNet Korea — Epson Korea installs high-brightness projectors for 'teamLab: LIFE' (2020-10-23, in Korean)"), "https://zdnet.co.kr/view/?no=20201023092256"]
];
/* facts: [text, [source numbers]] ; est: estimate/how-to-reproduce text ; recipes: dictionary recipes that reproduce the look */
var V = [
 {id: "arte", name: B("아르떼뮤지엄 (d'strict)", "ARTE MUSEUM (d'strict)"),
  facts: [[B("디지털 디자인 회사 d'strict의 몰입형 미디어아트 전시. 2020년 9월 말 제주 애월에 처음 열었어요.", "An immersive media-art exhibition by the digital design company d'strict, first opened in Aewol, Jeju at the end of September 2020."), [1, 2]],
          [B("옛 스피커 공장을 고친 약 4,500㎡, 가장 높은 곳 10m 공간. 주제는 'ETERNAL NATURE'(영원한 자연).", "About 4,500 m² with a maximum height of 10 m, in a renovated former speaker factory. Theme: 'ETERNAL NATURE'."), [1]],
          [B("개관 당시 전시 공간: FLOWER, GARDEN, BEACH, WATERFALL, WORMHOLE, STAR, WAVE, NIGHT SAFARI, MOON, JUNGLE. 공간마다 빛·소리·향을 함께 설계했어요.", "Zones at opening: FLOWER, GARDEN, BEACH, WATERFALL, WORMHOLE, STAR, WAVE, NIGHT SAFARI, MOON, JUNGLE — each designed with light, sound and scent."), [1]],
          [B("이후 여수·강릉(2021), 라스베이거스(2023), 두바이·부산(2024), 뉴욕(2025)에도 열렸어요.", "Later opened in Yeosu and Gangneung (2021), Las Vegas (2023), Dubai and Busan (2024) and New York (2025)."), [3]]],
  est: B("거대한 벽·바닥 투사에 맞춘 미리 렌더한 고해상도 영상일 가능성이 커요. 꽃이 피고 지는 장면은 시간에 따라 크기·색이 바뀌는 절차적 애니메이션, 파도는 물 시뮬레이션이나 움직이는 노이즈로 만든 표면으로 재현할 수 있어요. 아래 레시피는 그 ‘느낌’을 블렌더 셰이더로 다시 만든 것이지, 실제 제작 방법이 아니에요.",
         "Most likely high-resolution pre-rendered video fitted to huge wall and floor projections. Blooming flowers can be reproduced as procedural animation where size and colour change over time; waves as a surface driven by simulation or moving noise. The recipes below recreate the look with Blender shaders — they are not the actual production method."),
  recipes: [221, 220, 227, 193, 113]},
 {id: "wave", name: B("WAVE — 코엑스 K-POP 스퀘어 (d'strict)", "WAVE — COEX K-POP Square (d'strict)"),
  facts: [[B("2020년 4월 공개한 d'strict의 공공 미디어아트. 서울 삼성동 코엑스의 대형 LED 전광판에 상영됐어요.", "d'strict's public media art, released in April 2020 and shown on the giant LED billboard at COEX in Samseong-dong, Seoul."), [4, 5]],
          [B("약 80m × 20m 크기의 화면에서 ‘아나모픽 일루전’(특정 위치에서 보면 입체로 튀어나와 보이는 착시)으로 파도가 유리 상자 안에 갇힌 듯 보여요.", "On a screen of roughly 80 m × 20 m it uses an 'anamorphic illusion' (an image that looks 3D from a particular viewpoint) so the wave seems trapped in a glass box."), [5]],
          [B("아르떼뮤지엄 제주의 WAVE는 이 작품을 더 크게 만든 것이라고 소개됐어요.", "ARTE MUSEUM Jeju's WAVE was introduced as a larger version of this work."), [1]]],
  est: B("아나모픽 영상은 보통 실제 건물 모서리 모양대로 만든 가상 화면과, 관객이 서는 위치에 둔 카메라로 렌더해요. 블렌더에서는 꺾인 두 면(ㄱ자 화면)에 파도 장면을 그 시점 카메라에서 투영해 굽혀 붙이면 같은 원리를 시험할 수 있어요. 바다 표면은 Ocean 모디파이어 + 물 재질, 하얀 거품은 Ocean의 Foam 값을 Map Range로 잘라 섞는 방식으로 재현했어요.",
         "Anamorphic content is usually rendered from a camera placed where the audience stands, onto a virtual screen modelled on the real building corner. In Blender you can test the idea by projecting the wave scene from that viewpoint onto two angled planes (an L-shaped screen). Here the sea uses the Ocean modifier with a water material, and white foam is the Ocean's Foam value cut with Map Range and mixed in."),
  recipes: [220, 113, 225]},
 {id: "bunker", name: B("빛의 벙커 (제주 성산)", "Bunker de Lumières (Seongsan, Jeju)"),
  facts: [[B("옛 국가기간통신시설 벙커를 고친 국내 첫 몰입형 예술 전시관. 2018년 11월 16일 개관, 첫 전시는 클림트.", "Korea's first immersive art venue, in a former national-telecom bunker. Opened 16 November 2018 with Klimt as the first show."), [6, 8]],
          [B("프랑스 컬처스페이스의 AMIEX(Art & Music Immersive Experience) 방식으로, ㈜티모넷이 국내 독점 계약으로 운영해요.", "It uses Culturespaces' AMIEX (Art & Music Immersive Experience) format, run in Korea by TMONET under an exclusive agreement."), [7, 8]],
          [B("가로 100m·세로 50m, 내부 높이 5.5m, 기둥 27개(자료마다 면적은 약 900~1,000평으로 다르게 적혀 있어요).", "100 m × 50 m with 5.5 m interior height and 27 pillars (sources give the area as roughly 900–1,000 pyeong)."), [6, 7]],
          [B("개관 때 엡손 3LCD 프로젝터 EB-L1200U(7,000lm, WUXGA) 약 90대와 초단초점 렌즈 약 40개를 설치했어요.", "At opening, about 90 Epson EB-L1200U 3LCD projectors (7,000 lm, WUXGA) and about 40 ultra-short-throw lenses were installed."), [7]]],
  est: B("명화 이미지를 벽·바닥·기둥 전체에 나눠 비추는 프로젝션 매핑이에요. 프로젝터 여러 대가 겹치는 경계는 밝기가 두 배가 되지 않도록 서서히 어두워지는 ‘엣지 블렌딩’을 써요(일반적인 기술 — 이곳의 실제 설정은 공개 자료에 없음). 블렌더에서는 Spot 라이트에 이미지를 씌운 ‘프로젝터 라이트’ 두 개와 그라데이션 마스크로 원리를 볼 수 있어요.",
         "Projection mapping that splits famous paintings across walls, floor and pillars. Where projectors overlap, 'edge blending' fades each image so the overlap does not get twice as bright (a standard technique — this venue's actual settings are not public). In Blender you can see the principle with two spot-light 'projectors' carrying an image and a gradient mask."),
  recipes: [224, 223]},
 {id: "lespace", name: B("르 스페이스 (인천 영종도, 인스파이어)", "Le Space (Yeongjong, Incheon — Inspire)"),
  facts: [[B("인스파이어 리조트 1층의 인터랙티브 미디어아트 전시. 약 6,600㎡에 18개 구역, 콘셉트 ‘Beyond the Cosmos’.", "An interactive media-art exhibition on the first floor of Inspire Resort: about 6,600 m², 18 zones, concept 'Beyond the Cosmos'."), [9, 10]],
          [B("시즌 2 ‘ICE PLANET’: 빙하·오로라·푸른 용암 같은 우주 풍경, 6면 입체 영상, 입체 음향과 향기.", "Season 2 'ICE PLANET': glaciers, aurora and blue-lava space landscapes, six-sided projection, spatial sound and scent."), [9]],
          [B("동작 인식·음성 감지 같은 인터랙티브 기술을 쓰고, 가상현실(VR)은 쓰지 않아요.", "Uses interactive technology such as motion recognition and voice detection; no virtual reality."), [9]]],
  est: B("관객 움직임에 반응하려면 미리 만든 영상이 아니라 실시간 엔진(게임 엔진이나 실시간 비주얼 툴)으로 그려야 해서, 셰이더는 가볍고 빛나는 재질(발광·블룸) 위주일 가능성이 커요. 블렌더 EEVEE로 비슷한 실시간 느낌을, 오로라·성운·별 레시피로 장면을 재현할 수 있어요.",
         "Reacting to visitors requires a real-time engine (a game engine or real-time visuals tool) rather than pre-made video, so the shaders are likely light and glowing (emission, bloom). EEVEE gives a similar real-time feel in Blender, and the aurora, nebula and star recipes recreate the scenery."),
  recipes: [193, 188, 227, 223, 171]},
 {id: "hei", name: B("뮤지엄헤이 (파주)", "Museum Hei (Paju)"),
  facts: [[B("경기 파주 통일동산 관광특구의 몰입형 예술 전시관(헤이미디어). 이름은 핀란드 인사말 ‘Hei’에서 왔어요.", "An immersive art venue (Hei Media) in the Tongil-dongsan tourist zone, Paju. The name comes from the Finnish greeting 'Hei'."), [12]],
          [B("‘인생의 아름다운 순간들’을 주제로 20여 가지 몰입형 콘텐츠. HEI Contents, HEI Square, HEI Theater(르누아르와 대자연), HEI Park(3D 아나모픽 일루전)로 나뉘어요.", "About 20 immersive pieces on the theme 'beautiful moments in life', in four parts: HEI Contents, HEI Square, HEI Theater (Renoir and nature) and HEI Park (3D anamorphic illusion)."), [11, 12]]],
  est: B("명화를 움직이게 하는 공간은 그림을 층으로 나눠 조금씩 움직이고 빛을 더하는 2.5D 애니메이션, 아나모픽 공간은 관람 위치 카메라로 렌더한 입체 착시 영상일 가능성이 커요. 블렌더에서는 만화경·모아레 같은 절차 패턴과 엣지 블렌딩 레시피로 비슷한 효과를 시험할 수 있어요.",
         "Rooms that animate paintings are likely 2.5D animation (the painting split into layers that move slightly, with added light); the anamorphic room is likely 3D-illusion video rendered from the viewing position. In Blender you can test similar effects with procedural patterns such as kaleidoscope and moiré, and the edge-blending recipe."),
  recipes: [181, 175, 224, 226]},
 {id: "teamlab", name: B("팀랩 스타일 (팀랩: 라이프, DDP 2020)", "teamLab style (teamLab: LIFE, DDP 2020)"),
  facts: [[B("팀랩은 아티스트·프로그래머·엔지니어·CG 애니메이터·수학자 등으로 이뤄진 아트 컬렉티브예요. 2020년 서울 DDP에서 ‘팀랩: 라이프’ 전을 열었어요.", "teamLab is an art collective of artists, programmers, engineers, CG animators, mathematicians and others. It held 'teamLab: LIFE' at DDP, Seoul in 2020."), [13, 14]],
          [B("이 전시에 엡손 고광량 3LCD 프로젝터 약 100대를 설치했어요.", "About 100 high-brightness Epson 3LCD projectors were installed for the show."), [14]],
          [B("물 작품은 수많은 물 입자의 상호작용을 계산하고 입자 움직임에 따라 선을 그리는 방식이라고 설명해요.", "Its water works are described as calculating the interaction of countless water particles and drawing lines according to their movement."), [13]]],
  est: B("이 탭의 ‘팀랩 스타일’은 팀랩 작품이 아니라, 꽃·물·빛 입자가 관객 주변에서 피고 흩어지는 비슷한 분위기를 블렌더로 흉내 내는 방법이에요. 피어나는 꽃(개화 정도를 시간으로), 물빛 바닥(커스틱 무늬), 반짝이는 점광 레시피를 조합해 보세요.",
         "'teamLab style' here does not mean teamLab's work; it is a way to imitate a similar mood in Blender, with flowers, water and light particles blooming and scattering around visitors. Try combining the blooming flowers (bloom amount over time), water-light floor (caustic pattern) and twinkling points recipes."),
  recipes: [221, 222, 227]}
];
var TECH = [
  [B("프로젝션 매핑 · 엣지 블렌딩", "Projection mapping · edge blending"), B("여러 프로젝터 화면을 이어 붙이고 겹치는 띠를 부드럽게 어둡게 해요.", "Joins several projector images and softly darkens the overlap band."), 224],
  [B("돔 · 360 출력", "Dome · 360 output"), B("Cycles 파노라마 카메라(Fisheye·Equirectangular)로 돔·원형 스크린용 영상을 뽑아요.", "Render for domes and circular screens with Cycles panoramic cameras (fisheye, equirectangular)."), 226],
  [B("LED 월 색 관리", "LED wall colour management"), B("View Transform(Standard·AgX·Filmic)에 따라 같은 장면도 LED에서 색이 달라 보여요.", "The same scene looks different on an LED wall depending on the View Transform (Standard, AgX, Filmic)."), 225],
  [B("빛 번짐 (블룸)", "Light bloom"), B("컴포지터 Glare로 밝은 부분 주변에 빛이 번지게 해요. 어두운 전시장에서 빛나는 느낌의 핵심.", "The compositor's Glare spreads light around bright areas — the key to the glowing look in a dark hall."), 223]
];
var K = {
 ko: {h: "이머시브 — 국내 몰입형 전시의 빛을 블렌더로", lead: "국내 몰입형 미디어아트 전시관에서 볼 수 있는 장면을, 이 사전의 레시피로 비슷하게 다시 만들어 봐요. 그림은 모두 이 사전이 블렌더 5.3으로 직접 렌더한 것이고, 전시장 사진은 쓰지 않았어요.",
      legend: "읽는 법:", legFact: "출처 있는 사실 — 끝의 [번호]가 아래 출처예요.", legEst: "추정/재현 방법", legEstT: "공개 자료에 없는 내용. 일반적인 제작 기술로 추정했거나 블렌더로 비슷하게 재현하는 방법이에요. 실제 전시의 제작 방법과 다를 수 있어요.",
      facts: "출처 있는 사실", repro: "블렌더로 재현해 보기", tech: "자주 쓰이는 기술 (추정/재현 방법)", src: "출처 (2026-11-21 확인)", pending: "렌더 대기 중", open: "레시피 열기 →", note: "전시관 이름·작품 이름은 각 운영사의 것이에요. 이 페이지는 학습용 설명이며 운영사와 관계없어요."},
 en: {h: "Immersive — the light of Korean immersive venues, in Blender", lead: "Scenes you can see in Korean immersive media-art venues, recreated with this dictionary's recipes. Every image is this dictionary's own Blender 5.3 render; no venue photos are used.",
      legend: "How to read:", legFact: "Sourced fact — the [number] points to the sources below.", legEst: "Estimate / how to reproduce", legEstT: "Not in public sources. Either inferred from common production techniques or a way to reproduce a similar look in Blender. It may differ from how the venue actually made it.",
      facts: "Sourced facts", repro: "Reproduce it in Blender", tech: "Common techniques (estimate / how to reproduce)", src: "Sources (checked 2026-11-21)", pending: "Render pending", open: "Open recipe →", note: "Venue and artwork names belong to their operators. This page is an educational explanation and is not affiliated with them."}
};
function rec(id){ return A.REC_BY_ID[id]; }
function rname(r){ return (window.SDI.lang === "en" ? r.en : r.ko).name; }
function rcard(id, k){
  var r = rec(id); if(!r) return "";
  var c = A.cover(r);
  return '<a class="imrec" href="#/r/' + id + '"><div class="imthumb">' + (c ? '<img loading="lazy" src="' + c + '" alt="' + esc(rname(r)) + '">' : "<span>" + esc(k.pending) + "</span>") + "</div><b>R" + id + " " + esc(rname(r)) + "</b><small>" + esc(k.open) + "</small></a>";
}
function refs(ns){ return " " + ns.map(function(n){ return '<a class="ref" href="#src' + n + '">[' + n + "]</a>"; }).join(""); }
function render($main){
  var k = K[window.SDI.lang] || K.ko, h = '<div class="imm"><div class="sec"><h2>' + esc(k.h) + "</h2><p>" + esc(k.lead) + "</p>";
  h += '<p class="hint"><b>' + esc(k.legend) + "</b> " + esc(k.legFact) + ' <span class="badge est">' + esc(k.legEst) + "</span> " + esc(k.legEstT) + "</p></div>";
  V.forEach(function(v){
    h += '<div class="sec venue" id="v-' + v.id + '"><h3>' + esc(L(v.name)) + "</h3><h4>" + esc(k.facts) + "</h4><ul>" + v.facts.map(function(f){ return "<li>" + esc(L(f[0])) + refs(f[1]) + "</li>"; }).join("") + "</ul>";
    h += '<div class="estbox"><span class="badge est">' + esc(k.legEst) + "</span><p>" + esc(L(v.est)) + "</p></div>";
    h += "<h4>" + esc(k.repro) + '</h4><div class="imrecs">' + v.recipes.map(function(id){ return rcard(id, k); }).join("") + "</div></div>";
  });
  h += '<div class="sec"><h3>' + esc(k.tech) + '</h3><div class="imrecs tech">' + TECH.map(function(t){ return '<div class="imtech"><span class="badge est">' + esc(k.legEst) + "</span><h4>" + esc(L(t[0])) + "</h4><p>" + esc(L(t[1])) + "</p>" + rcard(t[2], k) + "</div>"; }).join("") + "</div></div>";
  h += '<div class="sec srcs"><h3>' + esc(k.src) + "</h3><ol>" + SRC.map(function(s, i){ return '<li id="src' + (i + 1) + '"><a href="' + esc(s[1]) + '" target="_blank" rel="noopener">' + esc(L(s[0])) + " ↗</a></li>"; }).join("") + '</ol><p class="hint">' + esc(k.note) + "</p></div></div>";
  $main.innerHTML = h; window.scrollTo(0, 0);
}
A.register("immersive", render);
})();
