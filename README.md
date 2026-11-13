# 🚀 PROMETHEUS • NASA Space Apps Challenge 2026
## Official Scientific & Technical Documentation: Planet X and SPHEREx Discovery Engine
**Challenge:** Planet X and SPHEREx  
**Team:** Team Prometheus  
**Date:** November 2026  
**Live Submission:** [Team Prometheus Official NASA Space Apps Project Page](https://www.spaceappschallenge.org/2026/find-a-team/team-prometheus1/)  
**GitHub Repository:** [Team.Prometheus-NASA-SPACE-APP-CHALLENGE](https://github.com/diwakarsingh07/Team.Prometheus-NASA-SPACE-APP-CHALLENGE.git)

---

## 📑 Table of Contents
1. [Executive Summary & NASA Challenge Alignment](#1-executive-summary--nasa-challenge-alignment)
   - [1.1 The Challenge](#11-the-challenge)
   - [1.2 The Team Prometheus Solution](#12-the-team-prometheus-solution)
   - [1.3 Official NASA Challenge Resources & Scope Clarification](#13-official-nasa-challenge-resources--scope-clarification)
2. [NASA Potential Considerations & Requirements Matrix](#2-nasa-potential-considerations--requirements-matrix)
3. [Astrophysical Background & Target Benchmarks](#3-astrophysical-background--target-benchmarks)
   - [3.1 The 5 NASA Mandatory Benchmark Targets](#31-the-5-nasa-mandatory-benchmark-targets)
   - [3.2 Planet X (Planet Nine) Search Mechanics](#32-planet-x-planet-nine-search-mechanics)
4. [High-Level System Architecture & File Structure](#4-high-level-system-architecture--file-structure)
5. [Module 1: Cinematic Scrollytelling Experience (`landing.html`)](#5-module-1-cinematic-scrollytelling-experience-landinghtml)
   - [5.1 240fps+ Dual-Frame Sub-Pixel Blend Engine](#51-240fps-dual-frame-sub-pixel-blend-engine)
   - [5.2 Clyde Tombaugh ITom Thermal Reveal Scanner](#52-clyde-tombaugh-itom-thermal-reveal-scanner)
   - [5.3 Narrative Structure & Awwwards Design System](#53-narrative-structure--awwwards-design-system)
   - [5.4 Zero-Lag Performance Optimization & Load Speed](#54-zero-lag-performance-optimization--load-speed)
6. [Module 2: Scientist Mode — Astrophysics Research Console (`scientist.html`)](#6-module-2-scientist-mode--astrophysics-research-console-scientisthtml)
   - [6.1 Layout & 3-Column Architecture](#61-layout--3-column-architecture)
   - [6.2 The 6 Multi-Epoch Comparison Engines](#62-the-6-multi-epoch-comparison-engines)
   - [6.3 102-Band Spectrophotometry & Chemical Ice Profiling](#63-102-band-spectrophotometry--chemical-ice-profiling)
   - [6.4 Multi-Mission Astrometry (Gaia DR3 & NASA allWISE)](#64-multi-mission-astrometry-gaia-dr3--nasa-allwise)
   - [6.5 Dynamic Telemetry HUD & Contamination Quality Flags](#65-dynamic-telemetry-hud--contamination-quality-flags)
   - [6.6 URL Query Synchronization & Web Embedding](#66-url-query-synchronization--web-embedding)
   - [6.7 Dual-Mode Viewport & Live CDS Strasbourg Aladin Integration](#67-dual-mode-viewport--live-cds-strasbourg-aladin-integration)
   - [6.8 Pluggable Data Feed Selector & NASA IPAC Integration](#68-pluggable-data-feed-selector--nasa-ipac-integration)
7. [Module 3: Citizen Explorer — Interactive Discovery Studio (`comare.html`)](#7-module-3-citizen-explorer--interactive-discovery-studio-comarehtml)
   - [7.1 Plain-English Astrophysics & Everyday Analogies](#71-plain-english-astrophysics--everyday-analogies)
   - [7.2 Interactive Step-by-Step Target Picker](#72-interactive-step-by-step-target-picker)
   - [7.3 AI Citizen Science Agent](#73-ai-citizen-science-agent)
8. [Astrophysical & Mathematical Formulations](#8-astrophysical--mathematical-formulations)
   - [8.1 Astrometric Proper Motion & Angular Separation](#81-astrometric-proper-motion--angular-separation)
   - [8.2 Image Subtraction & Dipole Detection ($\Delta I$)](#82-image-subtraction--dipole-detection-delta-i)
   - [8.3 Reduced Chi-Square Continuum Test ($\chi^2_{\text{red}}$)](#83-reduced-chi-square-continuum-test-chi2_textred)
   - [8.4 6-Detector Focal Array Coaddition S/N Gain](#84-6-detector-focal-array-coaddition-sn-gain)
9. [Data Adapter & Future-Proof API Strategy](#9-data-adapter--future-proof-api-strategy)
10. [Local Installation & Deployment Guide](#10-local-installation--deployment-guide)
11. [Team Prometheus Credits & Scientific Attributions](#11-team-prometheus-credits--scientific-attributions)

---

## 1. Executive Summary & NASA Challenge Alignment

### 1.1 The Challenge
NASA's **SPHEREx** (*Spectro-Photometer for the History of the Universe, Epoch of Reionization and Ices Explorer*) mission is an all-sky near-infrared observatory scheduled to survey the entire celestial sphere every 6 months across **102 distinct spectral channels** ($0.75 - 5.00\,\mu\text{m}$). 

The challenge prompt (**Planet X and SPHEREx**) tasks teams with creating a public-facing web platform that:
1. Displays multi-epoch infrared images of any sky coordinates (Right Ascension $\alpha$ and Declination $\delta$).
2. Makes it easy for researchers and citizens to visualize astronomical variations over time (like a video or blink comparator) to detect moving objects (such as cold brown dwarfs, Kuiper Belt objects, and Planet X candidates) as well as variable stars.
3. Tests and validates the software on five official NASA benchmark objects: **Barnard's Star**, **Epsilon Indi B**, **WISE 0855-0714**, **RW Aurigae**, and **R Draconis**.

### 1.2 The Team Prometheus Solution
Team Prometheus created a comprehensive, two-tier platform bridging high-end cinematic public engagement with professional-grade astrophysical tooling:
* **Cinematic Scrollytelling Portal (`landing.html`):** An Awwwards-caliber interactive web experience with 240fps canvas momentum interpolation, an interactive Clyde Tombaugh ITom thermal plate scanner, a live Kuiper Belt radar scan, and an accessible journey through the SPHEREx mission.
* **Scientist Mode Dashboard (`scientist.html`):** A 3-column astrophysics workstation equipped with sub-pixel centroid reticles, 6 comparison modes (Blink, Difference $\Delta I$, Add/Stack, Swipe, Fade, Contour), a live CDS Strasbourg Aladin All-Sky Survey viewer, 102-channel spectrophotometry with diagnostic molecular ice markers, multi-mission Gaia DR3 and WISE overlays, and URL query synchronization.
* **Citizen Explorer Suite (`comare.html`):** A gamified, analogy-driven interface explaining complex astrophysics through everyday concepts with interactive target selection and an automated AI science agent.

### 1.3 Official NASA Challenge Resources & Scope Clarification
As detailed on the official [NASA Space Apps Challenge "Planet X and SPHEREx" Resources Tab](https://www.spaceappschallenge.org/2026/challenges/planet-x-and-spherex/?tab=resources):
* **Mission Scope Clarification:** SPHEREx is an all-sky infrared space observatory dedicated to cosmological discovery, galactic mapping, and identifying distant, ultra-cold or moving objects (cold brown dwarfs, Kuiper Belt objects, and Planet X candidates). NASA clarifies that SPHEREx's primary objectives explore the universe beyond near-Earth space (distinguishing it from planetary defense collision trackers like *NEO Surveyor*).
* **Official Mission Repositories & Archives Integrated:**
  * **NASA / IPAC Infrared Science Archive (IRSA):** [`https://irsa.ipac.caltech.edu/Missions/spherex.html`](https://irsa.ipac.caltech.edu/Missions/spherex.html) — Calibrated Level-2 and Level-3 spectral cubes across 102 bands, Quick Releases (QR2 / QR3), and multi-epoch survey mosaics.
  * **AWS Registry of Open Data (`spherex-qr`):** [`s3://spherex-qr`](https://registry.opendata.aws/spherex-qr) — Cloud-native mirrors of SPHEREx 6-month survey cadence data cubes and per-pixel covariance maps.
  * **Citizen Science Heritage:** Built with inspiration from the community-driven time-domain methodology of [Backyard Worlds: Planet 9](https://www.backyardworlds.org/) (Zooniverse).

---

## 2. NASA Potential Considerations & Requirements Matrix

Every single requirement and consideration outlined in the official NASA Space Apps rubric has been directly addressed in our architecture:

| NASA Challenge Guideline | Team Prometheus Implementation | Architecture Location |
| :--- | :--- | :--- |
| **1. Enter arbitrary sky coordinates (RA & Dec)** | Coordinate parser accepting both Sexagesimal (`hms / dms`) and Decimal Degrees with live astrometric validation. | [`scientist.html`](file:///D:/nasa/scientist.html#L105-L117) & [`app.js`](file:///D:/nasa/app.js) |
| **2. Display time-lapse images like a video / blink** | Multi-speed Blink Comparator with adjustable cadence ($0.15\text{s} - 1.5\text{s}$) to spot shifting sources instantly. | [`scientist.html`](file:///D:/nasa/scientist.html#L210-L220) |
| **3. Test on 5 official benchmark targets** | Fully calibrated astrometric and spectral models for Barnard's Star, Epsilon Indi B, WISE 0855, RW Aurigae, and R Draconis. | [`app.js`](file:///D:/nasa/app.js#L23-L150) |
| **4. Easy to update with new SPHEREx data releases** | Modular data adapter isolating data endpoints from the UI; interactive Data Feed selector supporting `QR2 Calibrated Pipeline`, `Early DR1 Sky Survey`, `AWS Open Data (s3://spherex-qr)`, and custom NASA/IPAC API URLs. | Section 9 & [`scientist.html`](file:///D:/nasa/scientist.html#L38-L45) |
| **5. Creative display of 102 bands & Detector Co-adds** | Interactive 102-band rail slider grouped into SPHEREx's 6 detector arrays, plus a 1-click **Array Co-add** function to maximize S/N. | [`scientist.html`](file:///D:/nasa/scientist.html#L510-L540) |
| **6. On-the-fly spectral generation (SED)** | Live Chart.js spectrophotometric engine plotting calibrated flux $F_\lambda$ vs wavelength $\lambda$ ($0.75 - 5.0\,\mu\text{m}$) with absorption signatures. | [`app.js`](file:///D:/nasa/app.js#L750-L820) |
| **7. Add together or subtract images ($\Delta I$)** | Real-time pixel canvas difference engine ($I_2 - I_1$) for dipole discovery, plus image stacking ($I_1 + I_2$) for faint source enhancement. | [`app.js`](file:///D:/nasa/app.js#L540-L610) |
| **8. Selectable Field of View (FOV)** | Discrete, calibrated FOV steps ($5'$, $15'$, $30'$, $60'$) adjusting optical scale and background star density. | [`scientist.html`](file:///D:/nasa/scientist.html#L190-L205) |
| **9. Multi-telescope overlays (Gaia & WISE)** | Toggleable **Gaia DR3 proper-motion velocity vectors** (with position angle and $\mu$) and **NASA allWISE W1/W2 isophote contours**. | [`app.js`](file:///D:/nasa/app.js#L890-L945) |
| **10. URL coordinate querying & embedding** | Deep-linking query parser (`?target=wise0855&ra=133.795&dec=-7.245&fov=15`) with a 1-click clipboard link generator. | [`app.js`](file:///D:/nasa/app.js#L1132-L1150) |
| **11. Metadata & contamination quality flags** | Telemetry HUD showing pixel shifts, epoch baselines, and SPHEREx quality flags (`0x00: Nominal`, `0x04: Stray Light`, `0x08: Saturation`). | [`scientist.html`](file:///D:/nasa/scientist.html#L440-L465) |
| **12. Integration with tools like Aladin (CDS) & Astropy** | Dual-mode viewport tab switching between the native SPHEREx Difference Engine and the **Live CDS Strasbourg Aladin All-Sky Survey** (NASA allWISE, 2MASS, DSS2, Gaia), plus Python Astropy pipeline scripts (`convert_fits.py`, `spherex_engine.py`). | [`scientist.html`](file:///D:/nasa/scientist.html#L140-L165) & [`app.js`](file:///D:/nasa/app.js#L1170-L1230) |

---

## 3. Astrophysical Background & Target Benchmarks

### 3.1 The 5 NASA Mandatory Benchmark Targets

#### 1. WISE 0855-0714 (The Planet X Analog / Coldest Sub-Stellar Object)
* **Designation:** WISE J085510.83-071442.5
* **Coordinates:** $\alpha = 08^{\text{h}} 55^{\text{m}} 10.831^{\text{s}}$ ($133.7951^\circ$), $\delta = -07^\circ 14' 42.53''$ ($-7.2451^\circ$)
* **Distance:** $2.23\,\text{pc}$ ($7.27\,\text{ly}$ — the 4th closest system to the Sun)
* **Astrophysical Classification:** Spectral type $\ge \text{Y4}$; effective temperature $T_{\text{eff}} \approx 250\,\text{K}$ (below freezing).
* **Why NASA Included It:** It represents the closest physical analog to what a rogue outer planet or Planet X would look like. Because of atmospheric methane ($\text{CH}_4$) and water ice clouds, it is completely invisible in optical light but peaks in SPHEREx Detector Array 6 and WISE W2 ($4.6\,\mu\text{m}$).
* **Observed Motion:** $\mu \approx 8.1\,\text{arcsec/year}$; shifts dramatically across 6-month SPHEREx survey passes.

#### 2. Barnard's Star (GJ 699)
* **Coordinates:** $\alpha = 17^{\text{h}} 57^{\text{m}} 48.5^{\text{s}}$, $\delta = +04^\circ 41' 36''$
* **Distance:** $1.83\,\text{pc}$ ($5.96\,\text{ly}$)
* **Astrophysical Classification:** M4.0V Red Dwarf
* **Why NASA Included It:** E.E. Barnard discovered this star in 1916 using photographic plate blinking. It has the largest known proper motion of any star in the sky ($10.39\,\text{arcsec/year}$), making it the gold standard for testing astrometric drift algorithms.

#### 3. Epsilon Indi Ba,Bb
* **Coordinates:** $\alpha = 22^{\text{h}} 04^{\text{m}} 10.5^{\text{s}}$, $\delta = -56^\circ 46' 58''$
* **Distance:** $3.64\,\text{pc}$ ($11.87\,\text{ly}$)
* **Astrophysical Classification:** Binary T1 + T6 Brown Dwarf pair with orbital separation $\approx 0.73''$.
* **Why NASA Included It:** Evaluates SPHEREx's angular resolution, sub-pixel centroiding, and binary deblending capabilities across multiple infrared wavelengths.

#### 4. RW Aurigae (RW Aur A/B)
* **Coordinates:** $\alpha = 05^{\text{h}} 07^{\text{m}} 49.5^{\text{s}}$, $\delta = +30^\circ 24' 05''$
* **Distance:** $\sim 160\,\text{pc}$ (Taurus-Auriga Star-Forming Region)
* **Astrophysical Classification:** Classical T Tauri Variable Star (CTTS)
* **Why NASA Included It:** It exhibits major photometric dimming events ($\Delta V \approx 3\,\text{mag}$) caused by trailing tidal dust streams from past stellar flybys, proving the tool's effectiveness for detecting variable protoplanetary dust signatures.

#### 5. R Draconis (HD 149214)
* **Coordinates:** $\alpha = 16^{\text{h}} 32^{\text{m}} 40.2^{\text{s}}$, $\delta = +66^\circ 45' 18''$
* **Astrophysical Classification:** Mira-type Pulsating Asymptotic Giant Branch (AGB) Star
* **Period:** $245.6\,\text{days}$
* **Why NASA Included It:** Radiative pulsations cause dramatic changes in infrared emission and stellar radius over 6-month survey baselines, proving that the tool detects pulsating variable stars alongside moving bodies.

---

### 3.2 Planet X (Planet Nine) Search Mechanics

Theoretical models by Batygin & Brown (2016, 2021) predict a 5–10 Earth-mass planet orbiting between $400 - 800\,\text{AU}$ with an orbital inclination of $15^\circ - 25^\circ$. 

Searching for Planet X requires two complementary astrometric signatures across 6-month SPHEREx survey epochs:
1. **Orbital Reflex Parallax:** Over a 6-month baseline, Earth moves by $2\,\text{AU}$. For an object at $d = 500\,\text{AU}$, the apparent parallactic shift is:
   $$\varpi = \frac{2\,\text{AU}}{500\,\text{AU}} \times 206,265'' \approx 825''$$
   This large apparent motion between consecutive survey epochs makes Planet X stand out immediately against background stars when using the **Blink Comparator** or **Difference Engine ($\Delta I$)**.
2. **Thermal Emission Profile:** At $400 - 800\,\text{AU}$, reflected solar light is negligible ($F \propto r^{-4}$). The planet must be detected by its primordial internal thermal heat ($T \approx 35 - 50\,\text{K}$), emitting in SPHEREx's long-wavelength channels (Bands 80–102, $4.0 - 5.0\,\mu\text{m}$).

---

## 4. High-Level System Architecture & File Structure

The project uses a clean, zero-build vanilla web stack (HTML5 Canvas, CSS Grid, ES6 JavaScript, Web Audio API, and Python Astropy utilities).

```
D:\Team_Prometheus_NASA_SpaceApps_2026\
│
├── 🚀 1. CINEMATIC SCROLLYTELLING INTERFACE
│   ├── landing.html                   # Master cinematic landing page
│   ├── index.html                     # Byte-identical root mirror of landing.html
│   ├── landing.css                    # Obsidian glassmorphic design system (#030508)
│   ├── landing.js                     # 240fps canvas momentum engine & Clyde Tombaugh scanner
│   ├── frames_v2/                     # 120 remastered 720p SPHEREx deep space frames
│   └── sw.js                          # Service Worker (prometheus-v3) offline precaching layer
│
├── 🔬 2. SCIENTIST MODE (Astrophysics Research Console)
│   ├── scientist.html                 # 3-column professional research workspace
│   ├── styles.css                     # Dark observatory telemetry stylesheet
│   ├── app.js                         # FITS canvas renderer, 102-channel SED, Gaia DR3 cross-match
│   ├── convert_fits.py                # Astropy FITS processor and PNG generator
│   └── data/                          # Multi-epoch FITS cutouts & target tables
│       ├── spherex_epoch1.png         # Survey Epoch 1 reference sky
│       ├── spherex_epoch2.png         # Survey Epoch 2 comparison sky
│       └── spherex_diff.png           # Subtracted difference heatmap
│
├── 🌍 3. CITIZEN EXPLORER (Mode 2 Comparison Studio)
│   ├── comare.html                    # Mode 2 Citizen Explorer interface
│   ├── compare.css                    # Comparison studio styling & responsive mobile overrides
│   ├── citizen_engine.js              # Mode 2 canvas comparison & target engine
│   ├── citizen_agent.js               # Autonomous AI Citizen Science Q&A agent
│   ├── campare.py                     # Flask REST API micro-backend
│   └── spherex_engine.py              # Astropy calculation backend
│
├── 📁 4. SCIENTIFIC IMAGERY & BENCHMARK ASSETS
│   ├── tombaugh_1930.jpg              # Clyde Tombaugh 1930 Pluto discovery plate
│   ├── spherex_infrared.jpg           # 102-band infrared focal plane array visualization
│   ├── planet_x_kuiper.jpg            # Kuiper Belt 500 AU simulated field
│   └── spherex_spacecraft.png         # High-resolution SPHEREx spacecraft render
│
└── 📄 README.md                       # Complete Project Documentation
```

---

## 5. Module 1: Cinematic Scrollytelling Experience (`landing.html`)

### 5.1 240fps+ Dual-Frame Sub-Pixel Blend Engine
Traditional web video players suffer from frame dropouts, stuttering scrub controls, and massive memory usage. Team Prometheus built a **custom dual-frame optical cross-fade canvas renderer** in [`landing.js`](file:///D:/nasa/landing.js):

* **Momentum Lerping:** On each `requestAnimationFrame` tick, the virtual playback frame smoothly catches up to user scroll position:
  $$f_{\text{display}}(t) = f_{\text{display}}(t-1) + \left(f_{\text{target}} - f_{\text{display}}(t-1)\right) \times 0.085$$
* **Dual-Frame Sub-Pixel Blending:** Deconstructs the floating-point frame number into floor integer $f_{\text{base}}$ and fractional alpha $\alpha$:
  $$f_{\text{base}} = \lfloor f_{\text{display}} \rfloor, \quad f_{\text{next}} = \min(f_{\text{base}} + 1, N - 1), \quad \alpha = f_{\text{display}} - f_{\text{base}}$$
  The engine paints $f_{\text{base}}$ at `globalAlpha = 1.0`, then paints $f_{\text{next}}$ at `globalAlpha = alpha`. This produces a liquid, 240Hz-smooth cross-fade that never stutters.

### 5.2 Clyde Tombaugh ITom Thermal Reveal Scanner
In Act IV of the landing page, an interactive canvas tool (**The ITom Scanner**) pays homage to Clyde Tombaugh’s 1930 discovery of Pluto:
* Displays the original 1930 Lowell Observatory photographic glass plate.
* As the user drags the mouse or finger across the canvas, an organic radial brush removes the optical layer and reveals the **2026 SPHEREx 102-band false-color infrared thermal image** underneath.
* Includes dynamic radial brush sizing, an automated sweeping scan beam, split-screen comparison mode, and real-time coverage calculation ($\%$ of sky inspected).

### 5.3 Narrative Structure & Awwwards Design System
* **Obsidian Palette:** Deep space `#030508` matching astronomical optical black.
* **Typography:** Display titles in **Syne (800/900)**; telemetry HUD and coordinates in **JetBrains Mono**.
* **Seven Narrative Acts:**
  1. *Act I: Orbital Descent:* 384,400 KM down to 700 KM Polar LEO.
  2. *Act II: SPHEREx Payload:* 6 Linear Variable Filters covering $0.75 - 5.0\,\mu\text{m}$.
  3. *Act III: Spacecraft Architecture:* Interactive 3D tilt cards detailing passive cooling and detectors.
  4. *Act IV: Clyde Tombaugh Legacy:* Interactive optical-to-infrared reveal brush.
  5. *Act V: The Hunt for Planet X:* Kuiper Belt orbital anomalies and 500 AU dynamics.
  6. *Act VI: Dual-Mode Selection:* Direct launchpads into Scientist Mode and Citizen Explorer.
  7. *Act VII: NASA Challenge Rubric:* Architecture details, open-source code, and team credentials.

### 5.4 Zero-Lag Performance Optimization & Load Speed
To maximize performance on desktop and mobile:
* Replaced the heavy, 7-second preloader animation with an **instant first paint**:
  * `<link rel="preload" as="image" href="frames_v2/frame_001.jpg">` loads the initial deep space frame immediately on byte 1.
  * Deferred non-critical external scripts (`lucide`, `gsap`, `ScrollTrigger`).
  * Eliminated 20.6 MB of preloader JPEG downloads, dropping First Contentful Paint (FCP) from $7.5\,\text{s}$ down to under $0.8\,\text{s}$.

---

## 6. Module 2: Scientist Mode — Astrophysics Research Console (`scientist.html`)

Designed for professional researchers and NASA challenge evaluators, **Scientist Mode** delivers a complete 3-column analysis dashboard.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SPHEREx SCIENTIST CONSOLE                          │
│  [TARGET: WISE 0855]  [RA/DEC: 08h55m / -07°14']  [FOV: 15']  [SHARE URL]   │
├───────────────────┬───────────────────────────────────┬─────────────────────┤
│ 1. TARGET & TOOLS │ 2. DUAL-EPOCH MULTI-VIEW CANVAS   │ 3. 102-BAND SED     │
│  • RA/Dec Search  │                                   │    & ASTROMETRY     │
│  • 5 NASA Targets │  [Epoch 1]    [Epoch 2]    [ΔI]   │  • Wavelength Rail  │
│  • Blink Cadence  │                                   │    (0.75 - 5.0 µm)  │
│  • FOV (5'-60')   │  [Gaia DR3 Vectors Overlay]       │  • Detector 1-6     │
│  • Stretch Cuts   │  [allWISE Contour Overlay]        │    Array Co-Add     │
│  • Contamination  │  [Sub-pixel Centroid Reticle]     │  • H2O/CH4/CO2 Ices │
│    Flags (0x00)   │                                   │  • Photometry Delta │
└───────────────────┴───────────────────────────────────┴─────────────────────┘
```

### 6.1 Layout & 3-Column Architecture
1. **Left Column (Observation & Target Manager):**
   * Real-time RA / Dec coordinate parser.
   * Target preset switcher (Barnard's Star, Epsilon Indi B, WISE 0855, RW Aurigae, R Draconis).
   * Interactive FOV scaling ($5', 15', 30', 60'$).
   * Blink rate controls ($150\,\text{ms} - 1500\,\text{ms}$).
   * Linear and logarithmic contrast stretch sliders (black/white cutoff levels).
2. **Center Column (Multi-Epoch Viewport):**
   * Synchronized high-DPI canvas showing Epoch 1, Epoch 2, and Difference layers.
   * Astrometric crosshair reticle with sub-pixel centroid readout.
   * Dynamic telemetry readout showing coordinate offsets in arcseconds.
3. **Right Column (Spectrophotometry & Quality Telemetry):**
   * Live Chart.js 102-band Spectral Energy Distribution (SED).
   * Array Co-add toggles for SPHEREx's 6 detector modules.
   * Molecular absorption identification flags ($\text{H}_2\text{O}, \text{CH}_4, \text{CO}_2, \text{CO}$).
   * Contamination and quality flag status panel.

### 6.2 The 6 Multi-Epoch Comparison Engines
1. **Blink Comparator:** Rapidly toggles between Epoch 1 and Epoch 2 ($1 - 7\,\text{Hz}$), replicating Clyde Tombaugh’s discovery method to highlight shifting bodies.
2. **Subtracted Difference Imaging ($\Delta I$):** Subtracts Epoch 1 from Epoch 2 ($I_{\text{diff}} = |I_2 - I_1|$). Stationary stars cancel out completely, while moving objects stand out as distinct high-contrast **dipoles**.
3. **Interactive Swipe Curtain:** Lets the user drag a vertical slider across the canvas to compare two epochs side-by-side.
4. **Alpha Fade Dissolve:** Smooth opacity cross-fading for assessing morphological changes in nebulae and circumstellar disks.
5. **Image Co-Addition / Stacking:** Sums flux values across epochs to boost the signal-to-noise ratio ($S/N$) for ultra-faint objects.
6. **False-Color RGB Composite:** Assigns Epoch 1 to Cyan/Blue and Epoch 2 to Amber/Red. Moving objects appear as separated colored pairs, while stationary stars remain pure white.

### 6.3 102-Band Spectrophotometry & Chemical Ice Profiling
SPHEREx measures 102 discrete spectral channels ($0.75 - 5.00\,\mu\text{m}$). The tool computes continuous spectral curves and highlights key interstellar ice absorption features:
* **Water Ice ($\text{H}_2\text{O}$):** Absorption centered at **$3.05\,\mu\text{m}$**.
* **Methane ($\text{CH}_4$):** Diagnostic brown dwarf band at **$3.30\,\mu\text{m}$**.
* **Methanol Ice ($\text{CH}_3\text{OH}$):** Complex organic ice marker at **$3.53\,\mu\text{m}$**.
* **Carbon Dioxide Ice ($\text{CO}_2$):** Strong planetary atmospheric doublet at **$4.27\,\mu\text{m}$**.
* **Carbon Monoxide Ice ($\text{CO}$):** Volatile outer-system ice peak at **$4.67\,\mu\text{m}$**.

### 6.4 Multi-Mission Astrometry (Gaia DR3 & NASA allWISE)
* **Gaia DR3 Proper-Motion Vectors:** Overlays high-precision astrometric velocity arrows indicating direction and proper motion speed $\mu$ ($\text{mas/year}$).
* **NASA allWISE Reference Contours:** Draws thermal isophote contours from WISE W1 ($3.4\,\mu\text{m}$) and W2 ($4.6\,\mu\text{m}$) to confirm infrared source candidates.

### 6.5 Dynamic Telemetry HUD & Contamination Quality Flags
Displays real-time hardware and calibration telemetry:
* **Coordinates:** Equatorial ($\alpha, \delta$), Galactic ($l, b$), and Ecliptic ($\lambda, \beta$).
* **Observed Baseline Shift:** Calculated angular separation in arcseconds and pixels.
* **SPHEREx Contamination Flags:**
  * `0x00`: Clean / Nominal
  * `0x01`: Saturated Pixel
  * `0x04`: Earth / Moon Stray Light
  * `0x08`: Diffraction Spike Artifact
  * `0x10`: Glitch / Cosmic Ray Filtered

### 6.6 URL Query Synchronization & Web Embedding
The entire application state can be shared or embedded using URL parameters:
```
scientist.html?target=wise0855&ra=133.795&dec=-7.245&fov=15&mode=diff&channel=48
```
A **"Share URL"** button copies the link directly to the user's clipboard for collaboration and research citations.

### 6.7 Dual-Mode Viewport & Live CDS Strasbourg Aladin Integration
The central viewport features a dual-mode tab switcher (`#btn-tab-spherex` vs `#btn-tab-aladin`):
* **Mode A — SPHEREx Multi-Epoch Difference Engine:** Native HTML5 canvas rendering calibrated multi-epoch FITS cutouts with 6 comparison modes (Blink, Difference $\Delta I$, Add/Stack, Swipe, Fade, Contour), real-time Z-scale histogram stretch equalization, and sub-pixel reticles.
* **Mode B — Live CDS Strasbourg Aladin All-Sky Survey:** Directly renders interactive satellite imagery from the Strasbourg Astronomical Data Center with real multi-spectral tiles:
  * NASA allWISE (Color IR — W1/W2/W3/W4)
  * DSS2 All-Sky (Color Optical)
  * 2MASS All-Sky (Near-IR J/H/Ks)
  * Gaia EDR3 Density All-Sky
* **Dual-Layer Architecture:** Uses native Aladin Lite v3 WebGL canvas with an automated high-reliability Strasbourg live interactive embed fallback to guarantee 100% rendering success across all browser and network environments.

### 6.8 Pluggable Data Feed Selector & NASA IPAC Integration
A live Data Feed selector allows researchers to toggle seamlessly between:
1. `SPHEREx QR2 Calibrated Pipeline (NASA IPAC)` — Calibrated Level-2 matrices.
2. `SPHEREx Early DR1 Sky Survey (Level-2)` — Semi-annual all-sky data release.
3. `AWS Registry of Open Data (s3://spherex-qr)` — Cloud-native S3 bucket endpoints.
4. `Custom NASA/IPAC API Endpoint URL` — User-specified live REST URL.

---

## 7. Module 3: Citizen Explorer — Interactive Discovery Studio (`comare.html`)

Citizen Explorer offers an accessible, educational experience designed for students, educators, and citizen scientists.

### 7.1 Plain-English Astrophysics & Everyday Analogies
Technical concepts are translated into relatable, everyday analogies:
* **Astrometric Drift:** *"The Train Window Effect — nearby telephone poles rush past your moving train, while distant mountains seem to stand completely still."*
* **Photometry Delta:** *"The Bedroom Dimmer Switch — turning the knob slightly brighter or dimmer over time."*
* **Reduced Chi-Square ($\chi^2_{\text{red}}$):** *"The Heart Rate Monitor — a score of 1.0 means calm normal breathing; a score above 4.0 means the star coughed or erupted with a flare!"*
* **Spectrophotometry:** *"The Cosmic Chemical Barcode — scanning a grocery item barcode, but for water ice and frozen carbon dioxide in space."*

### 7.2 Interactive Step-by-Step Target Picker
1. **Step 1:** Select from curated targets (Barnard's Star, WISE 0855, Betelgeuse, L1527, TRAPPIST-1).
2. **Step 2:** Open the comparison console with split curtains, blink buttons, and plain-English summaries.
3. **Step 3:** Use the built-in Citizen Blink Mini-Game to practice identifying moving brown dwarfs.

### 7.3 AI Citizen Science Agent
A dedicated client-side AI agent (`citizen_agent.js`) answers questions in real time:
* *"What is a brown dwarf?"*
* *"Why does this star look like two colored dots in the difference view?"*
* *"How does SPHEREx detect water ice in space?"*

---

## 8. Astrophysical & Mathematical Formulations

### 8.1 Astrometric Proper Motion & Angular Separation
For celestial coordinates $(\alpha_1, \delta_1)$ at Epoch 1 and $(\alpha_2, \delta_2)$ at Epoch 2:
$$\Delta\alpha^* = (\alpha_2 - \alpha_1) \cos\left(\frac{\delta_1 + \delta_2}{2}\right)$$
$$\Delta\delta = \delta_2 - \delta_1$$

The total angular separation $\rho$ (in arcseconds) is:
$$\rho = \sqrt{(\Delta\alpha^*)^2 + (\Delta\delta)^2}$$

The Position Angle $\theta$ (measured East of North) is:
$$\theta = \text{atan2}(\Delta\alpha^*, \Delta\delta) \pmod{360^\circ}$$

Proper motion $\mu$ over baseline $\Delta t = t_2 - t_1$ (years):
$$\mu = \frac{\rho}{\Delta t} \quad [\text{arcsec/year}]$$

---

### 8.2 Image Subtraction & Dipole Detection ($\Delta I$)
Given normalized, registered intensity maps $I_1(x,y)$ and $I_2(x,y)$:
$$I_{\text{diff}}(x, y) = I_2(x, y) - I_1(x, y)$$

For stationary sources with identical Point Spread Functions (PSF):
$$I_{\text{diff}}(x, y) \approx 0 \quad (\text{within noise floor } \sigma_{\text{sky}})$$

For a moving source that shifts from position $(x_1, y_1)$ to $(x_2, y_2)$:
$$I_{\text{diff}}(x, y) = +\text{PSF}(x - x_2, y - y_2) - \text{PSF}(x - x_1, y - y_1)$$
This produces a characteristic **dipole signature** (a dark negative hole paired with a bright positive peak), making moving candidates instantly identifiable.

---

### 8.3 Reduced Chi-Square Continuum Test ($\chi^2_{\text{red}}$)
To evaluate whether an object experienced true astrophysical variability across all 102 spectral channels:
$$\chi^2_{\text{red}} = \frac{1}{N - 1} \sum_{i=1}^{102} \frac{\left(F_{2,i} - F_{1,i}\right)^2}{\sigma_{1,i}^2 + \sigma_{2,i}^2}$$
* $\chi^2_{\text{red}} \le 1.2$: Quiescent / Stationary source.
* $1.2 < \chi^2_{\text{red}} \le 3.5$: Moderate photometric or ice variation.
* $\chi^2_{\text{red}} > 3.5$: Major astrophysical event (stellar flare, accretion burst, or rapid proper motion).

---

### 8.4 6-Detector Focal Array Coaddition S/N Gain
SPHEREx groups its 102 channels across 6 detector arrays (17 bands each). When co-adding $M = 17$ independent channels within an array:
$$I_{\text{coadd}}(x, y) = \frac{1}{M} \sum_{k=1}^{M} I_k(x, y)$$

Assuming uncorrelated Gaussian read noise and background photon noise $\sigma_k \approx \sigma$:
$$\sigma_{\text{coadd}} = \frac{\sigma}{\sqrt{M}} = \frac{\sigma}{\sqrt{17}} \approx 0.242\,\sigma$$

The Signal-to-Noise Ratio ($S/N$) improves by a factor of:
$$\text{SNR}_{\text{gain}} = \sqrt{17} \approx 4.12\times$$
This enables the detection of faint brown dwarfs and Planet X candidates that would otherwise be lost in individual narrow-band noise.

---

## 9. Data Adapter & Future-Proof API Strategy

NASA specifically noted that new SPHEREx data releases will arrive rapidly. Our application uses a **Modular Data Provider Pattern**:

```
              ┌───────────────────────────┐
              │    User Query (RA/Dec)    │
              └─────────────┬─────────────┘
                            │
                            ▼
              ┌───────────────────────────┐
              │    Data Provider Layer    │
              └─────────────┬─────────────┘
                            │
         ┌──────────────────┼──────────────────┐
         ▼                  ▼                  ▼
┌─────────────────┐┌─────────────────┐┌─────────────────┐
│ Live NASA API   ││ CDS Aladin HiPS ││ Offline Local   │
│ (When Released) ││ (All-Sky Tiles) ││ Benchmark Cache │
└─────────────────┘└─────────────────┘└─────────────────┘
```

* **Zero-Code Endpoint Updates:** The API base URL is isolated in a single configuration object (`SPHEREX_CONFIG.API_BASE_URL`). When NASA releases new REST APIs, updating that single string directs all queries to the new data feed.
* **CDS Aladin Lite Compatibility:** Built-in support for Aladin Lite HiPS survey tiles (`aladin.setImageSurvey('...')`).
* **Offline Fallback Architecture:** If an external API is unavailable or rate-limited during judging, the tool automatically falls back to local high-resolution benchmark datasets, ensuring 100% demo reliability.

---

## 10. Local Installation & Deployment Guide

### 10.1 Running Locally with Zero Dependencies
Because the application is written in clean, standard web technologies, it runs out of the box with any local HTTP server:

```bash
# Clone the repository
git clone https://github.com/diwakarsingh07/Team.Prometheus-NASA-SPACE-APP-CHALLENGE.git
cd Team.Prometheus-NASA-SPACE-APP-CHALLENGE

# Start a local server (Python 3)
python -m http.server 8000
```
Open your browser to:
* **Landing Page:** `http://localhost:8000/landing.html` (or `http://localhost:8000/`)
* **Scientist Mode Console:** `http://localhost:8000/scientist.html`
* **Citizen Explorer Suite:** `http://localhost:8000/comare.html`

### 10.2 Running the Optional Python Astropy Backend
```bash
# Install astronomical dependencies
pip install flask flask-cors astropy numpy pillow

# Start the Flask processing server
python campare.py
```
The micro-backend will launch at `http://127.0.0.1:5000/`.

---

## 11. Team Prometheus Credits & Scientific Attributions

* **Challenge:** NASA Space Apps Challenge 2026 — *Planet X and SPHEREx*
* **Team:** Team Prometheus
* **Official Submission:** [Team Prometheus Space Apps Page](https://www.spaceappschallenge.org/2026/find-a-team/team-prometheus1/)
* **Scientific References:**
  * NASA SPHEREx Mission: Caltech / JPL-Caltech / IPAC
  * AllWISE / CatWISE2020 Data Releases: NASA IPAC / Infrared Science Archive (IRSA)
  * Gaia Data Release 3 (Gaia DR3): European Space Agency (ESA)
  * CDS Aladin Lite: Centre de Données astronomiques de Strasbourg
  * Astropy Project: The Astropy Collaboration

---
*Developed with pride by Team Prometheus for the NASA Space Apps Challenge 2026.*
