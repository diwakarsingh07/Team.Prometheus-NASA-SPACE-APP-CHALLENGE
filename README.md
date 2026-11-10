# PROMETHEUS • NASA Space Apps Challenge 2026
### Planet X & SPHEREx: Dual-Experience Astronomical Discovery Platform

---

## 🌌 Project Architecture Overview

**PROMETHEUS** is built with a decoupled, high-performance architecture delivering two complementary experiences from a single scientific engine:

```
nasa/
│
├── 🚀 1. CINEMATIC 3D LANDING PLATFORM
│   ├── landing.html                   # Entry page with 240fps canvas scrollytelling & rocket preloader
│   ├── landing.css                    # Apple-grade glassmorphism, 4-color liquid smoke banner & HUD
│   ├── landing.js                     # Sub-frame cross-fade interpolation engine, GSAP triggers, Web Audio
│   ├── frames_loader/                 # 240 high-res frames: 3D Rocket Assembly, Cryo-Fueling & Liftoff
│   └── frames_v2/                     # 120 remastered deep space descent frames
│
├── 🔬 2. SCIENTIST MODE (Astrophysics Research Console • Mode 1)
│   ├── index.html                     # 3-column professional astrophysics dashboard
│   ├── styles.css                     # Dark observatory telemetry UI
│   ├── app.js                         # FITS viewer, 102-channel spectrophotometry, Gaia DR3 cross-match
│   ├── data/                          # Multi-epoch spectral observations and target catalogs
│   ├── convert_fits.py                # Astropy FITS ingestion utility
│   └── SPHEREx_Discovery_Engine_Guide.pdf # Research documentation
│
├── 🌍 3. CITIZEN EXPLORER (Time-Lapse Observation & Comparison Suite • Mode 2)
│   ├── comare.html                    # Citizen explorer interface
│   ├── compare.css                    # Obsidian glassmorphic styling, split curtain & comparator styles
│   ├── campare.py                     # Flask REST API backend
│   └── spherex_engine.py              # Astropy calculation engine (astrometry, photometry & spectroscopy)
│
└── 📁 ASSETS & IMAGERY
    ├── tombaugh_1930.jpg              # Clyde Tombaugh 1930 Pluto discovery plate
    ├── spherex_infrared.jpg           # 102-band infrared focal plane array
    ├── planet_x_kuiper.jpg            # Kuiper Belt / Planet Nine candidate field
    ├── spherex_spacecraft.png         # SPHEREx telescope render
    ├── sky_epoch1.png                 # Survey Epoch 1 reference sky
    ├── sky_epoch2.png                 # Survey Epoch 2 comparison sky
    └── sky_diff.png                   # Subtracted difference heatmap
```

---

## ⚡ Quick Start & Local Deployment

### Option 1: Instant Client Mode (Zero Dependencies)
Run a local HTTP server in the project directory:
```bash
python -m http.server 8000
```
* **Landing Page:** Open [http://localhost:8000/landing.html](http://localhost:8000/landing.html)
* **Scientist Console:** Open [http://localhost:8000/index.html](http://localhost:8000/index.html)
* **Citizen Explorer:** Open [http://localhost:8000/comare.html](http://localhost:8000/comare.html)

### Option 2: Full Python + Flask Astropy Backend (Optional)
```bash
pip install flask flask-cors astropy numpy pillow
python campare.py
```
Open [http://localhost:5000](http://localhost:5000) for real-time server-side Astropy coordinate calculations.

---

## 🛠️ Key Technical Highlights
* **240fps Sub-Frame Canvas Engine:** Sub-frame lerping (`displayFrame += (target - displayFrame) * 0.085`) and alpha cross-fading for liquid-smooth 3D scroll-scrubbing.
* **102-Band Spectrophotometry:** Spectral resolution across 6 Linear Variable Filters (0.75 – 5.00 µm) detecting frozen water ice ($H_2O$ at 3.05 µm) and carbon dioxide ($CO_2$).
* **Clyde Tombaugh Blink Comparator:** Emulates astronomical blink inspection at 1–5 Hz to identify trans-Neptunian objects and high proper-motion stars.
