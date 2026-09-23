import TeamCard from '../components/TeamCard'
import { Footer } from '../components/Sections'
import { heads, keepers } from '../team'

// Team page — displays all CESA team members grouped by role
export default function Team() {
  return (
    <main className="team">
      {/* Section 1: Core team (Keepers) with centered grid layout */}
      <section className="section team__section team__section--first">
        <header className="team__head">
          <h1 className="heading team__title intro intro--rise" style={{ '--d': '0.2s' }}>
            <span className="shimmer">The Keepers</span>
          </h1>
          <p className="team__sub intro intro--fade" style={{ '--d': '0.7s' }}>The people behind the journey</p>
        </header>
        {/* Render each keeper with a staggered entrance delay */}
        <div className="team__grid team__grid--center">
          {keepers.map((p, i) => <TeamCard key={p.name} person={p} delay={0.1 * i} />)}
        </div>
      </section>

      {/* Section 2: Department heads with left-aligned title */}
      <section className="section team__section">
        <h2 className="heading team__title team__title--left" data-reveal>
          <span className="shimmer">The Heads</span>
        </h2>
        {/* Stagger delay resets every 4 cards for a row-based effect */}
        <div className="team__grid">
          {heads.map((p, i) => <TeamCard key={p.name} person={p} delay={0.08 * (i % 4)} />)}
        </div>
      </section>
      <Footer />
    </main>
  )
}
