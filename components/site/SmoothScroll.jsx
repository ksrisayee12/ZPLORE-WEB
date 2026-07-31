'use client'
import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll({ children }) {
  useEffect(() => {
    // Disable GSAP's native ticker-based RAF since we drive it via Lenis
    gsap.ticker.lagSmoothing(0)

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    })

    document.documentElement.classList.add('lenis')
    window.__lenis = lenis

    // Keep GSAP ScrollTrigger in sync with Lenis scroll position
    lenis.on('scroll', ScrollTrigger.update)

    // Tick Lenis on every GSAP frame (avoids double RAF)
    const tickerFn = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tickerFn)

    // Refresh ScrollTrigger after layout is painted
    const t = setTimeout(() => ScrollTrigger.refresh(), 500)

    return () => {
      clearTimeout(t)
      gsap.ticker.remove(tickerFn)
      lenis.destroy()
      document.documentElement.classList.remove('lenis')
      delete window.__lenis
    }
  }, [])

  return children
}