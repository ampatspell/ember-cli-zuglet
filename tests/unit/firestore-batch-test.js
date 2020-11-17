import { module, test, setupStoreTest } from '../helpers/setup';
import { replaceCollection } from '../helpers/util';

module('firestore / batch', function(hooks) {
  setupStoreTest(hooks);

  test('batch as async callback', async function(assert) {
    let coll = this.store.collection('ducks');
    await replaceCollection(coll, []);

    let ret = await this.store.batch(batch => {
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

  // batch.save
  // batch.delete
  // batch updates doc state after commit resolves
  // batch save takes doc
  // batch delete takes doc or ref

});
