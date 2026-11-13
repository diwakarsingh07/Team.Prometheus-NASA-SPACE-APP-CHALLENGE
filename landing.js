/* ============================================================
   TEAM PROMETHEUS — CINEMATIC LANDING ENGINE
   240fps+ sub-frame cross-fade · GSAP ScrollTrigger
   Custom cursor · Reveal engine · Layman modal
   ============================================================ */
(() => {
'use strict';

/* ── CONFIG ────────────────────────────────────────────────── */
const TOTAL_RAW_FRAMES = 120;
const FRAME_STEP = 2; // Decimate to 60 optimized keyframes (50% memory & bandwidth savings)
const TOTAL_FRAMES = Math.floor(TOTAL_RAW_FRAMES / FRAME_STEP); // 60 frames
const FRAME_PATH = idx => {
  const rawIdx = Math.min(TOTAL_RAW_FRAMES, idx * FRAME_STEP + 1);
  return `frames_v2/frame_${String(rawIdx).padStart(3, '0')}.jpg`;
};
const LERP_FACTOR = 0.085;          // momentum smoothing
const BG = '#030508';

/* ── DOM REFS ──────────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const canvas      = $('seq-canvas');
const ctx         = canvas.getContext('2d');
const nav         = $('nav');
const hud         = $('hud');
const hAlt        = $('h-alt');
const hVel        = $('h-vel');
const hPhase      = $('h-phase');
const hBar        = $('h-bar');
const hPct        = $('h-pct');
const cur         = $('cur');
const curRing     = $('cur-ring');
const btnSound    = $('btn-sound');
const revealCanvas= $('reveal-canvas');
const revealStage = $('reveal-stage');
const brushXY     = $('brush-xy');
const revealPctEl = $('reveal-pct');
const rBrush      = $('r-brush');
const rScan       = $('r-scan');
const rSplit      = $('r-split');
const rReset      = $('r-reset');
const brushRSlider= $('brush-r');
const laymanModal = $('layman-modal');
const lmCanvas    = $('lm-canvas');
const lmEpoch     = $('lm-epoch');
const lmScore     = $('lm-score');
const lmBlink     = $('lm-blink');
const lmBlinkTxt  = $('lm-blink-txt');
const lmHint      = $('lm-hint');
const lmSound     = $('lm-sound');
const lmDiscovery = $('lm-discovery');

/* ── STATE & IDLE SLEEP CONTROLLER ─────────────────────────── */
let frames = [];
let loaded = 0;
let ready = false;
let scrollY = 0;
let currentFrame = 0;     // float for sub-frame blending
let displayFrame = 0;     // lerped value
let lastDrawnFrame = -1;  // prevents duplicate idle draws
let isDirty = true;       // dirty flag for force repaint
let isScrolling = false;  // active scroll tracker
let scrollTimer = null;
let audioCtx = null;
let audioOn = false;
let droneNode = null;

window.addEventListener('scroll', () => {
  isScrolling = true;
  isDirty = true;
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    isScrolling = false;
  }, 120);
}, { passive: true });

/* ── LENIS 120FPS SMOOTH SCROLL ENGINE ──────────────────────── */
let lenis = null;
function initLenis() {
  if (typeof Lenis === 'undefined') return;
  try {
    lenis = new Lenis({
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
      infinite: false,
    });

    window.lenis = lenis;

    lenis.on('scroll', () => {
      isScrolling = true;
      isDirty = true;
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        isScrolling = false;
      }, 120);
      if (window.ScrollTrigger) {
        ScrollTrigger.update();
      }
    });

    if (window.gsap && window.gsap.ticker) {
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  } catch (err) {
    console.warn('Lenis smooth scroll initialization skipped:', err);
  }
}

/* ── DEEP SPACE STORY PRELOADER & INITIALIZATION ──────────── */
function startPreloading() {
  initLenis();
  document.documentElement.classList.add('preloaded');
  ready = true;
  if (nav) nav.classList.add('visible');
  if (hud) hud.classList.add('visible');

  preloadStoryFrames();

  if (window.gsap) {
    initGSAP();
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }
}

function preloadStoryFrames() {
  if (frames.length > 0) return; // Prevent duplicate invocation

  // 1. Load first frame with immediate priority to draw hero background instantly
  const firstImg = new Image();
  firstImg.src = FRAME_PATH(0);
  const onFirstLoad = () => {
    ready = true;
    isDirty = true;
    try { drawFrame(0); } catch(e) {}
  };
  firstImg.onload = onFirstLoad;
  if (typeof firstImg.decode === 'function') {
    firstImg.decode().then(onFirstLoad).catch(onFirstLoad);
  }
  frames[0] = firstImg;

  // 2. Stream priority frames (first 8 descent frames for immediate scroll)
  for (let i = 1; i < Math.min(8, TOTAL_FRAMES); i++) {
    const img = new Image();
    img.src = FRAME_PATH(i);
    img.onload = () => { loaded++; isDirty = true; };
    frames[i] = img;
  }

  // 3. Stream remaining frames in non-blocking batches of 4
  let nextBatch = 8;
  function streamRemainingFrames() {
    if (nextBatch >= TOTAL_FRAMES) {
      ready = true;
      return;
    }
    const end = Math.min(nextBatch + 4, TOTAL_FRAMES);
    for (let i = nextBatch; i < end; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);
      img.onload = () => { loaded++; isDirty = true; };
      frames[i] = img;
    }
    nextBatch = end;
    if (nextBatch < TOTAL_FRAMES) {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(streamRemainingFrames, { timeout: 300 });
      } else {
        setTimeout(streamRemainingFrames, 60);
      }
    }
  }
  setTimeout(streamRemainingFrames, 250);
}

/* ── CANVAS SIZING ─────────────────────────────────────────── */
function sizeCanvas() {
  // Cap DPR to 1.25 to prevent massive 4K canvas buffers that cause GPU stutters
  const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
  canvas.width = Math.round(window.innerWidth * dpr);
  canvas.height = Math.round(window.innerHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  isDirty = true;
  try { drawFrame(displayFrame || 0); } catch(e) {}
}
window.addEventListener('resize', sizeCanvas);
sizeCanvas();

function getBestStoryFrame(idx) {
  if (!frames || !frames.length) return null;
  const target = Math.max(0, Math.min(Math.floor(idx), TOTAL_FRAMES - 1));
  if (frames[target] && frames[target].complete && frames[target].naturalWidth) {
    return frames[target];
  }
  // Look backwards for closest decoded story frame
  for (let i = target - 1; i >= 0; i--) {
    if (frames[i] && frames[i].complete && frames[i].naturalWidth) {
      return frames[i];
    }
  }
  // Look forwards if first frames are still decoding
  for (let i = target + 1; i < TOTAL_FRAMES; i++) {
    if (frames[i] && frames[i].complete && frames[i].naturalWidth) {
      return frames[i];
    }
  }
  return null;
}

/* ── DRAW ENGINE — Sub-frame cross-fade blending ───────────── */
function drawFrame(floatIdx) {
  if (!frames.length) return;
  const lo = Math.floor(floatIdx);
  const hi = Math.min(lo + 1, TOTAL_FRAMES - 1);
  const t = floatIdx - lo;

  const W = window.innerWidth;
  const H = window.innerHeight;

  let imgA = frames[lo];
  let imgB = frames[hi];
  if (!imgA || !imgA.complete || !imgA.naturalWidth) {
    imgA = getBestStoryFrame(lo);
    imgB = null;
  }
  if (!imgA) return;

  // Single opaque fill pass (eliminates redundant clearRect CPU/GPU fill-rate thrashing)
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  // Contain-fit calculation
  const iw = imgA.naturalWidth || 1280;
  const ih = imgA.naturalHeight || 720;
  const scale = Math.min(W / iw, H / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (W - dw) / 2;
  const dy = (H - dh) / 2;

  // Draw base frame
  ctx.globalAlpha = 1;
  ctx.drawImage(imgA, dx, dy, dw, dh);

  // Cross-fade only when fractional transition is visually meaningful (> 0.04)
  if (t > 0.04 && imgB && imgB.complete && imgB.naturalWidth) {
    ctx.globalAlpha = t;
    ctx.drawImage(imgB, dx, dy, dw, dh);
    ctx.globalAlpha = 1;
  }
}

/* ── SCROLL → FRAME MAPPING ────────────────────────────────── */
function getScrollProgress() {
  const doc = document.documentElement;
  const scrollTop = lenis ? lenis.scroll : (window.pageYOffset || doc.scrollTop);
  const scrollHeight = doc.scrollHeight - doc.clientHeight;
  return scrollHeight > 0 ? Math.min(1, Math.max(0, scrollTop / scrollHeight)) : 0;
}

function getSequenceProgress() {
  const targetEl = $('act-reveal') || $('act-modes') || $('sec-what-built');
  const scrollTop = lenis ? lenis.scroll : (window.pageYOffset || document.documentElement.scrollTop);
  if (!targetEl) return getScrollProgress();
  const trigger = targetEl.offsetTop + targetEl.offsetHeight * 0.5 - window.innerHeight * 0.5;
  return trigger > 0 ? Math.min(1, Math.max(0, scrollTop / trigger)) : 0;
}

/* ── ANIMATION LOOP WITH ZERO-IDLE CPU/GPU SLEEP ────────────── */
function tick() {
  if (ready) {
    const seqProgress = getSequenceProgress();
    const pageProgress = getScrollProgress();
    currentFrame = seqProgress * (TOTAL_FRAMES - 1);

    const diff = Math.abs(currentFrame - displayFrame);
    // Only repaint if frame is moving, user is scrolling, dirty flag set, or in tour mode
    if (diff > 0.005 || isScrolling || isDirty || tourActive) {
      displayFrame += (currentFrame - displayFrame) * LERP_FACTOR;
      
      if (Math.abs(displayFrame - lastDrawnFrame) > 0.006 || isDirty) {
        drawFrame(displayFrame);
        lastDrawnFrame = displayFrame;
        isDirty = false;
      }
      updateHUD(pageProgress);
    }
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

/* ── HUD UPDATE ────────────────────────────────────────────── */
const phases = [
  [0,    'ORBITAL ENTRY'],
  [0.15, 'DEORBIT BURN'],
  [0.30, 'DESCENT PHASE'],
  [0.50, 'TOUCHDOWN'],
  [0.65, 'TERMINAL ACTIVE'],
  [0.80, 'DATA STREAMING'],
  [0.90, 'ANALYSIS MODE'],
];

function updateHUD(p) {
  const alt = Math.max(0, 384400 * (1 - p * 1.1)).toFixed(0);
  hAlt.textContent = Number(alt).toLocaleString() + ' KM';
  const vel = (11.2 * (1 - p * 0.9)).toFixed(1);
  hVel.textContent = vel + ' KM/S';

  let phase = 'ORBITAL ENTRY';
  for (const [th, name] of phases) {
    if (p >= th) phase = name;
  }
  hPhase.textContent = phase;
  const pct = Math.round(p * 100);
  hBar.style.width = pct + '%';
  hPct.textContent = pct + '%';
}

/* ── GSAP SCROLL ANIMATIONS ───────────────────────────────── */
function initGSAP() {
  gsap.registerPlugin(ScrollTrigger);

  // Animate each .card on scroll-enter with 3D pop-out spring
  document.querySelectorAll('.card').forEach(card => {
    gsap.fromTo(card,
      {
        opacity: 0,
        y: 45,
        scale: 0.92,
        rotationX: 10,
        transformPerspective: 1200,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: 0.8,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        }
      }
    );
  });

  // Interactive 3D Mouse Parallax Tilt for cards
  document.querySelectorAll('.card, .mode-card').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const tiltX = -y * 10;
      const tiltY = x * 10;
      el.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(16px) scale3d(1.015, 1.015, 1.015)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });

  // Hero text entrance & reversible scroll-fade
  const heroInner = document.querySelector('.act-hero .act-inner');
  if (heroInner) {
    // Set initial state and animate in
    gsap.set(heroInner, { opacity: 0, y: 40 });
    gsap.to(heroInner, {
      opacity: 1,
      y: 0,
      duration: 1.0,
      ease: 'power3.out',
      delay: 0.2,
      onComplete: () => {
        // Once visible, attach scroll scrub that reliably returns to opacity 1 when scrolling back to top
        gsap.fromTo(heroInner,
          { opacity: 1, y: 0 },
          {
            opacity: 0,
            y: -70,
            ease: 'none',
            scrollTrigger: {
              trigger: '.act-hero',
              start: 'top top',
              end: '35% top',
              scrub: 0.3,
              invalidateOnRefresh: true,
            }
          }
        );
      }
    });
  }

  // Modes section — stagger mode cards
  gsap.from('.mode-card', {
    opacity: 0, y: 50, stagger: 0.15, duration: 0.8, ease: 'power2.out',
    scrollTrigger: {
      trigger: '.act-modes',
      start: 'top 75%',
      toggleActions: 'play none none reverse',
    }
  });

  // Modes heading
  const modesHead = document.querySelector('.modes-head');
  if (modesHead) {
    gsap.from(modesHead, {
      opacity: 0, y: 40, duration: 0.8, ease: 'power2.out',
      scrollTrigger: {
        trigger: modesHead,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      }
    });
  }

  // Rocket banner links click handler — jumps directly to section
  document.querySelectorAll('.r-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        if (lenis) {
          lenis.scrollTo(target, { duration: 1.2 });
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
        playTick();
      }
    });
  });

  // Parallax tilt for kuiper
  const kuiperVis = $('kuiper-vis');
  if (kuiperVis) {
    kuiperVis.addEventListener('mousemove', e => {
      const r = kuiperVis.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 8;
      const y = ((e.clientY - r.top) / r.height - 0.5) * -8;
      kuiperVis.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${y}deg)`;
    });
    kuiperVis.addEventListener('mouseleave', () => {
      kuiperVis.style.transform = 'perspective(600px) rotateY(0) rotateX(0)';
      kuiperVis.style.transition = 'transform .4s ease-out';
    });
    kuiperVis.addEventListener('mouseenter', () => {
      kuiperVis.style.transition = 'none';
    });
  }

  // ── "What We Have Built" — GSAP Staggered Card Entrance ──
  if (document.querySelector('.arch-grid')) {
    gsap.from('.arch-item', {
      opacity: 0,
      y: 50,
      scale: 0.94,
      stagger: 0.12,
      duration: 0.85,
      ease: 'back.out(1.15)',
      scrollTrigger: {
        trigger: '.arch-grid',
        start: 'top 82%',
        toggleActions: 'play none none reverse',
      }
    });
  }

  // ── "The Challenge" Points — GSAP Staggered Entrance ──
  if (document.querySelector('.chal-points-grid')) {
    gsap.from('.chal-point-card', {
      opacity: 0,
      y: 45,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.chal-points-grid',
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      }
    });
  }

  // ── Dual Console Workflow Steps Stagger ──
  if (document.querySelector('.guide-step-list')) {
    gsap.from('.step-item', {
      opacity: 0,
      x: -20,
      stagger: 0.08,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.console-guide-container',
        start: 'top 82%',
        toggleActions: 'play none none reverse',
      }
    });
  }

  // ── Resources Used Tech Cards Stagger ──
  if (document.querySelector('.res-grid-tech')) {
    gsap.from('.res-tech-card', {
      opacity: 0,
      y: 50,
      stagger: 0.14,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.res-grid-tech',
        start: 'top 82%',
        toggleActions: 'play none none reverse',
      }
    });
  }

  // ── Hero Rocket Smooth Mouse Parallax & Thruster Pulse ──
  const rocketCraft = document.querySelector('.rocket-craft-group');
  if (rocketCraft) {
    window.addEventListener('mousemove', e => {
      if (window.scrollY > (window.innerHeight * 0.8)) return;
      const nx = (e.clientX / window.innerWidth - 0.5) * 16;
      const ny = (e.clientY / window.innerHeight - 0.5) * 10;
      gsap.to(rocketCraft, {
        x: nx,
        y: ny,
        rotation: nx * 0.22,
        duration: 0.65,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });
  }
}

/* ── CUSTOM CURSOR ─────────────────────────────────────────── */
let mx = -100, my = -100, cx = -100, cy = -100, rx = -100, ry = -100;
let cursorActive = false;
document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  if (!cursorActive) {
    cursorActive = true;
    cx = rx = mx;
    cy = ry = my;
    cur.classList.add('active');
    curRing.classList.add('active');
  }
});

function cursorTick() {
  cx += (mx - cx) * 0.2;
  cy += (my - cy) * 0.2;
  rx += (mx - rx) * 0.08;
  ry += (my - ry) * 0.08;
  cur.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
  curRing.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
  requestAnimationFrame(cursorTick);
}
requestAnimationFrame(cursorTick);

// Hover states
document.addEventListener('mouseover', e => {
  const t = e.target;
  if (t.matches('a,button,.mode-card,.rc-b,.btn,input')) {
    cur.classList.add('hover');
    curRing.classList.add('hover');
  }
});
document.addEventListener('mouseout', e => {
  const t = e.target;
  if (t.matches('a,button,.mode-card,.rc-b,.btn,input')) {
    cur.classList.remove('hover');
    curRing.classList.remove('hover');
  }
});

/* ── DUST PARTICLES (Optimized & Pauses When Hidden/Idle) ───── */
(function initDust() {
  const dc = document.createElement('canvas');
  dc.id = 'dust-canvas';
  dc.style.position = 'fixed';
  dc.style.inset = '0';
  dc.style.pointerEvents = 'none';
  dc.style.zIndex = '1';
  dc.style.transform = 'translateZ(0)';
  dc.style.willChange = 'transform';
  document.body.appendChild(dc);
  const dctx = dc.getContext('2d');
  let particles = [];
  const COUNT = 40;
  let dustRunning = true;

  function sizeDust() {
    dc.width = window.innerWidth;
    dc.height = window.innerHeight;
  }
  sizeDust();
  window.addEventListener('resize', sizeDust);

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.15,
      a: Math.random() * 0.3 + 0.05,
    });
  }

  document.addEventListener('visibilitychange', () => {
    dustRunning = !document.hidden;
    if (dustRunning) requestAnimationFrame(dustTick);
  });

  function dustTick() {
    if (!dustRunning) return;
    dctx.clearRect(0, 0, dc.width, dc.height);
    for (const p of particles) {
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < -10) p.x = dc.width + 10;
      if (p.x > dc.width + 10) p.x = -10;
      if (p.y < -10) p.y = dc.height + 10;
      if (p.y > dc.height + 10) p.y = -10;
      dctx.beginPath();
      dctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      dctx.fillStyle = `rgba(255,255,255,${p.a})`;
      dctx.fill();
    }
    requestAnimationFrame(dustTick);
  }
  dustTick();
})();

/* ── SOUND ENGINE ──────────────────────────────────────────── */
function initAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  // Sub-bass cosmic drone (45 Hz)
  const osc = audioCtx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = 45;
  const gain = audioCtx.createGain();
  gain.gain.value = 0;
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  droneNode = gain;

  // Subtle high hiss layer
  const bufferSize = audioCtx.sampleRate * 2;
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.02;
  const noiseSource = audioCtx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  noiseSource.loop = true;
  const noiseGain = audioCtx.createGain();
  noiseGain.gain.value = 0;
  const hipass = audioCtx.createBiquadFilter();
  hipass.type = 'highpass';
  hipass.frequency.value = 4000;
  noiseSource.connect(hipass);
  hipass.connect(noiseGain);
  noiseGain.connect(audioCtx.destination);
  noiseSource.start();

  // Store for toggle
  audioCtx._droneGain = gain;
  audioCtx._noiseGain = noiseGain;
}

function toggleSound() {
  initAudio();
  audioOn = !audioOn;
  const t = audioCtx.currentTime;
  audioCtx._droneGain.gain.linearRampToValueAtTime(audioOn ? 0.12 : 0, t + 0.3);
  audioCtx._noiseGain.gain.linearRampToValueAtTime(audioOn ? 0.04 : 0, t + 0.3);
  // Update icon
  const icon = btnSound.querySelector('i');
  if (icon) {
    icon.setAttribute('data-lucide', audioOn ? 'volume-2' : 'volume-x');
    lucide.createIcons();
  }
}

if (btnSound) btnSound.addEventListener('click', toggleSound);

// Click tick sound
function playTick() {
  if (!audioCtx || !audioOn) return;
  const osc = audioCtx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = 1200;
  const g = audioCtx.createGain();
  g.gain.value = 0.04;
  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
  osc.connect(g);
  g.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.08);
}

document.addEventListener('click', e => {
  if (e.target.matches('a,button,.mode-card,.rc-b,.btn')) playTick();
});

/* ============================================================
   REVEAL ENGINE — 1930 vs 2026 Thermal Scanner
   ============================================================ */
(function initReveal() {
  if (!revealCanvas) return;
  const rctx = revealCanvas.getContext('2d');
  const W = revealCanvas.width;
  const H = revealCanvas.height;

  let imgOld = new Image();
  let imgNew = new Image();
  let oldReady = false, newReady = false;
  imgOld.src = 'tombaugh_1930.jpg';
  imgNew.src = 'spherex_infrared.jpg';
  imgOld.onload = () => { oldReady = true; drawReveal(); };
  imgNew.onload = () => { newReady = true; drawReveal(); };

  let mode = 'brush'; // brush | scan | split
  let brushR = 70;
  let maskCanvas = document.createElement('canvas');
  maskCanvas.width = W;
  maskCanvas.height = H;
  let maskCtx = maskCanvas.getContext('2d');
  maskCtx.fillStyle = '#000';
  maskCtx.fillRect(0, 0, W, H);

  let mouseX = W/2, mouseY = H/2;
  let scanAngle = 0;
  let splitX = 0.5;
  const totalPixels = W * H;

  // Single reusable compositing canvas for high-FPS rendering
  const tempC = document.createElement('canvas');
  tempC.width = W;
  tempC.height = H;
  const tctx = tempC.getContext('2d');

  let lastPctCalc = 0;
  function updateRevealPct() {
    const now = performance.now();
    if (now - lastPctCalc < 160) return; // ~6 updates/sec max to prevent CPU stall
    lastPctCalc = now;
    const maskData = maskCtx.getImageData(0, 0, W, H).data;
    let revealed = 0;
    const step = 32; // sampled
    for (let i = 3; i < maskData.length; i += step * 4) {
      if (maskData[i] > 128) revealed++;
    }
    const totalSampled = (W * H) / step;
    const pct = Math.min(100, Math.round((revealed / totalSampled) * 100));
    if (revealPctEl) revealPctEl.textContent = 'REVEALED: ' + pct + '%';
  }

  function drawReveal() {
    if (!oldReady || !newReady) return;
    rctx.clearRect(0, 0, W, H);

    // Draw old (base 1930 plate)
    rctx.drawImage(imgOld, 0, 0, W, H);

    if (mode === 'split') {
      const splitPx = splitX * W;
      rctx.save();
      rctx.beginPath();
      rctx.rect(splitPx, 0, W - splitPx, H);
      rctx.clip();
      rctx.drawImage(imgNew, 0, 0, W, H);
      rctx.restore();
      // Split separator
      rctx.strokeStyle = '#00e5ff';
      rctx.lineWidth = 2;
      rctx.beginPath();
      rctx.moveTo(splitPx, 0);
      rctx.lineTo(splitPx, H);
      rctx.stroke();
    } else {
      tctx.clearRect(0, 0, W, H);
      tctx.globalCompositeOperation = 'source-over';
      tctx.drawImage(imgNew, 0, 0, W, H);
      tctx.globalCompositeOperation = 'destination-in';
      tctx.drawImage(maskCanvas, 0, 0);

      rctx.drawImage(tempC, 0, 0);
    }

    updateRevealPct();
  }

  // Brush paint
  function paint(ex, ey) {
    if (mode !== 'brush') return;
    const rect = revealCanvas.getBoundingClientRect();
    const sx = (ex - rect.left) / rect.width * W;
    const sy = (ey - rect.top) / rect.height * H;
    mouseX = sx; mouseY = sy;

    maskCtx.globalCompositeOperation = 'source-over';
    const grad = maskCtx.createRadialGradient(sx, sy, 0, sx, sy, brushR);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.7, 'rgba(255,255,255,0.6)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    maskCtx.fillStyle = grad;
    maskCtx.beginPath();
    maskCtx.arc(sx, sy, brushR, 0, Math.PI * 2);
    maskCtx.fill();
    drawReveal();
    if (brushXY) brushXY.textContent = `X:${Math.round(sx)} Y:${Math.round(sy)}`;
  }

  // Scan sweep
  function runScan() {
    if (mode !== 'scan') return;
    scanAngle += 0.02;
    const cx = W / 2, cy = H / 2;
    const radius = Math.max(W, H);
    const endX = cx + Math.cos(scanAngle) * radius;
    const endY = cy + Math.sin(scanAngle) * radius;
    const endX2 = cx + Math.cos(scanAngle + 0.15) * radius;
    const endY2 = cy + Math.sin(scanAngle + 0.15) * radius;

    maskCtx.globalCompositeOperation = 'source-over';
    maskCtx.beginPath();
    maskCtx.moveTo(cx, cy);
    maskCtx.lineTo(endX, endY);
    maskCtx.lineTo(endX2, endY2);
    maskCtx.closePath();
    maskCtx.fillStyle = 'rgba(255,255,255,0.5)';
    maskCtx.fill();
    drawReveal();
    if (mode === 'scan') requestAnimationFrame(runScan);
  }

  // Split mode drag
  let draggingSplit = false;
  if (revealStage) {
    revealStage.addEventListener('mousedown', e => { if (mode === 'split') draggingSplit = true; });
    revealStage.addEventListener('mouseup', () => { draggingSplit = false; });
    revealStage.addEventListener('mousemove', e => {
      if (mode === 'brush') paint(e.clientX, e.clientY);
      if (mode === 'split' && draggingSplit) {
        const rect = revealStage.getBoundingClientRect();
        splitX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        drawReveal();
      }
    });
    // Touch support (vertical scrolling preserved when not actively brushing or dragging split)
    revealStage.addEventListener('touchstart', e => {
      if (mode === 'split') draggingSplit = true;
    }, { passive: true });
    revealStage.addEventListener('touchend', () => {
      draggingSplit = false;
    }, { passive: true });
    revealStage.addEventListener('touchcancel', () => {
      draggingSplit = false;
    }, { passive: true });
    revealStage.addEventListener('touchmove', e => {
      if (mode === 'brush' || (mode === 'split' && draggingSplit)) {
        e.preventDefault();
        const t = e.touches[0];
        if (mode === 'brush') paint(t.clientX, t.clientY);
        if (mode === 'split') {
          const rect = revealStage.getBoundingClientRect();
          splitX = Math.max(0, Math.min(1, (t.clientX - rect.left) / rect.width));
          drawReveal();
        }
      }
    }, { passive: false });
  }

  // Mode buttons
  function setMode(m) {
    mode = m;
    [rBrush, rScan, rSplit].forEach(b => b && b.classList.remove('active'));
    if (m === 'brush' && rBrush) rBrush.classList.add('active');
    if (m === 'scan' && rScan) { rScan.classList.add('active'); runScan(); }
    if (m === 'split' && rSplit) { rSplit.classList.add('active'); drawReveal(); }
  }

  if (rBrush) rBrush.addEventListener('click', () => setMode('brush'));
  if (rScan) rScan.addEventListener('click', () => setMode('scan'));
  if (rSplit) rSplit.addEventListener('click', () => setMode('split'));
  if (rReset) rReset.addEventListener('click', () => {
    maskCtx.clearRect(0, 0, W, H);
    maskCtx.fillStyle = '#000';
    maskCtx.fillRect(0, 0, W, H);
    scanAngle = 0;
    splitX = 0.5;
    drawReveal();
  });
  if (brushRSlider) brushRSlider.addEventListener('input', e => { brushR = +e.target.value; });

  drawReveal();
})();

/* ============================================================
   LAYMAN MODAL — Blink Comparator Game
   ============================================================ */
let lmCtx = lmCanvas ? lmCanvas.getContext('2d') : null;
let lmImgA = new Image();
let lmImgB = new Image();
let lmAReady = false, lmBReady = false;
lmImgA.src = 'sky_epoch1.png';
lmImgB.src = 'sky_diff.png';
lmImgA.onload = () => { lmAReady = true; };
lmImgB.onload = () => { lmBReady = true; };

let lmShowingA = true;
let lmBlinkInterval = null;
let lmGameScore = 0;
const LM_TARGETS = [
  { x: 0.35, y: 0.42, found: false },
  { x: 0.65, y: 0.28, found: false },
  { x: 0.50, y: 0.72, found: false },
];

function drawLM() {
  if (!lmCtx) return;
  const W = lmCanvas.width, H = lmCanvas.height;
  lmCtx.clearRect(0, 0, W, H);
  lmCtx.fillStyle = '#0a0c10';
  lmCtx.fillRect(0, 0, W, H);

  const img = lmShowingA ? lmImgA : lmImgB;
  if (img.complete && img.naturalWidth > 0) {
    lmCtx.drawImage(img, 0, 0, W, H);
  }

  // Draw synthetic "moving dots" for the game
  LM_TARGETS.forEach((t, i) => {
    if (t.found) {
      // Draw green ring for found
      lmCtx.strokeStyle = '#69f0ae';
      lmCtx.lineWidth = 2;
      lmCtx.beginPath();
      lmCtx.arc(t.x * W, t.y * H, 12, 0, Math.PI * 2);
      lmCtx.stroke();
    } else {
      // Moving dot — shifts between epochs
      const offset = lmShowingA ? 0 : 6;
      lmCtx.fillStyle = 'rgba(255,200,50,0.9)';
      lmCtx.beginPath();
      lmCtx.arc(t.x * W + offset, t.y * H + offset * 0.5, 3, 0, Math.PI * 2);
      lmCtx.fill();
    }
  });

  if (lmEpoch) lmEpoch.textContent = lmShowingA ? 'EPOCH 1 (MAY 2025)' : 'EPOCH 2 (NOV 2025)';
}

// Click to find target
if (lmCanvas) {
  lmCanvas.addEventListener('click', e => {
    const rect = lmCanvas.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width;
    const cy = (e.clientY - rect.top) / rect.height;

    for (const t of LM_TARGETS) {
      if (t.found) continue;
      const dx = cx - t.x;
      const dy = cy - t.y;
      if (Math.sqrt(dx*dx + dy*dy) < 0.06) {
        t.found = true;
        lmGameScore++;
        if (lmScore) lmScore.textContent = `SCORE: ${lmGameScore} / 3`;
        playTick();
        if (lmGameScore >= 3 && lmDiscovery) {
          lmDiscovery.classList.remove('hidden');
        }
        break;
      }
    }
    drawLM();
  });
}

// Auto-blink toggle
if (lmBlink) {
  lmBlink.addEventListener('click', () => {
    if (lmBlinkInterval) {
      clearInterval(lmBlinkInterval);
      lmBlinkInterval = null;
      if (lmBlinkTxt) lmBlinkTxt.textContent = 'Auto-Blink';
    } else {
      lmBlinkInterval = setInterval(() => {
        lmShowingA = !lmShowingA;
        drawLM();
      }, 500);
      if (lmBlinkTxt) lmBlinkTxt.textContent = 'Stop';
    }
  });
}

// Hint button
if (lmHint) {
  lmHint.addEventListener('click', () => {
    if (!lmCtx) return;
    const W = lmCanvas.width, H = lmCanvas.height;
    for (const t of LM_TARGETS) {
      if (!t.found) {
        lmCtx.strokeStyle = 'rgba(255,179,0,0.5)';
        lmCtx.lineWidth = 1;
        lmCtx.setLineDash([4, 4]);
        lmCtx.beginPath();
        lmCtx.arc(t.x * W, t.y * H, 20, 0, Math.PI * 2);
        lmCtx.stroke();
        lmCtx.setLineDash([]);
        break; // only show one hint at a time
      }
    }
  });
}

// Sonification button
if (lmSound) {
  lmSound.addEventListener('click', () => {
    initAudio();
    // Play a quick ascending tone sequence representing IR spectrum
    const now = audioCtx.currentTime;
    for (let i = 0; i < 12; i++) {
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 200 + i * 80 + Math.random() * 40;
      g.gain.value = 0.06;
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.12);
      osc.connect(g);
      g.connect(audioCtx.destination);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.15);
    }
  });
}

/* ── LAYMAN MODAL OPEN/CLOSE ───────────────────────────────── */
window.openLaymanModal = function() {
  if (!laymanModal) return;
  laymanModal.classList.remove('hidden');
  // Force reflow then add show class for animation
  void laymanModal.offsetWidth;
  laymanModal.classList.add('show');
  drawLM();
  playTick();
};

window.closeLaymanModal = function() {
  if (!laymanModal) return;
  laymanModal.classList.remove('show');
  if (lmBlinkInterval) {
    clearInterval(lmBlinkInterval);
    lmBlinkInterval = null;
    if (lmBlinkTxt) lmBlinkTxt.textContent = 'Auto-Blink';
  }
  setTimeout(() => laymanModal.classList.add('hidden'), 300);
};

/* ── NAV SMOOTH SCROLL ─────────────────────────────────────── */
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      if (lenis) {
        lenis.scrollTo(target, { duration: 1.2 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      playTick();
    }
  });
});

/* ── SERVICE WORKER REGISTRATION ───────────────────────────── */
if ('serviceWorker' in navigator) {
  if (document.readyState === 'complete') {
    navigator.serviceWorker.register('/sw.js').catch(err => console.warn('SW reg failed:', err));
  } else {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(err => console.warn('SW reg failed:', err));
    });
  }
}

/* ── AUTONOMOUS DIRECTOR TOUR CONTROLLER ───────────────────── */
const tourHUD = $('tour-director-hud');
const tourCaption = $('tour-step-caption');
const tourProgressFill = $('tour-progress-fill');
const btnTour = $('btn-tour');
const btnTourRecord = $('btn-tour-record');
const btnTourPause = $('btn-tour-pause');
const btnTourExit = $('btn-tour-exit');

let tourActive = false;
let tourPaused = false;
let tourAnimFrame = null;
let tourStartTime = 0;
let tourPauseOffset = 0;
let mediaRecorder = null;
let recordedChunks = [];
const TOUR_DURATION = 32000; // 32 seconds total automated flight path

function startCinematicTour() {
  if (tourActive) return;
  tourActive = true;
  tourPaused = false;
  tourStartTime = performance.now();
  tourPauseOffset = 0;
  if (tourHUD) tourHUD.classList.remove('hidden');
  if (btnTour) btnTour.style.borderColor = '#ff2a85';

  if (!audioOn && typeof toggleAudio === 'function') toggleAudio();
  window.scrollTo({ top: 0, behavior: 'instant' });
  runTourLoop();
}

function stopCinematicTour() {
  tourActive = false;
  tourPaused = false;
  if (tourAnimFrame) cancelAnimationFrame(tourAnimFrame);
  if (tourHUD) tourHUD.classList.add('hidden');
  if (btnTour) btnTour.style.borderColor = '';
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
  }
}

function toggleTourPause() {
  if (!tourActive) return;
  tourPaused = !tourPaused;
  if (tourPaused) {
    if (tourAnimFrame) cancelAnimationFrame(tourAnimFrame);
    if (btnTourPause) btnTourPause.innerHTML = `<i data-lucide="play"></i><span>Resume</span>`;
    if (tourCaption) tourCaption.textContent = 'PAUSED // PRESS SPACE OR RESUME TO CONTINUE';
  } else {
    tourStartTime = performance.now() - tourPauseOffset;
    if (btnTourPause) btnTourPause.innerHTML = `<i data-lucide="pause"></i><span>Pause</span>`;
    runTourLoop();
  }
  if (window.lucide) lucide.createIcons();
}

function runTourLoop() {
  if (!tourActive || tourPaused) return;
  const now = performance.now();
  const elapsed = now - tourStartTime;
  tourPauseOffset = elapsed;
  const progress = Math.min(1, elapsed / TOUR_DURATION);

  if (tourProgressFill) {
    tourProgressFill.style.width = (progress * 100) + '%';
  }

  const doc = document.documentElement;
  const maxScroll = doc.scrollHeight - window.innerHeight;
  const builtEl = $('sec-what-built');
  const modesEl = $('act-modes');
  const revEl = $('act-reveal');
  const kuiperEl = $('act-kuiper');
  const chalEl = $('act-challenge');
  const resEl = $('sec-resources');

  const builtY = builtEl ? builtEl.offsetTop - 60 : maxScroll * 0.12;
  const modesY = modesEl ? modesEl.offsetTop - 60 : maxScroll * 0.28;
  const revY = revEl ? revEl.offsetTop - 40 : maxScroll * 0.48;
  const kuiperY = kuiperEl ? kuiperEl.offsetTop - 40 : maxScroll * 0.65;
  const chalY = chalEl ? chalEl.offsetTop - 50 : maxScroll * 0.82;
  const resY = resEl ? resEl.offsetTop - 50 : maxScroll * 0.95;

  let targetY = 0;
  let caption = '';

  if (progress < 0.10) {
    targetY = 0;
    caption = 'ACT I // ORBITAL ENTRY — 102 SPECTRAL CHANNELS (0.75 - 5.0 µm)';
  } else if (progress < 0.25) {
    const t = (progress - 0.10) / (0.25 - 0.10);
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    targetY = ease * builtY;
    caption = 'MISSION ARCHITECTURE // WHAT WE HAVE BUILT — FULL-STACK RESEARCH SUITE';
  } else if (progress < 0.42) {
    const t = (progress - 0.25) / (0.42 - 0.25);
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    targetY = builtY + ease * (modesY - builtY);
    caption = 'THE CONSOLE // DUAL DISCOVERY GATEWAY & OPERATIONAL WORKFLOW GUIDE';
  } else if (progress < 0.60) {
    const t = (progress - 0.42) / (0.60 - 0.42);
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    targetY = modesY + ease * (revY - modesY);
    caption = 'TIME MACHINE // CLYDE TOMBAUGH 1930 vs SPHEREx 2026 INFRARED DIPOLE';

    if (revealCanvas && revEl && typeof drawReveal === 'function') {
      const cw = revealCanvas.width;
      const ch = revealCanvas.height;
      const sweepX = (cw * 0.25) + Math.sin(t * Math.PI * 4) * (cw * 0.35);
      const sweepY = ch * 0.5;
      if (typeof drawBrushMask === 'function') {
        drawBrushMask(sweepX, sweepY, 110);
      }
    }
  } else if (progress < 0.78) {
    const t = (progress - 0.60) / (0.78 - 0.60);
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    targetY = revY + ease * (kuiperY - revY);
    caption = 'KUIPER BELT // 500 AU TRANS-NEPTUNIAN FRONTIER & EXTREME TNO CLUSTERING';
  } else if (progress < 0.94) {
    const t = (progress - 0.78) / (0.94 - 0.78);
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    targetY = kuiperY + ease * (chalY - kuiperY);
    caption = 'THE CHALLENGE // PLANET X & SPHEREx LEVEL-2 BENCHMARK VERIFICATION';
  } else {
    targetY = chalY;
    caption = 'DOCKING READY // ENTERING SPHEREx SCIENTIST CONSOLE (AUTO-TRANSITION)';
  }

  if (lenis) {
    lenis.scrollTo(targetY, { immediate: true });
  } else {
    window.scrollTo(0, targetY);
  }
  if (tourCaption) tourCaption.textContent = caption;

  if (progress < 1) {
    tourAnimFrame = requestAnimationFrame(runTourLoop);
  } else {
    setTimeout(() => {
      stopCinematicTour();
      window.location.href = 'scientist.html?tour=true';
    }, 1000);
  }
}

async function toggleTourRecording() {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
    if (btnTourRecord) btnTourRecord.innerHTML = `<i data-lucide="video"></i><span>Record MP4</span>`;
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { frameRate: 60, displaySurface: 'browser' },
      audio: true
    });
    recordedChunks = [];
    const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm';
    mediaRecorder = new MediaRecorder(stream, { mimeType: mime });
    mediaRecorder.ondataavailable = e => { if (e.data.size > 0) recordedChunks.push(e.data); };
    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Prometheus_Cinematic_Tour_${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    };
    mediaRecorder.start();
    if (btnTourRecord) btnTourRecord.innerHTML = `<i data-lucide="square"></i><span>Stop Recording</span>`;
    if (!tourActive) startCinematicTour();
  } catch (err) {
    console.warn('Screen recording notice:', err);
    alert('Screen recording ready! Tip: You can also press [Win + Alt + R] anytime to record via Windows Game Bar.');
    if (!tourActive) startCinematicTour();
  }
  if (window.lucide) lucide.createIcons();
}

if (btnTour) btnTour.addEventListener('click', startCinematicTour);
if (btnTourRecord) btnTourRecord.addEventListener('click', toggleTourRecording);
if (btnTourPause) btnTourPause.addEventListener('click', toggleTourPause);
if (btnTourExit) btnTourExit.addEventListener('click', stopCinematicTour);

window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && tourActive) stopCinematicTour();
  if (e.code === 'Space' && tourActive) {
    e.preventDefault();
    toggleTourPause();
  }
});

if (window.location.search.includes('tour=true')) {
  window.addEventListener('load', () => {
    setTimeout(startCinematicTour, 1200);
  });
}

/* ── INIT ──────────────────────────────────────────────────── */
startPreloading();
if (window.lucide) lucide.createIcons();

})();
