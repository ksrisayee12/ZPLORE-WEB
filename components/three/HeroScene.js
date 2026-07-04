'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function makeSprite() {
  const size = 128
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.25, 'rgba(255,255,255,0.7)')
  grad.addColorStop(0.55, 'rgba(255,255,255,0.15)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, size, size)
  return new THREE.CanvasTexture(c)
}

function createField(count) {
  const positions = new Float32Array(count * 3)
  const originals = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const phi = Math.acos(2 * Math.random() - 1)
    const theta = Math.random() * Math.PI * 2
    const r = 2.2 + Math.sin(theta * 3 + phi * 2) * 0.7 + (Math.random() - 0.5) * 0.6
    const jitter = (Math.random() - 0.5) * 0.4
    const x = Math.sin(phi) * Math.cos(theta) * r + jitter
    const y = Math.cos(phi) * r * 0.7 + (Math.random() - 0.5) * 0.6
    const z = Math.sin(phi) * Math.sin(theta) * r + jitter

    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z
    originals[i * 3] = x
    originals[i * 3 + 1] = y
    originals[i * 3 + 2] = z
  }

  return { positions, originals }
}

function createLines(originals, count, segments) {
  const linePositions = new Float32Array(segments * 6)

  for (let i = 0; i < segments; i++) {
    const a = Math.floor(Math.random() * count)
    const ax = originals[a * 3]
    const ay = originals[a * 3 + 1]
    const az = originals[a * 3 + 2]
    let bestB = a
    let bestD = Infinity

    for (let k = 0; k < 12; k++) {
      const b = Math.floor(Math.random() * count)
      const dx = originals[b * 3] - ax
      const dy = originals[b * 3 + 1] - ay
      const dz = originals[b * 3 + 2] - az
      const d = dx * dx + dy * dy + dz * dz
      if (d < bestD && d > 0.01) {
        bestD = d
        bestB = b
      }
    }

    linePositions[i * 6] = ax
    linePositions[i * 6 + 1] = ay
    linePositions[i * 6 + 2] = az
    linePositions[i * 6 + 3] = originals[bestB * 3]
    linePositions[i * 6 + 4] = originals[bestB * 3 + 1]
    linePositions[i * 6 + 5] = originals[bestB * 3 + 2]
  }

  return linePositions
}

export default function HeroScene() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const count = 5200
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100)
    const mouse = { x: 0, y: 0 }
    const start = performance.now()
    const sprite = makeSprite()
    const { positions, originals } = createField(count)

    scene.background = new THREE.Color('#050505')
    scene.fog = new THREE.Fog('#050505', 5, 14)
    camera.position.set(0, 0, 9)

    const glowGeometry = new THREE.BufferGeometry()
    glowGeometry.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3))
    const glowMaterial = new THREE.PointsMaterial({
      size: 0.16,
      map: sprite,
      color: '#ffffff',
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })
    const glowPoints = new THREE.Points(glowGeometry, glowMaterial)

    const pointGeometry = new THREE.BufferGeometry()
    pointGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const pointMaterial = new THREE.PointsMaterial({
      size: 0.04,
      map: sprite,
      color: '#ffffff',
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })
    const points = new THREE.Points(pointGeometry, pointMaterial)

    const lineGeometry = new THREE.BufferGeometry()
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(createLines(originals, count, 380), 3))
    const lineMaterial = new THREE.LineBasicMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0.09,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial)

    scene.add(glowPoints, points, lines)

    const resize = () => {
      const width = canvas.clientWidth || window.innerWidth
      const height = canvas.clientHeight || window.innerHeight
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6))
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    const handleMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }

    let frameId
    let last = performance.now()
    const animate = (now) => {
      const elapsed = (now - start) / 1000
      const delta = (now - last) / 1000
      last = now

      const arr = pointGeometry.attributes.position.array
      for (let i = 0; i < count; i++) {
        const ox = originals[i * 3]
        const oy = originals[i * 3 + 1]
        const oz = originals[i * 3 + 2]
        arr[i * 3] = ox + Math.sin(elapsed * 0.5 + i * 0.013) * 0.08
        arr[i * 3 + 1] = oy + Math.cos(elapsed * 0.4 + i * 0.009) * 0.1
        arr[i * 3 + 2] = oz + Math.sin(elapsed * 0.45 + i * 0.011) * 0.08
      }
      pointGeometry.attributes.position.needsUpdate = true
      glowGeometry.attributes.position.array.set(arr)
      glowGeometry.attributes.position.needsUpdate = true

      points.rotation.y += (mouse.x * 0.5 - points.rotation.y) * 0.04
      points.rotation.x += (mouse.y * 0.25 - points.rotation.x) * 0.04
      points.rotation.z += delta * 0.015
      glowPoints.rotation.copy(points.rotation)
      lines.rotation.copy(points.rotation)

      const intro = Math.min(1, elapsed / 3.2)
      const ease = 1 - Math.pow(1 - intro, 3)
      camera.position.x = Math.sin(elapsed * 0.08) * 0.5
      camera.position.y = Math.cos(elapsed * 0.06) * 0.25
      camera.position.z = 9 - ease * 3
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMove, { passive: true })
    frameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMove)
      glowGeometry.dispose()
      pointGeometry.dispose()
      lineGeometry.dispose()
      glowMaterial.dispose()
      pointMaterial.dispose()
      lineMaterial.dispose()
      sprite.dispose()
      renderer.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} className="block h-full w-full" />
}
