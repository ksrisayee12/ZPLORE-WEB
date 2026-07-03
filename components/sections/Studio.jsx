'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Studio Section — GSAP-pinned horizontal panel cycling.
 *
 * Reference DOM: section#studio is pinned for 3x viewport heights.
 * Left column: 3 overlapping text panels, revealed by scroll progress.
 * Right column: 3D layered glassmorphism cube with large "Z".
 *
 * Panels:
 *   01 — Practice  → "A studio built around frontier engineering."
 *   02 — Method    → "Research, then artifact."
 *   03 — Belief    → "Software should feel inevitable."
 */

const panels = [
  {
    label: '01 — Practice',
    title: 'A studio built around frontier engineering.',
    body: 'We work in small, senior teams across AI, security, and systems design. No middle layers, no slide-decks. Just the people who ship.',
  },
  {
    label: '02 — Method',
    title: 'Research, then artifact.',
    body: 'Every engagement begins with a working prototype within two weeks. Reality is the only design review that matters.',
  },
  {
    label: '03 — Belief',
    title: 'Software should feel inevitable.',
    body: 'We obsess over the seams. Latency, motion, error states, the moment a model recovers. The boring parts are the brand.',
  },
];

export default function Studio() {
  const sectionRef = useRef(null);
  const panelRefs = useRef([]);
  const cubeRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      /* ── Pin the section ── */
      const pinTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=250%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      /* Show panel 0 immediately, fade out at 33% */
      pinTl.to(panelRefs.current[0], {
        opacity: 0,
        y: -60,
        duration: 0.4,
        ease: 'power2.in',
      }, 0.3);

      /* Panel 1: in at 33%, out at 66% */
      pinTl.fromTo(
        panelRefs.current[1],
        { opacity: 0, y: 60, visibility: 'visible' },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
        0.3
      );
      pinTl.to(panelRefs.current[1], {
        opacity: 0,
        y: -60,
        duration: 0.4,
        ease: 'power2.in',
      }, 0.65);

      /* Panel 2: in at 66% */
      pinTl.fromTo(
        panelRefs.current[2],
        { opacity: 0, y: 60, visibility: 'visible' },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
        0.65
      );

      /* Cube 3D mouse tracking (lightweight) */
      if (cubeRef.current) {
        const handleMove = (e) => {
          const rx = ((e.clientY / window.innerHeight) - 0.5) * 20;
          const ry = ((e.clientX / window.innerWidth) - 0.5) * -20;
          gsap.to(cubeRef.current, {
            rotateX: rx,
            rotateY: ry,
            duration: 1.2,
            ease: 'power3.out',
          });
        };
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="studio"
      ref={sectionRef}
      className="relative min-h-screen w-full bg-[#050505] overflow-hidden"
    >
      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto max-w-[1400px] w-full px-6 md:px-10 grid md:grid-cols-12 gap-12 items-center">
          {/* Left: Text Panels */}
          <div className="md:col-span-6 relative h-[60vh] md:h-[70vh]">
            <div className="text-xs uppercase tracking-[0.3em] text-white/40 absolute -top-2 left-0">
              The Studio
            </div>

            <div className="relative h-full">
              {panels.map((panel, i) => (
                <div
                  key={i}
                  ref={(el) => (panelRefs.current[i] = el)}
                  className="absolute inset-0 flex flex-col justify-center"
                  style={{
                    opacity: i === 0 ? 1 : 0,
                    visibility: i === 0 ? 'inherit' : 'hidden',
                    transform: i === 0 ? 'translate(0,0)' : 'translate(0,60px)',
                  }}
                >
                  <div className="text-xs tracking-[0.2em] uppercase text-white/40 mb-6">
                    {panel.label}
                  </div>
                  <h2 className="display text-5xl md:text-7xl text-balance">
                    {panel.title}
                  </h2>
                  <p className="mt-6 text-white/60 text-lg max-w-lg leading-relaxed">
                    {panel.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: 3D Glassmorphism Cube */}
          <div
            className="md:col-span-6 flex items-center justify-center"
            style={{ perspective: '1400px' }}
          >
            <div
              ref={cubeRef}
              className="relative w-[78vmin] h-[60vmin] md:w-[44vmin] md:h-[44vmin] studio-cube"
            >
              {/* Layered glass planes — translateZ */}
              {[
                { z: -60, bg: 'rgba(255,255,255,0.02)' },
                { z: -20, bg: 'rgba(255,255,255,0.035)' },
                { z: 20,  bg: 'rgba(255,255,255,0.05)' },
                { z: 60,  bg: 'rgba(255,255,255,0.065)' },
              ].map(({ z, bg }, i) => (
                <div
                  key={i}
                  className="absolute inset-0 border border-white/15 glass"
                  style={{ transform: `translateZ(${z}px)`, background: bg }}
                />
              ))}

              {/* Central Z letter */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="display text-[18vmin] md:text-[12vmin] text-white/90 leading-none">
                  Z
                </div>
              </div>

              {/* Corner markers */}
              {[
                'top-0 left-0 -translate-x-1/2 -translate-y-1/2 border-l border-t',
                'top-0 right-0 translate-x-1/2 -translate-y-1/2 border-l border-t',
                'bottom-0 left-0 -translate-x-1/2 translate-y-1/2 border-l border-t',
                'bottom-0 right-0 translate-x-1/2 translate-y-1/2 border-l border-t',
              ].map((cls, i) => (
                <div key={i} className={`absolute w-3 h-3 ${cls}`}>
                  <div className="absolute inset-0 border-white" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
