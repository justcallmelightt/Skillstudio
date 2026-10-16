const themeToggle = document.querySelector('#theme-toggle');
const tr = window.studioText;
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

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
systemTheme.addEventListener('change', (event) => {
  try { if (localStorage.getItem('skill-studio-theme')) return; } catch { /* Follow system setting. */ }
  document.documentElement.dataset.theme = event.matches ? 'dark' : 'light';
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

function replayExample(panel) {
  clearTimeout(exampleTimer);
  const loading = panel.querySelector('.about-ai-loading');
  const answer = panel.querySelector('.about-ai-answer');
  loading.hidden = false;
  answer.hidden = true;
  exampleTimer = setTimeout(() => {
    loading.hidden = true;
    answer.hidden = false;
  }, reducedMotion.matches ? 150 : 900);
}

function selectExample(index, focus = false) {
  clearTimeout(exampleTimer);
  exampleTabs.forEach((tab, tabIndex) => {
    const active = tabIndex === index;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    examplePanels[tabIndex].hidden = !active;
    examplePanels[tabIndex].querySelector('.about-ai-loading').hidden = true;
    examplePanels[tabIndex].querySelector('.about-ai-answer').hidden = false;
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
