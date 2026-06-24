import { getState, setState } from '../state.js';
import { ONBOARDING_OPTIONS } from '../content.js';

const STEPS = [
  {
    key: 'welcome',
    isWelcome: true,
  },
  {
    key: 'l1',
    question: 'Apa bahasa ibu Anda? <span class="onboarding__title-emoji">😃</span>',
    hint: 'Pilih bahasa yang paling sering Anda gunakan sehari-hari',
    options: ONBOARDING_OPTIONS.languages,
    renderOption: (opt) => `
      <button class="onboarding__option" role="radio" aria-checked="false" tabindex="-1"
              aria-label="${opt.label}" data-value="${opt.id}">
        <span class="onboarding__option-icon" aria-hidden="true">
          ${opt.flagCode 
            ? `<img src="https://flagcdn.com/w160/${opt.flagCode}.png" alt="Bendera ${opt.label}" class="opt-flag-img">` 
            : `<span class="material-symbols-outlined opt-icon" aria-hidden="true">${opt.icon}</span>`}
        </span>
        ${opt.label}
      </button>`,
  },
  {
    key: 'level',
    question: 'Apa tingkat kemampuan bahasa Indonesia Anda? <span class="onboarding__title-emoji">🤔</span>',
    hint: 'Pilih yang paling mendekati kemampuan Anda saat ini',
    options: ONBOARDING_OPTIONS.levels,
    renderOption: (opt) => {
      // Split "A1 · Pemula" into "A1" and "Pemula" for cleaner typography
      const parts = opt.label.split(' · ');
      const code = parts[0];
      const title = parts[1] || '';
      return `
      <button class="onboarding__option" role="radio" aria-checked="false" tabindex="-1"
              aria-label="${opt.label}" data-value="${opt.id}">
        <span class="opt-level-code">${code}</span>
        <strong class="opt-level-title">${title}</strong>
        <span class="opt-level-desc">${opt.desc}</span>
      </button>`;
    },
  },
  {
    key: 'interest',
    question: 'Topik apa yang Anda minati? <span class="onboarding__title-emoji">🤩</span>',
    hint: 'Materi bacaan akan disesuaikan dengan minat Anda',
    options: ONBOARDING_OPTIONS.interests,
    renderOption: (opt) => `
      <button class="onboarding__option" role="radio" aria-checked="false" tabindex="-1"
              aria-label="${opt.label}" data-value="${opt.id}">
        <span class="onboarding__option-icon">
          <span class="material-symbols-outlined opt-icon" aria-hidden="true">${opt.icon}</span>
        </span>
        ${opt.label}
      </button>`,
  },
];

function renderDots(currentStep) {
  const questionSteps = STEPS.filter(s => !s.isWelcome);
  const adjustedStep = currentStep - 1;
  return questionSteps.map((_, i) => {
    const active = i === adjustedStep ? ' onboarding__dot--active' : '';
    return `<div class="onboarding__dot${active}" aria-hidden="true"></div>`;
  }).join('');
}

export function renderOnboarding(container) {
  const { onboardingStep, profile } = getState();
  const step = STEPS[onboardingStep];

  if (step.isWelcome) {
    container.innerHTML = `
      <div class="onboarding" role="region" aria-label="Selamat Datang" style="justify-content: center; padding-top: 0; min-height: 100vh; position: relative; overflow: hidden; background: var(--surface-default);">
        
        <div class="welcome-container">
          <div style="margin-bottom: 2rem;">
            <svg width="80" height="80" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="isolation: isolate; margin: 0 auto; overflow: visible;">
              <title>BelajarBaca Logo</title>
              <g fill="none" style="animation: slideRight 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;">
                <path d="M5 4V28" stroke="var(--color-primary)" stroke-width="4" stroke-linecap="round" stroke-dasharray="100" stroke-dashoffset="100" style="animation: drawLogoPath 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;"/>
                <circle cx="11" cy="20" r="6" stroke="var(--color-primary)" stroke-width="4" style="opacity: 0; transform-origin: 11px 20px; animation: connectLogoNodes 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.8s forwards;"/>
              </g>
              <g fill="none" style="mix-blend-mode: multiply; animation: slideLeft 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;">
                <path d="M15 4V28" stroke="#38BDF8" stroke-width="4" stroke-linecap="round" stroke-dasharray="100" stroke-dashoffset="100" style="animation: drawLogoPath 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.4s forwards;"/>
                <circle cx="21" cy="20" r="6" stroke="#38BDF8" stroke-width="4" style="opacity: 0; transform-origin: 21px 20px; animation: connectLogoNodes 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 1.2s forwards;"/>
              </g>
            </svg>
          </div>
          <h1 class="welcome-title">
            Belajar<span>Baca</span>
          </h1>
          <p class="welcome-tagline">Belajar berbahasa, belajar berbudaya</p>
          
          <button class="btn btn--primary btn--lg welcome-btn" data-action="next-welcome">
            Mulai Sekarang →
          </button>
        </div>
      </div>
    `;
    
    container.querySelector('[data-action="next-welcome"]').addEventListener('click', () => {
      setState({ onboardingStep: onboardingStep + 1 });
    });
    return;
  }

  const selectedValue = profile[step.key];

  container.innerHTML = `
    <div class="onboarding" role="region" aria-label="Pengaturan Profil">
      
      <div class="onboarding__header">
        <h2 class="onboarding__question">${step.question}</h2>
        <p class="onboarding__hint">${step.hint}</p>
      </div>

      <div class="onboarding__step">
        <div class="onboarding__grid" role="radiogroup" aria-label="${step.question.replace(/<[^>]*>?/gm, '')}">
          ${step.options.map(step.renderOption).join('')}
        </div>

        <div class="onboarding__actions">
          ${onboardingStep > 0
            ? '<button class="btn btn--ghost" data-action="back">← Kembali</button>'
            : '<div class="onboarding__spacer"></div>'}
          <button class="btn btn--primary" data-action="next" ${selectedValue ? '' : 'disabled aria-disabled="true"'}>Lanjut →</button>
        </div>

        <div class="onboarding__progress" aria-label="Langkah ${onboardingStep} dari ${STEPS.length - 1}">
          ${renderDots(onboardingStep)}
        </div>
      </div>
    </div>`;

  // Mark previously selected option
  const optionsList = Array.from(container.querySelectorAll('.onboarding__option'));
  let hasSelection = false;
  if (selectedValue) {
    const selected = container.querySelector(`[data-value="${selectedValue}"]`);
    if (selected) {
      selected.setAttribute('aria-pressed', 'true');
      selected.setAttribute('aria-checked', 'true');
      selected.setAttribute('tabindex', '0');
      hasSelection = true;
    }
  }
  if (!hasSelection && optionsList.length > 0) {
    optionsList[0].setAttribute('tabindex', '0');
  }

  bindOnboardingEvents(container, step, optionsList);
}

function bindOnboardingEvents(container, step, options) {
  // Option selection & keyboard nav
  options.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      const isAlreadySelected = btn.getAttribute('aria-pressed') === 'true';

      if (isAlreadySelected) {
        // If they click or press Enter on an already selected option, treat it as "Next"
        const nextBtn = container.querySelector('[data-action="next"]');
        if (nextBtn && !nextBtn.hasAttribute('disabled')) {
          nextBtn.click();
        }
        return;
      }

      options.forEach(b => {
        b.setAttribute('aria-pressed', 'false');
        b.setAttribute('aria-checked', 'false');
        b.setAttribute('tabindex', '-1');
      });
      btn.setAttribute('aria-pressed', 'true');
      btn.setAttribute('aria-checked', 'true');
      btn.setAttribute('tabindex', '0');
      btn.focus();

      const profile = { ...getState().profile, [step.key]: btn.dataset.value };
      setState({ profile });

      // Enable the next button
      const nextBtn = container.querySelector('[data-action="next"]');
      if (nextBtn) {
        nextBtn.removeAttribute('disabled');
        nextBtn.removeAttribute('aria-disabled');
      }
    });

    // Keyboard navigation for radiogroup
    btn.addEventListener('keydown', (e) => {
      let nextIndex = index;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextIndex = (index + 1) % options.length;
        e.preventDefault();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        nextIndex = (index - 1 + options.length) % options.length;
        e.preventDefault();
      }

      if (nextIndex !== index) {
        options[nextIndex].focus();
        options[nextIndex].click(); // Select automatically like standard radio
      }
    });
  });

  // Navigation
  container.querySelector('[data-action="next"]')?.addEventListener('click', () => {
    const { onboardingStep, profile } = getState();
    if (!profile[step.key]) return;

    if (onboardingStep < STEPS.length - 1) {
      setState({ onboardingStep: onboardingStep + 1 });
    } else {
      setState({ view: 'generate' });
    }
  });

  container.querySelector('[data-action="back"]')?.addEventListener('click', () => {
    const { onboardingStep } = getState();
    if (onboardingStep > 0) setState({ onboardingStep: onboardingStep - 1 });
  });
}
