'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const MAX_PULSES = 12
const PULSE_SPEED = 0.6
const PULSE_LIFETIME = 2.5

/**
 * ConnectionPulses — tiny white light pulses that travel between
 * nearby words once the Z is formed. Uses instanced rendering
 * for a single draw call.
 */
export default function ConnectionPulses({ neighborDataRef }) {
  const instancedRef = useRef()
  const pulsesRef = useRef([])
  const spawnTimer = useRef(0)

  // Temp objects for instanced mesh updates
  const tempObject = useMemo(() => new THREE.Object3D(), [])
  const tempColor = useMemo(() => new THREE.Color(), [])

  // Create a pool of pulses
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)

    // Get word positions from the shared neighborDataRef
    const neighborData = neighborDataRef?.current
    if (!neighborData || !neighborData.formed) {
      // Not ready yet — hide all instances
      if (instancedRef.current) {
        for (let i = 0; i < MAX_PULSES; i++) {
          tempObject.position.set(0, 0, -100)
          tempObject.scale.setScalar(0)
          tempObject.updateMatrix()
          instancedRef.current.setMatrixAt(i, tempObject.matrix)
        }
        instancedRef.current.instanceMatrix.needsUpdate = true
      }
      return
    }

    const positions = neighborData.positions
    if (!positions || positions.length < 2) return

    // Spawn new pulses
    spawnTimer.current += dt
    if (spawnTimer.current > 0.35 && pulsesRef.current.length < MAX_PULSES) {
      spawnTimer.current = 0

      // Pick two nearby words
      const a = Math.floor(Math.random() * positions.length)
      let bestB = -1
      let bestDist = Infinity
      for (let k = 0; k < 8; k++) {
        const b = Math.floor(Math.random() * positions.length)
        if (b === a) continue
        const dx = positions[b].x - positions[a].x
        const dy = positions[b].y - positions[a].y
        const dz = positions[b].z - positions[a].z
        const d = dx * dx + dy * dy + dz * dz
        if (d < bestDist && d > 0.5) {
          bestDist = d
          bestB = b
        }
      }

      if (bestB >= 0 && positions[a].opacity > 0.5 && positions[bestB].opacity > 0.5) {
        pulsesRef.current.push({
          fromX: positions[a].x,
          fromY: positions[a].y,
          fromZ: positions[a].z,
          toX: positions[bestB].x,
          toY: positions[bestB].y,
          toZ: positions[bestB].z,
          progress: 0,
          lifetime: PULSE_LIFETIME * (0.7 + Math.random() * 0.6),
          age: 0,
        })
      }
    }

    // Update existing pulses
    const activePulses = []
    for (const pulse of pulsesRef.current) {
      pulse.age += dt
      pulse.progress = Math.min(1, pulse.age / pulse.lifetime)
      if (pulse.progress < 1) {
        activePulses.push(pulse)
      }
    }
    pulsesRef.current = activePulses

    // Update instanced mesh
    if (!instancedRef.current) return

    for (let i = 0; i < MAX_PULSES; i++) {
      if (i < activePulses.length) {
        const p = activePulses[i]
        const t = p.progress

        // Position: lerp along connection
        const ease = t < 0.5
          ? 2 * t * t
          : 1 - Math.pow(-2 * t + 2, 2) / 2

        tempObject.position.set(
          THREE.MathUtils.lerp(p.fromX, p.toX, ease),
          THREE.MathUtils.lerp(p.fromY, p.toY, ease),
          THREE.MathUtils.lerp(p.fromZ, p.toZ, ease),
        )

        // Scale: fade in and out
        const scaleCurve = Math.sin(t * Math.PI)
        tempObject.scale.setScalar(0.03 + scaleCurve * 0.04)

        tempObject.updateMatrix()
        instancedRef.current.setMatrixAt(i, tempObject.matrix)

        // Color intensity
        instancedRef.current.setColorAt(i, tempColor.setHSL(0, 0, 0.7 + scaleCurve * 0.3))
      } else {
        // Hide unused instances
        tempObject.position.set(0, 0, -100)
        tempObject.scale.setScalar(0)
        tempObject.updateMatrix()
        instancedRef.current.setMatrixAt(i, tempObject.matrix)
      }
    }

    instancedRef.current.instanceMatrix.needsUpdate = true
    if (instancedRef.current.instanceColor) {
      instancedRef.current.instanceColor.needsUpdate = true
    }
  })

  return (
    <instancedMesh
      ref={instancedRef}
      args={[null, null, MAX_PULSES]}
      frustumCulled={false}
    >
      <sphereGeometry args={[1, 8, 6]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.9}
        toneMapped={false}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  )
}
