import { module, test, setupStoreTest } from '../helpers/setup';

module('storage / reference / put', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(function(assert) {
    this.bucket = this.store.options.firebase.storageBucket;
    assert.ok(this.bucket);
    this.storage = this.store.storage;
  });

  test.skip('put string', async function(assert) {
  });

});
