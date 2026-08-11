import { languages } from '../data/profile'
import { Reveal } from './Reveal'
import { Section } from './Section'

export function Languages() {
  return (
    <Section id="languages" index="05" title="Languages">
      <div className="lang-grid">
        {languages.map((lang, i) => (
          <Reveal key={lang.name} delay={i * 0.05}>
            <div className="card lang-card">
              <h3 className="lang-name">{lang.name}</h3>
              <p className="lang-level">{lang.level}</p>
              <div className="lang-dots" role="img" aria-label={`${lang.name}: ${lang.level}`}>
                {Array.from({ length: 4 }, (_, d) => (
                  <span key={d} className={`lang-dot ${d < lang.dots ? 'on' : ''}`} />
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
