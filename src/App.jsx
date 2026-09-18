import { useEffect } from 'react'
import './App.css'
import { usePath, useReveal } from './hooks'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Journey from './components/Journey'
import { About, Footer, Partners, Prizes, RulesFaq } from './components/Sections'
import Team from './pages/Team'

function Home() {
  // arriving from another page with #section
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView())
  }, [])

  return (
    <main>
      <Hero />
      <About />
      <Journey />
      <Prizes />
      <RulesFaq />
      <Partners />
      <Footer />
    </main>
  )
}

export default function App() {
  const path = usePath()
  const isTeam = path.replace(/\/$/, '') === '/team'
  useReveal(path)
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0)
  }, [path])

  return (
    <>
      <div className="page-bg" aria-hidden="true" />
      <Nav path={path} />
      {isTeam ? <Team key="team" /> : <Home key="home" />}
    </>
  )
}
