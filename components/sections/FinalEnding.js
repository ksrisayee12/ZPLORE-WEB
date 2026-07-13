'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sentences = [
  'Ideas start here.',
  'Code gives them form.',
  'Intelligence gives them purpose.',
  'Zplore gives them scale.',
]

export default function FinalEnding() {
  const sectionRef = useRef(null)
  const sentencesContainerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sentenceElems =
        sentencesContainerRef.current?.querySelectorAll('.ending-sentence') || []

      // Initial state
      gsap.set(sentenceElems, {
        opacity: 0,
        y: 50,
        filter: 'blur(12px)',
      })

      // Pinned closing shot sequence
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=180%',
          pin: true,
          pinSpacing: true,
          refreshPriority: 5,
          scrub: 0.9,
          anticipatePin: 1,
        },
      })

      // Each sentence appears independently with vertical motion + blur reveal
      sentenceElems.forEach((elem, idx) => {
        tl.to(
          elem,
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.45,
            ease: 'power3.out',
          },
          idx * 0.35
        )
      })

      // Hold sentences cleanly before releasing scroll
      tl.to(
        sentenceElems,
        {
          opacity: 1,
          duration: 0.4,
        },
        '+=0.2'
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-[#000000] text-white overflow-hidden select-none flex items-center justify-center py-20"
    >
      {/* Huge Whitespace Centered Container */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 md:px-12 w-full flex flex-col items-center justify-center text-center">
        {/* Sentences Container */}
        <div ref={sentencesContainerRef} className="space-y-8 md:space-y-12">
          {sentences.map((text, i) => (
            <div key={i} className="overflow-hidden py-2">
              <h2
                className={`ending-sentence font-boska text-4xl md:text-6xl lg:text-7xl leading-tight tracking-tight text-white block will-change-transform ${
                  i === sentences.length - 1
                    ? 'drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]'
                    : 'text-white/90'
                }`}
              >
                {text}
              </h2>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
