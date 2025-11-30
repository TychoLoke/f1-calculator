import { sections, personas, verdicts, tierCopy } from './data.js';

export const pillarVerdict = score => {
  if (score >= 80) return verdicts.high;
  if (score >= 60) return verdicts.medium;
  return verdicts.low;
};

export function calculateScores(answers) {
  let offset = 0;
  const pillarScores = sections.map(section => {
    const slice = answers.slice(offset, offset + section.questions.length);
    offset += section.questions.length;
    const sum = slice.reduce((acc, val) => acc + val, 0);
    return Math.round((sum / (section.questions.length * 5)) * 100);
  });

  const total = answers.reduce((acc, val) => acc + val, 0);
  const totalScore = Math.round((total / (answers.length * 5)) * 100);
  return { pillarScores, totalScore };
}

export function resolveTier(totalScore) {
  return tierCopy.find(tier => totalScore <= tier.max)?.label ?? tierCopy[2].label;
}

export function derivePersona(scores) {
  const [strategy, culture, operations, intelligence] = scores;
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const high = score => score >= 75;
  const low = score => score < 60;

  if (scores.every(score => score >= 80)) return personas.mip;
  if (high(operations) && low(strategy)) return personas.stabilizer;
  if (high(strategy) && low(operations)) return personas.visionary;
  if (high(intelligence) && low(culture)) return personas.architect;
  if (avg >= 70) return personas.mip;
  return personas.stabilizer;
}

export function deriveInsights(scores) {
  const names = sections.map(s => s.name);
  const paired = scores.map((score, idx) => ({ score, name: names[idx] }));
  const strengths = [...paired].sort((a, b) => b.score - a.score).slice(0, 3);
  const opportunities = [...paired].sort((a, b) => a.score - b.score).slice(0, 3);
  return {
    strengths: strengths.map(item => `${item.name}: ${pillarVerdict(item.score)}`),
    opportunities: opportunities.map(item => `${item.name}: ${pillarVerdict(item.score)}`)
  };
}

export function derivePartialScores(answers) {
  let offset = 0;
  let totalAnswered = 0;
  let totalSum = 0;
  const pillarScores = sections.map(section => {
    const slice = answers.slice(offset, offset + section.questions.length).filter(v => v != null);
    offset += section.questions.length;
    if (!slice.length) return null;
    const sum = slice.reduce((acc, val) => acc + val, 0);
    totalAnswered += slice.length;
    totalSum += sum;
    return Math.round((sum / (slice.length * 5)) * 100);
  });

  const totalScore = totalAnswered
    ? Math.round((totalSum / (totalAnswered * 5)) * 100)
    : null;

  return { pillarScores, totalScore, totalAnswered };
}
