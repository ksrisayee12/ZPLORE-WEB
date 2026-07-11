'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { label: 'What we do', id: 'studio' },
  { label: 'Products', id: 'projects' },
  { label: 'Services', id: 'services' },
  { label: 'Enterprise', id: 'enterprise' },
  { label: 'About', id: 'about' },
  { label: 'Explore Community', href: '/community' },
  { label: 'Contact', id: 'contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goTo = (id) => {
    setOpen(false)
    if (pathname !== '/') {
      window.location.href = '/#' + id
      return
    }
    const el = document.getElementById(id)
    if (!el) return
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -60, duration: 1.4 })
    else el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-6'}`}>
      <div className={`mx-auto max-w-[1400px] px-6 md:px-10 transition-all duration-500`}>
        <div className={`flex items-center justify-between rounded-full transition-all duration-500 ${scrolled ? 'backdrop-blur-xl bg-black/40 border border-white/10 px-6 py-3 shadow-2xl' : 'px-0 py-0'}`}>
          <Link href="/" className="group flex items-center gap-2">
            <ZMark />
            <span className="text-[15px] tracking-[-0.02em] font-medium">Zplore</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {LINKS.filter(l => l.id).map(l => (
              <button key={l.label} onClick={() => goTo(l.id)} className="text-[15px] text-white/80 hover:text-white transition-colors underline-draw font-excon">{l.label}</button>
            ))}
            <Link
              href="/community"
              className="text-[15px] text-white/80 hover:text-white transition-colors border border-white/20 hover:border-white px-5 py-2 rounded-full font-excon"
            >
              Explore Community
            </Link>
          </nav>
          <button onClick={() => goTo('contact')} className="hidden md:inline-flex group items-center gap-2 bg-white text-black hover:bg-white/90 px-6 py-2.5 rounded-full text-[14px] font-medium transition-all font-excon">
            <span>Start a project</span>
          </button>
          <button onClick={() => setOpen(o => !o)} className="md:hidden text-white" aria-label="Menu">
            <div className={`w-6 h-px bg-white transition-transform ${open ? 'rotate-45 translate-y-[3px]' : ''}`} />
            <div className={`w-6 h-px bg-white mt-1.5 transition-transform ${open ? '-rotate-45 -translate-y-[3px]' : ''}`} />
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden fixed inset-0 top-[60px] bg-black/95 backdrop-blur-xl z-40">
          <div className="flex flex-col p-8 gap-6">
            {LINKS.filter(l => l.id).map(l => (
              <button key={l.label} onClick={() => goTo(l.id)} className="text-3xl font-excon text-left text-white/80 hover:text-white">{l.label}</button>
            ))}
            <Link
              href="/community"
              onClick={() => setOpen(false)}
              className="text-3xl font-excon text-left border border-white/20 px-5 py-3 rounded-2xl text-white/80 hover:text-white"
            >
              Explore Community
            </Link>
            <div className="mt-4">
              <button onClick={() => goTo('contact')} className="inline-flex items-center gap-2 bg-white text-black hover:bg-white/90 px-7 py-3 rounded-full text-base font-medium transition-all font-excon">
                <span>Start a project</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

function ZMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
      <path d="M6 6 L26 6 L6 26 L26 26" stroke="white" strokeWidth="1.5" />
    </svg>
  )
}