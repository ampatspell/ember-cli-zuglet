import { module, test, setupStoreTest } from '../helpers/setup';
import { run } from '@ember/runloop';
import { TestStore } from '../helpers/setup-store';

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

  test('store.ready invokes restore', async function(assert) {
    let store = this.stores.createStore('another', TestStore);
    let invoked = false;
    store.restore = () => {
      invoked = true;
    };
    await store.get('ready');
    assert.ok(invoked);
  });

});
