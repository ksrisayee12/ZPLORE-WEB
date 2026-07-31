'use client';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Footer — reconstructed from reference HTML footer block.
 */

const footerLinks = {
  Studio: ['About', 'Projects', 'Services', 'Enterprise'],
  Connect: ['GitHub', 'X / Twitter', 'LinkedIn', 'Email'],
  Legal: ['Privacy', 'Terms'],
};

export default function Footer() {
  const year = new Date().getFullYear();
  const footerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.footer-display-zplore',
        { scale: 0.25, opacity: 0, y: 60, filter: 'blur(15px)' },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.35,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 85%',
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="relative w-full bg-[#050505] border-t border-white/10 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {/* Top grid */}
        <div className="py-16 md:py-24 grid md:grid-cols-12 gap-12">
          {/* Logo + byline */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-2 mb-6">
              <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                <path
                  d="M6 6 L26 6 L6 26 L26 26"
                  stroke="white"
                  strokeWidth="1.5"
                />
              </svg>
              <span className="text-[15px] tracking-[-0.02em] font-medium text-white">
                Zplore
              </span>
            </div>
          </div>

          {/* Nav columns */}
          <div className="md:col-span-7 md:col-start-6 grid grid-cols-3 gap-8">
            {Object.entries(footerLinks).map(([group, links]) => (
              <div key={group}>
                <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-5">
                  {group}
                </div>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-white/60 hover:text-white transition-colors underline-draw"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider + large display text */}
        <div className="py-10 border-t border-white/10">
          <div className="footer-display-zplore display text-[14vw] md:text-[8vw] text-white/10 leading-none text-center select-none pointer-events-none" style={{ opacity: 0 }}>
            Zplore
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11px] text-white/30 tracking-wide">
          <div>© {year} Zplore Technologies Pvt. Ltd. All rights reserved.</div>
          <div>Built with precision. v2026.06</div>
        </div>
      </div>
    </footer>
  );
}
