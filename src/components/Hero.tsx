import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { identity } from '../data/profile'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { isWebGLAvailable } from '../lib/webgl'
import { HeroFallback } from './HeroFallback'
import { ArrowDownIcon, DownloadIcon, MailIcon } from './icons'

const HeroScene = lazy(() => import('./HeroScene'))

const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  const reduced = usePrefersReducedMotion()
  const heroRef = useRef<HTMLElement>(null)
  const heroVisible = useInView(heroRef, { amount: 0.05 })
  const [sceneReady, setSceneReady] = useState(false)

  // Defer mounting the 3D chunk until after first paint so content wins the race.
  useEffect(() => {
    if (reduced) return
    if (!isWebGLAvailable()) return
    const id = window.requestAnimationFrame(() => setSceneReady(true))
    return () => window.cancelAnimationFrame(id)
  }, [reduced])

  const show3D = sceneReady && !reduced

  const intro = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease },
        }

  return (
    <header className="hero" ref={heroRef}>
      {show3D ? (
        <Suspense fallback={<HeroFallback />}>
          <HeroScene active={heroVisible} />
        </Suspense>
      ) : (
        <HeroFallback />
      )}
      <div className="hero-glow" />
      <div className="hero-fade" />

      <div className="hero-content">
        <motion.p className="status-chip" {...intro(0)}>
          <span className="status-dot" aria-hidden="true" />
          {identity.status}
        </motion.p>

        <motion.h1 {...intro(0.08)}>
          Madhukeshwargouda
          <br />
          <span className="grad">Patil</span>
        </motion.h1>

        <motion.p className="hero-title" {...intro(0.16)}>
          {identity.title}
        </motion.p>

        <motion.p className="hero-hook" {...intro(0.24)}>
          {identity.hook}
        </motion.p>

        <motion.div className="hero-ctas" {...intro(0.32)}>
          <a className="btn btn-primary" href={`mailto:${identity.email}`}>
            <MailIcon size={18} />
            Get in touch
          </a>
          <a className="btn btn-ghost" href="/resume.html">
            <DownloadIcon size={18} />
            Resume
          </a>
        </motion.div>
      </div>

      <div className="scroll-hint" aria-hidden="true">
        <span>scroll</span>
        <ArrowDownIcon size={16} />
      </div>
    </header>
  )
}
