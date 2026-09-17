import { useEffect, useRef } from 'react'
import { reducedMotion } from '../hooks'

// Golden dust drifting upward across the whole page
export default function Particles() {
  const ref = useRef(null)

  useEffect(() => {
    if (reducedMotion()) return
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let w, h, dpr, parts, raf

    const spawn = (anywhere) => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : h + 10,
      r: Math.random() * 1.6 + 0.4,
      vy: Math.random() * 0.25 + 0.08,
      sway: Math.random() * 0.6 + 0.2,
      phase: Math.random() * Math.PI * 2,
      twinkle: Math.random() * 0.02 + 0.005,
      hue: Math.random() < 0.7 ? '246, 205, 140' : '255, 255, 255',
    })

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(70, Math.round((w * h) / 22000))
      parts = Array.from({ length: count }, () => spawn(true))
    }

    const tick = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of parts) {
        p.phase += p.twinkle
        p.y -= p.vy
        const x = p.x + Math.sin(p.phase * 0.7) * p.sway * 6
        if (p.y < -10) Object.assign(p, spawn(false))
        const a = 0.25 + Math.abs(Math.sin(p.phase)) * 0.6
        ctx.beginPath()
        ctx.fillStyle = `rgba(${p.hue}, ${a})`
        ctx.shadowColor = `rgba(${p.hue}, ${a})`
        ctx.shadowBlur = 8
        ctx.arc(x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(tick)
    }

    const onVisibility = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden) raf = requestAnimationFrame(tick)
    }

    resize()
    raf = requestAnimationFrame(tick)
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas ref={ref} className="particles" aria-hidden="true" />
}
