'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ─── Word list ────────────────────────────────────────────────────────────────
const WORDS = [
  'AI', 'CYBERSECURITY', 'RAG', 'AUTOMATION', 'RESEARCH',
  'INNOVATION', 'SCALE', 'SYSTEMS', 'AGENTS', 'CLOUD',
  'ENTERPRISE', 'INTELLIGENCE', 'ENGINEERING', 'KNOWLEDGE', 'BUILDERS',
  'COMMUNITY', 'LEARNING', 'SECURITY', 'VISION', 'ARCHITECTURE',
  'PRODUCTS', 'FUTURE', 'TRUST', 'PRECISION', 'SOFTWARE',
  'INFRASTRUCTURE',
]
const N = WORDS.length

// ─── Seeded RNG ───────────────────────────────────────────────────────────────
function rng(seed) {
  let s = seed
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
}

// ─── Scattered positions: grid + jitter, spread across full viewport ──────────
// Camera z=16, fov=52 → visible ≈ ±7.8 wide, ±4.4 tall at z=0
// We spread from ±9 x, ±5.5 y (slightly beyond viewport edges)
function makeScattered() {
  const r = rng(42)
  const cols = 6
  const rows = Math.ceil(N / cols)
  const xSpan = 18, ySpan = 11
  return WORDS.map((_, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    // base grid position
    const xBase = -xSpan / 2 + (col / (cols - 1)) * xSpan
    const yBase = ySpan / 2 - (row / (rows - 1)) * ySpan
    return {
      x: xBase + (r() - 0.5) * 2.4,
      y: yBase + (r() - 0.5) * 1.6,
      z: (r() - 0.5) * 5 - 0.5,
      rx: (r() - 0.5) * 0.3,
      ry: (r() - 0.5) * 0.4,
      rz: (r() - 0.5) * 0.2,
      scale: 0.65 + r() * 0.45,
      fadeDelay: (r() * 0.8),   // random stagger, not index-based
    }
  })
}

// ─── Z formation ─────────────────────────────────────────────────────────────
function makeZFormation() {
  const r = rng(777)
  const pos = []
  const W = 5.8, H = 3.4

  const topN = 9
  for (let i = 0; i < topN; i++) {
    const t = i / (topN - 1)
    pos.push({ x: -W + t * W * 2, y: H, z: (r() - 0.5) * 0.2, ry: 0, scale: 0.75, formDelay: t * 0.6 })
  }
  const diagN = 10
  for (let i = 0; i < diagN; i++) {
    const t = i / (diagN - 1)
    pos.push({ x: W - t * W * 2, y: H - t * H * 2, z: (r() - 0.5) * 0.2, ry: 0, scale: 0.75, formDelay: 0.7 + t * 0.7 })
  }
  const botN = 7
  for (let i = 0; i < botN; i++) {
    const t = i / (botN - 1)
    pos.push({ x: -W + t * W * 2, y: -H, z: (r() - 0.5) * 0.2, ry: 0, scale: 0.75, formDelay: 1.5 + t * 0.45 })
  }

  return pos
}

// ─── Easing ───────────────────────────────────────────────────────────────────
const easeOut3    = t => 1 - Math.pow(1 - t, 3)
const easeInOut2  = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
const lerp        = (a, b, t) => a + (b - a) * t
const clamp       = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
const slerp       = (cur, tgt, k, dt) => cur + (tgt - cur) * Math.min(1, k * dt)

// ─── Timeline (seconds, all phases overlap cleanly) ───────────────────────────
// 0.0 – 2.0  : words float in (scattered, full screen)
// 2.0 – 5.2  : words fly into Z formation
// 5.2 – 6.8  : word-Z shrinks → simultaneously plain Z fades IN (seamless morph)
// 6.8 – 8.5  : plain Z zooms big (fills screen)
// 7.6 – 8.5  : black flash rises
// 8.5 – 9.3  : flash fades → content reveals
const TL = {
  scatterStart: 0.0, scatterEnd: 2.0,
  formStart:    2.0, formEnd:   5.2,
  shrinkStart:  5.2, shrinkEnd: 6.5,
  // plain Z appears instantly at 6.5s (exactly when word-Z finishes shrinking)
  plainZStart:  6.5, plainZEnd: 6.5,
  zoomStart:    6.5, zoomEnd:   8.2,
  flashStart:   7.6, flashEnd:  8.2,
  revealStart:  8.2, revealEnd: 9.0,
}
const TOTAL = 9.5

function prog(t, a, b) { return clamp((t - a) / (b - a), 0, 1) }

// ─── Build canvas texture for a word ─────────────────────────────────────────
// Pre-built at module level when browser is available (avoids useMemo delay)
const textureCache = new Map()
function getWordTexture(word) {
  if (textureCache.has(word)) return textureCache.get(word)
  const canvas = document.createElement('canvas')
  const fontSize = 34
  const ctx = canvas.getContext('2d')
  ctx.font = `700 ${fontSize}px Arial, sans-serif`
  const tw = ctx.measureText(word).width
  // Large padding ensures NO letter is ever clipped (handles overhangs, kerning)
  const padX = 40
  const padY = 20
  canvas.width  = Math.ceil(tw + padX * 2)
  canvas.height = Math.ceil(fontSize + padY * 2)
  // Re-apply font after resize (canvas resize resets context state)
  ctx.font = `700 ${fontSize}px Arial, sans-serif`
  ctx.textBaseline = 'middle'
  ctx.textAlign    = 'center'
  ctx.fillStyle = '#ffffff'
  ctx.fillText(word, canvas.width / 2, canvas.height / 2)
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  const result = { tex, aspect: canvas.width / canvas.height }
  textureCache.set(word, result)
  return result
}

// ─── Single word sprite ───────────────────────────────────────────────────────
function WordSprite({ word, index, animRef, sc, fm }) {
  const meshRef = useRef()
  const matRef  = useRef()

  // Build texture synchronously (no async, no download)
  const { tex, aspect } = useMemo(() => {
    if (typeof window !== 'undefined') return getWordTexture(word)
    return { tex: null, aspect: 1 }
  }, [word])

  const w = useRef({
    x: sc.x, y: sc.y, z: sc.z,
    rx: sc.rx, ry: sc.ry, rz: sc.rz,
    scale: sc.scale, opacity: 0,
  })

  useFrame((state, delta) => {
    const dt  = Math.min(delta, 0.05)
    const t   = animRef.current.elapsed
    const clk = state.clock.getElapsedTime()
    const cur = w.current

    let tx, ty, tz, trx, try_, trz, tsc, top

    if (t <= TL.scatterEnd) {
      // ── FLOAT IN (full screen scatter) ────────────────────────────
      const p = prog(t, TL.scatterStart, TL.scatterEnd)
      // staggered fade-in using random delay per word
      const fadeP = easeOut3(clamp((p - sc.fadeDelay) / 0.5, 0, 1))
      // gentle organic float
      tx  = sc.x + Math.sin(clk * 0.3  + index * 0.71) * 0.35
      ty  = sc.y + Math.cos(clk * 0.24 + index * 0.53) * 0.25
      tz  = sc.z + Math.sin(clk * 0.2  + index * 0.43) * 0.12
      trx = sc.rx + Math.sin(clk * 0.16 + index) * 0.03
      try_ = sc.ry + Math.cos(clk * 0.13 + index) * 0.04
      trz = sc.rz
      tsc = sc.scale
      top = fadeP

    } else if (t <= TL.formEnd) {
      // ── FLY INTO Z ────────────────────────────────────────────────
      const globalP = prog(t, TL.formStart, TL.formEnd)
      const maxDelay = 1.95
      const wStart   = (fm.formDelay / maxDelay) * 0.7
      const wordP    = easeOut3(clamp((globalP - wStart) / (1 - wStart + 0.001), 0, 1))
      const floatAmt = 1 - wordP
      const fx = sc.x + Math.sin(clk * 0.3  + index * 0.71) * 0.35 * floatAmt
      const fy = sc.y + Math.cos(clk * 0.24 + index * 0.53) * 0.25 * floatAmt
      tx  = lerp(fx, fm.x, wordP)
      ty  = lerp(fy, fm.y, wordP)
      tz  = lerp(sc.z, fm.z, wordP)
      trx = lerp(sc.rx, 0, wordP)
      try_ = lerp(sc.ry, fm.ry, wordP)
      trz = lerp(sc.rz, 0, wordP)
      tsc = lerp(sc.scale, fm.scale, wordP)
      top = 1

    } else if (t <= TL.shrinkEnd) {
      // ── SHRINK (word-Z shrinks down to 0.05 size) ───────────────────
      const p   = easeInOut2(prog(t, TL.shrinkStart, TL.shrinkEnd))
      tx  = lerp(fm.x, fm.x * 0.05, p)
      ty  = lerp(fm.y, fm.y * 0.05, p)
      tz  = lerp(fm.z, 0, p)
      trx = 0; try_ = 0; trz = 0
      tsc = lerp(fm.scale, 0.05, p)
      top = 1 // stay opaque until handoff

    } else {
      // ── HANDOFF TO PLAIN Z ──────────────────────────────────────────
      tx = 0; ty = 0; tz = 0
      trx = 0; try_ = 0; trz = 0
      tsc = 0; top = 0
    }

    cur.x       = slerp(cur.x,       tx,    7,  dt)
    cur.y       = slerp(cur.y,       ty,    7,  dt)
    cur.z       = slerp(cur.z,       tz,    7,  dt)
    cur.rx      = slerp(cur.rx,      trx,   9,  dt)
    cur.ry      = slerp(cur.ry,      try_,  9,  dt)
    cur.rz      = slerp(cur.rz,      trz,   9,  dt)
    cur.scale   = slerp(cur.scale,   tsc,   6,  dt)
    cur.opacity = slerp(cur.opacity, top,   7,  dt)

    if (meshRef.current) {
      meshRef.current.position.set(cur.x, cur.y, cur.z)
      meshRef.current.rotation.set(cur.rx, cur.ry, cur.rz)
      const s = Math.max(0.0001, cur.scale)
      meshRef.current.scale.set(s * aspect, s, s)
    }
    if (matRef.current) {
      matRef.current.opacity = clamp(cur.opacity, 0, 1)
    }
  })

  if (!tex) return null

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        ref={matRef}
        map={tex}
        transparent
        opacity={0}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// ─── Scene ────────────────────────────────────────────────────────────────────
function Scene({ animRef, scattered, formed }) {
  return (
    <group>
      {WORDS.map((word, i) => (
        <WordSprite
          key={word}
          word={word}
          index={i}
          animRef={animRef}
          sc={scattered[i]}
          fm={formed[i]}
        />
      ))}
    </group>
  )
}

// ─── Main wrapper ─────────────────────────────────────────────────────────────
export function LandingAnimationWrapper({ children, onComplete }) {
  const [done, setDone] = useState(false)

  // elapsed is driven by rAF, starts only after Canvas is ready
  const animRef  = useRef({ elapsed: -1, done: false })  // -1 = not started yet
  const bigZRef  = useRef(null)
  const flashRef = useRef(null)
  const bgZRef   = useRef(null)
  const rafRef   = useRef(null)
  const startRef = useRef(null)

  const scattered = useRef(makeScattered())
  const formed    = useRef(makeZFormation())

  // Called by the Canvas onCreated — starts the timer the moment WebGL is ready
  const handleCanvasReady = () => {
    if (startRef.current !== null) return  // already started
    startRef.current = performance.now()
    startRaf()
  }

  function startRaf() {
    function tick() {
      if (animRef.current.done) return

      const t = (performance.now() - startRef.current) / 1000
      animRef.current.elapsed = t

      // ── Plain Z: takes over instantly when words shrink ───────────────
      if (bigZRef.current) {
        if (t >= TL.zoomStart && t < TL.revealStart) {
          // Zoom BIG from 0.05
          const p = easeInOut2(prog(t, TL.zoomStart, TL.zoomEnd))
          const sc = lerp(0.05, 85, p)
          const flashCov = easeInOut2(prog(t, TL.flashStart, TL.flashEnd))
          bigZRef.current.style.opacity = String(Math.max(0, 1 - flashCov))
          bigZRef.current.style.transform = `translate(-50%,-50%) scale(${sc})`
        } else {
          // hidden before 6.5s
          bigZRef.current.style.opacity = '0'
          bigZRef.current.style.transform = 'translate(-50%,-50%) scale(0.05)'
        }
      }

      // ── Black flash ───────────────────────────────────────────────────
      if (flashRef.current) {
        if (t >= TL.flashStart && t < TL.revealStart) {
          const p = easeInOut2(prog(t, TL.flashStart, TL.flashEnd))
          flashRef.current.style.opacity = String(p)
        } else if (t >= TL.revealStart && t < TL.revealEnd) {
          const p = easeOut3(prog(t, TL.revealStart, TL.revealEnd))
          flashRef.current.style.opacity = String(lerp(1, 0, p))
        } else if (t < TL.flashStart) {
          flashRef.current.style.opacity = '0'
        }
      }

      // ── Done ──────────────────────────────────────────────────────────
      if (t >= TL.revealEnd && !animRef.current.done) {
        animRef.current.done = true
        if (bgZRef.current) bgZRef.current.style.opacity = '1'
        setDone(true)
        onComplete?.()
        return
      }

      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  useEffect(() => {
    const fallback = setTimeout(() => {
      if (!animRef.current.done) {
        animRef.current.done = true
        setDone(true)
        onComplete?.()
      }
    }, (TOTAL + 8) * 1000)
    return () => {
      cancelAnimationFrame(rafRef.current)
      clearTimeout(fallback)
    }
  }, [onComplete])

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100svh' }}>

      {/* Ghost Z background (shown after animation) */}
      <div
        ref={bgZRef}
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, zIndex: 0,
          pointerEvents: 'none', opacity: 0,
          transition: 'opacity 2s ease-out',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <span style={{
          fontFamily: "'ClashDisplay', 'Inter', sans-serif",
          fontWeight: 700,
          fontSize: 'clamp(280px, 82vw, 1350px)',
          lineHeight: 0.85,
          letterSpacing: '-0.05em',
          color: 'transparent',
          WebkitTextStroke: '1.5px rgba(255,255,255,0.06)',
          userSelect: 'none',
          display: 'block',
        }}>Z</span>
      </div>

      {/* Animation overlay */}
      {!done && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: '#000', overflow: 'hidden',
        }}>
          {/* Canvas starts instantly, drives animation clock via onCreated */}
          <Canvas
            dpr={[1, 1.4]}
            gl={{
              antialias: false, alpha: false,
              powerPreference: 'high-performance',
              stencil: false, depth: true,
            }}
            camera={{ position: [0, 0, 16], fov: 52, near: 0.1, far: 200 }}
            style={{ position: 'absolute', inset: 0 }}
            onCreated={({ gl }) => {
              gl.setClearColor(0x000000, 1)
              handleCanvasReady()
            }}
          >
            <color attach="background" args={['#000000']} />
            <fog attach="fog" args={['#000000', 14, 30]} />
            <ambientLight intensity={0.6} />

            <Scene
              animRef={animRef}
              scattered={scattered.current}
              formed={formed.current}
            />
          </Canvas>

          {/* Plain Z — starts at natural size, zooms to fill screen */}
          {/* Size matches the word-Z at formed scale so morph is seamless */}
          <div
            ref={bigZRef}
            style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%) scale(1)',
              fontFamily: "'ClashDisplay', 'Inter', sans-serif",
              fontWeight: 700,
              // Size tuned so the Z letter visually matches the bounding box of word-Z
              fontSize: 'clamp(90px, 14vw, 200px)',
              color: '#ffffff',
              letterSpacing: '-0.05em',
              lineHeight: 1,
              opacity: 0,
              willChange: 'transform, opacity',
              userSelect: 'none',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Z
          </div>

          {/* Black flash */}
          <div
            ref={flashRef}
            style={{
              position: 'absolute', inset: 0,
              background: '#000000', opacity: 0,
              pointerEvents: 'none',
            }}
          />
        </div>
      )}

      {/* Page content */}
      <div
        style={{
          position: 'relative', zIndex: 1,
          opacity: done ? 1 : 0,
          transition: done ? 'opacity 0.8s ease-out' : 'none',
          willChange: 'opacity',
        }}
      >
        {children}
      </div>
    </div>
  )
}