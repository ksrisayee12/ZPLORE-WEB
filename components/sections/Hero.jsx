'use client'
import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), { ssr: false, loading: () => null })

export default function Hero() {
  const headingRef = useRef(null)
  const subRef = useRef(null)

  useEffect(() => {
    let mounted = true
    ; (async () => {
      const { default: gsap } = await import('gsap')
      if (!mounted) return
      const chars = headingRef.current?.querySelectorAll('.char') || []
      gsap.set(chars, { y: '110%', opacity: 0 })
      gsap.to(chars, { y: '0%', opacity: 1, stagger: 0.018, duration: 1.1, ease: 'expo.out', delay: 0.25 })
      gsap.fromTo(subRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 1.0, ease: 'expo.out' })
    })()
    return () => { mounted = false }
  }, [])

  const headline = ['Engineering', 'the next decade', 'of intelligence.']

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <HeroScene />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10 pt-[28vh] md:pt-[26vh]">
        <div className="flex items-center gap-3 mb-8 text-xs uppercase tracking-[0.3em] text-white/50">
          <span className="w-8 h-px bg-white/40" /> Zplore · Studio 002
        </div>
        <h1 ref={headingRef} className="display text-[14vw] md:text-[8.5vw] leading-[0.9]">
          {headline.map((line, i) => (
            <div key={i} className="overflow-hidden">
              <div className="inline-block">
                {line.split('').map((c, j) => (
                  <span key={j} className="char inline-block" style={{ whiteSpace: c === ' ' ? 'pre' : 'normal' }}>{c}</span>
                ))}
              </div>
            </div>
          ))}
        </h1>
        <div ref={subRef} className="mt-10 grid md:grid-cols-12 gap-6 items-end">
          <p className="md:col-span-5 text-white/60 text-base md:text-lg max-w-md">
            We design and ship deep-tech systems — frontier AI, secure infrastructure, and intelligent products — for the companies defining what comes next.
          </p>
          <div className="md:col-span-5 md:col-start-8 flex items-center gap-6">
            <a href="#projects" className="group inline-flex items-center gap-3 text-sm border border-white/20 hover:border-white px-5 py-3 transition-colors">
              <span>View work</span><span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a href="#contact" className="text-sm underline-draw text-white/80">Start a project</a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 z-10 mx-auto max-w-[1400px] px-6 md:px-10 flex items-end justify-between text-[10px] uppercase tracking-[0.3em] text-white/40">
        <div>Scroll ↓</div>
        <div className="hidden md:block">N 12.97° · E 77.59° / Bengaluru</div>
        <div>v2026.06</div>
      </div>
    </section>
  )
}