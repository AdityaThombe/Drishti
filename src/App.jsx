import './App.css'
import { useReveal } from './hooks'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Journey from './components/Journey'
import Particles from './components/Particles'
import { About, Footer, Partners, Prizes, RulesFaq } from './components/Sections'

export default function App() {
  useReveal()
  return (
    <>
      <Nav />
      <Particles />
      <main>
        <Hero />
        <About />
        <Journey />
        <Prizes />
        <RulesFaq />
        <Partners />
      </main>
      <Footer />
    </>
  )
}
