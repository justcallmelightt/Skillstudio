// The English MVP shares the Korean page structure and interaction code.
const english = new URLSearchParams(location.search).get('lang') === 'en';
window.studioEnglish = english;
window.studioText = (korean, translation) => english ? translation : korean;

document.querySelectorAll('[data-language-link]').forEach((link) => {
  link.href = english ? location.pathname : `${location.pathname}?lang=en`;
  link.textContent = english ? '한국어' : 'English';
  link.lang = english ? 'ko' : 'en';
  link.setAttribute('aria-label', english ? 'Switch to Korean' : '영어로 전환');
});

if (english) {
  document.documentElement.lang = 'en';
  document.querySelectorAll('a[href^="./about.html"], a[href^="./benefits.html"], a[href^="./index.html"]').forEach((link) => {
    link.href = `${link.getAttribute('href')}?lang=en`;
  });
  document.querySelectorAll('a.brand[href="./"]').forEach((link) => { link.href = './?lang=en'; });

  const phrases = new Map(Object.entries({
    '새 Skill 만들기': 'Create a Skill',
    'Skill 만들기': 'Create a Skill',
    'Skill이란? · 왜 쓸까요?': 'What is a Skill? · Why use one?',
    'Skill을 쓰면 뭐가 달라질까요?': 'What changes with a Skill?',
    '반복 설명을 줄이는 실제 예시 대화를 따로 살펴보세요.': 'See real-world examples of how a Skill reduces repeated explanations.',
    'Skill의 장점 보기': 'See the benefits',
    'Skill을 쓰면 뭐가 좋을까요?': 'Why use a Skill?',
    '같은 기준을 여러 번 설명하는 대신, 이름으로 불러 다시 사용할 수 있어요.': 'Call a saved workflow by name instead of explaining the same criteria again.',
    'Skill이 처음인가요?': 'New to Skills?',
    'Skill의 정의와 파일 구조를 먼저 살펴보세요.': 'Start with the definition and file structure.',
    'Skill은 AI에게 매번 다시 설명하던 작업 방식을, 다음에도 꺼내 쓸 수 있도록 정리한 지침입니다.': 'A Skill saves the way you work, so you do not have to explain it to AI every time.',
    '내 작업 방식을 적으면 오른쪽에서': 'Describe your workflow and see it become',
    '로 정리됩니다.': 'on the right.',
    'Skill 설계': 'Design your Skill',
    '시작점 선택': 'Choose a starting point',
    '빈 문서': 'Blank',
    '디자인': 'Design',
    '코드 리뷰': 'Code review',
    '글쓰기': 'Writing',
    '기본 정보': 'Basics',
    'Skill 이름': 'Skill name',
    '필수': 'Required',
    '설치 폴더와 호출 이름에 쓰여요. 영문 소문자, 숫자, 하이픈으로 적어주세요.': 'Used for the folder and invocation name. Use lowercase letters, numbers, and hyphens.',
    '이 Skill은 어떤 일을 하나요?': 'What does this Skill do?',
    'AI가 이 Skill을 사용할 상황을 판단하는 소개예요. 할 일과 사용 시점을 함께 적어주세요.': 'Helps AI decide when to use this Skill. Include the task and when it applies.',
    '언제 사용하면 좋나요?': 'When should it be used?',
    '어떤 요청에서 이 지침을 꺼낼지 더 구체적으로 정해요.': 'Describe the kinds of requests that should activate these instructions.',
    '작업 방식': 'Workflow',
    '어떤 순서로 작업해야 하나요?': 'What steps should it follow?',
    'AI가 반복해서 따를 작업 순서예요.': 'The sequence AI should follow each time.',
    '꼭 지켜야 할 기준은 무엇인가요?': 'What rules must it follow?',
    '작업하는 동안 반드시 지켜야 할 원칙을 남겨요.': 'List the principles it must follow while working.',
    '피해야 할 것은 무엇인가요?': 'What should it avoid?',
    '반복해서 생기는 실수나 원하지 않는 결과를 예방해요.': 'Prevent recurring mistakes and unwanted results.',
    '완료 기준': 'Definition of done',
    '결과물은 어떤 모습이어야 하나요?': 'What should the result look like?',
    '작업이 끝났을 때 어떤 형태로 결과를 받을지 정해요.': 'Describe the format of the final result.',
    '완료 전에 무엇을 확인해야 하나요?': 'What should it check before finishing?',
    '마무리 전에 빠뜨리지 않고 검토할 항목이에요.': 'Checks to complete before wrapping up.',
    '처음부터 다시': 'Start over',
    '작성 내용은 이 브라우저에만 저장돼요.': 'Your draft stays in this browser.',
    '내 브라우저에 자동 저장': 'Autosaved in this browser',
    '실시간': 'Live',
    '파일 다운로드': 'Download file',
    '내용 복사': 'Copy content',
    '완성도 점검': 'Completeness check',
    '점검은 내용의 유무를 알려줘요. 실제 지침이 명확한지도 직접 읽어보세요.': 'This checks whether key fields are filled in, not whether the instructions work. Review them yourself.',
    '어디에서 사용하나요?': 'Where do I use it?',
    '다운로드한 SKILL.md를 원하는 도구의 폴더에 넣으세요.': 'Put the downloaded SKILL.md in your tool’s Skill folder.',
    '프로젝트에서 함께 쓰려면': 'For this project',
    '내 모든 프로젝트에서 쓰려면': 'For all your projects',
    '폴더를 만든 뒤 파일을 넣고, Codex에 이 Skill을 사용해 달라고 요청하세요.': 'Create the folder, add the file, and ask Codex to use this Skill.',
    '폴더를 만든 뒤 파일을 넣고, Claude Code에서': 'Create the folder, add the file, then type',
    '을 입력하세요.': 'in Claude Code.',
    'Codex 공식 가이드 ↗': 'Codex official guide ↗',
    'Claude Code 공식 가이드 ↗': 'Claude Code official guide ↗',
    '좋은 지침은 좋은 결과의 시작입니다.': 'Better instructions start better work.',
    'Skill Studio 안내': 'Skill Studio guide',
    'Skill이란?': 'What is a Skill?',
    'AI에게 매번 다시 설명하던 작업 방식을, 다음에도 꺼내 쓸 수 있도록 정리한 지침입니다.': 'A reusable set of instructions for the workflow you used to explain to AI again and again.',
    '파일 하나에서 시작해요.': 'Start with one file.',
    'Skill의 중심은': 'The heart of a Skill is',
    '라는 문서입니다. 어떤 일을 맡길지, 언제 사용하면 좋은지, 어떤 순서와 기준을 따라야 하는지를 적습니다. 필요하면 참고 자료나 스크립트를 같은 폴더에 더할 수도 있어요.': '. It describes the task, when to use it, and the steps and rules to follow. You can add references or scripts to the same folder when needed.',
    '예를 들면': 'For example',
    '“코드 리뷰할 때 추측은 빼고, 재현 가능한 문제와 근거부터 찾아줘.”': '“When reviewing code, skip speculation. Find reproducible issues and evidence first.”',
    '이 작업 방식을 Skill로 저장해두면 다음 리뷰에서도 다시 활용할 수 있습니다.': 'Save that approach as a Skill and reuse it for the next review.',
    'Skill 사용 예시': 'Skill in action',
    '반복 설명은, Skill 이름 하나로.': 'Replace repeated explanations with one Skill name.',
    '같은 일을 요청할 때, Skill을 쓰기 전과 후를 비교해보세요.': 'Compare the same request before and after using a Skill.',
    '예시 대화 · 실제 AI 연결 아님': 'Illustrative dialogue · no live AI connection',
    'Skill 없이': 'Without a Skill',
    '매번 기준을 다시 설명': 'Explain your criteria every time',
    '이 화면의 정보 계층과 간격을 다듬고 실제 UI에 반영해줘. 먼저 화면 목적과 사용자를 살펴보고, 색상과 타이포그래피를 정리해줘. 버튼을 누를 때 반응이 있는지, 글자 대비가 충분한지 확인하고 모바일과 키보드 사용도 점검해줘.': 'Refine this screen’s hierarchy and spacing and implement the changes. Check the screen’s purpose and users, colors, typography, press feedback, contrast, mobile layout, and keyboard access.',
    '색상과 간격을 조정했어요. 버튼 상태와 모바일 화면은 아직 반영하지 않았어요.': 'I adjusted the colors and spacing, but have not implemented button states or the mobile layout yet.',
    '버튼 반응도 실제로 구현해줘. 누를 때 바로 반응해야 해.': 'Implement the button feedback too. It should respond as soon as I press it.',
    '버튼에 마우스를 올렸을 때의 효과를 추가했어요.': 'I added a hover effect to the button.',
    '마우스를 올릴 때만 바뀌고 누를 때는 반응이 없어. 모바일 레이아웃도 여전히 깨져 있어. 빠진 부분까지 구현하고 확인해줘.': 'It only changes on hover, not on press. The mobile layout is still broken. Implement and check the missing parts.',
    '눌림 상태와 모바일 레이아웃까지 반영하고 확인할게요.': 'I will implement and check the pressed state and mobile layout.',
    'thoughtful-ui-design로 이 화면의 정보 계층과 간격을 다듬어줘. 모바일도 확인해줘.': 'Use thoughtful-ui-design to refine this screen’s hierarchy and spacing. Check mobile too.',
    'Skill의 디자인 기준을 읽는 중': 'Reading the Skill’s design criteria',
    'thoughtful-ui-design을 사용하여 시각적 중심, 대비, 버튼 반응을 점검하고 수정할게요.': 'I will use thoughtful-ui-design to check and improve the visual focus, contrast, and button feedback.',
    '이번 코드 변경을 검토해줘. 변경 목적과 영향받는 파일을 먼저 확인하고 기존 동작과 비교해줘. 문제를 찾으면 재현 조건과 코드 근거를 함께 적어줘. 확인하지 못한 추측이나 스타일 취향은 결함처럼 단정하지 말고 중요도순으로 알려줘.': 'Review this code change. Check its purpose and affected files, compare previous behavior, and report reproducible issues with code evidence in priority order. Do not present speculation or style preferences as defects.',
    '코드 스타일과 변수 이름부터 정리했어요.': 'I started by cleaning up code style and variable names.',
    '스타일보다 실제 동작의 문제를 봐줘. 기존 동작과 비교하고 코드 근거도 함께 적어줘.': 'Look for behavior issues, not style changes. Compare previous behavior and include code evidence.',
    '문제가 의심되는 부분을 찾았어요.': 'I found something that might be a problem.',
    '추측만으로는 판단하기 어려워. 재현 조건을 확인하고, 확인된 문제만 중요도순으로 알려줘.': 'A guess is not enough. Check how to reproduce it and report only confirmed issues in priority order.',
    '재현 조건과 근거를 다시 확인해 보고할게요.': 'I will verify the reproduction steps and evidence before reporting.',
    'focused-code-review Skill로 이번 변경을 검토해줘. 재현 가능한 문제만 알려줘.': 'Use focused-code-review to review this change. Report only reproducible issues.',
    'Skill의 검토 기준을 읽는 중': 'Reading the Skill’s review criteria',
    'focused-code-review를 사용하여 변경 목적과 영향받는 동작을 확인하고, 근거가 있는 문제부터 정리할게요.': 'I will use focused-code-review to check the intent and affected behavior, then report evidence-backed issues.',
    '이 안내 문장을 더 쉽고 자연스럽게 바꿔줘. 글의 목적과 읽는 사람을 고려하고, 한 문단에는 한 생각만 담아줘. 내가 쓴 고유명사와 수치는 유지하고 과장하거나 근거 없는 사실은 넣지 마. 읽었을 때 어색한 표현도 고쳐줘.': 'Make this help text clearer and more natural. Consider its purpose and audience, keep one idea per paragraph, preserve names and numbers, and avoid exaggeration or unsupported claims.',
    '더 눈에 띄도록 효과를 과장한 문장으로 바꿨어요.': 'I exaggerated the claims to make the text stand out.',
    '과장하지 말라고 했어. 근거 없는 표현은 빼고 원래 뜻을 살려줘.': 'I said not to exaggerate. Remove unsupported wording and preserve the original meaning.',
    '표현을 줄이면서 제품 이름도 더 쉬운 말로 바꿨어요.': 'I shortened the text and replaced the product name with a simpler phrase.',
    '고유명사는 그대로 둬야 해. 이름과 수치를 복원하고, 한 문단에 한 생각만 남겨줘.': 'Keep proper names unchanged. Restore the names and numbers, and leave one idea per paragraph.',
    '이름과 수치를 복원하고 문단을 다시 나눌게요.': 'I will restore the names and numbers and reorganize the paragraphs.',
    'clear-korean-writing Skill로 이 안내 문장을 더 쉽고 자연스럽게 바꿔줘.': 'Use clear-korean-writing to make this help text clearer and more natural.',
    'Skill의 글쓰기 기준을 읽는 중': 'Reading the Skill’s writing criteria',
    'clear-korean-writing': 'clear-english-writing',
    'clear-korean-writing을 사용하여 독자와 목적을 먼저 확인하고, 뜻은 유지하면서 읽기 쉽게 다듬을게요.': 'I will use clear-korean-writing to check the audience and purpose, then improve readability while preserving the meaning.',
    'Skill을 사용하면': 'With a Skill',
    '저장한 기준으로 짧게 요청': 'Ask briefly using saved criteria',
    '위 대화들은 실제 경험을 바탕으로 재구성한 예시입니다.': 'These example conversations are reconstructed from real experiences.',
    '실제 결과는 Skill 내용과 요청에 따라 달라집니다.': 'Actual results depend on the Skill and your request.',
    '이 사이트에서는 이렇게 만듭니다.': 'How to make one here',
    '작성': 'Write',
    '이름과 역할, 작업 방식, 꼭 지킬 기준을 적습니다.': 'Describe the name, purpose, workflow, and rules.',
    '확인': 'Review',
    '오른쪽 미리보기에서 만들어질': 'Read the generated',
    '내용을 읽습니다.': 'in the live preview.',
    '사용': 'Use',
    '파일을 다운로드한 뒤 Codex 또는 Claude Code의 Skill 폴더에 넣습니다.': 'Download the file and put it in the Codex or Claude Code Skill folder.',
    '이 사이트는 파일을 만들어 줄 뿐, Skill을 자동 설치하거나 AI 작업을 대신 실행하지는 않습니다.': 'This site creates the file. It does not install Skills automatically or run AI tasks.',
    '내 작업 방식으로 시작해볼까요?': 'Ready to save your workflow?',
    '처음이라면 템플릿을 고른 뒤 문장을 조금씩 바꿔도 됩니다. 저장 위치는 편집 화면의 Codex·Claude Code 안내에서 확인하세요.': 'Start with a template and adjust the wording. The editor shows where to put the file for Codex and Claude Code.',
    '더 자세한 사용법:': 'Learn more:',
    'Codex 공식 문서': 'Codex documentation',
    'Claude Code 공식 문서': 'Claude Code documentation'
  }));

  const placeholders = new Map(Object.entries({
    '예: thoughtful-ui-review': 'e.g. thoughtful-ui-review',
    '예: 기존 웹 UI의 계층과 간격을 점검하고 개선안을 제시합니다.': 'e.g. Review the visual hierarchy and spacing of an existing web UI.',
    '예: 사용자가 화면을 더 정돈하고 싶다고 요청할 때': 'e.g. When a user asks to refine a screen',
    '한 줄에 한 단계씩 적어주세요.\n현재 화면을 살펴본다\n문제의 우선순위를 정한다\n한 번에 한 요소씩 수정한다': 'One step per line.\nInspect the current screen\nPrioritize the issues\nFix one element at a time',
    '한 줄에 한 가지씩 적어주세요.\n기존 브랜드 색상은 유지한다\n작은 화면에서도 읽기 편해야 한다': 'One rule per line.\nKeep the existing brand colors\nMake the content readable on small screens',
    '예: 근거 없는 수치를 만들지 않는다': 'e.g. Do not invent unsupported numbers',
    '예: 수정된 파일과 변경 이유를 간결하게 설명한다': 'e.g. Summarize changed files and the reasons for each change',
    '한 줄에 한 항목씩 적어주세요.\n모바일 화면을 확인한다\n키보드로 조작할 수 있는지 확인한다': 'One check per line.\nReview the mobile screen\nCheck keyboard access'
  }));

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const value = node.nodeValue.trim();
    if (phrases.has(value)) node.nodeValue = node.nodeValue.replace(value, phrases.get(value));
  }
  document.querySelectorAll('[placeholder]').forEach((field) => {
    field.placeholder = placeholders.get(field.placeholder) || field.placeholder;
  });
  const aria = new Map(Object.entries({
    'Skill Studio 처음으로': 'Skill Studio home',
    'Skill 만들기 작업 공간': 'Skill editor',
    '시작 템플릿': 'Starting templates',
    'Skill 결과': 'Skill output',
    '사용 도구': 'Target tool',
    'Skill 사용 예시 선택': 'Choose a Skill example',
    'Skill 이름 설명 보기': 'Show Skill name help',
    'Skill 역할 설명 보기': 'Show Skill purpose help',
    '사용 시점 설명 보기': 'Show usage help',
    '작업 순서 설명 보기': 'Show workflow help',
    '작업 기준 설명 보기': 'Show rules help',
    '피해야 할 것 설명 보기': 'Show avoidances help',
    '결과물 설명 보기': 'Show output help',
    '완료 확인 설명 보기': 'Show completion check help'
  }));
  document.querySelectorAll('[aria-label]').forEach((element) => {
    const label = element.getAttribute('aria-label');
    if (aria.has(label)) element.setAttribute('aria-label', aria.get(label));
  });
  const isEditor = Boolean(document.querySelector('#skill-form'));
  const isBenefits = Boolean(document.querySelector('.about-ai-window'));
  document.title = isEditor ? 'Skill Studio — Create a Skill' : isBenefits ? 'Why use a Skill? — Skill Studio' : 'What is a Skill? — Skill Studio';
  document.querySelector('meta[name="description"]').content = isEditor
    ? 'Create a reusable SKILL.md for Codex and Claude Code.'
    : isBenefits ? 'Compare real-world example conversations with and without a Skill.' : 'Learn what AI Skills are and how to create and use one.';
}
