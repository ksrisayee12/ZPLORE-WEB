'use client'

import { useEffect, useRef } from 'react'

const BL = ({ children }) => (
  <span className="serif italic font-normal">{children}</span>
)

const STATEMENTS = [
  {
    num: '01',
    title: 'DISCOVERY',
    subtitle: <>The <BL>right question,</BL> before the right solution</>,
    body: 'Before anything gets designed, it gets questioned — by us, out loud, until nothing about it is assumed.',
  },
  {
    num: '02',
    title: 'ARCHITECTURE',
    subtitle: <>We build the parts <BL>that outlive the pitch.</BL></>,
    body: 'Demos are easy. What holds under real users, real load, real time — that takes discipline most skip. We design for what the product becomes, not what it looks like on day one.',
  },
  {
    num: '03',
    title: 'INTELLIGENCE',
    subtitle: <><BL>Innovation, engineered</BL> to hold.</>,
    body: 'Built to think, built to last. Intelligence that works long after the launch post is forgotten.',
  },
  {
    num: '04',
    title: 'ECOSYSTEM',
    subtitle: <><BL>Students. Researchers. Founders.</BL> One table.</>,
    body: "We're building the room where the next idea happens. The best ideas rarely come from a boardroom.",
  },
  {
    num: '05',
    title: 'START',
    subtitle: <>Bring us the problem. We'll <BL>build.</BL></>,
    body: "We'll bring the prototype. Two weeks, working software, no slideware in between.",
    buttonText: 'Start a project',
    buttonHref: '#contact',
  },
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
          <div className="md:col-span-6 relative h-[65vh] md:h-[75vh] flex flex-col justify-center">
            <div className="mb-6">
              <h2 className="font-clash-display-medium text-6xl md:text-8xl font-medium tracking-tight text-white">What we do</h2>
            </div>
            <div className="relative flex-1">
              {STATEMENTS.map((s, i) => (
                <div key={i} ref={el => (stepsRef.current[i] = el)} className="absolute inset-0 flex flex-col justify-start pt-2">
                  <h3 className="font-supreme text-4xl md:text-6xl font-bold uppercase tracking-wide text-white flex items-center gap-3 md:gap-4">
                    <span>{s.num}</span>
                    <span className="text-white/40 font-normal">-</span>
                    <span>{s.title}</span>
                  </h3>
                  {s.subtitle && (
                    <div className="mt-8 md:mt-10 font-boska text-2xl md:text-4xl text-white leading-tight">{s.subtitle}</div>
                  )}
                  <p className="mt-6 md:mt-8 font-general-sans text-white/60 text-base md:text-lg max-w-lg leading-relaxed">{s.body}</p>
                  {s.buttonText && (
                    <div className="mt-8">
                      <a href={s.buttonHref || '#contact'} className="inline-flex items-center gap-2 bg-white text-black hover:bg-white/90 px-6 py-3 rounded-full text-sm font-medium transition-all font-excon">
                        <span>{s.buttonText}</span>
                      </a>
                    </div>
                  )}
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