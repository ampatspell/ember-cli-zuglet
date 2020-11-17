import { module, test, setupStoreTest, credentials } from '../helpers/setup';

module('auth', function(hooks) {
  setupStoreTest(hooks);

  test('sign in with email succeeds', async function(assert) {
    await this.store.auth.signOut();
    let { email, password } = credentials.ampatspell;
    let user = await this.store.auth.methods.email.signIn(email, password);
    assert.ok(user);
    assert.ok(this.store.auth.user);
    assert.ok(user === this.store.auth.user);
    await user.signOut();
  });

});
