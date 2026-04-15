/* =====================================================
   Smart Mobility Intelligence – Safe Route Recommender
   script.js  |  AI Logic + UI Controller
   ===================================================== */

"use strict";

// ── Route name templates (randomised per search) ──────────────────────────
const ROUTE_PREFIXES = ["Main Blvd", "Park Ave", "River Rd", "North Loop",
                         "Central Dr", "Market St", "Lakeside Way", "Elm St",
                         "Sunrise Path", "Hilltop Rd", "Greenway", "Old Town Rd"];

const ROUTE_TAGS = ["Express", "Scenic", "Bypass", "Direct",
                    "Commercial", "Highway", "Alternate", "Inner City"];

/**
 * generateRouteName
 * Returns a random, human-friendly route label.
 * @param {number} index – 0-based route index
 */
function generateRouteName(index) {
  const prefix = ROUTE_PREFIXES[Math.floor(Math.random() * ROUTE_PREFIXES.length)];
  const tag    = ROUTE_TAGS[Math.floor(Math.random() * ROUTE_TAGS.length)];
  return `Route ${index + 1} · ${prefix} (${tag})`;
}

// ── Weighted Safety Score Formula ─────────────────────────────────────────
/**
 * calculateSafetyScore
 * Safety Score = 0.5 × (100 − crime_rate)
 *              + 0.3 × lighting_level
 *              + 0.2 × (100 − traffic_density)
 *
 * @param {number} crime_rate      – 0 (no crime) → 100 (very dangerous)
 * @param {number} lighting_level  – 0 (very dark) → 100 (well-lit)
 * @param {number} traffic_density – 0 (empty)     → 100 (gridlock)
 * @returns {number} Safety score rounded to 1 decimal place
 */
function calculateSafetyScore(crime_rate, lighting_level, traffic_density) {
  const score =
    0.5 * (100 - crime_rate) +
    0.3 * lighting_level     +
    0.2 * (100 - traffic_density);
  return Math.round(score * 10) / 10;
}

// ── Route Simulation ──────────────────────────────────────────────────────
/**
 * rnd
 * Returns a random integer between min and max (inclusive).
 */
function rnd(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * generateRoutes
 * Simulates 3 candidate routes with randomised safety-relevant metrics.
 * We intentionally skew the distribution so at least one route tends to be
 * safer and one tends to be riskier, making results interesting.
 *
 * @returns {Array<Object>} Array of 3 route objects (unsorted)
 */
function generateRoutes() {
  const profiles = [
    // profile: generally safer – low crime, good lighting
    { crime: [20, 55], light: [55, 95], traffic: [20, 70] },
    // profile: moderate – balanced metrics
    { crime: [35, 70], light: [35, 75], traffic: [30, 75] },
    // profile: riskier – higher crime, poorer lighting
    { crime: [50, 90], light: [15, 55], traffic: [40, 90] },
  ];

  // Shuffle profiles so the cards don't always appear in the same order
  profiles.sort(() => Math.random() - 0.5);

  return profiles.map((p, idx) => {
    const crime_rate      = rnd(p.crime[0],   p.crime[1]);
    const lighting_level  = rnd(p.light[0],   p.light[1]);
    const traffic_density = rnd(p.traffic[0], p.traffic[1]);
    const score = calculateSafetyScore(crime_rate, lighting_level, traffic_density);

    return {
      name:             generateRouteName(idx),
      crime_rate,
      lighting_level,
      traffic_density,
      score,
    };
  });
}

// ── Safety Level Classification ───────────────────────────────────────────
/**
 * getSafetyLevel
 * Classifies a safety score into one of three tiers.
 *
 * @param {number} score
 * @returns {{ label: string, css: string, icon: string }}
 */
function getSafetyLevel(score) {
  if (score >= 80) return { label: "Safe",     css: "safe",     icon: "✅" };
  if (score >= 50) return { label: "Moderate", css: "moderate", icon: "⚠️" };
  return             { label: "Risky",    css: "risky",    icon: "❌" };
}

// ── Explanation Builder ───────────────────────────────────────────────────
/**
 * buildExplanation
 * Generates a human-readable summary of why the route received its score.
 *
 * @param {Object} route
 * @returns {string}
 */
function buildExplanation(route) {
  const parts = [];

  // Crime assessment
  if (route.crime_rate < 30)       parts.push("very low crime area 🛡️");
  else if (route.crime_rate < 60)  parts.push("moderate crime risk 🔒");
  else                             parts.push("high crime zone ⚠️");

  // Lighting assessment
  if (route.lighting_level > 70)   parts.push("excellent street lighting 💡");
  else if (route.lighting_level > 40) parts.push("adequate lighting 🔦");
  else                             parts.push("poor lighting conditions 🌑");

  // Traffic assessment
  if (route.traffic_density < 35)  parts.push("light traffic flow 🚗");
  else if (route.traffic_density < 65) parts.push("moderate traffic 🚕");
  else                             parts.push("heavy traffic congestion 🚧");

  return parts.join(" · ");
}

// ── Card Renderer ─────────────────────────────────────────────────────────
/**
 * buildRouteCard
 * Creates the HTML string for a single route card.
 *
 * @param {Object}  route       – route data object
 * @param {number}  rank        – 1-based rank (1 = best)
 * @param {boolean} recommended – true only for rank 1
 * @returns {string} HTML string
 */
function buildRouteCard(route, rank, recommended) {
  const level  = getSafetyLevel(route.score);
  const cardClass = [
    "route-card",
    "glass",
    `card-${level.css}`,
    recommended ? "card-recommended" : "",
  ].filter(Boolean).join(" ");

  const rankLabel = rank === 1 ? "🥇 Best Option" :
                    rank === 2 ? "🥈 Runner-up"  :
                                 "🥉 Alternative";

  // Format raw stats as descriptive labels
  const crimeLabel   = route.crime_rate      < 40 ? "Low"    : route.crime_rate      < 70 ? "Medium"  : "High";
  const lightLabel   = route.lighting_level  > 65 ? "Bright" : route.lighting_level  > 35 ? "Decent"  : "Dim";
  const trafficLabel = route.traffic_density < 35 ? "Light"  : route.traffic_density < 65 ? "Moderate": "Heavy";

  return `
    <article class="${cardClass}">

      <!-- Card Header -->
      <div class="card-header">
        <div class="card-title-group">
          <span class="card-rank">${rankLabel}</span>
          <span class="card-title">
            🗺️ ${route.name}
            ${recommended ? '<span class="badge-recommended">⭐ Recommended</span>' : ""}
          </span>
        </div>
        <div class="score-block">
          <div class="score-value ${level.css}">${route.score}%</div>
          <div class="score-label">Safety Score</div>
        </div>
      </div>

      <!-- Safety level badge -->
      <div class="safety-level ${level.css}">
        ${level.icon} ${level.label}
      </div>

      <!-- Progress bar visualises the score -->
      <div class="score-bar-wrap" role="progressbar"
           aria-valuenow="${route.score}" aria-valuemin="0" aria-valuemax="100"
           aria-label="Safety score ${route.score}%">
        <div class="score-bar ${level.css}" style="width: 0%"
             data-target="${route.score}"></div>
      </div>

      <!-- Raw stats chips -->
      <div class="stats-row">
        <div class="stat-chip">
          <span class="stat-chip-icon">🔓</span>
          <span class="stat-chip-label">Crime</span>
          <span class="stat-chip-value">${crimeLabel} (${route.crime_rate})</span>
        </div>
        <div class="stat-chip">
          <span class="stat-chip-icon">💡</span>
          <span class="stat-chip-label">Lighting</span>
          <span class="stat-chip-value">${lightLabel} (${route.lighting_level})</span>
        </div>
        <div class="stat-chip">
          <span class="stat-chip-icon">🚦</span>
          <span class="stat-chip-label">Traffic</span>
          <span class="stat-chip-value">${trafficLabel} (${route.traffic_density})</span>
        </div>
      </div>

      <!-- AI explanation -->
      <p class="card-explanation">
        💬 "${buildExplanation(route)}"
      </p>

    </article>
  `;
}

// ── Progress Bars Animator ────────────────────────────────────────────────
/**
 * animateBars
 * Waits one tick then transitions all score bar widths from 0% to target.
 * This gives the CSS animation time to apply after the DOM insert.
 */
function animateBars() {
  requestAnimationFrame(() => {
    document.querySelectorAll(".score-bar[data-target]").forEach(bar => {
      const target = bar.getAttribute("data-target");
      // Force reflow so the initial 0% renders before the transition
      bar.offsetWidth; // eslint-disable-line no-unused-expressions
      bar.style.width = `${target}%`;
    });
  });
}

// ── Main Controller ───────────────────────────────────────────────────────
/**
 * findSafeRoute
 * Orchestrates the full flow:
 *   1. Validate inputs
 *   2. Show loading
 *   3. Simulate async route analysis (setTimeout)
 *   4. Render sorted results
 */
function findSafeRoute() {
  const source = document.getElementById("source-input").value.trim();
  const dest   = document.getElementById("dest-input").value.trim();

  // ── Input validation ──
  if (!source || !dest) {
    shakeInputs();
    alert("Please enter both a starting point and a destination.");
    return;
  }

  if (source.toLowerCase() === dest.toLowerCase()) {
    alert("Start and destination cannot be the same location.");
    return;
  }

  const loadingEl  = document.getElementById("loading");
  const resultsEl  = document.getElementById("results");
  const containerEl = document.getElementById("cards-container");
  const metaEl     = document.getElementById("results-meta");

  // Hide old results, show spinner
  resultsEl.classList.add("hidden");
  loadingEl.classList.remove("hidden");

  // Disable button while loading
  const btn = document.getElementById("find-btn");
  btn.disabled = true;
  btn.style.opacity = "0.6";

  // ── Simulate AI processing delay (1.4 s) ──
  setTimeout(() => {

    // 1. Generate randomised route data
    const routes = generateRoutes();

    // 2. Sort descending by score (safest first)
    routes.sort((a, b) => b.score - a.score);

    // 3. Build cards HTML
    const cardsHTML = routes.map((route, idx) =>
      buildRouteCard(route, idx + 1, idx === 0)
    ).join("");

    // 4. Update meta info line
    const now = new Date();
    metaEl.textContent =
      `📍 ${source}  →  🏁 ${dest}  ·  Analysed at ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

    // 5. Inject cards and reveal results
    containerEl.innerHTML = cardsHTML;
    loadingEl.classList.add("hidden");
    resultsEl.classList.remove("hidden");

    // 6. Animate progress bars
    animateBars();

    // 7. Scroll results into view smoothly
    resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });

    // Re-enable button
    btn.disabled = false;
    btn.style.opacity = "1";

  }, 1400); // ← simulated processing time
}

// ── Input Shake Animation ─────────────────────────────────────────────────
/**
 * shakeInputs
 * Briefly shakes empty inputs to guide the user visually.
 */
function shakeInputs() {
  const inputs = document.querySelectorAll(".text-input");
  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.style.animation = "none";
      input.style.borderColor = "var(--color-risky)";
      // Trigger shake via inline keyframe
      input.animate([
        { transform: "translateX(0)"   },
        { transform: "translateX(-8px)" },
        { transform: "translateX(8px)" },
        { transform: "translateX(-6px)" },
        { transform: "translateX(0)"   },
      ], { duration: 350, easing: "ease-in-out" });

      // Reset border after a moment
      setTimeout(() => { input.style.borderColor = ""; }, 1000);
    }
  });
}

// ── Allow pressing Enter to trigger search ────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".text-input").forEach(input => {
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") findSafeRoute();
    });
  });
});
