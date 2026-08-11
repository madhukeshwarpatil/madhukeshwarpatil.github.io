import { identity, summary } from '../data/profile'
import { Reveal } from './Reveal'
import { Section } from './Section'
import { CalendarIcon, LinkedInIcon, MailIcon, PhoneIcon, PinIcon } from './icons'

export function About() {
  return (
    <Section id="about" index="01" title="About">
      <div className="about-grid">
        <Reveal>
          <p className="about-text">{summary}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="card">
            <ul className="facts-list">
              <li className="fact">
                <PinIcon size={20} />
                <div>
                  <div className="fact-label">Location</div>
                  <div className="fact-value">{identity.location}</div>
                </div>
              </li>
              <li className="fact">
                <CalendarIcon size={20} />
                <div>
                  <div className="fact-label">Availability</div>
                  <div className="fact-value">{identity.availability}</div>
                </div>
              </li>
              <li className="fact">
                <MailIcon size={20} />
                <div>
                  <div className="fact-label">Email</div>
                  <div className="fact-value">
                    <a href={`mailto:${identity.email}`}>{identity.email}</a>
                  </div>
                </div>
              </li>
              <li className="fact">
                <PhoneIcon size={20} />
                <div>
                  <div className="fact-label">Phone</div>
                  <div className="fact-value">
                    <a href={`tel:${identity.phoneHref}`}>{identity.phone}</a>
                  </div>
                </div>
              </li>
              <li className="fact">
                <LinkedInIcon size={20} />
                <div>
                  <div className="fact-label">LinkedIn</div>
                  <div className="fact-value">
                    <a href={identity.linkedin} target="_blank" rel="noreferrer">
                      {identity.linkedinLabel}
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
