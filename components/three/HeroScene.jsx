'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * HeroScene — Three.js r185 particle field reconstruction.
 *
 * The original used a 9.4 MB compiled bundle. This faithfully
 * reconstructs the visual: a dark space with floating white particles
 * connected by faint lines, slowly rotating — consistent with the
 * "intelligence systems" brand theme.
 *
 * Reconstruction confidence: HIGH (visual match from canvas snapshot)
 */
export default function HeroScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x050505, 1);
    mount.appendChild(renderer.domElement);

    /* ── Scene & Camera ── */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 28;

    /* ── Particles ── */
    const PARTICLE_COUNT = 600;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const spread = 40;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread * 0.6;
      sizes[i] = Math.random() * 1.5 + 0.5;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.08,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    /* ── Connection lines ── */
    // Build a line mesh connecting nearby particles
    const linePositions = [];
    const maxDist = 8;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ax = positions[i * 3];
      const ay = positions[i * 3 + 1];
      const az = positions[i * 3 + 2];

      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const bx = positions[j * 3];
        const by = positions[j * 3 + 1];
        const bz = positions[j * 3 + 2];
        const dist = Math.sqrt(
          (ax - bx) ** 2 + (ay - by) ** 2 + (az - bz) ** 2
        );
        if (dist < maxDist) {
          linePositions.push(ax, ay, az, bx, by, bz);
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(linePositions, 3)
    );

    const lineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.06,
    });

    const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineSegments);

    /* ── Central rotating ring group ── */
    const ringGroup = new THREE.Group();

    const torusGeo1 = new THREE.TorusGeometry(6, 0.01, 8, 80);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.08,
    });

    const ring1 = new THREE.Mesh(torusGeo1, torusMat);
    ring1.rotation.x = Math.PI / 3;
    ringGroup.add(ring1);

    const torusGeo2 = new THREE.TorusGeometry(9, 0.008, 8, 80);
    const ring2 = new THREE.Mesh(torusGeo2, torusMat.clone());
    ring2.rotation.x = -Math.PI / 5;
    ring2.rotation.y = Math.PI / 4;
    ringGroup.add(ring2);

    const torusGeo3 = new THREE.TorusGeometry(12, 0.006, 8, 80);
    const ring3 = new THREE.Mesh(torusGeo3, torusMat.clone());
    ring3.rotation.x = Math.PI / 6;
    ring3.rotation.z = Math.PI / 3;
    ringGroup.add(ring3);

    scene.add(ringGroup);

    /* ── Mouse parallax ── */
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    /* ── Resize ── */
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    /* ── Animation loop ── */
    let frameId;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth mouse follow
      targetX += (mouseX - targetX) * 0.02;
      targetY += (mouseY - targetY) * 0.02;

      // Slow rotation of entire particle field
      particles.rotation.y = elapsed * 0.012;
      particles.rotation.x = elapsed * 0.005;

      // Ring counter-rotation
      ringGroup.rotation.y = elapsed * 0.04 + targetX * 0.3;
      ringGroup.rotation.x = elapsed * 0.02 + targetY * 0.2;

      // Lines follow particles
      lineSegments.rotation.y = particles.rotation.y;
      lineSegments.rotation.x = particles.rotation.x;

      // Camera subtle parallax
      camera.position.x += (targetX * 2 - camera.position.x) * 0.04;
      camera.position.y += (targetY * 1.5 - camera.position.y) * 0.04;

      // Breathe effect on particle opacity
      particleMat.opacity = 0.45 + Math.sin(elapsed * 0.5) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    /* ── Cleanup ── */
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      // Dispose
      particleGeo.dispose();
      particleMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      torusGeo1.dispose();
      torusGeo2.dispose();
      torusGeo3.dispose();
      torusMat.dispose();
      renderer.dispose();

      if (mount && renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'auto',
      }}
    />
  );
}
