import { module, test, setupStoreTest } from '../helpers/setup';
import { wait } from '../helpers/firebase';
import { run } from '@ember/runloop';
import { typeOf } from '@ember/utils';
import getParams from '../helpers/query';

let params = getParams();
let disabled = params['no-auth'];

module('auth', function(hooks) {
  setupStoreTest(hooks);

  if(disabled) {
    test('disabled', function(assert) {
      assert.ok(true);
    });
    return;
  }

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

  test('auth is destroyed when store is', function(assert) {
    let auth = this.store.get('auth');
    run(() => this.store.destroy());
    assert.ok(auth.isDestroyed);
  });

  test('auth internal has auth', function(assert) {
    let internal = this.store.get('auth._internal');
    let auth = internal.get('auth');
    assert.ok(auth);
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

  test('sign out', async function(assert) {
    let promise = this.store.get('auth').signOut();
    assert.ok(promise);
    let result = await promise;
    assert.ok(result === null);
  });

  test('sign in anonymously', async function(assert) {
    let auth = this.store.get('auth');
    await auth.signOut();

    let anon = auth.get('methods.anonymous');
    let result = await anon.signIn();

    let user = auth.get('user');
    assert.ok(user.get('isAnonymous'));
    assert.ok(result === user);
  });

  test('sign in anonymously out and in again', async function(assert) {
    let auth = this.store.get('auth');
    await auth.signOut();

    let anon = auth.get('methods.anonymous');

    await anon.signIn();
    let first = auth.get('user');

    await auth.signOut();

    await anon.signIn();
    let second = auth.get('user');

    assert.ok(first !== second);

    assert.ok(first.isDestroying);
    assert.ok(!second.isDestroying);
  });

  test('sign in with email', async function(assert) {
    let auth = this.store.get('auth');
    await auth.signOut();
    let method = auth.get('methods.email');
    let result = await method.signIn('ampatspell@gmail.com', 'hello-world');
    let user = auth.get('user');
    assert.equal(user.get('isAnonymous'), false);
    assert.equal(user.get('email'), 'ampatspell@gmail.com');
    assert.ok(result === user);
  });

  test('delete account', async function(assert) {
    let auth = this.store.get('auth');
    await auth.signOut();

    let anon = auth.get('methods.anonymous');
    await anon.signIn();

    let user = auth.get('user');

    await user.delete();

    assert.ok(!auth.get('user'));
  });

  test('sign up with email and delete', async function(assert) {
    let auth = this.store.get('auth');
    await auth.signOut();

    let email = `ampatspell+${Date.now()}@gmail.com`;
    let password = 'hello-world';

    let method = auth.get('methods.email');

    let user;

    let signup = await method.signUp(email, password);
    user = auth.get('user');

    assert.ok(user);
    assert.ok(signup === user);
    assert.equal(user.get('email'), email);

    await auth.signOut();

    let signIn = await method.signIn(email, password);
    user = auth.get('user');

    assert.ok(user);
    assert.ok(signIn === user);
    assert.equal(user.get('email'), email);

    await user.delete();

    user = auth.get('user');
    assert.ok(!user);

    try {
      await method.signIn(email, password);
      assert.ok(false, 'should throw');
    } catch(err) {
      assert.equal(err.code, 'auth/user-not-found');
    }
  });

  test('sign in with restore', async function(assert) {
    let auth = this.store.get('auth');
    await auth.signOut();

    let log = [];
    this.store.restoreUser = user => {
      log.push(user.get('uid'));
      return wait(10)
        .then(() => user.set('ok', true))
        .then(() => wait(10));
    }

    let anon = auth.get('methods.anonymous');

    let result = await anon.signIn();
    assert.ok(result);

    let user = auth.get('user');
    assert.ok(user);

    assert.ok(user.get('isAnonymous'));
    assert.ok(result === user);
    assert.ok(user.get('ok'));
    assert.deepEqual(log, [
      user.get('uid'),
      user.get('uid')
    ]);
  });

  test('settle', async function(assert) {
    let auth = this.store.get('auth');
    await auth.signOut();

    auth.get('methods.anonymous').signIn();

    assert.ok(!auth.get('user'));

    await this.store.settle();

    assert.ok(auth.get('user'));
  });

  test('sign in and out with restore', async function(assert) {
    let auth = this.store.get('auth');
    let anon = auth.get('methods.anonymous');

    await auth.signOut();

    let user;
    let result;
    let log = [];

    this.store.restoreUser = async user => {
      log.push(user && user.get('uid'));
      let model = null;
      if(user) {
        model = { user };
      }
      this.store.set('user', model);
    };

    result = await anon.signIn();
    user = auth.get('user');
    assert.ok(result === user);
    assert.equal(this.store.get('user.user'), user);

    let uid1 = user.get('uid');

    await auth.signOut();
    user = auth.get('user');
    assert.equal(this.store.get('user'), null);

    result = await anon.signIn();
    user = auth.get('user');
    assert.ok(result === user);
    assert.equal(this.store.get('user.user'), user);

    let uid2 = user.get('uid');

    await auth.signOut();
    user = auth.get('user');
    assert.equal(this.store.get('user'), null);

    assert.deepEqual(log, [
      uid1,
      uid1,
      null,
      uid2,
      uid2,
      null
    ]);
  });

  test('user get id token', async function(assert) {
    let auth = this.store.get('auth');
    let anon = auth.get('methods.anonymous');
    let user = await anon.signIn();
    let token = await user.token();
    assert.ok(typeof token === 'string');
  });

  test('user get id token result', async function(assert) {
    let auth = this.store.get('auth');
    let anon = auth.get('methods.anonymous');
    let user = await anon.signIn();
    let token = await user.token({ type: 'json' });
    assert.ok(typeOf(token) === 'object');
  });

  test('link with credential', async function(assert) {
    let auth = this.store.get('auth');
    await auth.signOut();

    await auth.get('methods.anonymous').signIn();
    let anon = auth.get('user');

    let email = `test-${new Date().getTime()}@test.com`;
    let password = 'heythere';

    let user = await auth.get('methods.email').link(email, password);
    assert.ok(anon === user);

    assert.equal(user.get('email'), email);
  });

  test('link without user rejects', async function(assert) {
    let auth = this.store.get('auth');
    await auth.signOut();

    let email = `test-${new Date().getTime()}@test.com`;
    let password = 'heythere';

    try {
      await auth.get('methods.email').link(email, password);
      assert.ok(false, 'should throw');
    } catch(err) {
      assert.equal(err.code, 'zuglet/current-user-required');
    }
  });

});
