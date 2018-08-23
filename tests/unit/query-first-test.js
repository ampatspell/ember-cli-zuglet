import { module, test, setupStoreTest } from '../helpers/setup';
import { recreateCollection, waitForCollectionSize } from '../helpers/firebase';
import { all } from 'rsvp';
import { run } from '@ember/runloop';

module('query-first', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(async function() {
    this.coll = this.firestore.collection('ducks');
    this.recreate = () => recreateCollection(this.coll);
  });

  test('create query', function(assert) {
    let query = this.store.collection('ducks').query({ type: 'first' });
    assert.ok(query);
    assert.ok(query._internal);
    assert.deepEqual(query.get('serialized'), {
      "type": "first",
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

    let query = this.store.collection('ducks').orderBy('name').query({ type: 'first' });

    let promise = query.load();

    assert.deepEqual(query.get('serialized'), {
      "type": "first",
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
      "type": "first",
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
      "size": 1
    });

    assert.equal(query.get('content.path'), 'ducks/green');

    run(() => query.destroy());
  });

  test('mutations', async function(assert) {
    await this.recreate();
    // await all([
    //   this.coll.doc('yellow').set({ name: 'yellow' }),
    //   this.coll.doc('green').set({ name: 'green' }),
    //   this.coll.doc('red').set({ name: 'red' })
    // ]);

    let query = this.store.collection('ducks').orderBy('name').query({ type: 'first' });
    await query.load();

    assert.equal(query.get('content.path'), undefined);

    query.observe();

    await this.coll.doc('yellow').set({ name: 'yellow' });
    await waitForCollectionSize(this.coll, 1);

    assert.equal(query.get('content.path'), 'ducks/yellow');

    await this.coll.doc('green').set({ name: 'green' });
    await waitForCollectionSize(this.coll, 2);

    assert.equal(query.get('content.path'), 'ducks/green');

    await this.coll.doc('green').delete();
    await waitForCollectionSize(this.coll, 1);

    assert.equal(query.get('content.path'), 'ducks/yellow');

    await this.coll.doc('yellow').delete();
    await waitForCollectionSize(this.coll, 0);

    assert.equal(query.get('content.path'), undefined);

    run(() => query.destroy());
  });

  test('observe query', async function(assert) {
    await this.recreate();
    await this.coll.doc('yellow').set({ name: 'yellow' });
    await waitForCollectionSize(this.coll, 1);

    let query = this.store.collection('ducks').orderBy('name').query({ type: 'first' });

    let observer = query.observe();
    assert.ok(observer.get('query') === query);

    assert.deepEqual(query.get('serialized'), {
      "type": "first",
      "empty": undefined,
      "error": null,
      "isError": false,
      "isLoaded": false,
      "isLoading": true,
      "isObserving": true,
      "metadata": undefined,
      "size": undefined
    });

    await observer.get('promise');

    assert.deepEqual(query.get('serialized'), {
      "type": "first",
      "empty": false,
      "error": null,
      "isError": false,
      "isLoaded": true,
      "isLoading": false,
      "isObserving": true,
      "metadata": {
        "fromCache": query.get('metadata.fromCache'),
        "hasPendingWrites": false,
      },
      "size": 1
    });

    assert.equal(query.get('content.path'), 'ducks/yellow');

    observer.cancel();
  });

});
