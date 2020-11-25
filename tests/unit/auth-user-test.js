import { module, test, setupStoreTest, credentials } from '../helpers/setup';

module('auth / user', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(async function() {
    this.auth = this.store.auth;
    await this.auth.signOut();
  });

  hooks.afterEach(async function() {
    await this.auth.signOut();
  });

  test('toStringExtension', async function(assert) {
    let user = await this.auth.methods.email.signIn(credentials.ampatspell.email, credentials.ampatspell.password);
    let string = user.toStringExtension();
    assert.strictEqual(string, credentials.ampatspell.email);
  });

  test('toStringExtension anonymous', async function(assert) {
    let user = await this.auth.methods.anonymous.signIn();
    let string = user.toStringExtension();
    assert.strictEqual(string, user.uid);
    await user.delete();
  });

  test('token raw', async function(assert) {
    let user = await this.auth.methods.email.signIn(credentials.ampatspell.email, credentials.ampatspell.password);
    let token = await user.token();
    assert.ok(typeof token === 'string');
    assert.ok(token.length > 50);
  });

  test('token json', async function(assert) {
    let user = await this.auth.methods.email.signIn(credentials.ampatspell.email, credentials.ampatspell.password);
    let token = await user.token({ type: 'json' });
    assert.ok(typeof token === 'object');
    assert.ok(typeof token.claims === 'object');
    assert.ok(typeof token.claims.firebase === 'object');
    assert.strictEqual(token.signInProvider, 'password');
  });

  test('token blows up on unsupported type', async function(assert) {
    let user = await this.auth.methods.email.signIn(credentials.ampatspell.email, credentials.ampatspell.password);
    try {
      await user.token({ type: 'ducky' });
    } catch(err) {
      assert.strictEqual(err.message, 'Assertion Failed: Unsupported token type');
    }
  });

  test('sign out', async function(assert) {
    let user = await this.auth.methods.email.signIn(credentials.ampatspell.email, credentials.ampatspell.password);
    await user.signOut();
    assert.ok(!this.auth.user);
  });

  test('restore is called', async function(assert) {
    let user = await this.auth.methods.email.signIn(credentials.ampatspell.email, credentials.ampatspell.password);
    assert.strictEqual(user.restored, 2); // would be ok to call it once
  });

});
