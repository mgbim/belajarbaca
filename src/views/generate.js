import { getState, setState } from '../state.js';
import { TOPIC_SUGGESTIONS, ONBOARDING_OPTIONS } from '../content.js';
import { generateContentStream, generateSuggestions } from '../ai.js';

// Indonesian words that stay lowercase in title case
const TITLE_CASE_LOWERS = ['di', 'ke', 'dari', 'dan', 'atau', 'untuk', 'yang', 'dengan', 'pada', 'dalam', 'oleh', 'sebagai', 'bagi', 'beserta'];
// Indonesian acronyms that stay fully uppercase
const TITLE_CASE_UPPERS = ['ri', 'ai', 'ikn', 'sd', 'smp', 'sma', 'wib', 'wita', 'wit', 'kuhp', 'bipa'];

function toTitleCase(text) {
  return text.trim().split(' ').map((word, i) => {
    if (!word) return word;
    const lower = word.toLowerCase();
    const clean = lower.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
    if (i !== 0 && TITLE_CASE_LOWERS.includes(lower)) return lower;
    if (TITLE_CASE_UPPERS.includes(clean)) return word.toUpperCase();
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
}

export function renderGenerate(container) {
  const categories = ['Semua', ...new Set(TOPIC_SUGGESTIONS.map(t => t.category))];

  // Sort by user's preferred interest category
  const userInterestId = getState().profile?.interest;
  let sortCategory = 'Semua';
  if (userInterestId) {
    const found = ONBOARDING_OPTIONS.interests.find(i => i.id === userInterestId);
    if (found && categories.includes(found.label)) sortCategory = found.label;
  }

  const sortedSuggestions = [...TOPIC_SUGGESTIONS].sort((a, b) => {
    if (sortCategory === 'Semua') return 0;
    if (a.category === sortCategory && b.category !== sortCategory) return -1;
    if (b.category === sortCategory && a.category !== sortCategory) return 1;
    return 0;
  });

  container.innerHTML = `
    <div class="generate" role="region" aria-label="Pilih Topik Bacaan">
      <div class="generate__hero">
        <h1 class="generate__title">Apa yang ingin Anda baca? <span class="generate__title-emoji">👋</span></h1>
        <p class="generate__subtitle">Ketik topik apa saja atau pilih dari inspirasi di bawah ini.</p>

        <div class="generate__input-wrap">
          <label for="topic-input" class="sr-only">Masukkan topik bacaan</label>
          <input id="topic-input" class="generate__input" type="text"
                 placeholder="Tradisi unik masyarakat adat Baduy..."
                 autocomplete="off" />
          <button class="generate__submit" aria-label="Generate teks" data-action="submit" data-tooltip="Kirim">
            <span class="material-symbols-outlined">arrow_upward</span>
          </button>
        </div>
      </div>

      <div class="generate__filters" aria-label="Filter kategori" role="group">
        ${categories.map(cat => `
          <button class="generate__filter-chip ${cat === 'Semua' ? 'active' : ''}" data-category="${cat}" aria-pressed="${cat === 'Semua' ? 'true' : 'false'}">${cat}</button>
        `).join('')}
      </div>

      <div class="generate__toolbar">
        <div class="generate__search">
          <span class="material-symbols-outlined" aria-hidden="true">search</span>
          <label for="collection-search" class="sr-only">Cari koleksi topik</label>
          <input type="text" id="collection-search" placeholder="Cari judul, kategori, atau topik..." aria-label="Cari judul, kategori, atau topik" />
        </div>
        <div class="generate__toolbar-actions">
          <div class="generate__collection-count" id="collection-count" style="font-size: 0.875rem; color: var(--text-secondary); margin-right: var(--space-2); font-weight: 500;">
            ${sortedSuggestions.length} koleksi
          </div>

          <div class="generate__view-toggle" role="group" aria-label="Pilih Tampilan">
            <span class="generate__view-label" aria-hidden="true">Tampilan:</span>
            <button class="generate__view-btn active" data-view="grid" title="Grid" aria-label="Tampilan Grid" aria-pressed="true">
              <span class="material-symbols-outlined" aria-hidden="true">grid_view</span>
            </button>
            <button class="generate__view-btn" data-view="list" title="Daftar" aria-label="Tampilan Daftar" aria-pressed="false">
              <span class="material-symbols-outlined" aria-hidden="true">menu</span>
            </button>
            <button class="generate__view-btn" data-view="compact" title="Ringkas" aria-label="Tampilan Ringkas" aria-pressed="false">
              <span class="material-symbols-outlined" aria-hidden="true">view_headline</span>
            </button>
          </div>
        </div>
      </div>

      <div class="generate__collection-wrap">
        <button class="generate__nav-btn generate__nav-btn--left hidden" aria-label="Geser ke kiri">
          <span class="material-symbols-outlined">chevron_left</span>
        </button>
        <div class="generate__grid" id="generate-collection" aria-label="Saran topik">
          ${sortedSuggestions.map(t => `
            <button class="generate__card" data-topic="${t.title}" data-category="${t.category}" style="--theme-color: var(--color-primary); display: flex;" aria-label="${t.title}, Kategori: ${t.category}">
              <div class="generate__card-top" aria-hidden="true">
                <div class="generate__card-meta" style="color: var(--theme-color);">
                  <span class="material-symbols-outlined" style="font-size: 1.125rem;">${t.icon}</span>
                  <span>${t.category}</span>
                </div>
                <h3 class="generate__card-title">${t.title}</h3>
              </div>
              <div class="generate__card-bottom" style="background-color: var(--color-primary-glow);" aria-hidden="true">
                <span class="generate__card-emoji">${t.emoji}</span>
              </div>
            </button>
          `).join('')}
        </div>
        <button class="generate__nav-btn generate__nav-btn--right hidden" aria-label="Geser ke kanan">
          <span class="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>`;

  const input = container.querySelector('#topic-input');
  const submitBtn = container.querySelector('.generate__submit');
  const filterChips = container.querySelectorAll('.generate__filter-chip');
  const cards = container.querySelectorAll('.generate__card');
  const collectionSearch = container.querySelector('#collection-search');
  const viewBtns = container.querySelectorAll('.generate__view-btn');
  const collectionContainer = container.querySelector('#generate-collection');
  const navLeft = container.querySelector('.generate__nav-btn--left');
  const navRight = container.querySelector('.generate__nav-btn--right');

  // Carousel Navigation Logic
  function updateNavButtons() {
    if (collectionContainer.className !== 'generate__carousel') return;
    const { scrollLeft, scrollWidth, clientWidth } = collectionContainer;
    if (scrollLeft > 0) navLeft.classList.remove('hidden');
    else navLeft.classList.add('hidden');
    
    if (scrollLeft + clientWidth < scrollWidth - 1) navRight.classList.remove('hidden');
    else navRight.classList.add('hidden');
  }

  collectionContainer.addEventListener('scroll', updateNavButtons);
  window.addEventListener('resize', updateNavButtons);

  navLeft.addEventListener('click', () => {
    collectionContainer.scrollBy({ left: -300, behavior: 'smooth' });
  });
  navRight.addEventListener('click', () => {
    collectionContainer.scrollBy({ left: 300, behavior: 'smooth' });
  });

  // View Toggle Logic
  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viewBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      const view = btn.dataset.view;
      collectionContainer.className = `generate__${view}`;
      navLeft.classList.add('hidden');
      navRight.classList.add('hidden');
      
      // Re-render to handle category headers visibility (no headers in carousel/grid if desired, but we allow in grid/list)
      const cardsArr = Array.from(cards);
      renderCollection(cardsArr);
    });
  });

  function renderCollection(cardsArr) {
    collectionContainer.innerHTML = '';
    
    // Always render as a flat list
    cardsArr.forEach(c => {
      if (c.style.display !== 'none') collectionContainer.appendChild(c);
    });
  }

  // Unified Filtering Logic (Chips + Search)
  function filterCards() {
    const activeChip = container.querySelector('.generate__filter-chip.active');
    const cat = activeChip ? activeChip.dataset.category : 'Semua';
    const query = (collectionSearch.value || '').toLowerCase().trim();
    let visibleCount = 0;

    cards.forEach(card => {
      const cardCat = card.dataset.category;
      const cardTitle = card.dataset.topic.toLowerCase();
      
      const matchCat = cat === 'Semua' || cardCat === cat;
      const matchSearch = cardTitle.includes(query) || cardCat.toLowerCase().includes(query);
      
      if (matchCat && matchSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });
    
    const countEl = container.querySelector('#collection-count');
    if (countEl) {
      countEl.textContent = `${visibleCount} koleksi`;
    }
    
    // Re-render collection to handle grouping headers
    const cardsArr = Array.from(cards);
    renderCollection(cardsArr);
    updateNavButtons();
  }

  collectionSearch.addEventListener('input', filterCards);

  // Filter chips — click and keyboard nav
  filterChips.forEach((chip, index) => {
    const isActive = chip.classList.contains('active');
    chip.setAttribute('tabindex', isActive ? '0' : '-1');
    chip.setAttribute('aria-pressed', isActive ? 'true' : 'false');

    chip.addEventListener('keydown', (e) => {
      let next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (index + 1) % filterChips.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (index - 1 + filterChips.length) % filterChips.length;
      if (next !== null) { e.preventDefault(); filterChips[next].focus(); }
    });

    chip.addEventListener('click', () => {
      filterChips.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('tabindex', '-1');
        c.setAttribute('aria-pressed', 'false');
      });
      chip.classList.add('active');
      chip.setAttribute('tabindex', '0');
      chip.setAttribute('aria-pressed', 'true');
      chip.focus();

      filterCards();
    });
  });

  // Topic generation
  function startGeneration(topic) {
    if (!topic.trim()) return;
    const { profile } = getState();
    const titleCaseTopic = toTitleCase(topic);

    setState({ topic: titleCaseTopic, view: 'reader', aiContent: '', isStreaming: true });

    generateContentStream(
      titleCaseTopic,
      profile.level || 'B1',
      profile.interest || 'Umum',
      (chunk) => {
        const state = getState();
        setState({ aiContent: state.aiContent + chunk });
      },
      () => setState({ isStreaming: false }),
      (error) => setState({ isStreaming: false, aiContent: getState().aiContent + '\n\n[Error: ' + error + ']' })
    );
  }

  submitBtn.addEventListener('click', () => startGeneration(input.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') startGeneration(input.value);
  });

  // Topic cards — click and keyboard nav
  cards.forEach((card, index) => {
    card.setAttribute('tabindex', index === 0 ? '0' : '-1');

    card.addEventListener('keydown', (e) => {
      const visible = Array.from(cards).filter(c => c.style.display !== 'none');
      const vi = visible.indexOf(card);
      if (vi === -1) return;

      let next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (vi + 1) % visible.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (vi - 1 + visible.length) % visible.length;
      else if (e.key === 'Enter') { card.click(); e.preventDefault(); return; }

      if (next !== null) {
        e.preventDefault();
        visible.forEach(c => c.setAttribute('tabindex', '-1'));
        visible[next].setAttribute('tabindex', '0');
        visible[next].focus();
      }
    });

    card.addEventListener('click', () => {
      input.value = card.dataset.topic;
      startGeneration(card.dataset.topic);
    });
  });

  // Typewriter placeholder effect
  let placeholders = [
    "Kehidupan di desa Bali...",
    "Sejarah candi Borobudur...",
    "Resep nasi goreng...",
    "Olahraga pencak silat..."
  ];

  const currentProfile = getState().profile;
  generateSuggestions(currentProfile.level || 'B1', currentProfile.interest || 'Umum').then(suggestions => {
    if (suggestions?.length > 0) {
      placeholders = suggestions;
    }
  });

  let phIndex = 0, charIndex = 0, isDeleting = false;

  function typePlaceholder() {
    if (!input) return;
    const text = placeholders[phIndex];

    if (isDeleting) {
      input.setAttribute('placeholder', text.substring(0, --charIndex));
    } else {
      input.setAttribute('placeholder', text.substring(0, ++charIndex));
    }

    let speed = isDeleting ? 30 : 70;
    if (!isDeleting && charIndex === text.length) { speed = 2000; isDeleting = true; }
    else if (isDeleting && charIndex === 0) { isDeleting = false; phIndex = (phIndex + 1) % placeholders.length; speed = 500; }

    setTimeout(typePlaceholder, speed);
  }

  setTimeout(typePlaceholder, 1000);
  
  // Initial render with grouping
  renderCollection(Array.from(cards));
}
