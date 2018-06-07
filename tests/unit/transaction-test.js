import { module, test, setupStoreTest, setupDucks } from '../helpers/setup';
import { all } from 'rsvp';

module('transaction', function(hooks) {
  setupStoreTest(hooks);
  setupDucks(hooks);

  hooks.beforeEach(function() {
    this.increment = doc => this.store.transaction(async tx => {
      await tx.load(doc);
      doc.incrementProperty('data.value');
      tx.save(doc);
    });
  });

  test('load and save document', async function(assert) {
    let doc = await this.store.doc(`ducks/yellow`).new({ value: 0 }).save();

    let promise = this.increment(doc);
    assert.ok(promise);
    assert.ok(promise.then);

    await promise;

    doc = await doc.reload();
    assert.deepEqual(doc.get('data.serialized'), {
      value: 1
    });
  });

  test('parallel', async function(assert) {
    let doc = await this.store.doc(`ducks/yellow`).new({ value: 0 }).save();

    let promises = [];
    for(let i = 0; i < 5; i++) {
      promises.push(this.increment(doc));
    }

    await all(promises);

    doc = await doc.reload();
    assert.deepEqual(doc.get('data.serialized'), {
      value: 5
    });
  });

  test('settle', async function(assert) {
    let doc = await this.store.doc(`ducks/yellow`).new({ value: 0 }).save();
    this.increment(doc);

    await this.store.settle();

    doc = await this.store.doc('ducks/yellow').load();
    assert.deepEqual(doc.get('data.serialized'), {
      value: 1
    });
  });

  test('load ref', async function(assert) {
    let ref = this.store.doc(`ducks/yellow`);
    await ref.new({ value: 0 }).save();

    await this.store.transaction(async tx => {
      let doc = await tx.load(ref);
      doc.incrementProperty('data.value');
      tx.save(doc);
    });

    let doc = await ref.load();
    assert.deepEqual(doc.get('data.serialized'), {
      value: 1
    });
  });

});
