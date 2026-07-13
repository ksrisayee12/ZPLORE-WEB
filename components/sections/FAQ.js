'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const faqItems = [
  {
    number: '01',
    question: 'Who is Zplore?',
    answer:
      'Zplore is an innovation ecosystem that builds AI products, enterprise software, and developer platforms—while growing a community where builders learn, collaborate, and turn ideas into real products.',
  },
  {
    number: '02',
    question: 'Can you modernize existing software?',
    answer:
      'Yes. We assess your existing systems, identify what should be preserved, and redesign what limits growth—extending your technology without disrupting the business that depends on it.',
  },
  {
    number: '03',
    question: 'Once something is live, how do you keep it improving over time?',
    answer:
      'We continuously observe how systems perform after deployment and release carefully tested improvements in controlled iterations, ensuring progress without compromising stability.',
  },
  {
    number: '04',
    question:
      'If our systems are spread across different platforms, can you still connect everything?',
    answer:
      'Yes. We begin by understanding your existing architecture, then engineer the integration layer that allows your platforms to work as a unified system—without forcing unnecessary migrations.',
  },
  {
    number: '05',
    question: 'Does the solution stay current as AI models evolve?',
    answer:
      'Yes. Every improvement is versioned, tested, and introduced deliberately, allowing your platform to benefit from new capabilities while maintaining reliability and continuity.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 })
  const sectionRef = useRef(null)
  const answerRefs = useRef([])
  const rowRefs = useRef([])

  // Track cursor position inside section for ambient lighting spotlight
  const handleMouseMove = useCallback((e) => {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (rect) {
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }, [])

  // GSAP Entrance animations using ScrollTrigger
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance (staggered word blur reveal + subtle scale)
      const headerWords = gsap.utils.toArray('.faq-header-word')
      gsap.fromTo(
        headerWords,
        { opacity: 0, y: 40, filter: 'blur(10px)', scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          scale: 1,
          duration: 1.15,
          stagger: 0.035,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      )

      // Rows entrance
      gsap.fromTo(
        '.faq-row',
        { opacity: 0, y: 45 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Handle accordion expansion/collapse with physical GSAP physics
  const toggleFAQ = (index) => {
    const isOpening = openIndex !== index
    const previousIndex = openIndex

    // Update state
    setOpenIndex(isOpening ? index : null)

    // Collapse previous answer if any
    if (previousIndex !== null && answerRefs.current[previousIndex]) {
      gsap.to(answerRefs.current[previousIndex], {
        height: 0,
        opacity: 0,
        filter: 'blur(6px)',
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.55,
        ease: 'power3.inOut',
      })
    }

    // Expand clicked answer or collapse if it was already open
    if (isOpening && answerRefs.current[index]) {
      gsap.fromTo(
        answerRefs.current[index],
        {
          height: 0,
          opacity: 0,
          filter: 'blur(8px)',
          clipPath: 'inset(0 0 100% 0)',
        },
        {
          height: 'auto',
          opacity: 1,
          filter: 'blur(0px)',
          clipPath: 'inset(0 0 0% 0)',
          duration: 0.7,
          ease: 'power3.out',
        }
      )
    } else if (!isOpening && answerRefs.current[index]) {
      gsap.to(answerRefs.current[index], {
        height: 0,
        opacity: 0,
        filter: 'blur(6px)',
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.55,
        ease: 'power3.inOut',
      })
    }
  }

  const statementText = "Every product we've built started as a question worth asking."
  const bringText = "Bring yours."

  return (
    <section
      id="faq"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative w-full bg-[#000000] text-white py-20 md:py-28 overflow-hidden select-none"
    >
      {/* Soft Cursor Spotlight — Mouse Parallax Lighting */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-0"
        style={{
          background: `radial-gradient(750px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.035), transparent 60%)`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10">
        {/* Section Header — Left Top Compact Heading */}
        <div className="max-w-4xl mb-14 md:mb-16 text-left">
          <div className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4 font-excon">
            Inquiry & Architecture
          </div>
          <h2 className="font-clash-display-medium text-3xl md:text-5xl tracking-tight leading-[1.15] mb-3 flex flex-wrap justify-start">
            {statementText.split(' ').map((word, idx) => (
              <span
                key={idx}
                className="faq-header-word inline-block mr-[0.26em] py-1"
                style={{ opacity: 0 }}
              >
                {word}
              </span>
            ))}
          </h2>
          <div className="font-clash-display-medium text-xl md:text-3xl text-white/80 flex flex-wrap justify-start">
            {bringText.split(' ').map((word, idx) => (
              <span
                key={idx}
                className="faq-header-word inline-block mr-[0.26em] py-1 text-white"
                style={{ opacity: 0 }}
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        {/* FAQ List Container */}
        <div className="border-t border-white/[0.08]">
          {faqItems.map((item, index) => {
            const isActive = openIndex === index
            const isOtherActive = openIndex !== null && !isActive

            return (
              <div
                key={index}
                ref={(el) => (rowRefs.current[index] = el)}
                onClick={() => toggleFAQ(index)}
                className={`faq-row group relative w-full py-8 md:py-12 border-b border-white/[0.08] cursor-pointer transition-all duration-500 ${
                  isActive ? 'bg-white/[0.015]' : ''
                }`}
              >
                {/* Subtle Ambient Glow behind row on hover or active */}
                <div
                  className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
                    isActive
                      ? 'opacity-100 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.04)_0%,transparent_80%)]'
                      : 'opacity-0 group-hover:opacity-100 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.025)_0%,transparent_70%)]'
                  }`}
                />

                {/* Tiny Growing Underline from Left on Hover/Active */}
                <div
                  className={`absolute bottom-0 left-0 h-[1px] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isActive
                      ? 'w-full bg-white/60'
                      : 'w-0 group-hover:w-full bg-white/35'
                  }`}
                />

                {/* Question Row (Number + Question + Indicator) */}
                <div className="relative z-10 flex items-start md:items-center justify-between gap-6 md:gap-12 transition-transform duration-500 ease-out group-hover:translate-x-2 md:group-hover:translate-x-3 group-hover:-translate-y-[1px]">
                  <div className="flex items-start md:items-center gap-6 md:gap-12 flex-1">
                    {/* Number */}
                    <span
                      className={`font-zodiac-light text-sm md:text-base tracking-[0.2em] transition-colors duration-500 ${
                        isActive
                          ? 'text-white'
                          : isOtherActive
                          ? 'text-white/20'
                          : 'text-white/40 group-hover:text-white/80'
                      }`}
                    >
                      {item.number}
                    </span>

                    {/* Question Title */}
                    <h3
                      className={`font-zodiac text-2xl md:text-4xl lg:text-[42px] leading-tight transition-all duration-500 flex-1 ${
                        isActive
                          ? 'text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.35)]'
                          : isOtherActive
                          ? 'text-white/35'
                          : 'text-white/85 group-hover:text-white'
                      }`}
                    >
                      {item.question}
                    </h3>
                  </div>

                  {/* Interactive Plus / Minus Indicator */}
                  <div
                    className={`relative w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-500 flex-shrink-0 ${
                      isActive
                        ? 'border-white/60 bg-white text-black rotate-180 scale-105 shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                        : 'border-white/20 text-white group-hover:border-white/50 group-hover:scale-105'
                    }`}
                  >
                    <svg
                      className="w-3.5 h-3.5 transition-transform duration-500"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path
                        d="M7 1V13M1 7H13"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        className={`transition-opacity duration-300 ${
                          isActive ? 'opacity-0' : 'opacity-100'
                        }`}
                      />
                      <path
                        d="M1 7H13"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        className={`transition-opacity duration-300 ${
                          isActive ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    </svg>
                  </div>
                </div>

                {/* Answer Container — Animated physical height expansion */}
                <div
                  ref={(el) => (answerRefs.current[index] = el)}
                  className="relative z-10 overflow-hidden h-0 opacity-0"
                  style={{ clipPath: 'inset(0 0 100% 0)' }}
                >
                  <div className="pt-6 md:pt-8 pl-12 md:pl-20 pr-6 md:pr-16 max-w-4xl">
                    <p className="font-zodiac-light text-base md:text-xl lg:text-2xl text-white/80 leading-relaxed tracking-normal">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
