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
          <h2 className="heading"><span className="shimmer">About Drishti</span></h2>
          <p>
            <em>DRISHTI</em> is a student-led UI/UX Designathon organized by CESA, Vidyalankar Institute of Technology
            (VIT), Mumbai, in collaboration with Friends of Figma Mumbai and .xyz, focused on user-centric design,
            creativity, UX thinking, visual design and rapid prototyping.
          </p>
          <p>
            Teams of two are shortlisted on their resume and portfolio, then face a fresh problem statement in a
            3-hour offline design sprint with hands-on mentoring and an industry session by Friends of Figma. The
            Top 10 teams pitch their solutions to a jury of senior product designers.
          </p>
        </div>
        <div className="about__art">
          <div className="tilt" ref={cardRef}>
            <img className="about__aladin float" src={img('aladin.webp')} alt="Aladdin and Jasmine on the magic carpet" />
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
      <img className="prize__carpet" src={img('carpet.webp')} alt="" />
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
      <img className="prizes__monkey" ref={monkeyRef} src={img('monkey.webp')} alt="Abu the monkey" />
      <header className="section__head" data-reveal>
        <p className="kicker">Prize Pool</p>
        <h2 className="heading"><span className="shimmer">The Treasure Awaits</span></h2>
      </header>
      <div className="prizes__row">
        <Prize label="Winner" amount={10000} variant="winner" delay="0s" />
        <Prize label="Runner-Up" amount={5000} variant="runner" delay="0.15s" />
      </div>
      <p className="prizes__extra" data-reveal>+ Figma / Friends of Figma merchandise for the winners · Certificates for all participants</p>
    </section>
  )
}

const rules = [
  'Each team must consist of exactly 2 participants; each participant can be part of only one team.',
  "Round 1 is based on both members' Resume and Portfolio / Case Study. Shortlisted teams qualify for the offline Designathon.",
  'The problem statement is revealed at the beginning of the offline round, and teams get 3 hours to develop their design solution.',
  'Each team must submit a Figma file / link and a working prototype link within the given deadline.',
  'All submissions must be original work by the team. Plagiarism, copying or pre-existing work may result in disqualification.',
  "AI tools may support ideation and research, but the core design solution must be the team's own work.",
  'The Top 10 teams qualify for the final pitch: 5 minutes of presentation + 2 minutes of Q&A.',
  'Participants must bring their own laptops and chargers. The decision of the judging panel is final and binding.',
]

const faqs = [
  ['How many members can be in a team?', 'Exactly 2. Individual participation is not allowed.'],
  ['What is required for Round 1?', 'The Resume and Portfolio / Case Study of both team members. Teams are shortlisted on their previous work, design thinking, creativity and overall potential.'],
  ['When will the problem statement be released?', 'At the beginning of the offline designathon at VIT, Mumbai.'],
  ['How long is the design sprint?', '3 hours to understand the problem, ideate, design and prototype your solution.'],
  ['What do I need to submit?', 'A Figma file and a working prototype link, before the submission deadline.'],
  ['How many teams reach the final pitch?', 'The Top 10 teams — 5 minutes of presentation followed by 2 minutes of jury Q&A.'],
  ['Do I need my own laptop?', 'Yes. Bring your laptop, charger and a Figma account.'],
  ['Who will judge the event?', 'Senior / Lead Product Designers from Friends of Figma Mumbai, as per the collaboration.'],
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
                      <img className="faq__plus" src={img('plus.webp')} alt="" />
                      <img className="faq__minus" src={img('minus.webp')} alt="" />
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
      <header className="section__head">
        <p className="kicker">Backed by</p>
        <h2 className="heading heading--gold">Sponsorship &amp; Partnership</h2>
      </header>
      <div className="partners__row">
        <div className="partner">
          <p className="partner__role">Community Partner</p>
          <div className="partner__logo partner__logo--circle"><img src={img('fof.webp')} alt="FOF Mumbai" /></div>
        </div>
        <div className="partner">
          <p className="partner__role">Domain Partner</p>
          <div className="partner__logo"><img src={img('xyz-white.webp')} alt=".xyz" /></div>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  const quick = sections.filter(([, id]) => ['home', 'about', 'journey', 'faq'].includes(id))
  return (
    <footer id="contact" className="footer">
      <img className="footer__castle" src={img('footer-castle.webp')} alt="" />
      <div className="footer__grid">
        <div className="footer__brand" data-reveal>
          <p className="footer__logo"><span className="shimmer">Drishti</span></p>
          <p>A Thousand Nights. One Design Challenge.</p>
          <p>A UI/UX designathon by CESA VIT with Friends of Figma Mumbai.</p>
        </div>
        <div data-reveal style={{ '--delay': '0.1s' }}>
          <p className="footer__title">Quick Links</p>
          <ul className="footer__links">
            {quick.map(([label, id]) => (
              <li key={id}>
                <button onClick={() => scrollToId(id)}>
                  <img src={img('yoga.webp')} alt="" />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div data-reveal style={{ '--delay': '0.2s' }}>
          <p className="footer__title">Social Media</p>
          <ul className="footer__links footer__links--plain">
            <li><a href="https://www.instagram.com/cesa.vit/" target="_blank" rel="noreferrer">Instagram</a></li>
            <li><a href="https://www.linkedin.com/company/cesa-vit/posts/?feedView=all" target="_blank" rel="noreferrer">LinkedIn</a></li>
          </ul>
        </div>
      </div>

      <div className="footer__people" data-reveal>
        <div className="footer__bubble">
          <img src={img('cloud.webp')} alt="" />
          <span>So… did you register yet?</span>
        </div>
        <div className="footer__boy"><img src={img('girl.webp')} alt="" /></div>
        <div className="footer__girl"><img src={img('girl.webp')} alt="" /></div>
      </div>

      <p className="footer__copy">© 2026 CESA, VIT Mumbai. All rights reserved.</p>
    </footer>
  )
}
