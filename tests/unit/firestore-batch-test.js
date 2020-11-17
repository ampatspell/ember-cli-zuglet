import { module, test, setupStoreTest } from '../helpers/setup';
import { replaceCollection } from '../helpers/util';

module('firestore / batch', function(hooks) {
  setupStoreTest(hooks);

  test('batch as async callback', async function(assert) {
    let coll = this.store.collection('ducks');
    await replaceCollection(coll, []);

    let ret = await this.store.batch(async batch => {
      batch.save(coll.doc('yellow').new({ name: 'yellow' }));
      return { ok: true };
    });

    assert.deepEqual(ret, { ok: true });

    let data = await coll.doc('yellow').data();
    assert.deepEqual(data, { name: 'yellow' });
  });

  test('batch with commit', async function(assert) {
    let coll = this.store.collection('ducks');
    await replaceCollection(coll, []);

    let batch = this.store.batch();
    batch.save(coll.doc('yellow').new({ name: 'yellow' }));
    await batch.commit();

    let data = await coll.doc('yellow').data();
    assert.deepEqual(data, { name: 'yellow' });
  });

  test('save doc', async function(assert) {
    let coll = this.store.collection('ducks');
    await replaceCollection(coll, []);

    let doc = coll.doc('yellow').new({ name: 'yellow' });

    await this.store.batch(batch => {
      let ret = batch.save(doc);
      assert.ok(ret === doc);
      assert.strictEqual(doc.isSaving, true);
      assert.strictEqual(doc.exists, undefined);
    });

    assert.strictEqual(doc.isSaving, false);
    assert.strictEqual(doc.exists, true);

    let data = await coll.doc('yellow').data();
    assert.deepEqual(data, { name: 'yellow' });
  });

  test('delete doc', async function(assert) {
    let coll = this.store.collection('ducks');
    await replaceCollection(coll, [
      { _id: 'yellow', name: 'yellow' }
    ]);

    let doc = await coll.doc('yellow').load();

    await this.store.batch(batch => {
      batch.delete(doc);
      assert.strictEqual(doc.isSaving, true);
      assert.strictEqual(doc.exists, true);
    });

    assert.strictEqual(doc.isSaving, false);
    assert.strictEqual(doc.exists, false);

    let data = await doc.ref.data();
    assert.ok(!data);
  });

  test('delete ref', async function(assert) {
    let coll = this.store.collection('ducks');
    await replaceCollection(coll, [
      { _id: 'yellow', name: 'yellow' }
    ]);

    let ref = await coll.doc('yellow');

    await this.store.batch(batch => {
      batch.delete(ref);
    });

    let data = await ref.data();
    assert.ok(!data);
  });

});
