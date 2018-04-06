import { module, test, setupStoreTest, setupDucks } from '../helpers/setup';

module('document-load', function(hooks) {
  setupStoreTest(hooks);
  setupDucks(hooks);

  test('load', async function(assert) {
    await this.recreate();
    await this.coll.doc('yellow').set({ name: 'yellow' });

    let doc = await this.store.doc('ducks/yellow').load();

    assert.deepEqual(doc.get('serialized'), {
      "isNew": false,
      "id": "yellow",
      "path": "ducks/yellow",
      "error": null,
      "exists": true,
      "isError": false,
      "isLoaded": true,
      "isLoading": false,
      "isSaving": false,
      "isObserving": false,
      "metadata": {
        "fromCache": false,
        "hasPendingWrites": false
      },
      "data": {
        "name": "yellow"
      },
    });
  });

  test('load missing optional', async function(assert) {
    await this.recreate();
    let doc = await this.store.doc('ducks/yellow').load({ optional: true });
    assert.deepEqual(doc.get('serialized'), {
      "isNew": false,
      "exists": false,
      "id": "yellow",
      "path": "ducks/yellow",
      "error": null,
      "isError": false,
      "isLoaded": true,
      "isLoading": false,
      "isSaving": false,
      "isObserving": false,
      "metadata": {
        "fromCache": false,
        "hasPendingWrites": false
      },
      "data": undefined
    });
  });

  test('load missing required', async function(assert) {
    await this.recreate();
    try {
      await this.store.doc('ducks/yellow').load();
      assert.ok(false, 'should throw');
    } catch(err) {
      assert.equal(err.code, 'zuglet/document-missing');
    }
  });

});
