import { getState, setState, subscribe } from '../state.js';
import { READING_CONTENT, GLOSSARY, ONBOARDING_OPTIONS, TOPIC_SUGGESTIONS } from '../content.js';
import { generateChatResponse } from '../ai.js';

// --- Constants ---

// Constants removed to use CSS classes instead

const CATEGORY_ICON = {
  kuliner: 'restaurant', makanan: 'restaurant',
  seni: 'palette', budaya: 'theater_comedy', asmat: 'theater_comedy', adat: 'theater_comedy',
  cerita: 'menu_book', rakyat: 'menu_book',
  sejarah: 'history_edu',
  alam: 'park', wisata: 'park', papua: 'park', pariwisata: 'park',
  olahraga: 'sports_soccer',
  teknologi: 'computer',
  musik: 'music_note',
  geografi: 'public',
  sosiologi: 'groups',
  infrastruktur: 'architecture',
  default: 'book'
};

function getCategoryIcon(category) {
  if (!category) return CATEGORY_ICON.default;
  const words = category.toLowerCase().split(/\s+/);
  for (const word of words) {
    if (CATEGORY_ICON[word]) return CATEGORY_ICON[word];
  }
  return CATEGORY_ICON.default;
}

const TOOLTIP_STYLE = `
<style>
  .badge-tooltip { position: relative; cursor: pointer; outline: none; }
  .badge-tooltip .tooltip-text {
    visibility: hidden; background: #334155; color: #fff; text-align: center;
    padding: 6px 12px; border-radius: 6px; position: absolute; z-index: 100;
    top: 130%; left: 50%; transform: translateX(-50%) translateY(4px);
    opacity: 0; transition: opacity 0.2s, transform 0.2s;
    font-size: 0.75rem; font-weight: 500; white-space: nowrap;
    pointer-events: none; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
  }
  .badge-tooltip .tooltip-text::after {
    content: ""; position: absolute; bottom: 100%; left: 50%; margin-left: -5px;
    border-width: 5px; border-style: solid; border-color: transparent transparent #334155 transparent;
  }
  .badge-tooltip:hover .tooltip-text,
  .badge-tooltip:focus .tooltip-text,
  .badge-tooltip:active .tooltip-text {
    visibility: visible; opacity: 1; transform: translateX(-50%) translateY(0);
  }
</style>`;

// --- Main Render ---

export function renderReader(container) {
  const { activeSection, profile, isStreaming, aiContent, topic } = getState();
  const content = READING_CONTENT;
  const section = content.sections[activeSection];
  
  // Preload voices
  if (window.speechSynthesis && window.speechSynthesis.onvoiceschanged === null) {
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }


  if (isStreaming || aiContent) {
    container.innerHTML = `
      ${renderHeader(content, profile)}
      <div class="reader">
        <aside class="reader__sidebar reader__sidebar--desktop" role="navigation" aria-label="Daftar Isi">
          <h2 class="reader__sidebar-title" style="margin-top: 0; display: flex; align-items: center; gap: 6px;">
            <span class="material-symbols-outlined" style="color: var(--color-primary); font-size: 20px;">format_list_bulleted</span>
            Daftar Isi
          </h2>
          <nav id="ai-toc-container-desktop" class="reader__toc">
            <div style="font-size: 0.9rem; color: var(--text-muted); padding: 0 16px;">Memuat daftar isi...</div>
          </nav>
        </aside>
        <main class="reader__main" id="reader-content" role="main" aria-label="Konten AI">
          <article class="reader-content">
            <div class="reader__title-container">
              <div id="ai-emoji-container" class="reader__emoji-container" style="${aiContent ? '' : 'display:none;'}"></div>
              <h1 class="reader__section-title">${topic}</h1>
            </div>
            
            <aside class="reader__sidebar reader__sidebar--mobile" role="navigation" aria-label="Daftar Isi">
              <h2 class="reader__sidebar-title" style="margin-top: 0; display: flex; align-items: center; gap: 6px;">
                <span class="material-symbols-outlined" style="color: var(--color-primary); font-size: 20px;">format_list_bulleted</span>
                Daftar Isi
              </h2>
              <nav id="ai-toc-container-mobile" class="reader__toc">
                <div style="font-size: 0.9rem; color: var(--text-muted); padding: 0 16px;">Memuat daftar isi...</div>
              </nav>
            </aside>

            <div class="reader-actions-container">
               <button id="btn-global-read-aloud" onclick="window.startReadAlongMode()" class="reader-action-btn reader-action-btn--primary">
                  <span class="material-symbols-outlined">record_voice_over</span> Mode Membaca Nyaring
               </button>
               <button onclick="if(window.openAiDiscussion) window.openAiDiscussion()" class="reader-action-btn reader-action-btn--secondary">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><line x1="12" y1="9" x2="12" y2="15"></line><line x1="9" y1="12" x2="15" y2="12"></line></svg> Teman Diskusi
               </button>
            </div>
            
            <div class="reader-section-block" style="border-radius: 12px; transition: background 0.3s; padding: 0; text-align: left; margin: 0; width: 100%;">
                <div class="ai-streaming-content" style="line-height: 1.8; font-size: 1.1rem; color: var(--text-primary); text-align: left;"></div>
            </div>
            <div id="ai-spinner-container" style="margin: 3rem auto; text-align: center; ${isStreaming ? '' : 'display:none;'}">
              <div class="loading__spinner"></div>
            </div>
          </article>
        </main>
      </div>`;
    bindReaderEvents(container);
    updateStreamingDOM({ aiContent, isStreaming });
    return;
  }

  container.innerHTML = `
    ${renderHeader(content, profile)}
    <div class="reader">
      ${renderSidebar(content.sections, activeSection, 'reader__sidebar--desktop')}
      <main class="reader__main" id="reader-content" role="main" aria-label="Konten Bacaan">
        ${renderSection(section, content.sections, activeSection)}
      </main>
    </div>`;

  bindReaderEvents(container);
}

// --- Streaming DOM Update ---

subscribe(['aiContent', 'isStreaming'], (state) => updateStreamingDOM(state));

function updateStreamingDOM({ aiContent, isStreaming }) {
  const contentBox = document.querySelector('.ai-streaming-content');
  if (!contentBox) return;

  // Extract leading emoji
  let displayEmoji = '';
  let displayText = aiContent || '';
  const lines = displayText.trimStart().split('\n');

  if (lines[0] && /^[\p{Emoji}\s]+$/u.test(lines[0])) {
    displayEmoji = lines[0].trim();
    displayText = lines.slice(1).join('\n').trimStart();
  } else {
    const match = /^([\p{Emoji}]+)\s*(.*)/us.exec(displayText);
    if (match) { displayEmoji = match[1]; displayText = match[2]; }
  }

  // Update emoji display
  const emojiContainer = document.getElementById('ai-emoji-container');
  if (emojiContainer) {
    if (displayEmoji) {
      if (emojiContainer.innerText !== displayEmoji) {
        emojiContainer.innerText = displayEmoji;
        emojiContainer.style.display = 'flex';
      }
    } else {
      emojiContainer.style.display = 'none';
    }
  }

  // Register global scroll-to-section handler
  if (!window.highlightSection) {
    window.highlightSection = function(id) {
      window.isManualScrolling = true;
      document.querySelectorAll('div[id^="heading-"]').forEach(b => b.style.backgroundColor = 'transparent');
      const el = document.getElementById(id);
      if (el) {
        // Use native scrollIntoView which correctly respects scroll-margin-top CSS
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        el.style.backgroundColor = 'var(--color-primary-glow)';
        setTimeout(() => { el.style.backgroundColor = 'transparent'; }, 1500);
      }
      document.querySelectorAll('.reader__toc-link').forEach(link => {
        link.classList.remove('reader__toc-item--active');
      });
      document.querySelectorAll(`.reader__toc-link[onclick*="'${id}'"]`).forEach(activeLink => {
        activeLink.classList.add('reader__toc-item--active');
      });
      
      clearTimeout(window.scrollTimeout);
      window.scrollTimeout = setTimeout(() => {
        window.isManualScrolling = false;
      }, 1000);
    };
  }

  if (!window.updateTocObserver) {
    if (window.tocScrollHandler) {
      window.removeEventListener('scroll', window.tocScrollHandler);
    }
    window.tocScrollHandler = function() {
      if (window.isManualScrolling) return;
      
      const sections = Array.from(document.querySelectorAll('div[id^="heading-"]'));
      if (sections.length === 0) return;

      // Use a fixed focal point at 40% of the window height (minimum 250px)
      // This ensures middle sections in short documents have a chance to cross the focal point
      const focalY = Math.max(250, window.innerHeight * 0.4);

      let activeSection = sections[0];
      for (let i = 0; i < sections.length; i++) {
        const rect = sections[i].getBoundingClientRect();
        if (rect.top <= focalY) {
          activeSection = sections[i];
        } else {
          break;
        }
      }

      // Top of page override: if at absolute top, force first section
      if (window.scrollY < 50) {
        activeSection = sections[0];
      }

      // Bottom of page override: if we are at the absolute bottom, highlight the last visible section
      if (Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 10) {
        const lastRect = sections[sections.length - 1].getBoundingClientRect();
        if (lastRect.top < window.innerHeight - 50) {
          activeSection = sections[sections.length - 1];
        }
      }

      const activeId = activeSection.id;
      
      document.querySelectorAll('.reader__toc-link').forEach(link => {
        const onclickAttr = link.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(activeId)) {
          link.classList.add('reader__toc-item--active');
          // Ensure active item stays visible in scrollable TOC containers
          const container = link.closest('.reader__toc');
          if (container) {
            const linkRect = link.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            if (linkRect.top < containerRect.top || linkRect.bottom > containerRect.bottom) {
              container.scrollTop += (linkRect.top - containerRect.top) - (containerRect.height / 2) + (linkRect.height / 2);
            }
          }
        } else {
          link.classList.remove('reader__toc-item--active');
        }
      });
    };
    window.addEventListener('scroll', window.tocScrollHandler, { passive: true });
    
    window.updateTocObserver = function() {
      window.tocScrollHandler();
    };
  }

  // Commented out: Remove leading topic/title heading to preserve it in TOC
  // const firstLineMatch = displayText.match(/^\s*(?:#+|\*\*)\s*(.+?)\s*(?:\*\*|)\s*(\n|$)/);
  // if (firstLineMatch) {
  //     displayText = displayText.substring(firstLineMatch[0].length).trimStart();
  // }

  // Split by markdown headings, build TOC and formatted content
  let tocHtml = '';
  let headingIndex = 0;
  let globalParaIdx = 0;
  const sections = displayText.split(/\n*(?:#{1,4})\s+(.*?)(?=\n|$)\n*/g);

  // Preamble (text before first heading)
  let formattedText = formatMarkdownWithParagraphs(sections[0].trim(), () => globalParaIdx++);

  for (let i = 1; i < sections.length; i += 2) {
    headingIndex++;
    let title = sections[i] || '';
    // Normalize heading to sentence case
    if (title.length > 0) {
      title = title.replace(/^([^a-zA-Z]*)([a-zA-Z])(.*)/, (_, prefix, first, rest) => prefix + first.toUpperCase() + rest);
      title = formatMarkdown(title);
    }

    const id = `heading-${headingIndex}`;
    const body = formatMarkdownWithParagraphs((sections[i + 1] || '').trim(), () => globalParaIdx++);

    tocHtml += `<button class="reader__toc-item reader__toc-link" onclick="event.preventDefault(); window.highlightSection('${id}')">${title}</button>`;
    formattedText += `<div id="${id}" style="scroll-margin-top: 100px; padding: 4px 0; transition: all 0.8s ease; margin: 0 0 1rem 0; width: 100%; font-size: 1.05rem; line-height: 1.75; text-align: left;">${body}</div>`;
  }

  // Update TOC
  const tocContainerDesktop = document.getElementById('ai-toc-container-desktop');
  const tocContainerMobile = document.getElementById('ai-toc-container-mobile');
  
  if (tocHtml) {
    if (tocContainerDesktop && tocContainerDesktop.innerHTML !== tocHtml) tocContainerDesktop.innerHTML = tocHtml;
    if (tocContainerMobile && tocContainerMobile.innerHTML !== tocHtml) tocContainerMobile.innerHTML = tocHtml;
  } else if (!isStreaming) {
    const html = '<div style="font-size: 0.9rem; color: var(--text-muted); padding: 0 16px;">Tidak ada daftar isi.</div>';
    if (tocContainerDesktop) tocContainerDesktop.innerHTML = html;
    if (tocContainerMobile) tocContainerMobile.innerHTML = html;
  }

  if (contentBox.innerHTML !== formattedText) contentBox.innerHTML = formattedText;

  const spinner = document.getElementById('ai-spinner-container');
  if (spinner) spinner.style.display = isStreaming ? 'block' : 'none';

  if (!isStreaming && window.updateTocObserver) {
    setTimeout(window.updateTocObserver, 100);
  }
}

// --- Markdown Formatter ---

function formatMarkdownWithParagraphs(text, getIdx) {
  if (!text) return '';
  let cleanText = text.replace(/<br\s*\/?>/gi, '\n\n').replace(/\n[ \t]+\n/g, '\n\n').replace(/\n{3,}/g, '\n\n').trim();
  const blocks = cleanText.split(/\n\n+/);
  return blocks.map(block => {
    if (block.match(/^(?:[*-]\s+|\d+\.\s+)/)) {
      return formatMarkdown(block);
    } else {
      const idx = getIdx();
      const pText = formatMarkdown(block);
      return `<p class="reader__paragraph" id="paragraph-text-${idx}" style="margin-bottom: 0.8rem; line-height: 1.7;">${formatVocab(pText)}</p>`;
    }
  }).join('\n');
}

function formatMarkdown(text) {
  if (!text) return '';
  let parsed = text
    .replace(/\*\*(.*?)\*\*/g, '$1')           // strip bold
    .replace(/__(.*?)__/g, '$1')                // strip bold alt
    .replace(/(?<!\*)\*(?!\s)(.*?)(?<!\s)\*(?!\*)/g, '<i>$1</i>')  // italic
    .replace(/\b_(.*?)_\b/g, '<i>$1</i>');      // italic alt

  // Unordered lists
  parsed = parsed.replace(/^(?:[*-]\s+.*(?:\n|$))+/gm, (match) => {
    const items = match.trim().split('\n').map(line => `<li style="margin-bottom: 6px; padding-left: 4px;">${line.replace(/^[*-]\s+/, '')}</li>`).join('');
    return `<ul style="margin-left: 24px; list-style-type: disc; margin-bottom: 16px;">${items}</ul>`;
  });

  // Ordered lists
  parsed = parsed.replace(/^(?:\d+\.\s+.*(?:\n|$))+/gm, (match) => {
    const start = match.match(/^(\d+)\./)?.[1] || 1;
    const items = match.trim().split('\n').map(line => `<li style="margin-bottom: 6px; padding-left: 4px;">${line.replace(/^\d+\.\s+/, '')}</li>`).join('');
    return `<ol start="${start}" style="margin-left: 24px; list-style-type: decimal; margin-bottom: 16px;">${items}</ol>`;
  });

  return parsed;
}

// --- Header ---

function resolveCategory(topic, profile) {
  if (topic) {
    const found = TOPIC_SUGGESTIONS.find(t => t.title.toLowerCase() === topic.toLowerCase() || t.id === topic);
    if (found) return found.category;
    
    // Keyword-based fallback
    const t = topic.toLowerCase();
    if (t.includes('makan') || t.includes('kuliner') || t.includes('minum') || t.includes('resep')) return 'Kuliner';
    if (t.includes('seni') || t.includes('lukis') || t.includes('tari')) return 'Seni Rupa';
    if (t.includes('sejarah') || t.includes('kerajaan') || t.includes('pahlawan')) return 'Sejarah';
    if (t.includes('teknologi') || t.includes('digital') || t.includes('komputer')) return 'Teknologi';
    if (t.includes('budaya') || t.includes('tradisi') || t.includes('adat')) return 'Budaya';
  }
  if (profile.interest) {
    const interest = ONBOARDING_OPTIONS.interests.find(i => i.id === profile.interest);
    if (interest) return interest.label;
  }
  return 'Umum';
}

function resolveL1(profile) {
  const code = profile.l1 || 'en';
  if (code === 'other') {
    const label = profile.otherL1 || 'Lainnya';
    return {
      label,
      flagHtml: `<span style="font-size: 0.75rem; font-weight: 600; background: var(--bg-surface-hover); color: var(--text-secondary); padding: 2px 6px; border-radius: 4px; border: 1px solid var(--border-subtle);">${label}</span>`
    };
  }
  const opt = ONBOARDING_OPTIONS.languages.find(l => l.id === code) || ONBOARDING_OPTIONS.languages[0];
  const flagHtml = opt.flagCode
    ? `<img src="https://flagcdn.com/w80/${opt.flagCode}.png" alt="${opt.label}" style="width: 24px; height: 16px; object-fit: cover; border-radius: 3px; border: 1px solid rgba(0,0,0,0.1); box-shadow: 0 1px 2px rgba(0,0,0,0.05);">`
    : `<span class="material-symbols-outlined" style="font-size: 18px;">${opt.icon}</span>`;
  return { label: opt.label, flagHtml };
}

function renderHeader(content, profile) {
  const { topic } = getState();
  const category = resolveCategory(topic, profile);
  const l1 = resolveL1(profile);
  const levelCode = profile.level || 'B1';
  const levelOpt = ONBOARDING_OPTIONS.levels.find(l => l.id === levelCode) || ONBOARDING_OPTIONS.levels[0];
  const levelTitle = `${levelOpt.label} - ${levelOpt.desc}`;

  return `
    ${TOOLTIP_STYLE}
    <header class="app-header" role="banner" style="justify-content: center; padding: 0; align-items: center; position: relative; width: 100%;">
      <div class="app-header__inner">
        <div style="display: flex; align-items: center; gap: 32px;">
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
        </div>

        <div class="app-header__badges">
          <div class="badge-tooltip" tabindex="0" style="padding: 6px 16px; border-radius: 9999px; background: var(--color-primary-glow); color: var(--color-primary); font-weight: 600; font-size: 0.9rem; display: flex; align-items: center; gap: 8px;">
            <span class="material-symbols-outlined" style="font-size: 1.2rem;">${getCategoryIcon(category)}</span> ${category}
            <span class="tooltip-text">Kategori Minat: ${category}</span>
          </div>
          
          <div class="badge-tooltip" tabindex="0" style="padding: 6px 16px; border-radius: 9999px; background: var(--color-primary-glow); color: var(--color-primary); font-weight: 600; font-size: 0.9rem; display: flex; align-items: center; gap: 8px;">
            ${l1.flagHtml} <span>${l1.label}</span>
            <span class="tooltip-text">Bahasa Ibu: ${l1.label}</span>
          </div>

          <div class="badge-tooltip" tabindex="0" style="padding: 6px 16px; border-radius: 9999px; background: var(--color-primary-glow); color: var(--color-primary); font-weight: 700; font-size: 0.9rem; letter-spacing: 0.5px;">
            ${levelCode}
            <span class="tooltip-text">${levelTitle}</span>
          </div>
        </div>
      </div>
    </header>`;
}

// --- Static Reader Components ---

function renderSidebar(sections, activeIndex, extraClass = '') {
  const progress = Math.round(((activeIndex + 1) / sections.length) * 100);
  return `
    <aside class="reader__sidebar ${extraClass}" role="navigation" aria-label="Daftar Isi">
      <h2 class="reader__sidebar-title"><span class="material-symbols-outlined" style="vertical-align: middle; margin-right: 8px; color: var(--color-primary);">format_list_bulleted</span> Daftar Isi</h2>
      <ul class="reader__toc">
        ${sections.map((s, i) => `
          <li>
            <button class="reader__toc-item${i === activeIndex ? ' reader__toc-item--active' : ''}"
                    data-section="${i}" aria-current="${i === activeIndex ? 'true' : 'false'}">
              ${s.title}
            </button>
          </li>
        `).join('')}
      </ul>
      <div class="reader__progress-wrap">
        <div class="reader__progress-label"><span>Progres</span><span>${progress}%</span></div>
        <div class="reader__progress-bar" role="progressbar" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100">
          <div class="reader__progress-fill" style="width:${progress}%"></div>
        </div>
      </div>
    </aside>`;
}

function renderSection(section, allSections, activeIndex) {
  const paragraphs = section.paragraphs.map((p, idx) =>
    `<p class="reader__paragraph" id="paragraph-text-${idx}">${formatVocab(p.text)}</p>`
  ).join('');

  return `
    <article class="reader-content">
      <div class="reader__title-container" style="justify-content: flex-start; width: 100%;">
        <h1 class="reader__section-title" style="color: var(--color-primary); font-size: 2.5rem; margin: 0; text-align: left;">${section.title}</h1>
      </div>
      <div class="reader-actions-container" style="margin-top: 1rem;">
         <button id="btn-global-read-aloud" class="reader-action-btn reader-action-btn--primary">
            <span class="material-symbols-outlined">record_voice_over</span> Mode Membaca Nyaring
         </button>
         <button onclick="if(window.openAiDiscussion) window.openAiDiscussion()" class="reader-action-btn reader-action-btn--secondary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><line x1="12" y1="9" x2="12" y2="15"></line><line x1="9" y1="12" x2="15" y2="12"></line></svg> Teman Diskusi
         </button>
      </div>
      
      ${renderSidebar(allSections, activeIndex, 'reader__sidebar--mobile')}

      <div class="reader-section-block" style="margin-bottom: 3rem; border-radius: 12px; transition: background 0.3s; padding: 1rem 0; max-width: 850px; margin: 0; width: 100%; text-align: left;">
         ${paragraphs}
      </div>
      ${section.morphologyHighlight ? renderMorphology(section.morphologyHighlight) : ''}
      ${section.culturalNote ? renderCulturalNote(section.culturalNote) : ''}
      ${section.embeddedQuestion ? renderEmbeddedQuestion(section.embeddedQuestion) : ''}
    </article>`;
}

function formatVocab(html) {
  return html.replace(/<v data-word="(\w+)">(.+?)<\/v>/g,
    '<span class="vocab" tabindex="0" role="button" aria-label="Lihat arti: $2" data-word="$1">$2</span>'
  );
}

function renderMorphology(morph) {
  const parts = morph.parts.map(p => `<span class="morphology__part morphology__part--${p.type}">${p.text}</span>`);
  const explanations = morph.parts.map(p => `
    <div class="morphology__explain">
      <strong>${p.text}</strong>
      <span>${p.meaning}</span>
    </div>
  `).join('');

  return `
    <div class="morphology" role="region" aria-label="Urai kata: ${morph.word}">
      <div class="morphology__title"><span class="material-symbols-outlined" style="vertical-align: middle; margin-right: 8px;">abc</span> Urai Kata</div>
      <div class="morphology__breakdown">
        ${parts.join('<span class="morphology__plus">+</span>')}
        <span class="morphology__plus">=</span>
        <span class="morphology__part morphology__part--root" style="font-size:var(--text-base)">${morph.word}</span>
      </div>
      <div class="morphology__explanations">${explanations}</div>
    </div>`;
}

function renderCulturalNote(note) {
  return `
    <aside class="cultural-note" role="note" aria-label="Catatan budaya">
      <div class="cultural-note__label"><span class="material-symbols-outlined" style="vertical-align: middle; margin-right: 8px;">public</span> Catatan Budaya</div>
      <p class="cultural-note__text">${note.text}</p>
    </aside>`;
}

function renderEmbeddedQuestion(q) {
  const options = q.options.map((opt, i) => `
    <button class="embedded-q__option" data-index="${i}" data-correct="${opt.correct}">
      <span class="embedded-q__radio" aria-hidden="true"></span>
      ${opt.text}
    </button>
  `).join('');

  return `
    <div class="embedded-q" role="region" aria-label="Pertanyaan pemahaman">
      <div class="embedded-q__label"><span class="material-symbols-outlined" style="vertical-align: middle; margin-right: 8px;">help</span> Cek Pemahaman</div>
      <p class="embedded-q__text">${q.text}</p>
      <div class="embedded-q__options">${options}</div>
      <div class="embedded-q__feedback-slot"></div>
    </div>`;
}

// --- Event Bindings ---

function bindReaderEvents(container) {
  // Sidebar TOC navigation
  container.querySelectorAll('.reader__toc-item').forEach(btn => {
    btn.addEventListener('click', () => setState({ activeSection: parseInt(btn.dataset.section, 10) }));
  });

  // Home / Back
  container.querySelectorAll('[data-action="home"], [data-action="back"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.speechSynthesis?.cancel();
      setState({ view: 'generate', activeSection: 0, aiContent: '', isStreaming: false, topic: '' });
    });
    btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); } });
  });

  // Embedded question answer handling
  container.querySelectorAll('.embedded-q__option').forEach(opt => {
    opt.addEventListener('click', () => {
      const parent = opt.closest('.embedded-q');
      const allOpts = parent.querySelectorAll('.embedded-q__option');
      const feedbackSlot = parent.querySelector('.embedded-q__feedback-slot');
      const isCorrect = opt.dataset.correct === 'true';

      allOpts.forEach(o => { o.disabled = true; o.style.pointerEvents = 'none'; });
      allOpts.forEach(o => { if (o.dataset.correct === 'true') o.classList.add('embedded-q__option--correct'); });
      if (!isCorrect) opt.classList.add('embedded-q__option--wrong');

      const { activeSection } = getState();
      const feedbackText = READING_CONTENT.sections[activeSection].embeddedQuestion.feedback;

      feedbackSlot.innerHTML = `
        <div class="embedded-q__feedback embedded-q__feedback--${isCorrect ? 'correct' : 'wrong'}">
          ${isCorrect ? '<span class="material-symbols-outlined" style="vertical-align: middle; margin-right: 4px;">check_circle</span>' : '<span class="material-symbols-outlined" style="vertical-align: middle; margin-right: 4px;">cancel</span>'} ${isCorrect ? feedbackText : 'Kurang tepat. ' + feedbackText}
        </div>`;
    });
  });

  // Pronunciation practice handling using event delegation
  container.addEventListener('click', (e) => {
    const btnRa = e.target.closest('#btn-global-read-aloud');
    if (btnRa) {
        if (window.startReadAlongMode) {
            window.startReadAlongMode();
        }
    }
  });
}

// --- Read Along Mode Logic ---

let isReadAlongActive = false;
let raSentences = [];
let currentRaSentenceIdx = 0;
let raRecognition = null;
let isRaRecording = false;
let isAutoAdvancing = false;
let autoAdvanceTimeout = null;
let raSilenceTimer = null;
window.sessionMispronouncedWords = [];
let currentRaWordIdx = 0;
let isRaManuallyStopped = false;

// Simple Indonesian Syllabification (Pemenggalan Suku Kata)
function syllabifyIndonesian(word) {
    const clean = word.replace(/[^a-zA-Z-]/g, '').toLowerCase();
    if (clean.length <= 3) return word;
    
    // Basic approximation algorithm for Indonesian
    // V = aeiou, C = konsonan
    const vowels = 'aeiou';
    let res = '';
    let i = 0;
    while (i < clean.length) {
        res += clean[i];
        
        // Pola V-V (ex: ma-in)
        if (vowels.includes(clean[i]) && i + 1 < clean.length && vowels.includes(clean[i+1])) {
            // pengecualian diftong (ai, au, oi)
            const diphthong = clean[i] + clean[i+1];
            if (['ai', 'au', 'oi'].includes(diphthong)) {
                res += clean[i+1];
                i++;
                if (i + 1 < clean.length) res += '-';
            } else {
                res += '-';
            }
        } 
        // Pola V-CV (ex: a-nak) -> dipisah setelah V
        else if (vowels.includes(clean[i]) && i + 2 < clean.length && !vowels.includes(clean[i+1]) && vowels.includes(clean[i+2])) {
            res += '-';
        }
        // Pola VC-CV (ex: man-di) -> dipisah di antara C
        else if (i + 3 < clean.length && !vowels.includes(clean[i]) && vowels.includes(clean[i+1]) && !vowels.includes(clean[i+2]) && !vowels.includes(clean[i+3])) {
            // pengecualian gabungan konsonan (ny, ng, sy, pr, tr, dll)
            const cluster = clean[i+2] + clean[i+3];
            const validClusters = ['ny', 'ng', 'sy', 'kh', 'pr', 'tr', 'kr', 'bl', 'kl', 'pl', 'dr', 'br'];
            
            if (validClusters.includes(cluster)) {
                res += clean[i+1] + '-';
                i++;
            } else {
                res += clean[i+1] + clean[i+2] + '-';
                i += 2;
            }
        }
        i++;
    }
    
    // Cleanup trailing dashes
    res = res.replace(/-$/, '');
    // Kembalikan tanda baca jika ada
    const punctuationMatch = word.match(/([^a-zA-Z-]+)$/);
    if (punctuationMatch) {
        res += punctuationMatch[1];
    }
    return res || word;
}

window.startReadAlongMode = function() {
    if (isReadAlongActive) return;
    
    const paragraphs = document.querySelectorAll('.reader__paragraph');
    if (paragraphs.length === 0) return;
    
    isReadAlongActive = true;
    raSentences = [];
    currentRaSentenceIdx = 0;
    let sentenceGlobalIndex = 0;

    window.sessionMispronouncedWords = [];
    
    // Create Fullscreen Overlay
    const overlay = document.createElement('div');
    overlay.id = 'ra-overlay';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        width: 100vw; height: 100vh;
        background: var(--bg-surface);
        z-index: 9999;
    `;
    
    const title = document.querySelector('.reader__section-title') ? document.querySelector('.reader__section-title').textContent : 'Membaca Nyaring';
    
    let contentHtml = `
      <div class="ra-layout">
        <aside class="ra-sidebar">
            <div style="display:flex; align-items:center; justify-content:center; width: 100%;">
                <div style="display:flex; align-items:center; gap:8px;">
                    <span class="material-symbols-outlined" style="color: var(--color-primary); font-size: 24px;">psychology</span>
                    <span style="font-weight: 700; font-size: 1.1rem; color: var(--text-secondary); white-space: nowrap;">Analisis Pengucapan</span>
                </div>
            </div>
            
            <div class="ra-chart-donut" id="ra-chart-donut" style="background: none !important;">
                <svg width="140" height="140" viewBox="0 0 140 140" id="ra-chart-svg" style="position: absolute; top: 0; left: 0;">
                    <circle cx="70" cy="70" r="60" fill="none" stroke="var(--border-subtle)" stroke-width="12"></circle>
                    <circle id="ra-chart-circle" cx="70" cy="70" r="60" fill="none" stroke="var(--color-success)" stroke-width="12" stroke-dasharray="377" stroke-dashoffset="377" stroke-linecap="round" transform="rotate(-90 70 70)" style="transition: stroke-dashoffset 0.5s ease-out, stroke 0.5s;"></circle>
                </svg>
                <div class="ra-chart-value" style="z-index: 10;">
                    <span id="ra-diagnostic-percent" style="font-size:1.75rem; color:var(--text-primary); margin:0; font-weight: 800;">0%</span>
                    <span style="margin-top:-4px; font-size: 0.85rem; color: var(--text-muted);">Akurasi</span>
                </div>
            </div>
            
            <div style="font-size: 0.85rem; color: var(--text-muted); text-align: center;" id="ra-diagnostic-text">0 / 0 kata benar</div>
            
            <hr style="border-top: 1px solid var(--border-subtle); width: 100%; border-bottom: none; border-left: none; border-right: none;" />
            
            <div style="display:flex; flex-direction:column; gap: 8px;">
                <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); flex-shrink: 0;">Kata yang perlu diperbaiki:</div>
                <div class="ra-error-list" id="ra-error-list" style="display: flex; flex-direction: column; gap: 4px;">
                    <div style="font-size: 0.85rem; color: var(--text-muted); font-style: italic;">Belum ada kesalahan.</div>
                </div>
                
                <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); flex-shrink: 0; margin-top: 4px;">Kata yang terlewat:</div>
                <div class="ra-error-list" id="ra-skip-list" style="display: flex; flex-direction: column; gap: 4px;">
                    <div style="font-size: 0.85rem; color: var(--text-muted); font-style: italic;">Tidak ada yang terlewat.</div>
                </div>
            </div>
            
            <button onclick="window.generatePDFReport()" style="margin-top: 16px; width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--color-primary); background: rgba(11,87,208,0.05); color: var(--color-primary); font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; flex-shrink: 0; position: relative; z-index: 10;">
                <span class="material-symbols-outlined" style="font-size: 18px;">download</span>
                Unduh PDF Laporan
            </button>
            <div style="height: 180px; flex-shrink: 0; width: 100%;"></div>
        </aside>
        
        <main class="ra-main" id="ra-main-container">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 3rem;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <button class="btn-ra-back" id="ra-sidebar-open-btn" onclick="window.toggleRaSidebar()" title="Toggle Sidebar">
                        <span class="material-symbols-outlined">left_panel_close</span>
                    </button>
                    <button class="btn-ra-back" onclick="window.stopReadAlongMode()" aria-label="Tutup" title="Tutup">
                        <span class="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div class="ra-header-title">
                        <span class="material-symbols-outlined" style="color: var(--color-primary);">record_voice_over</span>
                        Mode Membaca Nyaring
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <button class="btn-ra-back" onclick="window.toggleFullscreen()" title="Layar Penuh">
                        <span class="material-symbols-outlined" id="ra-fullscreen-icon">fullscreen</span>
                    </button>
                </div>
            </div>
            
            <div class="ra-container">
          `;
    
    // Add title as the first readable sentence
    if (title && title !== 'Membaca Nyaring') {
        const titleSentences = title.match(/[^.!?]+[.!?]+/g) || [title];
        let titleHtml = '<h1 class="ra-title" style="margin-bottom: 3rem;">';
        
        titleSentences.forEach(sent => {
            const trimmed = sent.trim();
            if (!trimmed) return;
            
            raSentences.push(trimmed);
            const sid = sentenceGlobalIndex++;
            
            const wordsHtml = trimmed.split(' ').map((w, wIdx) => {
                return `<span class="ra-word" data-sid="${sid}" data-wid="${wIdx}" onclick="window.showRaTooltip(this, '${w}')">${w}</span>`;
            }).join(' ');
            
            titleHtml += `<span class="ra-sentence" id="ra-sent-${sid}">${wordsHtml}</span> `;
        });
        titleHtml += '</h1>';
        contentHtml += titleHtml;
    }
    
    paragraphs.forEach((p) => {
        const text = p.textContent.trim();
        if (!text) return;
        
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        let paragraphHtml = '<p style="margin-bottom: 2rem;">';
        
        sentences.forEach(sent => {
            const trimmed = sent.trim();
            if (!trimmed) return;
            
            raSentences.push(trimmed);
            const sid = sentenceGlobalIndex++;
            
            // Wrap words
            const wordsHtml = trimmed.split(' ').map((w, wIdx) => {
                return `<span class="ra-word" data-sid="${sid}" data-wid="${wIdx}" onclick="window.showRaTooltip(this, '${w}')">${w}</span>`;
            }).join(' ');
            
            paragraphHtml += `<span class="ra-sentence" id="ra-sent-${sid}">${wordsHtml}</span> `;
        });
        
        paragraphHtml += '</p>';
        contentHtml += paragraphHtml;
    });
    
    contentHtml += `</div></div>`;
    overlay.innerHTML = contentHtml;
    document.body.appendChild(overlay);
    
    // Inject Read Along Footer with SVGs
    const footer = document.createElement('div');
    footer.id = 'read-aloud-footer';
    footer.style.cssText = `
        position: absolute; bottom: 0; left: 0; right: 0;
        background: #ffffff;
        padding: 1rem 1rem calc(1.5rem + env(safe-area-inset-bottom)) 1rem;
        box-shadow: 0 -10px 40px rgba(0,0,0,0.08);
        z-index: 10000; display: flex; justify-content: center;
        border-top-left-radius: 24px; border-top-right-radius: 24px;
    `;
    
    const svgStop = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    const svgMic = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>`;
    const svgAi = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
    const svgPrev = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`;
    const svgNext = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`;

    footer.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 600px;">
          <div id="ra-mic-status" style="margin-bottom: 12px; font-size: 0.85rem; font-weight: 600; color: var(--text-muted); background: var(--bg-body); padding: 4px 12px; border-radius: 20px; border: 1px solid var(--border-subtle); display: flex; align-items: center; gap: 6px; transition: all 0.3s;">
              <span class="status-dot" style="display:inline-block; width:8px; height:8px; border-radius:50%; background:var(--text-muted); transition: all 0.3s;"></span>
              Mikrofon Mati
          </div>
          <div style="display: flex; gap: clamp(12px, 3vw, 24px); justify-content: center; align-items: center; width: 100%;">
             <button class="btn-ra-stop" style="width: 50px; height: 50px; border-radius: 50%; border: none; background: rgba(220, 38, 38, 0.1); color: var(--color-error); cursor: pointer; display: flex; justify-content: center; align-items: center; transition: all 0.2s; flex-shrink: 0;" title="Keluar Mode">
                ${svgStop}
             </button>
             
             <div style="display: flex; gap: 12px; align-items: center;">
                 <button class="btn-ra-prev" style="width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--border-subtle); background: white; color: var(--text-primary); cursor: pointer; display: flex; justify-content: center; align-items: center; flex-shrink: 0;" title="Kalimat Sebelumnya">
                    ${svgPrev}
                 </button>
                 
                 <button class="btn-ra-record" style="width: 72px; height: 72px; border-radius: 50%; border: none; background: var(--color-primary); color: white; cursor: pointer; display: flex; justify-content: center; align-items: center; box-shadow: 0 8px 24px rgba(11,87,208,0.4); transition: transform 0.2s; flex-shrink: 0;">
                    ${svgMic}
                 </button>
                 
                 <button class="btn-ra-next" style="width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--border-subtle); background: white; color: var(--text-primary); cursor: pointer; display: flex; justify-content: center; align-items: center; flex-shrink: 0;" title="Lompat Kalimat">
                    ${svgNext}
                 </button>
             </div>

             <button class="btn-ra-ai" style="width: 50px; height: 50px; border-radius: 50%; border: none; background: rgba(11, 87, 208, 0.1); color: var(--color-primary); cursor: pointer; display: flex; justify-content: center; align-items: center; transition: all 0.2s; flex-shrink: 0;" title="AI Contohkan Kalimat">
                ${svgAi}
             </button>
          </div>
      </div>
    `;
    overlay.appendChild(footer);
    
    // Event listeners for footer
    footer.querySelector('.btn-ra-stop').addEventListener('click', window.stopReadAlongMode);
    footer.querySelector('.btn-ra-record').addEventListener('click', (e) => window.toggleRaRecording(e.currentTarget));
    footer.querySelector('.btn-ra-prev').addEventListener('click', () => window.focusRaSentence(currentRaSentenceIdx - 1));
    footer.querySelector('.btn-ra-next').addEventListener('click', () => window.focusRaSentence(currentRaSentenceIdx + 1));
    footer.querySelector('.btn-ra-ai').addEventListener('click', () => window.playAiVoice());
    
    // Start by focusing first sentence
    window.focusRaSentence(0);
    window.updateRaDiagnostic();
};

window.updateRaDiagnostic = function() {
    const donut = document.getElementById('ra-chart-donut');
    const txt = document.getElementById('ra-diagnostic-text');
    const pct = document.getElementById('ra-diagnostic-percent');
    const errList = document.getElementById('ra-error-list');
    
    const words = document.querySelectorAll('.ra-sentence-active .ra-word');
    let correctCount = 0;
    words.forEach(w => {
        if(w.classList.contains('ra-word-correct')) correctCount++;
    });
    
    const percentage = words.length > 0 ? Math.round((correctCount / words.length) * 100) : 0;
    
    if(txt) txt.textContent = `${correctCount} / ${words.length} kata benar (saat ini)`;
    if(pct) pct.textContent = `${percentage}%`;
    
    let color = 'var(--color-error)';
    if (percentage > 80) {
        color = 'var(--color-success)';
    } else if (percentage > 40) {
        color = '#F59E0B';
    }
    
    const svgCircle = document.getElementById('ra-chart-circle');
    if (svgCircle) {
        const circumference = 2 * Math.PI * 60; // ~377
        const offset = circumference - (percentage / 100) * circumference;
        svgCircle.style.strokeDashoffset = offset;
        svgCircle.style.stroke = color;
    }
    if (pct) pct.style.color = color;
    
    // Update error list
    if (errList) {
        const struggles = window.sessionMispronouncedWords.filter(w => w.type !== 'skip');
        if (struggles.length === 0) {
            errList.innerHTML = `<div style="font-size: 0.85rem; color: var(--text-muted); font-style: italic;">Belum ada kesalahan.</div>`;
        } else {
            errList.innerHTML = struggles.map(w => {
                const speakWord = (w.clean || w.word).replace(/'/g, "\\'");
                return `
                <div class="ra-error-item" onclick="window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance('${speakWord}'); u.lang='id-ID'; u.rate=0.9; const v=window.getBestIndonesianVoice(); if(v) u.voice=v; window.speechSynthesis.speak(u);">
                    <span style="font-weight: 600;">${w.word}</span>
                    <span class="material-symbols-outlined">volume_up</span>
                </div>
            `}).join('');
        }
    }
    
    // Update skip list
    const skipList = document.getElementById('ra-skip-list');
    if (skipList) {
        const skips = window.sessionMispronouncedWords.filter(w => w.type === 'skip');
        if (skips.length === 0) {
            skipList.innerHTML = `<div style="font-size: 0.85rem; color: var(--text-muted); font-style: italic;">Tidak ada yang terlewat.</div>`;
        } else {
            skipList.innerHTML = skips.map(w => {
                const speakWord = (w.clean || w.word).replace(/'/g, "\\'");
                return `
                <div class="ra-skip-item" onclick="window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance('${speakWord}'); u.lang='id-ID'; u.rate=0.9; const v=window.getBestIndonesianVoice(); if(v) u.voice=v; window.speechSynthesis.speak(u);">
                    <span style="font-weight: 600;">${w.word}</span>
                    <span class="material-symbols-outlined">volume_up</span>
                </div>
            `}).join('');
        }
    }
};
window.toggleRaSidebar = function() {
    const sidebar = document.querySelector('.ra-sidebar');
    const openBtn = document.getElementById('ra-sidebar-open-btn');
    const mainContainer = document.getElementById('ra-main-container');
    if (!sidebar || !mainContainer) return;
    
    if (sidebar.style.display === 'none') {
        sidebar.style.display = 'flex';
        if (openBtn) openBtn.innerHTML = '<span class="material-symbols-outlined">left_panel_close</span>';
        mainContainer.style.borderLeft = '1px solid var(--border-subtle)';
    } else {
        sidebar.style.display = 'none';
        if (openBtn) openBtn.innerHTML = '<span class="material-symbols-outlined">left_panel_open</span>';
        mainContainer.style.borderLeft = 'none';
    }
};

window.toggleFullscreen = function() {
    const overlay = document.getElementById('ra-overlay');
    if (!overlay) return;
    
    const icon = document.getElementById('ra-fullscreen-icon');
    
    if (!document.fullscreenElement) {
        if (overlay.requestFullscreen) {
            overlay.requestFullscreen();
        } else if (overlay.webkitRequestFullscreen) { /* Safari */
            overlay.webkitRequestFullscreen();
        } else if (overlay.msRequestFullscreen) { /* IE11 */
            overlay.msRequestFullscreen();
        }
        if (icon) icon.textContent = 'fullscreen_exit';
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
        if (icon) icon.textContent = 'fullscreen';
    }
};

// Listen for ESC key fullscreen exit to update icon
document.addEventListener('fullscreenchange', () => {
    const icon = document.getElementById('ra-fullscreen-icon');
    if (icon) {
        icon.textContent = document.fullscreenElement ? 'fullscreen_exit' : 'fullscreen';
    }
});

window.stopReadAlongMode = function() {
    if (!isReadAlongActive) return;
    isReadAlongActive = false;
    
    if (isRaRecording && raRecognition) {
        raRecognition.stop();
        isRaRecording = false;
    }
    
    window.speechSynthesis.cancel();
    
    const footer = document.getElementById('read-aloud-footer');
    if (footer) footer.remove();
    
    const overlay = document.getElementById('ra-overlay');
    if (overlay) overlay.remove();
};

window.getBestIndonesianVoice = function() {
    const voices = window.speechSynthesis.getVoices();
    const indVoices = voices.filter(v => v.lang.includes('id'));
    return indVoices.find(v => v.name.includes('Microsoft') && v.name.includes('Online')) ||
           indVoices.find(v => v.name.includes('Google')) ||
           indVoices.find(v => v.name.includes('Online')) ||
           indVoices[0];
};

window.showRaTooltip = function(element, word, isError = false) {
    // Remove existing tooltip
    document.querySelectorAll('.ra-tooltip').forEach(t => t.remove());
    
    const syllables = syllabifyIndonesian(word);
    
    const tooltip = document.createElement('div');
    tooltip.className = 'ra-tooltip';
    
    if (isError) {
        tooltip.classList.add('ra-tooltip-error');
        tooltip.innerHTML = `<span style="font-size:0.85rem; font-weight:normal; display:block; margin-bottom:4px; opacity:0.9;">Oops! Coba ulangi:</span>${syllables}`;
    } else {
        tooltip.textContent = syllables;
    }
    
    element.appendChild(tooltip);
    
    // Play voice for the single word
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'id-ID';
        utterance.rate = 0.8; // a bit slower
        const voice = window.getBestIndonesianVoice();
        if (voice) utterance.voice = voice;
        window.speechSynthesis.speak(utterance);
    }
    
    setTimeout(() => {
        if (tooltip.parentNode) tooltip.remove();
    }, 2500);
};

window.playAiVoice = function() {
    if (currentRaSentenceIdx < 0 || currentRaSentenceIdx >= raSentences.length) return;
    const sentence = raSentences[currentRaSentenceIdx];
    
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(sentence);
        utterance.lang = 'id-ID';
        utterance.rate = 0.9;
        const voice = window.getBestIndonesianVoice();
        if (voice) utterance.voice = voice;
        window.speechSynthesis.speak(utterance);
    }
};

window.focusRaSentence = function(idx) {
    if (autoAdvanceTimeout) {
        clearTimeout(autoAdvanceTimeout);
        autoAdvanceTimeout = null;
    }
    isAutoAdvancing = false;
    currentRaWordIdx = 0;
    
    if (idx < 0 || idx >= raSentences.length) return;
    currentRaSentenceIdx = idx;
    
    // Dim all sentences, highlight active
    document.querySelectorAll('.ra-sentence').forEach(el => {
        el.classList.remove('ra-sentence-active');
        el.classList.add('ra-sentence-inactive');
    });
    
    const activeEl = document.getElementById(`ra-sent-${idx}`);
    if (activeEl) {
        activeEl.classList.remove('ra-sentence-inactive');
        activeEl.classList.add('ra-sentence-active');
        
        const words = activeEl.querySelectorAll('.ra-word');
        words.forEach(w => w.classList.remove('ra-word-active', 'ra-word-wrong', 'ra-word-skipped', 'ra-word-correct'));
        if (words.length > 0) words[0].classList.add('ra-word-active');
        
        // Auto-scroll inside overlay
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};

window.toggleRaRecording = function(btnNode) {
    if (isRaRecording && raRecognition) {
        isRaManuallyStopped = true;
        raRecognition.stop();
        return;
    }
    isRaManuallyStopped = false;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Browser Anda tidak mendukung fitur pengenalan suara. Gunakan Google Chrome.");
        return;
    }
    
    raRecognition = new SpeechRecognition();
    raRecognition.lang = 'id-ID';
    raRecognition.continuous = true;
    raRecognition.interimResults = true;
    
    raRecognition.onstart = () => {
        isRaRecording = true;
        isAutoAdvancing = false;
        btnNode.style.background = 'var(--color-error)';
        btnNode.style.transform = 'scale(1.1)';
        btnNode.innerHTML = `<svg width="32" height="32" viewBox="0 0 24 24" fill="white" stroke="none"><rect x="6" y="6" width="12" height="12"></rect></svg>`;
        
        const statusEl = document.getElementById('ra-mic-status');
        if (statusEl) {
            statusEl.innerHTML = `<span class="status-dot" style="display:inline-block; width:8px; height:8px; border-radius:50%; background:var(--color-error); box-shadow: 0 0 8px var(--color-error);"></span> Mendengarkan...`;
            statusEl.style.color = 'var(--color-error)';
            statusEl.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            statusEl.style.background = 'rgba(239, 68, 68, 0.05)';
        }
    };
    
    raRecognition.onresult = (event) => {
        if (isAutoAdvancing) return;
        
        const activeEl = document.getElementById(`ra-sent-${currentRaSentenceIdx}`);
        if (!activeEl) return;
        
        const words = activeEl.querySelectorAll('.ra-word');
        if (currentRaWordIdx >= words.length) return;

        // Reset silence timer on every new result
        if (raSilenceTimer) clearTimeout(raSilenceTimer);
        raSilenceTimer = setTimeout(() => {
            if (isRaRecording && raRecognition && currentRaWordIdx < words.length) {
                // If they pause for 3s on a word, mark it wrong and play audio, but KEEP recording!
                const wNode = words[currentRaWordIdx];
                if (!wNode.classList.contains('ra-word-correct')) {
                    wNode.classList.add('ra-word-wrong');
                    wNode.setAttribute('data-struggled', 'true');
                    const wText = wNode.textContent.trim();
                    if (!window.sessionMispronouncedWords.some(err => err.word === wText)) {
                        window.sessionMispronouncedWords.push({ word: wText, type: 'struggle' });
                        window.updateRaDiagnostic();
                    }
                    window.showRaTooltip(wNode, wText, true);
                }
            }
        }, 2500);

        let transcript = '';
        // Build transcript from the very beginning to avoid resultIndex desyncs
        for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript.toLowerCase() + ' ';
        }
        
        let transcriptClean = transcript.replace(/[^a-z0-9]/g, '');
        
        // Strip out words we've ALREADY marked as correct from the transcript.
        // This prevents substring matching against old parts of the transcript
        // (e.g. 'orang' matching inside a previously spoken 'seorang').
        for (let i = 0; i < currentRaWordIdx; i++) {
            const wNode = words[i];
            if (wNode.classList.contains('ra-word-correct')) {
                const wStr = wNode.textContent.toLowerCase().replace(/[^a-z0-9]/g, '');
                transcriptClean = transcriptClean.replace(wStr, '');
            }
        }
        
        let matchedSomething = false;
        let mispronouncedSomething = false;
        
        while (currentRaWordIdx < words.length) {
            const expectedNode = words[currentRaWordIdx];
            const cleanExpected = expectedNode.textContent.toLowerCase().replace(/[^a-z0-9]/g, '');
            
            const matchIdx = transcriptClean.indexOf(cleanExpected);
            
            if (matchIdx !== -1) {
                // Chop off matched part so we don't match the same text for subsequent duplicate words
                transcriptClean = transcriptClean.substring(matchIdx + cleanExpected.length);
                
                expectedNode.classList.remove('ra-word-wrong', 'ra-word-skipped', 'ra-word-active');
                expectedNode.classList.add('ra-word-correct');
                currentRaWordIdx++;
                matchedSomething = true;
            } else {
                // Lookahead to detect skipped or mispronounced words
                let lookaheadFound = false;
                // Look ahead up to 3 words to handle very fast speech or mumbled phrases
                for (let skip = 1; skip <= 3; skip++) {
                    if (currentRaWordIdx + skip < words.length) {
                        const nextNode = words[currentRaWordIdx + skip];
                        const cleanNext = nextNode.textContent.toLowerCase().replace(/[^a-z0-9]/g, '');
                        const nextMatchIdx = transcriptClean.indexOf(cleanNext);
                        
                        // We require the matched word to be close to the start of the transcript buffer
                        // This prevents matching hallucinated future words or background noise.
                        const isValidLookahead = nextMatchIdx !== -1 && nextMatchIdx <= 15;
                        
                        if (isValidLookahead) {
                            // We found a future word in the transcript! The skipped words are considered wrong.
                            for (let j = 0; j < skip; j++) {
                                const missedNode = words[currentRaWordIdx];
                                missedNode.classList.remove('ra-word-active', 'ra-word-wrong', 'ra-word-correct');
                                missedNode.classList.add('ra-word-skipped');
                                missedNode.setAttribute('data-skipped', 'true');
                                
                                const wTextRaw = missedNode.textContent.trim();
                                const wText = wTextRaw.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").trim();
                                
                                const existingErr = window.sessionMispronouncedWords.find(err => err.word === wTextRaw);
                                if (!existingErr) {
                                    window.sessionMispronouncedWords.push({ word: wTextRaw, type: 'skip', clean: wText });
                                } else {
                                    existingErr.type = 'skip';
                                }
                                currentRaWordIdx++;
                            }
                            mispronouncedSomething = true;
                            
                            // Now currentRaWordIdx is pointing to the found future word
                            const matchedNode = words[currentRaWordIdx];
                            transcriptClean = transcriptClean.substring(nextMatchIdx + cleanNext.length);
                            matchedNode.classList.remove('ra-word-wrong', 'ra-word-skipped', 'ra-word-active');
                            matchedNode.classList.add('ra-word-correct');
                            currentRaWordIdx++;
                            
                            lookaheadFound = true;
                            matchedSomething = true;
                            break;
                        }
                    }
                }
                
                if (!lookaheadFound) {
                    break;
                }
            }
        }
        
        if (matchedSomething || mispronouncedSomething) {
            if (currentRaWordIdx < words.length) {
                words[currentRaWordIdx].classList.add('ra-word-active');
            }
            window.updateRaDiagnostic();
        }
        
        // Auto-advance if finished all words
        if (currentRaWordIdx >= words.length) {
            isAutoAdvancing = true;
            if (raSilenceTimer) clearTimeout(raSilenceTimer);
            raRecognition.stop();
        }
    };
    
    raRecognition.onend = () => {
        isRaRecording = false;
        const recBtn = document.querySelector('.btn-ra-record');
        if (recBtn) {
            recBtn.style.background = 'var(--color-primary)';
            recBtn.style.transform = 'scale(1)';
            recBtn.innerHTML = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>`;
        }
        
        const statusEl = document.getElementById('ra-mic-status');
        if (statusEl) {
            statusEl.innerHTML = `<span class="status-dot" style="display:inline-block; width:8px; height:8px; border-radius:50%; background:var(--text-muted);"></span> Mikrofon Mati`;
            statusEl.style.color = 'var(--text-muted)';
            statusEl.style.borderColor = 'var(--border-subtle)';
            statusEl.style.background = 'var(--bg-body)';
        }
        
        if (isAutoAdvancing) {
            window.updateRaDiagnostic();
            autoAdvanceTimeout = setTimeout(() => {
                if (currentRaSentenceIdx + 1 < raSentences.length) {
                    window.focusRaSentence(currentRaSentenceIdx + 1);
                    if (isReadAlongActive) {
                        const btn = document.querySelector('.btn-ra-record');
                        if (btn) window.toggleRaRecording(btn); 
                    }
                }
            }, 1000);
        } else {
            // Did not finish the sentence, mic was turned off manually or due to timeout.
            if (isReadAlongActive && !isRaManuallyStopped) {
                // Restart automatically to maintain continuous listening
                if (recBtn) window.toggleRaRecording(recBtn);
            }
        }
    };
    
    raRecognition.onerror = (e) => {
        console.error("Speech Recognition Error: ", e.error);
        isRaRecording = false;
    };
    
    raRecognition.start();
};

// --- Pronunciation Practice Logic ---

let currentSentences = [];
let currentSentenceIdx = 0;
let recognition = null;
let isRecording = false;

window.togglePronunciationPractice = function(idx) {
   const box = document.getElementById(`pronunciation-box-${idx}`);
   const btn = document.querySelector(`.btn-pronunciation[data-idx="${idx}"]`);
   
   if (box.style.display === 'block') {
       box.style.display = 'none';
       btn.style.background = 'white';
       btn.style.color = 'var(--color-primary)';
       if(isRecording && recognition) {
           recognition.stop();
           isRecording = false;
       }
       window.speechSynthesis?.cancel();
       return;
   }
   
   // Close others
   document.querySelectorAll('.pronunciation-box').forEach(b => b.style.display = 'none');
   document.querySelectorAll('.btn-pronunciation').forEach(b => {
       b.style.background = 'white';
       b.style.color = 'var(--color-primary)';
   });
   
   box.style.display = 'block';
   btn.style.background = 'var(--color-primary-glow)';
   
   // Get text, strip HTML tags (like <v>)
   const pEl = document.getElementById(`paragraph-text-${idx}`);
   const pText = pEl ? pEl.textContent : '';
   
   // Split to sentences roughly by punctuation
   currentSentences = pText.match(/[^.!?]+[.!?]+/g) || [pText];
   currentSentenceIdx = 0;
   
   window.renderPronunciationBox(idx);
};

window.renderPronunciationBox = function(idx) {
    const box = document.getElementById(`pronunciation-box-${idx}`);
    if(!currentSentences[currentSentenceIdx]) return;
    
    const sentence = currentSentences[currentSentenceIdx].trim();
    
    box.innerHTML = `
      <div style="font-size: 0.85rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin-bottom: 12px;">Kalimat ${currentSentenceIdx + 1} dari ${currentSentences.length}</div>
      <div id="pronunciation-text" style="font-size: 1.5rem; font-weight: 500; color: var(--text-primary); margin-bottom: 24px; line-height: 1.4;">
         ${sentence.split(' ').map((w, i) => `<span class="pron-word" data-widx="${i}">${w}</span>`).join(' ')}
      </div>
      
      <div style="display: flex; gap: 16px; justify-content: center; align-items: center;">
         <button class="btn-listen" style="width: 50px; height: 50px; border-radius: 50%; border: none; background: rgba(11, 87, 208, 0.1); color: var(--color-primary); cursor: pointer; display: flex; justify-content: center; align-items: center; transition: all 0.2s;" title="Dengarkan">
            <span class="material-symbols-outlined" style="font-size: 24px;">volume_up</span>
         </button>
         
         <button class="btn-record" style="width: 64px; height: 64px; border-radius: 50%; border: none; background: var(--color-primary); color: white; cursor: pointer; display: flex; justify-content: center; align-items: center; box-shadow: 0 4px 12px rgba(11,87,208,0.3); transition: all 0.2s; position: relative;" title="Rekam Suara">
            <span class="material-symbols-outlined" style="font-size: 32px;">mic</span>
         </button>
         
         <div style="display: flex; flex-direction: column; gap: 4px; margin-left: 12px;">
            <button class="btn-prev-sent" ${currentSentenceIdx === 0 ? 'disabled' : ''} style="background: none; border: none; color: ${currentSentenceIdx === 0 ? 'var(--text-muted)' : 'var(--text-secondary)'}; cursor: ${currentSentenceIdx === 0 ? 'default' : 'pointer'};" title="Kalimat Sebelumnya">
                <span class="material-symbols-outlined">expand_less</span>
            </button>
            <button class="btn-next-sent" ${currentSentenceIdx === currentSentences.length - 1 ? 'disabled' : ''} style="background: none; border: none; color: ${currentSentenceIdx === currentSentences.length - 1 ? 'var(--text-muted)' : 'var(--text-secondary)'}; cursor: ${currentSentenceIdx === currentSentences.length - 1 ? 'default' : 'pointer'};" title="Kalimat Selanjutnya">
                <span class="material-symbols-outlined">expand_more</span>
            </button>
         </div>
      </div>
      <div id="pronunciation-feedback" style="margin-top: 16px; font-size: 0.95rem; font-weight: 500; color: var(--text-secondary); min-height: 24px;">Tekan ikon mikrofon dan mulailah membaca.</div>
    `;
    
    // Bindings
    box.querySelector('.btn-listen').addEventListener('click', () => {
        window.speechSynthesis?.cancel();
        const utterance = new SpeechSynthesisUtterance(sentence);
        utterance.lang = 'id-ID';
        utterance.rate = 0.85; // Slightly slower
        window.speechSynthesis.speak(utterance);
    });
    
    box.querySelector('.btn-record').addEventListener('click', (e) => {
        window.toggleRecording(e.currentTarget, sentence);
    });
    
    box.querySelector('.btn-prev-sent').addEventListener('click', () => {
        if(currentSentenceIdx > 0) {
            window.speechSynthesis?.cancel();
            if(isRecording && recognition) { recognition.stop(); isRecording = false; }
            currentSentenceIdx--;
            window.renderPronunciationBox(idx);
        }
    });
    
    box.querySelector('.btn-next-sent').addEventListener('click', () => {
        if(currentSentenceIdx < currentSentences.length - 1) {
            window.speechSynthesis?.cancel();
            if(isRecording && recognition) { recognition.stop(); isRecording = false; }
            currentSentenceIdx++;
            window.renderPronunciationBox(idx);
        }
    });
};

window.toggleRecording = function(btnNode, targetSentence) {
    const feedback = document.getElementById('pronunciation-feedback');
    const wordSpans = document.querySelectorAll('.pron-word');
    
    if (isRecording) {
        if(recognition) recognition.stop();
        isRecording = false;
        btnNode.style.background = 'var(--color-primary)';
        btnNode.classList.remove('recording-pulse');
        feedback.innerHTML = 'Perekaman dihentikan.';
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        feedback.innerHTML = '<span style="color: #ef4444;">Browser Anda tidak mendukung fitur mikrofon. Gunakan Google Chrome.</span>';
        return;
    }
    
    recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.interimResults = true;
    recognition.continuous = true;
    
    recognition.onstart = () => {
        isRecording = true;
        btnNode.style.background = '#ef4444';
        btnNode.classList.add('recording-pulse');
        feedback.innerHTML = 'Mendengarkan... Bicaralah sekarang.';
        wordSpans.forEach(span => { span.style.color = 'var(--text-primary)'; span.style.textShadow = 'none'; });
    };
    
    recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('')
          .toLowerCase();
          
        feedback.innerHTML = `Mendengar: <i>"${transcript}"</i>`;
        
        const targetWords = targetSentence.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ').filter(Boolean);
        const spokenWords = transcript.replace(/[^a-z0-9 ]/g, '').split(' ').filter(Boolean);
        
        wordSpans.forEach((span, i) => {
            const w = targetWords[i];
            if(w && spokenWords.includes(w)) {
                span.style.color = '#10b981'; // Success Green
                span.style.textShadow = '0 0 1px rgba(16,185,129,0.3)';
            }
        });
    };
    
    recognition.onerror = (event) => {
        isRecording = false;
        btnNode.style.background = 'var(--color-primary)';
        btnNode.classList.remove('recording-pulse');
        feedback.innerHTML = '<span style="color: #ef4444;">Terjadi kesalahan: ' + event.error + '</span>';
    };
    
    recognition.onend = () => {
        isRecording = false;
        btnNode.style.background = 'var(--color-primary)';
        btnNode.classList.remove('recording-pulse');
        if(feedback.innerHTML.includes('Mendengarkan...')) {
            feedback.innerHTML = 'Suara tidak terdeteksi, coba lagi.';
        } else if(feedback.innerHTML.includes('Mendengar:')) {
            feedback.innerHTML += ' <br/><span style="color: #10b981; font-weight: 600;">Selesai memproses.</span>';
        }
    };
    
    recognition.start();
};

// --- AI Discussion Overlay & Spectrum ---

window.openAiDiscussion = async function() {
    // Create fullscreen overlay
    let container = document.getElementById('ai-discussion-overlay');
    if (!container) {
        container = document.createElement('div');
        container.id = 'ai-discussion-overlay';
        container.className = 'ai-discussion-overlay';
        
        container.innerHTML = `
            <!-- Left Side: Chat History -->
            <div class="ai-discussion-sidebar" id="ai-discussion-sidebar" style="display: none;">
                <div class="ai-discussion-header" style="display: flex; align-items: center; justify-content: space-between; padding: 1.5rem 1.5rem 1rem 1.5rem;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 40px; height: 40px; border-radius: 12px; background: rgba(11,87,208,0.1); display: flex; align-items: center; justify-content: center; color: var(--color-primary);">
                            <span class="material-symbols-outlined" style="font-size: 1.5rem;">history</span>
                        </div>
                        <div>
                            <h2 style="font-size: 1.2rem; margin: 0; font-weight: 700; color: var(--text-primary);">Riwayat</h2>
                            <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary);">Percakapan Anda dengan AI</p>
                        </div>
                    </div>
                    <button onclick="window.clearAiHistory()" aria-label="Hapus Riwayat" style="background: none; border: none; color: var(--text-muted); cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 8px; border-radius: 50%; transition: all 0.2s;" title="Hapus Riwayat">
                        <span class="material-symbols-outlined" style="font-size: 1.25rem;">delete</span>
                    </button>
                    <button class="ai-discussion-close-mobile" onclick="window.toggleAiHistory()" aria-label="Tutup Riwayat">
                        <span class="material-symbols-outlined" style="font-size: 1.5rem;">close</span>
                    </button>
                </div>
                <hr style="border: none; border-top: 1px solid var(--border-subtle); margin: 0 1.5rem;" />
                
                <div id="ai-chat-history-container" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; padding: 1.5rem; scroll-behavior: smooth;">
                    <div id="ai-chat-history" style="display: flex; flex-direction: column; gap: 16px; width: 100%;">
                        <div id="ai-chat-empty" style="text-align: center; color: var(--text-muted); font-size: 0.9rem; padding: 12px; background: rgba(0,0,0,0.02); border-radius: 8px;">Riwayat percakapan akan muncul di sini.</div>
                    </div>
                </div>

                <!-- Text chat hidden per user request -->
                <div style="display: none; padding: 1rem 1.5rem; border-top: 1px solid var(--border-subtle); background: var(--bg-surface);">
                    <form id="ai-chat-form" style="display: flex; gap: 8px;" onsubmit="event.preventDefault(); window.sendAiTextMessage();">
                        <input type="text" id="ai-chat-input" placeholder="Ketik pesan..." style="flex: 1; padding: 12px 16px; border-radius: 24px; border: 1px solid var(--border-subtle); outline: none; font-family: inherit; font-size: 0.95rem; background: var(--bg-base); transition: border-color 0.2s;">
                        <button type="submit" style="width: 44px; height: 44px; border-radius: 50%; background: var(--color-primary); color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: transform 0.2s;">
                            <span class="material-symbols-outlined" style="font-size: 1.25rem;">send</span>
                        </button>
                    </form>
                </div>
            </div>

            <!-- Right Side: Interaction -->
            <div class="ai-discussion-main">
                
                <div class="ai-discussion-actions-desktop" style="position: absolute; top: 1.5rem; right: 1.5rem; display: flex; gap: 12px; z-index: 10;">
                    <button onclick="window.toggleAiHistory()" aria-label="Riwayat Diskusi" style="background: white; border: 1px solid var(--border-subtle); border-radius: 50%; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; color: var(--text-secondary); cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.05);" title="Riwayat Diskusi">
                        <span class="material-symbols-outlined">history</span>
                    </button>
                    <button onclick="window.closeAiDiscussion()" aria-label="Tutup Diskusi" style="background: white; border: 1px solid var(--border-subtle); border-radius: 50%; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; color: var(--text-secondary); cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.05);" title="Tutup Diskusi">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <!-- Keeps the old class for mobile styles, but we handle desktop via the new container -->
                <button class="ai-discussion-close-desktop" onclick="window.closeAiDiscussion()" aria-label="Tutup Diskusi" style="display: none;">
                    <span class="material-symbols-outlined">close</span>
                </button>
                
                <div id="ai-current-text" style="font-size: 2.2rem; text-align: center; color: var(--text-primary); max-width: 800px; line-height: 1.4; font-weight: 600; min-height: 120px; margin-bottom: 2rem; transition: opacity 0.3s; letter-spacing: -0.02em;">Tanyakan sesuatu tentang bacaan ini...</div>
                
                <canvas id="ai-spectrum-canvas" style="width: 100%; max-width: 500px; height: 100px; margin-bottom: 3rem;"></canvas>
                
                <div style="display: flex; gap: 16px; align-items: center; height: 56px;">
                    <button id="btn-toggle-mic" onclick="window.toggleAiMic()" style="width: 56px; height: 56px; border-radius: 50%; border: none; background: var(--color-primary); color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(11,87,208,0.3); transition: all 0.2s; z-index: 10;">
                        <span class="material-symbols-outlined" style="font-size: 1.5rem;">mic</span>
                    </button>
                    <div id="ai-discussion-status" style="font-size: 1.1rem; color: var(--color-primary); background: rgba(11,87,208,0.1); padding: 0 24px; height: 40px; border-radius: 20px; font-weight: 600; display: flex; align-items: center; gap: 8px; transition: all 0.3s;">
                        Mode Suara Aktif
                    </div>
                    <button id="btn-interrupt-ai" onclick="window.interruptAi()" style="display: none; padding: 0 24px; height: 40px; background: rgba(220,38,38,0.1); color: var(--color-error); border: none; border-radius: 20px; font-weight: 600; font-size: 1rem; cursor: pointer; align-items: center; gap: 8px; transition: all 0.2s;">
                        <span class="material-symbols-outlined" style="font-size: 1.2rem;">stop_circle</span> Hentikan AI
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(container);
    }
    
    // Append message helper
    const appendMessage = (role, text, skipCurrent = false) => {
        const chatHistory = document.getElementById('ai-chat-history');
        const emptyState = document.getElementById('ai-chat-empty');
        const currentText = document.getElementById('ai-current-text');
        
        if (emptyState) emptyState.style.display = 'none';
        
        if (!skipCurrent) {
            if (currentText && role === 'assistant') {
                currentText.textContent = text;
            } else if (currentText && role === 'user') {
                currentText.innerHTML = `<span style="color: var(--text-secondary); font-size: 1.6rem; font-weight: 500;">"${text}"</span>`;
            }
        }

        if (!chatHistory) return;
        const msgDiv = document.createElement('div');
        msgDiv.style.maxWidth = '90%';
        msgDiv.style.padding = '12px 16px';
        msgDiv.style.borderRadius = '16px';
        msgDiv.style.lineHeight = '1.5';
        msgDiv.style.fontSize = '0.95rem';
        msgDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
        
        if (role === 'user') {
            msgDiv.style.alignSelf = 'flex-end';
            msgDiv.style.background = 'var(--color-primary)';
            msgDiv.style.color = 'white';
            msgDiv.style.borderBottomRightRadius = '4px';
        } else {
            msgDiv.style.alignSelf = 'flex-start';
            msgDiv.style.background = 'white';
            msgDiv.style.color = 'var(--text-primary)';
            msgDiv.style.borderBottomLeftRadius = '4px';
            msgDiv.style.border = '1px solid var(--border-subtle)';
        }
        
        msgDiv.textContent = text;
        chatHistory.appendChild(msgDiv);
        const historyContainer = document.getElementById('ai-chat-history-container');
        if(historyContainer) historyContainer.scrollTop = historyContainer.scrollHeight;
    };

    window.toggleAiHistory = function() {
        const sidebar = document.getElementById('ai-discussion-sidebar');
        if (sidebar) {
            sidebar.style.display = sidebar.style.display === 'none' ? 'flex' : 'none';
        }
    };

    window.clearAiHistory = function() {
        if(confirm('Hapus seluruh riwayat percakapan?')) {
            window.aiDiscussionHistory = [];
            try { localStorage.removeItem('bacaku_ai_history'); } catch(e){}
            const chatHistory = document.getElementById('ai-chat-history');
            if (chatHistory) {
                chatHistory.innerHTML = '<div id="ai-chat-empty" style="text-align: center; color: var(--text-muted); font-size: 0.9rem; padding: 12px; background: rgba(0,0,0,0.02); border-radius: 8px;">Riwayat percakapan telah dihapus.</div>';
            }
            const currentText = document.getElementById('ai-current-text');
            if (currentText) currentText.textContent = 'Tanyakan sesuatu tentang bacaan ini...';
        }
    };

    window.interruptAi = function() {
        window.speechSynthesis?.cancel();
        const btn = document.getElementById('btn-interrupt-ai');
        if (btn) btn.style.display = 'none';
        
        const status = document.getElementById('ai-discussion-status');
        if (status) {
            status.innerHTML = 'AI dihentikan.';
            status.style.color = 'var(--text-secondary)';
        }
    };

    window.sendAiTextMessage = async function() {
        const input = document.getElementById('ai-chat-input');
        if (!input) return;
        const text = input.value.trim();
        if (!text) return;
        
        input.value = '';
        input.disabled = true;
        
        // Interrupt ongoing speech if any
        window.speechSynthesis?.cancel();

        window.aiDiscussionHistory.push({ role: "user", content: text });
        try { localStorage.setItem('bacaku_ai_history', JSON.stringify(window.aiDiscussionHistory)); } catch(e){}
        appendMessage('user', text);
        
        const status = document.getElementById('ai-discussion-status');
        if (status) {
            status.innerHTML = '<div class="loading__spinner" style="width: 16px; height: 16px; border-width: 2px; border-top-color: #a855f7;"></div> ✨ Memikirkan jawaban...';
            status.style.color = '#a855f7';
        }
        
        // Context from Article
        const paragraphs = Array.from(document.querySelectorAll('.reader__paragraph')).map(p => p.textContent);
        const articleText = paragraphs.join(' ');

        try {
            const aiText = await generateChatResponse(window.aiDiscussionHistory, articleText);
            if (!document.getElementById('ai-discussion-overlay')) return;
            
            window.aiDiscussionHistory.push({ role: "assistant", content: aiText });
            try { localStorage.setItem('bacaku_ai_history', JSON.stringify(window.aiDiscussionHistory)); } catch(e){}
            
            if (status) {
                status.innerHTML = '🗣️ AI sedang berbicara...';
                status.style.color = '#10b981';
            }
            
            appendMessage('assistant', aiText);
            window.playAiDiscussionVoice(aiText);
        } catch (err) {
            console.error(err);
            if (status) {
                status.innerHTML = '⚠️ Terjadi kesalahan. Coba lagi.';
            }
        } finally {
            input.disabled = false;
            input.focus();
        }
    };

    window.playAiDiscussionVoice = function(aiText) {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            let textForSpeech = aiText.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
            textForSpeech = textForSpeech.replace(/[*#_`>~-]/g, '');
            
            const utterance = new SpeechSynthesisUtterance(textForSpeech);
            utterance.lang = 'id-ID';
            utterance.rate = 1.05; 
            utterance.pitch = 1.1; 
            
            const voice = getBestIndonesianVoice();
            if (voice) utterance.voice = voice;
            
            utterance.onstart = () => {
                const btn = document.getElementById('btn-interrupt-ai');
                if (btn) btn.style.display = 'flex';
            };
            
            utterance.onend = () => {
                if (document.getElementById('ai-discussion-overlay')) {
                    const status = document.getElementById('ai-discussion-status');
                    if (status) {
                        status.innerHTML = 'Mode Suara Aktif';
                        status.style.color = 'var(--color-primary)';
                    }
                    const btn = document.getElementById('btn-interrupt-ai');
                    if (btn) btn.style.display = 'none';
                    if (window.isAiMicActive && window.aiDiscussionRecognition) {
                        try { window.aiDiscussionRecognition.start(); } catch(e){}
                    }
                }
            };
            
            window.speechSynthesis.speak(utterance);
        }
    };

    window.isAiMicActive = true;
    window.toggleAiMic = function() {
        const btn = document.getElementById('btn-toggle-mic');
        const status = document.getElementById('ai-discussion-status');
        window.isAiMicActive = !window.isAiMicActive;
        
        if (window.isAiMicActive) {
            btn.style.background = 'var(--color-primary)';
            btn.innerHTML = '<span class="material-symbols-outlined" style="font-size: 1.5rem;">mic</span>';
            if (status) status.innerHTML = 'Mode Suara Aktif';
            try { if (window.aiDiscussionRecognition) window.aiDiscussionRecognition.start(); } catch(e){}
        } else {
            btn.style.background = 'var(--bg-surface)';
            btn.style.color = 'var(--text-primary)';
            btn.innerHTML = '<span class="material-symbols-outlined" style="font-size: 1.5rem;">mic_off</span>';
            if (status) status.innerHTML = 'Mode Suara Mati';
            try { if (window.aiDiscussionRecognition) window.aiDiscussionRecognition.stop(); } catch(e){}
        }
    };

    // Setup Conversation History
    let savedHistory = [];
    try {
        const stored = localStorage.getItem('bacaku_ai_history');
        if (stored) savedHistory = JSON.parse(stored);
    } catch(e) {}
    window.aiDiscussionHistory = savedHistory;

    // Render existing history
    window.aiDiscussionHistory.forEach(msg => {
        appendMessage(msg.role, msg.content, true); 
    });

    // Context from Article
    const paragraphs = Array.from(document.querySelectorAll('.reader__paragraph')).map(p => p.textContent);
    const articleText = paragraphs.join(' ');
    
    // Stop Read Along Mic if active
    if (window.isRaRecording && window.raRecognition) {
        window.toggleRaRecording(document.querySelector('.btn-ra-record'));
    }
    
    // 2. Setup Audio Context & Canvas
    const canvas = document.getElementById('ai-spectrum-canvas');
    const ctx = canvas.getContext('2d');
    
    // Resize canvas
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    window.aiDiscussionAudioCtx = audioCtx;
    
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        window.aiDiscussionStream = stream;
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        
        function draw() {
            if (!document.getElementById('ai-discussion-overlay')) return;
            requestAnimationFrame(draw);
            
            analyser.getByteFrequencyData(dataArray);
            ctx.clearRect(0, 0, rect.width, rect.height);
            
            const barWidth = (rect.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;
            
            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i];
                
                const grad = ctx.createLinearGradient(0, rect.height, 0, rect.height - barHeight);
                grad.addColorStop(0, '#6366f1');
                grad.addColorStop(1, '#a855f7');
                
                ctx.fillStyle = grad;
                
                const h = (barHeight / 255) * rect.height * 0.8;
                const y = rect.height - h;
                
                ctx.beginPath();
                ctx.roundRect(x, y, barWidth - 2, h, 8);
                ctx.fill();
                
                x += barWidth;
            }
        }
        draw();
        
        // Real user voice detection
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const aiRecognition = new SpeechRecognition();
            aiRecognition.lang = 'id-ID';
            aiRecognition.continuous = false;
            aiRecognition.interimResults = true;
            window.aiDiscussionRecognition = aiRecognition;
            
            let isProcessing = false;
            
            aiRecognition.onresult = (event) => {
                if (isProcessing) return;
                
                let transcript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    transcript += event.results[i][0].transcript;
                }
                
                if (event.results[0].isFinal && !isProcessing) {
                    isProcessing = true;
                    aiRecognition.stop();
                    
                    // Push user message to history and UI
                    window.aiDiscussionHistory.push({ role: "user", content: transcript });
                    try { localStorage.setItem('bacaku_ai_history', JSON.stringify(window.aiDiscussionHistory)); } catch(e){}
                    appendMessage('user', transcript);
                    
                    const status = document.getElementById('ai-discussion-status');
                    if (status) {
                        status.innerHTML = '<div class="loading__spinner" style="width: 16px; height: 16px; border-width: 2px; border-top-color: #a855f7;"></div> ✨ Memikirkan...';
                        status.style.color = '#a855f7';
                    }
                    
                    // Fetch real AI response with RAG context
                    generateChatResponse(window.aiDiscussionHistory, articleText).then(aiText => {
                        if (!document.getElementById('ai-discussion-overlay')) return;
                        
                        // Push assistant message to history
                        window.aiDiscussionHistory.push({ role: "assistant", content: aiText });
                        try { localStorage.setItem('bacaku_ai_history', JSON.stringify(window.aiDiscussionHistory)); } catch(e){}
                        
                        if (status) {
                            status.innerHTML = '🗣️ AI sedang berbicara...';
                            status.style.color = '#10b981';
                        }
                        
                        appendMessage('assistant', aiText);
                        window.playAiDiscussionVoice(aiText);
                        
                    }).catch(err => {
                        console.error(err);
                        isProcessing = false;
                        if (status) {
                            status.innerHTML = '⚠️ Terjadi kesalahan. Coba lagi.';
                        }
                    });
                }
            };
            
            aiRecognition.onend = () => {
                if (!isProcessing && document.getElementById('ai-discussion-overlay') && window.isAiMicActive) {
                    try { aiRecognition.start(); } catch(e){} // Keep listening
                }
            };
            
            if (window.isAiMicActive) aiRecognition.start();
        } else {
            const status = document.getElementById('ai-discussion-status');
            if (status) {
                status.innerHTML = '⚠️ Browser tidak mendukung pengenalan suara.';
                status.style.color = '#ef4444';
            }
        }
        
    } catch (err) {
        console.error("Gagal mengakses mikrofon:", err);
        const status = document.getElementById('ai-discussion-status');
        if (status) {
            status.innerHTML = "❌ Akses mikrofon ditolak.";
            status.style.color = "var(--color-error)";
        }
    }
};

window.closeAiDiscussion = function() {
    const container = document.getElementById('ai-discussion-overlay');
    if (container) {
        // Find existing audio tracks before removing
        if (window.aiDiscussionStream) {
            window.aiDiscussionStream.getTracks().forEach(track => track.stop());
        }
        if (window.aiDiscussionAudioCtx) {
            window.aiDiscussionAudioCtx.close();
        }
        window.speechSynthesis?.cancel();
        
        container.remove();
    }
    
    if (window.aiDiscussionTimeout) clearTimeout(window.aiDiscussionTimeout);
    if (window.aiDiscussionResponseTimeout) clearTimeout(window.aiDiscussionResponseTimeout);
    
    window.aiDiscussionStream = null;
    window.aiDiscussionAudioCtx = null;
    window.aiDiscussionRecognition = null;
};

window.generatePDFReport = function() {
    let printDiv = document.getElementById('ra-print-report');
    if (!printDiv) {
        printDiv = document.createElement('div');
        printDiv.id = 'ra-print-report';
        document.body.appendChild(printDiv);
    }
    
    const title = document.querySelector('.reader__section-title') ? document.querySelector('.reader__section-title').textContent : 'Membaca Nyaring';
    const pct = document.getElementById('ra-diagnostic-percent') ? document.getElementById('ra-diagnostic-percent').textContent : '0%';
    const txt = document.getElementById('ra-diagnostic-text') ? document.getElementById('ra-diagnostic-text').textContent : '';
    
    const struggles = window.sessionMispronouncedWords.filter(w => w.type !== 'skip').map(w => w.word);
    const skips = window.sessionMispronouncedWords.filter(w => w.type === 'skip').map(w => w.word);
    
    printDiv.innerHTML = `
        <div style="font-family: 'Google Sans', sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 40px;">
                <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 24px;">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 4V28" stroke="#0b57d0" stroke-width="4" stroke-linecap="round"/>
                      <circle cx="11" cy="20" r="6" stroke="#0b57d0" stroke-width="4"/>
                      <path d="M15 4V28" stroke="#38BDF8" stroke-width="4" stroke-linecap="round"/>
                      <circle cx="21" cy="20" r="6" stroke="#38BDF8" stroke-width="4"/>
                    </svg>
                    <span style="font-size: 24px; font-weight: 700; color: #0b57d0; letter-spacing: -0.5px;">BelajarBaca</span>
                </div>
                <h1 style="color: #0b57d0; font-size: 28px; margin-bottom: 8px;">Laporan Analisis Pengucapan</h1>
                <h2 style="font-size: 20px; font-weight: 400; color: #475569; margin-top: 0;">Topik: ${title}</h2>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 40px; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; background: #f8fafc;">
                <div>
                    <h3 style="margin-top: 0; color: #64748b; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Akurasi Pengucapan</h3>
                    <div style="font-size: 48px; font-weight: 700; color: ${parseInt(pct) > 80 ? '#10b981' : parseInt(pct) > 40 ? '#f59e0b' : '#ef4444'};">${pct}</div>
                    <div style="color: #475569; font-weight: 500;">${txt}</div>
                </div>
            </div>
            
            <div style="display: flex; gap: 32px; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 250px;">
                    <h3 style="color: #ef4444; border-bottom: 2px solid #fee2e2; padding-bottom: 8px; margin-bottom: 16px;">Kata yang Perlu Diperbaiki</h3>
                    ${struggles.length === 0 ? '<p style="color: #94a3b8; font-style: italic;">Belum ada kesalahan.</p>' : 
                      '<ul style="list-style: none; padding: 0; margin: 0;">' + struggles.map(w => `<li style="padding: 8px 12px; background: #fef2f2; margin-bottom: 8px; border-radius: 6px; border: 1px solid #fee2e2; color: #991b1b; font-weight: 500;">${w}</li>`).join('') + '</ul>'}
                </div>
                
                <div style="flex: 1; min-width: 250px;">
                    <h3 style="color: #f59e0b; border-bottom: 2px solid #fef3c7; padding-bottom: 8px; margin-bottom: 16px;">Kata yang Terlewat</h3>
                    ${skips.length === 0 ? '<p style="color: #94a3b8; font-style: italic;">Tidak ada yang terlewat.</p>' : 
                      '<ul style="list-style: none; padding: 0; margin: 0;">' + skips.map(w => `<li style="padding: 8px 12px; background: #fffbeb; margin-bottom: 8px; border-radius: 6px; border: 1px solid #fef3c7; color: #b45309; font-weight: 500;">${w}</li>`).join('') + '</ul>'}
                </div>
            </div>
            
            <div style="margin-top: 60px; text-align: center; color: #94a3b8; font-size: 12px;">
                Dihasilkan oleh BelajarBaca pada ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
            </div>
        </div>
    `;
    
    if (!document.getElementById('ra-print-styles')) {
        const style = document.createElement('style');
        style.id = 'ra-print-styles';
        style.innerHTML = `
            @media print {
                body > *:not(#ra-print-report) { display: none !important; }
                #ra-print-report { display: block !important; position: absolute; left: 0; top: 0; width: 100%; }
                @page { margin: 2cm; size: A4 portrait; }
            }
            @media screen {
                #ra-print-report { display: none !important; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Slight delay to ensure DOM is updated before printing
    setTimeout(() => {
        window.print();
    }, 100);
};
