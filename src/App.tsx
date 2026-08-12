import { About } from './components/About'
import { Background3D } from './components/Background3D'
import { Contact } from './components/Contact'
import { Education } from './components/Education'
import { Experience } from './components/Experience'
import { Hero } from './components/Hero'
import { Languages } from './components/Languages'
import { Nav } from './components/Nav'
import { Skills } from './components/Skills'
import { identity } from './data/profile'

export default function App() {
  return (
    <div id="top">
      <Background3D />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <Hero />
      <main id="main">
        <About />
        <Experience />
        <Skills />
        <Education />
        <Languages />
        <Contact />
      </main>
      <footer className="footer">
        <p>
          © {new Date().getFullYear()} {identity.name}
        </p>
        <p className="mono">built with react · three.js · framer-motion — deployed on github pages</p>
      </footer>
    </div>
  )
}
