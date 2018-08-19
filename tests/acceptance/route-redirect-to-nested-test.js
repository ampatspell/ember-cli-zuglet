import { module, test } from 'qunit';
import { visit, currentURL, find, findAll } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('acceptance / route - redirect to nested', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    this.modelFor = name => this.owner.lookup(`route:application`).modelFor(name);
    this.model = () => this.modelFor('scenarios');
  });

  test('hello', async function(assert) {
    await visit('/scenarios/redirect-to-nested');
    assert.equal(currentURL(), '/scenarios/redirect-to-nested/default');
    let model = this.model();
    console.log(model);
  });

});
