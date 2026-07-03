'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * SmoothScroll — initializes Lenis and connects it to GSAP ScrollTrigger.
 * Compatible with both lenis v1.x and @studio-freight/lenis.
 *
 * This replicates the original site's html.lenis behavior exactly.
 */
export default function SmoothScroll({ children }) {
  useEffect(() => {
    let lenis;
    let rafHandle;

    async function init() {
      // Dynamic import handles SSR safely and works with both lenis packages
      const LenisModule = await import('lenis');
      const Lenis = LenisModule.default ?? LenisModule.Lenis;

      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 2,
        smoothTouch: false,
      });

      // Add lenis class to <html> (matches reference html.lenis)
      document.documentElement.classList.add('lenis');

      // Connect Lenis scroll events to GSAP ScrollTrigger
      lenis.on('scroll', ScrollTrigger.update);

      // Ticker function — store reference so we can remove it
      const tickerFn = (time) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);

      // Store for cleanup
      rafHandle = tickerFn;
    }

    init();

    return () => {
      if (lenis) {
        lenis.destroy();
      }
      if (rafHandle) {
        gsap.ticker.remove(rafHandle);
      }
      document.documentElement.classList.remove('lenis');
    };
  }, []);

  return <>{children}</>;
}
