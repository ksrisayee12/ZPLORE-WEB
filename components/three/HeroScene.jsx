'use client'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useRef, useMemo } from 'react'
import * as THREE from 'three'
import WordCloud from './WordCloud'
import ConnectionPulses from './ConnectionPulses'
import HeroPostFX from './HeroPostFX'

/**
 * CameraRig — Cinematic intro dolly + subtle breathing motion.
 * Camera starts far away and slowly pulls in during the first 4 seconds,
 * then breathes gently for an organic feel.
 */
function CameraRig() {
  const { camera } = useThree()
  const startRef = useRef(null)

  useFrame((state) => {
    if (!startRef.current) startRef.current = state.clock.getElapsedTime()
    const elapsed = state.clock.getElapsedTime() - startRef.current
    
    // Intro dolly: 18 -> 13 over 4 seconds
    const introT = Math.min(1, elapsed / 4)
    const introEase = 1 - Math.pow(1 - introT, 3)
    const baseZ = 18 - introEase * 5

    // Subtle breathing motion
    const breatheX = Math.sin(elapsed * 0.12) * 0.15
    const breatheY = Math.cos(elapsed * 0.09) * 0.1

    camera.position.set(breatheX, breatheY, baseZ)
    camera.lookAt(0, 0, 0)
  })

  return null
}

/**
 * VolumetricFog — A subtle fog plane that adds atmospheric depth.
 * Uses a large transparent plane with a radial gradient texture.
 */
function AtmosphericPlane() {
  const meshRef = useRef()
  const texture = useMemo(() => {
    const size = 256
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    const ctx = canvas.getContext('2d')
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    grad.addColorStop(0, 'rgba(255,255,255,0.04)')
    grad.addColorStop(0.5, 'rgba(255,255,255,0.015)')
    grad.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, size, size)
    const tex = new THREE.CanvasTexture(canvas)
    tex.needsUpdate = true
    return tex
  }, [])

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime()
      meshRef.current.rotation.z = t * 0.02
      meshRef.current.material.opacity = 0.3 + Math.sin(t * 0.2) * 0.05
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -3]}>
      <planeGeometry args={[20, 20]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.3}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

/**
 * HeroScene — Main Three.js canvas for the Z-formation hero animation.
 * 
 * Props:
 *   scrollProgress: React ref with scroll progress (0-1)
 *   mouseWorld: React ref with normalized mouse coordinates
 */
export default function HeroScene({ scrollProgress, mouseWorld }) {
  // Shared ref for word position data used by ConnectionPulses
  const neighborDataRef = useRef({ positions: [], formed: false })

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      }}
      camera={{ position: [0, 0, 18], fov: 50, near: 0.1, far: 50 }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 14, 30]} />

      {/* Cinematic lighting — soft and directional */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 8, 5]} intensity={0.25} color="#ffffff" />
      <pointLight position={[-4, -3, 8]} intensity={0.1} color="#ffffff" distance={20} />

      <Suspense fallback={null}>
        <WordCloud
          scrollProgress={scrollProgress}
          mouseWorld={mouseWorld}
          neighborDataRef={neighborDataRef}
        />
        <ConnectionPulses neighborDataRef={neighborDataRef} />
        <AtmosphericPlane />
        <CameraRig />
      </Suspense>

      <HeroPostFX />
    </Canvas>
  )
}