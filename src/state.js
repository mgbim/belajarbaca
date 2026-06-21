/**
 * Reactive state store — lightweight pub/sub, no dependencies.
 */

const listeners = new Map();
let currentState = {
  view: 'onboarding',
  onboardingStep: 0,
  profile: { l1: null, level: null, interest: null },
  topic: '',
  activeSection: 0,
  readingProgress: 0,
  slideIndex: 0,
  quizAnswers: {},
  quizSubmitted: false,
  aiContent: '',
  isStreaming: false,
};

export function getState() {
  return currentState;
}

export function setState(patch) {
  const prev = { ...currentState };
  currentState = { ...currentState, ...patch };

  listeners.forEach(({ keys, callback }) => {
    const changed = keys.some(k => prev[k] !== currentState[k]);
    if (changed) callback(currentState, prev);
  });
}

export function subscribe(keys, callback) {
  const id = Math.random().toString(36).slice(2);
  const watchedKeys = typeof keys === 'string' ? [keys] : keys;
  listeners.set(id, { keys: watchedKeys, callback });
}

export function resetQuiz() {
  setState({ quizAnswers: {}, quizSubmitted: false });
}
