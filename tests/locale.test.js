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
    { nodeValue: 'Skill이란? · 왜 쓸까요?' }
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
  const benefitsLink = {
    href: './benefits.html',
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
        'a[href^="./about.html"], a[href^="./benefits.html"], a[href^="./index.html"]': [aboutLink, benefitsLink],
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
  return { document, nodes, languageLink, brand, aboutLink, benefitsLink, field, label };
}

test('English translates editor copy and preserves the locale in navigation', () => {
  const result = runLocale('?lang=en');
  assert.equal(result.document.documentElement.lang, 'en');
  assert.equal(result.nodes[0].nodeValue, 'Create a Skill');
  assert.equal(result.nodes[1].nodeValue, 'Where do I use it?');
  assert.equal(result.nodes[3].nodeValue, 'What is a Skill? · Why use one?');
  assert.equal(result.languageLink.textContent, '한국어');
  assert.equal(result.brand.href, './?lang=en');
  assert.equal(result.aboutLink.href, './about.html?lang=en');
  assert.equal(result.benefitsLink.href, './benefits.html?lang=en');
  assert.equal(result.field.placeholder, 'e.g. thoughtful-ui-review');
  assert.equal(result.label.value, 'Show Skill name help');
});

test('Korean remains the default and keeps its original copy', () => {
  const result = runLocale('');
  assert.equal(result.document.documentElement.lang, 'ko');
  assert.equal(result.nodes[0].nodeValue, '새 Skill 만들기');
  assert.equal(result.languageLink.textContent, 'English');
  assert.equal(result.aboutLink.href, './about.html');
});
