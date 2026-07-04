'use client'
import { useRef } from 'react'

const PROJECTS = [
  { id: 'devsec', name: 'DEVSEC', tag: 'Security · AI', desc: 'AI-augmented secure development platform. Real-time code intelligence, threat modeling and policy enforcement woven into the IDE.', size: 'lg' },
  { id: 'zip', name: 'ZIP', tag: 'Compression · R&D', desc: 'Next-gen neural compression pipeline. 40% smaller payloads, lossless, hardware-accelerated.', size: 'md' },
  { id: 'jarvis', name: 'JARVIS', tag: 'Agentic · OS', desc: 'A personal computing layer that operates your tools. Memory, reasoning, and action — unified.', size: 'wide' },
  { id: 'rag', name: 'College RAG Intelligence', tag: 'Retrieval · Education', desc: 'A retrieval system purpose-built for academia. Multi-modal indexing across lectures, papers and labs.', size: 'md' },
  { id: 'sadt', name: 'Secure Audio Data Transfer', tag: 'Crypto · Acoustic', desc: 'Encrypted, air-gapped data transfer via acoustic modulation. Verified at 28 kbps over ultrasonic carriers.', size: 'md' },
]

export default function Projects() {
  return (
    <section id="projects" className="relative w-full bg-[#050505] py-32 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex items-end justify-between mb-16">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4">Selected Work — 005</div>
            <h2 className="display text-5xl md:text-7xl">Projects.</h2>
          </div>
          <div className="hidden md:block text-sm text-white/50 max-w-xs text-right">A non-exhaustive sample. Active engagements are not listed.</div>
        </div>

        <div className="grid grid-cols-12 gap-4 md:gap-6 auto-rows-[minmax(0,1fr)]">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project, index }) {
  const cardRef = useRef(null)
  const inner = useRef(null)

  const handleMove = (e) => {
    const el = cardRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    if (inner.current) {
      inner.current.style.transform = `perspective(1200px) rotateY(${x*6}deg) rotateX(${-y*6}deg) translateZ(20px)`
    }
  }
  const handleLeave = () => {
    if (inner.current) inner.current.style.transform = 'perspective(1200px) rotateY(0deg) rotateX(0deg) translateZ(0)'
  }

  const colSpan = project.size === 'lg' ? 'col-span-12 md:col-span-7 row-span-2 min-h-[420px] md:min-h-[560px]'
                : project.size === 'wide' ? 'col-span-12 min-h-[360px]'
                : 'col-span-12 md:col-span-' + (project.size === 'md' ? '5' : '6') + ' min-h-[320px] md:min-h-[380px]'

  return (
    <div ref={cardRef} onMouseMove={handleMove} onMouseLeave={handleLeave}
      className={`group relative ${colSpan} border border-white/10 bg-[#0a0a0a] overflow-hidden cursor-pointer`}
      style={{ transition: 'border-color 0.4s' }}
    >
      <div ref={inner} className="absolute inset-0 transition-transform duration-300 ease-out">
        <ProjectVisual id={project.id} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      {/* noise */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")"}}/>
      <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-8">
        <div className="flex items-start justify-between">
          <div className="text-[10px] uppercase tracking-[0.3em] text-white/50">{project.tag}</div>
          <div className="text-[10px] tracking-[0.2em] text-white/40">0{index+1}</div>
        </div>
        <div className="overflow-hidden">
          <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
            <h3 className="display text-3xl md:text-5xl">{project.name}</h3>
            <p className="mt-3 text-white/60 text-sm md:text-base max-w-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">{project.desc}</p>
            <div className="mt-4 flex items-center gap-2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span>Read case</span><span>→</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProjectVisual({ id }) {
  // Abstract SVG visuals — unique per project
  switch (id) {
    case 'devsec':
      return (
        <svg viewBox="0 0 600 400" className="absolute inset-0 w-full h-full">
          <defs><pattern id="g1" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/></pattern></defs>
          <rect width="600" height="400" fill="url(#g1)"/>
          <g stroke="white" strokeWidth="1" fill="none" opacity="0.75">
            <circle cx="300" cy="200" r="140"/>
            <circle cx="300" cy="200" r="100"/>
            <circle cx="300" cy="200" r="60"/>
            <path d="M160 200 H 440 M 300 60 V 340"/>
          </g>
          <g fill="white"><circle cx="300" cy="200" r="3"/><circle cx="440" cy="200" r="2"/><circle cx="160" cy="200" r="2"/></g>
        </svg>
      )
    case 'zip':
      return (
        <svg viewBox="0 0 600 400" className="absolute inset-0 w-full h-full">
          <g stroke="white" strokeWidth="1" fill="none" opacity="0.6">
            {Array.from({length: 24}).map((_,i)=>(<rect key={i} x={40 + i*22} y={100 + Math.sin(i*0.5)*40} width="10" height={200 - Math.sin(i*0.5)*60} />))}
          </g>
        </svg>
      )
    case 'jarvis':
      return (
        <svg viewBox="0 0 1000 400" className="absolute inset-0 w-full h-full">
          <g stroke="white" strokeWidth="1" fill="none" opacity="0.6">
            {Array.from({length: 14}).map((_,i)=>(<circle key={i} cx={100 + i*60} cy="200" r={20 + i*4}/>))}
            <path d="M 100 200 H 900" />
          </g>
          <g fill="white">{Array.from({length: 14}).map((_,i)=>(<circle key={i} cx={100 + i*60} cy="200" r="2"/>))}</g>
        </svg>
      )
    case 'rag':
      return (
        <svg viewBox="0 0 600 400" className="absolute inset-0 w-full h-full">
          <g stroke="white" strokeWidth="1" fill="none" opacity="0.55">
            {Array.from({length: 7}).map((_,i)=>(<g key={i}>
              <line x1={80} y1={60 + i*40} x2={520} y2={60 + i*40} />
              <line x1={80 + (i*30)} y1={60} x2={80 + (i*30)} y2={340} />
            </g>))}
          </g>
        </svg>
      )
    case 'sadt':
      return (
        <svg viewBox="0 0 600 400" className="absolute inset-0 w-full h-full">
          <g stroke="white" strokeWidth="1" fill="none" opacity="0.7">
            <path d={'M 0 200 ' + Array.from({length: 60}).map((_,i)=>`L ${i*10} ${200 + Math.sin(i*0.6)*Math.cos(i*0.2)*70}`).join(' ')} />
            <path d={'M 0 220 ' + Array.from({length: 60}).map((_,i)=>`L ${i*10} ${220 + Math.sin(i*0.4)*50}`).join(' ')} opacity="0.4"/>
          </g>
        </svg>
      )
    default: return null
  }
}
