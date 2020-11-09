import { module, test, setupStoreTest } from '../helpers/setup';

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

});
