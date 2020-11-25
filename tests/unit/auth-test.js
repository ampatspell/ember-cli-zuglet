import { module, test, setupStoreTest, credentials } from '../helpers/setup';

module('auth', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(async function() {
    this.auth = this.store.auth;
    await this.auth.signOut();
  });

  hooks.afterEach(async function() {
    await this.auth.signOut();
  });

  test('user delete', async function(assert) {
    let user = await this.auth.methods.anonymous.signIn();
    await user.delete();
    assert.strictEqual(this.auth.user, null);
  });

  test('serialized', async function(assert) {
    assert.deepEqual(this.auth.serialized, {
      user: null
    });
  });

  test('serialized with signed in user', async function(assert) {
    await this.auth.methods.email.signIn(credentials.ampatspell.email, credentials.ampatspell.password);
    let { serialized } = this.auth;
    assert.deepEqual(serialized, {
      user: {
        instance: serialized.user.instance,
        serialized: {
          email: credentials.ampatspell.email,
          emailVerified: serialized.user.serialized.emailVerified,
          isAnonymous: false,
          uid: serialized.user.serialized.uid
        }
      }
    });
    assert.ok(serialized.user.instance.startsWith('TestUser::ember'));
    assert.ok(typeof serialized.user.serialized.emailVerified === 'boolean');
    assert.ok(typeof serialized.user.serialized.uid === 'string');
  });

  test('toJSON', async function(assert) {
    let json = this.auth.toJSON();
    assert.deepEqual(json, {
      instance: json.instance,
      serialized: {
        user: null
      }
    });
    assert.ok(json.instance.startsWith('Auth::ember'));
  });

});
