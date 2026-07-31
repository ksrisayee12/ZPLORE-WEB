'use client'
import { useEffect, useRef } from 'react'

export default function MagneticButton({ children, onClick, className = '' }) {
  const btnRef = useRef(null)

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
    return () => {
      window.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <button ref={btnRef} onClick={onClick} className={className}>
      {children}
    </button>
  )
}
