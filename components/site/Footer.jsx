'use client'
import { useRef, useEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const footerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.footer-zplore-logo',
        { scale: 0.25, opacity: 0, y: 50, filter: 'blur(12px)' },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.3,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 85%',
          },
        }
      )
    }, footerRef)

    return () => ctx.revert()
  }, [])

  return (
    <footer ref={footerRef} className="relative border-t border-white/10 mt-0 bg-[#000000] overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <div className="footer-zplore-logo font-clash-display text-6xl md:text-8xl tracking-tight inline-block cursor-pointer transition-transform duration-500 hover:scale-105" style={{ opacity: 0 }}>Zplore</div>
          </div>
          <FooterCol title="Studio" items={[['Products', '#projects'], ['Services', '#services'], ['Enterprise', '#enterprise']]} />
          <FooterCol title="Company" items={[['About', '#about'], ['Community', '/community'], ['Contact', '#contact']]} />
          <FooterCol title="Connect" items={[['Twitter', '#'], ['LinkedIn', '#'], ['GitHub', '#'], ['Instagram', '#'], ['YouTube', '#']]} />
        </div>
        <div className="flex items-center justify-between border-t border-white/5 mt-16 pt-6 text-xs text-white/40">
          <div>© {new Date().getFullYear()} Zplore Labs. All rights reserved.</div>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, items }) {
  const handleAnchorClick = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const targetId = href.replace('#', '')
      if (window.__lenis) {
        window.__lenis.scrollTo(href, { offset: -50, duration: 1.2 })
      } else {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <div>
      <div className="font-supreme font-bold uppercase tracking-wider text-sm md:text-base text-white/80 mb-4">{title}</div>
      <ul className="space-y-2">
        {items.map(([label, href]) => (
          <li key={label}>
            <Link
              href={href}
              onClick={(e) => handleAnchorClick(e, href)}
              className="font-boska text-lg md:text-xl text-white/70 hover:text-white transition-colors"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}