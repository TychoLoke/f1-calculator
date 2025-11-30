import { sections } from './data.js';
import {
  calculateScores,
  deriveInsights,
  derivePartialScores,
  derivePersona,
  pillarVerdict,
  resolveTier
} from './engine.js';

const STORAGE_KEY = 'msp-scan-state-v2';
const EMAIL_KEY = 'msp-scan-email';

const state = {
  answers: [],
  currentIndex: 0,
  email: ''
};

const totalQuestions = sections.reduce((acc, section) => acc + section.questions.length, 0);

const progressBar = document.getElementById('progressBar');
const progressLabel = document.getElementById('progressLabel');
const sectionEyebrow = document.getElementById('sectionEyebrow');
const sectionTitle = document.getElementById('sectionTitle');
const questionCounter = document.getElementById('questionCounter');
const questionText = document.getElementById('questionText');
const scaleOptions = document.getElementById('scaleOptions');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const resultsSection = document.getElementById('results');
const totalScoreEl = document.getElementById('totalScore');
const scoreArc = document.getElementById('scoreArc');
const tierLabel = document.getElementById('tierLabel');
const pillarGrid = document.getElementById('pillarGrid');
const strengthList = document.getElementById('strengthList');
const opportunityList = document.getElementById('opportunityList');
const personaTitle = document.getElementById('personaTitle');
const personaDescription = document.getElementById('personaDescription');
const emailInput = document.getElementById('emailInput');
const emailStatus = document.getElementById('emailStatus');
const livePulseScore = document.getElementById('livePulseScore');
const livePulsePersona = document.getElementById('livePulsePersona');
const resumeStatus = document.getElementById('resumeStatus');
const recapList = document.getElementById('recapList');

function initScale() {
  scaleOptions.innerHTML = '';
  for (let i = 1; i <= 5; i += 1) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.setAttribute('aria-label', `Select ${i}`);
    btn.addEventListener('click', () => selectAnswer(i));
    scaleOptions.appendChild(btn);
  }
}

function getCurrentSection() {
  let count = 0;
  for (const section of sections) {
    if (state.currentIndex < count + section.questions.length) {
      return { section, questionIndex: state.currentIndex - count };
    }
    count += section.questions.length;
  }
  return { section: sections[0], questionIndex: 0 };
}

function updateProgress() {
  const progress = Math.round((state.currentIndex / (totalQuestions - 1)) * 100);
  progressLabel.textContent = `Progress ${progress}%`;
  progressBar.style.width = `${progress}%`;
}

function updateLivePulse() {
  const partial = derivePartialScores(state.answers);
  if (!partial.totalAnswered) {
    livePulseScore.textContent = '—';
    livePulsePersona.textContent = 'Persona pending';
    return;
  }

  livePulseScore.textContent = `${partial.totalScore}%`;
  const knownScores = partial.pillarScores.filter(score => score != null);
  const fallback = knownScores.length
    ? Math.round(knownScores.reduce((a, b) => a + b, 0) / knownScores.length)
    : 50;
  const personaScores = partial.pillarScores.map(score => score ?? fallback);
  const persona = derivePersona(personaScores);
  livePulsePersona.textContent = persona.title;
}

function updateQuestion() {
  const { section, questionIndex } = getCurrentSection();
  sectionEyebrow.textContent = section.label;
  sectionTitle.textContent = section.name;
  questionText.textContent = section.questions[questionIndex];
  questionCounter.textContent = `Question ${state.currentIndex + 1} of ${totalQuestions}`;

  [...scaleOptions.children].forEach((btn, idx) => {
    const selected = state.answers[state.currentIndex] === idx + 1;
    btn.classList.toggle('selected', selected);
  });

  prevBtn.disabled = state.currentIndex === 0;
  nextBtn.textContent = state.currentIndex === totalQuestions - 1 ? 'View Results' : 'Next';
  updateProgress();
  updateLivePulse();
  persistState();
}

function selectAnswer(value) {
  state.answers[state.currentIndex] = value;
  [...scaleOptions.children].forEach((btn, idx) => {
    btn.classList.toggle('selected', idx + 1 === value);
  });
  updateLivePulse();
  persistState();
}

function goNext() {
  if (state.answers[state.currentIndex] == null) {
    scaleOptions.classList.add('shake');
    setTimeout(() => scaleOptions.classList.remove('shake'), 400);
    return;
  }

  if (state.currentIndex < totalQuestions - 1) {
    state.currentIndex += 1;
    updateQuestion();
  } else {
    showResults();
  }
}

function goPrev() {
  if (state.currentIndex > 0) {
    state.currentIndex -= 1;
    updateQuestion();
  }
}

function animateScore(score) {
  const duration = 1000;
  const start = performance.now();
  const circumference = 2 * Math.PI * 64;

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.round(progress * score);
    totalScoreEl.textContent = value;
    const offset = circumference - (value / 100) * circumference;
    scoreArc.style.strokeDasharray = circumference;
    scoreArc.style.strokeDashoffset = offset;
    if (progress < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

function buildPillars(scores) {
  pillarGrid.innerHTML = '';
  sections.forEach((section, index) => {
    const card = document.createElement('div');
    card.className = 'pillar-card';

    const top = document.createElement('div');
    top.className = 'pillar-top';
    const title = document.createElement('div');
    title.textContent = section.name;
    const score = document.createElement('div');
    score.className = 'pillar-score';
    score.textContent = `${scores[index]}%`;
    top.append(title, score);

    const verdict = document.createElement('p');
    verdict.className = 'pillar-verdictext';
    verdict.textContent = pillarVerdict(scores[index]);

    card.append(top, verdict);
    pillarGrid.appendChild(card);
  });
}

function populateList(listEl, items) {
  listEl.innerHTML = '';
  items.forEach(text => {
    const li = document.createElement('li');
    li.textContent = text;
    listEl.appendChild(li);
  });
}

function renderRecap() {
  recapList.innerHTML = '';
  let offset = 0;
  sections.forEach(section => {
    const answers = state.answers.slice(offset, offset + section.questions.length);
    const card = document.createElement('div');
    card.className = 'recap__card';

    const header = document.createElement('div');
    header.className = 'recap__card__header';
    header.innerHTML = `<span class="tag">${section.label}</span><strong>${section.name}</strong>`;

    const list = document.createElement('ol');
    answers.forEach((value, idx) => {
      const item = document.createElement('li');
      item.innerHTML = `<span>${section.questions[idx]}</span><b>${value ?? '—'}</b>`;
      list.appendChild(item);
    });

    card.append(header, list);
    recapList.appendChild(card);
    offset += section.questions.length;
  });
}

function showResults() {
  const { pillarScores, totalScore } = calculateScores(state.answers);
  const tier = resolveTier(totalScore);
  const persona = derivePersona(pillarScores);
  const insights = deriveInsights(pillarScores);

  animateScore(totalScore);
  tierLabel.textContent = tier;
  buildPillars(pillarScores);
  populateList(strengthList, insights.strengths);
  populateList(opportunityList, insights.opportunities);
  personaTitle.textContent = persona.title;
  personaDescription.textContent = persona.description;
  renderRecap();
  resultsSection.classList.add('active');
  resultsSection.setAttribute('aria-hidden', 'false');
  progressLabel.textContent = 'Progress 100%';
  progressBar.style.width = '100%';
  resultsSection.scrollIntoView({ behavior: 'smooth' });
  persistState();
}

function handleEmailSave() {
  const value = emailInput.value.trim();
  if (!value) {
    emailStatus.textContent = 'Please add an email to save your PDF request.';
    return;
  }
  state.email = value;
  localStorage.setItem(EMAIL_KEY, value);
  emailStatus.textContent = 'Saved locally — we will notify you when PDF downloads are live.';
}

function handleSkipEmail() {
  emailInput.value = '';
  emailStatus.textContent = 'You can add your email later to receive a PDF copy.';
}

function persistState() {
  const payload = {
    answers: state.answers,
    currentIndex: state.currentIndex,
    email: state.email
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function restoreEmail() {
  const saved = localStorage.getItem(EMAIL_KEY);
  if (saved) {
    emailInput.value = saved;
    state.email = saved;
  }
}

function restoreState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.answers) && parsed.answers.length === totalQuestions) {
      state.answers = parsed.answers;
      state.currentIndex = parsed.currentIndex ?? 0;
      state.email = parsed.email ?? '';
      resumeStatus.textContent = 'Resumed from last session';
      return true;
    }
  } catch (err) {
    console.warn('Unable to restore saved state', err);
  }
  return false;
}

function resetAssessment() {
  state.answers = new Array(totalQuestions).fill(null);
  state.currentIndex = 0;
  state.email = '';
  localStorage.removeItem(STORAGE_KEY);
  updateQuestion();
  recapList.innerHTML = '';
  resumeStatus.textContent = 'Fresh session';
}

function handleKeydown(event) {
  if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;
  const value = Number(event.key);
  if (value >= 1 && value <= 5) {
    selectAnswer(value);
    return;
  }
  if (event.key === 'ArrowRight') {
    goNext();
  } else if (event.key === 'ArrowLeft') {
    goPrev();
  }
}

function attachListeners() {
  document.getElementById('startScanBtn').addEventListener('click', () => {
    document.getElementById('assessment').scrollIntoView({ behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', goNext);
  prevBtn.addEventListener('click', goPrev);
  document.getElementById('saveEmailBtn').addEventListener('click', handleEmailSave);
  document.getElementById('skipEmailBtn').addEventListener('click', handleSkipEmail);
  document.getElementById('resetBtn').addEventListener('click', resetAssessment);
  window.addEventListener('keydown', handleKeydown);
}

function init() {
  state.answers = new Array(totalQuestions).fill(null);
  initScale();
  const resumed = restoreState();
  restoreEmail();
  if (!resumed) resumeStatus.textContent = 'Fresh session';
  updateQuestion();
  attachListeners();
}

init();
