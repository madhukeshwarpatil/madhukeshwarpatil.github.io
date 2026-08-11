import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

interface SectionProps {
  id: string
  index: string
  title: string
  children: ReactNode
  className?: string
}

export function Section({ id, index, title, children, className }: SectionProps) {
  const headingId = `${id}-heading`
  return (
    <section id={id} aria-labelledby={headingId} className={`section ${className ?? ''}`}>
      <Reveal>
        <p className="section-index" aria-hidden="true">
          {index} <span style={{ opacity: 0.5 }}>{'//'}</span> {id}
        </p>
        <h2 className="section-title" id={headingId}>
          {title}
        </h2>
      </Reveal>
      {children}
    </section>
  )
}
