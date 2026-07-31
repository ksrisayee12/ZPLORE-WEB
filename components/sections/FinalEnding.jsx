'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sentences = [
  'Ideas start here.',
  'Code gives them form.',
  'Intelligence gives them purpose.',
  'Zplore gives them scale.',
]

export default function FinalEnding() {
  const sectionRef = useRef(null)
  const linesRef = useRef([])
  const logoRef = useRef(null)
  const zSvgRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Sentence lines: horizontal wipe from left (clip-path reveal) ─────────
      linesRef.current.forEach((el, i) => {
        if (!el) return
        // Start clipped (hidden on right side of clip)
        gsap.set(el, {
          clipPath: 'inset(0 100% 0 0)',
          x: -18,
        })

        gsap.to(el, {
          clipPath: 'inset(0 0% 0 0)',
          x: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
          delay: i * 0.08,
        })
      })

      // ── Logo: draw SVG strokes, no scale/blur pop-in ─────────────────────────
      if (zSvgRef.current) {
        const paths = zSvgRef.current.querySelectorAll('.z-stroke-path')
        const circlePath = zSvgRef.current.querySelector('.z-circle-path')

        paths.forEach((path) => {
          const len = path.getTotalLength()
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
        })
        if (circlePath) {
          const len = circlePath.getTotalLength()
          gsap.set(circlePath, { strokeDasharray: len, strokeDashoffset: len })
        }

        gsap.set(logoRef.current, { opacity: 1 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: logoRef.current,
            start: 'top 78%',
            toggleActions: 'play none none none',
          },
        })

        if (circlePath) {
          tl.to(circlePath, {
            strokeDashoffset: 0,
            duration: 1.1,
            ease: 'power2.inOut',
          }, 0)
        }

        paths.forEach((path, i) => {
          tl.to(path, {
            strokeDashoffset: 0,
            duration: 0.55,
            ease: 'power2.inOut',
          }, 0.3 + i * 0.18)
        })
      }

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="final-ending"
      className="relative w-full bg-[#000000] text-white overflow-hidden select-none"
      style={{ paddingTop: '10vh', paddingBottom: '12vh' }}
    >
      {/* Subtle grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015] z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="fe-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#fe-grid)" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto w-full" style={{ maxWidth: '1100px', padding: '0 clamp(24px, 5vw, 80px)' }}>

        {/* ── Sentences ─────────────────────────────────────────────────────── */}
        <div className="mb-20 md:mb-28">
          {sentences.map((text, i) => (
            <div
              key={i}
              ref={el => { linesRef.current[i] = el }}
              style={{
                fontFamily: "'ClashDisplay', 'Inter', sans-serif",
                fontWeight: 600,
                fontSize: 'clamp(22px, 3.8vw, 64px)',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                color: i === sentences.length - 1 ? '#ffffff' : 'rgba(255,255,255,0.55)',
                marginBottom: i < sentences.length - 1 ? 'clamp(8px, 1.5vw, 20px)' : 0,
                willChange: 'clip-path, transform',
              }}
            >
              {text}
            </div>
          ))}
        </div>

        {/* ── Z Logo (SVG stroke draw) ──────────────────────────────────────── */}
        <div
          ref={logoRef}
          className="flex flex-col items-start"
          style={{ opacity: 1 }}
        >
          <svg
            ref={zSvgRef}
            viewBox="0 0 200 200"
            fill="none"
            style={{ width: 'clamp(64px, 8vw, 110px)', height: 'clamp(64px, 8vw, 110px)' }}
          >
            <circle
              className="z-circle-path"
              cx="100" cy="100" r="92"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="1"
            />
            <path
              className="z-stroke-path"
              d="M 58 60 L 142 60"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              className="z-stroke-path"
              d="M 142 60 L 58 140"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              className="z-stroke-path"
              d="M 58 140 L 142 140"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          <p
            className="font-general-sans uppercase tracking-[0.35em] text-white/25 mt-4"
            style={{ fontSize: 'clamp(9px, 0.75vw, 12px)' }}
          >
            Deep-Tech Studio
          </p>
        </div>

      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  )
}