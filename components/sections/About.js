'use client'
import { useEffect, useRef } from 'react'

const BEATS = [
  { stat: '2021', label: 'Founded', text: 'Started as a two-person research collective.' },
  { stat: '14', label: 'Engineers', text: 'Senior-only. No outsourcing, no agencies-of-record.' },
  { stat: '32', label: 'Shipped systems', text: 'From silent acoustic transports to agent operating layers.' },
  { stat: '∞', label: 'Curiosity', text: 'Research is part of payroll. Half-days for unsupervised exploration, every week.' },
]

export default function About() {
  const ref = useRef(null)
  const zRef = useRef(null)
  const textRefs = useRef([])

  useEffect(() => {
    let cleanup
    ; (async () => {
      const { default: gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      const ctx = gsap.context(() => {
        // pin and progress
        const total = BEATS.length
        const st = ScrollTrigger.create({
          trigger: ref.current,
          start: 'top top',
          end: '+=' + (total * 100) + '%',
          pin: true,
          scrub: 0.6,
          onUpdate: (s) => {
            const p = s.progress
            // drive Z geometry build
            const segments = zRef.current.querySelectorAll('path.zseg, line.zseg, polygon.zface')
            segments.forEach((el, i) => {
              const start = i / segments.length
              const end = (i + 1) / segments.length
              const local = gsap.utils.clamp(0, 1, (p - start) / (end - start))
              el.setAttribute('opacity', (local * 0.95).toFixed(3))
              if (el.dataset && el.dataset.length) {
                const L = parseFloat(el.dataset.length)
                el.setAttribute('stroke-dashoffset', (L * (1 - local)).toFixed(2))
              }
            })
            // rotate Z group
            const g = zRef.current.querySelector('g.zgroup')
            if (g) g.setAttribute('transform', `translate(250 250) rotate(${p * 60}) translate(-250 -250)`)
            // text beats
            textRefs.current.forEach((t, i) => {
              if (!t) return
              const start = i / total
              const end = (i + 1) / total
              const local = gsap.utils.clamp(0, 1, (p - start) / (end - start))
              const fadeIn = gsap.utils.clamp(0, 1, local * 3)
              const fadeOut = i === total - 1 ? 1 : gsap.utils.clamp(0, 1, 1 - (local - 0.75) * 4)
              t.style.opacity = (fadeIn * fadeOut).toString()
              t.style.transform = `translateY(${(1 - fadeIn) * 40}px)`
            })
          }
        })
      }, ref)
      cleanup = () => ctx.revert()
    })()
    return () => cleanup && cleanup()
  }, [])

  // Build a Z made of stacked stroked segments + facets
  const segs = []
  const facets = []
  const lineLen = 320
  // top bar, diagonal, bottom bar, repeated stacked to look 3D
  for (let z = 0; z < 6; z++) {
    const off = z * 6
    segs.push({ d: `M ${100 + off} ${100 + off} L ${420 + off} ${100 + off}`, len: lineLen })
    segs.push({ d: `M ${420 + off} ${100 + off} L ${100 + off} ${420 + off}`, len: 460 })
    segs.push({ d: `M ${100 + off} ${420 + off} L ${420 + off} ${420 + off}`, len: lineLen })
  }
  // a couple of facets connecting layers
  for (let z = 0; z < 5; z++) {
    const off = z * 6
    facets.push(`${100 + off},${100 + off} ${420 + off},${100 + off} ${426 + off},${106 + off} ${106 + off},${106 + off}`)
    facets.push(`${100 + off},${420 + off} ${420 + off},${420 + off} ${426 + off},${426 + off} ${106 + off},${426 + off}`)
  }

  return (
    <section id="about" ref={ref} className="relative w-full h-screen bg-[#050505] overflow-hidden">
      <div className="absolute inset-0 grid md:grid-cols-2">
        <div className="relative flex items-center justify-center">
          <div className="absolute top-10 left-10 text-xs uppercase tracking-[0.3em] text-white/40">About</div>
          <svg ref={zRef} viewBox="0 0 500 500" className="w-[80%] aspect-square">
            <g className="zgroup" transform="translate(250 250) rotate(0) translate(-250 -250)">
              {facets.map((pts, i) => (
                <polygon key={'f' + i} className="zface" points={pts} fill="white" fillOpacity="0.04" stroke="white" strokeOpacity="0.2" strokeWidth="0.5" opacity="0" />
              ))}
              {segs.map((s, i) => (
                <path key={'s' + i} className="zseg" d={s.d} stroke="white" strokeWidth={i < 3 ? 2 : 1} fill="none" data-length={s.len} strokeDasharray={s.len} strokeDashoffset={s.len} opacity="0" strokeLinecap="square" />
              ))}
            </g>
          </svg>
        </div>
        <div className="relative flex items-center justify-center px-10">
          <div className="relative w-full max-w-md h-[60vh]">
            {BEATS.map((b, i) => (
              <div key={i} ref={el => (textRefs.current[i] = el)} className="absolute inset-0 flex flex-col justify-center" style={{ opacity: i === 0 ? 1 : 0 }}>
                <div className="display text-[18vw] md:text-[10vw] leading-none">{b.stat}</div>
                <div className="text-xs uppercase tracking-[0.3em] text-white/40 mt-4">{b.label}</div>
                <p className="mt-6 font-general-sans text-white/60 text-lg leading-relaxed max-w-sm">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-0 right-0 mx-auto max-w-[1400px] px-6 md:px-10 flex justify-between text-[10px] uppercase tracking-[0.3em] text-white/30">
        <span>Z — a five-year unfolding</span>
      </div>
    </section>
  )
}