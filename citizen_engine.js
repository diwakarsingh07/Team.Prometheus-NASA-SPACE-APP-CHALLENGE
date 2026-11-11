/**
 * ============================================================================
 * PROMETHEUS CITIZEN ENGINE (citizen_engine.js)
 * Static-first, astrophysics-grounded sky catalog, epoch physics,
 * astronomical telescope canvas renderer, pixel-diff engine & glossary.
 * Works 100% offline/static on Vercel & GitHub Pages with zero backend needed.
 * ============================================================================
 */

window.CitizenEngine = (function () {
  "use strict";

  const EPOCHS = [
    { id: "epoch_1", name: "Epoch 1 — April 15, 2025", shortDate: "Apr 15, 2025", date: "2025-04-15", mjd: 60780.0, pass: 1 },
    { id: "epoch_2", name: "Epoch 2 — October 15, 2025", shortDate: "Oct 15, 2025", date: "2025-10-15", mjd: 60963.0, pass: 2 },
    { id: "epoch_3", name: "Epoch 3 — April 15, 2026", shortDate: "Apr 15, 2026", date: "2026-04-15", mjd: 61145.0, pass: 3 },
    { id: "epoch_4", name: "Epoch 4 — October 15, 2026", shortDate: "Oct 15, 2026", date: "2026-10-15", mjd: 61328.0, pass: 4 }
  ];

  // Rich beginner-friendly catalog of space targets (Star A, B, C, etc.)
  const TARGETS = {
    barnard: {
      id: "barnard",
      code: "Star A",
      name: "Barnard's Star (GJ 699)",
      shortName: "Barnard's Star",
      categoryTag: "moving",
      categoryLabel: "🏃 Fast-Moving Star",
      nickname: "The Cosmic Sprinter",
      badgeText: "Fastest Moving Star in the Sky",
      cardHook: "Tap Star A to watch a real star visibly jump position across the background stars in just months!",
      designation: "HIP 87937 • Nearby Red Dwarf",
      raDeg: 269.45208,
      decDeg: 4.69339,
      raHms: "17h 57m 48.5s",
      decDms: "+04° 41' 36.2\"",
      distanceLy: 5.96,
      distanceLabel: "5.96 light-years away (very close neighbor!)",
      speedKmS: 142,
      pmRaMasYr: -798.58,
      pmDecMasYr: 10328.12,
      // Visual pixel displacement scale for clear citizen inspection (direction mirrors real NW/Northward proper motion)
      visualShiftPerYearPx: { dx: -7.5, dy: -46.0 },
      baseFluxMjy: 1450.0,
      starColor: "#ff9b54",
      coreColor: "#fff4e6",
      haloStyle: "point_dwarf",
      iceProfile: { h2o: 0.0, co2: 0.0, ch4: 0.0 },
      termsUsed: ["proper_motion", "arcsecond", "parallax", "infrared_flux", "epoch", "reference_stars"],
      epochs: {
        epoch_1: { fluxScale: 1.00, tempK: 3130, iceScale: 0, flare: 0.0, visualNote: "Sitting near the lower-center reference cluster." },
        epoch_2: { fluxScale: 1.01, tempK: 3135, iceScale: 0, flare: 0.0, visualNote: "Clearly shifted northward compared to Apr 2025." },
        epoch_3: { fluxScale: 0.99, tempK: 3125, iceScale: 0, flare: 0.0, visualNote: "Continued steady sprint across the fixed background grid." },
        epoch_4: { fluxScale: 1.00, tempK: 3130, iceScale: 0, flare: 0.0, visualNote: "Moved over 15 arcseconds from its starting spot!" }
      }
    },

    l1527: {
      id: "l1527",
      code: "Target B",
      name: "L1527 IRS (Baby Protostar)",
      shortName: "L1527 Baby Star",
      categoryTag: "ice",
      categoryLabel: "🧊 Frozen Space Ice",
      nickname: "Baby Star in an Ice Blanket",
      badgeText: "Frozen Water Ice & Heating Nursery",
      cardHook: "A newborn sun wrapped in frozen water & dry ice whose hourglass cloud warms up and dims as it feeds.",
      designation: "IRAS 04368+2557 • Taurus Cloud",
      raDeg: 69.97458,
      decDeg: 26.05272,
      raHms: "04h 39m 53.9s",
      decDms: "+26° 03' 09.8\"",
      distanceLy: 456,
      distanceLabel: "456 light-years away (Taurus Star Nursery)",
      speedKmS: 19,
      pmRaMasYr: 5.2,
      pmDecMasYr: -18.7,
      visualShiftPerYearPx: { dx: 0.4, dy: 0.6 },
      baseFluxMjy: 850.0,
      starColor: "#fb923c",
      coreColor: "#fef08a",
      nebulaColor: "#38bdf8",
      haloStyle: "hourglass_protostar",
      iceProfile: { h2o: 1.45, co2: 0.88, ch4: 0.28 },
      termsUsed: ["infrared_flux", "water_ice", "protostar", "accretion", "micron", "epoch"],
      epochs: {
        epoch_1: { fluxScale: 1.00, tempK: 42.0, iceScale: 1.00, flare: 0.0, visualNote: "Dense blue-cyan water ice blanket surrounding hourglass nebula." },
        epoch_2: { fluxScale: 1.14, tempK: 45.5, iceScale: 0.94, flare: 0.22, visualNote: "Core heated up as new gas fell inward; frost near core slightly melted." },
        epoch_3: { fluxScale: 1.24, tempK: 47.8, iceScale: 0.89, flare: 0.35, visualNote: "Strong outflow cone glow — warm dust brightens in infrared." },
        epoch_4: { fluxScale: 1.05, tempK: 43.2, iceScale: 0.99, flare: 0.08, visualNote: "Cooling back down; icy shell freezes thicker again." }
      }
    },

    betelgeuse: {
      id: "betelgeuse",
      code: "Star C",
      name: "Betelgeuse (α Orionis)",
      shortName: "Betelgeuse",
      categoryTag: "brightness",
      categoryLabel: "💓 Beating Brightness",
      nickname: "The Beating Heart Giant",
      badgeText: "Giant Pulsating Red Supergiant",
      cardHook: "A dying mega-star that expands and contracts like a beating lung, puffing dust clouds and surging in brightness.",
      designation: "HR 2061 • Orion's Shoulder",
      raDeg: 88.79294,
      decDeg: 7.40706,
      raHms: "05h 55m 10.3s",
      decDms: "+07° 24' 25.4\"",
      distanceLy: 548,
      distanceLabel: "548 light-years away (Constellation Orion)",
      speedKmS: 30,
      pmRaMasYr: 27.54,
      pmDecMasYr: 11.30,
      visualShiftPerYearPx: { dx: 0.8, dy: -0.4 },
      baseFluxMjy: 2800.0,
      starColor: "#f97316",
      coreColor: "#fff7ed",
      nebulaColor: "#ef4444",
      haloStyle: "pulsing_supergiant",
      iceProfile: { h2o: 0.02, co2: 0.0, ch4: 0.0 },
      termsUsed: ["infrared_flux", "pulsation", "dust_shell", "diffraction_spikes", "epoch", "luminosity"],
      epochs: {
        epoch_1: { fluxScale: 1.00, tempK: 3450, iceScale: 0.1, flare: 0.0, visualNote: "Baseline red supergiant glare with moderate silicate dust shell." },
        epoch_2: { fluxScale: 1.32, tempK: 3630, iceScale: 0.05, flare: 0.4, visualNote: "Expanded bright phase (+32% glow) — huge diffraction spikes!" },
        epoch_3: { fluxScale: 0.72, tempK: 3290, iceScale: 0.25, flare: -0.25, visualNote: "Great Dimming style dust sneeze: outer dust veils cool & dim the core." },
        epoch_4: { fluxScale: 0.94, tempK: 3420, iceScale: 0.15, flare: -0.05, visualNote: "Dust dispersing and brightness recovering toward baseline." }
      }
    },

    trappist1: {
      id: "trappist1",
      code: "Star D",
      name: "TRAPPIST-1 (7-Planet System)",
      shortName: "TRAPPIST-1",
      categoryTag: "brightness",
      categoryLabel: "🪐 Planets & Superflares",
      nickname: "7-Earth Alien Sun",
      badgeText: "7 Rocky Planets + Explosive Flares",
      cardHook: "A tiny cool star with 7 Earth-sized worlds that occasionally blasts massive stellar superflares across space.",
      designation: "2MASS J23062928-0502285 • Aquarius",
      raDeg: 346.62208,
      decDeg: -5.04128,
      raHms: "23h 06m 29.3s",
      decDms: "-05° 02' 28.6\"",
      distanceLy: 40.7,
      distanceLabel: "40.7 light-years away (7 Earth-sized worlds)",
      speedKmS: 56,
      pmRaMasYr: 924.3,
      pmDecMasYr: -470.1,
      visualShiftPerYearPx: { dx: 11.0, dy: 5.5 },
      baseFluxMjy: 420.0,
      starColor: "#f43f5e",
      coreColor: "#ffe4e6",
      haloStyle: "flare_dwarf",
      iceProfile: { h2o: 0.0, co2: 0.0, ch4: 0.0 },
      termsUsed: ["stellar_flare", "proper_motion", "infrared_flux", "exoplanet", "arcsecond", "epoch"],
      epochs: {
        epoch_1: { fluxScale: 1.00, tempK: 2560, iceScale: 0, flare: 0.0, visualNote: "Calm ultra-cool red dwarf orbited closely by 7 rocky worlds." },
        epoch_2: { fluxScale: 1.48, tempK: 2920, iceScale: 0, flare: 0.85, visualNote: "SUPERFLARE ERUPTION! Magnetic explosion spikes brightness +48% + slight drift!" },
        epoch_3: { fluxScale: 1.03, tempK: 2575, iceScale: 0, flare: 0.05, visualNote: "Post-flare calm; star continued drifting down-right across the sky." },
        epoch_4: { fluxScale: 0.97, tempK: 2545, iceScale: 0, flare: 0.0, visualNote: "Quiet phase with clear sideways position offset from Epoch 1." }
      }
    },

    wise0855: {
      id: "wise0855",
      code: "Star E",
      name: "WISE 0855-0714 (Frozen World)",
      shortName: "WISE 0855",
      categoryTag: "moving",
      categoryLabel: "❄️ Cold Moving Rogue",
      nickname: "Sub-Zero Ice Cloud Dwarf",
      badgeText: "Coldest Known Neighbor + Fast Motion",
      cardHook: "As cold as a winter freezer (-10°C), invisible to normal cameras — yet glowing in SPHEREx infrared heat vision while racing past!",
      designation: "WISE J085510.83-071442.5 • Hydra",
      raDeg: 133.795,
      decDeg: -7.245,
      raHms: "08h 55m 10.8s",
      decDms: "-07° 14' 42.5\"",
      distanceLy: 7.27,
      distanceLabel: "7.27 light-years away (4th closest neighbor)",
      speedKmS: 92,
      pmRaMasYr: -8100.0,
      pmDecMasYr: 680.0,
      visualShiftPerYearPx: { dx: -38.0, dy: -4.0 },
      baseFluxMjy: 290.0,
      starColor: "#6366f1",
      coreColor: "#a5f3fc",
      nebulaColor: "#22d3ee",
      haloStyle: "cold_brown_dwarf",
      iceProfile: { h2o: 1.15, co2: 0.1, ch4: 0.95 },
      termsUsed: ["brown_dwarf", "proper_motion", "water_ice", "infrared_flux", "arcsecond", "parallax"],
      epochs: {
        epoch_1: { fluxScale: 1.00, tempK: 255, iceScale: 1.0, flare: 0.0, visualNote: "Cool blue-teal heat dot — invisible to regular cameras, visible in IR." },
        epoch_2: { fluxScale: 1.04, tempK: 258, iceScale: 0.98, flare: 0.05, visualNote: "Raced noticeably westward against background stars (+4.1 arcsec shift)." },
        epoch_3: { fluxScale: 0.95, tempK: 250, iceScale: 1.04, flare: -0.05, visualNote: "Thick water-ice clouds rotated into view while speeding west." },
        epoch_4: { fluxScale: 1.02, tempK: 256, iceScale: 0.99, flare: 0.02, visualNote: "Huge horizontal jump (>12 arcsec!) since Apr 2025." }
      }
    },

    iras08572: {
      id: "iras08572",
      code: "Target F",
      name: "IRAS 08572+3915 (Galaxy Crash)",
      shortName: "IRAS 08572 Galaxies",
      categoryTag: "galaxy",
      categoryLabel: "🌀 Smashing Galaxies",
      nickname: "Two Galaxies Crashing Together",
      badgeText: "Colliding Galactic Nuclei & Carbon Dust",
      cardHook: "Two whole galaxies smashing head-on 780 million light-years away, flickering as gas feeds a hidden black hole.",
      designation: "WISEA J090025.39+390354.0 • Lynx",
      raDeg: 135.10583,
      decDeg: 39.06500,
      raHms: "09h 00m 25.4s",
      decDms: "+39° 03' 54.0\"",
      distanceLy: 780000000,
      distanceLabel: "780 million light-years away (Deep Universe)",
      speedKmS: 0,
      pmRaMasYr: 0.0,
      pmDecMasYr: 0.0,
      visualShiftPerYearPx: { dx: 0.0, dy: 0.0 },
      baseFluxMjy: 125.0,
      starColor: "#f43f5e",
      coreColor: "#fde047",
      nebulaColor: "#a855f7",
      haloStyle: "colliding_galaxies",
      iceProfile: { h2o: 1.82, co2: 1.15, ch4: 0.35 },
      termsUsed: ["infrared_flux", "water_ice", "accretion", "micron", "epoch", "dust_shell"],
      epochs: {
        epoch_1: { fluxScale: 1.00, tempK: 68.0, iceScale: 1.0, flare: 0.0, visualNote: "Twin bright starburst nuclei locked in a sweeping spiral merger." },
        epoch_2: { fluxScale: 0.89, tempK: 64.0, iceScale: 1.05, flare: -0.1, visualNote: "Dust lane thickened in front of the primary black-hole core (-11% dimmer)." },
        epoch_3: { fluxScale: 1.18, tempK: 73.5, iceScale: 0.94, flare: 0.2, visualNote: "Gas surge hit the core (+18% flare) lighting up warm dust lanes." },
        epoch_4: { fluxScale: 1.03, tempK: 69.0, iceScale: 0.99, flare: 0.04, visualNote: "Returned to moderate glow with swirling tidal arms." }
      }
    },

    orion_kl: {
      id: "orion_kl",
      code: "Target G",
      name: "Orion KL Star Nursery",
      shortName: "Orion KL Nursery",
      categoryTag: "ice",
      categoryLabel: "✨ Star-Forming Cloud",
      nickname: "The Cosmic Maternity Ward",
      badgeText: "Giant Nebula + Prebiotic Water Ices",
      cardHook: "A blazing cloud in Orion's Sword where dozens of giant baby stars blast shockwaves through water & organic ice clouds.",
      designation: "IRAS 05327-0524 • Orion Nebula",
      raDeg: 83.81042,
      decDeg: -5.37500,
      raHms: "05h 35m 14.5s",
      decDms: "-05° 22' 30.0\"",
      distanceLy: 1350,
      distanceLabel: "1,350 light-years away (Orion's Sword)",
      speedKmS: 18,
      pmRaMasYr: 1.4,
      pmDecMasYr: -0.8,
      visualShiftPerYearPx: { dx: 0.2, dy: 0.2 },
      baseFluxMjy: 4200.0,
      starColor: "#38bdf8",
      coreColor: "#ffffff",
      nebulaColor: "#34d399",
      haloStyle: "nebula_nursery",
      iceProfile: { h2o: 1.95, co2: 1.30, ch4: 0.45 },
      termsUsed: ["water_ice", "infrared_flux", "protostar", "micron", "dust_shell", "epoch"],
      epochs: {
        epoch_1: { fluxScale: 1.00, tempK: 55.0, iceScale: 1.00, flare: 0.0, visualNote: "Glowing turquoise/amber gas pillars packed with water & CO2 frost." },
        epoch_2: { fluxScale: 1.08, tempK: 57.5, iceScale: 0.96, flare: 0.15, visualNote: "Central protostar shockwave knot flared brighter in infrared." },
        epoch_3: { fluxScale: 0.96, tempK: 54.0, iceScale: 1.03, flare: -0.04, visualNote: "Dense foreground cloud shadow increased icy frost absorption." },
        epoch_4: { fluxScale: 1.04, tempK: 56.2, iceScale: 0.98, flare: 0.08, visualNote: "Active glowing jets illuminating newborn star clusters." }
      }
    },

    planet_x: {
      id: "planet_x",
      code: "Target H",
      name: "Planet X Candidate Sector",
      shortName: "Planet X Sector",
      categoryTag: "moving",
      categoryLabel: "🪐 Outer Solar System Hunt",
      nickname: "Distant Moving World Check",
      badgeText: "Faint Kuiper Belt Motion + Parallax Shift",
      cardHook: "Test how astronomers spot an unseen outer planet or distant icy dwarf planet drifting slowly against fixed background stars.",
      designation: "KBO Search Field • Outer Ecliptic",
      raDeg: 78.420,
      decDeg: 14.210,
      raHms: "05h 13m 40.8s",
      decDms: "+14° 12' 36.0\"",
      distanceLy: 0.0063,
      distanceLabel: "~400 AU (60 billion km from the Sun!)",
      speedKmS: 4.5,
      pmRaMasYr: -5400.0,
      pmDecMasYr: -2900.0,
      visualShiftPerYearPx: { dx: -28.0, dy: 16.0 },
      baseFluxMjy: 165.0,
      starColor: "#22d3ee",
      coreColor: "#ecfeff",
      nebulaColor: "#0ea5e9",
      haloStyle: "point_dwarf",
      iceProfile: { h2o: 0.85, co2: 0.22, ch4: 1.10 },
      termsUsed: ["parallax", "proper_motion", "arcsecond", "infrared_flux", "reference_stars", "epoch"],
      epochs: {
        epoch_1: { fluxScale: 1.00, tempK: 48.0, iceScale: 1.0, flare: 0.0, visualNote: "Faint icy candidate visible near top-right reference star." },
        epoch_2: { fluxScale: 1.02, tempK: 48.2, iceScale: 1.0, flare: 0.02, visualNote: "Slipped diagonally southwest across fixed distant stars!" },
        epoch_3: { fluxScale: 0.99, tempK: 47.9, iceScale: 1.01, flare: 0.0, visualNote: "Continues predictable orbital arc through starfield." },
        epoch_4: { fluxScale: 1.01, tempK: 48.0, iceScale: 1.0, flare: 0.01, visualNote: "Moved well clear of original marker — blinking proves it's in our Solar System!" }
      }
    }
  };

  // Plain-English Scientific Dictionary (shown in the wireframe's Left Sidebar!)
  const TERMS_GLOSSARY = {
    proper_motion: {
      id: "proper_motion",
      term: "Proper Motion (μ)",
      nickname: "Real Sideways Speed Across Space",
      simple: "How fast a star actually travels sideways across the sky compared to distant background stars.",
      analogy: "Like watching an airplane slowly cross in front of faraway mountains — closer or faster stars noticeably change spots over months!"
    },
    arcsecond: {
      id: "arcsecond",
      term: 'Arcsecond (")',
      nickname: "Tiny Sky Angle Ruler",
      simple: "A super-tiny measurement of angle on the sky. 3,600 arcseconds make just 1 degree!",
      analogy: "1 arcsecond is roughly the width of a coin viewed from 5 kilometers (3 miles) away. Even a shift of 5\" is giant to a telescope!"
    },
    infrared_flux: {
      id: "infrared_flux",
      term: "Infrared Flux (mJy)",
      nickname: "Heat-Glow Brightness Meter",
      simple: "How much invisible heat light (infrared energy) reaches SPHEREx from the object, measured in millijanskys (mJy).",
      analogy: "Just like night-vision goggles spot warm body heat in the dark, higher mJy means the object is glowing hotter or brighter in heat light."
    },
    epoch: {
      id: "epoch",
      term: "Epoch (Survey Pass)",
      nickname: "Telescope Photo Date",
      simple: "The exact calendar date when NASA's SPHEREx telescope photographed that patch of sky.",
      analogy: "SPHEREx circles Earth taking a full-sky photo album every 6 months. Comparing Epoch 1 vs Epoch 2 is like comparing a 2025 photo with a 2026 photo."
    },
    parallax: {
      id: "parallax",
      term: "Parallax Wobble",
      nickname: "Earth's Orbit 3D Trick",
      simple: "An apparent tiny back-and-forth wiggle in a nearby object's position caused because Earth itself moves around the Sun.",
      analogy: "Hold your thumb in front of your nose and blink left eye, then right eye — your thumb appears to jump left and right against the wall!"
    },
    water_ice: {
      id: "water_ice",
      term: "Water Ice Signature (3.05 µm)",
      nickname: "Space Frost Fingerprint",
      simple: "Frozen H₂O water ice absorbs a very specific heat color (3.05 microns), leaving a dip in the infrared rainbow.",
      analogy: "Like sunglasses blocking bright glare at one color — that missing color proves real water ice crystals are floating there!"
    },
    micron: {
      id: "micron",
      term: "Wavelength in Microns (µm)",
      nickname: "Heat Color Scale",
      simple: "Measures which shade of invisible infrared light we are looking at (from 0.75 µm near-red up to 5.0 µm deep heat).",
      analogy: "Humans only see rainbow colors between 0.4 and 0.7 µm. SPHEREx sees 102 infrared 'colors' invisible to human eyes."
    },
    protostar: {
      id: "protostar",
      term: "Class 0 Protostar",
      nickname: "Unborn Baby Sun",
      simple: "A very young star still forming inside a thick cocoon of cold gas and dust before normal nuclear burning settles.",
      analogy: "It's like a cosmic campfire still gathering wood — it occasionally flares bright as clumps of gas drop onto it."
    },
    accretion: {
      id: "accretion",
      term: "Episodic Accretion",
      nickname: "Cosmic Feeding Gulps",
      simple: "When a baby star or black hole pulls in a sudden clump of surrounding gas and dust, heating up suddenly.",
      analogy: "Tossing dry leaves onto embers — the fire suddenly flashes brighter and warmer for several months."
    },
    pulsation: {
      id: "pulsation",
      term: "Stellar Pulsation",
      nickname: "Star Breathing Cycle",
      simple: "Some aging giant stars rhythmically puff outward and shrink inward over months, making them dim and brighten.",
      analogy: "Like a giant balloon slowly inflating and deflating — when it swells or dumps cool dust, its brightness changes dramatically."
    },
    dust_shell: {
      id: "dust_shell",
      term: "Circumstellar Dust Shell",
      nickname: "Space Smoke Curtain",
      simple: "Tiny solid grains of carbon or rock puffed off a star that block visible light but glow warmly in infrared.",
      analogy: "Like campfire smoke blocking a flashlight beam while glowing orange in a thermal camera."
    },
    stellar_flare: {
      id: "stellar_flare",
      term: "Stellar Superflare",
      nickname: "Giant Magnetic Explosion",
      simple: "A sudden burst of twisted magnetic energy on a star's surface that blasts bright light and radiation into space.",
      analogy: "Thousands of times stronger than a solar flare on our Sun — a whole-star camera flash!"
    },
    exoplanet: {
      id: "exoplanet",
      term: "Exoplanet Host",
      nickname: "Alien Solar System Sun",
      simple: "A star orbited by planets outside our Solar System. Studying its flares tells us if those planets could keep oceans and air!",
      analogy: "If the parent star flashes too violently, neighboring rocky worlds have to survive harsh space weather."
    },
    brown_dwarf: {
      id: "brown_dwarf",
      term: "Y-Type Brown Dwarf",
      nickname: "Failed Star / Mega-Jupiter",
      simple: "An object heavier than Jupiter but too small to ignite like the Sun — lukewarm or even freezing cold!",
      analogy: "Think of a cold charcoal briquette instead of a blazing log: almost black to our eyes, but clearly visible to a heat camera."
    },
    reference_stars: {
      id: "reference_stars",
      term: "Background Reference Stars",
      nickname: "Fixed Sky Pushpins",
      simple: "Distant galaxies and faraway stars so unimaginably far off that they stay locked in place over a few years.",
      analogy: "Like painted trees on a distant backdrop — they stay still so we can immediately tell which foreground star actually moved!"
    },
    diffraction_spikes: {
      id: "diffraction_spikes",
      term: "Diffraction Cross Spikes",
      nickname: "Telescope Starburst Rays",
      simple: "The faint `+` or `×` light rays around very bright stars caused by the telescope's optics — brighter stars cast longer spikes!",
      analogy: "Just like squinting at a bright streetlight at night creates cross-shaped rays around the bulb."
    },
    luminosity: {
      id: "luminosity",
      term: "Luminosity Delta (Δ%)",
      nickname: "Brightness Percent Change",
      simple: "Tells you exactly how many percent brighter (`+%`) or dimmer (`-%`) the object became between Date 1 and Date 2.",
      analogy: "If Image 1 is 100 candles and Image 2 is 132 candles, that's `+32% Brighter`."
    }
  };

  // Deterministic PRNG so every target always gets the same authentic background stars!
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0;
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hashString(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  // Create or resolve target profile (supports custom searched targets!)
  function getTarget(targetId) {
    if (!targetId) return TARGETS.barnard;
    const key = String(targetId).toLowerCase().trim();
    if (TARGETS[key]) return TARGETS[key];

    // Search fuzzy aliases
    for (const t of Object.values(TARGETS)) {
      if (
        t.name.toLowerCase().includes(key) ||
        t.shortName.toLowerCase().includes(key) ||
        t.code.toLowerCase() === key ||
        t.nickname.toLowerCase().includes(key)
      ) {
        return t;
      }
    }

    // Dynamic deterministic custom star if user searches any custom name or coordinate!
    const h = hashString(key);
    const rng = mulberry32(h);
    const raDeg = parseFloat((rng() * 359).toFixed(4));
    const decDeg = parseFloat(((rng() - 0.5) * 140).toFixed(4));
    const pmRa = parseFloat(((rng() - 0.5) * 4500).toFixed(1));
    const pmDec = parseFloat(((rng() - 0.5) * 4500).toFixed(1));
    const brightSwing = 0.78 + rng() * 0.55;
    const label = targetId.trim().slice(0, 28);

    return {
      id: "custom_" + key.replace(/[^a-z0-9]/g, "_"),
      code: "Custom Star",
      name: `${label} (Custom Survey Sector)`,
      shortName: label,
      categoryTag: "moving",
      categoryLabel: "🔭 Custom Search Target",
      nickname: `Custom Sky Target: ${label}`,
      badgeText: "Live Simulated SPHEREx Sector",
      cardHook: "Custom coordinates/object sampled across multi-epoch infrared passes.",
      designation: `SPHEREx Custom Query • J2000`,
      raDeg,
      decDeg,
      raHms: `${String(Math.floor(raDeg / 15)).padStart(2, "0")}h ${String(Math.floor(rng() * 59)).padStart(2, "0")}m ${String((rng() * 59).toFixed(1))}s`,
      decDms: `${decDeg >= 0 ? "+" : "-"}${String(Math.floor(Math.abs(decDeg))).padStart(2, "0")}° ${String(Math.floor(rng() * 59)).padStart(2, "0")}'`,
      distanceLy: parseFloat((12 + rng() * 650).toFixed(1)),
      distanceLabel: `~${Math.round(12 + rng() * 650)} light-years away`,
      speedKmS: Math.round(18 + rng() * 95),
      pmRaMasYr: pmRa,
      pmDecMasYr: pmDec,
      visualShiftPerYearPx: { dx: pmRa / 220, dy: -pmDec / 220 },
      baseFluxMjy: Math.round(450 + rng() * 1400),
      starColor: rng() > 0.5 ? "#fb923c" : "#38bdf8",
      coreColor: "#ffffff",
      haloStyle: rng() > 0.5 ? "point_dwarf" : "pulsing_supergiant",
      iceProfile: { h2o: rng() > 0.6 ? 0.9 : 0.0, co2: rng() > 0.7 ? 0.5 : 0.0, ch4: 0.0 },
      termsUsed: ["proper_motion", "infrared_flux", "arcsecond", "epoch", "reference_stars", "luminosity"],
      epochs: {
        epoch_1: { fluxScale: 1.00, tempK: 3600, iceScale: 1.0, flare: 0.0, visualNote: "Baseline SPHEREx survey frame." },
        epoch_2: { fluxScale: brightSwing, tempK: Math.round(3600 * (0.95 + brightSwing * 0.08)), iceScale: 0.95, flare: brightSwing - 1, visualNote: "Noticeable multi-epoch intensity & coordinate evolution." },
        epoch_3: { fluxScale: parseFloat((0.92 + rng() * 0.2).toFixed(2)), tempK: 3580, iceScale: 1.02, flare: 0.05, visualNote: "Mid-survey monitoring pass." },
        epoch_4: { fluxScale: parseFloat((0.95 + rng() * 0.25).toFixed(2)), tempK: 3640, iceScale: 0.98, flare: 0.1, visualNote: "Latest survey pass comparison." }
      }
    };
  }

  function getEpochMeta(epochId) {
    return EPOCHS.find(e => e.id === epochId) || EPOCHS[0];
  }

  // Compute target pixel position & sky metrics at a given epoch
  function computeEpochMetrics(target, epochId) {
    const ep = getEpochMeta(epochId);
    const baseMjd = EPOCHS[0].mjd;
    const dtYears = (ep.mjd - baseMjd) / 365.25;
    const varState = target.epochs[ep.id] || target.epochs.epoch_1;

    const draArcsec = (target.pmRaMasYr * dtYears) / 1000.0;
    const ddecArcsec = (target.pmDecMasYr * dtYears) / 1000.0;
    const totalArcsecFromE1 = Math.sqrt(draArcsec * draArcsec + ddecArcsec * ddecArcsec);

    const fluxMjy = target.baseFluxMjy * varState.fluxScale;
    const cx = 210 + target.visualShiftPerYearPx.dx * dtYears;
    const cy = 210 + target.visualShiftPerYearPx.dy * dtYears;

    // Brightness friendly category
    let brightnessWord = "Steady Glow";
    if (fluxMjy > 2200) brightnessWord = "Ultra-Bright Heat Beacon";
    else if (fluxMjy > 1000) brightnessWord = "Strong Bright Glow";
    else if (fluxMjy > 400) brightnessWord = "Medium Clear Glow";
    else brightnessWord = "Faint Cool Ember";

    return {
      epoch: ep,
      dtYears,
      draArcsec,
      ddecArcsec,
      totalArcsecFromE1,
      fluxMjy,
      fluxScale: varState.fluxScale,
      tempK: varState.tempK,
      iceScale: varState.iceScale,
      flare: varState.flare,
      visualNote: varState.visualNote,
      brightnessWord,
      pixelCenter: { x: cx, y: cy }
    };
  }

  // Compare two epochs and return unified Citizen Comparison Snapshot
  function compareTargetEpochs(targetId, epochAId, epochBId) {
    const target = getTarget(targetId);
    const mA = computeEpochMetrics(target, epochAId);
    const mB = computeEpochMetrics(target, epochBId);

    const dRa = mB.draArcsec - mA.draArcsec;
    const dDec = mB.ddecArcsec - mA.ddecArcsec;
    const separationArcsec = Math.sqrt(dRa * dRa + dDec * dDec);
    const fluxDeltaMjy = mB.fluxMjy - mA.fluxMjy;
    const fluxDeltaPct = ((mB.fluxMjy - mA.fluxMjy) / Math.max(mA.fluxMjy, 1e-4)) * 100.0;
    const tempDeltaK = mB.tempK - mA.tempK;
    const iceDeltaPct = ((mB.iceScale - mA.iceScale) / Math.max(mA.iceScale || 1, 1)) * 100.0;
    const daysApart = Math.round(mB.epoch.mjd - mA.epoch.mjd);

    // Direction string
    let paDeg = (Math.atan2(dRa, dDec) * 180) / Math.PI;
    if (paDeg < 0) paDeg += 360;
    let compassDir = "Stationary";
    if (separationArcsec > 0.08) {
      if (paDeg < 22.5 || paDeg >= 337.5) compassDir = "North ↑";
      else if (paDeg < 67.5) compassDir = "North-East ↗";
      else if (paDeg < 112.5) compassDir = "East →";
      else if (paDeg < 157.5) compassDir = "South-East ↘";
      else if (paDeg < 202.5) compassDir = "South ↓";
      else if (paDeg < 247.5) compassDir = "South-West ↙";
      else if (paDeg < 292.5) compassDir = "West ←";
      else compassDir = "North-West ↖";
    }

    const movedSignificantly = separationArcsec >= 0.35;
    const brightenedSignificantly = Math.abs(fluxDeltaPct) >= 5.0;
    const hasIce = (target.iceProfile.h2o + target.iceProfile.co2) > 0.2;

    return {
      target,
      epochA: mA,
      epochB: mB,
      delta: {
        daysApart,
        dRaArcsec: dRa,
        dDecArcsec: dDec,
        separationArcsec,
        compassDir,
        pixelShiftPx: Math.hypot(
          mB.pixelCenter.x - mA.pixelCenter.x,
          mB.pixelCenter.y - mA.pixelCenter.y
        ),
        fluxDeltaMjy,
        fluxDeltaPct,
        tempDeltaK,
        iceDeltaPct,
        movedSignificantly,
        brightenedSignificantly,
        hasIce
      }
    };
  }

  /**
   * Renders a crisp 420x420 realistic infrared telescope snapshot for a target + epoch.
   * Returns a Canvas element (or draws onto provided canvas).
   */
  function renderEpochCanvas(target, metrics, options = {}) {
    const size = options.size || 420;
    const showOverlays = options.showOverlays !== false;
    const showGrid = options.showGrid !== false;
    const morphRefCenter = options.overrideCenter || metrics.pixelCenter;
    const overrideFluxScale = options.overrideFluxScale !== undefined ? options.overrideFluxScale : metrics.fluxScale;
    const overrideFlare = options.overrideFlare !== undefined ? options.overrideFlare : metrics.flare;

    const canvas = options.canvas || document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    const scale = size / 420;

    // 1. Deep infrared detector backdrop
    ctx.fillStyle = "#040711";
    ctx.fillRect(0, 0, size, size);

    // Subtle thermal background gradient
    const bgGrad = ctx.createRadialGradient(
      size * 0.5, size * 0.5, size * 0.05,
      size * 0.5, size * 0.5, size * 0.72
    );
    bgGrad.addColorStop(0, "rgba(15, 32, 62, 0.38)");
    bgGrad.addColorStop(1, "rgba(3, 5, 12, 0.0)");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, size, size);

    // 2. Deterministic Fixed Reference Stars & Subtle Detector Grain
    const rng = mulberry32(hashString(target.id + "_skyfield_v2"));
    // Faint infrared noise speckles (deterministic per field, with tiny epoch jitter)
    const epochNoiseRng = mulberry32(hashString(target.id + "_" + metrics.epoch.id));
    for (let i = 0; i < 160; i++) {
      const nx = epochNoiseRng() * size;
      const ny = epochNoiseRng() * size;
      const alpha = 0.03 + epochNoiseRng() * 0.06;
      ctx.fillStyle = `rgba(148, 163, 184, ${alpha.toFixed(3)})`;
      ctx.fillRect(nx, ny, 1.4 * scale, 1.4 * scale);
    }

    // Background fixed reference stars ("sky pushpins")
    const refCoords = [];
    for (let i = 0; i < 36; i++) {
      const sx = (24 + rng() * 372) * scale;
      const sy = (24 + rng() * 372) * scale;
      const r = (0.9 + rng() * 2.1) * scale;
      const tempTint = rng();
      const tint = tempTint > 0.72 ? "253, 224, 171" : (tempTint < 0.3 ? "147, 197, 253" : "226, 232, 240");
      const alpha = 0.35 + rng() * 0.55;

      // Keep center area clear of bright accidental overlaps on Barnard's start spot
      if (Math.hypot(sx - 210 * scale, sy - 210 * scale) < 28 * scale) continue;

      const sGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 3.8);
      sGrad.addColorStop(0, `rgba(${tint}, ${alpha})`);
      sGrad.addColorStop(0.35, `rgba(${tint}, ${alpha * 0.45})`);
      sGrad.addColorStop(1, `rgba(${tint}, 0)`);
      ctx.fillStyle = sGrad;
      ctx.beginPath();
      ctx.arc(sx, sy, r * 3.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, alpha + 0.15)})`;
      ctx.beginPath();
      ctx.arc(sx, sy, r * 0.65, 0, Math.PI * 2);
      ctx.fill();

      if (i < 4) refCoords.push({ x: sx, y: sy });
    }

    // Optional coordinate grid overlay
    if (showGrid) {
      ctx.strokeStyle = "rgba(56, 189, 248, 0.08)";
      ctx.lineWidth = 1;
      for (let g = 70; g < 420; g += 70) {
        ctx.beginPath();
        ctx.moveTo(g * scale, 0);
        ctx.lineTo(g * scale, size);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, g * scale);
        ctx.lineTo(size, g * scale);
        ctx.stroke();
      }
    }

    // 3. Render Main Celestial Target at exact epoch center & flux state
    const cx = morphRefCenter.x * scale;
    const cy = morphRefCenter.y * scale;
    const intensity = Math.max(0.45, Math.min(2.0, overrideFluxScale));

    if (target.haloStyle === "hourglass_protostar") {
      // L1527 Hourglass Outflow Nebula + Equatorial Dark Lane + Water Ice Aura
      const iceStrength = metrics.iceScale || 1.0;
      const iceGrad = ctx.createRadialGradient(cx, cy, 12 * scale, cx, cy, 130 * scale);
      iceGrad.addColorStop(0, `rgba(56, 189, 248, ${0.32 * iceStrength})`);
      iceGrad.addColorStop(0.55, `rgba(14, 165, 233, ${0.15 * iceStrength})`);
      iceGrad.addColorStop(1, "rgba(14, 165, 233, 0)");
      ctx.fillStyle = iceGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 130 * scale, 0, Math.PI * 2);
      ctx.fill();

      // Bipolar cones left & right
      [-1, 1].forEach(dir => {
        const coneGrad = ctx.createRadialGradient(
          cx + dir * 24 * scale, cy, 4 * scale,
          cx + dir * 75 * scale, cy, 92 * scale
        );
        coneGrad.addColorStop(0, `rgba(251, 146, 60, ${0.58 * intensity})`);
        coneGrad.addColorStop(0.5, `rgba(56, 189, 248, ${0.26 * iceStrength})`);
        coneGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = coneGrad;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + dir * 115 * scale, cy - 62 * scale);
        ctx.lineTo(cx + dir * 115 * scale, cy + 62 * scale);
        ctx.closePath();
        ctx.fill();
      });

      // Dark equatorial dust lane
      ctx.fillStyle = "rgba(4, 7, 17, 0.78)";
      ctx.fillRect(cx - 5 * scale, cy - 68 * scale, 10 * scale, 136 * scale);

      drawBrightPSF(ctx, cx, cy, 26 * scale * Math.sqrt(intensity), "#fb923c", "#fef3c7", 0.9 * intensity);

    } else if (target.haloStyle === "pulsing_supergiant") {
      // Betelgeuse: huge bloated dust envelope + starburst spikes varying sharply with pulsation
      const dustGrad = ctx.createRadialGradient(cx, cy, 10 * scale, cx, cy, 118 * scale * intensity);
      dustGrad.addColorStop(0, `rgba(255, 247, 237, ${0.95})`);
      dustGrad.addColorStop(0.22, `rgba(249, 115, 22, ${0.75 * intensity})`);
      dustGrad.addColorStop(0.55, `rgba(239, 68, 68, ${0.28 * intensity})`);
      dustGrad.addColorStop(1, "rgba(239, 68, 68, 0)");
      ctx.fillStyle = dustGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 118 * scale * intensity, 0, Math.PI * 2);
      ctx.fill();

      drawDiffractionSpikes(ctx, cx, cy, 85 * scale * intensity, "rgba(253, 186, 116, 0.75)");
      drawBrightPSF(ctx, cx, cy, 34 * scale * intensity, "#f97316", "#fffbeb", 1.0);

    } else if (target.haloStyle === "flare_dwarf") {
      // TRAPPIST-1: red dwarf + faint planetary orbit rings + dramatic flare shockwaves when flaring
      ctx.strokeStyle = "rgba(244, 63, 94, 0.16)";
      ctx.lineWidth = 1;
      [26, 42, 62].forEach(rad => {
        ctx.beginPath();
        ctx.ellipse(cx, cy, rad * scale, rad * 0.48 * scale, -0.32, 0, Math.PI * 2);
        ctx.stroke();
      });

      if (overrideFlare > 0.25) {
        const fGrad = ctx.createRadialGradient(cx, cy, 4 * scale, cx, cy, 98 * scale * overrideFlare);
        fGrad.addColorStop(0, "rgba(255, 255, 255, 0.98)");
        fGrad.addColorStop(0.28, "rgba(250, 204, 21, 0.75)");
        fGrad.addColorStop(0.65, "rgba(244, 63, 94, 0.35)");
        fGrad.addColorStop(1, "rgba(244, 63, 94, 0)");
        ctx.fillStyle = fGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 98 * scale * overrideFlare, 0, Math.PI * 2);
        ctx.fill();
        drawDiffractionSpikes(ctx, cx, cy, 78 * scale, "rgba(254, 240, 138, 0.92)");
      }
      drawBrightPSF(ctx, cx, cy, 24 * scale * Math.sqrt(intensity), "#f43f5e", "#fff1f2", 0.95);

    } else if (target.haloStyle === "colliding_galaxies") {
      // IRAS 08572: Twin spiral nuclei + tidal dust streams
      drawGalaxyTidalArm(ctx, cx - 26 * scale, cy - 12 * scale, 88 * scale, intensity, "#f43f5e", "#a855f7", -0.5);
      drawGalaxyTidalArm(ctx, cx + 24 * scale, cy + 16 * scale, 74 * scale, intensity * 0.9, "#fb923c", "#f43f5e", 0.8);
      drawBrightPSF(ctx, cx - 18 * scale, cy - 8 * scale, 22 * scale * intensity, "#f43f5e", "#fef08a", intensity);
      drawBrightPSF(ctx, cx + 18 * scale, cy + 12 * scale, 16 * scale, "#fb923c", "#fff7ed", 0.85);

    } else if (target.haloStyle === "nebula_nursery") {
      // Orion KL: rich billowing icy/hot star factory nebula
      const clouds = [
        { ox: -32, oy: -18, r: 96, col: "56, 189, 248" },
        { ox: 28, oy: 20, r: 88, col: "52, 211, 153" },
        { ox: 0, oy: 0, r: 74, col: "251, 191, 36" }
      ];
      clouds.forEach(c => {
        const g = ctx.createRadialGradient(
          cx + c.ox * scale, cy + c.oy * scale, 6 * scale,
          cx + c.ox * scale, cy + c.oy * scale, c.r * scale * Math.sqrt(intensity)
        );
        g.addColorStop(0, `rgba(${c.col}, ${0.42 * intensity})`);
        g.addColorStop(0.55, `rgba(${c.col}, 0.14)`);
        g.addColorStop(1, `rgba(${c.col}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx + c.ox * scale, cy + c.oy * scale, c.r * scale * Math.sqrt(intensity), 0, Math.PI * 2);
        ctx.fill();
      });
      drawDiffractionSpikes(ctx, cx, cy, 62 * scale * intensity, "rgba(186, 230, 253, 0.7)");
      drawBrightPSF(ctx, cx, cy, 24 * scale * intensity, "#38bdf8", "#ffffff", 1.0);
      drawBrightPSF(ctx, cx - 28 * scale, cy + 22 * scale, 12 * scale, "#34d399", "#ecfeff", 0.8);

    } else if (target.haloStyle === "cold_brown_dwarf") {
      // WISE 0855: Cold faint indigo/teal infrared dot moving briskly
      drawBrightPSF(ctx, cx, cy, 22 * scale * intensity, "#22d3ee", "#e0f2fe", 0.85);

    } else {
      // Default Point Star / Barnard's Star / Planet X: clean bright PSF + subtle reticle aura
      drawDiffractionSpikes(ctx, cx, cy, 42 * scale * Math.sqrt(intensity), "rgba(255, 215, 160, 0.65)");
      drawBrightPSF(ctx, cx, cy, 26 * scale * Math.sqrt(intensity), target.starColor || "#fb923c", target.coreColor || "#ffffff", intensity);
    }

    // 4. Optional Beginner Helper Overlays (Tracking Reticle & Starting Spot Anchor)
    if (showOverlays) {
      // Faint dashed crosshair at Epoch 1 origin (so ANY movement immediately jumps out visually!)
      const startX = 210 * scale;
      const startY = 210 * scale;
      const distFromStart = Math.hypot(cx - startX, cy - startY);

      if (distFromStart > 3 * scale) {
        ctx.save();
        ctx.setLineDash([4 * scale, 4 * scale]);
        ctx.strokeStyle = "rgba(148, 163, 184, 0.55)";
        ctx.lineWidth = 1.2 * scale;
        ctx.beginPath();
        ctx.arc(startX, startY, 15 * scale, 0, Math.PI * 2);
        ctx.stroke();

        // Motion arrow from start spot to current spot
        ctx.strokeStyle = "rgba(56, 189, 248, 0.75)";
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(cx, cy);
        ctx.stroke();
        ctx.restore();
      }

      // Target lock ring around current star spot
      ctx.save();
      ctx.strokeStyle = metrics.epoch.id === "epoch_1" ? "rgba(56, 189, 248, 0.78)" : "rgba(251, 191, 36, 0.85)";
      ctx.lineWidth = 1.5 * scale;
      ctx.setLineDash([5 * scale, 4 * scale]);
      ctx.beginPath();
      ctx.arc(cx, cy, 24 * scale, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    return canvas;
  }

  function drawBrightPSF(ctx, x, y, radius, outerHex, coreHex, alphaScale) {
    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
    grad.addColorStop(0, coreHex);
    grad.addColorStop(0.28, outerHex);
    grad.addColorStop(0.65, hexToRgba(outerHex, 0.28 * Math.min(1.2, alphaScale)));
    grad.addColorStop(1, hexToRgba(outerHex, 0));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawDiffractionSpikes(ctx, x, y, len, color) {
    ctx.save();
    const hGrad = ctx.createLinearGradient(x - len, y, x + len, y);
    hGrad.addColorStop(0, "rgba(0,0,0,0)");
    hGrad.addColorStop(0.5, color);
    hGrad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.strokeStyle = hGrad;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(x - len, y);
    ctx.lineTo(x + len, y);
    ctx.stroke();

    const vGrad = ctx.createLinearGradient(x, y - len, x, y + len);
    vGrad.addColorStop(0, "rgba(0,0,0,0)");
    vGrad.addColorStop(0.5, color);
    vGrad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.strokeStyle = vGrad;
    ctx.beginPath();
    ctx.moveTo(x, y - len);
    ctx.lineTo(x, y + len);
    ctx.stroke();
    ctx.restore();
  }

  function drawGalaxyTidalArm(ctx, x, y, size, intensity, col1, col2, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    const g = ctx.createRadialGradient(0, 0, 2, 0, 0, size);
    g.addColorStop(0, hexToRgba(col1, 0.55 * intensity));
    g.addColorStop(0.5, hexToRgba(col2, 0.25 * intensity));
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.scale(1.6, 0.65);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.65, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function hexToRgba(hex, alpha) {
    const clean = hex.replace("#", "");
    const bigint = parseInt(clean, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha)).toFixed(3)})`;
  }

  /**
   * Real pixel-by-pixel Difference Map (Image B minus Image A):
   * Bright green/cyan = Got brighter or moved HERE in Date 2
   * Glowing crimson/amber = Got dimmer or LEFT this spot from Date 1
   * Dark neutral = Unchanged background stars cancel out!
   */
  function renderDifferenceCanvas(target, metricsA, metricsB, outCanvas, showOverlays) {
    const size = 420;
    const cA = renderEpochCanvas(target, metricsA, { size, showOverlays: false, showGrid: false });
    const cB = renderEpochCanvas(target, metricsB, { size, showOverlays: false, showGrid: false });

    outCanvas.width = size;
    outCanvas.height = size;
    const ctx = outCanvas.getContext("2d");

    const dataA = cA.getContext("2d").getImageData(0, 0, size, size).data;
    const dataB = cB.getContext("2d").getImageData(0, 0, size, size).data;
    const outImg = ctx.createImageData(size, size);
    const dst = outImg.data;

    for (let i = 0; i < dst.length; i += 4) {
      const lumA = 0.299 * dataA[i] + 0.587 * dataA[i + 1] + 0.114 * dataA[i + 2];
      const lumB = 0.299 * dataB[i] + 0.587 * dataB[i + 1] + 0.114 * dataB[i + 2];
      const diff = lumB - lumA;

      if (Math.abs(diff) < 8) {
        // Unchanged dark baseline
        dst[i] = 8;
        dst[i + 1] = 12;
        dst[i + 2] = 24;
        dst[i + 3] = 255;
      } else if (diff > 0) {
        // Appeared / Brightened -> Electric Emerald / Cyan
        const amp = Math.min(255, diff * 2.2);
        dst[i] = Math.round(amp * 0.18);
        dst[i + 1] = Math.round(Math.min(255, amp * 1.05));
        dst[i + 2] = Math.round(Math.min(255, amp * 0.85));
        dst[i + 3] = 255;
      } else {
        // Left / Dimmed -> Rose / Crimson
        const amp = Math.min(255, (-diff) * 2.2);
        dst[i] = Math.round(Math.min(255, amp * 1.1));
        dst[i + 1] = Math.round(amp * 0.22);
        dst[i + 2] = Math.round(amp * 0.42);
        dst[i + 3] = 255;
      }
    }

    ctx.putImageData(outImg, 0, 0);

    if (showOverlays) {
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.font = "600 11px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#34d399";
      ctx.fillText("GREEN/CYAN = New Spot / Brighter in Img 2", 14, 24);
      ctx.fillStyle = "#fb7185";
      ctx.fillText("RED/PINK = Old Spot / Dimmer from Img 1", 14, 42);
    }
    return outCanvas;
  }

  /**
   * Ghost Overlay Canvas: Renders Date 1 tinted Cyan + Date 2 tinted Amber with motion trail arrow.
   */
  function renderGhostOverlayCanvas(target, metricsA, metricsB, outCanvas, showOverlays) {
    const size = 420;
    const cA = renderEpochCanvas(target, metricsA, { size, showOverlays: false, showGrid: true });
    const cB = renderEpochCanvas(target, metricsB, { size, showOverlays: false, showGrid: false });

    outCanvas.width = size;
    outCanvas.height = size;
    const ctx = outCanvas.getContext("2d");

    ctx.fillStyle = "#040711";
    ctx.fillRect(0, 0, size, size);

    ctx.globalAlpha = 0.72;
    ctx.drawImage(cA, 0, 0);
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 0.8;
    ctx.drawImage(cB, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1.0;

    if (showOverlays) {
      const p1 = metricsA.pixelCenter;
      const p2 = metricsB.pixelCenter;
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p1.x, p1.y, 18, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(p2.x, p2.y, 22, 0, Math.PI * 2);
      ctx.stroke();

      if (Math.hypot(p2.x - p1.x, p2.y - p1.y) > 4) {
        ctx.strokeStyle = "#f8fafc";
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.font = "600 11px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#38bdf8";
      ctx.fillText(`BLUE CIRCLE = ${metricsA.epoch.shortDate}`, 14, 24);
      ctx.fillStyle = "#fbbf24";
      ctx.fillText(`GOLD CIRCLE = ${metricsB.epoch.shortDate}`, 14, 42);
    }
    return outCanvas;
  }

  function getAllTargetsList() {
    return Object.values(TARGETS);
  }

  function getTermsForTarget(target) {
    const keys = target && target.termsUsed ? target.termsUsed : ["proper_motion", "infrared_flux", "epoch", "arcsecond"];
    return keys.map(k => TERMS_GLOSSARY[k]).filter(Boolean);
  }

  function getAllTerms() {
    return Object.values(TERMS_GLOSSARY);
  }

  return {
    EPOCHS,
    TARGETS,
    TERMS_GLOSSARY,
    getAllTargetsList,
    getTarget,
    getEpochMeta,
    computeEpochMetrics,
    compareTargetEpochs,
    renderEpochCanvas,
    renderDifferenceCanvas,
    renderGhostOverlayCanvas,
    getTermsForTarget,
    getAllTerms
  };
})();
