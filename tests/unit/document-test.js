import { module, test, setupStoreTest, setupDucks } from '../helpers/setup';
import { waitForProp } from '../helpers/firebase';
import { all } from 'rsvp';

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

  test('document has a queue', async function(assert) {
    let doc = this.store.doc('ducks/yellow').new({ name: 'yellow', feathers: 'cute' });

    let first = doc.save('first');
    let second = doc.save('second');
    let load = doc.load();
    let del = doc.delete();

    await all([
      del,
      second,
      first,
      load,
    ]);

    assert.equal(doc.get('isNew'), false);
    assert.equal(doc.get('isLoaded'), true);
    assert.equal(doc.get('exists'), false);
  });

  test('two loads yields same promise', async function(assert) {
    let doc = this.store.doc('ducks/yellow').new({ name: 'yellow', feathers: 'cute' });
    await doc.save();

    let one = doc._internal.reload();
    let two = doc._internal.reload();

    assert.ok(one === two);

    await all([ one, two ]);
  });

  test('observe document reference', async function(assert) {
    await this.store.doc('ducks/yellow').new({ name: 'yellow', feathers: 'cute' }).save();

    let doc = this.store.doc('ducks/yellow').existing();

    assert.deepEqual(doc.get('serialized'), {
      "data": {},
      "error": null,
      "exists": undefined,
      "id": "yellow",
      "isError": false,
      "isLoaded": false,
      "isLoading": false,
      "isNew": false,
      "isObserving": false,
      "isSaving": false,
      "metadata": undefined,
      "path": "ducks/yellow"
    });

    let cancel = doc.observe();

    assert.deepEqual(doc.get('serialized'), {
      "data": {},
      "error": null,
      "exists": undefined,
      "id": "yellow",
      "isError": false,
      "isLoaded": false,
      "isLoading": false,
      "isNew": false,
      "isObserving": true,
      "isSaving": false,
      "metadata": undefined,
      "path": "ducks/yellow"
    });

    await waitForProp(doc, 'data.name', 'yellow');

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
      "isObserving": true,
      "isSaving": false,
      "metadata": {
        "fromCache": false,
        "hasPendingWrites": false
      },
      "path": "ducks/yellow"
    });

    cancel();
  });

});
