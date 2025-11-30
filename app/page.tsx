'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { sections } from './lib/data';
import {
  calculateScores,
  deriveInsights,
  derivePartialScores,
  derivePersona,
  pillarVerdict,
  resolveTier,
} from './lib/engine';

const STORAGE_KEY = 'msp-scan-state-v2';
const EMAIL_KEY = 'msp-scan-email';

const keyTerms = [
  {
    term: 'ICP (Ideal Customer Profile)',
    definition:
      'The exact type of client you design services for — industry, size, tech stack, and the triggers that make them buy.',
  },
  {
    term: 'Service catalogue',
    definition: 'Your menu of packaged offers. The clearer the outcomes, the easier it is for clients to pick and for teams to deliver.',
  },
  {
    term: 'GTM (Go-To-Market)',
    definition: 'How you attract, sell, and onboard the right clients — spanning marketing, sales, and post-sale handoff.',
  },
  {
    term: 'Runbook',
    definition: 'A step-by-step playbook for recurring work so any technician can deliver the same quality.',
  },
  {
    term: 'Cross-tool data',
    definition: 'Insights that combine PSA, RMM, documentation, and finance data so leaders see cause and effect.',
  },
];

const scaleGuide = [
  { label: '1 — Not in place', detail: 'No consistent approach yet; work is reactive or ad-hoc.' },
  { label: '2 — Emerging', detail: 'Some pockets of maturity, but it relies on individuals, not systems.' },
  { label: '3 — Defined', detail: 'Documented and repeatable for most teams, with occasional gaps.' },
  { label: '4 — Optimized', detail: 'Consistently executed with metrics, automation, and QA in place.' },
  { label: '5 — Leading', detail: 'Industry-grade, continuously improved, and resilient when people change.' },
];

function getSectionForIndex(index: number) {
  let offset = 0;
  for (const section of sections) {
    const end = offset + section.questions.length;
    if (index >= offset && index < end) {
      return { section, questionIndex: index - offset } as const;
    }
    offset = end;
  }
  return { section: sections[0], questionIndex: 0 } as const;
}

export default function HomePage() {
  const totalQuestions = useMemo(
    () => sections.reduce((acc, section) => acc + section.questions.length, 0),
    [],
  );

  const [answers, setAnswers] = useState<Array<number | null>>(
    () => new Array(totalQuestions).fill(null),
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState('');
  const [resumeStatus, setResumeStatus] = useState('Fresh session');
  const [showResults, setShowResults] = useState(false);
  const [shakeScale, setShakeScale] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  const assessmentRef = useRef<HTMLElement | null>(null);
  const resultsRef = useRef<HTMLElement | null>(null);

  const { section, questionIndex } = useMemo(
    () => getSectionForIndex(currentIndex),
    [currentIndex],
  );

  const progress = useMemo(() => {
    if (showResults) return 100;
    if (totalQuestions <= 1) return 0;
    return Math.round((currentIndex / (totalQuestions - 1)) * 100);
  }, [currentIndex, showResults, totalQuestions]);

  const partial = useMemo(() => derivePartialScores(answers), [answers]);
  const allAnswered = useMemo(() => answers.every((value) => value != null), [answers]);

  const finalScores = useMemo(() => {
    if (!allAnswered) return null;
    const filled = answers.map((value) => value ?? 0);
    return calculateScores(filled);
  }, [allAnswered, answers]);

  const persona = useMemo(() => {
    if (!finalScores) return null;
    return derivePersona(finalScores.pillarScores);
  }, [finalScores]);

  const insights = useMemo(() => {
    if (!finalScores) return null;
    return deriveInsights(finalScores.pillarScores);
  }, [finalScores]);

  const partialPersonaTitle = useMemo(() => {
    if (!partial.totalAnswered) return 'Persona pending';
    const knownScores = partial.pillarScores.filter((score): score is number => score != null);
    const fallback = knownScores.length
      ? Math.round(knownScores.reduce((a, b) => a + b, 0) / knownScores.length)
      : 50;
    const personaScores = partial.pillarScores.map((score) => score ?? fallback);
    return derivePersona(personaScores).title;
  }, [partial]);

  const questionCounterLabel = `Question ${currentIndex + 1} of ${totalQuestions}`;

  const scoreCircle = useMemo(() => {
    const circumference = 2 * Math.PI * 64;
    const value = showResults && finalScores ? displayScore : finalScores?.totalScore ?? 0;
    const offset = circumference - (value / 100) * circumference;
    return { circumference, offset, value };
  }, [displayScore, finalScores, showResults]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const savedEmail = localStorage.getItem(EMAIL_KEY);

    if (savedEmail) {
      setEmail(savedEmail);
    }

    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.answers) && parsed.answers.length === totalQuestions) {
          setAnswers(parsed.answers);
          setCurrentIndex(parsed.currentIndex ?? 0);
          setResumeStatus('Resumed from last session');
          setEmail(parsed.email ?? savedEmail ?? '');
          const completed = parsed.answers.every((value: number | null) => value != null);
          setShowResults(Boolean(parsed.showResults) || completed);
        }
      } catch (err) {
        console.warn('Unable to restore saved state', err);
      }
    }

    setHydrated(true);
  }, [totalQuestions]);

  useEffect(() => {
    if (!hydrated) return;
    const payload = { answers, currentIndex, email, showResults };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    if (email) {
      localStorage.setItem(EMAIL_KEY, email);
    }
  }, [answers, currentIndex, email, hydrated, showResults]);

  useEffect(() => {
    if (!showResults || !finalScores) {
      setDisplayScore(0);
      return undefined;
    }

    const duration = 1000;
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const progressRatio = Math.min((now - start) / duration, 1);
      const value = Math.round(progressRatio * finalScores.totalScore);
      setDisplayScore(value);
      if (progressRatio < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [finalScores, showResults]);

  const handleSelect = useCallback(
    (value: number) => {
      setAnswers((prev) => {
        const next = [...prev];
        next[currentIndex] = value;
        return next;
      });
      setShakeScale(false);
    },
    [currentIndex],
  );

  const handleNext = useCallback(() => {
    if (answers[currentIndex] == null) {
      setShakeScale(true);
      setTimeout(() => setShakeScale(false), 400);
      return;
    }

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((idx) => Math.min(idx + 1, totalQuestions - 1));
    } else {
      setShowResults(true);
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [answers, currentIndex, totalQuestions]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((idx) => Math.max(idx - 1, 0));
  }, []);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA') return;
      const value = Number(event.key);
      if (value >= 1 && value <= 5) {
        handleSelect(value);
        return;
      }
      if (event.key === 'ArrowRight') {
        handleNext();
      } else if (event.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleNext, handlePrev, handleSelect]);

  const handleReset = () => {
    setAnswers(new Array(totalQuestions).fill(null));
    setCurrentIndex(0);
    setEmail('');
    setEmailStatus('');
    setShowResults(false);
    setResumeStatus('Fresh session');
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(EMAIL_KEY);
  };

  const handleEmailSave = () => {
    if (!email.trim()) {
      setEmailStatus('Please add an email to save your PDF request.');
      return;
    }
    setEmailStatus('Saved locally — we will notify you when PDF downloads are live.');
    localStorage.setItem(EMAIL_KEY, email.trim());
  };

  const handleSkipEmail = () => {
    setEmail('');
    setEmailStatus('You can add your email later to receive a PDF copy.');
  };

  const handleStart = () => {
    assessmentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleJumpToResults = () => {
    resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const recap = useMemo(() => {
    const cards: Array<{ label: string; name: string; answers: Array<number | null>; questions: string[] }> = [];
    let offset = 0;
    sections.forEach((entry) => {
      const slice = answers.slice(offset, offset + entry.questions.length);
      cards.push({ label: entry.label, name: entry.name, answers: slice, questions: entry.questions });
      offset += entry.questions.length;
    });
    return cards;
  }, [answers]);

  return (
    <main className="container">
      <div className="hero" id="top">
        <div className="hero__bg" />
        <div className="container">
          <header className="nav">
            <div className="brand">Above The Stack</div>
            <div className="version">v1.0 – 2026</div>
          </header>
          <div className="hero__content">
            <div className="hero__text">
              <div className="hero__meta">
                <div className="meta-chip">
                  <span>⚡</span>
                  <div>
                    <strong>Real-time coaching</strong>
                    <small>Micro-feedback on every pillar.</small>
                  </div>
                </div>
                <div className="meta-chip">
                  <span>⌨️</span>
                  <div>
                    <strong>Keyboard-first</strong>
                    <small>1–5 scoring and arrow-key navigation.</small>
                  </div>
                </div>
                <div className="meta-chip">
                  <span>🧭</span>
                  <div>
                    <strong>Guided journey</strong>
                    <small>Results are staged to reduce overwhelm.</small>
                  </div>
                </div>
              </div>
              <div className="hero__copy">
                <p className="eyebrow">Premium Diagnostic</p>
                <h1 className="hero__title">MSP Performance Scan</h1>
                <p className="hero__subtitle">
                  Your 5-minute benchmark for 2026. Discover how mature your MSP really is.
                </p>
              </div>
              <div className="hero__copy">
                <p>
                  Complete the four-pillar assessment to reveal your MIP readiness score, persona, and the
                  strengths and opportunities that will have the biggest impact.
                </p>
              </div>
              <div className="hero__cta">
                <button className="primary" onClick={handleStart}>Start the scan</button>
                <div className="cta-hint">Runs in the browser. No data is transmitted.</div>
              </div>
            </div>

            <div className="hero__visual">
              <div className="orbital" aria-hidden>
                <div className="orbital__core" />
                <div className="orbital__ring" />
                <div className="orbital__ring orbital__ring--delayed" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="container card narrative">
        <div className="narrative__lead">
          <div className="narrative__pulse" />
          <div>
            <p className="eyebrow">Why this matters</p>
            <h2>Above The Stack built the MIP Performance Scan to map your 2026 readiness.</h2>
          </div>
        </div>

        <div className="narrative__grid">
          <div>
            <h3>Four pillars, actionable output</h3>
            <p>
              Strategy, Culture, Operations, and Intelligence — scored, benchmarked, and narrated so you know
              exactly where to steer next.
            </p>
          </div>
          <div>
            <h3>Decision-ready output</h3>
            <p>
              Strengths, opportunities, personas, and benchmarks are presented as presentation-ready tiles.
            </p>
          </div>
          <div>
            <h3>Session resilience</h3>
            <p>
              Auto-saving and instant resume status remove friction for busy teams hopping between devices.
            </p>
          </div>
        </div>
      </section>

      <section className="container card glossary">
        <div className="glossary__header">
          <div>
            <p className="eyebrow">Term clarity</p>
            <h2>Plain-language guide for the scan.</h2>
          </div>
          <p>
            Acronyms like ICP and GTM are spelled out here so your team scores consistently. Skim this once, then
            jump into the assessment feeling confident.
          </p>
        </div>

        <div className="glossary__grid">
          {keyTerms.map((entry) => (
            <div key={entry.term} className="glossary__item">
              <div className="glossary__term">{entry.term}</div>
              <p>{entry.definition}</p>
            </div>
          ))}
        </div>

        <div className="glossary__footer">
          <div>
            <h3>How to score 1–5</h3>
            <ul className="scale-guide">
              {scaleGuide.map((item) => (
                <li key={item.label}>
                  <strong>{item.label}</strong>
                  <span>{item.detail}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="glossary__note">
            <p>
              Use the same interpretation across the team: a “runbook” is any checklist your technicians can follow, and
              “cross-tool data” means combining PSA, RMM, documentation, and finance signals to see the full picture.
            </p>
            <p>Stuck on a term? Hovering is optional — everything is written in plain English above.</p>
          </div>
        </div>
      </section>

      <section className="container card assessment" id="assessment" ref={assessmentRef}>
        <div className="meta-panel">
          <div className="live-pulse">
            <div className="live-pulse__header">
              <p className="eyebrow">Live readiness pulse</p>
              <span className="tag tag--pulse" id="resumeStatus">{resumeStatus}</span>
            </div>
            <div className="live-pulse__body">
              <div>
                <div className="live-pulse__score">{partial.totalScore != null ? `${partial.totalScore}%` : '—'}</div>
                <div className="live-pulse__persona">{partialPersonaTitle}</div>
              </div>
              <div className="live-pulse__hint">Keyboard ready: use 1–5 to score, ← / → to navigate.</div>
            </div>
          </div>
          <div className="session-actions">
            <button className="text" onClick={handleReset}>Reset</button>
            <button className="text" onClick={handleJumpToResults}>Jump to results</button>
          </div>
        </div>

        <div className="progress">
          <div className="progress__label">Progress {progress}%</div>
          <div className="progress__track">
            <div className="progress__bar" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="section-map" aria-label="Section navigator">
          {sections.map((entry) => {
            const offset = sections
              .slice(0, sections.indexOf(entry))
              .reduce((acc, item) => acc + item.questions.length, 0);
            const answersSlice = answers.slice(offset, offset + entry.questions.length);
            const answeredCount = answersSlice.filter((value) => value != null).length;
            const completion = Math.round((answeredCount / entry.questions.length) * 100);
            const nextIndex = answersSlice.findIndex((value) => value == null);
            const targetIndex = nextIndex === -1 ? offset : offset + nextIndex;
            const isActive = currentIndex >= offset && currentIndex < offset + entry.questions.length;

            return (
              <button
                key={entry.id}
                type="button"
                className={`section-chip${isActive ? ' active' : ''}`}
                onClick={() => setCurrentIndex(targetIndex)}
              >
                <div className="chip-top">
                  <span className="tag">{entry.label}</span>
                  <span>{entry.name}</span>
                </div>
                <div className="chip-progress">
                  <span>
                    {answeredCount}/{entry.questions.length} answered
                  </span>
                  <div className="chip-meter">
                    <span style={{ width: `${completion}%` }} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="section-header">
          <div>
            <p className="eyebrow">{section.label}</p>
            <h2>{section.name}</h2>
          </div>
          <div className="question-count">{questionCounterLabel}</div>
        </div>

        <div className="question-card">
          <p className="question">{section.questions[questionIndex]}</p>
          <div className={`scale${shakeScale ? ' shake' : ''}`}>
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                className={answers[currentIndex] === value ? 'selected' : ''}
                aria-label={`Select ${value}`}
                onClick={() => handleSelect(value)}
              >
                {value}
              </button>
            ))}
          </div>
          <div className="scale__legend">
            <span>Immature</span>
            <span>Very mature</span>
          </div>
        </div>

        <div className="controls">
          <button className="ghost" onClick={handlePrev} disabled={currentIndex === 0}>
            Previous
          </button>
          <button className="primary" onClick={handleNext}>
            {currentIndex === totalQuestions - 1 ? 'View Results' : 'Next'}
          </button>
        </div>
      </section>

      <section
        className={`container card results${showResults ? ' active' : ''}`}
        id="results"
        aria-hidden={!showResults}
        ref={resultsRef}
      >
        <div className="results__grid">
          <div className="results__main">
            <p className="eyebrow">MSP Performance Scan</p>
            <h2>Your MIP Readiness Score</h2>
            <div className="score-display">
              <div className="score-circle">
                <svg viewBox="0 0 140 140">
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f18268" />
                      <stop offset="100%" stopColor="#10c0e7" />
                    </linearGradient>
                  </defs>
                  <circle className="score-circle__track" cx="70" cy="70" r="64" />
                  <circle
                    className="score-circle__bar"
                    cx="70"
                    cy="70"
                    r="64"
                    strokeDasharray={scoreCircle.circumference}
                    strokeDashoffset={scoreCircle.offset}
                    stroke="url(#scoreGradient)"
                  />
                </svg>
                <div className="score-circle__value">{showResults ? scoreCircle.value : '—'}</div>
              </div>
              <div className="tier">{finalScores ? resolveTier(finalScores.totalScore) : 'Awaiting completion'}</div>
            </div>

            <div className="pillar-grid">
              {(finalScores?.pillarScores ?? []).map((score, index) => (
                <div key={sections[index].id} className="pillar-card">
                  <div className="pillar-top">
                    <div>{sections[index].name}</div>
                    <div className="pillar-score">{score}%</div>
                  </div>
                  <p className="pillar-verdictext">{pillarVerdict(score)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="results__side">
            <div className="card-inner">
              <h3>Strengths</h3>
              <ul className="pill-list">
                {(insights?.strengths ?? ['Complete the scan to reveal strengths.']).map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
              <h3>Opportunities</h3>
              <ul className="pill-list pill-list--alt">
                {(insights?.opportunities ?? ['Complete the scan to reveal opportunities.']).map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
            </div>

            <div className="card-inner benchmark">
              <div className="benchmark__header">
                <h3>Industry Benchmark</h3>
                <span className="tag">Snapshot</span>
              </div>
              <div className="benchmark__bars">
                <div className="benchmark__row">
                  <span>Top 25%</span>
                  <div className="bar">
                    <span style={{ width: '78%' }}>78</span>
                  </div>
                </div>
                <div className="benchmark__row">
                  <span>Industry average</span>
                  <div className="bar">
                    <span style={{ width: '54%' }}>54</span>
                  </div>
                </div>
                <div className="benchmark__row">
                  <span>Bottom 25%</span>
                  <div className="bar">
                    <span style={{ width: '34%' }}>34</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-inner persona">
              <div className="persona__icon">✦</div>
              <div>
                <p className="eyebrow">Persona</p>
                <h3>{persona?.title ?? 'The MIP'}</h3>
                <p>{persona?.description ?? 'Complete the scan to discover your persona.'}</p>
              </div>
            </div>

            <div className="card-inner recap">
              <div className="recap__header">
                <h3>Answer recap</h3>
                <span className="tag">Per section</span>
              </div>
              <div className="recap__list">
                {recap.map((card) => (
                  <div key={card.label} className="recap__card">
                    <div className="recap__card__header">
                      <span className="tag">{card.label}</span>
                      <strong>{card.name}</strong>
                    </div>
                    <ol>
                      {card.questions.map((text, idx) => (
                        <li key={text}>
                          <span>{text}</span> <b>{card.answers[idx] ?? '—'}</b>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="cta-grid">
          <button className="primary">Join the Above The Stack Community</button>
          <button className="ghost">Download the MSP Performance Playbook</button>
          <button className="text">Follow Tycho Löke</button>
        </div>

        <div className="email-capture" id="emailCapture">
          <div>
            <h3>Want your results as a PDF?</h3>
            <p>Share your email and we will send a downloadable version when available.</p>
          </div>
          <div className="email-actions">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              aria-label="Email"
            />
            <button className="primary" onClick={handleEmailSave}>
              Save
            </button>
            <button className="text" onClick={handleSkipEmail}>
              Skip
            </button>
          </div>
          <div className="email-status" role="status" aria-live="polite">
            {emailStatus}
          </div>
        </div>
      </section>
    </main>
  );
}
