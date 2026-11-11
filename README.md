# PROMETHEUS • NASA Space Apps Challenge 2026
## Complete Architectural & Technical Project Documentation
**Challenge:** Planet X and SPHEREx  
**Team:** Prometheus  
**Date:** November 2026  
**Repository State:** Production-Ready & Cleaned

---

## Table of Contents
1. [Executive Summary & Mission Overview](#1-executive-summary--mission-overview)
2. [High-Level System Architecture](#2-high-level-system-architecture)
3. [Module 1: Cinematic 3D Scrollytelling Landing Platform (`landing.html`)](#3-module-1-cinematic-3d-scrollytelling-landing-platform)
   - [3.1 The 240fps+ Sub-Frame Cross-Fade Canvas Engine](#31-the-240fps-sub-frame-cross-fade-canvas-engine)
   - [3.2 3D Rocket Assembly & Liftoff Preloader](#32-3d-rocket-assembly--liftoff-preloader)
   - [3.3 Glassmorphism & Visual Design System](#33-glassmorphism--visual-design-system)
   - [3.4 Scrollytelling Story Structure (Acts I–VII)](#34-scrollytelling-story-structure-acts-ivii)
   - [3.5 Thermal Scanner & Citizen Blink Mini-Game](#35-thermal-scanner--citizen-blink-mini-game)
4. [Module 2: Scientist Mode — Astrophysics Research Console (`index.html`)](#4-module-2-scientist-mode--astrophysics-research-console)
   - [4.1 Layout & Component Architecture](#41-layout--component-architecture)
   - [4.2 6 Multi-Epoch Comparison Engines](#42-6-multi-epoch-comparison-engines)
   - [4.3 102-Band Spectrophotometry & Chemical Ice Profiling](#43-102-band-spectrophotometry--chemical-ice-profiling)
   - [4.4 Astrometric Drift & Gaia DR3 Integration](#44-astrometric-drift--gaia-dr3-integration)
5. [Module 3: Citizen Explorer — Mode 2 Time-Lapse Suite (`comare.html`)](#5-module-3-citizen-explorer--mode-2-time-lapse-suite)
   - [5.1 Core Philosophy & Decoupled Architecture](#51-core-philosophy--decoupled-architecture)
   - [5.2 Interactive Comparison Tools](#52-interactive-comparison-tools)
   - [5.3 Everyday Analogies & Plain-English Storytelling](#53-everyday-analogies--plain-english-storytelling)
   - [5.4 Astropy Backend (`campare.py` & `spherex_engine.py`)](#54-astropy-backend)
6. [Mathematical & Astrophysical Formulations](#6-mathematical--astrophysical-formulations)
7. [Performance Engineering & Zero-Cost Optimization](#7-performance-engineering--zero-cost-optimization)
8. [Deployment, Git Repository & Execution Guide](#8-deployment-git-repository--execution-guide)

---

## 1. Executive Summary & Mission Overview

### 1.1 The NASA Challenge
NASA’s **SPHEREx** (*Spectro-Photometer for the History of the Universe, Epoch of Reionization and Ices Explorer*) mission surveys the entire sky every 6 months across 102 near-infrared bands (0.75 – 5.00 µm). A key frontier in modern planetary science and astrophysics is detecting anomalous orbital perturbations in outer Kuiper Belt Objects (TNOs), pointing toward the potential existence of **Planet X / Planet Nine** at 400–800 AU.

### 1.2 Team Prometheus Mission
Team Prometheus has designed a **unified, dual-experience web platform**:
1. **The Cinematic Landing Platform (`landing.html`):** An Awwwards-caliber, 3D scroll-scrubbed interactive narrative presenting the spacecraft, mission timeline, scientific background, and Clyde Tombaugh discovery lineage.
2. **Scientist Mode (`index.html`):** A professional 3-column astrophysics analysis dashboard designed for researchers to inspect multi-epoch FITS data, compute astrometric drift, analyze 102-band molecular ices, and cross-match Gaia DR3 catalog coordinates.
3. **Citizen Explorer (`comare.html`):** An intuitive, interactive multi-epoch comparison suite utilizing split-curtain reveals, blink comparators, difference imaging, and everyday analogies for science enthusiasts, students, and educators.

---

## 2. High-Level System Architecture

The codebase adheres strictly to a **zero-build, zero-runtime-cost vanilla stack** (Pure HTML5, CSS3, ES6 JavaScript, Web Audio API, Canvas 2D Context, and optional Python/Astropy/Flask micro-backend).

```
nasa/
│
├── 🚀 1. CINEMATIC 3D LANDING PLATFORM
│   ├── landing.html                   # Master entry scrollytelling interface
│   ├── landing.css                    # Obsidian glassmorphism (#030508), Syne typography, 3D cards
│   ├── landing.js                     # 240fps canvas blend engine, rocket preloader, Web Audio drone
│   ├── frames_loader/                 # 240 remastered 720p frames: 3D Rocket Assembly & Blastoff
│   └── frames_v2/                     # 120 remastered 720p frames: Deep Space SPHEREx Descent
│
├── 🔬 2. SCIENTIST MODE (Astrophysics Research Console)
│   ├── index.html                     # 3-column professional research workspace
│   ├── styles.css                     # Dark observatory telemetry stylesheet
│   ├── app.js                         # FITS canvas renderer, 102-channel SED, Gaia DR3 cross-match
│   ├── data/                          # Multi-epoch FITS datasets & target JSON tables
│   ├── convert_fits.py                # Astropy FITS processing utility
│   └── SPHEREx_Discovery_Engine_Guide.pdf # Official research documentation
│
├── 🌍 3. CITIZEN EXPLORER (Time-Lapse Observation & Comparison Suite)
│   ├── comare.html                    # Mode 2 Citizen Explorer interface
│   ├── compare.css                    # Split curtain, blink comparator, and glassmorphic styles
│   ├── campare.py                     # Flask REST API backend
│   └── spherex_engine.py              # Astropy calculation engine
│
├── 📁 ASSETS & SCIENTIFIC IMAGERY
│   ├── tombaugh_1930.jpg              # Clyde Tombaugh 1930 Pluto discovery photographic plate
│   ├── spherex_infrared.jpg           # 102-band infrared focal plane array visualization
│   ├── planet_x_kuiper.jpg            # Kuiper Belt 500 AU simulated field
│   ├── spherex_spacecraft.png         # High-resolution SPHEREx spacecraft render
│   ├── sky_epoch1.png                 # Survey Epoch 1 reference sky
│   ├── sky_epoch2.png                 # Survey Epoch 2 comparison sky
│   └── sky_diff.png                   # Subtracted difference heatmap
│
├── 📁 _archive/                       # 29 isolated temporary/scratch files (models, raw videos)
└── 📄 README.md                       # Comprehensive GitHub repository guide
```

---

## 3. Module 1: Cinematic 3D Scrollytelling Landing Platform

### 3.1 The 240fps+ Sub-Frame Cross-Fade Canvas Engine
Unlike choppy 24fps video playback or heavy 50MB WebGL 3D models that stutter on mobile devices, Team Prometheus engineered a **custom canvas sub-frame blending engine** (`D:\nasa\landing.js`).

#### Mathematical Principle
For any scroll position $y \in [0, y_{\text{max}}]$, a virtual continuous frame index $f_{\text{target}} \in [0, N-1]$ is calculated:
$$f_{\text{target}} = \frac{y}{y_{\text{trigger}}} \times (N - 1)$$
To achieve liquid motion matching 120Hz/240Hz gaming monitors, momentum lerping is applied in each `requestAnimationFrame` tick:
$$f_{\text{display}}(t) = f_{\text{display}}(t-1) + \left(f_{\text{target}} - f_{\text{display}}(t-1)\right) \times \lambda$$
where $\lambda = 0.085$ is the inertia dampening factor.

#### Dual-Frame Sub-Pixel Alpha Blending
To eliminate stepping between integer frames, the engine decomposes $f_{\text{display}}$ into integer floor and fractional sub-frame:
$$f_{\text{base}} = \lfloor f_{\text{display}} \rfloor, \quad f_{\text{next}} = \min(f_{\text{base}} + 1, N - 1), \quad \alpha = f_{\text{display}} - f_{\text{base}}$$
1. `ctx.globalAlpha = 1.0;` &rarr; draws `frames[base]` scaled via `Math.max(W/iw, H/ih)` (Aspect-Ratio Cover).
2. `ctx.globalAlpha = alpha;` &rarr; draws `frames[next]` over the base frame.

This produces seamless, jitter-free 240fps optical cross-fading.

---

### 3.2 3D Rocket Assembly & Liftoff Preloader
Replacing boring 2D progress bars, a full-screen high-DPI `<canvas id="loader-canvas">` plays a 240-frame sequence extracted from `gemini_generated_video_27d5536b.mp4`:
- **0.0s – 4.1s (Assembly Phase):** The rocket expands in a 3D exploded schematic diagram, displaying labels (*Payload Fairing, Cryogenic Third Stage, Grid Fins, Thrust Vectoring Engines*). A cosine ease (`0.5 - 0.5 * Math.cos(subT * Math.PI)`) ensures students and researchers have time to read the telemetry labels.
- **4.1s – 5.5s (Reassembly Phase):** Stages snap back together and locks engage (`REASSEMBLY & FUELING COMPLETE`).
- **5.5s – 6.8s (FAST Blastoff Phase):** Main boosters ignite (`lerpRate = 0.24`), producing roaring smoke and fire plumes.
- **Fail-Safe Exit:** Once `loaderDisplayFrame >= 230` or duration completes, `finishPreloader()` triggers a lens flare flash, garbage-collects all 240 loader frame bitmaps from memory (`loaderFrames = null`), and activates the Hero Section.
- **Liftoff Audio Synthesis:** A Web Audio API synthetic sub-bass saw oscillator (54Hz &rarr; 26Hz) and filtered noise buffer create an authentic thruster rumble.

---

### 3.3 Glassmorphism & Visual Design System
- **Background:** Deep space obsidian `#030508` (calibrated to match video black levels).
- **Typography:** Display headings set in **Syne (800/900)** with metallic specular gradients; telemetry and code set in **JetBrains Mono**.
- **Rocket Quick-Nav Popup Banner:** A 4-color liquid smoke glassmorphic banner trailing behind the rocket:
  - Green (`#00ff88`)
  - Red (`#ff2a2a`)
  - Yellow (`#ffd000`)
  - Blue (`#007aff`)
- **3D Card Tilt:** Interactive mouse-move perspective tilt (`perspective(1400px) rotateX(...) rotateY(...) translateZ(16px)`).

---

### 3.4 Scrollytelling Story Structure (Acts I–VII)
- **Act I: Deep Space Descent:** Telemetry HUD initializes (Altitude: 384,400 KM down to 700 KM, Velocity: 11.2 KM/S).
- **Act II: The SPHEREx Payload:** Detailed breakdown of the 6 Linear Variable Filters covering 0.75 – 5.00 µm.
- **Act III: Terminal Ground Truth:** The descent transitions into an astronaut viewing an active research workstation in low-Earth orbit.
- **Act IV: The Clyde Tombaugh Legacy (ITom Reveal Scanner):** A real-time interactive thermal scanner allowing users to brush over the 1930 Clyde Tombaugh photographic glass plate to reveal the 2026 SPHEREx 102-band infrared thermal view.
- **Act V: The Hunt for Planet X:** Kuiper Belt perturbation physics, extreme eccentricities ($e \approx 0.7$), and 500 AU orbital mechanics.
- **Act VI: Dual-Mode Experience Selector:** Direct gateways into **Scientist Mode** (`index.html`) and **Citizen Explorer** (`comare.html`).
- **Act VII: Challenge & Specifications:** NASA Space Apps challenge rubric, technology architecture, and team credentials.

---

## 4. Module 2: Scientist Mode — Astrophysics Research Console (`index.html`)

Designed for professional researchers and astronomers, Scientist Mode delivers a full 3-column analysis environment.

### 4.1 Layout & Component Architecture
- **Left Column (Observation & Target Manager):** Target catalog (L1527, Barnard's Star, Betelgeuse, TRAPPIST-1, IRAS 08572), multi-epoch FITS selector (Epochs 1, 2, 3, 4), and search resolver.
- **Center Column (Multi-Epoch FITS Canvas):** Dual synchronized 2D viewports with crosshairs, sub-pixel centroid reticles, 6.2"/pixel scale bars, and coordinates in equatorial (RA/Dec), ecliptic, and galactic frames.
- **Right Column (Astrometric & Spectral Inspector):** Real-time mathematical outputs, 102-band SED molecular chart, and Gaia DR3 astrometry.

### 4.2 6 Multi-Epoch Comparison Engines
1. **Side-by-Side Dual Reticle:** Synchronized crosshairs inspecting centroid drift between any two survey passes.
2. **Interactive Split-Curtain Slider:** Dynamic division reveals subtle morphological variations.
3. **Clyde Tombaugh Blink Comparator:** Flashing between epochs at 1–5 Hz to spot proper motion and variable stars.
4. **Subtracted Difference Imaging ($I_{\text{diff}} = I_B - I_A$):** Residual heatmaps showing positive flux excess (red) and deficit (cyan).
5. **Iso-Flux Contour Mapping:** Multi-level contour extraction delineating circumstellar disk structure.
6. **3D Radial Surface Mesh:** 3D topographic projection of photon flux distribution.

### 4.3 102-Band Spectrophotometry & Chemical Ice Profiling
SPHEREx measures 102 discrete spectrophotometric channels. The platform computes continuous spectral energy distributions (SED) and isolates critical interstellar ice absorption features:
- **Water Ice ($H_2O$):** Deep absorption dip centered at **3.05 µm**.
- **Methanol Ice ($CH_3OH$):** Diagnostic band at **3.53 µm**.
- **Carbon Dioxide Ice ($CO_2$):** Strong doublet at **4.27 µm**.
- **Cyanate Radical ($OCN^-$):** Interstellar marker at **4.62 µm**.
- **Carbon Monoxide Ice ($CO$):** Volatile ice peak at **4.67 µm**.

---

## 5. Module 3: Citizen Explorer — Mode 2 Time-Lapse Suite (`comare.html`)

Citizen Explorer delivers the exact, authentic repository code (`diwakarsingh07/Team.Prometheus-NASA-SPACE-APP-CHALLENGE/tree/main/Mode 2`) directly in a dedicated page, completely decoupled from `landing.html` to prevent any browser scroll stutter.

### 5.1 Everyday Analogies & Plain-English Storytelling
Complex astrophysical parameters are converted into intuitive concepts:
- **Astrometry / Proper Motion:** *"The Train Window Effect — nearby stars rush past like trees near a moving train, while distant stars remain stationary."*
- **Photometry / Flux Delta:** *"The Bedroom Dimmer Switch — turning the knob slightly up (+%) or down (-%)."*
- **Reduced Chi-Square ($\chi^2_{\text{red}}$):** *"The Heart Rate Monitor — a score of 1.0 means calm normal breathing; a score over 4.0 means the star coughed or erupted with a solar flare!"*
- **Spectrophotometry:** *"The Cosmic Chemical Barcode — scanning a candy barcode at a grocery store, but for water ice and frozen carbon dioxide in space."*

---

## 6. Mathematical & Astrophysical Formulations

### 6.1 Astrometric Proper Motion & Angular Separation
For coordinates $(\alpha_1, \delta_1)$ at Epoch A and $(\alpha_2, \delta_2)$ at Epoch B:
$$\Delta\alpha \cos\delta = (\alpha_2 - \alpha_1) \cos\left(\frac{\delta_1 + \delta_2}{2}\right)$$
$$\Delta\delta = \delta_2 - \delta_1$$
Total angular separation $\rho$ in arcseconds:
$$\rho = \sqrt{(\Delta\alpha \cos\delta)^2 + (\Delta\delta)^2}$$
Position Angle $\theta$:
$$\theta = \text{atan2}(\Delta\alpha \cos\delta, \Delta\delta) \pmod{360^\circ}$$

### 6.2 Reduced Chi-Square Continuum Test ($\chi^2_{\text{red}}$)
To evaluate whether a celestial object experienced genuine astrophysical variation across 102 spectral channels:
$$\chi^2_{\text{red}} = \frac{1}{N - 1} \sum_{i=1}^{102} \frac{\left(F_{B,i} - F_{A,i}\right)^2}{\sigma_{A,i}^2 + \sigma_{B,i}^2}$$
- $\chi^2_{\text{red}} \le 1.2$: Quiescent / Stable target.
- $1.2 < \chi^2_{\text{red}} \le 3.5$: Moderate photometric or ice variation.
- $\chi^2_{\text{red}} > 3.5$: Severe astrophysical outburst (stellar flare, accretion pulse, or pulsation).

---

## 7. Performance Engineering & Zero-Cost Optimization

| Challenge | Root Cause | Engineering Solution |
|---|---|---|
| **Canvas Garbage Collection Churn** | Creating `document.createElement('canvas')` inside mouse-move loops | Pre-allocated static reusable offscreen buffer (`tempC`); throttled pixel analysis to 160ms. |
| **Preloader Memory Consumption** | 240 high-resolution JPEG frames held in RAM | `loaderFrames = null;` called on preloader exit, freeing ~400MB of browser bitmap cache. |
| **Page Scroll Stutter** | Storing complex comparison suites directly inside `landing.html` DOM | Decoupled architecture: `landing.html` routes to `comare.html` on a separate page. |
| **High-DPI Retina Blur** | Default 1:1 canvas pixel mapping | Clamped Device Pixel Ratio (`Math.min(window.devicePixelRatio, 2)`), scaling canvas dimensions and setting transform matrices. |

---

## 8. Deployment, Git Repository & Execution Guide

### 8.1 Running Locally with Zero Dependencies
```bash
# In directory D:\nasa
python -m http.server 8000
```
- **Landing Website:** `http://localhost:8000/landing.html`
- **Scientist Mode:** `http://localhost:8000/index.html`
- **Citizen Explorer:** `http://localhost:8000/comare.html`

### 8.2 Running the Astropy / Flask Backend
```bash
pip install flask flask-cors astropy numpy pillow
python campare.py
```
Serves the API at `http://127.0.0.1:5000/`.

---
*Created by Team Prometheus for the NASA Space Apps Challenge 2026.*
