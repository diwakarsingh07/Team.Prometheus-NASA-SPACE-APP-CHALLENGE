/**
 * ============================================================================
 * PROMETHEUS CITIZEN SCIENCE Q&A AGENT (citizen_agent.js)
 * Dedicated autonomous interpreter module for Citizen Mode.
 * Converts raw multi-epoch comparison metrics into detailed plain-English
 * Question & Answer breakdowns explaining:
 *   1. Exact changes between Image 1 & Image 2
 *   2. Physical cause in deep space
 *   3. How astronomers & NASA SPHEREx scientists use these findings
 *   4. Interactive natural-language Q&A for citizen explorers
 * ============================================================================
 */

window.CitizenScienceAgent = (function () {
  "use strict";

  function formatSigned(num, decimals = 1, unit = "") {
    const sign = num > 0 ? "+" : "";
    return `${sign}${num.toFixed(decimals)}${unit}`;
  }

  function describeMagnitudeScale(arcsec) {
    if (arcsec < 0.1) return "essentially locked in the same sky spot (less than 1/10th of an arcsecond)";
    if (arcsec < 1.0) return `a subtle precision wobble of ${arcsec.toFixed(2)}" (smaller than 1 pixel width!)`;
    if (arcsec < 4.0) return `a clear drift of ${arcsec.toFixed(2)}" — easy to spot in Blink & Ghost Overlay modes`;
    return `a HUGE leap of ${arcsec.toFixed(2)}" across the starfield — you can see it move with your bare eyes!`;
  }

  function getTargetSpecificPhysics(target, epA, epB, d) {
    const absFluxPct = Math.abs(d.fluxDeltaPct).toFixed(1);
    const brightDir = d.fluxDeltaPct >= 0 ? "brighter" : "dimmer";

    const map = {
      barnard: {
        whatCause: `Barnard's Star is hurtling through our Milky Way at ~${target.speedKmS} km/s (over 500,000 km/hour!), AND it happens to be right next door at only ${target.distanceLy} light-years away. Because it's both close and super fast, its sideways drift ("proper motion") adds up quickly across just ${Math.abs(d.daysApart)} days.`,
        howHelpsScientists: `1) **Measuring Hidden Planets (Wobble Method):** Tracking exact sky positions across dates lets astronomers spot tiny sideways tugs caused by orbiting exoplanets!\n2) **Calibrating Moving-Object Pipelines (like Planet X!):** Before claiming a faint dot is an unknown Planet X, SPHEREx scientists test their motion software on Barnard's Star to prove pixel-shift math works accurately.\n3) **True 3D Star Velocity:** Combining sideways jump with radial speed maps how ancient stars orbit the Milky Way center.`,
        eyeTest: `Even though Barnard's Star moves faster across the sky than ANY other star besides our Sun, it is too dim for naked human eyes (magnitude 9.5) and shifts by ${d.separationArcsec.toFixed(2)}" — like watching a coin shift half its width from 3 km away! Only telescopes or Blink comparators catch it immediately.`,
        lifeWater: `Barnard's Star is a cold red dwarf (~3,130 K) with no thick cosmic ice nebula around it (H₂O ice index = 0). Instead, scientists study its atmosphere's steam & carbon monoxide lines and search its nearby orbit for cold rocky sub-Earth planets.`,
        nextPrediction: `Every single 6-month SPHEREx pass moves Barnard's Star another ~5.18 arcseconds nearly straight North-Northwest. Over your lifetime (~80 years), it will travel half the width of a full Moon across the sky!`
      },
      l1527: {
        whatCause: `L1527 is a 100,000-year-old "baby star" still buried inside an hourglass cocoon of gas and space frost. Between ${epA.epoch.shortDate} and ${epB.epoch.shortDate}, clumps of cold dust rained onto the newborn star core (a process called accretion), heating the core by ${formatSigned(d.tempDeltaK, 1, " K")} and making the glowing outflow cones ${absFluxPct}% ${brightDir}.`,
        howHelpsScientists: `1) **Where Earth's Oceans Came From:** SPHEREx checks the 3.05 µm water-ice dip between cold and warm dates to measure how much frozen H₂O survives star-birth heat and enters baby asteroids and planets!\n2) **Tracking Baby Sun Growth Spurts:** Watching brightness rise and cool tells theorists how fast gas spirals onto newborn suns.\n3) **Life's Starter Ingredients:** Comparing CO₂ dry ice and methanol frost reveals organic molecules forming before planets even exist.`,
        eyeTest: `To normal visible-light eyes or a regular optical camera, L1527 is pitch dark — blocked completely by thick dust! Only infrared "heat-vision" cameras like SPHEREx (0.75–5.0 µm) pierce straight through the hourglass dust walls to capture this glow.`,
        lifeWater: `YES — this target is packed with REAL frozen cosmic frost! Both H₂O water ice (depth index ${target.iceProfile.h2o}) and CO₂ dry ice (${target.iceProfile.co2}) coat the dusty blanket around the baby star, fluctuating slightly (${formatSigned(d.iceDeltaPct, 1, "%")}) as the central star heats and cools.`,
        nextPrediction: `Over the next 6 to 12 months, as the accretion gulp settles back down, SPHEREx expects the warm hourglass cones to cool slightly while water-ice crystals re-freeze closer to the forming planet disk.`
      },
      betelgeuse: {
        whatCause: `Betelgeuse is a gigantic aging red supergiant (~700× wider than our Sun!). It acts like a boiling pot with giant convection bubbles: over ~400-day cycles it physically swells and shrinks, AND occasionally belches huge silicate dust clouds that temporarily block its heat glow — causing a ${absFluxPct}% ${brightDir} swing between these two dates!`,
        howHelpsScientists: `1) **Supernova Early Warning System:** Tracking Betelgeuse's multi-epoch heat brightness & dust dips separates normal "breathing" pulsations from genuine pre-explosion instability.\n2) **How Stardust Seeds New Planets:** When aging giants puff away rocky silicate dust shells, those grains drift out to become future rocky planets like Earth.\n3) **Testing Giant Star Interiors:** Measuring temperature shifts (${formatSigned(d.tempDeltaK, 0, " K")}) reveals churning convective cells larger than Earth's orbit.`,
        eyeTest: `You CAN actually see Betelgeuse with your naked eyes as the bright orange-red shoulder star of Orion! Humans can even notice big 30%+ brightness drops (like the famous 2019 Great Dimming), though SPHEREx's infrared camera reveals whether dust clouds or internal cooling caused it.`,
        lifeWater: `Betelgeuse is far too scorching (~3,400 K) for liquid water or ice, though cooler outer gas envelopes do form carbon monoxide (CO) gas and rocky dust grains — the raw mineral ash from which future rocky worlds are built.`,
        nextPrediction: `Because Betelgeuse breathes on a ~400-day fundamental pulse plus a ~2,100-day secondary cycle, comparing Epoch 3 & Epoch 4 lets scientists map both the recovery after dust ejection and the next peak glow.`
      },
      trappist1: {
        whatCause: `TRAPPIST-1 is an ultra-cool red dwarf star hosting 7 Earth-sized rocky planets tightly packed closer than Mercury! Red dwarfs have twisted magnetic fields that snap violently, triggering huge stellar superflares — explaining explosive heat jumps like Epoch 2 (+48% brightness & +360 K core spike) alongside a fast sideways drift (${target.pmRaMasYr} mas/yr).`,
        howHelpsScientists: `1) **Can Life Survive Around Red Dwarfs?** Most potentially habitable rocky planets in our galaxy orbit stars like TRAPPIST-1. Knowing how often and how violently the star flares tells astrobiologists if those 7 worlds can keep their oceans and atmospheres!\n2) **Precision Proper-Motion Anchoring:** Its ~1"/yr sideways slide confirms exact target separation from background stars.\n3) **Photometric Stability Calibration:** Separates quiet star heat from magnetic flare bursts.`,
        eyeTest: `TRAPPIST-1 is 2,000× dimmer than our Sun in visible light and completely invisible without a large telescope — yet in SPHEREx's near-infrared heat bands, its cool surface glows clearly enough to catch magnetic flares in the act!`,
        lifeWater: `The star itself has no interstellar frost envelope, BUT 3 or 4 of its 7 Earth-sized planets sit in the "habitable zone" where liquid water could pool! Studying the parent star's flare outbursts is critical to knowing if those oceans survive.`,
        nextPrediction: `After an energetic flare bursts out (Epoch 2), the magnetic loop cools rapidly back to ~2,560 K baseline (Epochs 3 & 4) while the whole planetary system steadily marches Southeast across the sky.`
      },
      wise0855: {
        whatCause: `WISE 0855-0714 is a "failed star" (Y-type brown dwarf) only 7.27 light-years away — as cold as Earth's North Pole (~ -10°C / 255 K)! Just like our neighbor Barnard's Star, its extreme closeness and fast 92 km/s speed through space make it sprint westward at ~8.1 arcseconds per year across background stars, while patchy water-ice clouds subtly vary its heat brightness (${absFluxPct}% ${brightDir}).`,
        howHelpsScientists: `1) **Direct Twin of Giant Ice Exoplanets:** Because WISE 0855 floats alone without a blinding parent star, its 255 K atmosphere lets scientists study real water-ice clouds directly!\n2) **Closest Neighborhood Census:** Proves how infrared time-domain surveys catch dark, icy rogue worlds hidden right in our Sun's backyard.\n3) **Planet X / Sub-stellar Benchmark:** Moves almost identically to how an outer giant rogue world moves in SPHEREx images!`,
        eyeTest: `Completely pitch-black in optical light! Not even Hubble in visible colors can easily see it. ONLY cold infrared space telescopes like SPHEREx and JWST detect its gentle 4–5 micron thermal glow.`,
        lifeWater: `YES — incredible weather alert! WISE 0855 actually has **water-ice clouds** floating inside its frigid atmosphere (similar to Jupiter's water clouds, just much colder!), making it a benchmark laboratory for icy planet weather.`,
        nextPrediction: `Over Epoch 3 and Epoch 4, WISE 0855 continues sprinting straight westward (~4 arcsec every 6 months) with subtle ±4% cloud-patch brightness ripples as it rotates.`
      },
      iras08572: {
        whatCause: `IRAS 08572+3915 is 780 million light-years away — two entire spiral galaxies colliding! Because it's so unimaginably distant, it looks completely motionless in position over 6 months (0.00" shift). What DOES change is its brightness (${absFluxPct}% ${brightDir}): turbulent dusty clouds drift in front of the supermassive black hole engine at its core, alternatively shading and illuminating its blazing center.`,
        howHelpsScientists: `1) **Probing Hidden Supermassive Black Holes:** Most colliding galaxy cores are trapped behind walls of soot and frost. Infrared brightness flickers tell astronomers how rapidly the black hole swallows gas!\n2) **Measuring Cosmic Dust & Dry Ice in Distant Galaxies:** Tracks whether organic carbon dust & CO₂ frost exist the same way far across the universe as in our Milky Way.\n3) **Static Deep-Sky Anchor:** Zero position shift gives astronomers a rock-solid distant reference contrast against nearby moving stars!`,
        eyeTest: `Zero chance with naked eyes — at 780 million light-years away, even the entire Milky Way colliding appears as a faint smudge only detectable by sensitive deep-sky infrared instruments.`,
        lifeWater: `Surprisingly YES — deep shielded clouds inside this galaxy merger hold thick reservoirs of cold H₂O water ice, CO₂ dry ice, and hydrocarbon soot grains right alongside blazing nuclear starbursts!`,
        nextPrediction: `Position will remain dead still (0.00" shift) across all future scans, while infrared flux gently rises and dips ±8–15% as dusty gas swirls across the hidden active nucleus.`
      },
      orion_kl: {
        whatCause: `Orion KL is a chaotic cosmic nursery where massive newborn stars blast hot supersonic gas jets into freezing surrounding clouds. Between dates, shockwaves light up warm knots of dust and momentarily warm nearby ice coatings, shifting brightness by ${absFluxPct}% ${brightDir}.`,
        howHelpsScientists: `1) **Watching Solar Systems Form in Real Time:** Shows how bright young giant stars shape neighboring dust clouds into future planets.\n2) **Prebiotic Chemistry Factory:** Tracks cyanate, methanol, CO₂ dry ice, and water ice — the building blocks of comets and early Earth chemistry.\n3) **Dynamic Nebula Mapping:** Difference glow maps isolate tiny variable shock knots buried inside bright stationary nebulae!`,
        eyeTest: `On a clear dark night you can see the hazy glow of the Orion Nebula right below Orion's Belt! However, the deepest dusty newborn core (Orion KL) is opaque to visible eyes and shines primarily in infrared heat light.`,
        lifeWater: `Massive amounts! Orion KL has the strongest H₂O water ice (1.95), CO₂ dry ice (1.30), and methanol organic alcohol fingerprints in this citizen catalog — a true icy ingredient warehouse!`,
        nextPrediction: `Gas pillars stay essentially anchored in position (<0.01" drift) while small shockwave knots brighten and fade gently across Epochs 3 & 4.`
      },
      planet_x: {
        whatCause: `Outer Solar System objects (hundreds of AU from the Sun) reflect faint sunlight and emit weak ~48 K cold thermal heat, while Earth's own 6-month orbit + the object's slow orbital motion cause a clear geometric jump (${describeMagnitudeScale(d.separationArcsec)}) relative to distant fixed stars!`,
        howHelpsScientists: `1) **How Planet X / Sednoids Are Discovered:** Just like Clyde Tombaugh discovered Pluto in 1930 using a Blink Comparator, comparing two dates months apart makes any true Solar System world jump against stationary stars!\n2) **Separating False Noise from Real Worlds:** By verifying steady straight-line/parallactic jumps across 3–4 epochs, citizen scientists eliminate random detector glitches or asteroids.\n3) **Cold Surface Composition:** SPHEREx infrared color tells scientists whether a distant world is covered in methane, nitrogen, or water ice.`,
        eyeTest: `Impossible with naked eyes or backyard scopes — objects at ~400 AU are millions of times too faint optically. Infrared multi-epoch Blink + Difference Glow comparison is the gold-standard discovery technique!`,
        lifeWater: `At ~48 K (-225°C), any water on an outer Solar System body is frozen harder than granite rock, mixed with frozen methane (CH₄) and carbon dioxide frost.`,
        nextPrediction: `Across Epochs 3 and 4, the candidate keeps stepping smoothly along its diagonal track, building a clean 4-point orbital arc that proves its exact distance from the Sun!`
      }
    };

    if (map[target.id]) return map[target.id];

    // Generic smart fallback for custom searched stars!
    return {
      whatCause: `Over ${Math.abs(d.daysApart)} days, ${target.shortName} displayed a position shift of ${describeMagnitudeScale(d.separationArcsec)} and changed brightness by ${formatSigned(d.fluxDeltaPct, 1, "%")} (${absFluxPct}% ${brightDir}) as its infrared heat output evolved across SPHEREx survey passes.`,
      howHelpsScientists: `1) **Time-Domain Anomaly Detection:** Comparing multiple dates highlights any star or hidden object that refuses to stay constant.\n2) **Motion + Temperature Separation:** Distinguishes close high-speed foreground objects from stationary distant background galaxies.\n3) **All-Sky Baseline Building:** Adds calibrated measurements to SPHEREx's 102-band infrared sky catalog.`,
      eyeTest: `Most SPHEREx infrared changes of a few percent or sub-arcsecond shifts are subtle or invisible to human eyes; Difference Glow and Blink modes amplify them immediately for citizen review.`,
      lifeWater: d.hasIce
        ? `Water-ice absorption features are present in this target's cold infrared spectrum, indicating frozen cosmic ice grains.`
        : `No strong interstellar water-ice blanket detected here — signal is dominated by the star's warm infrared surface glow.`,
      nextPrediction: `Checking Epoch 3 and Epoch 4 confirms whether the observed brightness/motion trend continues steadily or reverses.`
    };
  }

  /**
   * Builds "ALL POSSIBLE Q&A" structured cards for the bottom wireframe box.
   */
  function generateAllPossibleQA(comp, level = "simple") {
    const { target, epochA, epochB, delta } = comp;
    const physics = getTargetSpecificPhysics(target, epochA, epochB, delta);
    const absFluxPct = Math.abs(delta.fluxDeltaPct).toFixed(1);
    const fluxPhrase =
      Math.abs(delta.fluxDeltaPct) < 1.5
        ? `stayed almost identical (${formatSigned(delta.fluxDeltaPct, 1, "%")})`
        : delta.fluxDeltaPct > 0
          ? `got ${absFluxPct}% BRIGHTER (+${delta.fluxDeltaMjy.toFixed(0)} mJy heat glow)`
          : `got ${absFluxPct}% DIMMER (${delta.fluxDeltaMjy.toFixed(0)} mJy heat glow)`;

    const motionPhrase = delta.movedSignificantly
      ? `MOVED ${delta.separationArcsec.toFixed(2)}" toward ${delta.compassDir} (~${delta.pixelShiftPx.toFixed(0)} pixels on camera!)`
      : `STAYED LOCKED in nearly the same sky spot (${delta.separationArcsec.toFixed(3)}" shift — basically stationary!)`;

    const iceSentence = delta.hasIce
      ? `Space Frost (Ice): Frozen water/CO₂ ice coating shifted by ${formatSigned(delta.iceDeltaPct, 1, "%")} as temperature shifted ${formatSigned(delta.tempDeltaK, 1, " K")}.`
      : `Space Frost (Ice): Minimal/no outer ice cloud; surface temperature shifted ${formatSigned(delta.tempDeltaK, 0, " K")}.`;

    const levelPrefix =
      level === "kid"
        ? "In super simple words: "
        : level === "science"
          ? "Astrophysics Breakdown: "
          : "";

    return [
      {
        id: "qa_changes",
        badge: "1. What Changed?",
        question: `What exact differences happened in ${target.shortName} between ${epochA.epoch.shortDate} and ${epochB.epoch.shortDate}?`,
        answer: `${levelPrefix}Over ${Math.abs(delta.daysApart)} days, two main things happened:\n• **Position:** ${target.shortName} ${motionPhrase}.\n• **Brightness (Heat Glow):** It ${fluxPhrase} (from ${epochA.fluxMjy.toFixed(0)} mJy to ${epochB.fluxMjy.toFixed(0)} mJy).\n• **Temperature & Ice:** ${iceSentence}`,
        highlight: delta.movedSignificantly
          ? `Moved ${delta.separationArcsec.toFixed(2)}" ${delta.compassDir}`
          : `${formatSigned(delta.fluxDeltaPct, 1, "%")} Brightness Shift`
      },
      {
        id: "qa_why",
        badge: "2. Why Did It Happen?",
        question: `Why did ${target.shortName} look different on ${epochB.epoch.shortDate} compared to ${epochA.epoch.shortDate}?`,
        answer: `${levelPrefix}${physics.whatCause}`,
        highlight: target.categoryLabel
      },
      {
        id: "qa_scientists",
        badge: "3. How Scientists Use This",
        question: `How does spotting this difference help NASA & SPHEREx scientists?`,
        answer: physics.howHelpsScientists,
        highlight: "Real NASA Research Value"
      },
      {
        id: "qa_planetx",
        badge: "4. Hunting New Worlds",
        question: `How does comparing Image 1 vs Image 2 help find hidden worlds like Planet X?`,
        answer: `Notice how distant background stars stayed completely frozen in place while foreground objects either **jumped sideways** (catchable in **Blink Mode** or **Ghost Overlay**) or **changed glow** (catchable in **Difference Glow**). That exact same 2-date test is how Clyde Tombaugh discovered Pluto in 1930 — and how SPHEREx searches the outer Solar System for unseen icy planets!`,
        highlight: "Blink & Subtraction Science"
      },
      {
        id: "qa_human_eye",
        badge: "5. Eyes vs Telescope",
        question: `Could I see this change with my own eyes or a normal camera?`,
        answer: physics.eyeTest,
        highlight: `Distance: ${target.distanceLabel}`
      },
      {
        id: "qa_water",
        badge: "6. Water & Life Clues",
        question: `Are there any water, ice, or habitability clues hidden in these dates?`,
        answer: physics.lifeWater,
        highlight: delta.hasIce ? "Water/CO₂ Ice Present" : "Thermal/Flare Lab"
      },
      {
        id: "qa_next",
        badge: "7. What Happens Next?",
        question: `What do scientists expect if we switch Image 2 to a later date (like Oct 2026)?`,
        answer: `${physics.nextPrediction} (Try picking **Epoch 4 — Oct 15, 2026** in the Image 2 date chooser above to see it happen live!)`,
        highlight: "Try Epoch 4 Above ↑"
      }
    ];
  }

  /**
   * Answers custom citizen questions interactively using active target + epoch telemetry.
   */
  function answerUserQuestion(queryText, comp, level = "simple") {
    const q = (queryText || "").toLowerCase().trim();
    const { target, epochA, epochB, delta } = comp;
    const qaList = generateAllPossibleQA(comp, level);

    if (!q) {
      return "Ask me anything about what changed between these two dates, why it happened, water ice, Planet X, or how scientists use it!";
    }

    if (q.includes("10") || q.includes("kid") || q.includes("simple") || q.includes("easy") || q.includes("explain")) {
      const mText = delta.movedSignificantly
        ? `actually zoomed sideways across the sky by ${delta.separationArcsec.toFixed(2)} arcseconds (turn on Blink Mode and watch it hop like a frog!)`
        : `stayed parked in the exact same spot, like a lamp nailed to a wall`;
      const bText =
        Math.abs(delta.fluxDeltaPct) >= 4
          ? `and turned its heat brightness ${delta.fluxDeltaPct > 0 ? "UP" : "DOWN"} by ${Math.abs(delta.fluxDeltaPct).toFixed(0)}%!`
          : `with almost steady brightness.`;
      return `**Easy 10-Second Summary for ${target.shortName}:**\nImagine taking two photos ${Math.abs(delta.daysApart)} days apart with night-vision heat goggles. Between **${epochA.epoch.shortDate}** and **${epochB.epoch.shortDate}**, ${target.shortName} ${mText} ${bText}\n\nScientists study this like space detectives to discover where ocean water comes from, watch stars breathe/flare, and catch invisible moving planets!`;
    }

    if (q.includes("move") || q.includes("shift") || q.includes("jump") || q.includes("fast") || q.includes("speed") || q.includes("motion")) {
      return `**Position & Movement Check:**\nBetween ${epochA.epoch.shortDate} and ${epochB.epoch.shortDate} (${Math.abs(delta.daysApart)} days), ${target.shortName} shifted **${delta.separationArcsec.toFixed(3)} arcseconds** (${delta.compassDir}).\n\n• **Why?** Its real speed through space is ~**${target.speedKmS} km/s**, and it sits **${target.distanceLabel}**.\n• **Best Mode to Spot It:** Click **Blink Mode** or **Difference Glow** on the right panel!`;
    }

    if (q.includes("bright") || q.includes("dim") || q.includes("flare") || q.includes("glow") || q.includes("light") || q.includes("flux")) {
      return `**Brightness & Heat Check:**\n• On **${epochA.epoch.shortDate}**: **${epochA.fluxMjy.toFixed(1)} mJy** (${epochA.brightnessWord}, ~${epochA.tempK} K)\n• On **${epochB.epoch.shortDate}**: **${epochB.fluxMjy.toFixed(1)} mJy** (${epochB.brightnessWord}, ~${epochB.tempK} K)\n• **Net Difference:** **${formatSigned(delta.fluxDeltaPct, 1, "%")}** (${formatSigned(delta.fluxDeltaMjy, 1, " mJy")})\n\n${qaList[1].answer}`;
    }

    if (q.includes("scientist") || q.includes("nasa") || q.includes("help") || q.includes("why care") || q.includes("research") || q.includes("use")) {
      return `**How NASA & Scientists Use This Exact Comparison:**\n${qaList[2].answer}`;
    }

    if (q.includes("planet x") || q.includes("planet") || q.includes("earth") || q.includes("danger") || q.includes("safe")) {
      return `**Earth Safety & Planet Hunting:**\nDon't worry — ${target.shortName} is **${target.distanceLabel}**, completely safe and unimaginably far from Earth!\n\n${qaList[3].answer}`;
    }

    if (q.includes("ice") || q.includes("water") || q.includes("life") || q.includes("frost") || q.includes("co2")) {
      return `**Water, Ice & Life Clues:**\n${qaList[5].answer}`;
    }

    if (q.includes("mode") || q.includes("curtain") || q.includes("blink") || q.includes("diff") || q.includes("overlay")) {
      return `**Which Comparison Mode Should You Use Right Now?**\n• For **${target.shortName}**, try **${delta.movedSignificantly ? "Blink Mode or Ghost Overlay" : "Difference Glow or Curtain Mode"}**!\n• **Side by Side:** Inspect Image 1 and Image 2 calmly side by side.\n• **Curtain Mode:** Drag the split bar right across the star to compare brightness or position on the exact same pixel grid.\n• **Difference Glow:** Automatically erases unchanged background stars so ONLY real changes glow green (brighter/new) or red (dimmer/old)!`;
    }

    if (q.includes("future") || q.includes("next") || q.includes("predict") || q.includes("2026")) {
      return `**What Happens Next?**\n${qaList[6].answer}`;
    }

    // Comprehensive smart catch-all summarizing everything
    return `**Here is what I found for ${target.shortName} (${epochA.epoch.shortDate} vs ${epochB.epoch.shortDate}):**\n\n1. **What Changed:** ${qaList[0].answer}\n\n2. **Why & Scientist Benefit:** ${qaList[1].answer}\n\n💡 *Tip: Ask specifically about movement, brightness, water ice, safety, Planet X, or click "Explain Like I'm 10"!*`;
  }

  return {
    generateAllPossibleQA,
    answerUserQuestion
  };
})();
