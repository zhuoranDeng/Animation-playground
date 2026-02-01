/**
 * Seed examples: Avatar Group, Cursor, Text effects, Background effects.
 */

export const AVATAR_GROUP_SEED = {
  title: 'Avatar Group',
  category: 'CSS',
  description: 'An animated avatar group that displays overlapping user images and smoothly shifts each avatar forward on hover to highlight it. Based on Animate UI AvatarGroup.',
  sourceUrl: 'https://animate-ui.com/docs/components/animate/avatar-group',
  previewType: 'code',
  codeHtml: `
<div class="avatar-group" role="list">
  <div class="avatar" style="--i: 1">
    <span class="tooltip">Skyleen</span>
    <div class="avatar-inner"><img src="https://pbs.twimg.com/profile_images/1948770261848756224/oPwqXMD6_400x400.jpg" alt=""></div>
  </div>
  <div class="avatar" style="--i: 2">
    <span class="tooltip">Shadcn</span>
    <div class="avatar-inner"><img src="https://pbs.twimg.com/profile_images/1593304942210478080/TUYae5z7_400x400.jpg" alt=""></div>
  </div>
  <div class="avatar" style="--i: 3">
    <span class="tooltip">Adam Wathan</span>
    <div class="avatar-inner"><img src="https://pbs.twimg.com/profile_images/1677042510839857154/Kq4tpySA_400x400.jpg" alt=""></div>
  </div>
  <div class="avatar" style="--i: 4">
    <span class="tooltip">Guillermo Rauch</span>
    <div class="avatar-inner"><img src="https://pbs.twimg.com/profile_images/1783856060249595904/8TfcCN0r_400x400.jpg" alt=""></div>
  </div>
  <div class="avatar" style="--i: 5">
    <span class="tooltip">Jhey</span>
    <div class="avatar-inner"><img src="https://pbs.twimg.com/profile_images/1534700564810018816/anAuSfkp_400x400.jpg" alt=""></div>
  </div>
  <div class="avatar" style="--i: 6">
    <span class="tooltip">David Haz</span>
    <div class="avatar-inner"><img src="https://pbs.twimg.com/profile_images/1927474594102784000/Al0g-I6o_400x400.jpg" alt=""></div>
  </div>
</div>
  `.trim(),
  codeCss: `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #fafbfa; }

.avatar-group {
  display: flex;
  align-items: center;
  padding: 8px 4px;
  gap: 0;
}

.avatar {
  width: 48px;
  height: 48px;
  margin-left: -12px;
  position: relative;
  flex-shrink: 0;
  z-index: var(--i, 1);
  transition: transform 0.25s ease;
  cursor: default;
}

.avatar:first-child { margin-left: 0; }

.avatar:hover {
  transform: translateY(-6px) scale(1.12);
}

.avatar-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid #fff;
  overflow: hidden;
  background: linear-gradient(135deg, #64748b 0%, #475569 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.avatar .tooltip {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 8px);
  transform: translateX(-50%);
  white-space: nowrap;
  padding: 6px 12px;
  background: #fff;
  color: #18181b;
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
  font-weight: 500;
  border-radius: 8px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.15s ease, visibility 0.15s ease;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.avatar .tooltip::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -4px;
  border: 4px solid transparent;
  border-top-color: #fff;
}

.avatar:hover .tooltip {
  opacity: 1;
  visibility: visible;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.avatar .fallback {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  pointer-events: none;
  user-select: none;
}

.avatar img.loaded + .fallback { display: none; }
.avatar img.failed { display: none; }
  `.trim(),
  codeJs: `
document.querySelectorAll('.avatar img').forEach(function(img) {
  img.onload = function() { img.classList.add('loaded'); };
  img.onerror = function() { img.classList.add('failed'); };
});
  `.trim(),
}

export const CURSOR_SEED = {
  title: 'Cursor',
  category: 'React/Framer',
  description: 'A cursor-follow component that displays a label (e.g. "Designer") near the pointer as you move over a region. Based on Animate UI Cursor / CursorFollow.',
  sourceUrl: 'https://animate-ui.com/docs/components/animate/cursor',
  previewType: 'code',
  codeHtml: `
<div class="cursor-demo-box" id="cursor-demo">
  <span class="cursor-follow" id="cursor-follow" aria-hidden="true">Designer</span>
</div>
  `.trim(),
  codeCss: `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
* { box-sizing: border-box; }
body { margin: 0; min-height: 100%; display: flex; align-items: center; justify-content: center; background: #fafbfa; }

.cursor-demo-box {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.cursor-follow {
  position: fixed;
  padding: 6px 12px;
  background: #fff;
  color: #18181b;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  font-weight: 500;
  border-radius: 8px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transform: none;
  transition: opacity 0.15s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
  `.trim(),
  codeJs: `
(function() {
  var box = document.getElementById('cursor-demo');
  var follow = document.getElementById('cursor-follow');
  if (!box || !follow) return;

  var targetX = 0, targetY = 0;
  var currentX = 0, currentY = 0;
  var visible = false;
  var rafId = null;
  var ease = 0.2;

  function tick() {
    currentX += (targetX - currentX) * ease;
    currentY += (targetY - currentY) * ease;
    follow.style.left = currentX + 'px';
    follow.style.top = currentY + 'px';
    rafId = requestAnimationFrame(tick);
  }

  function moveFollow(e) {
    var rect = box.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
      follow.style.opacity = '0';
      visible = false;
      return;
    }
    targetX = e.clientX + 24;
    targetY = e.clientY + 28;
    if (!visible) {
      visible = true;
      currentX = targetX;
      currentY = targetY;
      follow.style.left = currentX + 'px';
      follow.style.top = currentY + 'px';
      follow.style.opacity = '1';
    }
    if (rafId === null) rafId = requestAnimationFrame(tick);
  }

  function stopTick() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  box.addEventListener('mousemove', moveFollow);
  box.addEventListener('mouseleave', function() {
    follow.style.opacity = '0';
    visible = false;
    stopTick();
  });
})();
  `.trim(),
}

export const TEXT_EFFECT_SEEDS = [
  { title: 'Gradient text', category: 'Text effect', previewType: 'code', codeHtml: '<div class="te-box"><span class="te-gradient">Text</span></div>', codeCss: `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0f0f12; }
.te-box { padding: 1rem; cursor: default; }
.te-gradient {
  font-family: 'Poppins', sans-serif; font-size: 2rem; font-weight: 600;
  background: linear-gradient(90deg, #a78bfa, #ec4899, #f59e0b);
  background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}
.te-box:hover .te-gradient { animation: te-shift 3s linear infinite; }
@keyframes te-shift { to { background-position: 200% center; } }
  `.trim(), codeJs: '' },
  { title: 'Typewriter', category: 'Text effect', previewType: 'code', codeHtml: '<div class="te-box"><span class="te-typewriter" id="tw"></span><span class="te-cursor">|</span></div>', codeCss: `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #1a1a2e; }
.te-box { font-size: 2rem; font-family: 'Poppins', sans-serif; cursor: default; }
.te-typewriter { color: #293fc9; font-weight: 600; }
.te-cursor { color: #293fc9; }
.te-box:hover .te-cursor { animation: te-blink 0.8s step-end infinite; }
@keyframes te-blink { 50% { opacity: 0; } }
  `.trim(), codeJs: `
var el = document.getElementById('tw');
var box = document.querySelector('.te-box');
var s = "Text";
var i = 0;
var t = null;
function type() {
  if (i < s.length) { el.textContent += s[i++]; t = setTimeout(type, 100); }
  else { t = setTimeout(function(){ el.textContent = ''; i = 0; type(); }, 2000); }
}
function start() { if (t) return; i = 0; el.textContent = ''; type(); }
function stop() { if (t) clearTimeout(t); t = null; el.textContent = ''; i = 0; }
box.addEventListener('mouseenter', start);
box.addEventListener('mouseleave', stop);
  `.trim() },
  { title: 'Fade in', category: 'Text effect', previewType: 'code', codeHtml: '<div class="te-box"><span class="te-fade">Text</span></div>', codeCss: `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f8fafc; }
.te-box { padding: 1rem; cursor: default; }
.te-fade { font-family: 'Poppins', sans-serif; font-size: 2rem; font-weight: 600; color: #293fc9; }
.te-box:hover .te-fade { animation: te-fade 2s ease-in-out infinite; }
@keyframes te-fade { 0%,100% { opacity: 0; } 50% { opacity: 1; } }
  `.trim(), codeJs: '' },
  { title: 'Glow', category: 'Text effect', previewType: 'code', codeHtml: '<div class="te-box"><span class="te-glow">Text</span></div>', codeCss: `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0f0f12; }
.te-box { padding: 1rem; cursor: default; }
.te-glow { font-family: 'Poppins', sans-serif; font-size: 2rem; font-weight: 600; color: #293fc9; text-shadow: 0 0 8px rgba(41,63,201,0.5), 0 0 16px rgba(41,63,201,0.3); }
.te-box:hover .te-glow { animation: te-glow 1.2s ease-in-out infinite alternate; }
@keyframes te-glow { to { text-shadow: 0 0 12px rgba(41,63,201,0.6), 0 0 24px rgba(41,63,201,0.4); } }
  `.trim(), codeJs: '' },
  { title: 'Letter spacing', category: 'Text effect', previewType: 'code', codeHtml: '<div class="te-box te-box--fill"><span class="te-spacing">Text</span></div>', codeCss: `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #1e293b; }
.te-box { padding: 1rem; cursor: default; }
.te-box--fill { width: 100%; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
.te-spacing { font-family: 'Poppins', sans-serif; font-size: 2rem; font-weight: 600; color: #293fc9; letter-spacing: 0.1em; }
.te-box:hover .te-spacing { animation: te-spacing-kf 2s ease-in-out infinite; }
@keyframes te-spacing-kf { 0%,100% { letter-spacing: 0.1em; } 50% { letter-spacing: 0.5em; } }
  `.trim(), codeJs: '' },
  { title: 'Shake', category: 'Text effect', previewType: 'code', codeHtml: '<div class="te-box te-box--fill"><span class="te-shake">Text</span></div>', codeCss: `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #fef3c7; }
.te-box { padding: 1rem; cursor: default; }
.te-box--fill { width: 100%; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
.te-shake { font-family: 'Poppins', sans-serif; font-size: 2rem; font-weight: 600; color: #293fc9; display: inline-block; }
.te-box:hover .te-shake { animation: te-shake-kf 0.5s ease-in-out infinite; }
@keyframes te-shake-kf { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
  `.trim(), codeJs: '' },
  { title: 'Slide in', category: 'Text effect', previewType: 'code', codeHtml: '<div class="te-box"><span class="te-slide">Text</span></div>', codeCss: `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #ecfdf5; }
.te-box { padding: 1rem; overflow: hidden; cursor: default; }
.te-slide { font-family: 'Poppins', sans-serif; font-size: 2rem; font-weight: 600; color: #293fc9; display: inline-block; }
.te-box:hover .te-slide { animation: te-slide 2s ease-in-out infinite; }
@keyframes te-slide { 0% { transform: translateX(-100%); opacity: 0; } 50% { transform: translateX(0); opacity: 1; } 100% { transform: translateX(100%); opacity: 0; } }
  `.trim(), codeJs: '' },
  { title: 'Scale in', category: 'Text effect', previewType: 'code', codeHtml: '<div class="te-box"><span class="te-scale">Text</span></div>', codeCss: `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #fce7f3; }
.te-box { padding: 1rem; cursor: default; }
.te-scale { font-family: 'Poppins', sans-serif; font-size: 2rem; font-weight: 600; color: #293fc9; display: inline-block; }
.te-box:hover .te-scale { animation: te-scale 1.5s ease-in-out infinite; }
@keyframes te-scale { 0%,100% { transform: scale(0.8); opacity: 0.5; } 50% { transform: scale(1.1); opacity: 1; } }
  `.trim(), codeJs: '' },
]

export const BACKGROUND_EFFECT_SEEDS = [
  { title: 'Bubble', category: 'Background effect', previewType: 'component', componentKey: 'BubbleBackground', componentProps: { interactive: false } },
  { title: 'Gravity Star', category: 'Background effect', previewType: 'component', componentKey: 'GravityStarsBackground', componentProps: { starsCount: 120, starsSize: 0.7, starsOpacity: 0.85, glowIntensity: 6, movementSpeed: 0.35, mouseInfluence: 100, mouseGravity: 'attract' } },
  { title: 'Mesh Gradient', category: 'Background effect', previewType: 'code', codeHtml: '<div class="bg-mesh"></div>', codeCss: `
* { box-sizing: border-box; }
body { margin: 0; min-height: 100%; overflow: hidden; }
.bg-mesh {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background: radial-gradient(ellipse 80% 60% at 20% 30%, rgba(167,139,250,0.65), transparent 55%),
    radial-gradient(ellipse 70% 50% at 80% 70%, rgba(236,72,153,0.6), transparent 55%),
    radial-gradient(ellipse 60% 70% at 50% 50%, rgba(41,63,201,0.55), transparent 55%);
  background-size: 200% 200%, 180% 180%, 220% 220%;
  animation: mesh-move 8s ease-in-out infinite;
}
@keyframes mesh-move {
  0%,100% { background-position: 0% 0%, 100% 100%, 50% 50%; }
  50% { background-position: 100% 100%, 0% 0%, 80% 20%; }
}
  `.trim(), codeJs: '' },
  { title: 'Breathing Glass', category: 'Background effect', previewType: 'code', codeHtml: `<div class="bg-glass-wrap">
  <div class="bg-glass-bg">
    Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum. The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump. Sphinx of black quartz judge my vow. Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore. Excepteur sint occaecat cupidatat non proident sunt in culpa. The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump. Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. The quick brown fox jumps over the lazy dog. Sphinx of black quartz judge my vow.
  </div>
  <div class="bg-glass"></div>
</div>`, codeCss: `
* { box-sizing: border-box; }
body { margin: 0; min-height: 100%; overflow: hidden; }
.bg-glass-wrap {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  display: flex; align-items: center; justify-content: center;
}
.bg-glass-bg {
  position: absolute; inset: 0; overflow: hidden;
  padding: 24px; font-size: 11px; line-height: 1.6;
  color: rgba(0,36,110,0.7); font-family: system-ui, sans-serif;
  background: linear-gradient(180deg, #f0f4ff 0%, #e8ecf7 50%, #dfe4f0 100%);
}
.bg-glass {
  position: relative; z-index: 1;
  width: 120px; height: 120px;
  background: rgba(255,255,255,0.4);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255,255,255,0.7);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  animation: glass-breathe 2.5s ease-in-out infinite;
}
@keyframes glass-breathe {
  0%,100% { transform: scale(1); opacity: 0.82; filter: brightness(0.95); }
  50% { transform: scale(1.14); opacity: 1; filter: brightness(1.1); }
}
  `.trim(), codeJs: '' },
  { title: 'Infinite Marquee', category: 'Background effect', previewType: 'code', codeHtml: `
<div class="bg-marquee-wrap">
  <div class="bg-marquee">
    <span>★</span><span>◆</span><span>●</span><span>▲</span><span>♦</span><span>♥</span><span>☆</span><span>◇</span><span>○</span><span>△</span>
    <span>★</span><span>◆</span><span>●</span><span>▲</span><span>♦</span><span>♥</span><span>☆</span><span>◇</span><span>○</span><span>△</span>
  </div>
</div>
  `.trim(), codeCss: `
* { box-sizing: border-box; }
body { margin: 0; min-height: 100%; overflow: hidden; }
.bg-marquee-wrap { position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; overflow: hidden; }
.bg-marquee {
  display: flex; gap: 2rem; white-space: nowrap;
  animation: marquee 20s linear infinite;
  animation-play-state: paused;
}
body.preview-playing .bg-marquee {
  animation-play-state: running;
}
.bg-marquee span { font-size: 1.5rem; color: rgba(41,63,201,0.55); }
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
  `.trim(), codeJs: '' },
  { title: 'Grid Pulse', category: 'Background effect', previewType: 'code', codeHtml: '<div class="bg-grid"></div>', codeCss: `
* { box-sizing: border-box; }
body { margin: 0; min-height: 100%; overflow: hidden; }
.bg-grid {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(8, 1fr);
  gap: 2px;
  padding: 8px;
}
.bg-grid > div { background: rgba(41,63,201,0.22); border-radius: 2px; animation: grid-pulse 2s ease-in-out infinite; }
.bg-grid > div:nth-child(1) { animation-delay: 0s; }
@keyframes grid-pulse { 0%,100% { opacity: 0.85; background: rgba(41,63,201,0.22); } 50% { opacity: 1; background: rgba(41,63,201,0.5); } }
  `.trim(), codeJs: `
(function(){
  var wrap = document.querySelector('.bg-grid');
  if (!wrap) return;
  for (var i = 0; i < 96; i++) {
    var cell = document.createElement('div');
    cell.style.animationDelay = (i * 0.04) + 's';
    wrap.appendChild(cell);
  }
})();
  `.trim() },
  { title: 'Particle Constellation', category: 'Background effect', previewType: 'code', codeHtml: '<div class="bg-tile-wrap" id="constellation-wrap"><canvas id="constellation-canvas"></canvas></div>', codeCss: `
* { box-sizing: border-box; }
body { margin: 0; min-height: 100%; overflow: hidden; }
.bg-tile-wrap { position: absolute; top: 0; left: 0; right: 0; bottom: 0; }
#constellation-canvas { display: block; width: 100%; height: 100%; }
  `.trim(), codeJs: `
(function(){
  var wrap = document.getElementById('constellation-wrap');
  var canvas = document.getElementById('constellation-canvas');
  if (!wrap || !canvas) return;
  var ctx = canvas.getContext('2d');
  var particles = [];
  var mouse = { x: null, y: null };
  var num = 35;
  var w = 0, h = 0;
  var dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 3);
  function resize() {
    var nw = wrap.offsetWidth || wrap.clientWidth || 300;
    var nh = wrap.offsetHeight || wrap.clientHeight || 200;
    if (nw <= 0 || nh <= 0) return;
    if (nw !== w || nh !== h) {
      w = nw;
      h = nh;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      init();
    }
  }
  function init() {
    particles = [];
    for (var i = 0; i < num; i++) particles.push({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6
    });
  }
  function draw() {
    if (!ctx) return;
    resize();
    if (w <= 0 || h <= 0 || particles.length === 0) { requestAnimationFrame(loop); return; }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = 'rgba(244,245,244,0.2)';
    ctx.fillRect(0, 0, w, h);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.fillStyle = 'rgba(41,63,201,0.75)';
      ctx.beginPath(); ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2); ctx.fill();
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[j].x - p.x, dy = particles[j].y - p.y, d = Math.sqrt(dx*dx+dy*dy);
        if (d < 90) {
          ctx.strokeStyle = 'rgba(41,63,201,' + (1 - d/90) * 0.35 + ')';
          ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke();
        }
      }
      if (mouse.x != null) {
        dx = mouse.x - p.x; dy = mouse.y - p.y; d = Math.sqrt(dx*dx+dy*dy);
        if (d < 110) {
          ctx.strokeStyle = 'rgba(41,63,201,' + (1 - d/110) * 0.4 + ')';
          ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
    }
  }
  wrap.addEventListener('mousemove', function(e){ var r = wrap.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
  wrap.addEventListener('mouseleave', function(){ mouse.x = null; mouse.y = null; });
  window.addEventListener('resize', resize);
  requestAnimationFrame(function(){ resize(); draw(); });
  function loop(){ if (typeof window.__previewPlaying !== 'undefined' && !window.__previewPlaying) { requestAnimationFrame(loop); return; } draw(); requestAnimationFrame(loop); }
  loop();
})();
  `.trim() },
  { title: 'Matrix', category: 'Background effect', previewType: 'code', codeHtml: '<div class="bg-tile-wrap" id="matrix-wrap"><canvas id="matrix-canvas"></canvas></div>', codeCss: `
* { box-sizing: border-box; }
body { margin: 0; min-height: 100%; overflow: hidden; }
.bg-tile-wrap { position: absolute; top: 0; left: 0; right: 0; bottom: 0; }
#matrix-canvas { display: block; width: 100%; height: 100%; }
  `.trim(), codeJs: `
(function(){
  var wrap = document.getElementById('matrix-wrap');
  var canvas = document.getElementById('matrix-canvas');
  if (!wrap || !canvas) return;
  var ctx = canvas.getContext('2d');
  var chars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
  var cols = [];
  var fontSize = 14;
  var w = 0, h = 0;
  var dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 3);
  function resize() {
    var nw = wrap.offsetWidth || wrap.clientWidth || 300;
    var nh = wrap.offsetHeight || wrap.clientHeight || 200;
    if (nw <= 0 || nh <= 0) return;
    if (nw !== w || nh !== h) {
      w = nw;
      h = nh;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      cols = [];
      for (var i = 0; i < Math.floor(w / fontSize); i++) {
        cols.push({ y: Math.random() * h, speed: 0.3 + Math.random() * 0.5 });
      }
    }
  }
  function draw() {
    if (!ctx) return;
    resize();
    if (w <= 0 || h <= 0 || cols.length === 0) { requestAnimationFrame(loop); return; }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = 'rgba(244,245,244,0.06)';
    ctx.fillRect(0, 0, w, h);
    ctx.font = fontSize + 'px monospace';
    for (var i = 0; i < cols.length; i++) {
      var c = cols[i];
      ctx.fillStyle = 'rgba(41,63,201,0.9)';
      ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fontSize, c.y);
      ctx.fillStyle = 'rgba(41,63,201,0.4)';
      ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fontSize, c.y - fontSize);
      c.y += c.speed;
      if (c.y > h) c.y = 0;
    }
  }
  window.addEventListener('resize', resize);
  requestAnimationFrame(function(){ resize(); draw(); });
  function loop(){ if (typeof window.__previewPlaying !== 'undefined' && !window.__previewPlaying) { requestAnimationFrame(loop); return; } draw(); requestAnimationFrame(loop); }
  loop();
})();
  `.trim() },
  { title: 'Generative Noise', category: 'Background effect', previewType: 'code', codeHtml: '<div class="bg-tile-wrap" id="grain-wrap"><canvas id="grain-canvas"></canvas></div>', codeCss: `
* { box-sizing: border-box; }
body { margin: 0; min-height: 100%; overflow: hidden; }
.bg-tile-wrap { position: absolute; top: 0; left: 0; right: 0; bottom: 0; }
#grain-canvas { display: block; width: 100%; height: 100%; }
  `.trim(), codeJs: `
(function(){
  var wrap = document.getElementById('grain-wrap');
  var canvas = document.getElementById('grain-canvas');
  if (!wrap || !canvas) return;
  var ctx = canvas.getContext('2d');
  var imageData = null;
  var w = 0, h = 0;
  function resize() {
    var cw = wrap.offsetWidth || wrap.clientWidth || 300;
    var ch = wrap.offsetHeight || wrap.clientHeight || 200;
    if (cw <= 0 || ch <= 0) return;
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = w = cw;
      canvas.height = h = ch;
      imageData = null;
    }
  }
  function draw() {
    resize();
    if (!ctx || w <= 0 || h <= 0) { requestAnimationFrame(loop); return; }
    if (!imageData || imageData.width !== w || imageData.height !== h) {
      imageData = ctx.createImageData(w, h);
    }
    var d = imageData.data;
    for (var i = 0; i < d.length; i += 4) {
      var v = (Math.random() * 255) | 0;
      d[i] = v;
      d[i + 1] = v;
      d[i + 2] = Math.min(255, v + 25);
      d[i + 3] = 72;
    }
    ctx.putImageData(imageData, 0, 0);
  }
  function loop() { if (typeof window.__previewPlaying !== 'undefined' && !window.__previewPlaying) { requestAnimationFrame(loop); return; } draw(); requestAnimationFrame(loop); }
  requestAnimationFrame(function(){ resize(); draw(); loop(); });
})();
  `.trim() },
  { title: 'Topographic Lines', category: 'Background effect', previewType: 'code', codeHtml: '<div class="bg-tile-wrap" id="topo-wrap"><canvas id="topo-canvas"></canvas></div>', codeCss: `
* { box-sizing: border-box; }
body { margin: 0; min-height: 100%; overflow: hidden; }
.bg-tile-wrap { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: #f4f5f4; }
#topo-canvas { display: block; width: 100%; height: 100%; }
  `.trim(), codeJs: `
(function(){
  var wrap = document.getElementById('topo-wrap');
  var canvas = document.getElementById('topo-canvas');
  if (!wrap || !canvas) return;
  var ctx = canvas.getContext('2d');
  var perm = [];
  for (var i = 0; i < 256; i++) perm[i] = i;
  for (var i = 255; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = perm[i]; perm[i] = perm[j]; perm[j] = t;
  }
  var p = perm.concat(perm);
  function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
  function lerp(t, a, b) { return a + t * (b - a); }
  function grad2(hash, x, y) {
    var h = hash & 3;
    var u = h < 2 ? x : y;
    var v = h < 2 ? y : x;
    return ((h & 1) ? -u : u) + ((h & 2) ? -v : v) * 0.5;
  }
  function perlin2(x, y) {
    var X = Math.floor(x) & 255;
    var Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    var u = fade(x), v = fade(y);
    var A = p[X] + Y, B = p[X + 1] + Y;
    return lerp(v,
      lerp(u, grad2(p[A], x, y), grad2(p[B], x - 1, y)),
      lerp(u, grad2(p[A + 1], x, y - 1), grad2(p[B + 1], x - 1, y - 1)));
  }
  var time = 0;
  var msEdges = [[],[0,3],[0,1],[1,3],[1,2],[0,2],[0,2],[2,3],[2,3],[0,2],[1,3],[1,2],[0,3],[0,1],[0,3],[]];
  function resize() {
    var w = wrap.offsetWidth || wrap.clientWidth || 300;
    var h = wrap.offsetHeight || wrap.clientHeight || 200;
    if (w <= 0 || h <= 0) return;
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  }
  function sampleField(field, nx, ny, i, j) {
    if (i < 0 || i > nx || j < 0 || j > ny) return 0;
    return field[j * (nx + 1) + i];
  }
  function draw() {
    resize();
    if (!ctx || canvas.width <= 0 || canvas.height <= 0) { requestAnimationFrame(loop); return; }
    var w = canvas.width, h = canvas.height;
    ctx.fillStyle = '#f4f5f4';
    ctx.fillRect(0, 0, w, h);
    time += 0.01;
    var nx = 80;
    var ny = Math.max(40, Math.floor(nx * h / w));
    var scale = 0.08;
    var field = [];
    for (var j = 0; j <= ny; j++) {
      for (var i = 0; i <= nx; i++) {
        var v = perlin2(i * scale + time, j * scale) * 0.5 + 0.5;
        v += 0.4 * perlin2(i * scale * 1.5 + 50, j * scale * 1.5 + time * 0.6) * 0.5 + 0.5;
        field.push(v);
      }
    }
    var levels = [];
    for (var k = 0; k <= 14; k++) levels.push(0.18 + (k / 14) * 0.62);
    ctx.strokeStyle = '#2d3748';
    ctx.lineWidth = 0.6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (var l = 0; l < levels.length; l++) {
      var L = levels[l];
      for (var j = 0; j < ny; j++) {
        for (var i = 0; i < nx; i++) {
          var v00 = sampleField(field, nx, ny, i, j);
          var v10 = sampleField(field, nx, ny, i + 1, j);
          var v11 = sampleField(field, nx, ny, i + 1, j + 1);
          var v01 = sampleField(field, nx, ny, i, j + 1);
          var idx = (v00 >= L ? 1 : 0) + (v10 >= L ? 2 : 0) + (v11 >= L ? 4 : 0) + (v01 >= L ? 8 : 0);
          var edges = msEdges[idx];
          if (!edges || edges.length < 2) continue;
          function edgePoint(edge, v00, v10, v11, v01) {
            var t;
            if (edge === 0) { t = v10 === v00 ? 0.5 : (L - v00) / (v10 - v00); return [(i + Math.max(0, Math.min(1, t))) * (w / nx), j * (h / ny)]; }
            if (edge === 1) { t = v11 === v10 ? 0.5 : (L - v10) / (v11 - v10); return [(i + 1) * (w / nx), (j + Math.max(0, Math.min(1, t))) * (h / ny)]; }
            if (edge === 2) { t = v01 === v11 ? 0.5 : (L - v11) / (v01 - v11); return [(i + 1 - Math.max(0, Math.min(1, t))) * (w / nx), (j + 1) * (h / ny)]; }
            t = v00 === v01 ? 0.5 : (L - v01) / (v00 - v01); return [i * (w / nx), (j + 1 - Math.max(0, Math.min(1, t))) * (h / ny)];
          }
          var pt0 = edgePoint(edges[0], v00, v10, v11, v01);
          var pt1 = edgePoint(edges[1], v00, v10, v11, v01);
          ctx.beginPath();
          ctx.moveTo(pt0[0], pt0[1]);
          ctx.lineTo(pt1[0], pt1[1]);
          ctx.stroke();
        }
      }
    }
  }
  function loop() { if (typeof window.__previewPlaying !== 'undefined' && !window.__previewPlaying) { requestAnimationFrame(loop); return; } draw(); requestAnimationFrame(loop); }
  window.addEventListener('resize', resize);
  requestAnimationFrame(function(){ resize(); draw(); loop(); });
})();
  `.trim() },
  { title: 'Starfield Wormhole', category: 'Background effect', previewType: 'code', codeHtml: '<div class="bg-tile-wrap" id="wormhole-wrap"></div>', codeCss: `
* { box-sizing: border-box; }
body { margin: 0; min-height: 100%; overflow: hidden; }
.bg-tile-wrap { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: #f4f5f4; }
  `.trim(), codeJs: `
(function(){
  var wrap = document.getElementById('wormhole-wrap');
  if (!wrap) return;
  function run() {
    if (typeof THREE === 'undefined') return;
    var T = THREE;
    var scene = new T.Scene();
    var camera = new T.PerspectiveCamera(70, 1, 0.1, 1000);
    camera.position.z = 0;
    var renderer = new T.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setClearColor(0xf4f5f4, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    wrap.appendChild(renderer.domElement);
    var count = 1400;
    var depth = 100;
    var baseSpeed = 1.4;
    var streakLength = 2.8;
    var spawnRadius = 0.35;
    var speeds = new Float32Array(count);
    var i, j;
    for (i = 0; i < count; i++) speeds[i] = baseSpeed * (0.7 + Math.random() * 0.6);
    var positions = new Float32Array(count * 2 * 3);
    for (i = 0; i < count; i++) {
      var x = (Math.random() - 0.5) * spawnRadius * 2;
      var y = (Math.random() - 0.5) * spawnRadius * 2;
      var z = -Math.random() * depth;
      j = i * 6;
      positions[j] = x; positions[j + 1] = y; positions[j + 2] = z;
      positions[j + 3] = x; positions[j + 4] = y; positions[j + 5] = z + streakLength;
    }
    var geometry = new T.BufferGeometry();
    geometry.setAttribute('position', new T.BufferAttribute(positions, 3));
    var material = new T.LineBasicMaterial({
      color: 0x2d3748,
      transparent: true,
      opacity: 0.72,
      linewidth: 1
    });
    var lines = new T.LineSegments(geometry, material);
    scene.add(lines);
    function resize() {
      var w = wrap.offsetWidth || wrap.clientWidth || 300;
      var h = wrap.offsetHeight || wrap.clientHeight || 200;
      if (w <= 0 || h <= 0) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    function animate() {
      if (typeof window.__previewPlaying !== 'undefined' && !window.__previewPlaying) {
        requestAnimationFrame(animate);
        return;
      }
      resize();
      var pos = geometry.attributes.position.array;
      for (i = 0; i < count; i++) {
        j = i * 6;
        var s = speeds[i];
        pos[j + 2] += s;
        pos[j + 5] += s;
        if (pos[j + 2] > 0) {
          var x = (Math.random() - 0.5) * spawnRadius * 2;
          var y = (Math.random() - 0.5) * spawnRadius * 2;
          var z = -Math.random() * depth;
          pos[j] = x; pos[j + 1] = y; pos[j + 2] = z;
          pos[j + 3] = x; pos[j + 4] = y; pos[j + 5] = z + streakLength;
        }
      }
      geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    window.addEventListener('resize', resize);
    resize();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  if (typeof THREE !== 'undefined') run();
  else {
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js';
    s.onload = run;
    document.head.appendChild(s);
  }
})();
  `.trim() },
]

export const BUTTON_INTERACTION_SEEDS = [
  { title: 'Theme Toggle', category: 'Button interactions', previewType: 'component', componentKey: 'ThemeTogglerButton', componentProps: { modes: ['light', 'dark'] } },
]
