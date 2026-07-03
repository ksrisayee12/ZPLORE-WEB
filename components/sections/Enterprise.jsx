'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Enterprise Section — reconstructed from reference HTML.
 *
 * Left column: heading, description, 4 feature bullets.
 * Right column: SVG network architecture diagram with:
 *   - Grid background
 *   - Bezier curve edges (animated stroke-dashoffset)
 *   - Circular node groups (EDGE, GATEWAY, AUTHZ/MTLS, ORCHESTRATOR, etc.)
 *   - Pulsing dot animations on edges
 */

const nodes = [
  { x: 80,   y: 120, label: 'EDGE' },
  { x: 280,  y: 80,  label: 'GATEWAY' },
  { x: 280,  y: 200, label: 'AUTHZ / MTLS' },
  { x: 520,  y: 140, label: 'ORCHESTRATOR' },
  { x: 760,  y: 60,  label: 'MODEL A' },
  { x: 760,  y: 220, label: 'MODEL B' },
  { x: 980,  y: 140, label: 'ROUTER' },
  { x: 1180, y: 80,  label: 'AUDIT LOG' },
  { x: 1180, y: 220, label: 'VECTOR DB' },
  { x: 520,  y: 320, label: 'CACHE' },
];

const edges = [
  [0, 1], [0, 2],
  [1, 3], [2, 3],
  [3, 4], [3, 5],
  [4, 6], [5, 6],
  [6, 7], [6, 8],
  [3, 9],
];

function bezierPath(from, to) {
  const cx = (from.x + to.x) / 2;
  return `M ${from.x} ${from.y} Q ${cx} ${from.y} ${to.x} ${to.y}`;
}

const features = [
  'SOC2-ready by default',
  'BYOK / customer-managed encryption',
  'Self-hosted, hybrid or fully managed',
  'Sub-100ms agent orchestration',
];

export default function Enterprise() {
  const sectionRef = useRef(null);
  const edgeRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Animate edges in */
      edgeRefs.current.forEach((el, i) => {
        if (!el) return;
        const len = el.getTotalLength?.() ?? 250;
        gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(el, {
          strokeDashoffset: 0,
          duration: 0.8,
          delay: i * 0.06,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        });
      });

      /* Animate nodes */
      gsap.fromTo(
        '.enterprise-node',
        { opacity: 0, scale: 0.4 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.07,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );

      /* Section text reveal */
      gsap.fromTo(
        '.enterprise-text > *',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="enterprise"
      ref={sectionRef}
      className="relative w-full bg-[#050505] py-32 md:py-40 overflow-hidden"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-10">
          {/* Left — text */}
          <div className="md:col-span-4 enterprise-text">
            <div className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4">
              Enterprise — 007
            </div>
            <h2 className="display text-5xl md:text-7xl mb-8">
              Built for scale, designed for trust.
            </h2>
            <p className="text-white/60 leading-relaxed max-w-md">
              A reference architecture for production AI systems. Identity at the
              edge. Models behind policy. Every event signed, sealed, replayable.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-white/70">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-white rounded-full" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — SVG diagram */}
          <div className="md:col-span-8">
            <div className="border border-white/10 bg-[#0a0a0a] aspect-[1300/420] w-full overflow-hidden">
              <svg
                viewBox="0 0 1300 420"
                className="w-full h-full"
              >
                {/* Grid background */}
                <defs>
                  <pattern
                    id="grid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="rgba(255,255,255,0.04)"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect width="1300" height="420" fill="url(#grid)" />

                {/* Edges */}
                {edges.map(([fromIdx, toIdx], i) => {
                  const from = nodes[fromIdx];
                  const to = nodes[toIdx];
                  return (
                    <path
                      key={i}
                      ref={(el) => (edgeRefs.current[i] = el)}
                      d={bezierPath(from, to)}
                      stroke="white"
                      strokeOpacity="0.45"
                      strokeWidth="1"
                      fill="none"
                      className="edge"
                    />
                  );
                })}

                {/* Pulse dots on edges */}
                {edges.map(([fromIdx, toIdx], i) => {
                  const from = nodes[fromIdx];
                  const to = nodes[toIdx];
                  return (
                    <circle
                      key={`pulse-${i}`}
                      r="3"
                      fill="white"
                      cx={(from.x + to.x) / 2}
                      cy={(from.y + to.y) / 2}
                      className="pulse"
                      style={{ animationDelay: `${i * 0.3}s` }}
                    />
                  );
                })}

                {/* Nodes */}
                {nodes.map((node, i) => (
                  <g
                    key={i}
                    className="enterprise-node"
                    transform={`translate(${node.x}, ${node.y})`}
                    style={{ opacity: 0 }}
                  >
                    <circle
                      r="22"
                      fill="#050505"
                      stroke="white"
                      strokeOpacity="0.8"
                    />
                    <circle r="3" fill="white" />
                    <text
                      y="38"
                      textAnchor="middle"
                      fill="rgba(255,255,255,0.7)"
                      fontSize="9"
                      fontFamily="Inter, sans-serif"
                      letterSpacing="1"
                    >
                      {node.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
