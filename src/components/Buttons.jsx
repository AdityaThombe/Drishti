import { img } from '../hooks'

// Crop helper: positions an oversized image inside a clipped box (values from Figma)
const Crop = ({ src, box, w, h, l = '0%', t = '0%', className = '' }) => (
  <span className={`fbtn__crop ${className}`} style={box}>
    <img src={img(src)} alt="" style={{ width: w, height: h, left: l, top: t }} />
  </span>
)

export function RegisterButton({ href = '#' }) {
  return (
    <a className="fbtn fbtn--register" href={href}>
      <span className="fbtn__fill" />
      <Crop className="fbtn__castle" src="bg-castle.png" box={{ left: 57, top: -8.5, width: 187, height: 106.5 }} w="374.37%" h="370.05%" l="-51.2%" t="-235.03%" />
      <Crop className="fbtn__lamp" src="lamp.png" box={{ left: 149, top: 6.75, width: 86.3, height: 37.3 }} w="168.67%" h="220.4%" l="-31.02%" t="-42.02%" />
      <span className="fbtn__panel" />
      <span className="fbtn__labels" style={{ left: 20, width: 168 }}>
        <span className="fbtn__label">Register Now</span>
        <span className="fbtn__label fbtn__label--alt">Click now</span>
      </span>
    </a>
  )
}

export function ExploreButton({ onClick }) {
  return (
    <button type="button" className="fbtn fbtn--explore" onClick={onClick}>
      <span className="fbtn__shine">
        <img src={img('shine.png')} alt="" />
      </span>
      <span className="fbtn__panel" />
      <span className="fbtn__labels" style={{ left: 35, width: 180 }}>
        <span className="fbtn__label">Explore</span>
        <span className="fbtn__label fbtn__label--alt">Dive in</span>
      </span>
    </button>
  )
}
