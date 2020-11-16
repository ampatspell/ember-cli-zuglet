import { module, test, setupStoreTest } from '../helpers/setup';
import { replaceCollection, poll } from '../helpers/util';

module('firestore / query / active', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(function() {
  });

  test('load and activate', async function(assert) {
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
    await query.promise;

    assert.deepEqual(query.content.map(doc => doc.id), [ 'blue', 'orange', 'red' ]);

    await replaceCollection(ref, [
      { _id: 'yellow', name: 'yellow' },
      { _id: 'green', name: 'green' }
    ]);

    await poll(() => query.content.length === 2);

    assert.deepEqual(query.content.map(doc => doc.id), [ 'green', 'yellow' ]);
  });

});
