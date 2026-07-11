'use client'
import { useEffect, useRef, useState } from 'react'

export default function Contact() {
  const ref = useRef(null)
  const lightRef = useRef(null)
  const btnRef = useRef(null)
  const [focusName, setFocusName] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const move = (e) => {
      if (!lightRef.current) return
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100
      lightRef.current.style.background = `radial-gradient(600px circle at ${x}% ${y}%, rgba(255,255,255,0.08), transparent 60%)`
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  // magnetic submit
  useEffect(() => {
    const el = btnRef.current
    if (!el) return
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      const dist = Math.hypot(dx, dy)
      if (dist < 180) {
        const k = (180 - dist) / 180
        el.style.transform = `translate(${dx * 0.25 * k}px, ${dy * 0.25 * k}px)`
      } else {
        el.style.transform = 'translate(0,0)'
      }
    }
    const onLeave = () => { el.style.transform = 'translate(0,0)' }
    window.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => { window.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave) }
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const body = Object.fromEntries(data.entries())
    try {
      await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    } catch (err) { }
    setSubmitted(true)
  }

  return (
    <section id="contact" ref={ref} className="relative w-full bg-[#050505] py-32 md:py-44 overflow-hidden">
      <div ref={lightRef} className="absolute inset-0 pointer-events-none transition-[background] duration-300" />
      {/* depth field */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.05), transparent 50%)' }} />
      </div>
      <div className="relative mx-auto max-w-[1100px] px-6 md:px-10">
        <h2 className="font-clash-display-medium text-6xl md:text-8xl leading-[0.9] text-balance">Tell us what<br /><span className="serif italic text-white/80">you're building.</span></h2>
        <p className="font-general-sans text-white/55 mt-6 max-w-md">We reply within one business day.</p>

        {submitted ? (
          <div className="mt-16 border border-white/10 p-10">
            <div className="display text-3xl md:text-4xl">Transmission received.</div>
            <p className="font-general-sans text-white/60 mt-3">A senior engineer will be in touch within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-16 grid md:grid-cols-2 gap-x-12 gap-y-10">
            <Field label="Name" name="name" focusName={focusName} setFocusName={setFocusName} required />
            <Field label="Email" name="email" type="email" focusName={focusName} setFocusName={setFocusName} required />
            <div className="md:col-span-2">
              <Field label="Company" name="company" focusName={focusName} setFocusName={setFocusName} />
            </div>
            <div className="md:col-span-2">
              <Field label="Tell us about the project" name="message" textarea focusName={focusName} setFocusName={setFocusName} required />
            </div>
            <div className="md:col-span-2 flex items-center justify-end mt-4">
              <button ref={btnRef} type="submit" className="magnetic group relative inline-flex items-center gap-3 border border-white/30 hover:border-white px-8 py-4 text-sm tracking-wider uppercase transition-colors">
                <span>Send transmission</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
                <span className="pointer-events-none absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors" />
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}

function Field({ label, name, type = 'text', focusName, setFocusName, required, textarea, placeholder }) {
  const active = focusName === name
  const common = {
    name, required,
    placeholder,
    onFocus: () => setFocusName(name),
    onBlur: () => setFocusName(null),
    className: 'peer w-full bg-transparent border-0 outline-none py-3 text-lg text-white placeholder-white/30 caret-white',
  }
  return (
    <label className="block relative">
      <span className="font-boska-bold text-lg md:text-xl text-white/90">{label}</span>
      <div className="relative mt-2">
        {textarea ? (
          <textarea rows={4} {...common} />
        ) : (
          <input type={type} {...common} />
        )}
        <span className="absolute left-0 right-0 bottom-0 h-px bg-white/15" />
        <span className={`absolute left-0 bottom-0 h-px bg-white transition-all duration-500 ${active ? 'w-full' : 'w-0'}`} />
      </div>
    </label>
  )
}