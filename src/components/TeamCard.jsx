import { useRef } from 'react'
import { img, useTilt } from '../hooks'

// Photo placement inside the 250 × 329 card, from Figma
const PHOTOS = {
  rohit: { src: 'rohit.webp', style: { left: -5.28, top: 7.51, width: 249.42, height: 311.77 } },
  bhavika: { src: 'bhavika.webp', style: { left: -9.27, top: -3.68, width: 255.97, height: 319.97 } },
}

export default function TeamCard({ person, delay = 0 }) {
  const ref = useRef(null)
  useTilt(ref, 10)
  const photo = PHOTOS[person.photo]
  return (
    <article className="tcard" ref={ref} data-reveal style={{ '--delay': `${delay}s` }}>
      <div className="tcard__bg"><img src={img('team-bg.webp')} alt="" /></div>
      <div className="tcard__genie" aria-hidden="true" />
      {photo && <img className="tcard__photo" src={img(photo.src)} alt={person.name} style={photo.style} />}
      <div className="tcard__shade" />
      <h3 className="tcard__name">{person.name}</h3>
      <p className="tcard__role">{person.role}</p>
      <div className="tcard__links">
        <a href={person.github} target="_blank" rel="noreferrer" aria-label={`${person.name} on GitHub`}>
          <img src={img('github.webp')} alt="" />
        </a>
        <a href={person.linkedin} target="_blank" rel="noreferrer" aria-label={`${person.name} on LinkedIn`}>
          <img src={img('linkedin.webp')} alt="" />
        </a>
      </div>
    </article>
  )
}
