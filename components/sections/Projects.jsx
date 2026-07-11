'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ── Noise texture SVG for card grain overlay ── */
const NOISE_BG = `url("data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`;

/* ── Project Data ── */
const projects = [
  {
    id: '01',
    tag: 'Security · AI',
    title: 'DEVSEC',
    description: 'AI-augmented secure development platform. Real-time code intelligence, threat modeling and policy enforcement woven into the IDE.',
    span: 'col-span-12 lg:col-span-7 row-span-2 min-h-[420px] lg:min-h-[560px]',
    illustration: (
      <svg viewBox="0 0 600 400" className="absolute inset-0 w-full h-full">
        <defs>
          <pattern id="g1" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="600" height="400" fill="url(#g1)" />
        <g stroke="white" strokeWidth="1" fill="none" opacity="0.75">
          <circle cx="300" cy="200" r="140" />
          <circle cx="300" cy="200" r="100" />
          <circle cx="300" cy="200" r="60" />
          <path d="M160 200 H 440 M 300 60 V 340" />
        </g>
        <g fill="white">
          <circle cx="300" cy="200" r="3" />
          <circle cx="440" cy="200" r="2" />
          <circle cx="160" cy="200" r="2" />
        </g>
      </svg>
    ),
  },
  {
    id: '02',
    tag: 'Compression · R&D',
    title: 'ZIP',
    description: 'Next-gen neural compression pipeline. 40% smaller payloads, lossless, hardware-accelerated.',
    span: 'col-span-12 lg:col-span-5 min-h-[320px] lg:min-h-[380px]',
    illustration: (
      <svg viewBox="0 0 600 400" className="absolute inset-0 w-full h-full">
        <g stroke="white" strokeWidth="1" fill="none" opacity="0.6">
          {Array.from({ length: 24 }, (_, i) => {
            const x = 40 + i * 22;
            const h = 120 + Math.sin((i / 23) * Math.PI) * 160;
            const y = (400 - h) / 2;
            return <rect key={i} x={x} y={y} width="10" height={h} />;
          })}
        </g>
      </svg>
    ),
  },
  {
    id: '03',
    tag: 'Agentic · OS',
    title: 'JARVIS',
    description: 'A personal computing layer that operates your tools. Memory, reasoning, and action — unified.',
    span: 'col-span-12 lg:col-span-6 min-h-[360px]',
    illustration: (
      <svg viewBox="0 0 1000 400" className="absolute inset-0 w-full h-full">
        <g stroke="white" strokeWidth="1" fill="none" opacity="0.6">
          {Array.from({ length: 14 }, (_, i) => {
            const cx = 100 + i * 60;
            const r = 20 + i * 4;
            return <circle key={i} cx={cx} cy="200" r={r} />;
          })}
          <path d="M 100 200 H 900" />
        </g>
        <g fill="white">
          {Array.from({ length: 14 }, (_, i) => (
            <circle key={i} cx={100 + i * 60} cy="200" r="2" />
          ))}
        </g>
      </svg>
    ),
  },
  {
    id: '04',
    tag: 'Retrieval · Education',
    title: 'College RAG Intelligence',
    description: 'A retrieval system purpose-built for academia. Multi-modal indexing across lectures, papers and labs.',
    span: 'col-span-12 lg:col-span-6 min-h-[320px] lg:min-h-[380px]',
    illustration: (
      <svg viewBox="0 0 600 400" className="absolute inset-0 w-full h-full">
        <g stroke="white" strokeWidth="1" fill="none" opacity="0.55">
          {[60, 100, 140, 180, 220, 260, 300].map((y, i) => (
            <g key={i}>
              <line x1="80" y1={y} x2="520" y2={y} />
              <line x1={80 + i * 30} y1="60" x2={80 + i * 30} y2="340" />
            </g>
          ))}
        </g>
      </svg>
    ),
  },
  {
    id: '05',
    tag: 'Crypto · Acoustic',
    title: 'Secure Audio Data Transfer',
    description: 'Encrypted, air-gapped data transfer via acoustic modulation. Verified at 28 kbps over ultrasonic carriers.',
    span: 'col-span-12 lg:col-span-5 min-h-[320px] lg:min-h-[380px]',
    illustration: (
      <svg viewBox="0 0 600 400" className="absolute inset-0 w-full h-full">
        <g stroke="white" strokeWidth="1" fill="none" opacity="0.7">
          <path d={`M 0 200 ${Array.from({ length: 60 }, (_, i) => {
            const x = i * 10;
            const y = 200 + Math.sin(i * 0.5) * 60 + Math.sin(i * 1.3) * 30;
            return `L ${x} ${y}`;
          }).join(' ')}`} />
          <path d={`M 0 220 ${Array.from({ length: 60 }, (_, i) => {
            const x = i * 10;
            const y = 220 + Math.sin(i * 0.4 + 1) * 50 + Math.cos(i * 0.8) * 25;
            return `L ${x} ${y}`;
          }).join(' ')}`} opacity="0.4" />
        </g>
      </svg>
    ),
  },
];

/* ── Premium 3D tilt effect on card hover ── */
function useTiltEffect(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rx = ((y / rect.height) - 0.5) * -8;
      const ry = ((x / rect.width) - 0.5) * 10;
      el.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.01, 1.01, 1.01)`;
    };

    const handleLeave = () => {
      el.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    };

    const handleEnter = () => {
      el.style.transition = 'transform 0.1s cubic-bezier(0.16, 1, 0.3, 1)';
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    el.addEventListener('mouseenter', handleEnter);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
      el.removeEventListener('mouseenter', handleEnter);
    };
  }, [ref]);
}

/* ── Scroll-triggered reveal animation per card ── */
function useScrollReveal(ref, index, delay = 0) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { opacity: 0, y: 60, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          delay: delay + index * 0.08,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [ref, index, delay]);
}

/* ── Individual card component with cinematic animations ── */
function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const innerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  useTiltEffect(innerRef);
  useScrollReveal(cardRef, index, 0.1);

  return (
    <div
      ref={cardRef}
      className={`group relative ${project.span} border border-white/10 bg-[#0a0a0a] overflow-hidden cursor-pointer project-card`}
    >
      {/* 3D tilt inner with illustration */}
      <div
        ref={innerRef}
        className="absolute inset-0 transition-transform duration-500 ease-out will-change-transform"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {project.illustration}
      </div>

      {/* Multi-layer gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 group-hover:opacity-80" />

      {/* Subtle vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none transition-opacity duration-500 group-hover:opacity-[0.06]"
        style={{ backgroundImage: NOISE_BG }}
      />

      {/* Card content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="text-sm md:text-base tracking-[0.15em] text-white/70 uppercase font-medium">
            {project.tag}
          </div>
          <div className="text-xs tracking-[0.2em] text-white/40 font-medium">
            {project.id}
          </div>
        </div>

        <div className="overflow-hidden">
          <h3 className="display text-4xl md:text-6xl leading-[0.95] tracking-tight">
            {project.title}
          </h3>
          <p className="mt-4 text-base md:text-lg text-white/50 max-w-xl leading-relaxed tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            {project.description}
          </p>
        </div>
      </div>

      {/* Corner accent lines - subtle premium detail */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/20" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/20" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/20" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/20" />
      </div>
    </div>
  );
}

export default function Projects() {
  const sectionRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  /* Master scroll-triggered entrance with staggered cascade */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.set('.project-card', { opacity: 0, y: 80, scale: 0.95 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.to('.project-card', {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.4,
        stagger: 0.06,
        ease: 'expo.out',
        clearProps: 'all',
      });
    }, section);

    setIsLoaded(true);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative w-full bg-[#050505] py-32 md:py-40 overflow-hidden"
    >
      {/* Ambient glow backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(255,255,255,0.02)_0%,transparent_70%)] pointer-events-none" aria-hidden="true" />

      <div className="mx-auto max-w-[1400px] px-6 md:px-10 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-20 gap-8">
          <div>
            <h2 className="display text-5xl md:text-7xl leading-[0.9] tracking-tight">
              Products.
            </h2>
          </div>
        </div>

        {/* Bento Grid - CSS Grid with dense packing for tight, gap-free layout */}
        <div className="grid grid-cols-12 gap-4 md:gap-6 auto-rows-min grid-flow-dense">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}