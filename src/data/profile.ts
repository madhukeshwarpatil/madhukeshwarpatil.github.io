export interface Stat {
  value: number
  suffix: string
  label: string
}

export interface Role {
  id: string
  period: string
  title: string
  org: string
  context?: string
  stats: Stat[]
  bullets: string[]
  tech: string[]
}

export interface SkillGroup {
  id: string
  name: string
  skills: string[]
}

export interface EducationEntry {
  degree: string
  school: string
  place: string
  period: string
  note?: string
}

export interface Language {
  name: string
  level: string
  /** 1–4 proficiency dots */
  dots: number
}

export const identity = {
  name: 'Madhukeshwargouda Patil',
  shortName: 'Madhu Patil',
  title: 'Technical Lead · Cloud & Platform Engineering · DevOps · SRE',
  status: 'Open to work · Berlin, DE',
  email: 'madhukeshwarpatil@gmail.com',
  phone: '+49 178 459 2846',
  phoneHref: '+491784592846',
  linkedin: 'https://linkedin.com/in/madhukeshwargouda-patil-691a123b3',
  linkedinLabel: 'linkedin.com/in/madhukeshwargouda-patil',
  location: 'Berlin, Germany',
  availability: 'Available now · Part-time now · EU Blue Card eligible Apr 2027',
  hook: 'Architected a global OTT platform on AWS — zero to 9M users in 90 days.',
} as const

export const summary = `Architected a global OTT streaming platform on AWS from zero to 9M users in 90 days. Spent four years leading platform reliability at PayPay — Japan's largest fintech — progressing from Software Engineer to Technical Lead while managing a 5-engineer team, owning the full observability stack, and driving incident response at scale. Before that, five years building SaaS products end-to-end. Currently pursuing an MSc in Data Science, AI & Digital Business at GISMA Berlin, and open to Cloud Engineering, Platform Engineering, DevOps, and SRE roles across Europe.`

export const roles: Role[] = [
  {
    id: 'chosen',
    period: 'Oct 2025 – Apr 2026',
    title: 'Technical Lead — Cloud & Platform Engineering',
    org: 'Robosoft Technologies',
    context: 'Client: Come and See Foundation (The Chosen OTT)',
    stats: [
      { value: 9, suffix: 'M+', label: 'users' },
      { value: 20, suffix: 'M+', label: 'sessions' },
      { value: 8, suffix: 'K+', label: 'req/sec' },
      { value: 90, suffix: ' days', label: 'zero → production' },
    ],
    bullets: [
      'Led end-to-end cloud architecture and DevOps delivery of a global OTT platform on AWS in 90 days',
      'Designed environment strategy and authored reusable Terraform modules across dev, staging, and production',
      'Built GitHub Actions pipelines automating build, test, and deployment for all environments',
      'Scaled platform to 9M+ users and 8K+ req/s across web, mobile, and TV devices globally',
    ],
    tech: ['AWS', 'Terraform', 'GitHub Actions', 'EC2', 'ECS', 'S3', 'CloudFront', 'Lambda', 'Docker', 'IaC'],
  },
  {
    id: 'paypay',
    period: 'Aug 2021 – Sep 2025',
    title: 'SWE → Senior SWE → Technical Lead, Platform Reliability',
    org: 'Robosoft Technologies',
    context: 'Client: PayPay Corporation · 60M+ users · Japan',
    stats: [
      { value: 60, suffix: 'M+', label: 'platform users' },
      { value: 2.5, suffix: 'M', label: 'API req/day' },
      { value: 20, suffix: 'K', label: 'notifications/day' },
      { value: 3, suffix: '', label: 'promotions in 4 yrs' },
    ],
    bullets: [
      'Managed a 5-engineer reliability team across production operations, monitoring, and on-call incident management',
      'Owned observability stack (New Relic, Grafana, VictoriaMetrics) — improved alerting quality and reduced MTTR',
      'Built structured incident response processes: runbooks, escalation trees, and post-incident reviews',
      'Designed and shipped a Kafka-based notification system delivering ~20K messages/day to agents, customers, and suppliers',
      'Partnered with client engineering leadership to align reliability priorities with product delivery goals',
    ],
    tech: ['SRE', 'New Relic', 'Grafana', 'VictoriaMetrics', 'PagerDuty', 'Kafka', 'TiDB', 'Kotlin', 'Scala'],
  },
  {
    id: 'indust',
    period: 'Jul 2016 – Aug 2021',
    title: 'Software Engineer — Full-Stack Development',
    org: 'Indust Logistik Technologies Pvt. Ltd.',
    stats: [
      { value: 5, suffix: ' yrs', label: 'end-to-end SaaS delivery' },
    ],
    bullets: [
      'Built and maintained SaaS products — helpdesk and property management solutions — end-to-end in .NET MVC, C#, SQL Server, and JavaScript',
      'Owned full delivery lifecycle across multiple clients: requirements, development, testing, and deployment',
    ],
    tech: ['.NET MVC', 'C#', 'SQL Server', 'JavaScript', 'SaaS'],
  },
]

export const skillGroups: SkillGroup[] = [
  {
    id: 'cloud',
    name: 'Cloud & IaC',
    skills: ['AWS', 'EC2', 'ECS', 'Lambda', 'S3', 'RDS', 'CloudFront', 'IAM', 'VPC', 'Route 53', 'API GW', 'Terraform', 'Ansible', 'Chef'],
  },
  {
    id: 'cicd',
    name: 'CI/CD & DevOps',
    skills: ['GitHub Actions', 'Jenkins', 'Docker', 'JFrog', 'SonarQube'],
  },
  {
    id: 'observability',
    name: 'Observability & SRE',
    skills: ['New Relic', 'Grafana', 'VictoriaMetrics', 'Datadog', 'CloudWatch', 'PagerDuty'],
  },
  {
    id: 'languages',
    name: 'Languages & Data',
    skills: ['Python', 'Bash', 'JavaScript', 'C#', 'Kotlin', 'Scala', 'SQL Server', 'TiDB', 'Kafka'],
  },
]

export const education: EducationEntry[] = [
  {
    degree: 'MSc Data Science, AI & Digital Business',
    school: 'GISMA University of Applied Sciences',
    place: 'Berlin, Germany',
    period: 'Apr 2026 – Apr 2027',
    note: 'in progress',
  },
  {
    degree: 'B.E. Electronics & Communication Engineering',
    school: 'Smt. Kamala & Sri Venkappa M. Agadi College',
    place: 'Hubli, India',
    period: 'Sep 2012 – Jun 2016',
  },
]

export const languages: Language[] = [
  { name: 'English', level: 'Full professional', dots: 4 },
  { name: 'Kannada', level: 'Native', dots: 4 },
  { name: 'Hindi', level: 'Professional working', dots: 3 },
  { name: 'German', level: 'Beginner · learning', dots: 1 },
]
