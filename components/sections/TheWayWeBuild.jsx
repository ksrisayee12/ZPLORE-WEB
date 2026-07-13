'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const leftLines = [
  'We build in layers —',
  'intelligence first,',
  'interface second,',
  'trust throughout.',
]

export default function TheWayWeBuild() {
  const sectionRef = useRef(null)
  const leftContainerRef = useRef(null)
  const rightContainerRef = useRef(null)
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 })

  // Cursor tracking for soft ambient spotlight
  const handleMouseMove = useCallback((e) => {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (rect) {
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lineElems = leftContainerRef.current?.querySelectorAll('.layer-line') || []
      const rightContent = rightContainerRef.current

      // Set initial state
      gsap.set(lineElems, {
        opacity: 0.18,
        y: 28,
        filter: 'blur(8px)',
      })
      gsap.set(rightContent, {
        opacity: 0,
        y: 50,
        filter: 'blur(10px)',
      })

      // Pinned timeline with scrub for exact physical scroll control
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=160%',
          pin: true,
          pinSpacing: true,
          refreshPriority: 18,
          scrub: 0.8,
          anticipatePin: 1,
        },
      })

      // Reveal left lines sequentially
      lineElems.forEach((elem, idx) => {
        tl.to(
          elem,
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.3,
            ease: 'power2.out',
          },
          idx * 0.22
        )
      })

      // Right column fades up after headline finishes
      tl.to(
        rightContent,
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.45,
          ease: 'power3.out',
        },
        0.65
      )

      // Slight depth shift of the entire left side near the end of pin
      tl.to(
        leftContainerRef.current,
        {
          y: -15,
          opacity: 0.9,
          duration: 0.35,
          ease: 'none',
        },
        1.1
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-screen bg-[#000000] text-white overflow-hidden select-none flex items-center"
    >
      {/* Subtle Animated Engineering Grid (2% opacity) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025] z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="eng-grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
              <circle cx="60" cy="0" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#eng-grid)" />
        </svg>
      </div>

      {/* Mouse Parallax Soft Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-1"
        style={{
          background: `radial-gradient(850px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.04), transparent 65%)`,
        }}
      />

      {/* Main Split-Screen Content */}
      <div className="relative z-10 mx-auto max-w-[1450px] w-full px-6 md:px-12 py-16">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Side (Tightened to 6 cols) */}
          <div
            ref={leftContainerRef}
            className="lg:col-span-6 flex flex-col justify-center space-y-3 md:space-y-4"
          >
            <div className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4 font-excon">
              THE WAY WE BUILD
            </div>
            {leftLines.map((line, i) => (
              <h2
                key={i}
                className="layer-line font-quilon-medium text-4xl md:text-6xl lg:text-[4.6vw] leading-[1.08] tracking-tight text-white block will-change-transform"
              >
                {line}
              </h2>
            ))}
          </div>

          {/* Right Side (Tightened to 6 cols, closer to left) */}
          <div
            ref={rightContainerRef}
            className="lg:col-span-6 flex flex-col justify-center lg:border-l lg:border-white/[0.08] lg:pl-10 pt-8 lg:pt-0"
          >
            <p className="font-zodiac text-2xl md:text-3xl text-white/95 leading-[1.3] mb-8">
              Every system we build carries the same intent — make intelligence useful, make software matter.
            </p>
            <p className="font-zodiac-light text-base md:text-xl text-white/60 leading-relaxed">
              Zplore exists at the intersection of engineering and imagination — building products that solve real problems and a community that keeps solving them.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
