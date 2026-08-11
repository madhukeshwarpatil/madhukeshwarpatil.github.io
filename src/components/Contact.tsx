import { identity } from '../data/profile'
import { Reveal } from './Reveal'
import { DownloadIcon, LinkedInIcon, MailIcon, PhoneIcon } from './icons'

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="section contact-section">
      <Reveal>
        <p className="section-index" aria-hidden="true">
          06 <span style={{ opacity: 0.5 }}>{'//'}</span> contact
        </p>
        <h2 className="contact-headline" id="contact-heading">
          Let&apos;s build something <span className="grad">reliable</span>.
        </h2>
        <p className="contact-sub">
          Open to Cloud, Platform, DevOps &amp; SRE roles across Europe. {identity.availability}.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="contact-ctas">
          <a className="btn btn-primary" href={`mailto:${identity.email}`}>
            <MailIcon size={18} />
            {identity.email}
          </a>
          <a className="btn btn-ghost" href="/resume.html">
            <DownloadIcon size={18} />
            Download resume
          </a>
        </div>
        <div className="contact-meta">
          <a href={`tel:${identity.phoneHref}`}>
            <PhoneIcon size={18} />
            {identity.phone}
          </a>
          <a href={identity.linkedin} target="_blank" rel="noreferrer">
            <LinkedInIcon size={18} />
            {identity.linkedinLabel}
          </a>
        </div>
      </Reveal>
    </section>
  )
}
