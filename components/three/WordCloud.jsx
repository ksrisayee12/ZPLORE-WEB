'use client'
import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import {
  WORDS,
  getScatteredPositions,
  getZFormationPositions,
  getDissolvePositions,
  getWordFormationProgress,
  getWordFadeProgress,
  TIMELINE,
  noise,
} from './ZFormationEngine'

// Font weights mapped to visual importance
const FONT_SCALES = {
  'AI': 1.3,
  'INTELLIGENCE': 1.15,
  'ENGINEERING': 1.1,
  'ENTERPRISE': 1.05,
  'INNOVATION': 1.1,
  'INFRASTRUCTURE': 0.85,
  'CYBERSECURITY': 0.9,
  'ARCHITECTURE': 0.9,
  'AUTOMATION': 0.95,
  'COMMUNITY': 0.95,
}

// Simple spring interpolation
function springLerp(current, target, stiffness, dt) {
  return current + (target - current) * Math.min(1, stiffness * dt)
}

export default function WordCloud({ scrollProgress = { current: 0 }, mouseWorld = { current: { x: 0, y: 0 } }, neighborDataRef }) {
  const groupRef = useRef()
  const wordRefs = useRef([])
  const startTime = useRef(null)
  const wordStates = useRef([])

  const count = WORDS.length

  // Pre-compute all positions
  const scattered = useMemo(() => getScatteredPositions(count), [count])
  const formed = useMemo(() => getZFormationPositions(count), [count])
  const dissolved = useMemo(() => getDissolvePositions(formed), [formed])

  // Initialize word states
  useEffect(() => {
    wordStates.current = WORDS.map((_, i) => ({
      // Current interpolated values
      x: scattered[i].x,
      y: scattered[i].y,
      z: scattered[i].z,
      rotX: scattered[i].rotationX,
      rotY: scattered[i].rotationY,
      rotZ: scattered[i].rotationZ,
      scale: scattered[i].scale,
      opacity: 0,
      // Velocities for micro-animation
      vx: 0, vy: 0, vz: 0,
    }))
  }, [scattered])

  // Neighbor data is provided by parent for ConnectionPulses to read

  useFrame((state, delta) => {
    if (!startTime.current) startTime.current = state.clock.getElapsedTime()
    const elapsed = state.clock.getElapsedTime() - startTime.current
    const dt = Math.min(delta, 0.05) // cap delta
    const scroll = scrollProgress.current || 0
    const mx = mouseWorld.current?.x || 0
    const my = mouseWorld.current?.y || 0

    // Determine if we're in dissolve phase
    const dissolveT = Math.max(0, Math.min(1, (scroll - 0.15) / 0.65))
    // Smooth dissolve easing
    const dissolveEase = dissolveT * dissolveT * (3 - 2 * dissolveT)

    const currentPositions = []

    for (let i = 0; i < count; i++) {
      const ref = wordRefs.current[i]
      if (!ref) continue
      const ws = wordStates.current[i]
      if (!ws) continue

      // --- Compute target position ---
      const fadeProgress = getWordFadeProgress(elapsed, i)
      const formDelay = formed[i]?.formationDelay || 0
      const formProgress = getWordFormationProgress(elapsed, formDelay)

      // Blend between scattered and formed
      let targetX, targetY, targetZ, targetRotX, targetRotY, targetRotZ, targetScale, targetOpacity

      if (dissolveEase > 0.01) {
        // Dissolve phase: blend formed -> dissolved
        targetX = THREE.MathUtils.lerp(formed[i].x, dissolved[i].x, dissolveEase)
        targetY = THREE.MathUtils.lerp(formed[i].y, dissolved[i].y, dissolveEase)
        targetZ = THREE.MathUtils.lerp(formed[i].z, dissolved[i].z, dissolveEase)
        targetRotX = THREE.MathUtils.lerp(0, dissolved[i].rotationX, dissolveEase)
        targetRotY = THREE.MathUtils.lerp(formed[i].rotationY, dissolved[i].rotationY, dissolveEase)
        targetRotZ = THREE.MathUtils.lerp(0, dissolved[i].rotationZ, dissolveEase)
        targetScale = THREE.MathUtils.lerp(formed[i].scale, dissolved[i].scale, dissolveEase)
        targetOpacity = Math.max(0, 1 - dissolveEase * 1.3)
      } else {
        // Normal phase: scattered -> formed
        targetX = THREE.MathUtils.lerp(scattered[i].x, formed[i].x, formProgress)
        targetY = THREE.MathUtils.lerp(scattered[i].y, formed[i].y, formProgress)
        targetZ = THREE.MathUtils.lerp(scattered[i].z, formed[i].z, formProgress)
        targetRotX = THREE.MathUtils.lerp(scattered[i].rotationX, 0, formProgress)
        targetRotY = THREE.MathUtils.lerp(scattered[i].rotationY, formed[i].rotationY, formProgress)
        targetRotZ = THREE.MathUtils.lerp(scattered[i].rotationZ, 0, formProgress)
        targetScale = THREE.MathUtils.lerp(scattered[i].scale, formed[i].scale, formProgress)
        targetOpacity = fadeProgress
      }

      // --- Add micro-animation (living Z) ---
      const livingAmount = formProgress > 0.95 ? Math.min(1, (formProgress - 0.95) / 0.05) : 0
      if (livingAmount > 0 && dissolveEase < 0.5) {
        const microT = elapsed * 0.3
        targetX += noise(i * 0.7, microT) * 0.12 * livingAmount
        targetY += noise(i * 0.7 + 100, microT + 50) * 0.1 * livingAmount
        targetZ += noise(i * 0.7 + 200, microT + 100) * 0.08 * livingAmount
        targetRotY += noise(i * 0.5 + 300, microT) * 0.04 * livingAmount
      }

      // --- Drift motion (pre-formation) ---
      if (formProgress < 0.5 && dissolveEase < 0.01) {
        const driftT = elapsed * 0.15
        targetX += Math.sin(driftT + i * 1.7) * 0.3 * (1 - formProgress)
        targetY += Math.cos(driftT * 0.8 + i * 2.3) * 0.2 * (1 - formProgress)
        targetZ += Math.sin(driftT * 0.6 + i * 3.1) * 0.15 * (1 - formProgress)
      }

      // --- Mouse magnetic interaction ---
      const mouseInfluence = formProgress > 0.8 ? 1 : formProgress * 0.3
      if (mouseInfluence > 0 && dissolveEase < 0.3) {
        const dx = mx - ws.x
        const dy = my - ws.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const radius = 3.5
        if (dist < radius && dist > 0.01) {
          const strength = (1 - dist / radius) * 0.6 * mouseInfluence
          targetX += dx * strength * 0.15
          targetY += dy * strength * 0.15
          targetZ += (1 - dist / radius) * 0.4 * mouseInfluence
        }
      }

      // --- Spring interpolation ---
      const stiffness = formProgress > 0.5 ? 2.5 : 1.5
      ws.x = springLerp(ws.x, targetX, stiffness, dt)
      ws.y = springLerp(ws.y, targetY, stiffness, dt)
      ws.z = springLerp(ws.z, targetZ, stiffness, dt)
      ws.rotX = springLerp(ws.rotX, targetRotX, 3, dt)
      ws.rotY = springLerp(ws.rotY, targetRotY, 3, dt)
      ws.rotZ = springLerp(ws.rotZ, targetRotZ, 3, dt)
      ws.scale = springLerp(ws.scale, targetScale, 2.5, dt)
      ws.opacity = springLerp(ws.opacity, targetOpacity, 3.5, dt)

      // Apply to mesh
      ref.position.set(ws.x, ws.y, ws.z)
      ref.rotation.set(ws.rotX, ws.rotY, ws.rotZ)
      const wordScale = (FONT_SCALES[WORDS[i]] || 1) * ws.scale
      ref.scale.setScalar(wordScale)

      // Update opacity — troika Text has fillOpacity on the text object
      // and material.opacity for the underlying material
      if (ref.fillOpacity !== undefined) {
        ref.fillOpacity = ws.opacity
      }
      if (ref.material) {
        ref.material.transparent = true
        ref.material.depthWrite = false
        ref.material.toneMapped = false
        ref.material.opacity = ws.opacity
      }

      currentPositions.push({ x: ws.x, y: ws.y, z: ws.z, opacity: ws.opacity })
    }

    // Update neighbor data for connection pulses
    if (neighborDataRef) {
      neighborDataRef.current.positions = currentPositions
      neighborDataRef.current.formed = elapsed > TIMELINE.livingStart && dissolveEase < 0.5
    }
  })

  return (
    <group ref={groupRef}>
      {WORDS.map((word, i) => (
        <Text
          key={word}
          ref={(el) => { wordRefs.current[i] = el }}
          fontSize={0.38}
          font="/fonts/ClashDisplay-Semibold.woff"
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.06}
          fillOpacity={0}
          position={[
            scattered[i]?.x || 0,
            scattered[i]?.y || 0,
            scattered[i]?.z || 0,
          ]}
        >
          {word}
        </Text>
      ))}
    </group>
  )
}
