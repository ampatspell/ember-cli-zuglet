import { module, test, setupStoreTest } from '../helpers/setup';
import { recreateCollection, waitForCollectionSize, waitForLength } from '../helpers/firebase';
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

    let query = this.store.query({ type: 'array', query: db => db.collection('ducks').orderBy('name', 'asc') });

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

  const makeMutationsTest = testOpts => {
    let title = `observe mutations – ${testOpts.testOpts ? 'load before observe' : 'observe only'}`;
    return test(title, async function(assert) {

      await this.recreate();

      let coll = this.coll;

      await all([
        coll.add({ name: 'yellow' }),
        coll.add({ name: 'green' }),
        coll.add({ name: 'red' })
      ]);

      let query = this.store.query({ type: 'array', query: db => db.collection('ducks').orderBy('name') });

      if(testOpts.loadBeforeObserve) {
        await query.load();
        await query.observe();
      } else {
        await query.observe();
        await waitForLength(query.get('content'), 3);
      }

      let content = query.get('content');

      assert.deepEqual(content.mapBy('data.name'), [
        "green",
        "red",
        "yellow"
      ]);

      let [ brown, magenta ] = await all([
        coll.add({ name: 'brown' }),
        coll.add({ name: 'magenta' })
      ]);

      await waitForLength(content, 5);

      assert.deepEqual(content.mapBy('data.name'), [
        "brown",
        "green",
        "magenta",
        "red",
        "yellow"
      ]);

      let green = content.findBy('data.name', 'green');

      await all([
        green.get('_internal.ref').delete(),
        brown.set({ name: 'white' }),
        magenta.set({ name: 'pink' })
      ]);

      await waitForLength(content, 4);

      assert.deepEqual(content.mapBy('data.name'), [
        "pink",
        "red",
        "white",
        "yellow"
      ]);

      run(() => query.destroy());
    });
  };

  makeMutationsTest({ loadBeforeObserve: true });
  makeMutationsTest({ loadBeforeObserve: false });

});
