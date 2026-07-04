'use client'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 mt-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <div className="display text-6xl md:text-8xl">Zplore</div>
            <p className="text-white/50 text-sm mt-4 max-w-xs">A deep-tech studio engineering the next decade of intelligent systems.</p>
          </div>
          <FooterCol title="Studio" items={[['Projects', '#projects'], ['Services', '#services'], ['Enterprise', '#enterprise']]} />
          <FooterCol title="Company" items={[['About', '#about'], ['Community', '/community'], ['Contact', '#contact']]} />
          <FooterCol title="Connect" items={[['Twitter', '#'], ['LinkedIn', '#'], ['GitHub', '#']]} />
        </div>
        <div className="flex items-center justify-between border-t border-white/5 mt-16 pt-6 text-xs text-white/40">
          <div>© {new Date().getFullYear()} Zplore Labs. All rights reserved.</div>
          <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Systems nominal</div>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, items }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">{title}</div>
      <ul className="space-y-2">
        {items.map(([label, href]) => (
          <li key={label}><Link href={href} className="text-sm text-white/80 hover:text-white">{label}</Link></li>
        ))}
      </ul>
    </div>
  )
}