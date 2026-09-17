import { useEffect, useState } from 'react'
import { img, scrollToId } from '../hooks'

export const sections = [
  ['Home', 'home'],
  ['About', 'about'],
  ['Event Flow', 'journey'],
  ['Prizes', 'prizes'],
  ['Rules', 'rules'],
  ['FAQ', 'faq'],
  ['Partners', 'partners'],
  ['Contact', 'contact'],
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      const max = document.documentElement.scrollHeight - window.innerHeight
      document.documentElement.style.setProperty('--progress', max > 0 ? window.scrollY / max : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach(([, id]) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => {
      window.removeEventListener('scroll', onScroll)
      io.disconnect()
    }
  }, [])

  const go = (id) => {
    setOpen(false)
    scrollToId(id)
  }

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''} ${open ? 'nav--open' : ''}`}>
      <div className="nav__bar">
        <button className="nav__logo" onClick={() => go('home')} aria-label="CESA home">
          <img src={img('logo.png')} alt="CESA" />
        </button>
        <nav className="nav__links">
          {sections.map(([label, id]) => (
            <button key={id} className={active === id ? 'is-active' : ''} onClick={() => go(id)}>
              {label}
            </button>
          ))}
        </nav>
        <button className="nav__burger" onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
          <span /><span /><span />
        </button>
        <span className="nav__progress" />
      </div>
    </header>
  )
}
