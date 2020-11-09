import { module, test, setupStoreTest, credentials} from '../helpers/setup';
import { isActivated } from 'zuglet/utils';

module('setup', function(hooks) {
  setupStoreTest(hooks);

  test('stores exist', function(assert) {
    assert.ok(this.stores);
  });

  test('store exists', function(assert) {
    assert.ok(this.store);
  });

  test('doc load succeeds', async function(assert) {
    await this.store.doc('ducks/yellow').new({ name: 'yellow' }).save();
    let doc = await this.store.doc('ducks/yellow').load();
    assert.deepEqual(doc.serialized, {
      id: 'yellow',
      path: 'ducks/yellow',
      exists: true,
      isNew: false,
      isDirty: false,
      isLoaded: true,
      isLoading: false,
      isSaving: false,
      isError: false,
      error: null,
      data: {
        name: "yellow"
      }
    });
  });

  test('store is activated', async function(assert) {
    assert.ok(isActivated(this.store));
  });

  test('sign in with email', async function(assert) {
    await this.store.auth.signOut();
    let { email, password } = credentials.ampatspell;
    let user = await this.store.auth.methods.email.signIn(email, password);
    assert.ok(user);
    assert.ok(this.store.auth.user);
    assert.ok(user === this.store.auth.user);
  });

});
