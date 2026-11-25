/* Engines tab (bilingual). Images = real Blender 5.3 renders on this box (CPU 8 cores, no GPU). Prices/versions/links checked 2026-11-21 on official pages. */
(function(){
"use strict";
var A = window.SD_API, T = A.T, L = A.L, esc = A.esc, P = "img/engines/";
function B(ko, en){ return {ko: ko, en: en}; }
var E = {
  scene: B("유리 구슬 · 금 구슬 · 피부(SSS) 원숭이 · 네온 링(발광) · 빨간 상자, 위에서 스포트라이트가 옅은 안개를 지나가며 빛줄기를 만드는 같은 장면",
           "The same scene every time: a glass marble, a gold marble, a skin (SSS) monkey, a neon ring (emission) and a red box, with a spotlight from above cutting light shafts through thin fog"),
  shots: [
    {id: "workbench", name: "Workbench", emo: "✏️", sec: 1.2, like: B("연필 스케치 · 설계도", "Pencil sketch · blueprint"),
     setting: B("Studio 조명, 머티리얼 뷰포트 색, 그림자·캐비티 켬", "Studio lighting, material viewport colour, shadows and cavity on"),
     one: B("빛을 계산하지 않고 ‘모양과 색’만 빠르게 보여 줘요. 유리·발광·안개·피부 같은 재질 효과는 전부 무시돼요. 바닥 체크 무늬도 안 나와요(텍스처 노드를 안 읽고 뷰포트 색만 씀).",
            "Shows only shape and colour, fast, without computing light. Glass, emission, fog and skin effects are all ignored. Even the checker floor is missing (it reads only the viewport colour, not texture nodes)."),
     use: B(["모델링하면서 모양 확인", "클레이(점토) 렌더, 와이어 확인", "애니메이션 동작만 빨리 확인"], ["Checking shapes while modelling", "Clay renders and wireframe checks", "Quick animation playblasts"])},
    {id: "eevee", name: "EEVEE", emo: "🎮", sec: 203.1, gpuNote: true, like: B("게임 화면처럼 빠른 근사", "A fast, game-like approximation"),
     setting: B("64 샘플, 레이트레이싱·볼륨(안개) 켬", "64 samples, ray tracing and volumes (fog) on"),
     one: B("게임 엔진처럼 화면에 보이는 정보로 빛을 ‘그럴듯하게 흉내’ 내요. 유리·금속·안개·빛줄기가 다 나오고 Cycles와 꽤 비슷하지만, 피부 속을 지나가는 빛이나 발광체가 주변을 비추는 정도는 덜 정확해요.",
            "Like a game engine, it convincingly imitates light from what is on screen. Glass, metal, fog and light shafts all appear and it looks fairly close to Cycles, but light travelling through skin and glow lighting the surroundings are less accurate."),
     use: B(["빠르게 여러 번 바꿔 보는 룩 개발", "모션그래픽, 툰·스타일 렌더", "GPU가 있으면 애니메이션을 빨리 뽑을 때"], ["Look development with many quick changes", "Motion graphics, toon and stylised renders", "Fast animation output when you have a GPU"])},
    {id: "cycles", name: "Cycles", emo: "📷", sec: 178.3, like: B("빛을 하나하나 추적한 사진", "A photo that traces every ray"),
     setting: B("CPU 512 샘플(적응형) + OpenImageDenoise 노이즈 제거", "CPU 512 samples (adaptive) + OpenImageDenoise"),
     one: B("카메라에서 광선을 쏘아 물체에 튕기고 통과하는 길을 실제로 따라가요(경로 추적). 유리 굴절, 금속 반사, 부드러운 그림자, 피부 속 산란(귀·눈가가 붉게 비침), 네온이 바닥을 비추는 빛까지 가장 사실적이에요. 대신 시간이 들고, 샘플이 적으면 자글자글한 노이즈가 생겨요.",
            "Shoots rays from the camera and actually follows how they bounce off and pass through objects (path tracing). Glass refraction, metal reflection, soft shadows, light scattering in skin (ears glowing red) and neon lighting the floor are the most realistic. It takes time, and too few samples leave grainy noise."),
     use: B(["사실적인 제품·건축·인물 스틸", "유리·물·피부처럼 빛이 복잡한 재질", "이 사전의 레시피 그림(대부분 Cycles)"], ["Realistic product, architecture and portrait stills", "Materials with complex light: glass, water, skin", "The recipe images in this dictionary (mostly Cycles)"])},
    {id: "luxcore", name: "LuxCoreRender", emo: "🔬", addon: true, sec: 512.2, like: B("물리 실험실 같은 사진기", "A physics-lab camera"),
     setting: B("BlendLuxCore 2.11.1, PATH CPU 1500 샘플, Cycles 재질 자동 변환", "BlendLuxCore 2.11.1, PATH CPU 1500 samples, Cycles materials auto-converted"),
     one: B("무료 외부 엔진. Cycles처럼 빛을 추적하는데, 물리 정확도(빛 퍼짐·코스틱스)에 더 집중해요. 이 장면은 Cycles 노드를 자동 변환했어요. 금속·유리·발광은 잘 나오지만 피부(SSS)는 변환이 안 돼 그냥 불투명해 보이고, 반짝이는 흰 점(파이어플라이)이 남았어요.",
            "A free external engine. It traces light like Cycles but focuses more on physical accuracy (light spread, caustics). This scene's Cycles nodes were auto-converted: metal, glass and emission come out well, but skin (SSS) did not convert and looks opaque, and bright white specks (fireflies) remain."),
     fix: B(["안개: Cycles 볼륨 노드를 LuxCore가 못 읽어서 같은 농도의 LuxCore 월드 볼륨(Homogeneous)으로 다시 만듦", "조명: 5.3에서 ‘Cycles 조명 설정 사용’이 포인트·스포트 라이트에서 오류를 내서(BlendLuxCore 버그) 밝기를 LuxCore 방식으로 직접 맞춤"],
            ["Fog: LuxCore cannot read the Cycles volume nodes, so it was rebuilt as a LuxCore world volume (Homogeneous) of the same density", "Lights: in 5.3 'Use Cycles light settings' errors on point and spot lights (a BlendLuxCore bug), so brightness was matched the LuxCore way by hand"]),
     use: B(["코스틱스(유리 밑에 모이는 빛)처럼 물리적으로 까다로운 장면", "무료로 다른 경로 추적 엔진을 써 보고 싶을 때"], ["Physically tricky scenes such as caustics (light gathering under glass)", "Trying another path tracer for free"])},
    {id: "hydra_storm", name: "Hydra Storm", emo: "⚡", addon: true, sec: 21.0, like: B("빠른 미리보기 사진(필터 없는 폰카)", "A quick preview snapshot"),
     setting: B("블렌더 기본 포함 애드온(USD Hydra), 기본 설정", "Add-on bundled with Blender (USD Hydra), default settings"),
     one: B("블렌더 4.0부터 들어 있는 Pixar USD 계열 실시간 엔진이에요. 장면을 USD로 넘겨 그려서 다른 USD 프로그램과 모양을 맞춰 볼 때 써요. 이 장면에서는 너무 밝고, 그림자·피부·발광 빛이 거의 안 나와요. 유리는 뒤가 비쳐 보이지 않고 투명도(알파)만 비워 둬서 어두운 거울 공처럼 나와요.",
            "A real-time engine from Pixar's USD, included since Blender 4.0. It draws the scene through USD, useful for matching the look of other USD tools. Here it comes out too bright, with almost no shadows, skin or glow lighting. Glass does not show what is behind it; it only leaves alpha empty, so it looks like a dark mirror ball."),
     fix: B(["안개 상자가 회색 벽처럼 그려져서 안개만 빼고 렌더함"], ["The fog box rendered as a grey wall, so it was left out"]),
     use: B(["USD 파이프라인(다른 툴과 같은 결과 미리보기)", "일반 사용자는 EEVEE를 쓰는 게 나아요"], ["USD pipelines (preview matching other tools)", "For most users EEVEE is the better choice"])}
  ],
  crops: [["glass", B("유리 굴절", "Glass refraction")], ["metal", B("금속 반사", "Metal reflection")], ["sss", B("피부 속 산란(SSS)", "Subsurface scattering (skin)")], ["neon", B("발광이 바닥을 비춤", "Glow lighting the floor")], ["fog", B("안개 속 빛줄기", "Light shafts in fog")]],
  table: [
    [B("유리 굴절", "Glass refraction"), "✕", "✓", "✓", "✓", "✕"], [B("금속 반사", "Metal reflection"), "△", "✓", "✓", "✓", "△"],
    [B("부드러운 그림자", "Soft shadows"), "△", "✓", "✓", "✓", "✕"], [B("발광이 주변을 비춤", "Glow lights surroundings"), "✕", "△", "✓", "✓", "✕"],
    [B("피부 속 산란(SSS)", "Subsurface scattering"), "✕", "△", "✓", "✕", "✕"], [B("안개·빛줄기(볼륨)", "Fog and light shafts (volume)"), "✕", "✓", "✓", "△", "✕"],
    [B("텍스처(바닥 체크)", "Textures (checker floor)"), "✕", "✓", "✓", "✓", "✓"]],
  tableNote: B("△의 이유 — Workbench 금속: 반사가 아니라 정해진 하이라이트 · Workbench 그림자: 아주 옅음 · EEVEE 발광: 바닥이 아주 약하게만 밝아짐 · EEVEE SSS: 반투명하지만 귀·눈가의 붉은 비침이 약함 · LuxCore 안개: 볼륨을 다시 만들어야 했음 · Storm 금속: 주변(HDRI)만 비치고 물체끼리는 안 비침",
               "Why △ — Workbench metal: a fixed highlight, not a reflection · Workbench shadows: very faint · EEVEE glow: the floor brightens only a little · EEVEE SSS: translucent but weak red glow at ears and eyes · LuxCore fog: the volume had to be rebuilt · Storm metal: reflects only the HDRI, not other objects"),
  timeNote: B("시간은 이 컴퓨터(CPU 8코어, GPU 없음)에서 960×540으로 잰 실제 값이에요. EEVEE는 원래 그래픽카드(GPU)로 도는 엔진인데 여기엔 GPU가 없어 CPU가 GPU를 흉내(llvmpipe) 내며 돌려서 아주 느리게 나왔어요. GPU가 있는 PC라면 EEVEE는 몇 초 안에 끝나고, Cycles도 GPU를 쓰면 훨씬 빨라져요. 보통 순서는 Workbench(순간) < EEVEE(초) < Cycles(수십 초~분)예요.",
              "Times were measured on this computer (8-core CPU, no GPU) at 960×540. EEVEE normally runs on a graphics card; with no GPU here the CPU emulated one (llvmpipe), so it was very slow. On a PC with a GPU, EEVEE finishes this scene in seconds and Cycles gets much faster too. The usual order is Workbench (instant) < EEVEE (seconds) < Cycles (tens of seconds to minutes)."),
  pick: [[B("처음 배우는 중, 모양만 보고 싶다", "Just learning, only want to see shapes"), B("Workbench (뷰포트 Solid 모드와 같음)", "Workbench (same as viewport Solid mode)")],
         [B("빨리 결과를 보며 재질·조명을 만지고 싶다", "Want quick feedback while tweaking materials and lights"), B("EEVEE", "EEVEE")],
         [B("사진처럼 진짜 같은 한 장이 필요하다", "Need one photoreal image"), B("Cycles", "Cycles")],
         [B("툰·만화 느낌", "Toon or comic look"), B("EEVEE (5.x의 EEVEE 전용 라이트 노드로 직접 명암을 만들 수 있음)", "EEVEE (5.x EEVEE-only light nodes let you build the shading yourself)")],
         [B("애니메이션, 시간이 부족", "Animation on a tight schedule"), B("EEVEE, 또는 Cycles + 낮은 샘플 + 노이즈 제거", "EEVEE, or Cycles with low samples + denoising")],
         [B("무료로 다른 엔진을 써 보고 싶다", "Want to try another engine for free"), B("LuxCoreRender (CPU에서도 됨)", "LuxCoreRender (works on CPU too)")]]
};
/* install guides: steps verified against the official pages linked (2026-11-21) */
var BUILTIN = [
  {name: "Cycles · EEVEE · Workbench", steps: B(["블렌더에 기본으로 들어 있어 설치할 것이 없어요.", "Properties › Render 탭 › Render Engine에서 고르면 돼요.", "GPU로 Cycles를 돌리려면 Edit › Preferences › System › Cycles Render Devices에서 CUDA/OptiX(NVIDIA)·HIP(AMD)·oneAPI(Intel)·Metal(Apple) 중 하나를 켜고, Render 탭의 Device를 GPU Compute로 바꿔요."],
                                                ["They ship with Blender — nothing to install.", "Pick one under Properties › Render tab › Render Engine.", "To render Cycles on a GPU, enable CUDA/OptiX (NVIDIA), HIP (AMD), oneAPI (Intel) or Metal (Apple) in Edit › Preferences › System › Cycles Render Devices, then set Device to GPU Compute in the Render tab."]),
   links: [[B("매뉴얼: GPU 렌더링", "Manual: GPU rendering"), "https://docs.blender.org/manual/en/latest/render/cycles/gpu_rendering.html"], [B("매뉴얼: Preferences › System", "Manual: Preferences › System"), "https://docs.blender.org/manual/en/latest/editors/preferences/system.html"]]},
  {name: "Hydra Storm", steps: B(["블렌더에 들어 있는 애드온이라 받을 필요가 없어요.", "Edit › Preferences › Add-ons에서 ‘Hydra Storm’을 검색해 체크해요.", "Render Engine 목록에 Hydra Storm이 생겨요."],
                                 ["It is an add-on bundled with Blender — no download.", "Search for 'Hydra Storm' in Edit › Preferences › Add-ons and tick it.", "Hydra Storm appears in the Render Engine list."]),
   links: [[B("Blender 4.0 릴리스 노트(Hydra Storm)", "Blender 4.0 release notes (Hydra Storm)"), "https://developer.blender.org/docs/release_notes/4.0/add_ons/"], [B("매뉴얼: Add-ons", "Manual: Add-ons"), "https://docs.blender.org/manual/en/latest/editors/preferences/addons.html"]]}
];
var DISK = B("Edit › Preferences › Get Extensions(또는 Add-ons) › 오른쪽 위 ▾ 메뉴 › Install from Disk로 zip을 고르고 체크해요(zip을 블렌더 창에 끌어 놓아도 돼요).",
             "Edit › Preferences › Get Extensions (or Add-ons) › ▾ menu at the top right › Install from Disk, choose the zip and tick it (you can also drag the zip onto the Blender window).");
var OTHERS = [
  {name: "LuxCoreRender (BlendLuxCore)", free: 1, rendered: "luxcore", price: B("무료 (오픈소스, Apache 2.0)", "Free (open source, Apache 2.0)"),
   ver: B("BlendLuxCore 2.11.1 (2026-09-20): 공식 지원 Blender 4.5 LTS · 5.2 LTS. 5.3은 공식 목록에 없지만 여기서 렌더는 됐어요(조명 변환 버그 있음).", "BlendLuxCore 2.11.1 (2026-09-20): officially supports Blender 4.5 LTS and 5.2 LTS. 5.3 is not on the list, but it rendered here (with a light-conversion bug)."),
   status: B("개발 중. CPU·GPU, Linux/Windows/macOS.", "Active. CPU and GPU, Linux/Windows/macOS."),
   steps: B(["GitHub 릴리스에서 BlendLuxCore 확장 zip을 받아요.", "@DISK", "처음 켤 때 LuxCore 엔진(wheel)을 자동으로 내려받으니 인터넷을 연결해 두세요.", "Render Engine에서 LuxCoreRender를 골라요."],
            ["Download the BlendLuxCore extension zip from GitHub releases.", "@DISK", "On first enable it downloads the LuxCore engine (wheel), so stay online.", "Choose LuxCoreRender as the Render Engine."]),
   links: [[B("GitHub 릴리스", "GitHub releases"), "https://github.com/LuxCoreRender/BlendLuxCore/releases"], [B("설치 안내(위키)", "Install guide (wiki)"), "https://wiki.luxcorerender.org/BlendLuxCore_Installation"]]},
  {name: "Malt (NPR)", free: 1, price: B("무료 (오픈소스, MIT)", "Free (open source, MIT)"),
   ver: B("최신 릴리스는 GitHub에서 OS별 BlenderMalt zip으로 배포돼요.", "Latest builds are published on GitHub as a BlenderMalt zip per OS."),
   status: B("만화·일러스트 전용 실시간 엔진. 재질을 Malt 노드로 새로 만들어야 해서 같은 장면 비교 그림은 없어요.", "A real-time engine for comic and illustration looks. Materials must be rebuilt with Malt nodes, so there is no same-scene comparison."),
   steps: B(["GitHub ‘Release-latest’ 페이지에서 내 OS용 BlenderMalt.zip을 받아요.", "@DISK", "BlenderMalt 체크 상자를 켜요(처음엔 몇 초 걸려요).", "Render Engine에서 Malt를 골라요."],
            ["Download the BlenderMalt.zip for your OS from the GitHub 'Release-latest' page.", "@DISK", "Tick the BlenderMalt checkbox (the first time takes a few seconds).", "Choose Malt as the Render Engine."]),
   links: [[B("공식 사이트", "Official site"), "https://malt3d.com/"], [B("GitHub 릴리스", "GitHub releases"), "https://github.com/bnpr/Malt/releases"]]},
  {name: "AMD Radeon ProRender", free: 1, price: B("무료 (오픈소스, Apache 2.0)", "Free (open source, Apache 2.0)"),
   ver: B("v3.7.0 (2026-09-10)은 Blender 5.2용, 이번 배포는 Windows만.", "v3.7.0 (2026-09-10) targets Blender 5.2; this release is Windows only."),
   status: B("유지보수 위주. GPU 필요. 이 컴퓨터(Linux, GPU 없음)에서는 렌더 못 함.", "Mostly maintenance. Needs a GPU. Could not render on this computer (Linux, no GPU)."),
   steps: B(["GitHub 릴리스에서 내 Blender 버전에 맞는 zip을 받아요.", "@DISK", "Render Engine에서 Radeon ProRender를 골라요."], ["Download the zip matching your Blender version from GitHub releases.", "@DISK", "Choose Radeon ProRender as the Render Engine."]),
   links: [[B("AMD 공식 페이지", "AMD official page"), "https://www.amd.com/en/products/graphics/software/radeon-prorender.html"], [B("GitHub 릴리스", "GitHub releases"), "https://github.com/GPUOpen-LibrariesAndSDKs/RadeonProRenderBlenderAddon/releases"]]},
  {name: "OctaneRender for Blender", free: 2, price: B("Prime 무료(GPU 1개, 인터넷 필요) · 유료 Studio+", "Prime free (1 GPU, online) · paid Studio+"),
   ver: B("애드온 2026.6 (Blender 5.2.2용, 2026-10-27 안정판). 5.3용은 아직 없음.", "Add-on 2026.6 (for Blender 5.2.2, stable 2026-10-27). No 5.3 build yet."),
   status: B("NVIDIA(CUDA) GPU 또는 Apple 칩 + OTOY 계정 필요. 여기서는 렌더 못 함.", "Needs an NVIDIA (CUDA) GPU or Apple silicon plus an OTOY account. Could not render here."),
   steps: B(["OTOY 계정으로 로그인해 Octane Blender 애드온과 Octane Server(내 OS용)를 받아요.", "Octane Server 압축을 풀고 먼저 실행해 로그인해요.", "@DISK", "Render Engine에서 Octane을 골라요."],
            ["Sign in with an OTOY account and download the Octane Blender add-on and Octane Server for your OS.", "Unzip Octane Server, run it first and sign in.", "@DISK", "Choose Octane as the Render Engine."]),
   links: [[B("설치 안내(OTOY 도움말)", "Install guide (OTOY help)"), "https://help.otoy.com/hc/en-us/articles/6727419073435-OctaneRender-for-Blender-Installation-Guide"], [B("매뉴얼: 필요한 파일 받기", "Manual: downloading required files"), "https://docs.otoy.com/blender/DownloadingRequiredFiles.html"]]},
  {name: "V-Ray for Blender", free: 2, price: B("Community Edition 무료(90일마다 갱신, 해상도 제한) · 유료 정식판", "Community Edition free (renew every 90 days, resolution limit) · paid full version"),
   ver: B("Blender 5.2 지원(4.5 이상).", "Supports Blender 5.2 (4.5 and later)."), status: B("Windows·macOS. 여기서는 렌더 못 함.", "Windows and macOS. Could not render here."),
   steps: B(["Chaos 계정으로 Community Edition 또는 정식판 설치 파일을 받아 실행해요(Chaos Installer).", "블렌더 Edit › Preferences › Add-ons에서 V-Ray를 검색해(‘Enabled Only’ 끄기) 체크해요.", "필요하면 Chaos 계정으로 로그인해 라이선스를 켜요."],
            ["Download the Community Edition or full installer with a Chaos account and run it (Chaos Installer).", "In Edit › Preferences › Add-ons search for V-Ray (turn off 'Enabled Only') and tick it.", "Sign in with your Chaos account to activate the licence if asked."]),
   links: [[B("설치 안내(Chaos 문서)", "Install guide (Chaos docs)"), "https://documentation.chaos.com/space/VBLD/117638104/Installation"], [B("V-Ray for Blender", "V-Ray for Blender"), "https://www.chaos.com/vray/blender"]]},
  {name: "RenderMan for Blender", free: 2, price: B("비상업용 무료 · 상업용 유료", "Free for non-commercial use · paid commercial licence"),
   ver: B("RfB 27: 공식 지원 목록에 5.x 없음.", "RfB 27: 5.x is not on the official support list."), status: B("Pixar 계정 필요. 여기서는 렌더하지 않음.", "Needs a Pixar account. Not rendered here."),
   steps: B(["renderman.pixar.com에서 비상업용(NCR) 설치 파일을 받아 실행하고 포럼 계정으로 로그인해요.", "목록에서 RenderMan Pro Server와 RenderMan for Blender를 골라 설치해요.", "다운로드 폴더의 RenderManForBlender_27.x.zip을 @DISK2"],
            ["Download the Non-Commercial RenderMan (NCR) installer from renderman.pixar.com, run it and sign in with your forum account.", "Select RenderMan Pro Server and RenderMan for Blender and install.", "Install RenderManForBlender_27.x.zip from your Downloads folder: @DISK2"]),
   links: [[B("설치 안내(RenderMan 위키)", "Install guide (RenderMan wiki)"), "https://rmanwiki-27.pixar.com/space/RFB27/544636971/Installation%20of%20RenderMan%20for%20Blender"], [B("Pixar RenderMan", "Pixar RenderMan"), "https://renderman.pixar.com/"]]},
  {name: "Arnold (BtoA)", free: 3, price: B("애드온은 무료, 워터마크 없이 렌더하려면 Autodesk Arnold 유료 라이선스", "Add-on free; watermark-free rendering needs a paid Autodesk Arnold licence"),
   ver: B("BtoA 0.6.x, Blender 4.0 이상(LTS 기준). Autodesk 공식 플러그인이 아닌 커뮤니티 애드온.", "BtoA 0.6.x, Blender 4.0+ (targets LTS). A community add-on, not an official Autodesk plug-in."), status: B("유료 라이선스가 필요해 렌더하지 않음.", "Not rendered (needs a paid licence)."),
   steps: B(["arnoldforblender.com/download에서 BtoA zip을 받아요.", "@DISK", "애드온 설정을 펼쳐 ‘Install Arnold’를 눌러 Arnold를 설치하고 블렌더를 다시 켜요."],
            ["Download the BtoA zip from arnoldforblender.com/download.", "@DISK", "Expand the add-on preferences, click 'Install Arnold', then restart Blender."]),
   links: [[B("다운로드·설치", "Download & install"), "https://arnoldforblender.com/download"], [B("GitHub", "GitHub"), "https://github.com/lunadigital/btoa"]]},
  {name: "Redshift", free: 3, price: B("구독 유료", "Paid subscription"),
   ver: B("블렌더용 개발 중단(마지막 지원 Blender 4.4) → 5.x에서는 못 써요.", "Blender plug-in discontinued (last supported Blender 4.4) → not usable in 5.x."), status: B("블렌더용 중단.", "Discontinued for Blender."),
   steps: B(["5.x용이 없어서 설치 안내를 생략해요."], ["There is no 5.x version, so no install guide."]),
   links: [[B("Maxon Redshift", "Maxon Redshift"), "https://www.maxon.net/en/redshift"]]}
];
var NOTBL = B("참고: Corona(Chaos)는 3ds Max·Cinema 4D 전용이라 블렌더용이 없어요. Mitsuba 블렌더 애드온은 Blender 5.0부터 깨져 있고, appleseed는 사실상 개발이 멈췄어요.",
              "Note: Corona (Chaos) is only for 3ds Max and Cinema 4D, so there is no Blender version. The Mitsuba Blender add-on has been broken since Blender 5.0, and appleseed development has effectively stopped.");
var S = E.shots;
function secTxt(s){ var en = A.D && window.SDI.lang === "en"; return s < 60 ? s.toFixed(1) + (en ? " s" : "초") : Math.floor(s / 60) + (en ? " min " : "분 ") + Math.round(s % 60) + (en ? " s" : "초"); }
function byId(id){ for(var i = 0; i < S.length; i++) if(S[i].id === id) return S[i]; }
function opts(sel){ return S.map(function(s){ return '<option value="' + s.id + '"' + (s.id === sel ? " selected" : "") + ">" + esc(s.name) + "</option>"; }).join(""); }
function steps(list){ return "<ol>" + list.map(function(x){ x = x.replace("@DISK2", L(DISK)); return "<li>" + esc(x === "@DISK" ? L(DISK) : x) + "</li>"; }).join("") + "</ol>"; }
function links(ls){ return '<p class="links">' + ls.map(function(l){ return '<a href="' + esc(l[1]) + '" target="_blank" rel="noopener">' + esc(L(l[0])) + " ↗</a>"; }).join(" ") + "</p>"; }
var K = {
 ko: {h: "렌더 엔진 — 같은 장면, 다른 “카메라”", p: "렌더 엔진은 3D 장면을 그림으로 바꿔 주는 <b>화가</b>예요. 같은 장면도 어떤 화가에게 맡기느냐에 따라 결과가 달라요.", scene: "장면: ", real: "아래 그림은 모두 <b>Blender 5.3.0</b>에서 이 장면을 실제로 렌더한 결과예요",
      s1: "① 엔진을 눌러 바꿔 보기", star: "* LuxCoreRender, Hydra Storm은 기본 3종이 아닌 추가 엔진(무료)이에요.", s2: "② 밀어서 비교하기", drag: "가운데 막대를 좌우로 끌어 보세요. 왼쪽", right: "· 오른쪽",
      s3: "③ 확대해서 차이 보기", s4: "④ 무엇이 되고 안 되나 (위 렌더를 보고 판단)", eff: "효과", time: "이 컴퓨터 렌더 시간", legend: "✓ 잘 됨 · △ 흉내만/약함 · ✕ 안 됨. ", s5: "⑤ 엔진별 설명과 쓰는 때", setting: "설정: ",
      fixed: "공정 비교를 위해 손본 점", when: "이럴 때:", pickH: "고민될 때 고르는 법", s6: "⑥ 설치 방법", builtin: "블렌더 기본 엔진", s7: "⑦ 블렌더에 쓸 수 있는 다른 엔진 (무료부터) — 설치 방법 포함",
      othersNote: "가격·지원 버전·설치 방법은 2026-11-21에 각 공식 페이지에서 확인했어요. 그림은 이 컴퓨터에서 실제로 렌더한 것만 넣었고, 렌더 못 한 엔진은 이유를 적었어요(제조사 예시 그림은 넣지 않았어요).",
      grp: {1: "무료", 2: "무료판 있음 + 유료", 3: "유료"}, price: "가격", ver: "블렌더 버전", status: "상태", install: "설치", realR: "실제 렌더 (Blender 5.3)", noimg: "그림 없음", left: "왼쪽", rightL: "오른쪽", cmp: "비교 위치", render: "렌더"},
 en: {h: "Render engines — same scene, different “cameras”", p: "A render engine is the <b>painter</b> that turns a 3D scene into an image. The same scene looks different depending on which painter you hire.", scene: "Scene: ", real: "Every image below is a real render of this scene in <b>Blender 5.3.0</b>",
      s1: "① Click an engine to switch", star: "* LuxCoreRender and Hydra Storm are extra (free) engines, not the three built-in ones.", s2: "② Drag to compare", drag: "Drag the bar left and right. Left", right: "· Right",
      s3: "③ Zoom in on the differences", s4: "④ What works and what doesn't (judged from the renders above)", eff: "Effect", time: "Render time on this computer", legend: "✓ works · △ approximated/weak · ✕ doesn't work. ", s5: "⑤ Each engine and when to use it", setting: "Settings: ",
      fixed: "Adjusted for a fair comparison", when: "Use it for:", pickH: "How to choose", s6: "⑥ How to install", builtin: "Built-in engines", s7: "⑦ Other engines for Blender (free first) — with install steps",
      othersNote: "Prices, supported versions and install steps were checked on each official page on 2026-11-21. Only images actually rendered on this computer are shown; for engines we could not render, the reason is given (no vendor sample images).",
      grp: {1: "Free", 2: "Free edition + paid", 3: "Paid"}, price: "Price", ver: "Blender version", status: "Status", install: "Install", realR: "Real render (Blender 5.3)", noimg: "No image", left: "Left", rightL: "Right", cmp: "Compare position", render: "render"}
};
function render($main){
  var k = K[window.SDI.lang] || K.ko, h = '<div class="eng">';
  h += '<div class="sec"><h2>' + esc(k.h) + "</h2><p>" + k.p + '</p><div class="analog">' + S.slice(0, 3).map(function(s){ return '<div class="an"><div class="emo">' + s.emo + "</div><b>" + esc(s.name) + "</b><span>" + esc(L(s.like)) + "</span></div>"; }).join("") + "</div>";
  h += '<p class="hint">' + esc(k.scene) + esc(L(E.scene)) + ". " + k.real + " (960×540).</p></div>";
  h += '<div class="sec"><h3>' + esc(k.s1) + '</h3><div class="chips" id="engpick">' + S.map(function(s){ return '<button class="chip" data-e="' + s.id + '">' + s.emo + " " + esc(s.name) + (s.addon ? " *" : "") + "</button>"; }).join("") + "</div>";
  h += '<figure class="engfig"><img id="engimg" src="' + P + 'cycles.webp" alt="Cycles" width="960" height="540"><figcaption id="engcap"></figcaption></figure><p class="hint">' + esc(k.star) + "</p></div>";
  h += '<div class="sec"><h3>' + esc(k.s2) + "</h3><p>" + esc(k.drag) + ' <select id="wl" aria-label="' + esc(k.left) + '">' + opts("eevee") + "</select> " + esc(k.right) + ' <select id="wr" aria-label="' + esc(k.rightL) + '">' + opts("cycles") + "</select></p>";
  h += '<div class="wipe" id="wipe"><img id="wimgR" src="' + P + 'cycles.webp" alt="' + esc(k.rightL) + '"><div class="wl" id="wclip"><img id="wimgL" src="' + P + 'eevee.webp" alt="' + esc(k.left) + '"></div><div class="wbar" id="wbar"></div><input type="range" id="wr_rng" min="0" max="100" value="50" aria-label="' + esc(k.cmp) + '"></div></div>';
  h += '<div class="sec"><h3>' + esc(k.s3) + '</h3><div class="cropwrap"><table class="crops"><thead><tr><th></th>' + S.map(function(s){ return "<th>" + esc(s.name) + "</th>"; }).join("") + "</tr></thead><tbody>";
  E.crops.forEach(function(c){ h += "<tr><th>" + esc(L(c[1])) + "</th>" + S.map(function(s){ return '<td><img loading="lazy" src="' + P + s.id + "_" + c[0] + '.webp" alt="' + esc(s.name + " — " + L(c[1])) + '"></td>'; }).join("") + "</tr>"; });
  h += "</tbody></table></div></div>";
  h += '<div class="sec"><h3>' + esc(k.s4) + '</h3><div class="cropwrap"><table class="feat"><thead><tr><th>' + esc(k.eff) + "</th>" + S.map(function(s){ return "<th>" + esc(s.name) + "</th>"; }).join("") + "</tr></thead><tbody>";
  E.table.forEach(function(r){ h += "<tr><th>" + esc(L(r[0])) + "</th>" + r.slice(1).map(function(v){ return '<td class="m' + ({"✓": "y", "△": "p", "✕": "n"})[v] + '">' + v + "</td>"; }).join("") + "</tr>"; });
  h += '<tr class="time"><th>' + esc(k.time) + "</th>" + S.map(function(s){ return "<td>" + secTxt(s.sec) + (s.gpuNote ? " ⚠" : "") + "</td>"; }).join("") + "</tr></tbody></table></div>";
  h += '<p class="hint">' + esc(k.legend) + esc(L(E.tableNote)) + '</p><p class="info">⏱ ' + esc(L(E.timeNote)) + "</p></div>";
  h += '<div class="sec"><h3>' + esc(k.s5) + '</h3><div class="ecards">';
  S.forEach(function(s){
    h += '<div class="ecard"><img loading="lazy" src="' + P + s.id + '.webp" alt="' + esc(s.name) + '"><h4>' + s.emo + " " + esc(s.name) + ' <span class="badge">' + esc(L(s.like)) + "</span></h4><p>" + esc(L(s.one)) + '</p><p class="hint">' + esc(k.setting) + esc(L(s.setting)) + " · " + secTxt(s.sec) + "</p>";
    if(s.fix) h += '<p class="hint"><b>' + esc(k.fixed) + '</b></p><ul class="hint">' + L(s.fix).map(function(f){ return "<li>" + esc(f) + "</li>"; }).join("") + "</ul>";
    h += "<p><b>" + esc(k.when) + "</b></p><ul>" + L(s.use).map(function(u){ return "<li>" + esc(u) + "</li>"; }).join("") + "</ul></div>";
  });
  h += "</div><h4>" + esc(k.pickH) + '</h4><table class="pick"><tbody>' + E.pick.map(function(p){ return "<tr><td>" + esc(L(p[0])) + "</td><td>→ <b>" + esc(L(p[1])) + "</b></td></tr>"; }).join("") + "</tbody></table></div>";
  h += '<div class="sec" id="install"><h3>' + esc(k.s6) + " — " + esc(k.builtin) + '</h3><div class="others">' + BUILTIN.map(function(b){ return '<div class="other"><h4>' + esc(b.name) + "</h4>" + steps(L(b.steps)) + links(b.links) + "</div>"; }).join("") + "</div></div>";
  h += '<div class="sec"><h3>' + esc(k.s7) + '</h3><p class="hint">' + esc(k.othersNote) + "</p>";
  [1, 2, 3].forEach(function(g){
    h += '<h4 class="grp">' + esc(k.grp[g]) + '</h4><div class="others">';
    OTHERS.filter(function(o){ return o.free === g; }).forEach(function(o){
      h += '<div class="other">' + (o.rendered ? '<img loading="lazy" src="' + P + o.rendered + '.webp" alt="' + esc(o.name + " " + k.render) + '"><div class="tag ok">' + esc(k.realR) + "</div>" : '<div class="noimg">' + esc(k.noimg) + "<br><small>" + esc(L(o.status)) + "</small></div>");
      h += "<h4>" + esc(o.name) + "</h4><p><b>" + esc(k.price) + "</b> " + esc(L(o.price)) + "</p><p><b>" + esc(k.ver) + "</b> " + esc(L(o.ver)) + "</p><p><b>" + esc(k.status) + "</b> " + esc(L(o.status)) + "</p><p><b>" + esc(k.install) + "</b></p>" + steps(L(o.steps)) + links(o.links) + "</div>";
    });
    h += "</div>";
  });
  h += '<p class="hint">' + esc(L(NOTBL)) + "</p></div></div>";
  $main.innerHTML = h; window.scrollTo(0, 0);
  var img = document.getElementById("engimg"), cap = document.getElementById("engcap");
  function show(id){ var s = byId(id); img.src = P + id + ".webp"; img.alt = s.name + " " + k.render; cap.innerHTML = "<b>" + s.emo + " " + esc(s.name) + "</b> — " + esc(L(s.like)) + " · " + secTxt(s.sec) + " · " + esc(L(s.setting));
    A.each("#engpick .chip", function(b){ b.classList.toggle("on", b.getAttribute("data-e") === id); }); }
  A.each("#engpick .chip", function(b){ b.onclick = function(){ show(b.getAttribute("data-e")); }; });
  show("cycles");
  var rng = document.getElementById("wr_rng"), clip = document.getElementById("wclip"), bar = document.getElementById("wbar");
  function wipe(){ var v = rng.value; clip.style.clipPath = "inset(0 " + (100 - v) + "% 0 0)"; bar.style.left = v + "%"; }
  rng.oninput = wipe; wipe();
  document.getElementById("wl").onchange = function(){ document.getElementById("wimgL").src = P + this.value + ".webp"; };
  document.getElementById("wr").onchange = function(){ document.getElementById("wimgR").src = P + this.value + ".webp"; };
}
A.register("engines", render);
})();
