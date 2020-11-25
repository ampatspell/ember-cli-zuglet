import { module, test, setupStoreTest } from '../helpers/setup';

module('auth / methods / popup', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(async function() {
    this.auth = this.store.auth;
  });

  test('popup exists', async function(assert) {
    assert.ok(this.auth.methods.popup);
  });

  test('popup.google exists', async function(assert) {
    assert.ok(this.auth.methods.popup.google);
  });

});
