export type Section = {
  id: string;
  label: string;
  name: string;
  questions: string[];
};

export type Persona = {
  title: string;
  description: string;
};

export const atsColors = {
  peach: '#f18268',
  navy: '#22327a',
  cyan: '#10c0e7',
};

export const sections: Section[] = [
  {
    id: 'strategy',
    label: 'Section A',
    name: 'Strategy & Identity',
    questions: [
      'How clearly is your ICP (ideal customer profile) defined, including firmographics and buying triggers?',
      'How modern and differentiated is your service catalogue, with packaged outcomes instead of menu-style tasks?',
      'How strong is your positioning against competitors for that ICP, expressed in plain language outcomes?',
      'How well does your pricing reflect value delivered (not hours), with tiers aligned to ICP needs?',
      'How consistent is your go-to-market (GTM) motion across marketing, sales, and onboarding?',
    ],
  },
  {
    id: 'culture',
    label: 'Section B',
    name: 'Culture & Leadership',
    questions: [
      'How aligned is the team on mission, vision, and goals they can repeat back?',
      'How accountable is the team to measurable results with owners and timelines?',
      'How strong is internal communication across functions and time zones?',
      'How open are people to change, improvement, and retiring old habits?',
      'How well do leaders coach, mentor, and model the behaviours they expect?',
    ],
  },
  {
    id: 'operations',
    label: 'Section C',
    name: 'Operations & Standardization',
    questions: [
      'How standardized are onboarding processes for new clients and users?',
      'How standardized are recurring services, runbooks, and checklists?',
      'How consistent is tooling across clients (RMM, PSA, documentation)?',
      'How automated are your workflows versus manual heroics?',
      'How predictable is quality across clients and technicians?',
    ],
  },
  {
    id: 'intelligence',
    label: 'Section D',
    name: 'Intelligence & Reporting',
    questions: [
      'How often do you review cross-tool data (PSA, RMM, finance) for decisions?',
      'How well do you track client health and risk with a shared rubric?',
      'How clear is your internal performance dashboard for the leadership team?',
      'How mature is your security posture monitoring and incident response?',
      'How well do you forecast revenue, margin, and workload with documented assumptions?',
    ],
  },
];

export const verdicts = {
  high: 'Modern, disciplined execution that inspires confidence.',
  medium: 'Solid progress with room for sharper focus.',
  low: 'Foundation needed to unlock consistent performance.',
};

export const personas: Record<string, Persona> = {
  stabilizer: {
    title: 'The Stabilizer',
    description: 'Rock-solid operations with room to sharpen strategy and market moves.',
  },
  visionary: {
    title: 'The Visionary',
    description: 'Bold strategy and direction; now align operations for predictable delivery.',
  },
  architect: {
    title: 'The Architect',
    description: 'Data-forward and insightful; elevate culture to amplify your intelligence gains.',
  },
  mip: {
    title: 'The MIP',
    description: 'Balanced excellence across all pillars. You set the pace for the industry.',
  },
};

export const tierCopy = [
  { max: 39, label: 'Tool-Driven MSP' },
  { max: 69, label: 'Transitioning MSP' },
  { max: 100, label: 'Managed Intelligence Provider' },
];
