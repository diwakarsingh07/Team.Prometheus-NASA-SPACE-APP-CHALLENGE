/* ============================================================
   TEAM PROMETHEUS — CINEMATIC LANDING ENGINE
   240fps+ sub-frame cross-fade · GSAP ScrollTrigger
   Custom cursor · Reveal engine · Layman modal
   ============================================================ */
(() => {
'use strict';

/* ── CONFIG ────────────────────────────────────────────────── */
const TOTAL_FRAMES = 120;
const FRAME_PATH = i => `frames_v2/frame_${String(i).padStart(3,'0')}.jpg`;
const LERP_FACTOR = 0.085;          // momentum smoothing
const BG = '#030508';

/* ── DOM REFS ──────────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const preloader   = $('preloader');
const preFill     = $('pre-fill');
const prePct      = $('pre-pct');
const loaderCanvas = $('loader-canvas');
const loaderCtx   = loaderCanvas ? loaderCanvas.getContext('2d') : null;
const preStageChip = $('pre-stage-chip');
const preStageText = $('pre-stage-text');
const preHint     = $('pre-hint');
const preSkipBtn  = $('pre-skip');
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

/* ── STATE ─────────────────────────────────────────────────── */
let frames = [];
let loaded = 0;
let ready = false;
let scrollY = 0;
let currentFrame = 0;     // float for sub-frame blending
let displayFrame = 0;     // lerped value
let audioCtx = null;
let audioOn = false;
let droneNode = null;

/* ── 3D ROCKET ASSEMBLY & LAUNCH PRELOADER ENGINE (240fps) ──── */
const LOADER_TOTAL_FRAMES = 240;
const LOADER_FRAME_PATH = i => `frames_loader/frame_${String(i).padStart(3, '0')}.jpg`;
let loaderFrames = [];
let loaderDisplayFrame = 0;
let loaderTargetFrame = 0;
let loaderProgress = 0;
let loaderFinished = false;
let preloaderExited = false;
let loaderRafId = null;
let loaderStartTime = null;
const LOADER_TOTAL_DURATION = 6800; // ms: total cinematic curve (slow assembly + fast blastoff)

function getCinematicRocketProgress(elapsed) {
  const t = Math.min(Math.max(elapsed / LOADER_TOTAL_DURATION, 0), 1);
  // Multi-stage cinematic curve:
  // Phase 1 (0 -> 0.60): Slow & majestic 3D exploded schematic exploration (0% to 68%)
  // Phase 2 (0.60 -> 0.80): Reassembly & fueling locks (68% to 85%)
  // Phase 3 (0.80 -> 1.00): FAST explosive liftoff & blastoff (85% to 100%!)
  if (t < 0.60) {
    const subT = t / 0.60;
    const ease = 0.5 - 0.5 * Math.cos(subT * Math.PI);
    return ease * 0.68;
  } else if (t < 0.80) {
    const subT = (t - 0.60) / 0.20;
    return 0.68 + subT * 0.17;
  } else {
    // FAST blastoff launch acceleration
    const subT = (t - 0.80) / 0.20;
    const accel = Math.pow(subT, 1.8);
    return 0.85 + accel * 0.15;
  }
}

function sizeLoaderCanvas() {
  if (!loaderCanvas || !loaderCtx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  loaderCanvas.width = window.innerWidth * dpr;
  loaderCanvas.height = window.innerHeight * dpr;
  loaderCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawLoaderFrame(img, alpha) {
  if (!loaderCtx || !img) return;
  const cw = window.innerWidth;
  const ch = window.innerHeight;
  const iw = img.naturalWidth || 1280;
  const ih = img.naturalHeight || 720;
  const scale = Math.max(cw / iw, ch / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (cw - dw) * 0.5;
  const dy = (ch - dh) * 0.5;

  loaderCtx.globalAlpha = Math.max(0, Math.min(1, alpha));
  loaderCtx.drawImage(img, dx, dy, dw, dh);
}

function playLiftoffRumble() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) audioCtx = new AudioContextClass();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const t = audioCtx.currentTime;
    // Low sub-bass oscillation (50Hz down to 28Hz)
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(54, t);
    osc.frequency.exponentialRampToValueAtTime(26, t + 1.2);

    // Noise buffer for exhaust plume roar
    const bufSize = Math.floor(audioCtx.sampleRate * 1.4);
    const noiseBuf = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.4;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = noiseBuf;

    const bqf = audioCtx.createBiquadFilter();
    bqf.type = 'lowpass';
    bqf.frequency.setValueAtTime(260, t);
    bqf.frequency.linearRampToValueAtTime(700, t + 0.7);

    const noiseG = audioCtx.createGain();
    noiseG.gain.setValueAtTime(0.08, t);
    noiseG.gain.exponentialRampToValueAtTime(0.001, t + 1.3);

    g.gain.setValueAtTime(0.12, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 1.4);

    osc.connect(g);
    g.connect(audioCtx.destination);
    noise.connect(bqf);
    bqf.connect(noiseG);
    noiseG.connect(audioCtx.destination);

    osc.start(t);
    noise.start(t);
    osc.stop(t + 1.4);
    noise.stop(t + 1.4);
  } catch(e) {
    // Graceful silence if browser blocks autoplay audio
  }
}

function finishPreloader() {
  if (preloaderExited) return;
  preloaderExited = true;
  loaderFinished = true;
  ready = true; // Guarantee main canvas sequence activates immediately

  if (loaderRafId) {
    cancelAnimationFrame(loaderRafId);
    loaderRafId = null;
  }

  playLiftoffRumble();

  // Force first frame of deep space story so hero is instantly visible
  try {
    if (typeof drawFrame === 'function') drawFrame(0);
  } catch(e) {}

  if (preloader) {
    preloader.style.transformOrigin = 'center 85%';
    gsap.to(preloader, {
      opacity: 0,
      scale: 1.08,
      filter: 'brightness(1.8) blur(8px)',
      duration: 0.65,
      ease: 'power3.inOut',
      onComplete: () => {
        preloader.classList.add('done');
        preloader.style.display = 'none'; // Guarantee preloader is fully gone
        loaderFrames = null; // Release 240 loader frame bitmaps to free memory
        if (nav) nav.classList.add('visible');
        if (hud) hud.classList.add('visible');
        initGSAP();
        if (window.ScrollTrigger) ScrollTrigger.refresh();
      }
    });
  } else {
    initGSAP();
  }
}

function renderLoader(timestamp) {
  if (preloaderExited) return;

  if (!loaderStartTime) loaderStartTime = timestamp;
  const elapsed = timestamp - loaderStartTime;

  const realRatio = TOTAL_FRAMES > 0 ? (loaded / TOTAL_FRAMES) : 1;
  const targetRatio = getCinematicRocketProgress(elapsed);

  loaderProgress = targetRatio;

  const pct = Math.round(loaderProgress * 100);
  if (preFill) preFill.style.width = pct + '%';
  if (prePct) prePct.textContent = pct;

  // Dynamic Telemetry Status
  if (pct < 25) {
    if (preStageChip) preStageChip.textContent = 'ASSEMBLING';
    if (preStageText) preStageText.textContent = 'STAGE 1: SYSTEM INITIATING & SCHEMATIC EXPANSION';
    if (preHint) preHint.textContent = `DOWNLOADING DEEP SPACE TELEMETRY • ${loaded}/${TOTAL_FRAMES} MISSION FRAMES`;
  } else if (pct < 65) {
    if (preStageChip) preStageChip.textContent = 'CO-ALIGNING';
    if (preStageText) preStageText.textContent = 'STAGE 2: 3D EXPLODED SCHEMATIC • CO-ALIGNMENT NOMINAL';
    if (preHint) preHint.textContent = 'ANALYZING CRYOGENIC LOX/RP-1 CORE STAGE RATIOS';
  } else if (pct < 88) {
    if (preStageChip) preStageChip.textContent = 'FUELED';
    if (preStageText) preStageText.textContent = 'STAGE 3: REASSEMBLY COMPLETE • CRYOGENIC FUELING 100%';
    if (preHint) preHint.textContent = 'PAYLOAD FAIRING SEALED • SPHEREx IR POLAR MOUNT READY';
  } else if (pct < 99) {
    if (preStageChip) preStageChip.textContent = 'IGNITION';
    if (preStageText) preStageText.textContent = 'STAGE 4: TERMINAL COUNTDOWN • MAIN ENGINES ARMED';
    if (preHint) preHint.textContent = 'PRESSURE NOMINAL • ALL SYSTEMS GO FOR LEO INSERTION';
  } else {
    if (preStageChip) {
      preStageChip.textContent = 'LIFTOFF!';
      preStageChip.className = 'chip-v chip-cyan';
    }
    if (preStageText) preStageText.textContent = 'STAGE 5: T-0 LIFTOFF • SPHEREx MISSION LAUNCH SUCCESSFUL';
    if (preHint) preHint.textContent = 'MISSION CLEARANCE CONFIRMED • ENTERING PROMETHEUS ORBIT';
  }

  // 240fps sub-frame lerp: slow & graceful during assembly, fast & punchy during liftoff!
  loaderTargetFrame = loaderProgress * (LOADER_TOTAL_FRAMES - 1);
  const lerpRate = loaderDisplayFrame < 185 ? 0.085 : 0.24;
  loaderDisplayFrame += (loaderTargetFrame - loaderDisplayFrame) * lerpRate;

  if (loaderCanvas && loaderCtx && loaderFrames && loaderFrames.length > 0) {
    const cw = window.innerWidth;
    const ch = window.innerHeight;
    loaderCtx.clearRect(0, 0, cw, ch);

    const baseIdx = Math.floor(loaderDisplayFrame);
    const nextIdx = Math.min(baseIdx + 1, LOADER_TOTAL_FRAMES - 1);
    const subAlpha = loaderDisplayFrame - baseIdx;

    let imgA = loaderFrames[baseIdx];
    let imgB = loaderFrames[nextIdx];

    if (imgA && imgA.complete && imgA.naturalWidth) {
      drawLoaderFrame(imgA, 1.0);
      if (subAlpha > 0.01 && imgB && imgB.complete && imgB.naturalWidth) {
        drawLoaderFrame(imgB, subAlpha);
      }
    }

    // Micro camera shake during blastoff (frames 205+)
    if (loaderDisplayFrame > 205) {
      const shakeAmt = ((loaderDisplayFrame - 205) / 35) * 4.5;
      const sx = (Math.random() - 0.5) * shakeAmt;
      const sy = (Math.random() - 0.5) * shakeAmt;
      loaderCanvas.style.transform = `translate(${sx}px, ${sy}px) scale(1.01)`;
    }
  }

  // Trigger launch into website as soon as the rocket ascends (Frame 230+) or time completes
  if (loaderDisplayFrame >= 230 || elapsed >= LOADER_TOTAL_DURATION) {
    finishPreloader();
    return;
  }

  loaderRafId = requestAnimationFrame(renderLoader);
}

function startPreloading() {
  sizeLoaderCanvas();
  // Preload 240 rocket loader frames
  for (let i = 1; i <= LOADER_TOTAL_FRAMES; i++) {
    const img = new Image();
    img.src = LOADER_FRAME_PATH(i);
    loaderFrames[i - 1] = img;
  }

  // Start 240fps RAF loop immediately
  loaderRafId = requestAnimationFrame(renderLoader);

  // Preload main deep space story frames
  preloadStoryFrames();
}

function preloadStoryFrames() {
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = new Image();
    img.src = FRAME_PATH(i);
    img.onload = img.onerror = () => {
      loaded++;
      if (loaded >= TOTAL_FRAMES) {
        ready = true;
      }
    };
    frames[i - 1] = img;
  }
}

/* ── SKIP / ESC HANDLERS ────────────────────────────────────── */
if (preSkipBtn) {
  preSkipBtn.addEventListener('click', () => {
    finishPreloader();
  });
}
window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !preloaderExited) {
    finishPreloader();
  }
});

/* ── CANVAS SIZING ─────────────────────────────────────────── */
function sizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  sizeLoaderCanvas();
}
window.addEventListener('resize', sizeCanvas);
sizeCanvas();

/* ── DRAW ENGINE — Sub-frame cross-fade blending ───────────── */
function drawFrame(floatIdx) {
  if (!frames.length) return;
  const lo = Math.floor(floatIdx);
  const hi = Math.min(lo + 1, TOTAL_FRAMES - 1);
  const t = floatIdx - lo;

  const W = window.innerWidth;
  const H = window.innerHeight;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  const imgA = frames[lo];
  const imgB = frames[hi];
  if (!imgA || !imgA.complete) return;

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

  // Cross-fade next frame for sub-frame smoothness
  if (t > 0.001 && imgB && imgB.complete) {
    ctx.globalAlpha = t;
    ctx.drawImage(imgB, dx, dy, dw, dh);
    ctx.globalAlpha = 1;
  }
}

/* ── SCROLL → FRAME MAPPING ────────────────────────────────── */
function getScrollProgress() {
  const doc = document.documentElement;
  const scrollTop = window.pageYOffset || doc.scrollTop;
  const scrollHeight = doc.scrollHeight - doc.clientHeight;
  return scrollHeight > 0 ? Math.min(1, Math.max(0, scrollTop / scrollHeight)) : 0;
}

function getSequenceProgress() {
  const terminalEl = $('act-terminal');
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  if (!terminalEl) return getScrollProgress();
  // Sequence reaches last frame (laptop open) when Act 3 Terminal is fully centered
  const terminalTrigger = terminalEl.offsetTop + terminalEl.offsetHeight * 0.5 - window.innerHeight * 0.5;
  return terminalTrigger > 0 ? Math.min(1, Math.max(0, scrollTop / terminalTrigger)) : 0;
}

/* ── ANIMATION LOOP ────────────────────────────────────────── */
function tick() {
  if (ready) {
    const seqProgress = getSequenceProgress();
    const pageProgress = getScrollProgress();
    currentFrame = seqProgress * (TOTAL_FRAMES - 1);
    // Momentum lerp for butter-smooth feel (240fps interpolation)
    displayFrame += (currentFrame - displayFrame) * LERP_FACTOR;
    drawFrame(displayFrame);
    updateHUD(pageProgress);
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
        target.scrollIntoView({ behavior: 'smooth' });
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
  cur.style.left = cx + 'px';
  cur.style.top = cy + 'px';
  curRing.style.left = rx + 'px';
  curRing.style.top = ry + 'px';
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

/* ── DUST PARTICLES ────────────────────────────────────────── */
(function initDust() {
  const dc = document.createElement('canvas');
  dc.id = 'dust-canvas';
  document.body.appendChild(dc);
  const dctx = dc.getContext('2d');
  let particles = [];
  const COUNT = 60;

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

  function dustTick() {
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
    // Touch support
    revealStage.addEventListener('touchmove', e => {
      e.preventDefault();
      const t = e.touches[0];
      if (mode === 'brush') paint(t.clientX, t.clientY);
      if (mode === 'split') {
        const rect = revealStage.getBoundingClientRect();
        splitX = Math.max(0, Math.min(1, (t.clientX - rect.left) / rect.width));
        drawReveal();
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
      target.scrollIntoView({ behavior: 'smooth' });
      playTick();
    }
  });
});

/* ── INIT ──────────────────────────────────────────────────── */
startPreloading();
lucide.createIcons();

})();
