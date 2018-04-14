import { module, test, setupStoreTest } from '../helpers/setup';

module('auth', function(hooks) {
  setupStoreTest(hooks);

  test('store has auth', function(assert) {
    let auth = this.store.get('auth');
    assert.ok(auth);
    assert.ok(auth._internal);
  });

  test('auth has methods', function(assert) {
    let methods = this.store.get('auth.methods');
    assert.ok(methods);
    assert.ok(methods._internal);
  });

  test('methods has available', function(assert) {
    assert.deepEqual(this.store.get('auth.methods.available'), [
      "anonymous",
      "email"
    ]);
  });

  test('has anonymous method', function(assert) {
    let method = this.store.get('auth.methods.anonymous');
    assert.ok(method);
    assert.ok(method._internal);
    assert.equal(method.get('type'), 'anonymous');
  });

  test('has email method', function(assert) {
    let method = this.store.get('auth.methods.email');
    assert.ok(method);
    assert.ok(method._internal);
    assert.equal(method.get('type'), 'email');
  });

  test('temporary -- auth has user', function(assert) {
    let user = this.store.get('auth.user');
    assert.ok(user);
    assert.ok(user._internal);
  });

});
