import { useEffect, useRef } from 'react'
import { img, reducedMotion, scrollToId, useCountdown } from '../hooks'
import { ExploreButton, RegisterButton } from './Buttons'

// Offline designathon (finale) start — from the Unstop brief. Set the registration link here.
export const EVENT_START = new Date('2026-10-09T10:00:00+05:30')
export const REGISTER_URL = '#'

// Scene layers on the 1440×1024 Figma frame. m = mouse parallax strength
const layers = [
  { src: 'hero-bg.webp', left: -187, top: -47, width: 1903, m: 6 },
  { src: 'moon.webp', left: 700, top: 303, width: 523, m: 14, cls: 'layer--moon' },
  { src: 'castle.webp', left: -288, top: 249, width: 1751, m: 22 },
  { src: 'clouds.webp', left: -6, top: 0, width: 1588, height: 894, m: 30, cls: 'layer--clouds' },
  { src: 'land.webp', left: -94, top: -31, width: 2003, height: 1128, m: 40, cls: 'layer--land' },
]

const pad = (n) => String(n).padStart(2, '0')

function Countdown() {
  const { done, days, hours, minutes, seconds } = useCountdown(EVENT_START)
  if (done) return <div className="countdown">The quest has begun ✦</div>
  const units = [[days, 'D'], [hours, 'H'], [minutes, 'M'], [seconds, 'S']]
  return (
    <div className="countdown" role="timer" aria-label="Time until the event">
      <span className="countdown__lead">The event begins in</span>
      {units.map(([v, u]) => (
        <span className="countdown__unit" key={u}>
          <span className="countdown__num" key={v}>{u === 'D' ? v : pad(v)}</span>
          <span className="countdown__suffix">{u}</span>
        </span>
      ))}
    </div>
  )
}

export default function Hero() {
  const heroRef = useRef(null)
  const sceneRef = useRef(null)

  useEffect(() => {
    const hero = heroRef.current
    const scene = sceneRef.current
    const fit = () => {
      const { width, height } = hero.getBoundingClientRect()
      scene.style.setProperty('--cover', Math.max(width / 1440, height / 1024))
    }
    const ro = new ResizeObserver(fit)
    ro.observe(hero)
    if (reducedMotion()) return () => ro.disconnect()

    const onMove = (e) => {
      hero.style.setProperty('--mx', (e.clientX / window.innerWidth - 0.5).toFixed(3))
      hero.style.setProperty('--my', (e.clientY / window.innerHeight - 0.5).toFixed(3))
    }
    hero.addEventListener('pointermove', onMove)
    return () => {
      ro.disconnect()
      hero.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <section id="home" className="hero" ref={heroRef}>
      <div className="hero__scene" ref={sceneRef} aria-hidden="true">
        {layers.map((l) => (
          <div key={l.src} className="layer" style={{ left: l.left, top: l.top, width: l.width, height: l.height ?? (l.width * 941) / 1672, '--m': l.m }}>
            <img src={img(l.src)} alt="" className={l.cls} />
          </div>
        ))}
      </div>
      <div className="hero__shade" />

      <div className="hero__content">
        <p className="hero__eyebrow">CESA × FOF PRESENTS</p>
        <h1 className="hero__title">
          <span className="shimmer">Drishti</span>
        </h1>
        <p className="hero__tagline">A Thousand Nights. One Design Challenge.</p>
        <p className="hero__sub">
          An inter-collegiate UI/UX designathon <br />where ideas meet imagination…
        </p>
        <p className="hero__when">Offline Designathon · 9 Oct 2026 · VIT, Mumbai</p>
        <Countdown />
        <div className="hero__cta">
          <RegisterButton href={REGISTER_URL} />
          <ExploreButton onClick={() => scrollToId('about')} />
        </div>
      </div>

    </section>
  )
}
