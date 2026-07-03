'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';

const HeroScene = dynamic(() => import('../three/HeroScene'), { ssr: false });

/**
 * Hero Section — exact reconstruction from reference HTML.
 *
 * Structure:
 * - Fullscreen Three.js canvas (absolute, inset-0)
 * - Gradient overlay (black/40 → transparent → black)
 * - H1 with 3 lines, each line wrapped in overflow-hidden for reveal
 * - Subtitle paragraph + CTA buttons
 * - Bottom bar: Scroll ↓ / coordinates / version
 */
export default function Hero() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    // Animate each line wrapper — chars slide up from below
    const lines = titleRef.current?.querySelectorAll('.line-inner');
    if (lines?.length) {
      tl.fromTo(
        lines,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: 'power4.out',
          stagger: 0.12,
        }
      );
    }

    tl.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.5'
    );

    tl.fromTo(
      bottomRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6 },
      '-=0.4'
    );
  }, []);

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden">
      {/* Three.js Canvas */}
      <div className="absolute inset-0">
        <HeroScene />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10 pt-[28vh] md:pt-[26vh]">
        {/* Label */}
        <div className="flex items-center gap-3 mb-8 text-xs uppercase tracking-[0.3em] text-white/50">
          <span className="w-8 h-px bg-white/40" />
          Zplore · Studio 002
        </div>

        {/* H1 — 3 lines, each in overflow-hidden container */}
        <h1
          ref={titleRef}
          className="display text-[14vw] md:text-[8.5vw] leading-[0.9]"
        >
          {/* Line 1 */}
          <div className="overflow-hidden">
            <div className="line-inner inline-block">Engineering</div>
          </div>

          {/* Line 2 */}
          <div className="overflow-hidden">
            <div className="line-inner inline-block">the next decade</div>
          </div>

          {/* Line 3 */}
          <div className="overflow-hidden">
            <div className="line-inner inline-block">of intelligence.</div>
          </div>
        </h1>

        {/* Subtitle + CTAs */}
        <div
          ref={subtitleRef}
          className="mt-10 grid md:grid-cols-12 gap-6 items-end"
          style={{ opacity: 0 }}
        >
          <p className="md:col-span-5 text-white/60 text-base md:text-lg max-w-md">
            We design and ship deep-tech systems — frontier AI, secure
            infrastructure, and intelligent products — for the companies defining
            what comes next.
          </p>

          <div className="md:col-span-5 md:col-start-8 flex items-center gap-6">
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group inline-flex items-center gap-3 text-sm border border-white/20 hover:border-white px-5 py-3 transition-colors text-white"
            >
              <span>View work</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>

            <button
              onClick={() =>
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="text-sm underline-draw text-white/80 hover:text-white transition-colors"
            >
              Start a project
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        ref={bottomRef}
        className="absolute bottom-8 left-0 right-0 z-10 mx-auto max-w-[1400px] px-6 md:px-10 flex items-end justify-between text-[10px] uppercase tracking-[0.3em] text-white/40"
        style={{ opacity: 0 }}
      >
        <div>Scroll ↓</div>
        <div className="hidden md:block">N 12.97° · E 77.59° / Bengaluru</div>
        <div>v2026.06</div>
      </div>
    </section>
  );
}
