const themeToggle = document.querySelector('#theme-toggle');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

function syncThemeControl() {
  const isDark = document.documentElement.dataset.theme === 'dark';
  const nextTheme = isDark ? '라이트' : '다크';
  document.querySelector('meta[name="theme-color"]').content = isDark ? '#000000' : '#fafcff';
  themeToggle.setAttribute('aria-label', `${nextTheme} 모드로 전환`);
  themeToggle.title = `${nextTheme} 모드로 전환`;
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
