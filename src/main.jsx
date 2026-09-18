import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Analytics } from '@vercel/analytics/react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>,
)

// Keep the splash up until the first screen's images and fonts are ready, then show the page in one go.
// The hero/nav intro animations wait for `html.is-ready` (see App.css).
const onTeam = window.location.pathname.replace(/\/$/, '') === '/team'
const firstScreen = onTeam
  ? ['background', 'team-bg', 'bhavika', 'rohit', 'logo']
  : ['hero-bg', 'moon', 'castle', 'clouds', 'land', 'logo']

const loadImage = (name) =>
  new Promise((resolve) => {
    const img = new Image()
    // decode() can stall in background tabs, so never wait on it for more than a moment
    img.onload = () =>
      Promise.race([img.decode ? img.decode().catch(() => {}) : null, new Promise((r) => setTimeout(r, 300))]).then(resolve)
    img.onerror = resolve
    img.src = `/figma/${name}.webp`
  })

const fonts = ['400 40px "King of Thieves"', '400 24px "Cardova"', '700 16px "Space Grotesk"', '500 16px "Poppins"']
  .map((f) => document.fonts.load(f).catch(() => {}))

const ready = Promise.all([...firstScreen.map(loadImage), ...fonts])
const timeout = new Promise((resolve) => setTimeout(resolve, 6000)) // never hold the page hostage

Promise.race([ready, timeout]).then(() => {
  document.documentElement.classList.add('is-ready')
  const splash = document.getElementById('splash')
  if (!splash) return
  splash.classList.add('is-done')
  setTimeout(() => splash.remove(), 700)
})
