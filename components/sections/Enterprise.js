'use client'
import { useEffect, useRef } from 'react'

const NODES = [
  { id: 'edge', label: 'Edge', x: 80, y: 120 },
  { id: 'gw', label: 'Gateway', x: 280, y: 80 },
  { id: 'auth', label: 'AuthZ / mTLS', x: 280, y: 200 },
  { id: 'orch', label: 'Orchestrator', x: 520, y: 140 },
  { id: 'agent', label: 'Agent Mesh', x: 760, y: 60 },
  { id: 'ml', label: 'Model Plane', x: 760, y: 220 },
  { id: 'vec', label: 'Vector Store', x: 980, y: 140 },
  { id: 'obs', label: 'Telemetry', x: 520, y: 320 },
  { id: 'kms', label: 'KMS / Secrets', x: 1180, y: 80 },
  { id: 'audit', label: 'Audit Ledger', x: 1180, y: 220 },
]
const EDGES = [
  ['edge', 'gw'], ['edge', 'auth'], ['gw', 'orch'], ['auth', 'orch'],
  ['orch', 'agent'], ['orch', 'ml'], ['agent', 'vec'], ['ml', 'vec'],
  ['orch', 'obs'], ['vec', 'kms'], ['vec', 'audit'], ['ml', 'kms']
]

export default function Enterprise() {
  const ref = useRef(null)
  const svgRef = useRef(null)

  useEffect(() => {
    let cleanup
    ; (async () => {
      const { default: gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      const ctx = gsap.context(() => {
        const paths = svgRef.current.querySelectorAll('path.edge')
        const nodes = svgRef.current.querySelectorAll('g.node')
        const pulses = svgRef.current.querySelectorAll('circle.pulse')

        paths.forEach(p => {
          const len = p.getTotalLength()
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
        })
        gsap.set(nodes, { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' })
        gsap.set(pulses, { opacity: 0 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 70%',
            end: 'bottom top',
            scrub: 0.8,
          }
        })
        tl.to(paths, { strokeDashoffset: 0, duration: 1, stagger: 0.04, ease: 'power2.inOut' }, 0)
          .to(nodes, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: 'expo.out' }, 0.2)
          .to(pulses, { opacity: 1, duration: 0.2 }, 0.6)

        // continuous light pulse animation across edges (independent of scroll)
        pulses.forEach((p, i) => {
          const edge = paths[i % paths.length]
          const len = edge.getTotalLength()
          gsap.to({}, {
            duration: 2.4 + (i % 3) * 0.6,
            repeat: -1,
            ease: 'none',
            onUpdate: function () {
              const pt = edge.getPointAtLength(this.progress() * len)
              p.setAttribute('cx', pt.x)
              p.setAttribute('cy', pt.y)
            }
          })
        })
      }, ref)
      cleanup = () => ctx.revert()
    })()
    return () => cleanup && cleanup()
  }, [])

  const nodeById = (id) => NODES.find(n => n.id === id)

  return (
    <section id="enterprise" ref={ref} className="relative w-full bg-[#050505] py-32 md:py-40 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <div className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4">Enterprise</div>
            <h2 className="font-clash-display-medium text-5xl md:text-7xl mb-8">Built for scale, designed for trust.</h2>
            <p className="font-general-sans text-white/60 leading-relaxed max-w-md">A reference architecture for production AI systems. Identity at the edge. Models behind policy. Every event signed, sealed, replayable.</p>
            <ul className="mt-8 space-y-3 text-sm text-white/70 font-general-sans">
              {['SOC2-ready by default', 'BYOK / customer-managed encryption', 'Self-hosted, hybrid or fully managed', 'Sub-100ms agent orchestration'].map(s => (
                <li key={s} className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-white rounded-full" />{s}</li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-8">
            <div className="border border-white/10 bg-[#0a0a0a] aspect-[1300/420] w-full overflow-hidden">
              <svg ref={svgRef} viewBox="0 0 1300 420" className="w-full h-full">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" /></pattern>
                </defs>
                <rect width="1300" height="420" fill="url(#grid)" />
                {EDGES.map(([a, b], i) => {
                  const A = nodeById(a), B = nodeById(b)
                  const mx = (A.x + B.x) / 2
                  const my = (A.y + B.y) / 2 - 30
                  return <path key={i} className="edge" d={`M ${A.x} ${A.y} Q ${mx} ${my} ${B.x} ${B.y}`} stroke="white" strokeOpacity="0.45" strokeWidth="1" fill="none" />
                })}
                {EDGES.map((_, i) => (<circle key={'p' + i} className="pulse" r="3" fill="white" />))}
                {NODES.map(n => (
                  <g key={n.id} className="node" transform={`translate(${n.x} ${n.y})`}>
                    <circle r="22" fill="#050505" stroke="white" strokeOpacity="0.8" />
                    <circle r="3" fill="white" />
                    <text y="42" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="11" fontFamily="Inter, sans-serif" letterSpacing="1">{n.label.toUpperCase()}</text>
                  </g>
                ))}
              </svg>
            </div>
            <div className="grid grid-cols-3 mt-8 border border-white/10">
              {[['99.99%', 'Availability SLO'], ['28ms', 'p50 orchestrator latency'], ['ISO 27001', 'Roadmap Q3']].map(([k, v]) => (
                <div key={k} className="p-6 border-r last:border-r-0 border-white/10">
                  <div className="display text-3xl">{k}</div>
                  <div className="text-xs uppercase tracking-[0.2em] text-white/40 mt-2">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}