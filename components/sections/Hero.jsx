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
 */
export default function Hero() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

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
        {/* H1 — 3 lines, each in overflow-hidden container */}
        <h1
          ref={titleRef}
          className="font-nohemi text-[14vw] md:text-[8.5vw] leading-[0.95] tracking-tight"
        >
          {/* Line 1 */}
          <div className="overflow-hidden py-3 -my-3">
            <div className="line-inner inline-block">Engineering</div>
          </div>

          {/* Line 2 */}
          <div className="overflow-hidden py-3 -my-3">
            <div className="line-inner inline-block">the next decade</div>
          </div>

          {/* Line 3 */}
          <div className="overflow-hidden py-3 -my-3">
            <div className="line-inner inline-block">of intelligence.</div>
          </div>
        </h1>

        {/* Subtitle + CTAs */}
        <div
          ref={subtitleRef}
          className="mt-10 grid md:grid-cols-12 gap-6 items-end"
          style={{ opacity: 0 }}
        >
          <p className="md:col-span-6 text-white/60 text-lg md:text-xl leading-relaxed max-w-xl">
            We design and ship deep-tech systems - frontier AI, secure
            infrastructure, and intelligent products - for the companies defining
            what comes next.
          </p>

          <div className="md:col-span-5 md:col-start-8 flex items-center gap-6">
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group inline-flex items-center text-sm border border-white/20 hover:border-white px-7 py-3 rounded-full transition-colors text-white font-black-ops tracking-wider"
            >
              <span>View work</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}