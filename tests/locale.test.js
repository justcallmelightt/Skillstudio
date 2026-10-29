const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'i18n.js'), 'utf8');

function runLocale(search) {
  const nodes = [
    { nodeValue: '새 Skill 만들기' },
    { nodeValue: '어디에서 사용하나요?' },
    { nodeValue: '완성도 점검' },
    { nodeValue: 'Skill이란? 왜 쓸까요?' },
    { nodeValue: '본문으로 건너뛰기' },
    { nodeValue: '숫자가 사라지던 카운터' },
    { nodeValue: '실제 시행착오를 바탕으로 두 상태를 재구성한 시연입니다. 첫 결과물의 오류가 모든 작업에서 반복되는 것은 아니며,' },
    { nodeValue: 'Skill을 사용한 실제 결과도 요청과 환경에 따라 달라질 수 있습니다.' },
    { nodeValue: '자동 성능 비교는 아닙니다.' },
    { nodeValue: 'Skill 없이 첫 결과물' },
    { nodeValue: 'Skill을 사용한 첫 결과물' },
    { nodeValue: '· 한 번 저장하면 같은 기준을 매번 다시 설명하지 않아도 됩니다.' }
  ];
  const languageLink = {
    href: '', textContent: '', lang: '',
    setAttribute(name, value) { this[name] = value; }
  };
  const brand = { href: './' };
  const aboutLink = {
    href: './about.html',
    getAttribute() { return this.href; }
  };
  const field = { placeholder: '예: thoughtful-ui-review' };
  const label = {
    value: 'Skill 이름 설명 보기',
    getAttribute() { return this.value; },
    setAttribute(name, value) { this.value = value; }
  };
  const description = { content: '' };
  const document = {
    documentElement: { lang: 'ko' },
    body: {},
    title: '',
    querySelectorAll(selector) {
      return ({
        '[data-language-link]': [languageLink],
        'a[href^="./about.html"], a[href^="./index.html"]': [aboutLink],
        'a.brand[href="./"]': [brand],
        '[placeholder]': [field],
        '[aria-label]': [label]
      })[selector] || [];
    },
    querySelector(selector) {
      return selector === '#skill-form' ? {} : description;
    },
    createTreeWalker() {
      let index = -1;
      return {
        currentNode: null,
        nextNode() {
          index += 1;
          this.currentNode = nodes[index];
          return index < nodes.length;
        }
      };
    }
  };
  vm.runInNewContext(source, {
    window: {}, document, location: { search, pathname: '/Skillstudio/' },
    NodeFilter: { SHOW_TEXT: 4 }, URLSearchParams
  });
  return { document, nodes, languageLink, brand, aboutLink, field, label };
}

test('English translates editor copy and preserves the locale in navigation', () => {
  const result = runLocale('?lang=en');
  assert.equal(result.document.documentElement.lang, 'en');
  assert.equal(result.nodes[0].nodeValue, 'Create a Skill');
  assert.equal(result.nodes[1].nodeValue, 'Where do I use it?');
  assert.equal(result.nodes[3].nodeValue, 'What is a Skill? Why use one?');
  assert.equal(result.nodes[4].nodeValue, 'Skip to main content');
  assert.equal(result.nodes[5].nodeValue, 'The disappearing counter');
  assert.equal(result.nodes[6].nodeValue, 'Both states are reconstructed from real iterations. The first result’s error does not happen in every task, and');
  assert.equal(result.nodes[7].nodeValue, 'actual results with a Skill vary by request and environment.');
  assert.equal(result.nodes[8].nodeValue, 'This is not an automated performance comparison.');
  assert.equal(result.nodes[9].nodeValue, 'First result without a Skill');
  assert.equal(result.nodes[10].nodeValue, 'First result using the Skill');
  assert.equal(result.nodes[11].nodeValue, '· Save the criteria once instead of explaining them every time.');
  assert.equal(result.languageLink.textContent, '한국어');
  assert.equal(result.brand.href, './?lang=en');
  assert.equal(result.aboutLink.href, './about.html?lang=en');
  assert.equal(result.field.placeholder, 'e.g. thoughtful-ui-review');
  assert.equal(result.label.value, 'Show Skill name help');
});

test('Korean remains the default and keeps its original copy', () => {
  const result = runLocale('');
  assert.equal(result.document.documentElement.lang, 'ko');
  assert.equal(result.nodes[0].nodeValue, '새 Skill 만들기');
  assert.equal(result.nodes[4].nodeValue, '본문으로 건너뛰기');
  assert.equal(result.nodes[5].nodeValue, '숫자가 사라지던 카운터');
  assert.equal(result.languageLink.textContent, 'English');
  assert.equal(result.aboutLink.href, './about.html');
});
