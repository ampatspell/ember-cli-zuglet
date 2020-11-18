import { module, test, setupStoreTest } from '../helpers/setup';

module('auth / methods / anonymous', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(async function() {
    this.auth = this.store.auth;
    await this.auth.signOut();
  });

  hooks.afterEach(async function() {
    let user = this.auth.user;
    if(user) {
      await user.delete();
    }
  });

  test('sign in', async function(assert) {
    let user = await this.auth.methods.anonymous.signIn();
    assert.ok(user);
    assert.ok(user === this.auth.user);
    assert.deepEqual(user.serialized, {
      email: null,
      emailVerified: false,
      isAnonymous: true,
      uid: user.uid
    });
    assert.ok(typeof user.uid === 'string');
  });

});
