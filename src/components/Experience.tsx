import { roles } from '../data/profile'
import { Reveal } from './Reveal'
import { Section } from './Section'
import { StatCounter } from './StatCounter'

export function Experience() {
  return (
    <Section id="experience" index="02" title="Experience">
      <div className="timeline">
        {roles.map((role, i) => (
          <Reveal key={role.id} delay={i * 0.05}>
            <article className="timeline-item">
              <span className="timeline-node" aria-hidden="true" />
              <div className="card">
                <p className="role-period">{role.period}</p>
                <h3 className="role-title">{role.title}</h3>
                <p className="role-org">
                  {role.org}
                  {role.context ? ` · ${role.context}` : ''}
                </p>

                <div className="stats-row">
                  {role.stats.map((stat) => (
                    <StatCounter key={stat.label} stat={stat} />
                  ))}
                </div>

                <ul className="role-bullets">
                  {role.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>

                <ul className="chips" aria-label="Technologies used">
                  {role.tech.map((t) => (
                    <li className="chip" key={t}>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
