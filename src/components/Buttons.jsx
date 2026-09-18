import { img } from '../hooks'

// Crop helper: positions an oversized image inside a clipped box (values from Figma)
const Crop = ({ src, box, w, h, l = '0%', t = '0%', className = '' }) => (
  <span className={`fbtn__crop ${className}`} style={box}>
    <img src={img(src)} alt="" style={{ width: w, height: h, left: l, top: t }} />
  </span>
)

// Hover (Figma "button"): the carpet flies right → left across the gold, pulling the navy panel behind it
export function RegisterButton({ href = '#' }) {
  return (
    <a className="fbtn fbtn--register" href={href}>
      <span className="fbtn__fill" />
      <Crop className="fbtn__castle" src="bg-castle.png" box={{ left: 57, top: -8.5, width: 187, height: 106.5 }} w="374.37%" h="370.05%" l="-51.2%" t="-235.03%" />
      <span className="fbtn__fly">
        <Crop className="fbtn__carpet" src="lamp.png" box={{ left: 258, top: 11, width: 86.5, height: 37.3 }} w="168.67%" h="220.4%" l="-31.02%" t="-42.02%" />
        <span className="fbtn__panel" />
      </span>
      <span className="fbtn__labels" style={{ left: 32, width: 168 }}>
        <span className="fbtn__label">Register Now</span>
        <span className="fbtn__label fbtn__label--alt">Click now</span>
      </span>
    </a>
  )
}

// Hover (from the hidden layers of Figma "button2"): the navy panel slides off to the left and the
// carpet follows it across the gold from the right; the castle fades in and the label flips to white
export function ExploreButton({ onClick }) {
  return (
    <button type="button" className="fbtn fbtn--explore" onClick={onClick}>
      <span className="fbtn__fill" />
      <Crop className="fbtn__castle" src="bg-castle.png" box={{ left: 61, top: -9.2, width: 200.3, height: 114 }} w="374.37%" h="370.05%" l="-51.2%" t="-235.03%" />
      <span className="fbtn__fly">
        <span className="fbtn__panel" />
        <Crop className="fbtn__carpet" src="lamp.png" box={{ left: 262, top: 8.5, width: 92.7, height: 39.9 }} w="168.67%" h="220.4%" l="-31.02%" t="-42.02%" />
        {/* sparkle texture placed exactly as in Figma: 665 × 204 strip rotated 54°, screen-blended */}
        <span className="fbtn__shine">
          <span className="fbtn__shine-strip">
            <img src={img('shine.png')} alt="" />
          </span>
        </span>
      </span>
      <span className="fbtn__labels" style={{ left: 35, width: 180 }}>
        <span className="fbtn__label fbtn__label--alt">Explore</span>
        <span className="fbtn__label">Explore</span>
      </span>
    </button>
  )
}
