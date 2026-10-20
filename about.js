const themeToggle = document.querySelector('#theme-toggle');
const tr = window.studioText;

function syncThemeControl() {
  const isDark = document.documentElement.dataset.theme === 'dark';
  const nextTheme = isDark ? tr('라이트', 'light') : tr('다크', 'dark');
  document.querySelector('meta[name="theme-color"]').content = isDark ? '#000000' : '#fafcff';
  themeToggle.setAttribute('aria-label', tr(`${nextTheme} 모드로 전환`, `Switch to ${nextTheme} mode`));
  themeToggle.title = tr(`${nextTheme} 모드로 전환`, `Switch to ${nextTheme} mode`);
}

syncThemeControl();
themeToggle.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = nextTheme;
  try { localStorage.setItem('skill-studio-theme', nextTheme); } catch { /* Keep the current visit usable. */ }
  syncThemeControl();
});
const exampleTabs = [...document.querySelectorAll('[data-example-tab]')];
const examplePanels = [...document.querySelectorAll('[data-example-panel]')];
const exampleWindow = document.querySelector('.about-ai-window');
if ('IntersectionObserver' in window) {
  const pageElements = document.querySelectorAll('.topbar > *, .about-intro > *, .about-definition > *, .about-chat-intro > *, .about-ai-tabs, .about-ai-caption, .about-benefits-note, .about-steps > h2, .about-step, .about-caveat, .about-next > *, .about-sources, .site-footer > *');
  const messages = exampleWindow?.querySelectorAll('.about-ai-user, .about-ai-response') || [];
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
  pageElements.forEach((element) => {
    element.classList.add('page-reveal');
    revealObserver.observe(element);
  });
  messages.forEach((message) => {
    message.classList.add('chat-reveal');
    revealObserver.observe(message);
  });
  document.body.classList.add('about-motion-ready');
  exampleWindow?.classList.add('chat-motion-ready');
}
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let exampleTimer;
let streamTimer;
let elapsedTimer;
let firstExampleObserver;
let exampleStarted = false;
const answerText = new Map();

examplePanels.forEach((panel) => {
  const answer = panel.querySelector('.about-ai-answer');
  const loading = panel.querySelector('.about-ai-loading');
  const elapsed = document.createElement('span');
  elapsed.className = 'about-ai-elapsed';
  elapsed.setAttribute('aria-hidden', 'true');
  elapsed.innerHTML = '<span class="about-ai-elapsed-window"><span class="about-ai-elapsed-sizer">0</span><span class="about-ai-elapsed-value">0</span></span>';
  elapsed.append(document.createTextNode(tr('초', 's')));
  loading.append(elapsed);
  answerText.set(answer, answer.textContent);
  const status = answer.closest('.about-ai-response');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.setAttribute('aria-atomic', 'true');
  answer.addEventListener('animationend', (event) => {
    if (event.animationName === 'about-ai-answer-glow') event.currentTarget.classList.remove('is-illuminating');
  });
});

function stopElapsed() {
  clearInterval(elapsedTimer);
}

function updateElapsed(panel, value) {
  const windowElement = panel.querySelector('.about-ai-elapsed-window');
  windowElement.querySelector('.about-ai-elapsed-sizer').textContent = String(value);
  const current = windowElement.querySelector('.about-ai-elapsed-value:not(.is-leaving)');
  if (current?.textContent === String(value)) return;
  const next = document.createElement('span');
  next.className = 'about-ai-elapsed-value is-entering';
  next.textContent = String(value);
  current?.classList.add('is-leaving');
  windowElement.append(next);
  next.getBoundingClientRect();
  requestAnimationFrame(() => next.classList.remove('is-entering'));
  setTimeout(() => current?.remove(), 520);
}

function stopStreaming() {
  clearTimeout(streamTimer);
  examplePanels.forEach((panel) => {
    const answer = panel.querySelector('.about-ai-answer');
    answer.classList.remove('is-streaming');
    answer.removeAttribute('aria-label');
    answer.textContent = answerText.get(answer);
  });
}

function streamAnswer(answer) {
  const fullText = answerText.get(answer);
  const words = fullText.match(/\S+\s*/g) || [fullText];
  const visual = document.createElement('span');
  visual.setAttribute('aria-hidden', 'true');
  answer.setAttribute('aria-label', fullText);
  answer.classList.add('is-streaming');
  answer.replaceChildren(visual);
  let index = 0;
  function nextWord() {
    if (index >= words.length) {
      answer.classList.remove('is-streaming');
      answer.removeAttribute('aria-label');
      answer.textContent = fullText;
      answer.classList.add('is-illuminating');
      return;
    }
    const word = document.createElement('span');
    word.className = 'about-ai-stream-word';
    word.textContent = words[index++];
    visual.append(word);
    streamTimer = setTimeout(nextWord, 105);
  }
  nextWord();
}

function replayExample(panel) {
  clearTimeout(exampleTimer);
  stopElapsed();
  stopStreaming();
  const loading = panel.querySelector('.about-ai-loading');
  const answer = panel.querySelector('.about-ai-answer');
  answer.classList.remove('is-illuminating');
  loading.hidden = false;
  answer.hidden = true;
  const elapsedWindow = panel.querySelector('.about-ai-elapsed-window');
  const initialDigit = document.createElement('span');
  initialDigit.className = 'about-ai-elapsed-value';
  initialDigit.textContent = '0';
  elapsedWindow.querySelector('.about-ai-elapsed-sizer').textContent = '0';
  elapsedWindow.querySelectorAll('.about-ai-elapsed-value').forEach((digit) => digit.remove());
  elapsedWindow.append(initialDigit);
  if (!reducedMotion.matches) {
    const startedAt = performance.now();
    elapsedTimer = setInterval(() => {
      updateElapsed(panel, Math.floor((performance.now() - startedAt) / 1000));
    }, 200);
  }
  exampleTimer = setTimeout(() => {
    stopElapsed();
    loading.hidden = true;
    answer.hidden = false;
    if (!reducedMotion.matches) streamAnswer(answer);
  }, reducedMotion.matches ? 150 : 2400);
}

function selectExample(index, focus = false) {
  exampleStarted = true;
  firstExampleObserver?.disconnect();
  clearTimeout(exampleTimer);
  stopElapsed();
  stopStreaming();
  exampleTabs.forEach((tab, tabIndex) => {
    const active = tabIndex === index;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    const panel = examplePanels[tabIndex];
    const loading = panel.querySelector('.about-ai-loading');
    const answer = panel.querySelector('.about-ai-answer');
    if (active) {
      loading.hidden = false;
      answer.hidden = true;
      panel.hidden = false;
    } else {
      panel.hidden = true;
      loading.hidden = true;
      answer.hidden = false;
      answer.classList.remove('is-illuminating');
    }
  });
  if (focus) exampleTabs[index].focus();
  replayExample(examplePanels[index]);
}

exampleTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectExample(index));
  tab.addEventListener('keydown', (event) => {
    const offset = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!offset && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? exampleTabs.length - 1 : (index + offset + exampleTabs.length) % exampleTabs.length;
    selectExample(next, true);
  });
});

if ('IntersectionObserver' in window && examplePanels[0]) {
  firstExampleObserver = new IntersectionObserver((entries, observer) => {
    if (!entries.some((entry) => entry.isIntersecting) || exampleStarted) return;
    exampleStarted = true;
    observer.disconnect();
    replayExample(examplePanels[0]);
  }, { rootMargin: '0px 0px -15% 0px' });
  firstExampleObserver.observe(examplePanels[0].querySelector('.about-ai-after-label'));
}
