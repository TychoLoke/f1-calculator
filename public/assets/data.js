export const atsColors = {
  peach: '#f18268',
  navy: '#22327a',
  cyan: '#10c0e7'
};

export const sections = [
  {
    id: 'strategy',
    label: 'Section A',
    name: 'Strategy & Identity',
    questions: [
      'How clearly is your ICP defined?',
      'How modern and differentiated is your service catalogue?',
      'How strong is your positioning in the market?',
      'How well does your pricing reflect value instead of hours?',
      'How consistent is your go-to-market execution?'
    ]
  },
  {
    id: 'culture',
    label: 'Section B',
    name: 'Culture & Leadership',
    questions: [
      'How aligned is the team on mission, vision, and goals?',
      'How accountable is the team to measurable results?',
      'How strong is internal communication?',
      'How open are people to change and improvement?',
      'How well do leaders coach and mentor?'
    ]
  },
  {
    id: 'operations',
    label: 'Section C',
    name: 'Operations & Standardization',
    questions: [
      'How standardized are onboarding processes?',
      'How standardized are recurring services and runbooks?',
      'How consistent is tooling across clients?',
      'How automated are your workflows?',
      'How predictable is quality across clients?'
    ]
  },
  {
    id: 'intelligence',
    label: 'Section D',
    name: 'Intelligence & Reporting',
    questions: [
      'How often do you review cross-tool data for decisions?',
      'How well do you track client health and risk?',
      'How clear is your internal performance dashboard?',
      'How mature is your security posture monitoring?',
      'How well do you forecast revenue, margin, and workload?'
    ]
  }
];

export const verdicts = {
  high: 'Modern, disciplined execution that inspires confidence.',
  medium: 'Solid progress with room for sharper focus.',
  low: 'Foundation needed to unlock consistent performance.'
};

export const personas = {
  stabilizer: {
    title: 'The Stabilizer',
    description: 'Rock-solid operations with room to sharpen strategy and market moves.'
  },
  visionary: {
    title: 'The Visionary',
    description: 'Bold strategy and direction; now align operations for predictable delivery.'
  },
  architect: {
    title: 'The Architect',
    description: 'Data-forward and insightful; elevate culture to amplify your intelligence gains.'
  },
  mip: {
    title: 'The MIP',
    description: 'Balanced excellence across all pillars. You set the pace for the industry.'
  }
};

export const tierCopy = [
  { max: 39, label: 'Tool-Driven MSP' },
  { max: 69, label: 'Transitioning MSP' },
  { max: 100, label: 'Managed Intelligence Provider' }
];
