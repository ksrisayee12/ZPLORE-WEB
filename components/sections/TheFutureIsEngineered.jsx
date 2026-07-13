'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const quotes = [
  {
    eyebrow: '02 / THE FUTURE IS ENGINEERED',
    lines: [
      "We don't follow the future.",
      'We engineer it.',
      'Product by product.',
      'System by system.',
    ],
  },
  {
    eyebrow: 'INTENTIONAL ARCHITECTURE',
    lines: [
      'Software that thinks.',
      'Systems that scale.',
      'Products that outlast the trend',
      'that inspired them.',
    ],
  },
  {
    eyebrow: 'CONTINUOUS ASSEMBLY',
    lines: [
      "We don't wait for the future.",
      'We assemble it —',
      'one system,',
      'one product,',
      'one idea at a time.',
    ],
  },
]

export default function TheFutureIsEngineered() {
  const sectionRef = useRef(null)
  const containerRef = useRef(null)
  const quoteRefs = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const quoteBlocks = quoteRefs.current

      // Set initial state for all quotes
      quoteBlocks.forEach((block, idx) => {
        if (!block) return
        const words = block.querySelectorAll('.quote-word')
        gsap.set(block, {
          autoAlpha: idx === 0 ? 1 : 0,
          scale: idx === 0 ? 1 : 0.95,
          rotateX: idx === 0 ? 0 : 12,
        })
        gsap.set(words, {
          opacity: idx === 0 ? 1 : 0,
          y: idx === 0 ? 0 : 35,
          filter: idx === 0 ? 'blur(0px)' : 'blur(12px)',
        })
      })

      // Pinned master timeline controlled by scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=350%',
          pin: true,
          pinSpacing: true,
          refreshPriority: 12,
          scrub: 1,
          anticipatePin: 1,
        },
      })

      // Sequence quote transitions
      quotes.forEach((_, i) => {
        if (i === 0) {
          // First quote holds for a bit, then dissolves out
          const words0 = quoteBlocks[0]?.querySelectorAll('.quote-word') || []
          tl.to(
            words0,
            {
              opacity: 0,
              y: -35,
              filter: 'blur(12px)',
              stagger: 0.015,
              duration: 0.5,
              ease: 'power2.inOut',
            },
            0.6
          ).to(
            quoteBlocks[0],
            {
              autoAlpha: 0,
              scale: 1.05,
              rotateX: -10,
              duration: 0.5,
            },
            0.6
          )
          return
        }

        const prevBlock = quoteBlocks[i - 1]
        const currBlock = quoteBlocks[i]
        const currWords = currBlock?.querySelectorAll('.quote-word') || []
        const startTime = i * 1.1

        // Reveal current quote with word stagger + blur dissolve + perspective leveling
        tl.to(
          currBlock,
          {
            autoAlpha: 1,
            scale: 1,
            rotateX: 0,
            duration: 0.45,
            ease: 'power3.out',
          },
          startTime - 0.2
        ).to(
          currWords,
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            stagger: 0.02,
            duration: 0.55,
            ease: 'power3.out',
          },
          startTime - 0.15
        )

        // If not the last quote, dissolve out to make room for next
        if (i < quotes.length - 1) {
          tl.to(
            currWords,
            {
              opacity: 0,
              y: -35,
              filter: 'blur(12px)',
              stagger: 0.015,
              duration: 0.5,
              ease: 'power2.inOut',
            },
            startTime + 0.65
          ).to(
            currBlock,
            {
              autoAlpha: 0,
              scale: 1.05,
              rotateX: -10,
              duration: 0.5,
            },
            startTime + 0.65
          )
        } else {
          // Last quote (Quote 3) dissolves out completely right before unpinning so it never lingers or duplicates
          tl.to(
            currWords,
            {
              opacity: 0,
              y: -35,
              filter: 'blur(12px)',
              stagger: 0.015,
              duration: 0.5,
              ease: 'power2.inOut',
            },
            startTime + 0.85
          ).to(
            [currBlock, containerRef.current],
            {
              autoAlpha: 0,
              scale: 0.95,
              filter: 'blur(10px)',
              duration: 0.5,
            },
            startTime + 0.85
          )
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-[#000000] text-white overflow-hidden select-none flex items-center justify-center"
      style={{ perspective: '1200px' }}
    >
      {/* Centered Cinematic Composition */}
      <div
        ref={containerRef}
        className="relative z-10 mx-auto max-w-6xl px-6 md:px-12 w-full flex items-center justify-center h-full will-change-transform"
      >
        {quotes.map((item, qIdx) => (
          <div
            key={qIdx}
            ref={(el) => (quoteRefs.current[qIdx] = el)}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 will-change-transform"
          >
            <div className="text-xs uppercase tracking-[0.35em] text-white/40 mb-8 font-excon">
              {item.eyebrow}
            </div>
            <div className="max-w-5xl space-y-2 md:space-y-4">
              {item.lines.map((line, lIdx) => (
                <div key={lIdx} className="overflow-hidden py-1">
                  <h2 className="font-boska text-4xl md:text-6xl lg:text-[5.4vw] leading-[1.08] tracking-tight text-white flex flex-wrap justify-center">
                    {line.split(' ').map((word, wIdx) => (
                      <span
                        key={wIdx}
                        className="quote-word inline-block mr-[0.25em] py-1 will-change-transform"
                      >
                        {word}
                      </span>
                    ))}
                  </h2>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
