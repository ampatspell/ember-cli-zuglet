import { module, test } from 'qunit';
import { visit, currentURL, find, pauseTest } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | docs', function(hooks) {
  setupApplicationTest(hooks);

  test('has route component', async function(assert) {
    await visit('/docs');
    assert.equal(currentURL(), '/docs');
    assert.ok(find('.ui-route-docs-index'));
  });

  test('has header', async function(assert) {
    await visit('/docs');
    assert.ok(find('.ui-block-content-header'));
  });

});
