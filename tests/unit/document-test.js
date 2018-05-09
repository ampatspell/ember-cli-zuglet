import { module, test, setupStoreTest, setupDucks } from '../helpers/setup';
import { waitForProp } from '../helpers/firebase';
import { all } from 'rsvp';
import { run } from '@ember/runloop';

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

  test.only('observe returns observer', async function(assert) {
    await this.store.doc('ducks/yellow').new({ name: 'yellow', feathers: 'cute' }).save();
    let doc = this.store.doc('ducks/yellow').new();
    let observer = doc.observe();
    assert.ok(observer);
    assert.ok(observer.get('doc') === doc);
    assert.ok(observer.get('promise'));
    assert.equal(typeof observer.load, 'function');
    assert.equal(typeof observer.cancel, 'function');
    assert.equal(observer.get('isCancelled'), false);

    let result;
    result = await observer.get('promise');
    assert.ok(result === observer);

    result = await observer.load();
    assert.ok(result === observer);
    
    observer.cancel();

    assert.equal(observer.get('isCancelled'), true);
  });

  test('observe document sets isLoading', async function(assert) {
    await this.store.doc('ducks/yellow').new({ name: 'yellow', feathers: 'cute' }).save();

    let doc = this.store.doc('ducks/yellow').new();
    assert.equal(doc.get('exists'), undefined);
    assert.equal(doc.get('isLoading'), false);

    let observer = doc.observe();

    assert.equal(doc.get('exists'), undefined);
    assert.equal(doc.get('isLoading'), true);

    await waitForProp(doc, 'data.name', 'yellow');

    assert.equal(doc.get('exists'), true);
    assert.equal(doc.get('isLoading'), false);

    observer.cancel();
  });

  test('observe promise resolves on first snapshot', async function(assert) {
    await this.store.doc('ducks/yellow').new({ name: 'yellow', feathers: 'cute' }).save();

    let doc = this.store.doc('ducks/yellow').new();
    assert.equal(doc.get('exists'), undefined);
    assert.equal(doc.get('isLoading'), false);

    let observer = doc.observe();

    assert.equal(doc.get('exists'), undefined);
    assert.equal(doc.get('isLoading'), true);
    assert.equal(doc.get('isLoaded'), false);

    await observer.get('promise');

    assert.equal(doc.get('exists'), true);
    assert.equal(doc.get('isLoading'), false);
    assert.equal(doc.get('isLoaded'), true);

    observer.cancel();
  });

  test('observe promise rejects on stop observing', async function(assert) {
    await this.store.doc('ducks/yellow').new({ name: 'yellow', feathers: 'cute' }).save();

    let doc = this.store.doc('ducks/yellow').new();
    assert.equal(doc.get('exists'), undefined);
    assert.equal(doc.get('isLoading'), false);

    let observer = doc.observe();

    observer.cancel();

    try {
      await observer.get('promise');
    } catch(err) {
      assert.equal(err.message, 'Cancelled');
      assert.equal(err.code, 'zuglet/operation/cancelled');
    }
  });

  test('observe promise rejects on destroy', async function(assert) {
    await this.store.doc('ducks/yellow').new({ name: 'yellow', feathers: 'cute' }).save();

    let doc = this.store.doc('ducks/yellow').new();
    assert.equal(doc.get('exists'), undefined);
    assert.equal(doc.get('isLoading'), false);

    let observer = doc.observe();

    try {
      run(() => doc.destroy());
      await observer.get('promise');
    } catch(err) {
      assert.equal(err.message, 'Cancelled');
      assert.equal(err.code, 'zuglet/operation/cancelled');
    }
  });

  test('existing document', async function(assert) {
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

    let observer = doc.observe();

    assert.deepEqual(doc.get('serialized'), {
      "data": {},
      "error": null,
      "exists": undefined,
      "id": "yellow",
      "isError": false,
      "isLoaded": false,
      "isLoading": true,
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

    observer.cancel();
  });

  test('observe document', async function(assert) {
    await this.store.doc('ducks/yellow').new({ name: 'yellow', feathers: 'cute' }).save();

    let observer = this.store.doc('ducks/yellow').observe();

    let doc = observer.get('doc');

    assert.deepEqual(doc.get('serialized'), {
      "data": {},
      "error": null,
      "exists": undefined,
      "id": "yellow",
      "isError": false,
      "isLoaded": false,
      "isLoading": true,
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

    observer.cancel();
  });

  test('observe document and wait for resolve', async function(assert) {
    await this.store.doc('ducks/yellow').new({ name: 'yellow', feathers: 'cute' }).save();

    let observer = this.store.doc('ducks/yellow').observe();

    let doc = observer.get('doc');

    assert.deepEqual(doc.get('serialized'), {
      "data": {},
      "error": null,
      "exists": undefined,
      "id": "yellow",
      "isError": false,
      "isLoaded": false,
      "isLoading": true,
      "isNew": false,
      "isObserving": true,
      "isSaving": false,
      "metadata": undefined,
      "path": "ducks/yellow"
    });

    await observer.get('promise');

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

    observer.cancel();
  });

});
