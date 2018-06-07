import { module, test, setupStoreTest, setupDucks } from '../helpers/setup';
import { all } from 'rsvp';
import { run } from '@ember/runloop';

module('batch', function(hooks) {
  setupStoreTest(hooks);
  setupDucks(hooks);

  test('create a batch', async function(assert) {
    let batch = this.store.batch();
    assert.ok(batch);
    assert.ok(batch._internal);
  });

  test('batch has commit', async function(assert) {
    let batch = this.store.batch();
    let promise = batch.commit();
    assert.ok(promise);
    assert.ok(promise.then);
    let result = await promise;
    assert.equal(result, undefined);
  });

  test('batch save and delete', async function(assert) {
    await this.store.doc(`ducks/green`).existing().delete();

    let yellow = await this.store.doc(`ducks/yellow`).new({ name: 'yellow' }).save();
    let green = this.store.doc(`ducks/green`).new({ name: 'green' });

    let batch = this.store.batch();
    batch.save(green);
    batch.delete(yellow);
    batch.commit();

    await run(() => this.store.settle());

    let exists = (await all([
      this.store.doc('ducks/yellow').load({ optional: true }),
      this.store.doc('ducks/green').load({ optional: true }),
    ])).map(doc => doc.get('exists'));

    assert.deepEqual(exists, [ false, true ]);
  });

  test('batch with fn callback', async function(assert) {
    await this.store.doc(`ducks/green`).existing().delete();

    let yellow = await this.store.doc(`ducks/yellow`).new({ name: 'yellow' }).save();
    let green = this.store.doc(`ducks/green`).new({ name: 'green' });

    await this.store.batch(batch => {
      batch.save(green);
      batch.delete(yellow);
    });

    let exists = (await all([
      this.store.doc('ducks/yellow').load({ optional: true }),
      this.store.doc('ducks/green').load({ optional: true }),
    ])).map(doc => doc.get('exists'));

    assert.deepEqual(exists, [ false, true ]);
  });

  test('batch delete ref', async function(assert) {
    let ref = this.store.doc(`ducks/yellow`);
    await ref.new({ name: 'yellow' }).save();

    await this.store.batch(b => {
      b.delete(ref);
    });

    assert.equal((await ref.load({ optional: true })).get('exists'), false);
  });

});
