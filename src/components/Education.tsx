import { education } from '../data/profile'
import { Reveal } from './Reveal'
import { Section } from './Section'

export function Education() {
  return (
    <Section id="education" index="04" title="Education">
      <div className="edu-grid">
        {education.map((e, i) => (
          <Reveal key={e.degree} delay={i * 0.06}>
            <div className="card">
              <h3 className="edu-degree">{e.degree}</h3>
              <p className="edu-school">
                {e.school} · {e.place}
              </p>
              <div className="edu-meta">
                <span className="edu-period">{e.period}</span>
                {e.note && <span className="edu-badge">{e.note}</span>}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
