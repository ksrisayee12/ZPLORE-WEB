'use client'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef, Suspense, useEffect } from 'react'
import * as THREE from 'three'

// generate a soft white radial sprite for points
function makeSprite() {
  const size = 128
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.25, 'rgba(255,255,255,0.7)')
  grad.addColorStop(0.55, 'rgba(255,255,255555,0.15)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(c)
  tex.needsUpdate = true
  return tex
}

function NeuralField({ count = 5200 }) {
  const ref = useRef()
  const glowRef = useRef()
  const lineRef = useRef()
  const mouse = useRef({ x: 0, y: 0 })
  const sprite = useMemo(() => makeSprite(), [])

  const { positions, originals } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const originals = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // Cluster around an organic neural manifold (spherical with noise)
      const phi = Math.acos(2 * Math.random() - 1)
      const theta = Math.random() * Math.PI * 2
      // bias toward forming filament structures
      const r = 2.2 + Math.sin(theta * 3 + phi * 2) * 0.7 + (Math.random() - 0.5) * 0.6
      const jitter = (Math.random() - 0.5) * 0.4
      const x = Math.sin(phi) * Math.cos(theta) * r + jitter
      const y = Math.cos(phi) * r * 0.7 + (Math.random() - 0.5) * 0.6
      const z = Math.sin(phi) * Math.sin(theta) * r + jitter
      positions[i * 3] = x; positions[i * 3 + 1] = y; positions[i * 3 + 2] = z
      originals[i * 3] = x; originals[i * 3 + 1] = y; originals[i * 3 + 2] = z
    }
    return { positions, originals }
  }, [count])

  // sparse connecting filaments
  const linePositions = useMemo(() => {
    const segs = 380
    const arr = new Float32Array(segs * 6)
    for (let i = 0; i < segs; i++) {
      const a = Math.floor(Math.random() * count)
      // find a nearby point
      const ax = originals[a * 3], ay = originals[a * 3 + 1], az = originals[a * 3 + 2]
      let bestB = a, bestD = 1e9
      for (let k = 0; k < 12; k++) {
        const b = Math.floor(Math.random() * count)
        const dx = originals[b * 3] - ax, dy = originals[b * 3 + 1] - ay, dz = originals[b * 3 + 2] - az
        const d = dx * dx + dy * dy + dz * dz
        if (d < bestD && d > 0.01) { bestD = d; bestB = b }
      }
      arr[i * 6] = ax; arr[i * 6 + 1] = ay; arr[i * 6 + 2] = az
      arr[i * 6 + 3] = originals[bestB * 3]; arr[i * 6 + 4] = originals[bestB * 3 + 1]; arr[i * 6 + 5] = originals[bestB * 3 + 2]
    }
    return arr
  }, [originals, count])

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    if (ref.current) {
      const arr = ref.current.geometry.attributes.position.array
      for (let i = 0; i < count; i++) {
        const ox = originals[i * 3], oy = originals[i * 3 + 1], oz = originals[i * 3 + 2]
        arr[i * 3] = ox + Math.sin(t * 0.5 + i * 0.013) * 0.08
        arr[i * 3 + 1] = oy + Math.cos(t * 0.4 + i * 0.009) * 0.1
        arr[i * 3 + 2] = oz + Math.sin(t * 0.45 + i * 0.011) * 0.08
      }
      ref.current.geometry.attributes.position.needsUpdate = true

      ref.current.rotation.y += (mouse.current.x * 0.5 - ref.current.rotation.y) * 0.04
      ref.current.rotation.x += (mouse.current.y * 0.25 - ref.current.rotation.x) * 0.04
      ref.current.rotation.z += delta * 0.015
    }
    if (glowRef.current && ref.current) {
      glowRef.current.rotation.copy(ref.current.rotation)
      glowRef.current.geometry.attributes.position.needsUpdate = true
      glowRef.current.geometry.attributes.position.array.set(ref.current.geometry.attributes.position.array)
    }
    if (lineRef.current && ref.current) {
      lineRef.current.rotation.copy(ref.current.rotation)
    }
  })

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <group>
      {/* big soft glow layer (fake bloom) */}
      <points ref={glowRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions.slice()} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          map={sprite}
          color={'#ffffff'}
          transparent
          opacity={0.35}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
      {/* sharp core points */}
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          map={sprite}
          color={'#ffffff'}
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
      {/* connecting filaments */}
      <lineSegments ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={linePositions.length / 3} array={linePositions} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color={'#ffffff'} transparent opacity={0.09} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
    </group>
  )
}

function CameraRig() {
  const { camera } = useThree()
  const start = useRef(Date.now())
  useFrame(() => {
    const t = (Date.now() - start.current) / 1000
    // cinematic dolly: pull from far in
    const intro = Math.min(1, t / 3.2)
    const ease = 1 - Math.pow(1 - intro, 3)
    const baseZ = 9 - ease * 3 // 9 -> 6
    camera.position.x = Math.sin(t * 0.08) * 0.5
    camera.position.y = Math.cos(t * 0.06) * 0.25
    camera.position.z = baseZ
    camera.lookAt(0, 0, 0)
  })
  return null
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 9], fov: 55 }}
    >
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 5, 14]} />
      <Suspense fallback={null}>
        <NeuralField count={5200} />
        <CameraRig />
      </Suspense>
    </Canvas>
  )
}