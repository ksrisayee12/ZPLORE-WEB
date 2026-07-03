'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * About Section — reconstructed from reference DOM patterns.
 * The about section appears after Enterprise in page.js.
 *
 * Structure (inferred from layout patterns):
 * - Full-width section with large text stat blocks
 * - Team philosophy paragraph
 * - Metrics grid (4 numbers)
 */

const stats = [
  { value: '8+', label: 'Years engineering frontier systems' },
  { value: '40+', label: 'Shipped production systems' },
  { value: '100%', label: 'Senior-only team. No juniors.' },
  { value: '2wk', label: 'First prototype guaranteed' },
];

export default function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about-stat',
        { opacity: 0, y: 40 },
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

      gsap.fromTo(
        '.about-text-block > *',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full bg-[#050505] py-32 md:py-44 overflow-hidden"
    >
      {/* Subtle horizontal rule */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="h-px bg-white/10 mb-16" />

        <div className="grid md:grid-cols-12 gap-12 md:gap-16">
          {/* Left — who we are */}
          <div className="md:col-span-5 about-text-block">
            <div className="text-xs uppercase tracking-[0.3em] text-white/40 mb-6">
              About — 008
            </div>
            <h2 className="display text-5xl md:text-7xl mb-8">
              A small team that ships big things.
            </h2>
            <p className="text-white/60 text-lg leading-relaxed max-w-md mb-6">
              Zplore is a deep-tech engineering studio headquartered in Bengaluru.
              We are not a consultancy. We are builders who sit inside the problem
              until it is solved.
            </p>
            <p className="text-white/40 text-base leading-relaxed max-w-md">
              Every project begins with a two-week discovery sprint and ends only
              when the system is in production and performing as specified. No
              handoffs. No decks. Just working software.
            </p>
          </div>

          {/* Right — stats */}
          <div className="md:col-span-7 grid grid-cols-2 gap-8 md:gap-12 content-start">
            {stats.map((stat, i) => (
              <div key={i} className="about-stat" style={{ opacity: 0 }}>
                <div className="display text-6xl md:text-8xl text-white/90 leading-none mb-3">
                  {stat.value}
                </div>
                <div className="text-sm text-white/40 leading-relaxed">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom divider */}
        <div className="h-px bg-white/10 mt-24" />
      </div>
    </section>
  );
}
