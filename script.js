const STORAGE_KEY = 'skill-studio-draft-v1';
const tr = window.studioText;
const FIELD_NAMES = ['name', 'description', 'trigger', 'steps', 'rules', 'avoid', 'output', 'checks'];
const form = document.querySelector('#skill-form');
const preview = document.querySelector('#markdown-preview');
const filePath = document.querySelector('#file-path');
const scoreWheel = document.querySelector('.score-wheel');
const scoreAnnouncement = document.querySelector('#quality-score-announcement');
const progress = document.querySelector('#quality-progress');
const qualityList = document.querySelector('#quality-list');
const toast = document.querySelector('#toast');
const themeToggle = document.querySelector('#theme-toggle');
const guideTabs = [...document.querySelectorAll('[data-guide-tab]')];
const platformGuide = document.querySelector('.platform-guide');
const fieldInfoButtons = [...document.querySelectorAll('[data-field-info]')];
let toastTimer;
let previewMotionTimer;

if ('IntersectionObserver' in window) {
  const pageElements = document.querySelectorAll('.topbar > *, .editor-intro-row > *, .builder > .panel-heading, .builder > .template-row, .builder .form-section, .builder-footer, .preview-stack > :not(.platform-guide), .site-footer > *');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
  pageElements.forEach((element) => {
    element.classList.add('page-reveal');
  });
  pageElements.forEach((element) => revealObserver.observe(element));
}

if (platformGuide && 'IntersectionObserver' in window) {
  const guideObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
  platformGuide.classList.add('guide-motion-ready');
  guideObserver.observe(platformGuide);
}

function closeFieldInfo(except) {
  fieldInfoButtons.forEach((button) => {
    if (button === except) return;
    button.setAttribute('aria-expanded', 'false');
    document.getElementById(button.getAttribute('aria-controls')).hidden = true;
  });
}

fieldInfoButtons.forEach((button) => {
  const help = document.getElementById(button.getAttribute('aria-controls'));
  button.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'touch') return;
    closeFieldInfo(button);
    button.setAttribute('aria-expanded', 'true');
    help.hidden = false;
  });
  button.addEventListener('pointerleave', () => {
    if (button.matches(':focus-visible')) return;
    button.setAttribute('aria-expanded', 'false');
    help.hidden = true;
  });
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
  const nextTheme = isDark ? tr('라이트', 'light') : tr('다크', 'dark');
  document.querySelector('meta[name="theme-color"]').content = isDark ? '#000000' : '#fafcff';
  themeToggle.setAttribute('aria-label', tr(`${nextTheme} 모드로 전환`, `Switch to ${nextTheme} mode`));
  themeToggle.title = tr(`${nextTheme} 모드로 전환`, `Switch to ${nextTheme} mode`);
}

syncThemeControl();
themeToggle.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = nextTheme;
  try { localStorage.setItem('skill-studio-theme', nextTheme); } catch { /* Theme still works for this visit. */ }
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

if (window.studioEnglish) Object.assign(templates, {
  design: {
    name: 'thoughtful-ui-design',
    description: 'Improve the design and usability of a web screen by inspecting its structure and refining it into a clear, intentional interface.',
    trigger: 'Use when creating a new screen or improving the visual quality of an existing web UI.',
    steps: 'Identify the screen’s purpose and main users\nReview the information hierarchy and layout\nSet color and typography rules\nImplement the core screen and check mobile',
    rules: 'Give each screen a clear visual focus\nProvide immediate press feedback for every button\nKeep text and background contrast readable',
    avoid: 'Do not change brand copy without a reason\nDo not add decorative motion without purpose',
    output: 'Explain the updated screen, key design decisions, and responsive behavior checked.',
    checks: 'Is the text and are the buttons clear on mobile?\nCan users access key functions with a keyboard?\nIs content visible with reduced motion?'
  },
  review: {
    name: 'focused-code-review',
    description: 'Review actual behavior and regression risks in code changes, reporting only reproducible problems.',
    trigger: 'Use when a user requests a review of a code change or pull request.',
    steps: 'Understand the change and affected files\nCompare call paths with previous behavior\nReproduce issues or confirm evidence\nReport findings by severity',
    rules: 'Give the location and conditions for each issue\nDo not present unverified guesses as findings',
    avoid: 'Do not call a style preference a defect',
    output: 'Report findings, severity, reproduction conditions, and remaining verification limits.',
    checks: 'Does each finding have code evidence?\nDoes it affect real user behavior?'
  },
  writing: {
    name: 'clear-english-writing',
    description: 'Write and refine natural, easy-to-read English with the purpose and audience in mind.',
    trigger: 'Use when asked to draft or edit help text, introductions, or product copy.',
    steps: 'Identify the purpose and audience\nSummarize the main message in one sentence\nWrite short paragraphs\nRead aloud and fix awkward phrasing',
    rules: 'Keep one idea per paragraph\nPreserve user-provided names and numbers',
    avoid: 'Do not invent facts or overpromise\nDo not repeat unnecessary jargon',
    output: 'Provide ready-to-use copy and brief alternatives only when helpful.',
    checks: 'Is the purpose clear in the first sentence?\nIs the wording natural and correct?'
  }
});

const checks = [
  { label: tr('올바른 이름', 'Valid name'), field: 'name', hint: tr('영문 소문자·숫자·하이픈만 사용하고, 64자 미만으로 적어주세요.', 'Use lowercase letters, numbers, and hyphens; keep it under 64 characters.'), test: (d) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(d.name) && d.name.length < 64 },
  { label: tr('역할 설명', 'Purpose'), field: 'description', hint: tr('어떤 일을 하는지 20자 이상 적어주세요.', 'Describe what it does in at least 20 characters.'), test: (d) => d.description.length >= 20 },
  { label: tr('사용 시점', 'When to use'), field: 'trigger', hint: tr('언제 사용할지 10자 이상 적어주세요.', 'Describe when to use it in at least 10 characters.'), test: (d) => d.trigger.length >= 10 },
  { label: tr('작업 단계', 'Steps'), field: 'steps', hint: tr('작업 단계를 줄바꿈으로 2개 이상 적어주세요.', 'Put at least two steps on separate lines.'), test: (d) => lines(d.steps).length >= 2 },
  { label: tr('구체적 기준', 'Rules'), field: 'rules', hint: tr('지켜야 할 기준을 1개 이상 적어주세요.', 'Add at least one rule.'), test: (d) => lines(d.rules).length >= 1 },
  { label: tr('완료 확인', 'Final checks'), field: 'checks', hint: tr('완료 전 확인할 항목을 1개 이상 적어주세요.', 'Add at least one final check.'), test: (d) => lines(d.checks).length >= 1 }
];

const checkHints = new Map(checks.map((check) => {
  const field = form.elements[check.field];
  const hint = document.createElement('p');
  hint.className = 'validation-hint';
  hint.id = `${field.id}-validation`;
  hint.hidden = true;
  field.insertAdjacentElement('afterend', hint);
  return [check.field, hint];
}));

function rollScore(next) {
  scoreAnnouncement.textContent = `${next} / ${checks.length}`;
  scoreWheel.style.transform = `translateY(-${next * 27}px)`;
}

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
  const description = draft.description || tr('이 Skill의 역할과 언제 사용하는지 설명하세요.', 'Describe what this Skill does and when to use it.');
  let markdown = `---\nname: ${quoteYaml(name)}\ndescription: ${quoteYaml(description)}\n---\n\n# ${name}\n`;
  if (draft.trigger) markdown += `\n## ${tr('사용 시점', 'When to use')}\n\n${draft.trigger}\n`;
  const steps = lines(draft.steps);
  if (steps.length) markdown += `\n## ${tr('작업 방식', 'Workflow')}\n\n${steps.map((item, index) => `${index + 1}. ${item}`).join('\n')}\n`;
  markdown += bulletSection(tr('지켜야 할 기준', 'Rules'), draft.rules);
  markdown += bulletSection(tr('피해야 할 것', 'Avoid'), draft.avoid);
  if (draft.output) markdown += `\n## ${tr('결과물', 'Output')}\n\n${draft.output}\n`;
  markdown += bulletSection(tr('완료 전 확인', 'Final checks'), draft.checks);
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
    const row = document.createElement('span');
    row.className = 'md-line';
    const lineNumber = document.createElement('span');
    lineNumber.className = 'md-line-number';
    lineNumber.setAttribute('aria-hidden', 'true');
    lineNumber.textContent = String(index + 1);
    row.appendChild(lineNumber);
    const content = document.createElement('span');
    content.className = 'md-line-content';
    if ((index === 0 || index === 3) && line === '---') {
      inFrontmatter = !inFrontmatter;
      previewToken(content, 'md-divider', line);
    } else if (inFrontmatter && /^(name|description):/.test(line)) {
      const separator = line.indexOf(':') + 1;
      previewToken(content, 'md-key', line.slice(0, separator));
      previewToken(content, 'md-string', line.slice(separator));
    } else {
      const heading = line.match(/^(#{1,6})(\s+)/);
      const list = line.match(/^(\s*)(- |\d+\. )/);
      if (heading) {
        previewToken(content, 'md-marker', heading[0]);
        const title = document.createElement('span');
        title.className = 'md-heading';
        previewInline(title, line.slice(heading[0].length));
        content.appendChild(title);
      } else if (list) {
        content.appendChild(document.createTextNode(list[1]));
        previewToken(content, 'md-marker', list[2]);
        previewInline(content, line.slice(list[0].length));
      } else {
        previewInline(content, line);
      }
    }
    row.appendChild(content);
    fragment.appendChild(row);
  });
  preview.replaceChildren(fragment);
}

function announce(message, undoAction) {
  toast.textContent = message;
  if (undoAction) {
    const undoButton = document.createElement('button');
    undoButton.type = 'button';
    undoButton.textContent = tr('되돌아가기', 'Undo');
    undoButton.addEventListener('click', undoAction);
    toast.appendChild(undoButton);
  }
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), undoAction ? 10000 : 2600);
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
  const previewSurface = preview.closest('.code-preview');
  if (previewSurface && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    clearTimeout(previewMotionTimer);
    previewSurface.classList.remove('is-updating');
    previewMotionTimer = setTimeout(() => {
      previewSurface.classList.remove('is-updating');
      void previewSurface.offsetWidth;
      previewSurface.classList.add('is-updating');
    }, 120);
  }
  filePath.textContent = `${guideName}/SKILL.md`;
  const passed = checks.filter((check) => check.test(draft)).length;
  rollScore(passed);
  progress.style.width = `${(passed / checks.length) * 100}%`;
  qualityList.replaceChildren(...checks.map((check) => {
    const item = document.createElement('li');
    const valid = check.test(draft);
    item.textContent = check.label;
    if (valid) item.classList.add('is-complete');
    else if (draft[check.field]) item.title = check.hint;
    const field = form.elements[check.field];
    const hint = checkHints.get(check.field);
    const invalid = Boolean(draft[check.field]) && !valid;
    hint.hidden = !invalid;
    hint.textContent = invalid ? check.hint : '';
    field.setAttribute('aria-invalid', String(invalid));
    if (invalid) field.setAttribute('aria-describedby', hint.id);
    else field.removeAttribute('aria-describedby');
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
  FIELD_NAMES.forEach((name) => {
    const field = form.elements[name];
    const value = draft && typeof draft[name] === 'string' ? draft[name] : '';
    field.value = field.maxLength > 0 ? value.slice(0, field.maxLength) : value;
  });
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
    announce(tr('이름은 영문 소문자·숫자·하이픈으로 작성해주세요.', 'Use lowercase letters, numbers, and hyphens for the name.'));
    form.elements.name.focus();
    return false;
  }
  if (!draft.description) {
    announce(tr('Skill의 역할 설명을 작성해주세요.', 'Describe what this Skill does.'));
    form.elements.description.focus();
    return false;
  }
  return true;
}

document.querySelectorAll('[data-template]').forEach((button) => {
  button.addEventListener('click', () => {
    const id = button.dataset.template;
    if (id !== 'blank' && FIELD_NAMES.some((name) => form.elements[name].value.trim()) && !window.confirm(tr('현재 작성한 내용을 템플릿으로 바꿀까요?', 'Replace your current draft with this template?'))) return;
    const previousDraft = Object.fromEntries(FIELD_NAMES.map((name) => [name, form.elements[name].value]));
    const previousTemplate = document.querySelector('[data-template][aria-pressed="true"]')?.dataset.template || 'blank';
    loadDraft(templates[id]);
    selectTemplate(id);
    announce(id === 'blank' ? tr('빈 문서로 시작합니다.', 'Starting with a blank document.') : tr('템플릿을 불러왔습니다.', 'Template loaded.'), () => {
      loadDraft(previousDraft);
      selectTemplate(previousTemplate);
      announce(tr('이전 내용으로 되돌렸어요.', 'Previous draft restored.'));
    });
  });
});

form.addEventListener('input', () => {
  toast.classList.remove('is-visible');
  selectTemplate('blank');
  render();
});

document.querySelectorAll('[data-action]').forEach((button) => {
  button.addEventListener('click', async () => {
    const draft = readDraft();
    if (button.dataset.action === 'reset') {
      if (!FIELD_NAMES.some((name) => draft[name]) || window.confirm(tr('작성한 내용을 모두 지우고 처음부터 시작할까요?', 'Clear your draft and start over?'))) {
        loadDraft({});
        selectTemplate('blank');
        form.elements.name.focus();
        announce(tr('새 문서가 준비됐어요.', 'New document ready.'));
      }
      return;
    }
    if (!canExport(draft)) return;
    const content = markdownFor(draft);
    if (button.dataset.action === 'copy') {
      try {
        await navigator.clipboard.writeText(content);
        announce(tr('SKILL.md 내용을 복사했어요.', 'SKILL.md copied.'));
      } catch {
        announce(tr('복사 권한이 없어요. 파일 다운로드를 이용해주세요.', 'Clipboard access is unavailable. Download the file instead.'));
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
    announce(tr('SKILL.md 파일을 다운로드했어요.', 'SKILL.md downloaded.'));
  });
});

try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  if (saved && typeof saved === 'object') loadDraft(saved);
  else render();
} catch { render(); }
selectTemplate('blank');
