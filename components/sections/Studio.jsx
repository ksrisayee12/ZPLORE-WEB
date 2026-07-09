'use client'
import { useEffect, useRef } from 'react'

const STATEMENTS = [
  { kicker: '01 — Practice', title: 'A studio built around frontier engineering.', body: 'We work in small, senior teams across AI, security, and systems design. No middle layers, no slide-decks. Just the people who ship.' },
  { kicker: '02 — Method', title: 'Research, then artifact.', body: 'Every engagement begins with a working prototype within two weeks. Reality is the only design review that matters.' },
  { kicker: '03 — Belief', title: 'Software should feel inevitable.', body: 'We obsess over the seams. Latency, motion, error states, the moment a model recovers. The boring parts are the brand.' },
]

export default function Studio() {
  const ref = useRef(null)
  const visualRef = useRef(null)
  const stepsRef = useRef([])

  useEffect(() => {
    let cleanup
    ; (async () => {
      const { default: gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const ctx = gsap.context(() => {
        const total = STATEMENTS.length
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ref.current,
            start: 'top top',
            end: '+=' + (total * 100) + '%',
            scrub: 0.6,
            pin: true,
          },
        })

        stepsRef.current.forEach((step, i) => {
          if (!step) return
          gsap.set(step, { autoAlpha: i === 0 ? 1 : 0, y: i === 0 ? 0 : 60 })
        })

        STATEMENTS.forEach((_, i) => {
          if (i === 0) return
          tl.to(stepsRef.current[i - 1], { autoAlpha: 0, y: -60, duration: 0.5 }, i - 0.5)
            .fromTo(stepsRef.current[i], { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.5 }, i - 0.5)
          tl.to(visualRef.current, { rotateY: i * 90, rotateX: i * 20, scale: 1 + i * 0.05, duration: 1 }, i - 1)
        })
      }, ref)
      cleanup = () => ctx.revert()
    })()
    return () => cleanup && cleanup()
  }, [])

  return (
    <section id="studio" ref={ref} className="relative min-h-screen w-full bg-[#050505] overflow-hidden">
      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto max-w-[1400px] w-full px-6 md:px-10 grid md:grid-cols-12 gap-12 items-center">
          {/* Left: text steps */}
          <div className="md:col-span-6 relative h-[60vh] md:h-[70vh]">
            <div className="text-xs uppercase tracking-[0.3em] text-white/40 absolute -top-2 left-0">The Studio</div>
            <div className="relative h-full">
              {STATEMENTS.map((s, i) => (
                <div key={i} ref={el => (stepsRef.current[i] = el)} className="absolute inset-0 flex flex-col justify-center">
                  <div className="text-xs tracking-[0.2em] uppercase text-white/40 mb-6">{s.kicker}</div>
                  <h2 className="display text-5xl md:text-7xl text-balance">{s.title}</h2>
                  <p className="mt-6 text-white/60 text-lg max-w-lg leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Right: visual */}
          <div className="md:col-span-6 flex items-center justify-center" style={{ perspective: '1400px' }}>
            <div ref={visualRef} className="relative w-[78vmin] h-[60vmin] md:w-[44vmin] md:h-[44vmin]" style={{ transformStyle: 'preserve-3d' }}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="absolute inset-0 border border-white/15 glass"
                  style={{ transform: `translateZ(${(i - 1.5) * 40}px)`, background: `rgba(255,255,255,${0.02 + i * 0.015})` }}
                />
              ))}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="display text-[18vmin] md:text-[12vmin] text-white/90 leading-none">Z</div>
              </div>
              {/* corner ticks */}
              {[['top-0 left-0', '-translate-x-1/2 -translate-y-1/2'], ['top-0 right-0', 'translate-x-1/2 -translate-y-1/2'], ['bottom-0 left-0', '-translate-x-1/2 translate-y-1/2'], ['bottom-0 right-0', 'translate-x-1/2 translate-y-1/2']].map(([pos, t], i) => (
                <div key={i} className={`absolute ${pos} w-3 h-3 ${t}`}>
                  <div className="absolute inset-0 border-l border-t border-white" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}