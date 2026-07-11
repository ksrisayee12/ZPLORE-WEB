'use client';

import { useState, useEffect } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /* Track scroll to add background on header */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Close menu on Escape */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  /* Prevent body scroll when menu open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navLinks = [
    { label: 'What we do', id: 'studio' },
    { label: 'Products', id: 'projects' },
    { label: 'Services', id: 'services' },
    { label: 'Enterprise', id: 'enterprise' },
    { label: 'About', id: 'about' },
    { label: 'Explore Community', id: 'community' },
  ];

  const scrollTo = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id.toLowerCase());
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-6 ${
          scrolled ? 'py-4' : 'py-6'
        }`}
      >
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 transition-all duration-500">
          <div className="flex items-center justify-between rounded-none transition-all duration-500 px-0 py-0">
            {/* Logo */}
            <a
              className="group flex items-center gap-2 text-white"
              href="/"
              aria-label="Zplore home"
            >
              <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                <path
                  d="M6 6 L26 6 L6 26 L26 26"
                  stroke="white"
                  strokeWidth="1.5"
                />
              </svg>
              <span className="text-[15px] tracking-[-0.02em] font-medium">
                Zplore
              </span>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.slice(0, 5).map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="text-[15px] text-white/80 hover:text-white transition-colors underline-draw cursor-pointer font-bricolage"
                >
                  {link.label}
                </button>
              ))}
              <a
                href="#community"
                className="text-[15px] text-white/80 hover:text-white transition-colors underline-draw cursor-pointer border border-white/20 hover:border-white px-4 py-2 font-bricolage"
              >
                Explore Community
              </a>
            </nav>

            {/* CTA Button */}
            <button
              onClick={() => scrollTo('contact')}
              className="hidden md:inline-flex group items-center gap-2 bg-white text-black hover:bg-white/90 px-6 py-2.5 rounded-full text-[14px] font-medium transition-all font-playfair"
            >
              <span>Start a project</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden text-white"
              aria-label="Menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <div
                className={`w-6 h-px bg-white transition-transform origin-center ${
                  menuOpen ? 'rotate-45 translate-y-[3px]' : ''
                }`}
              />
              <div
                className={`w-6 h-px bg-white mt-1.5 transition-transform origin-center ${
                  menuOpen ? '-rotate-45 -translate-y-[3px]' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="flex flex-col h-full px-6 pt-24 pb-12">
          <nav className="flex flex-col gap-6">
            {navLinks.slice(0, 5).map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="display text-4xl text-white/80 hover:text-white transition-colors text-left font-bricolage"
              >
                {link.label}
              </button>
            ))}
            <a
              href="#community"
              className="display text-4xl text-white/80 hover:text-white transition-colors text-left border border-white/20 px-4 py-2 font-bricolage"
            >
              Explore Community
            </a>
          </nav>
          <div className="mt-auto">
            <button
              onClick={() => scrollTo('contact')}
              className="inline-flex items-center gap-2 bg-white text-black hover:bg-white/90 px-7 py-3 rounded-full text-base font-medium transition-all font-playfair"
            >
              Start a project
            </button>
          </div>
        </div>
      </div>
    </>
  );
}