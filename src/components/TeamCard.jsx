import { useRef } from 'react'
import { img, useTilt } from '../hooks'

export default function TeamCard({ person, delay = 0 }) {
  const ref = useRef(null)
  useTilt(ref, 10)
  const { name, role, photo, github, linkedin } = person
  return (
    <article className="tcard" ref={ref} data-reveal style={{ '--delay': `${delay}s` }}>
      <div className="tcard__bg"><img src={img('team-bg.webp')} alt="" /></div>
      <div className="tcard__genie" aria-hidden="true" />
      {photo && <img className="tcard__photo" src={img(`team/${photo}.webp`)} alt={name} loading="lazy" />}
      <div className="tcard__shade" />
      {/* long names shrink to fit the card */}
      <h3 className="tcard__name" style={{ '--len': name.length }}>{name}</h3>
      <p className="tcard__role">{role}</p>
      <div className="tcard__links">
        {github && (
          <a href={github} target="_blank" rel="noreferrer" aria-label={`${name} on GitHub`}>
            <img src={img('github.webp')} alt="" />
          </a>
        )}
        {linkedin && (
          <a href={linkedin} target="_blank" rel="noreferrer" aria-label={`${name} on LinkedIn`}>
            <img src={img('linkedin.webp')} alt="" />
          </a>
        )}
      </div>
    </article>
  )
}
