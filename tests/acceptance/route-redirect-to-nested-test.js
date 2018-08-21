import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('acceptance / route - redirect to nested', function(hooks) {
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

    await visit('/scenarios/redirect-to-nested');
    assert.equal(currentURL(), '/scenarios/redirect-to-nested/models/default');

    model.event('test', '/scenarios/redirect-to-nested');

    await visit('/scenarios');
    assert.equal(currentURL(), '/scenarios');

    model.event('test', '/scenarios');

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
      "redirect-to-nested.index init",
      "redirect-to-nested.index prepare",
      "redirect-to-nested.intermediate init",
      "redirect-to-nested.intermediate prepare",
      "redirect-to-nested.models init",
      "redirect-to-nested.models prepare",
      "redirect-to-nested.models.index init",
      "redirect-to-nested.models.index prepare",
      "redirect-to-nested.index willDestroy",
      "redirect-to-nested.intermediate willDestroy",
      "test /scenarios/redirect-to-nested",
      "redirect-to-nested.models.index willDestroy",
      "redirect-to-nested.models willDestroy",
      "test /scenarios",
      "scenarios willDestroy",
      "test /"
    ]);
  });
});
