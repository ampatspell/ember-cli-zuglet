import { module, test, setupStoreTest, setupDucks } from '../helpers/setup';

module('document', function(hooks) {
  setupStoreTest(hooks);
  setupDucks(hooks);

  test('create a new document', async function(assert) {
    let doc = this.store.doc('ducks/yellow').new({ name: 'yellow', feathers: 'cute' });

    assert.deepEqual(doc.get('serialized'), {
      "id": "yellow",
      "path": "ducks/yellow",
      "data": {
        "feathers": "cute",
        "name": "yellow"
      },
      "error": null,
      "exists": undefined,
      "isNew": true,
      "isError": false,
      "isLoaded": false,
      "isLoading": false,
      "isSaving": false,
      "isObserving": false,
      "metadata": undefined,
    });
  });

  test('save document', async function(assert) {
    let doc = this.store.doc('ducks/yellow').new({ name: 'yellow', feathers: 'cute' });

    assert.deepEqual(doc.get('serialized'), {
      "id": "yellow",
      "path": "ducks/yellow",
      "data": {
        "feathers": "cute",
        "name": "yellow"
      },
      "error": null,
      "exists": undefined,
      "isNew": true,
      "isError": false,
      "isLoaded": false,
      "isLoading": false,
      "isSaving": false,
      "isObserving": false,
      "metadata": undefined,
    });

    let promise = doc.save();

    assert.deepEqual(doc.get('serialized'), {
      "id": "yellow",
      "path": "ducks/yellow",
      "data": {
        "feathers": "cute",
        "name": "yellow"
      },
      "error": null,
      "exists": undefined,
      "isNew": true,
      "isError": false,
      "isLoaded": false,
      "isLoading": false,
      "isSaving": true,
      "isObserving": false,
      "metadata": undefined,
    });

    let result = await promise;
    assert.ok(result === doc);

    assert.deepEqual(doc.get('serialized'), {
      "id": "yellow",
      "path": "ducks/yellow",
      "data": {
        "feathers": "cute",
        "name": "yellow"
      },
      "error": null,
      "exists": true,
      "isNew": false,
      "isError": false,
      "isLoaded": true,
      "isLoading": false,
      "isSaving": false,
      "isObserving": false,
      "metadata": undefined,
    });
  });

  test('delete document', async function(assert) {
    let doc = this.store.doc('ducks/yellow').new({ name: 'yellow', feathers: 'cute' });
    await doc.save();

    assert.deepEqual(doc.get('serialized'), {
      "data": {
        "feathers": "cute",
        "name": "yellow"
      },
      "error": null,
      "exists": true,
      "id": "yellow",
      "isError": false,
      "isLoaded": true,
      "isLoading": false,
      "isNew": false,
      "isObserving": false,
      "isSaving": false,
      "metadata": undefined,
      "path": "ducks/yellow"
    });

    let promise = doc.delete();

    assert.deepEqual(doc.get('serialized'), {
      "data": {
        "feathers": "cute",
        "name": "yellow"
      },
      "error": null,
      "exists": true,
      "id": "yellow",
      "isError": false,
      "isLoaded": true,
      "isLoading": false,
      "isNew": false,
      "isObserving": false,
      "isSaving": true,
      "metadata": undefined,
      "path": "ducks/yellow"
    });

    await promise;

    assert.deepEqual(doc.get('serialized'), {
      "data": {
        "feathers": "cute",
        "name": "yellow"
      },
      "error": null,
      "exists": false,
      "id": "yellow",
      "isError": false,
      "isLoaded": true,
      "isLoading": false,
      "isNew": false,
      "isObserving": false,
      "isSaving": false,
      "metadata": undefined,
      "path": "ducks/yellow"
    });
  });

});
