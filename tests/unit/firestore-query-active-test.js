import { module, test, setupStoreTest } from '../helpers/setup';
import { replaceCollection, saveCollection, poll } from '../helpers/util';

module('firestore / query / active', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(function() {
  });

  test('array load and activate', async function(assert) {
    let ref = this.store.collection('ducks');
    await replaceCollection(ref, [
      { _id: 'yellow', name: 'yellow' },
      { _id: 'green', name: 'green' }
    ]);

    let query = ref.orderBy('name', 'asc').query();

    await query.load();
    assert.deepEqual(query.content.map(doc => doc.id), [ 'green', 'yellow' ]);

    await replaceCollection(ref, [
      { _id: 'red', name: 'red' },
      { _id: 'orange', name: 'orange' },
      { _id: 'blue', name: 'blue' },
    ]);

    this.activate(query);
    await query.promise.cached;

    assert.deepEqual(query.content.map(doc => doc.id), [ 'blue', 'orange', 'red' ]);

    await replaceCollection(ref, [
      { _id: 'yellow', name: 'yellow' },
      { _id: 'green', name: 'green' }
    ]);

    await poll(() => query.content.length === 2);

    assert.deepEqual(query.content.map(doc => doc.id), [ 'green', 'yellow' ]);

    await saveCollection(ref, [
      { _id: 'yellow', name: 'yellow #2' },
      { _id: 'orange', name: 'orange'},
      { _id: 'green', name: 'green' },
      { _id: 'red', name: 'red' }
    ]);

    await poll(() => query.content.length === 4);

    assert.deepEqual(query.content.map(doc => doc.id), [ 'green', 'orange', 'red', 'yellow' ]);
  });

  test('reuse registered', async function(assert) {
    let ref = this.store.collection('ducks');
    await replaceCollection(ref, [
      { _id: 'yellow', name: 'yellow' },
      { _id: 'green', name: 'green' }
    ]);

    let query = ref.orderBy('name', 'asc').query();
    this.activate(query);
    await query.promise.cached;

    assert.deepEqual(query.content.map(doc => doc.id), [ 'green', 'yellow' ]);

    let doc = ref.doc('red').new({ name: 'red' });
    query.register(doc);

    await doc.save();

    assert.ok(query.content.includes(doc));
    assert.ok(query._reusable.indexOf(doc) === -1);
  });

  test('passive', async function(assert) {
    let ref = this.store.collection('ducks');
    await replaceCollection(ref, [
      { _id: 'yellow', name: 'yellow' }
    ]);

    let query = ref.orderBy('name', 'asc').query().passive();
    assert.strictEqual(query.isLoading, false);
    this.activate(query);
    assert.strictEqual(query.isLoading, true);
    await query.promise.cached;
    assert.strictEqual(query.isLoading, false);
    assert.strictEqual(query.isLoaded, true);

    assert.deepEqual(query.content.map(doc => doc.id), [ 'yellow' ]);
  });

  test('single load and activate', async function(assert) {
    let ref = this.store.collection('ducks');
    await replaceCollection(ref, [
      { _id: 'yellow', name: 'yellow' }
    ]);

    let query = ref.orderBy('name', 'asc').limit(1).query({ type: 'single' });

    await query.load();
    assert.strictEqual(query.content.id, 'yellow');

    await saveCollection(ref, [
      { _id: 'red', name: 'red' }
    ]);

    this.activate(query);
    await query.promise.cached;

    assert.strictEqual(query.content.id, 'red');

    await saveCollection(ref, [
      { _id: 'green', name: 'green' }
    ]);

    await poll(() => query.content.id === 'green');
    assert.strictEqual(query.content.id, 'green');

    await saveCollection(ref, [
      { _id: 'green', name: 'green #2' }
    ]);

    await poll(() => query.content.data.name === 'green #2');
    assert.strictEqual(query.content.data.name, 'green #2');

    await replaceCollection(ref, []);

    await poll(() => !query.content);
    assert.strictEqual(query.content, null);
  });

});
