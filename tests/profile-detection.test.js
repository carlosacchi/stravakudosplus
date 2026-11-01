const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const { runInNewContext } = require('node:vm');

const source = readFileSync(require.resolve('../index.js'), 'utf8');

const setup = (script = source) => {
  const elements = new Map();
  let currentProfile = null;
  let legacyProfile = null;
  let refresh;
  const avatar = (id, { group = false, filled = false } = {}) => ({
    href: `https://www.strava.com/athletes/${id}`,
    closest(selector) {
      if (selector === '[class*="--child-entry"]') {
        return group ? {} : null;
      }
      return { querySelector: () => filled ? null : {} };
    }
  });
  const avatars = [
    avatar('123'), avatar('91234'), avatar('456'),
    avatar('789', { group: true }), avatar('888', { filled: true })
  ];
  const document = {
    createElement(tagName) {
      const classes = new Set();
      return {
        tagName,
        children: [],
        listeners: {},
        append(...children) { this.children.push(...children); },
        classList: {
          add: name => classes.add(name),
          remove: name => classes.delete(name),
          contains: name => classes.has(name)
        },
        set className(value) { classes.clear(); classes.add(value); },
        addEventListener(name, callback) { this.listeners[name] = callback; },
        setAttribute(name, value) { this[name] = value; },
        removeAttribute(name) { delete this[name]; }
      };
    },
    head: { prepend() {} },
    body: {
      prepend(panel) {
        const register = element => {
          elements.set(element.id, element);
          element.children.forEach(register);
        };
        register(panel);
        elements.set('stravaKudosCount', { innerHTML: '' });
      }
    },
    getElementById: id => elements.get(id),
    querySelector: selector => selector.startsWith('a#athlete-menu') ?
      currentProfile : legacyProfile,
    querySelectorAll: () => avatars
  };
  runInNewContext(script, {
    document,
    setInterval: callback => { refresh = callback; },
    setTimeout: () => { throw new Error('Must not send kudos during detection'); },
    console
  });
  return {
    panel: elements.get('stravaKudosPanel'),
    button: elements.get('stravaKudos'),
    feedback: elements.get('stravaKudosFeedback'),
    reviewLink: elements.get('stravaKudosReview'),
    count: elements.get('stravaKudosCount'),
    clearActivities() {
      avatars.length = 0;
      refresh();
    },
    setProfile(id, legacy = false) {
      const profile = id === null ? null : {
        href: `https://www.strava.com/athletes/${id}`
      };
      if (legacy) legacyProfile = profile;
      else currentProfile = profile;
      refresh();
    }
  };
};

test('current menu reveals the button after a delayed profile load', () => {
  const page = setup();
  assert.equal(page.button.classList.contains('hidden'), true);
  page.setProfile('123');
  assert.equal(page.button.classList.contains('hidden'), false);
  assert.equal(page.count.innerHTML, 2);
  assert.equal(page.button.title, undefined);
});

test('legacy menu still works and exact IDs do not exclude other athletes', () => {
  const page = setup();
  page.setProfile('123', true);
  assert.equal(page.count.innerHTML, 2);
  assert.equal(page.button.classList.contains('hidden'), false);
});

test('profile is refreshed and detection fails closed when it disappears', () => {
  const page = setup();
  page.setProfile('123');
  page.setProfile('456');
  assert.equal(page.count.innerHTML, 2);
  page.setProfile(null);
  assert.equal(page.count.innerHTML, 0);
  assert.equal(page.button.classList.contains('hidden'), true);
});

for (const [name, script] of [
  ['source', source],
  ['extension', readFileSync(require.resolve('../chrome-extension/index.js'), 'utf8')]
]) {
  test(`${name}: feedback visibility follows eligible Kudos and profile detection`, () => {
    const page = setup(script);
    assert.equal(page.panel.classList.contains('hidden'), true);
    page.setProfile('123');
    assert.equal(page.panel.classList.contains('hidden'), false);
    assert.equal(page.button.classList.contains('lockout'), true);
    assert.equal(page.feedback.tagName, 'div');
    assert.equal(page.panel.children[1], page.feedback);
    page.setProfile(null);
    assert.equal(page.panel.classList.contains('hidden'), true);
    page.setProfile('123');
    assert.equal(page.panel.classList.contains('hidden'), false);
    page.clearActivities();
    assert.equal(page.count.innerHTML, 0);
    assert.equal(page.panel.classList.contains('hidden'), true);
    assert.equal(page.button.classList.contains('hidden'), true);
  });

  test(`${name}: review is a separate, safe native link and does not start Kudos`, () => {
    const page = setup(script);
    assert.equal(page.reviewLink.tagName, 'a');
    assert.equal(page.reviewLink.href, 'https://chromewebstore.google.com/detail/strava-kudos-plus/bpdnpccpbmdpdhfnnnfnokbaijbbcadm');
    assert.equal(page.reviewLink.target, '_blank');
    assert.equal(page.reviewLink.rel, 'noopener noreferrer');
    assert.match(page.reviewLink['aria-label'], /opens in a new tab/);
    assert.match(page.reviewLink.textContent, /Leave a review/);
    assert.equal(page.feedback.children[0], page.reviewLink);
    assert.equal(page.panel.children[0], page.button);
    assert.equal(page.button.type, 'button');
    assert.equal(typeof page.button.listeners.click, 'function');
    assert.deepEqual(Object.keys(page.reviewLink.listeners), []);
    assert.deepEqual(Object.keys(page.feedback.listeners), []);
    assert.deepEqual(Object.keys(page.panel.listeners), []);
  });
}
