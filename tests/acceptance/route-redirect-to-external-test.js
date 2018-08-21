import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('acceptance / route - redirect to external', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    this.modelFor = name => this.owner.lookup(`route:application`).modelFor(name);
    this.model = () => this.modelFor('scenarios');
  });

  test('hello', async function(assert) {
    await visit('/scenarios');
    assert.equal(currentURL(), '/scenarios');

    let model = this.model();
    model.event('test', '/scenarios');

    await visit('/scenarios/redirect-to-external');
    assert.equal(currentURL(), '/scenarios');

    model.event('test', '/scenarios/redirect-to-external');

    await visit('/');
    assert.equal(currentURL(), '/');

    model.event('test', '/');

    assert.deepEqual(model.get('events').map(item => {
      let { route, event } = item;
      return `${route} ${event}`;
    }), [
      "scenarios init",
      "scenarios prepare",
      "test /scenarios",
      "redirect-to-external.index init",
      "redirect-to-external.index prepare",
      "redirect-to-external.index willDestroy",
      "test /scenarios/redirect-to-external",
      "scenarios willDestroy",
      "test /"
    ]);
  });
});
