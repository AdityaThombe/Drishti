import { useEffect, useRef } from 'react'
import { clamp, img } from '../hooks'

// Path + points exported from the Figma "Vector lines" node (viewBox 1023 × 1442.2)
const PATH =
  'M123.554 86.6C47.2206 176.933 -59.646 385.9 123.554 499.1C306.754 612.3 230.221 787.6 169.054 861.1C118.887 1044.6 132.754 1339.3 589.554 1050.1C1046.35 760.9 1006.22 1149.93 936.4 1355.6'

// Stage = Figma canvas region x 0–1440, y 2300–3800. All coordinates below are Figma px.
const X = (x) => `${(x / 1440) * 100}%`
const Y = (y) => `${((y - 2300) / 1500) * 100}%`
const W = (w) => `${(w / 1440) * 100}%`

const steps = [
  {
    dot: [127.4, 86.6], date: '10th Feb', dateAt: [148, 2365], at: [467, 2350], w: 573, bodyW: 432,
    title: 'Problem Statement (PS)',
    points: ['PS released at 7:30 p.m. (3–4 per domain)', 'Registration opens', 'PS allotted on a first-come, first-served basis'],
  },
  {
    dot: [127.4, 498.6], date: '11th Feb', dateAt: [156, 2810], at: [518, 2672], w: 540, bodyW: 400,
    title: 'Submission of PS',
    points: ['Abstract submission by 7:30 p.m. (as per given format)', 'GitHub repo submission mandatory for all members'],
  },
  {
    dot: [176.4, 861.6], date: '12th Feb', dateAt: [501, 3163], at: [39, 3116], w: 369, bodyW: 260, lineW: 232,
    title: 'Shortlisting Announcement',
    points: ['Shortlisted teams announced around 5 p.m.', 'Constraints and guidelines shared'],
  },
  {
    dot: [244.4, 1159.6], date: '13th Feb', dateAt: [474, 3393], at: [148, 3536], w: 573, bodyW: 432,
    title: 'Final Pitching & Evaluation (Offline)',
    points: ['On-campus final presentations', 'Jury evaluation', 'Winner declaration and closing ceremony'],
  },
  {
    dot: [598.4, 1053.6], date: '14th Feb', dateAt: [729, 3292], at: [753, 3453], w: 400, bodyW: 360,
    title: 'Mentorship Day',
    points: ['Mentoring sessions by college faculty', 'Guidance on technical approach and feasibility'],
  },
]
const FINAL_DOT = [936.4, 1355.6]

export default function Journey() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const listRef = useRef(null)
  const pathRef = useRef(null)
  const glowRef = useRef(null)
  const orbRef = useRef(null)

  useEffect(() => {
    const path = pathRef.current
    const glow = glowRef.current
    const orb = orbRef.current
    const len = path.getTotalLength()
    const dots = [...steps.map((s) => s.dot), FINAL_DOT]

    // where along the path each point sits (0–1)
    const fractions = dots.map(([x, y]) => {
      let best = 0
      let bestD = Infinity
      for (let i = 0; i <= 600; i++) {
        const p = path.getPointAtLength((len * i) / 600)
        const d = (p.x - x) ** 2 + (p.y - y) ** 2
        if (d < bestD) (bestD = d), (best = i / 600)
      }
      return best
    })

    for (const p of [path, glow]) p.style.strokeDasharray = `${len}`
    const stageEls = sectionRef.current.querySelectorAll('[data-step]')
    const listEls = sectionRef.current.querySelectorAll('[data-lstep]')

    const progressOf = (el) => {
      const r = el.getBoundingClientRect()
      if (!r.height) return 0
      return clamp((window.innerHeight * 0.62 - r.top) / r.height, 0, 1)
    }

    let raf = 0
    const update = () => {
      raf = 0
      // Stage: draw the path with scroll
      const p = progressOf(stageRef.current)
      const offset = len * (1 - p)
      path.style.strokeDashoffset = offset
      glow.style.strokeDashoffset = offset
      const pt = path.getPointAtLength(len * p)
      orb.setAttribute('transform', `translate(${pt.x} ${pt.y})`)
      orb.style.opacity = p > 0.005 && p < 0.995 ? 1 : 0
      stageEls.forEach((el) => el.classList.toggle('on', p >= fractions[+el.dataset.step] - 0.012))

      // Mobile list: straight line fill
      const lp = progressOf(listRef.current)
      listRef.current.style.setProperty('--fill', lp)
      listEls.forEach((el) => el.classList.toggle('on', lp >= (+el.dataset.lstep / dots.length) * 0.98))
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
  }, [])

  return (
    <section id="journey" className="section journey" ref={sectionRef}>
      <header className="section__head" data-reveal>
        <p className="kicker">Event Flow</p>
        <h2 className="heading"><span className="shimmer">The Journey of the Hackathon</span></h2>
        <p className="section__lede">From kickoff to final showcase — here’s how the hackathon unfolds.</p>
      </header>

      {/* Desktop: scroll-drawn path */}
      <div className="journey__stage" ref={stageRef}>
        <svg
          className="journey__svg"
          viewBox="0 0 1023 1442.2"
          style={{ left: X(255.6), top: Y(2311.4), width: W(1023), height: Y(2300 + 1442.2) }}
          aria-hidden="true"
        >
          <defs>
            <filter id="pathBlur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8.45" />
            </filter>
            <radialGradient id="orbGlow">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="35%" stopColor="#ffe3b0" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#f69135" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path d={PATH} className="journey__track" />
          <path d={PATH} ref={glowRef} className="journey__glow" filter="url(#pathBlur)" />
          <path d={PATH} ref={pathRef} className="journey__line" />
          {[...steps.map((s) => s.dot), FINAL_DOT].map(([cx, cy], i) => (
            <g key={i} className="journey__dot" data-step={i} transform={`translate(${cx} ${cy})`}>
              <circle r="25" className="journey__core" />
            </g>
          ))}
          <g ref={orbRef} className="journey__orb">
            <circle r="42" fill="url(#orbGlow)" />
            <circle r="9" fill="#fff" />
          </g>
        </svg>

        {steps.map((s, i) => (
          <div key={s.date}>
            <p className="ms__date" data-step={i} style={{ left: X(s.dateAt[0]), top: Y(s.dateAt[1]) }}>{s.date}</p>
            <div className="ms" data-step={i} style={{ left: X(s.at[0]), top: Y(s.at[1]), width: W(s.w) }}>
              <h3 className="ms__title">{s.title}</h3>
              <span className="ms__line" style={{ width: `${((s.lineW ?? 400) / s.w) * 100}%` }} />
              <ul className="ms__body" style={{ width: `${(s.bodyW / s.w) * 100}%` }}>
                {s.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
          </div>
        ))}
        <p className="ms__final" data-step={steps.length} style={{ left: X(1153), top: Y(3707) }}>Final</p>

        <div className="journey__genie" data-reveal style={{ left: X(1085), top: Y(2440), width: W(420) }}>
          <img src={img('jenie.png')} alt="Genie" />
        </div>
      </div>

      {/* Mobile: vertical timeline */}
      <ol className="journey__list" ref={listRef}>
        {steps.map((s, i) => (
          <li key={s.date} data-lstep={i}>
            <span className="journey__list-dot" />
            <p className="ms__date">{s.date}</p>
            <h3 className="ms__title">{s.title}</h3>
            <ul className="ms__body">{s.points.map((p) => <li key={p}>{p}</li>)}</ul>
          </li>
        ))}
        <li data-lstep={steps.length}>
          <span className="journey__list-dot" />
          <p className="ms__final">Final</p>
        </li>
      </ol>
    </section>
  )
}
