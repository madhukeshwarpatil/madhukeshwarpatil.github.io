import { motion } from 'framer-motion'
import { identity } from '../data/profile'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { ArrowDownIcon, DownloadIcon, MailIcon } from './icons'

const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  const reduced = usePrefersReducedMotion()

  const intro = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease },
        }

  return (
    <header className="hero">
      <div className="hero-glow" />

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
