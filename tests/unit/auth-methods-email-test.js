import { module, test, setupStoreTest, credentials } from '../helpers/setup';

module('auth / methods / email', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(async function() {
    this.auth = this.store.auth;
    await this.auth.signOut();
  });

  hooks.afterEach(async function() {
    await this.auth.signOut();
  });

  test('sign in succeeds', async function(assert) {
    let { email, password } = credentials.ampatspell;
    let user = await this.auth.methods.email.signIn(email, password);
    assert.ok(user);
    assert.ok(this.auth.user);
    assert.ok(user === this.auth.user);
    assert.deepEqual(user.serialized, {
      email,
      emailVerified: user.emailVerified,
      isAnonymous: false,
      uid: user.uid
    });
    assert.ok(typeof user.emailVerified === 'boolean');
    assert.ok(typeof user.uid === 'string');
  });

  test('sign in fails', async function(assert) {
    try {
      await this.auth.methods.email.signIn('yellow.duck@gmail.com', 'not here yet');
      assert.ok(false);
    } catch(err) {
      assert.strictEqual(err.message, 'There is no user record corresponding to this identifier. The user may have been deleted.');
      assert.strictEqual(err.code, 'auth/user-not-found');
    }
  });

  test('sign up', async function(assert) {
    let { email, password } = credentials.zeeba;
    try {
      let user = await this.auth.methods.email.signIn(email, password);
      await user.delete();
    } catch(err) {
      if(err.code !== 'auth/user-not-found') {
        throw err;
      }
    }

    let user = await this.auth.methods.email.signUp(email, password);
    assert.ok(user);

    await this.auth.signOut();
    assert.ok(!this.auth.user);

    user = await this.auth.methods.email.signIn(email, password);

    await user.delete();

    try {
      user = await this.auth.methods.email.signIn(email, password);
      assert.ok(false);
    } catch(err) {
      assert.strictEqual(err.message, 'There is no user record corresponding to this identifier. The user may have been deleted.');
      assert.strictEqual(err.code, 'auth/user-not-found');
    }
  });

  test('credential', async function(assert) {
    let { email, password } = credentials.ampatspell;
    let credential = this.auth.methods.email.credential(email, password);
    assert.ok(credential);
    assert.deepEqual(credential.toJSON(), {
      email,
      password,
      signInMethod: 'password'
    });
  });

});
