const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const { runInNewContext } = require('node:vm');

const source = readFileSync(require.resolve('../index.js'), 'utf8');

const setup = () => {
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
    createElement() {
      const classes = new Set();
      return {
        classList: {
          add: name => classes.add(name),
          remove: name => classes.delete(name),
          contains: name => classes.has(name)
        },
        set className(value) { classes.clear(); classes.add(value); },
        addEventListener() {},
        removeAttribute(name) { delete this[name]; }
      };
    },
    head: { prepend() {} },
    body: {
      prepend(button) {
        elements.set(button.id, button);
        elements.set('stravaKudosCount', { innerHTML: '' });
      }
    },
    getElementById: id => elements.get(id),
    querySelector: selector => selector.startsWith('a#athlete-menu') ?
      currentProfile : legacyProfile,
    querySelectorAll: () => avatars
  };
  runInNewContext(source, {
    document,
    setInterval: callback => { refresh = callback; },
    setTimeout: () => { throw new Error('Must not send kudos during detection'); },
    console
  });
  return {
    button: elements.get('stravaKudos'),
    count: elements.get('stravaKudosCount'),
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
