/**
 * ZFormationEngine.js
 * 
 * Computes the 3D target positions for words that form the letter Z.
 * The Z is defined parametrically as three strokes:
 *   - Top horizontal bar (left to right)
 *   - Diagonal slash (top-right to bottom-left)
 *   - Bottom horizontal bar (left to right)
 * 
 * Each word gets a unique target position with depth variation,
 * a formation delay for staggered assembly, and micro-animation offsets.
 */

const WORDS = [
  'AI', 'CYBERSECURITY', 'RAG', 'AUTOMATION', 'RESEARCH',
  'INNOVATION', 'SCALE', 'SYSTEMS', 'AGENTS', 'CLOUD',
  'ENTERPRISE', 'INTELLIGENCE', 'ENGINEERING', 'KNOWLEDGE', 'BUILDERS',
  'COMMUNITY', 'LEARNING', 'SECURITY', 'VISION', 'ARCHITECTURE',
  'PRODUCTS', 'FUTURE', 'TRUST', 'PRECISION', 'SOFTWARE',
  'INFRASTRUCTURE',
]

// Seeded pseudo-random for deterministic layouts
function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

/**
 * Generate scattered (initial) positions for all words.
 * Words appear at random positions in a large 3D volume.
 */
export function getScatteredPositions(count = WORDS.length) {
  const rng = seededRandom(42)
  const positions = []
  for (let i = 0; i < count; i++) {
    positions.push({
      x: (rng() - 0.5) * 18,
      y: (rng() - 0.5) * 12,
      z: (rng() - 0.5) * 10 - 2,
      rotationX: (rng() - 0.5) * 0.3,
      rotationY: (rng() - 0.5) * 0.4,
      rotationZ: (rng() - 0.5) * 0.15,
      scale: 0.6 + rng() * 0.5,
      opacity: 0,
    })
  }
  return positions
}

/**
 * Generate Z-formation target positions.
 * The Z is ~10 units wide and ~8 units tall, centered at origin.
 */
export function getZFormationPositions(count = WORDS.length) {
  const rng = seededRandom(777)
  const positions = []

  // Z shape definition
  const halfW = 5.0   // half width
  const halfH = 4.0   // half height
  const depth = 0.8   // z-depth variation

  // Distribute words across three strokes
  // Top bar: ~30% of words, Diagonal: ~40%, Bottom bar: ~30%
  const topCount = Math.round(count * 0.3)
  const diagCount = Math.round(count * 0.4)
  const bottomCount = count - topCount - diagCount

  let idx = 0

  // --- Top horizontal bar (left to right) ---
  for (let i = 0; i < topCount; i++) {
    const t = topCount > 1 ? i / (topCount - 1) : 0.5
    positions.push({
      x: -halfW + t * (halfW * 2),
      y: halfH + (rng() - 0.5) * 0.3,
      z: (rng() - 0.5) * depth,
      rotationX: 0,
      rotationY: (rng() - 0.5) * 0.08,
      rotationZ: 0,
      scale: 0.7 + rng() * 0.35,
      opacity: 1,
      formationDelay: 0.3 + t * 0.5 + rng() * 0.2,
    })
    idx++
  }

  // --- Diagonal (top-right to bottom-left) ---
  for (let i = 0; i < diagCount; i++) {
    const t = diagCount > 1 ? i / (diagCount - 1) : 0.5
    positions.push({
      x: halfW - t * (halfW * 2),
      y: halfH - t * (halfH * 2) + (rng() - 0.5) * 0.3,
      z: (rng() - 0.5) * depth * 1.5 + Math.sin(t * Math.PI) * 0.6,
      rotationX: 0,
      rotationY: (rng() - 0.5) * 0.1,
      rotationZ: 0,
      scale: 0.65 + rng() * 0.4,
      opacity: 1,
      formationDelay: 0.8 + t * 0.8 + rng() * 0.3,
    })
    idx++
  }

  // --- Bottom horizontal bar (left to right) ---
  for (let i = 0; i < bottomCount; i++) {
    const t = bottomCount > 1 ? i / (bottomCount - 1) : 0.5
    positions.push({
      x: -halfW + t * (halfW * 2),
      y: -halfH + (rng() - 0.5) * 0.3,
      z: (rng() - 0.5) * depth,
      rotationX: 0,
      rotationY: (rng() - 0.5) * 0.08,
      rotationZ: 0,
      scale: 0.7 + rng() * 0.35,
      opacity: 1,
      formationDelay: 1.5 + t * 0.5 + rng() * 0.2,
    })
    idx++
  }

  return positions
}

/**
 * Animation timeline configuration.
 */
export const TIMELINE = {
  // Phase 1: Black screen
  blackDuration: 1.2,
  // Phase 2: Words fade in and drift
  fadeInStart: 1.2,
  fadeInDuration: 2.5,
  // Phase 3: Words begin assembling into Z
  formationStart: 4.0,
  formationDuration: 5.0,
  // Phase 4: Living Z (continuous)
  livingStart: 9.0,
}

/**
 * Compute formation progress for a single word given elapsed time.
 * Returns 0 (scattered) to 1 (fully formed).
 * Uses a smooth ease-in-out with per-word stagger.
 */
export function getWordFormationProgress(elapsed, wordDelay = 0) {
  const start = TIMELINE.formationStart + wordDelay
  const end = start + TIMELINE.formationDuration * 0.6
  if (elapsed < start) return 0
  if (elapsed > end) return 1
  const t = (elapsed - start) / (end - start)
  // Smooth cubic ease in-out
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/**
 * Compute fade-in progress for a word.
 * Returns 0 (invisible) to 1 (fully visible).
 */
export function getWordFadeProgress(elapsed, wordIndex) {
  const stagger = wordIndex * 0.08
  const start = TIMELINE.fadeInStart + stagger
  const duration = 1.2
  if (elapsed < start) return 0
  if (elapsed > start + duration) return 1
  const t = (elapsed - start) / duration
  return t * t * (3 - 2 * t) // smoothstep
}

/**
 * Smooth value noise for organic micro-animations.
 * Uses cosine interpolation between hash grid points.
 */
function hashNoise(x, y) {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
  return (n - Math.floor(n)) * 2 - 1
}

export function noise(x, y) {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const fx = x - ix
  const fy = y - iy
  // Smooth interpolation
  const ux = fx * fx * (3 - 2 * fx)
  const uy = fy * fy * (3 - 2 * fy)

  const a = hashNoise(ix, iy)
  const b = hashNoise(ix + 1, iy)
  const c = hashNoise(ix, iy + 1)
  const d = hashNoise(ix + 1, iy + 1)

  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy
}

/**
 * Get dissolve positions (scroll-driven).
 * Words fly outward from Z formation.
 */
export function getDissolvePositions(formationPositions) {
  const rng = seededRandom(999)
  return formationPositions.map((pos) => {
    const angle = Math.atan2(pos.y, pos.x) + (rng() - 0.5) * 0.5
    const dist = 12 + rng() * 8
    return {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist + (rng() - 0.5) * 4,
      z: pos.z + (rng() - 0.5) * 6,
      rotationX: (rng() - 0.5) * 1.0,
      rotationY: (rng() - 0.5) * 1.0,
      rotationZ: (rng() - 0.5) * 0.5,
      scale: 0.3 + rng() * 0.3,
      opacity: 0,
    }
  })
}

export { WORDS }
