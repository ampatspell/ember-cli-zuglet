import { module, test, setupStoreTest } from '../helpers/setup';
import { recreateCollection, waitForCollectionSize } from '../helpers/firebase';
import { all } from 'rsvp';
import { run } from '@ember/runloop';

module('array-query', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(async function() {
    this.coll = this.firestore.collection('ducks');
    this.recreate = () => recreateCollection(this.coll);
  });

  test('create query', function(assert) {
    let query = this.store.query({ type: 'array', query: db => db.collection('ducks') });
    assert.ok(query);
    assert.ok(query._internal);
    assert.deepEqual(query.get('serialized'), {
      "empty": undefined,
      "error": null,
      "isError": false,
      "isLoaded": false,
      "isLoading": false,
      "isObserving": false,
      "metadata": undefined,
      "size": undefined
    });
  });

  test('load query', async function(assert) {
    await this.recreate();
    await all([
      this.coll.doc('yellow').set({ name: 'yellow' }),
      this.coll.doc('green').set({ name: 'green' }),
      this.coll.doc('red').set({ name: 'red' })
    ]);

    let query = this.store.query({ type: 'array', query: db => db.collection('ducks').orderBy('name') });

    let promise = query.load();

    assert.deepEqual(query.get('serialized'), {
      "empty": undefined,
      "error": null,
      "isError": false,
      "isLoaded": false,
      "isLoading": true,
      "isObserving": false,
      "metadata": undefined,
      "size": undefined
    });

    await promise;

    assert.deepEqual(query.get('serialized'), {
      "empty": false,
      "error": null,
      "isError": false,
      "isLoaded": true,
      "isLoading": false,
      "isObserving": false,
      "metadata": {
        "fromCache": false,
        "hasPendingWrites": false,
      },
      "size": 3
    });

    run(() => query.destroy());
  });

  test('observe', async function(assert) {
    await this.recreate();

    await this.coll.doc('green').set({ name: 'green' });
    await waitForCollectionSize(this.coll, 1);

    let query = this.store.query({ type: 'array', query: db => db.collection('ducks').orderBy('name') });

    await query.load();

    assert.deepEqual(query.get('content').mapBy('path'), [
      'ducks/green'
    ]);

    query.observe();

    assert.deepEqual(query.get('serialized'), {
      "empty": false,
      "error": null,
      "isError": false,
      "isLoaded": true,
      "isLoading": false,
      "isObserving": true,
      "metadata": {
        "fromCache": false,
        "hasPendingWrites": false
      },
      "size": 1
    });

    await this.coll.doc('yellow').set({ name: 'yellow' });
    await waitForCollectionSize(this.coll, 2);

    assert.deepEqual(query.get('content').mapBy('path'), [
      'ducks/green',
      'ducks/yellow'
    ]);

    run(() => query.destroy());
  });

});
