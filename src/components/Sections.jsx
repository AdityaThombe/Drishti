import { useEffect, useRef, useState } from 'react'
import { img, reducedMotion, scrollToId, useSeen, useTilt } from '../hooks'
import { sections } from './Nav'

// Adds `className` to the element once it meets the observer options (fires once)
function useStage(ref, className, options) {
  const key = JSON.stringify(options)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      el.classList.add(className)
      io.disconnect()
    }, JSON.parse(key))
    io.observe(el)
    return () => io.disconnect()
  }, [ref, className, key])
}

// "Covers the screen": the section's top edge has passed the top 20% of the viewport
const COVERS_SCREEN = { rootMargin: '0px 0px -80% 0px' }

export function About() {
  const sectionRef = useRef(null)
  const cardRef = useRef(null)
  useStage(sectionRef, 'bg-in', { threshold: 0.1 }) // background wipes up as it enters
  useStage(sectionRef, 'is-in', COVERS_SCREEN) // copy + art once it fills the screen
  useTilt(cardRef, 12)
  return (
    <section id="about" className="section about" ref={sectionRef}>
      <div className="about__bg" aria-hidden="true" />
      <div className="about__grid">
        <div className="about__copy">
          <p className="kicker">The Quest</p>
          <h2 className="heading"><span className="shimmer">About the Hackathon</span></h2>
          <p>
            INNOV8 TMRRW is a national-level hackathon designed to bring together innovators, developers, and
            problem-solvers to build technology-driven solutions for real-world challenges.
          </p>
          <p>
            Guided by the theme <em>“Build. Beyond. Infinity.”</em>, the event encourages participants to think
            beyond conventional limits and transform ideas into impactful innovations.
          </p>
        </div>
        <div className="about__art">
          <div className="tilt" ref={cardRef}>
            <img className="about__aladin float" src={img('aladin.png')} alt="Aladdin and Jasmine on the magic carpet" />
          </div>
        </div>
      </div>
    </section>
  )
}

function CountUp({ value, run }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!run) return
    if (reducedMotion()) return setN(value)
    let raf
    const start = performance.now()
    const tick = (t) => {
      const p = Math.min(1, (t - start) / 1800)
      setN(Math.round(value * (1 - Math.pow(1 - p, 4))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, value])
  return <>₹{n.toLocaleString('en-IN')}</>
}

function Prize({ label, amount, variant, delay }) {
  const ref = useRef(null)
  const seen = useSeen(ref)
  useTilt(ref, 14)
  return (
    <div className={`prize prize--${variant}`} ref={ref} data-reveal style={{ '--delay': delay }}>
      <p className="prize__label">{label}</p>
      <p className="prize__amount"><CountUp value={amount} run={seen} /></p>
      <img className="prize__carpet" src={img('carpet.png')} alt="" />
    </div>
  )
}

// Abu hangs from the top of the screen only while Prizes covers it:
// drops in once the section's top passes 20% of the screen, climbs out as soon as the
// next section starts taking over (section bottom above 75% of the screen)
function useMonkeyDrop(ref) {
  useEffect(() => {
    const el = ref.current
    const section = el?.parentElement
    if (!el || !section) return
    let raf = 0
    const update = () => {
      raf = 0
      const { top, bottom } = section.getBoundingClientRect()
      const vh = window.innerHeight
      el.classList.toggle('is-hanging', top <= vh * 0.2 && bottom >= vh * 0.75)
    }
    const onScroll = () => raf || (raf = requestAnimationFrame(update))
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ref])
}

export function Prizes() {
  const monkeyRef = useRef(null)
  useMonkeyDrop(monkeyRef)
  return (
    <section id="prizes" className="section prizes">
      <img className="prizes__monkey" ref={monkeyRef} src={img('monkey.png')} alt="Abu the monkey" />
      <header className="section__head" data-reveal>
        <p className="kicker">Prize Pool</p>
        <h2 className="heading"><span className="shimmer">The Treasure Awaits</span></h2>
      </header>
      <div className="prizes__row">
        <Prize label="Winner" amount={10000} variant="winner" delay="0s" />
        <Prize label="1st Runner-Up" amount={5000} variant="runner" delay="0.15s" />
      </div>
    </section>
  )
}

const rules = [
  'Each team must consist of 2 to 4 participants.',
  'Teams may be inter-departmental and inter-year.',
  'Pre-built projects are strictly prohibited.',
  'All development activity will be monitored throughout the hackathon.',
  'Participants must adhere to ethical coding practices and fair-play standards.',
]

const faqs = [
  ['Who can participate in INNOV8 TMRRW?', 'The hackathon is open to all eligible students who meet the team composition criteria.'],
  ['Can we participate with an existing idea?', 'You can bring an idea, but pre-built projects are strictly prohibited — all development must happen during the hackathon.'],
  ['Is cross-department or cross-year participation allowed?', 'Yes. Teams may be inter-departmental and inter-year.'],
  ['Will mentorship be provided during the event?', 'Yes. Mentorship Day includes sessions by college faculty with guidance on technical approach and feasibility.'],
]

export function RulesFaq() {
  const [open, setOpen] = useState(0)
  return (
    <section id="rules" className="section rules">
      <div className="rules__grid">
        <div className="rules__col" data-reveal>
          <p className="kicker">Important</p>
          <h2 className="heading heading--sm">Rules &amp; Guidelines</h2>
          <ol className="rules__list">
            {rules.map((r, i) => (
              <li key={r} data-reveal style={{ '--delay': `${0.1 + i * 0.08}s` }}>
                <span className="rules__num">{i + 1}</span>
                {r}
              </li>
            ))}
          </ol>
        </div>

        <span className="rules__divider" data-reveal />

        <div id="faq" className="rules__col" data-reveal style={{ '--delay': '0.15s' }}>
          <p className="kicker">Curious?</p>
          <h2 className="heading heading--sm heading--gold">Frequently Asked Questions</h2>
          <div className="faq">
            {faqs.map(([q, a], i) => {
              const isOpen = open === i
              return (
                <div key={q} className={`faq__item ${isOpen ? 'is-open' : ''}`}>
                  <button className="faq__q" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}>
                    <span>{q}</span>
                    <span className="faq__icon" aria-hidden="true">
                      <img className="faq__plus" src={img('plus.png')} alt="" />
                      <img className="faq__minus" src={img('minus.png')} alt="" />
                    </span>
                  </button>
                  <div className="faq__a"><p>{a}</p></div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export function Partners() {
  return (
    <section id="partners" className="section partners">
      <header className="section__head" data-reveal>
        <p className="kicker">Backed by</p>
        <h2 className="heading heading--gold">Sponsorship &amp; Partnership</h2>
      </header>
      <div className="partners__row">
        <div className="partner" data-reveal>
          <p className="partner__role">Community Partner</p>
          <div className="partner__logo partner__logo--circle"><img src={img('fof.png')} alt="FOF Mumbai" /></div>
        </div>
        <div className="partner" data-reveal style={{ '--delay': '0.15s' }}>
          <p className="partner__role">Domain Partner</p>
          <div className="partner__logo"><img src={img('xyz-white.png')} alt=".xyz" /></div>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  const quick = sections.filter(([, id]) => ['home', 'about', 'journey', 'faq'].includes(id))
  return (
    <footer id="contact" className="footer">
      <img className="footer__castle" src={img('bg-castle.png')} alt="" />
      <div className="footer__grid">
        <div className="footer__brand" data-reveal>
          <p className="footer__logo"><span className="shimmer">Drishti</span></p>
          <p>A Thousand Nights. One Design Challenge.</p>
          <p>An inter-collegiate UI/UX designathon where creativity meets imagination.</p>
        </div>
        <div data-reveal style={{ '--delay': '0.1s' }}>
          <p className="footer__title">Quick Links</p>
          <ul className="footer__links">
            {quick.map(([label, id]) => (
              <li key={id}>
                <button onClick={() => scrollToId(id)}>
                  <img src={img('yoga.png')} alt="" />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div data-reveal style={{ '--delay': '0.2s' }}>
          <p className="footer__title">Social Media</p>
          <ul className="footer__links footer__links--plain">
            <li><a href="#" target="_blank" rel="noreferrer">Instagram</a></li>
            <li><a href="#" target="_blank" rel="noreferrer">LinkedIn</a></li>
          </ul>
        </div>
      </div>

      <div className="footer__people" data-reveal>
        <div className="footer__bubble">
          <img src={img('cloud.png')} alt="" />
          <span>So… did you register yet?</span>
        </div>
        <div className="footer__boy"><img src={img('girl.png')} alt="" /></div>
        <div className="footer__girl"><img src={img('girl.png')} alt="" /></div>
      </div>

      <p className="footer__copy">© 2026 ENIGMA. All rights reserved.</p>
    </footer>
  )
}
