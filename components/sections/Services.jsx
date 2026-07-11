'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Services Section — GSAP-pinned horizontal scroll carousel.
 *
 * Reference: section#services is h-screen pinned.
 * A flex row of 5 service cards slides left as user scrolls.
 * The currently-focused card is full opacity/scale=1;
 * subsequent cards progressively blur and shrink.
 * An animated SVG sine wave runs behind all cards.
 */

const steps = [
  { num: '01', title: 'Discovery Sprint', body: 'Two-week sprint. Stakeholder interviews, technical audit, opportunity map, and a working proof-of-concept.' },
  { num: '02', title: 'System Architecture', body: 'System design, model selection, infra plan, threat model. Documented, decisioned, dated.' },
  { num: '03', title: 'Embedded Build', body: 'Senior engineers shipping in your repo, your cadence, your standards. Weekly demos, never decks.' },
  { num: '04', title: 'Production Ship', body: 'Hardening, instrumentation, rollout. We sit with on-call rotations through the first incident.' },
  { num: '05', title: 'Compound Evolution', body: 'Quarterly evolution. New capabilities, model refreshes, scale gates. The system gets sharper with age.' },
];

/* Build SVG sine path (matches reference wavy line) */
function buildSinePath(width = 2800, height = 160, cy = 80) {
  const points = [];
  const step = 10;
  for (let x = 0; x <= width; x += step) {
    const y = cy + Math.sin((x / width) * Math.PI * 5) * 40;
    points.push(`${x === 0 ? 'M' : 'L'} ${x} ${y}`);
  }
  return points.join(' ');
}

export default function Services() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const nodeRefs = useRef([]);
  const lineRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      /* ── Total horizontal travel ── */
      const totalWidth = track.scrollWidth - track.clientWidth;

      const pinTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${totalWidth * 0.85}`,
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          onUpdate: (self) => {
            /* Active card based on progress */
            const progress = self.progress;
            const activeIndex = Math.min(
              Math.floor(progress * steps.length),
              steps.length - 1
            );

            nodeRefs.current.forEach((node, i) => {
              if (!node) return;
              const dist = Math.abs(i - activeIndex);
              const opacity = dist === 0 ? 1 : dist === 1 ? 0.45 : 0.25;
              const scale = dist === 0 ? 1 : 0.92;
              const blur = dist === 0 ? 0 : dist === 1 ? 1.5 : dist * 1.5;
              const ty = dist === 0 ? 0 : 6;
              node.style.opacity = opacity;
              node.style.filter = `blur(${blur}px)`;
              node.style.transform = `scale(${scale}) translateY(${ty}px)`;
            });
          },
        },
      });

      /* Scroll the track horizontally */
      pinTl.to(track, {
        x: () => -totalWidth,
        ease: 'none',
      });

      /* Animate the sine-wave line stroke-dashoffset */
      if (lineRef.current) {
        const len = lineRef.current.getTotalLength?.() ?? 4427;
        gsap.set(lineRef.current, {
          strokeDasharray: len,
          strokeDashoffset: len,
        });
        gsap.to(lineRef.current, {
          strokeDashoffset: 0,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative w-full bg-[#050505] overflow-hidden h-screen"
    >
      {/* Section header */}
      <div className="absolute top-10 left-0 right-0 z-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 flex items-end justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-white/40 mb-3">
              How we work
            </div>
            <h2 className="display text-5xl md:text-7xl">Services.</h2>
          </div>
        </div>
      </div>

      {/* Horizontal scroll track */}
      <div className="absolute inset-0 flex items-center overflow-hidden">
        <div
          ref={trackRef}
          className="flex items-center gap-[8vw] pl-[10vw] pr-[10vw] will-change-transform"
          style={{ width: 'max-content' }}
        >
          {/* Animated sine line behind cards */}
          <svg
            className="absolute top-1/2 -translate-y-1/2 left-0 h-40 pointer-events-none"
            width="4400"
            height="160"
            viewBox="0 0 4400 160"
            preserveAspectRatio="none"
          >
            <path
              ref={lineRef}
              d={buildSinePath()}
              stroke="white"
              strokeWidth="1"
              fill="none"
              opacity="0.6"
            />
          </svg>

          {/* Service cards */}
          {steps.map((step, i) => (
            <div
              key={i}
              ref={(el) => (nodeRefs.current[i] = el)}
              className="svc-node relative shrink-0 w-[78vw] md:w-[36vw]"
              style={{
                opacity: i === 0 ? 1 : 0.25,
                transform: i === 0 ? 'scale(1) translateY(0px)' : 'scale(0.92) translateY(6px)',
                filter: i === 0 ? 'blur(0px)' : `blur(${i * 1.5}px)`,
              }}
            >
              <div className="border border-white/10 bg-[#0a0a0a] p-8 md:p-10 relative">
                <div className="flex items-center justify-between">
                  <div className="text-xs uppercase tracking-[0.3em] text-white/40">
                    Step
                  </div>
                  <div className="display text-6xl text-white/20">{step.num}</div>
                </div>

                <h3 className="display text-4xl md:text-5xl mt-8">{step.title}</h3>

                {step.subtitle && (
                  <div className="mt-3 text-white/90 text-lg font-medium font-inter">{step.subtitle}</div>
                )}

                <p className="mt-4 font-inter text-white/60 text-base leading-relaxed max-w-md">
                  {step.body}
                </p>

                {step.buttonText ? (
                  <div className="mt-8">
                    <a
                      href={step.buttonHref}
                      className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 text-sm font-medium hover:bg-white/90 transition-colors"
                    >
                      {step.buttonText} →
                    </a>
                  </div>
                ) : (
                  <div className="mt-10 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/40">
                    phase {step.num}
                  </div>
                )}
              </div>

              {/* Timeline dot */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}