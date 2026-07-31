'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

function onMag(e) {
  const r = e.currentTarget.getBoundingClientRect();
  const dx = e.clientX - (r.left + r.width / 2);
  const dy = e.clientY - (r.top + r.height / 2);
  e.currentTarget.style.transform = `translate(${dx * 0.28}px, ${dy * 0.28}px)`;
  e.currentTarget.style.transition = 'transform 0.05s linear';
}
function offMag(e) {
  e.currentTarget.style.transform = 'translate(0,0)';
  e.currentTarget.style.transition = 'transform 0.35s cubic-bezier(0.23,1,0.32,1)';
}

gsap.registerPlugin(ScrollTrigger)

export default function Hero({ initiallyVisible = false }) {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const subRef = useRef(null)
  const ctaRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const chars = headingRef.current?.querySelectorAll('.char') || []
      const subWords = subRef.current?.querySelectorAll('.word') || []
      const cta = ctaRef.current

      if (initiallyVisible) {
        // Snap to start state first
        gsap.set(chars, { y: '110%', opacity: 0 })
        gsap.set(subWords, { y: 14, opacity: 0, filter: 'blur(6px)' })
        gsap.set(cta, { y: 20, opacity: 0 })

        // Fast, punchy reveal — no unnecessary delay
        gsap.to(chars, {
          y: '0%',
          opacity: 1,
          stagger: 0.01,
          duration: 0.9,
          ease: 'expo.out',
          delay: 0.05,
        })

        gsap.to(subWords, {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          stagger: 0.012,
          duration: 0.8,
          delay: 0.4,
          ease: 'power3.out',
        })

        gsap.to(cta, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          delay: 0.9,
          ease: 'expo.out',
        })
      } else {
        gsap.set([chars, subWords, cta], { opacity: 1, y: 0, filter: 'blur(0px)' })
      }

      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          if (self.progress > 0.15) {
            document.body.classList.add('hero-scrolled')
          } else {
            document.body.classList.remove('hero-scrolled')
          }
        },
      })

      return () => st.kill()
    }, sectionRef)

    return () => ctx.revert()
  }, [initiallyVisible])

  const headlineLines = [
    'Building the Layer Beneath Innovation,',
    'Engineering the Next Layer of Intelligence.',
  ]

  const subParagraphText =
    'Software that thinks. Systems that scale. Products that outlast the trend that inspired them.'

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full overflow-hidden"
      style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0.9) 100%)',
      }} />

      {/* Centered content */}
      <div className="relative z-10 w-full flex flex-col items-center text-center px-6 md:px-10">
        <h1
          ref={headingRef}
          className="font-clash-display leading-[1.15] tracking-tight text-white"
          style={{ fontSize: 'clamp(20px, 2.8vw, 52px)', maxWidth: '1200px', width: '100%', margin: '0 auto' }}
        >
          {headlineLines.map((line, i) => (
            <div key={i} className="overflow-hidden py-1 -my-1">
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
          className="mt-6 font-general-sans text-white/60 leading-relaxed flex flex-wrap justify-center"
          style={{ fontSize: 'clamp(14px, 1.1vw, 18px)', maxWidth: '680px' }}
        >
          {subParagraphText.split(' ').map((word, idx) => (
            <span
              key={idx}
              className="word inline-block mr-[0.28em] py-0.5"
              style={{ opacity: initiallyVisible ? 1 : 0 }}
            >
              {word}
            </span>
          ))}
        </p>

        <div
          ref={ctaRef}
          className="mt-12 flex items-center gap-6"
          style={{ opacity: initiallyVisible ? 1 : 0 }}
        >
          <a
            href="#the-way-we-build"
            onClick={(e) => {
              e.preventDefault()
              const el = document.getElementById('the-way-we-build')
              if (el) {
                if (window.lenis) window.lenis.scrollTo(el, { immediate: true })
                else window.scrollTo({ top: el.offsetTop, behavior: 'instant' })
              }
            }}
            onMouseMove={onMag}
            onMouseLeave={offMag}
            className="group inline-flex items-center text-sm border border-white/20 hover:border-white/60 px-7 py-3 rounded-full text-white font-excon tracking-wide"
            style={{ transition: 'color 0.3s, border-color 0.3s' }}
          >
            <span>Explore</span>
            <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </a>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <div className="w-[1px] h-8 bg-gradient-to-b from-transparent to-white/20 animate-pulse" />
      </div>
    </section>
  )
}