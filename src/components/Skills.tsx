import type { ComponentType } from 'react'
import { skillGroups } from '../data/profile'
import { Reveal } from './Reveal'
import { Section } from './Section'
import { CloudIcon, CodeIcon, PipelineIcon, PulseIcon } from './icons'

const groupIcons: Record<string, ComponentType<{ size?: number }>> = {
  cloud: CloudIcon,
  cicd: PipelineIcon,
  observability: PulseIcon,
  languages: CodeIcon,
}

export function Skills() {
  return (
    <Section id="skills" index="03" title="Skills">
      <div className="skills-grid">
        {skillGroups.map((group, i) => {
          const Icon = groupIcons[group.id] ?? CloudIcon
          return (
            <Reveal key={group.id} delay={i * 0.06}>
              <div className="card">
                <div className="skill-card-head">
                  <Icon size={22} />
                  <h3>{group.name}</h3>
                </div>
                <ul className="chips">
                  {group.skills.map((s) => (
                    <li className="chip" key={s}>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}
