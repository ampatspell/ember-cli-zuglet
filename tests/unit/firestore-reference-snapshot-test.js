import { module, test, setupStoreTest } from '../helpers/setup';
import { replaceCollection } from '../helpers/util';

module('firestore / reference / snapshot', function(hooks) {
  setupStoreTest(hooks);

  test(`startAt`, async function(assert) {
    let ref = this.store.collection('ducks');
    await replaceCollection(ref, [
      { _id: 'yellow', name: 'yellow' },
      { _id: 'green', name: 'green' },
      { _id: 'orange', name: 'orange' },
    ]);
    let doc = await ref.doc('orange').load();
    let query = await ref.orderBy('name', 'asc').startAt(doc).query().load();
    assert.deepEqual(query.content.map(doc => doc.id), [ 'orange', 'yellow' ]);
  });

  test(`startAfter`, async function(assert) {
    let ref = this.store.collection('ducks');
    await replaceCollection(ref, [
      { _id: 'yellow', name: 'yellow' },
      { _id: 'green', name: 'green' },
      { _id: 'orange', name: 'orange' },
    ]);
    let doc = await ref.doc('orange').load();
    let query = await ref.orderBy('name', 'asc').startAfter(doc).query().load();
    assert.deepEqual(query.content.map(doc => doc.id), [ 'yellow' ]);
  });

  test(`endAt`, async function(assert) {
    let ref = this.store.collection('ducks');
    await replaceCollection(ref, [
      { _id: 'yellow', name: 'yellow' },
      { _id: 'green', name: 'green' },
      { _id: 'orange', name: 'orange' },
    ]);
    let doc = await ref.doc('orange').load();
    let query = await ref.orderBy('name', 'asc').endAt(doc).query().load();
    assert.deepEqual(query.content.map(doc => doc.id), [ 'green', 'orange' ]);
  });

  test(`endBefore`, async function(assert) {
    let ref = this.store.collection('ducks');
    await replaceCollection(ref, [
      { _id: 'yellow', name: 'yellow' },
      { _id: 'green', name: 'green' },
      { _id: 'orange', name: 'orange' },
    ]);
    let doc = await ref.doc('orange').load();
    let query = await ref.orderBy('name', 'asc').endBefore(doc).query().load();
    assert.deepEqual(query.content.map(doc => doc.id), [ 'green' ]);
  });

  test(`document without snapshot`, async function(assert) {
    let ref = this.store.collection('ducks');
    let doc = await ref.doc('orange').existing();
    try {
      ref.orderBy('name', 'asc').startAt(doc);
      assert.ok(false);
    } catch(err) {
      assert.strictEqual(err.message, `Assertion Failed: Document '${doc}' is not yet loaded`);
    }
  });

  test(`string`, async function(assert) {
    let ref = this.store.collection('ducks');
    await replaceCollection(ref, [
      { _id: 'yellow', name: 'yellow' },
      { _id: 'green', name: 'green' },
      { _id: 'orange', name: 'orange' },
    ]);
    let doc = await ref.doc('orange').load();
    let queryable = ref.orderBy('name', 'asc').startAt(doc);
    assert.deepEqual(queryable.string, `ducks.orderBy('name', 'asc').startAt(orange)`);
  });

});
