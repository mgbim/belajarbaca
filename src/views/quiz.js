import { getState, setState } from '../state.js';
import { QUIZ_QUESTIONS } from '../content.js';

export function renderQuiz(container) {
  const { profile } = getState();

  const questionsHtml = QUIZ_QUESTIONS.map((q, i) => `
    <div class="quiz__question" data-index="${i}">
      <h3 class="quiz__prompt">${i + 1}. ${q.question}</h3>
      <div class="quiz__options" role="radiogroup" aria-label="Pertanyaan ${i + 1}">
        ${q.options.map((opt, j) => `
          <label class="quiz__option">
            <input type="radio" name="q${i}" value="${opt.correct}" data-feedback="${opt.feedback || ''}">
            <span class="quiz__option-text">${opt.text}</span>
          </label>
        `).join('')}
      </div>
      <div class="quiz__feedback" aria-live="polite"></div>
    </div>
  `).join('');

  container.innerHTML = `
    ${renderHeader(profile)}
    <div class="quiz" role="region" aria-label="Latihan Kuis">
      <div class="quiz__container">
        <h2 class="quiz__title">Latihan Pemahaman</h2>
        <p class="quiz__subtitle">Uji pemahaman Anda dari teks bacaan sebelumnya.</p>
        <div class="quiz__list">${questionsHtml}</div>
      </div>
    </div>`;

  bindQuizEvents(container);
}

function renderHeader(profile) {
  const tabs = [
    { id: 'reader', label: '📖 Immersive' },
    { id: 'slides', label: '📊 Slides' },
    { id: 'quiz', label: '✏️ Kuis' },
  ];

  return `
    <header class="app-header" role="banner">
      <a href="#" class="app-logo" data-action="home" aria-label="BelajarBaca beranda">
        <div class="app-logo__icon">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="isolation: isolate;">
            <title>Filosofi: Monogram "bb" (Belajar Baca) yang bersilangan membentuk kacamata, melambangkan fokus dan pembelajaran tanpa batas.</title>
            <g fill="none">
              <path d="M5 4V28" stroke="var(--color-primary)" stroke-width="4" stroke-linecap="round"/>
              <circle cx="11" cy="20" r="6" stroke="var(--color-primary)" stroke-width="4"/>
            </g>
            <g fill="none" style="mix-blend-mode: multiply;">
              <path d="M15 4V28" stroke="#38BDF8" stroke-width="4" stroke-linecap="round"/>
              <circle cx="21" cy="20" r="6" stroke="#38BDF8" stroke-width="4"/>
            </g>
          </svg>
        </div>
        <div class="app-logo__text">
          <span class="app-logo__text-belajar">Belajar</span><span class="app-logo__text-baca">Baca</span>
        </div>
      </a>
      <nav class="app-header__nav" role="tablist" aria-label="Mode tampilan">
        ${tabs.map(t => `
          <button class="app-header__tab" role="tab" aria-selected="${t.id === 'quiz'}" data-view="${t.id}">
            ${t.label}
          </button>
        `).join('')}
      </nav>
      <div class="app-header__profile">${profile.level || 'B1'}</div>
    </header>`;
}

function bindQuizEvents(container) {
  // Tab navigation
  container.querySelectorAll('.app-header__tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const view = tab.dataset.view;
      if (view && view !== 'quiz') setState({ view });
    });
  });

  container.querySelector('[data-action="home"]')?.addEventListener('click', (e) => {
    e.preventDefault();
    setState({ view: 'generate', activeSection: 0 });
  });

  // Quiz answer handling
  container.querySelectorAll('.quiz__question').forEach(qEl => {
    const radios = qEl.querySelectorAll('input[type="radio"]');
    const feedbackEl = qEl.querySelector('.quiz__feedback');

    radios.forEach(radio => {
      radio.addEventListener('change', () => {
        radios.forEach(r => r.disabled = true);
        const isCorrect = radio.value === 'true';
        const feedback = radio.dataset.feedback;

        // Highlight correct answer
        radios.forEach(r => {
          if (r.value === 'true') r.closest('.quiz__option').classList.add('quiz__option--correct');
        });
        if (!isCorrect) radio.closest('.quiz__option').classList.add('quiz__option--wrong');

        feedbackEl.innerHTML = `
          <div class="quiz__feedback-alert quiz__feedback-alert--${isCorrect ? 'success' : 'error'}">
            ${isCorrect ? '✅ Tepat sekali!' : '❌ Kurang tepat.'} ${feedback ? '<br>' + feedback : ''}
          </div>
        `;
        feedbackEl.style.display = 'block';
      });
    });
  });
}
