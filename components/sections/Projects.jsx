'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ── Noise texture SVG for card grain overlay ── */
const NOISE_BG = `url("data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`;

/* ── Project Data (exact from reference) ── */
const projects = [
  {
    id: '01',
    tag: 'Security · AI',
    title: 'DEVSEC',
    description:
      'AI-augmented secure development platform. Real-time code intelligence, threat modeling and policy enforcement woven into the IDE.',
    span: 'col-span-12 md:col-span-7 row-span-2 min-h-[420px] md:min-h-[560px]',
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
    description:
      'Next-gen neural compression pipeline. 40% smaller payloads, lossless, hardware-accelerated.',
    span: 'col-span-12 md:col-span-5 min-h-[320px] md:min-h-[380px]',
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
    description:
      'A personal computing layer that operates your tools. Memory, reasoning, and action — unified.',
    span: 'col-span-12 min-h-[360px]',
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
    description:
      'A retrieval system purpose-built for academia. Multi-modal indexing across lectures, papers and labs.',
    span: 'col-span-12 md:col-span-5 min-h-[320px] md:min-h-[380px]',
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
    description:
      'Encrypted, air-gapped data transfer via acoustic modulation. Verified at 28 kbps over ultrasonic carriers.',
    span: 'col-span-12 md:col-span-5 min-h-[320px] md:min-h-[380px]',
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

/* ── Tilt effect on card hover ── */
function useTiltEffect(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rx = ((y / rect.height) - 0.5) * -6;
      const ry = ((x / rect.width) - 0.5) * 8;
      el.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    };

    const handleLeave = () => {
      el.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [ref]);
}

/* ── Individual card component ── */
function ProjectCard({ project }) {
  const innerRef = useRef(null);
  useTiltEffect(innerRef);

  return (
    <div
      className={`group relative ${project.span} border border-white/10 bg-[#0a0a0a] overflow-hidden cursor-pointer project-card`}
    >
      {/* 3D tilt inner */}
      <div
        ref={innerRef}
        className="absolute inset-0 transition-transform duration-300 ease-out"
      >
        {project.illustration}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: NOISE_BG }}
      />

      {/* Card content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-8">
        <div className="flex items-start justify-between">
          <div className="text-[10px] uppercase tracking-[0.3em] text-white/50">
            {project.tag}
          </div>
          <div className="text-[10px] tracking-[0.2em] text-white/40">
            {project.id}
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
            <h3 className="display text-3xl md:text-5xl">{project.title}</h3>
            <p className="mt-3 text-white/60 text-sm md:text-base max-w-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {project.description}
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span>Read case</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const sectionRef = useRef(null);

  /* Scroll-triggered entrance animations */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.project-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
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
      id="projects"
      ref={sectionRef}
      className="relative w-full bg-[#050505] py-32 md:py-40"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-16">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4">
              Selected Work — 005
            </div>
            <h2 className="display text-5xl md:text-7xl">Projects.</h2>
          </div>
          <div className="hidden md:block text-sm text-white/50 max-w-xs text-right">
            A non-exhaustive sample. Active engagements are not listed.
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-12 gap-4 md:gap-6 auto-rows-[minmax(0,1fr)]">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
