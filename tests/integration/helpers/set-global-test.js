import { module, test, setupStoreRenderingTest } from '../../helpers/setup';
import { render } from '@ember/test-helpers';
import { run } from '@ember/runloop';
import hbs from 'htmlbars-inline-precompile';

module('set-global', function(hooks) {
  setupStoreRenderingTest(hooks);

  test('globals are removed on stores destroy', async function(assert) {
    this.set('name', 'foo');
    await render(hbs`{{set-global name=name}}`);
    assert.equal(this.element.textContent, '');
    assert.equal(window.name, 'foo');
    run(() => this.stores.destroy());
    assert.equal(window.name, undefined);
  });

});
