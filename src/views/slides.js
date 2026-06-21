import { getState, setState } from '../state.js';
import { READING_CONTENT } from '../content.js';

export function renderSlides(container) {
  const { activeSection, profile } = getState();
  const content = READING_CONTENT;
  const section = content.sections[activeSection];
  const total = content.sections.length;

  container.innerHTML = `
    ${renderHeader(profile, 'slides')}
    <div class="slides" role="region" aria-label="Tampilan Slide">
      <div class="slides__container">
        <div class="slides__card">
          <div class="slides__progress" aria-label="Slide ${activeSection + 1} dari ${total}">
             ${activeSection + 1} / ${total}
          </div>
          <h2 class="slides__title">${section.title}</h2>
          
          <div class="slides__content">
            ${section.paragraphs.map(p => `<p>${p.text.replace(/<v[^>]*>(.*?)<\/v>/g, '$1')}</p>`).join('')}
          </div>
          
          ${section.culturalNote ? `
            <div class="slides__note">
              <strong>🌏 Fakta Budaya:</strong> ${section.culturalNote.text}
            </div>
          ` : ''}
        </div>

        <div class="slides__controls">
          <button class="btn btn--ghost" data-action="prev" ${activeSection === 0 ? 'disabled' : ''}>
            ← Sebelumnya
          </button>
          <button class="btn btn--primary" data-action="next" ${activeSection === total - 1 ? 'disabled' : ''}>
            Selanjutnya →
          </button>
        </div>
      </div>
    </div>`;

  bindSlideEvents(container, total);
}

function renderHeader(profile, activeTab) {
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
          <button class="app-header__tab" role="tab" aria-selected="${t.id === activeTab}" data-view="${t.id}">
            ${t.label}
          </button>
        `).join('')}
      </nav>
      <div class="app-header__profile">${profile.level || 'B1'}</div>
    </header>`;
}

function bindSlideEvents(container, total) {
  // Tab navigation
  container.querySelectorAll('.app-header__tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const view = tab.dataset.view;
      if (view && view !== 'slides') setState({ view });
    });
  });

  container.querySelector('[data-action="home"]')?.addEventListener('click', (e) => {
    e.preventDefault();
    setState({ view: 'generate', activeSection: 0 });
  });

  container.querySelector('[data-action="prev"]')?.addEventListener('click', () => {
    const { activeSection } = getState();
    if (activeSection > 0) setState({ activeSection: activeSection - 1 });
  });

  container.querySelector('[data-action="next"]')?.addEventListener('click', () => {
    const { activeSection } = getState();
    if (activeSection < total - 1) setState({ activeSection: activeSection + 1 });
  });
}
