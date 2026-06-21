import { getState, subscribe } from './state.js';
import { renderOnboarding } from './views/onboarding.js';
import { renderGenerate } from './views/generate.js';
import { renderReader } from './views/reader.js';
import { renderSlides } from './views/slides.js';
import { renderQuiz } from './views/quiz.js';

import './styles/tokens.css';
import './styles/app.css';

const appContainer = document.getElementById('app');

function renderApp() {
  const { view } = getState();

  // Clear container
  appContainer.innerHTML = '';

  switch (view) {
    case 'onboarding':
      renderOnboarding(appContainer);
      break;
    case 'generate':
      renderGenerate(appContainer);
      break;
    case 'reader':
      renderReader(appContainer);
      break;
    case 'slides':
      renderSlides(appContainer);
      break;
    case 'quiz':
      renderQuiz(appContainer);
      break;
    default:
      renderOnboarding(appContainer);
  }
}

// Initial render
renderApp();

// Re-render when layout state changes
subscribe(['view', 'onboardingStep', 'activeSection'], () => {
  renderApp();
});
