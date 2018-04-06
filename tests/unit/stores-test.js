import { module, test, setupStoreTest } from '../helpers/setup';
import { run } from '@ember/runloop';

module('stores', function(hooks) {
  setupStoreTest(hooks);

  test('create store', function(assert) {
    let store = this.store;
    assert.ok(store);
  });

  test('store is destroyed on stores destroy', function(assert) {
    let store = this.store;
    run(() => this.stores.destroy());
    assert.ok(store.isDestroyed);
  });

});
