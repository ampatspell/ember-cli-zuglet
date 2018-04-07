import { module, test, setupStoreTest } from '../helpers/setup';
import { recreateCollection, waitForCollectionSize, waitForLength } from '../helpers/firebase';
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

});
