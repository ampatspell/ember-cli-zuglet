import { module, test } from 'qunit';
import { visit, currentURL, find, findAll } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | index', function(hooks) {
  setupApplicationTest(hooks);

  test('has links', async function(assert) {
    await visit('/');
    assert.equal(currentURL(), '/');
    let links = findAll('.ui-route-index-section.links .content a');
    assert.equal(links.length, 3);
    assert.equal(links[0].pathname, '/docs');
    assert.equal(links[1].pathname, '/experiments');
    assert.equal(links[2].href, 'https://github.com/ampatspell/ember-cli-zuglet');
  });

  test('has header', async function(assert) {
    await visit('/');
    assert.equal(find('.ui-route-index-section.header .content .header .value').textContent, 'ember-cli-zuglet');
  });

});
