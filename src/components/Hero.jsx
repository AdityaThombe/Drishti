import { useEffect, useRef } from 'react'
import { img, reducedMotion, scrollToId, useCountdown } from '../hooks'
import { ExploreButton, RegisterButton } from './Buttons'

// ⚠️ Set the real event start + registration link here
export const EVENT_START = new Date('2027-02-10T19:30:00+05:30')
export const REGISTER_URL = '#'

// Scene layers on the 1440×1024 Figma frame. k = scroll parallax, m = mouse parallax
const layers = [
  { src: 'hero-bg.png', left: -187, top: -47, width: 1903, k: 0.5, m: 6 },
  { src: 'moon.png', left: 700, top: 303, width: 523, k: 0.42, m: 14, cls: 'layer--moon' },
  { src: 'castle.png', left: -288, top: 249, width: 1751, k: 0.25, m: 22 },
  { src: 'clouds.png', left: -6, top: 0, width: 1588, height: 894, k: 0.35, m: 30, cls: 'layer--clouds' },
  { src: 'land.png', left: -94, top: -31, width: 2003, height: 1128, k: 0.08, m: 40, cls: 'layer--land' },
]

const pad = (n) => String(n).padStart(2, '0')

function Countdown() {
  const { done, days, hours, minutes, seconds } = useCountdown(EVENT_START)
  if (done) return <div className="countdown intro intro--fade" style={{ '--d': '1.1s' }}>The quest has begun ✦</div>
  const units = [[days, 'D'], [hours, 'H'], [minutes, 'M'], [seconds, 'S']]
  return (
    <div className="countdown intro intro--fade" style={{ '--d': '1.1s' }} role="timer" aria-label="Time until the event">
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

    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const y = window.scrollY
        if (y < hero.offsetHeight * 1.2) hero.style.setProperty('--sy', y)
      })
    }
    const onMove = (e) => {
      hero.style.setProperty('--mx', (e.clientX / window.innerWidth - 0.5).toFixed(3))
      hero.style.setProperty('--my', (e.clientY / window.innerHeight - 0.5).toFixed(3))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    hero.addEventListener('pointermove', onMove)
    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', onScroll)
      hero.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <section id="home" className="hero" ref={heroRef}>
      <div className="hero__scene" ref={sceneRef} aria-hidden="true">
        {layers.map((l) => (
          <div key={l.src} className="layer" style={{ left: l.left, top: l.top, width: l.width, height: l.height ?? (l.width * 941) / 1672, '--k': l.k, '--m': l.m }}>
            <img src={img(l.src)} alt="" className={l.cls} />
          </div>
        ))}
      </div>
      <div className="hero__shade" />

      <div className="hero__content">
        <p className="hero__eyebrow intro intro--fade" style={{ '--d': '0.5s' }}>CESA × FOF PRESENTS</p>
        <h1 className="hero__title intro intro--rise" style={{ '--d': '0.2s' }}>
          <span className="shimmer">Drishti</span>
        </h1>
        <p className="hero__tagline intro intro--fade" style={{ '--d': '0.8s' }}>A Thousand Nights. One Design Challenge.</p>
        <p className="hero__sub intro intro--fade" style={{ '--d': '0.95s' }}>
          An inter-collegiate UI/UX designathon <br />where ideas meet imagination…
        </p>
        <Countdown />
        <div className="hero__cta intro intro--fade" style={{ '--d': '1.25s' }}>
          <RegisterButton href={REGISTER_URL} />
          <ExploreButton onClick={() => scrollToId('about')} />
        </div>
      </div>

    </section>
  )
}
