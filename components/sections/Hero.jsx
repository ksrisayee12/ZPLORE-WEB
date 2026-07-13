'use client'
import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
  loading: () => null,
})

export default function Hero() {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const subRef = useRef(null)
  const ctaRef = useRef(null)
  const scrollProgress = useRef(0)
  const mouseWorld = useRef({ x: 0, y: 0 })

  // Track scroll progress for Three.js dissolution
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const onScroll = () => {
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight
      // Progress from 0 (hero fully visible) to 1 (hero scrolled away)
      if (rect.top >= 0) {
        scrollProgress.current = 0
      } else {
        scrollProgress.current = Math.min(1, Math.abs(rect.top) / (vh * 0.8))
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Track mouse position in normalized space
  useEffect(() => {
    const onMove = (e) => {
      // Convert to -1..1 range, then scale to approximate world coordinates
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = -((e.clientY / window.innerHeight) * 2 - 1)
      mouseWorld.current = {
        x: nx * 6,
        y: ny * 4.5,
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // GSAP entrance animation for HTML overlay
  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { default: gsap } = await import('gsap')
      if (!mounted) return

      // Wait for Z formation to complete before showing text
      const delay = 9.5

      // Heading chars
      const chars = headingRef.current?.querySelectorAll('.char') || []
      gsap.set(chars, { y: '120%', opacity: 0 })
      gsap.to(chars, {
        y: '0%',
        opacity: 1,
        stagger: 0.015,
        duration: 1.4,
        ease: 'expo.out',
        delay,
      })

      // Subtitle staggered word reveal + blur-to-sharp transition (Apple/Linear style)
      const subWords = subRef.current?.querySelectorAll('.word') || []
      gsap.set(subWords, { y: 22, opacity: 0, filter: 'blur(8px)' })
      gsap.to(subWords, {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        stagger: 0.02,
        duration: 1.2,
        delay: delay + 0.5,
        ease: 'power3.out',
      })

      // CTA
      gsap.fromTo(
        ctaRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: delay + 1.1, ease: 'expo.out' }
      )
    })()
    return () => { mounted = false }
  }, [])

  const headlineLines = [
    'Building the Layer Beneath Innovation,',
    'Engineering the Next Layer of Intelligence.',
  ]

  const subParagraphText =
    'Zplore designs and builds the intelligent systems modern organizations run on—from AI products to enterprise security—while growing a community of the people who build them.'

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: '100svh' }}
    >
      {/* Three.js Canvas — fills entire viewport */}
      <div className="absolute inset-0">
        <HeroScene scrollProgress={scrollProgress} mouseWorld={mouseWorld} />
      </div>

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(to bottom, transparent 0%, transparent 60%, rgba(0,0,0,0.6) 85%, rgba(0,0,0,0.95) 100%)',
      }} />

      {/* HTML overlay — appears after Z formation */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pb-16 md:pb-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <h1
            ref={headingRef}
            className="font-clash-display text-[6.2vw] md:text-[3.5vw] leading-[1.08] tracking-tight text-white"
          >
            {headlineLines.map((line, i) => (
              <div key={i} className="overflow-hidden py-2 -my-2">
                {line.split('').map((c, j) => (
                  <span
                    key={j}
                    className="char inline-block"
                    style={{ whiteSpace: c === ' ' ? 'pre' : 'normal' }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            ))}
          </h1>

          <p
            ref={subRef}
            className="mt-5 font-general-sans text-white/60 text-base md:text-lg max-w-[800px] leading-relaxed flex flex-wrap"
          >
            {subParagraphText.split(' ').map((word, idx) => (
              <span
                key={idx}
                className="word inline-block mr-[0.28em] py-0.5"
                style={{ opacity: 0 }}
              >
                {word}
              </span>
            ))}
          </p>

          <div ref={ctaRef} className="mt-8 flex items-center gap-6" style={{ opacity: 0 }}>
            <a
              href="#studio"
              className="group inline-flex items-center text-sm border border-white/20 hover:border-white/60 px-7 py-3 rounded-full transition-all duration-500 text-white font-excon tracking-wide"
            >
              <span>Explore</span>
              <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <div className="w-[1px] h-8 bg-gradient-to-b from-transparent to-white/20 animate-pulse" />
      </div>
    </section>
  )
}