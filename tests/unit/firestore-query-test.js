import { module, test, setupStoreTest } from '../helpers/setup';
import { replaceCollection } from '../helpers/firestore';

module('firestore / query', function(hooks) {
  setupStoreTest(hooks);

  test('load array', async function(assert) {
    let ref = this.store.collection('ducks');
    await replaceCollection(ref, [
      { _id: 'yellow', name: 'yellow' },
      { _id: 'green', name: 'green' }
    ]);

    let query = ref.orderBy('name', 'asc').query();

    assert.deepEqual(query.serialized, {
      isLoaded: false,
      isLoading: false,
      isError: false,
      error: null,
      string: 'ducks.orderBy(name, asc)'
    });

    let promise = query.load();
    assert.deepEqual(query.serialized, {
      isLoaded: false,
      isLoading: true,
      isError: false,
      error: null,
      string: 'ducks.orderBy(name, asc)'
    });
    await promise;

    assert.deepEqual(query.serialized, {
      isLoaded: true,
      isLoading: false,
      isError: false,
      error: null,
      string: 'ducks.orderBy(name, asc)'
    });

    assert.strictEqual(query.content.length, 2);

    assert.deepEqual(query.content.map(doc => doc.data), [
      { name: 'green' },
      { name: 'yellow' }
    ]);
  });

  test('load single', async function(assert) {
    let ref = this.store.collection('ducks');
    await replaceCollection(ref, [
      { _id: 'yellow', name: 'yellow' },
      { _id: 'green', name: 'green' }
    ]);

    let query = ref.orderBy('name', 'asc').limit(1).query({ type: 'single' });

    assert.deepEqual(query.serialized, {
      isLoaded: false,
      isLoading: false,
      isError: false,
      error: null,
      string: 'ducks.orderBy(name, asc).limit(1)'
    });

    let promise = query.load();
    assert.deepEqual(query.serialized, {
      isLoaded: false,
      isLoading: true,
      isError: false,
      error: null,
      string: 'ducks.orderBy(name, asc).limit(1)'
    });
    await promise;

    assert.deepEqual(query.serialized, {
      isLoaded: true,
      isLoading: false,
      isError: false,
      error: null,
      string: 'ducks.orderBy(name, asc).limit(1)'
    });

    assert.deepEqual(query.content.data, {
      name: 'green'
    });
  });

  test('toJSON', function(assert) {
    let ref = this.store.collection('ducks');
    let query = ref.orderBy('name', 'asc').limit(1).query({ type: 'single' });
    let json = query.toJSON();
    assert.deepEqual(json, {
      instance: json.instance,
      serialized: {
        isLoaded: false,
        isLoading: false,
        isError: false,
        error: null,
        string: 'ducks.orderBy(name, asc).limit(1)'
      }
    });
    assert.ok(json.instance.startsWith('QuerySingle::ember'));
  });

  test('toStringExtension', function(assert) {
    let ref = this.store.collection('ducks');
    let query = ref.orderBy('name', 'asc').limit(1).query({ type: 'single' });
    let string = query.toStringExtension();
    assert.strictEqual(string, 'ducks.orderBy(name, asc).limit(1)');
  });


});
