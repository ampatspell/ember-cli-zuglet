import { module, test, setupStoreTest } from '../helpers/setup';
import { replaceCollection } from '../helpers/util';

module('firestore / transaction', function(hooks) {
  setupStoreTest(hooks);

  test('load ref', async function(assert) {
    let coll = this.store.collection('ducks');
    await replaceCollection(coll, [
      { _id: 'yellow', name: 'yellow' }
    ]);

    await this.store.transaction(async tx => {
      let yellow = await tx.load(coll.doc('yellow'));
      assert.deepEqual(yellow.data, {
        name: 'yellow'
      });
    });
  });

  test('load doc', async function(assert) {
    let coll = this.store.collection('ducks');
    await replaceCollection(coll, [
      { _id: 'yellow', name: 'yellow' }
    ]);

    await this.store.transaction(async tx => {
      let yellow = await tx.load(coll.doc('yellow').existing());
      assert.deepEqual(yellow.data, {
        name: 'yellow'
      });
    });
  });

  test('save doc', async function(assert) {
    let coll = this.store.collection('ducks');
    await replaceCollection(coll, [
      { _id: 'yellow', name: 'yellow' }
    ]);

    await this.store.transaction(async tx => {
      let yellow = await tx.load(coll.doc('yellow'));
      yellow.data.name = 'Yelllow!';
      await tx.save(yellow);
    });

    let yellow = await coll.doc('yellow').load();
    assert.deepEqual(yellow.data, {
      name: 'Yelllow!'
    });
  });

  test('delete ref', async function(assert) {
    let coll = this.store.collection('ducks');
    await replaceCollection(coll, [
      { _id: 'yellow', name: 'yellow' }
    ]);

    await this.store.transaction(async tx => {
      tx.delete(coll.doc('yellow'));
    });

    let doc = await coll.doc('yellow').load({ optional: true });
    assert.strictEqual(doc, undefined);
  });

  test('delete doc', async function(assert) {
    let coll = this.store.collection('ducks');
    await replaceCollection(coll, [
      { _id: 'yellow', name: 'yellow' }
    ]);

    await this.store.transaction(async tx => {
      let doc = await tx.load(coll.doc('yellow'));
      tx.delete(doc);
    });

    let doc = await coll.doc('yellow').load({ optional: true });
    assert.strictEqual(doc, undefined);
  });

});
