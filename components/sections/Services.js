'use client'
import { useEffect, useRef } from 'react'

const STEPS = [
  { n: '01', title: 'Discovery', body: 'Two-week sprint. Stakeholder interviews, technical audit, opportunity map, and a working proof-of-concept.' },
  { n: '02', title: 'Architecture', body: 'System design, model selection, infra plan, threat model. Documented, decisioned, dated.' },
  { n: '03', title: 'Build', body: 'Senior engineers shipping in your repo, your cadence, your standards. Weekly demos, never decks.' },
  { n: '04', title: 'Ship', body: 'Hardening, instrumentation, rollout. We sit with on-call rotations through the first incident.' },
  { n: '05', title: 'Compound', body: 'Quarterly evolution. New capabilities, model refreshes, scale gates. The system gets sharper with age.' },
]

export default function Services() {
  const wrap = useRef(null)
  const track = useRef(null)
  const pathRef = useRef(null)

  useEffect(() => {
    let cleanup
    ; (async () => {
      const { default: gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      const ctx = gsap.context(() => {
        const distance = () => track.current.scrollWidth - window.innerWidth + 80
        const tween = gsap.to(track.current, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: wrap.current,
            start: 'top top',
            end: () => '+=' + distance(),
            scrub: 0.8,
            pin: true,
            invalidateOnRefresh: true,
          },
        })
        // animate path
        if (pathRef.current) {
          const len = pathRef.current.getTotalLength()
          gsap.set(pathRef.current, { strokeDasharray: len, strokeDashoffset: len })
          gsap.to(pathRef.current, {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: wrap.current,
              start: 'top top',
              end: () => '+=' + distance(),
              scrub: 0.8,
            }
          })
        }
        // active step (closest to center)
        const nodes = gsap.utils.toArray('.svc-node')
        ScrollTrigger.create({
          trigger: wrap.current,
          start: 'top top',
          end: () => '+=' + distance(),
          scrub: true,
          onUpdate: (st) => {
            const p = st.progress
            nodes.forEach((n, i) => {
              const center = i / (nodes.length - 1)
              const dist = Math.abs(p - center)
              const active = dist < 0.12
              n.style.opacity = active ? '1' : Math.max(0.25, 1 - dist * 2.2).toFixed(2)
              n.style.transform = `scale(${active ? 1 : 0.92}) translateY(${active ? 0 : 6}px)`
              n.style.filter = active ? 'blur(0)' : `blur(${Math.min(4, dist * 6)}px)`
            })
          }
        })
      }, wrap)
      cleanup = () => ctx.revert()
    })()
    return () => cleanup && cleanup()
  }, [])

  return (
    <section id="services" ref={wrap} className="relative w-full bg-[#050505] overflow-hidden h-screen">
      <div className="absolute top-10 left-0 right-0 z-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 flex items-end justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-white/40 mb-3">How we work — 006</div>
            <h2 className="display text-5xl md:text-7xl">Services.</h2>
          </div>
          <div className="hidden md:block text-sm text-white/50 max-w-xs text-right">Scroll →</div>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center">
        <div ref={track} className="flex items-center gap-[8vw] pl-[10vw] pr-[10vw]" style={{ willChange: 'transform' }}>
          {/* SVG connecting line that runs along the row */}
          <svg className="absolute top-1/2 -translate-y-1/2 left-0 h-40 pointer-events-none" width="4400" height="160" viewBox="0 0 4400 160" preserveAspectRatio="none">
            <path ref={pathRef} d="M 0 80 Q 400 0 800 80 T 1600 80 T 2400 80 T 3200 80 T 4000 80 L 4400 80" stroke="white" strokeWidth="1" fill="none" opacity="0.6" />
          </svg>
          {STEPS.map((s, i) => (
            <div key={s.n} className="svc-node relative shrink-0 w-[78vw] md:w-[36vw] transition-all duration-300 will-change-transform">
              <div className="border border-white/10 bg-[#0a0a0a] p-8 md:p-10 relative">
                <div className="flex items-center justify-between">
                  <div className="text-xs uppercase tracking-[0.3em] text-white/40">Step</div>
                  <div className="display text-6xl text-white/20">{s.n}</div>
                </div>
                <h3 className="display text-4xl md:text-5xl mt-8">{s.title}</h3>
                <p className="mt-4 text-white/60 text-base leading-relaxed max-w-md">{s.body}</p>
                <div className="mt-10 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/40">
                  <span className="w-8 h-px bg-white/40" /> phase {s.n}
                </div>
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}