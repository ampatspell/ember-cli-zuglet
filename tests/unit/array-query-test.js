import { module, test, setupStoreTest } from '../helpers/setup';
import { recreateCollection } from '../helpers/firebase';
import { all } from 'rsvp';

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
      "metadata": undefined,
      "size": undefined
    });
  });

  test('load query', async function(assert) {
    await this.recreate();
    await this.coll.doc('yellow').set({ name: 'yellow' });
    await this.coll.doc('green').set({ name: 'green' });
    await this.coll.doc('red').set({ name: 'red' });

    let query = this.store.query({ type: 'array', query: db => db.collection('ducks').orderBy('name') });

    await all([
      query.load(),
      query.load()
    ]);

    assert.ok(query);
  });

});
