const STORAGE_KEY = 'skill-studio-draft-v1';
const FIELD_NAMES = ['name', 'description', 'trigger', 'steps', 'rules', 'avoid', 'output', 'checks'];
const form = document.querySelector('#skill-form');
const preview = document.querySelector('#markdown-preview');
const filePath = document.querySelector('#file-path');
const score = document.querySelector('#quality-score');
const progress = document.querySelector('#quality-progress');
const qualityList = document.querySelector('#quality-list');
const toast = document.querySelector('#toast');
const themeToggle = document.querySelector('#theme-toggle');
const guideTabs = [...document.querySelectorAll('[data-guide-tab]')];
const fieldInfoButtons = [...document.querySelectorAll('[data-field-info]')];
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
let toastTimer;

function closeFieldInfo(except) {
  fieldInfoButtons.forEach((button) => {
    if (button === except) return;
    button.setAttribute('aria-expanded', 'false');
    document.getElementById(button.getAttribute('aria-controls')).hidden = true;
  });
}

fieldInfoButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const opening = button.getAttribute('aria-expanded') !== 'true';
    closeFieldInfo();
    if (opening) {
      button.setAttribute('aria-expanded', 'true');
      document.getElementById(button.getAttribute('aria-controls')).hidden = false;
    }
  });
});
document.addEventListener('pointerdown', (event) => {
  if (!event.target.closest('.field-heading')) closeFieldInfo();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeFieldInfo();
});

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
  try { localStorage.setItem('skill-studio-theme', nextTheme); } catch { /* Theme still works for this visit. */ }
  syncThemeControl();
});
systemTheme.addEventListener('change', (event) => {
  try { if (localStorage.getItem('skill-studio-theme')) return; } catch { /* Follow system theme when storage is unavailable. */ }
  document.documentElement.dataset.theme = event.matches ? 'dark' : 'light';
  syncThemeControl();
});

const templates = {
  blank: {},
  design: {
    name: 'thoughtful-ui-design',
    description: '사용자가 웹 화면의 디자인과 사용성을 개선하고 싶을 때, 현재 구조를 살피고 의도가 분명한 UI로 다듬는다.',
    trigger: '새 화면을 만들거나 기존 웹 UI의 시각적 완성도를 높일 때 사용한다.',
    steps: '화면의 목적과 주요 사용자를 확인한다\n현재 정보 계층과 레이아웃을 살펴본다\n색상과 타이포그래피 기준을 정한다\n핵심 화면을 구현하고 모바일에서도 확인한다',
    rules: '한 화면에 분명한 시각적 중심을 둔다\n모든 버튼에 누르는 즉시 보이는 피드백을 준다\n텍스트와 배경의 대비를 충분히 확보한다',
    avoid: '근거 없이 브랜드 문구를 바꾸지 않는다\n의미 없는 애니메이션을 남발하지 않는다',
    output: '수정한 화면과 핵심 디자인 결정, 확인한 반응형 동작을 설명한다.',
    checks: '모바일 화면에서 텍스트와 버튼이 잘 보이는가\n키보드로 주요 기능을 사용할 수 있는가\n움직임 줄이기 설정에서도 정보가 보이는가'
  },
  review: {
    name: 'focused-code-review',
    description: '코드 변경의 실제 동작과 회귀 위험을 검토하고 재현 가능한 문제만 보고한다.',
    trigger: '사용자가 코드 변경이나 Pull Request 검토를 요청할 때 사용한다.',
    steps: '변경 목적과 영향받는 파일을 확인한다\n호출 경로와 기존 동작을 비교한다\n문제를 재현하거나 근거를 확인한다\n중요도순으로 발견 사항을 정리한다',
    rules: '문제 위치와 영향받는 조건을 구체적으로 적는다\n확인하지 못한 추측은 발견 사항으로 단정하지 않는다',
    avoid: '스타일 취향만으로 결함이라고 주장하지 않는다',
    output: '발견 사항, 심각도, 재현 조건, 남은 검증 범위를 간결하게 제시한다.',
    checks: '각 발견 사항에 코드 근거가 있는가\n실제 사용자 동작에 영향을 주는가'
  },
  writing: {
    name: 'clear-korean-writing',
    description: '목적과 독자를 고려해 자연스럽고 읽기 쉬운 한국어 문장을 작성하고 다듬는다.',
    trigger: '안내문, 소개글, 제품 문구의 초안 작성이나 수정을 요청받을 때 사용한다.',
    steps: '글의 목적과 독자를 확인한다\n핵심 메시지를 한 문장으로 정리한다\n짧은 문단으로 초안을 작성한다\n소리 내어 읽었을 때 어색한 표현을 고친다',
    rules: '한 문단에 한 가지 생각을 담는다\n사용자가 제공한 고유명사와 수치를 정확히 유지한다',
    avoid: '근거 없는 사실이나 과장된 약속을 만들지 않는다\n불필요한 외래어를 반복하지 않는다',
    output: '바로 사용할 수 있는 완성 문장과 필요할 때만 짧은 대안을 제시한다.',
    checks: '독자가 첫 문장에서 목적을 알 수 있는가\n문장과 맞춤법이 자연스러운가'
  }
};

const checks = [
  { label: '올바른 이름', test: (d) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(d.name) && d.name.length < 64 },
  { label: '역할 설명', test: (d) => d.description.length >= 20 },
  { label: '사용 시점', test: (d) => d.trigger.length >= 10 },
  { label: '작업 단계', test: (d) => lines(d.steps).length >= 2 },
  { label: '구체적 기준', test: (d) => lines(d.rules).length >= 1 },
  { label: '완료 확인', test: (d) => lines(d.checks).length >= 1 }
];

function lines(value) {
  return value.split('\n').map((line) => line.trim()).filter(Boolean);
}

function readDraft() {
  return Object.fromEntries(FIELD_NAMES.map((name) => [name, form.elements[name].value.trim()]));
}

function quoteYaml(value) {
  return JSON.stringify(value.replace(/\s+/g, ' ').trim());
}

function bulletSection(title, value) {
  const items = lines(value);
  return items.length ? `\n## ${title}\n\n${items.map((item) => `- ${item}`).join('\n')}\n` : '';
}

function markdownFor(draft) {
  const name = draft.name || 'my-skill';
  const description = draft.description || '이 Skill의 역할과 언제 사용하는지 설명하세요.';
  let markdown = `---\nname: ${quoteYaml(name)}\ndescription: ${quoteYaml(description)}\n---\n\n# ${name}\n`;
  if (draft.trigger) markdown += `\n## 사용 시점\n\n${draft.trigger}\n`;
  const steps = lines(draft.steps);
  if (steps.length) markdown += `\n## 작업 방식\n\n${steps.map((item, index) => `${index + 1}. ${item}`).join('\n')}\n`;
  markdown += bulletSection('지켜야 할 기준', draft.rules);
  markdown += bulletSection('피해야 할 것', draft.avoid);
  if (draft.output) markdown += `\n## 결과물\n\n${draft.output}\n`;
  markdown += bulletSection('완료 전 확인', draft.checks);
  return markdown;
}

function previewToken(parent, className, value) {
  const token = document.createElement('span');
  token.className = className;
  token.textContent = value;
  parent.appendChild(token);
}

function previewInline(parent, value) {
  const syntax = /(`[^`]+`|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*\n]+\*)/g;
  let cursor = 0;
  for (const match of value.matchAll(syntax)) {
    parent.appendChild(document.createTextNode(value.slice(cursor, match.index)));
    const token = match[0];
    const className = token.startsWith('`') ? 'md-code'
      : token.startsWith('[') ? 'md-link'
        : 'md-emphasis';
    previewToken(parent, className, token);
    cursor = match.index + token.length;
  }
  parent.appendChild(document.createTextNode(value.slice(cursor)));
}

function renderMarkdownPreview(markdown) {
  const fragment = document.createDocumentFragment();
  let inFrontmatter = false;
  markdown.split('\n').forEach((line, index) => {
    if (index) fragment.appendChild(document.createTextNode('\n'));
    const row = document.createElement('span');
    row.className = 'md-line';
    if ((index === 0 || index === 3) && line === '---') {
      inFrontmatter = !inFrontmatter;
      previewToken(row, 'md-divider', line);
    } else if (inFrontmatter && /^(name|description):/.test(line)) {
      const separator = line.indexOf(':') + 1;
      previewToken(row, 'md-key', line.slice(0, separator));
      previewToken(row, 'md-string', line.slice(separator));
    } else {
      const heading = line.match(/^(#{1,6})(\s+)/);
      const list = line.match(/^(\s*)(- |\d+\. )/);
      if (heading) {
        previewToken(row, 'md-marker', heading[0]);
        const title = document.createElement('span');
        title.className = 'md-heading';
        previewInline(title, line.slice(heading[0].length));
        row.appendChild(title);
      } else if (list) {
        row.appendChild(document.createTextNode(list[1]));
        previewToken(row, 'md-marker', list[2]);
        previewInline(row, line.slice(list[0].length));
      } else {
        previewInline(row, line);
      }
    }
    fragment.appendChild(row);
  });
  preview.replaceChildren(fragment);
}

function announce(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
}

function saveDraft(draft) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(draft)); }
  catch { /* Private browsing can block local storage. Editing still works. */ }
}

function resizeTextareas() {
  form.querySelectorAll('textarea').forEach((field) => {
    field.style.height = 'auto';
    const minimum = parseFloat(getComputedStyle(field).minHeight) || 0;
    field.style.height = `${Math.max(field.scrollHeight, minimum)}px`;
  });
}

function render() {
  const draft = readDraft();
  const guideName = draft.name && checks[0].test(draft) ? draft.name : 'my-skill';
  const guideRoots = {
    'codex-project': '.agents/skills/',
    'codex-personal': '~/.agents/skills/',
    'claude-project': '.claude/skills/',
    'claude-personal': '~/.claude/skills/'
  };
  document.querySelectorAll('[data-guide-path]').forEach((element) => {
    element.textContent = `${guideRoots[element.dataset.guidePath]}${guideName}/SKILL.md`;
  });
  document.querySelectorAll('[data-guide-name]').forEach((element) => { element.textContent = guideName; });
  resizeTextareas();
  renderMarkdownPreview(markdownFor(draft));
  filePath.textContent = draft.name && checks[0].test(draft) ? `${draft.name}/SKILL.md` : '새 Skill';
  const passed = checks.filter((check) => check.test(draft)).length;
  score.textContent = String(passed);
  progress.style.width = `${(passed / checks.length) * 100}%`;
  qualityList.replaceChildren(...checks.map((check) => {
    const item = document.createElement('li');
    item.textContent = check.label;
    if (check.test(draft)) item.classList.add('is-complete');
    return item;
  }));
  saveDraft(draft);
}

function selectGuide(id, focus = false) {
  guideTabs.forEach((tab) => {
    const selected = tab.dataset.guideTab === id;
    tab.classList.toggle('is-active', selected);
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    document.querySelector(`#guide-${tab.dataset.guideTab}`).hidden = !selected;
    if (selected && focus) tab.focus();
  });
}

guideTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectGuide(tab.dataset.guideTab));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? guideTabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + guideTabs.length) % guideTabs.length;
    selectGuide(guideTabs[nextIndex].dataset.guideTab, true);
  });
});

function loadDraft(draft) {
  FIELD_NAMES.forEach((name) => { form.elements[name].value = draft[name] || ''; });
  render();
}

function selectTemplate(id) {
  document.querySelectorAll('[data-template]').forEach((button) => {
    const selected = button.dataset.template === id;
    button.classList.toggle('is-active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
}

function canExport(draft) {
  if (!checks[0].test(draft)) {
    announce('이름은 영문 소문자·숫자·하이픈으로 작성해주세요.');
    form.elements.name.focus();
    return false;
  }
  if (!draft.description) {
    announce('Skill의 역할 설명을 작성해주세요.');
    form.elements.description.focus();
    return false;
  }
  return true;
}

document.querySelectorAll('[data-template]').forEach((button) => {
  button.addEventListener('click', () => {
    const id = button.dataset.template;
    if (id !== 'blank' && FIELD_NAMES.some((name) => form.elements[name].value.trim()) && !window.confirm('현재 작성한 내용을 템플릿으로 바꿀까요?')) return;
    loadDraft(templates[id]);
    selectTemplate(id);
    announce(id === 'blank' ? '빈 문서로 시작합니다.' : '템플릿을 불러왔습니다. 내 방식에 맞게 고쳐보세요.');
  });
});

form.addEventListener('input', () => {
  selectTemplate('blank');
  render();
});

document.querySelectorAll('[data-action]').forEach((button) => {
  button.addEventListener('click', async () => {
    const draft = readDraft();
    if (button.dataset.action === 'reset') {
      if (!FIELD_NAMES.some((name) => draft[name]) || window.confirm('작성한 내용을 모두 지우고 처음부터 시작할까요?')) {
        loadDraft({});
        selectTemplate('blank');
        form.elements.name.focus();
        announce('새 문서가 준비됐어요.');
      }
      return;
    }
    if (!canExport(draft)) return;
    const content = markdownFor(draft);
    if (button.dataset.action === 'copy') {
      try {
        await navigator.clipboard.writeText(content);
        announce('SKILL.md 내용을 복사했어요.');
      } catch {
        announce('복사 권한이 없어요. 파일 다운로드를 이용해주세요.');
      }
      return;
    }
    const url = URL.createObjectURL(new Blob([content], { type: 'text/markdown;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'SKILL.md';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce('SKILL.md 파일을 다운로드했어요.');
  });
});

try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  if (saved && typeof saved === 'object') loadDraft(saved);
  else render();
} catch { render(); }
selectTemplate('blank');
