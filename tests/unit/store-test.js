import { module, test, setupStoreTest, setupDucks } from '../helpers/setup';
import { run } from '@ember/runloop';

module('store', function(hooks) {
  setupStoreTest(hooks);
  setupDucks(hooks);

  test('settle', async function(assert) {
    let ops = this.store.get('_internal.queue.operations');

    assert.equal(ops.get('length'), 0);

    let foobar = this.store.doc('ducks/foobar').new({ name: 'foobar' });
    foobar.save();

    assert.equal(ops.get('length'), 1);

    let query = this.store.collection('ducks').query({ type: 'array' });
    query.load();

    assert.equal(ops.get('length'), 2);

    this.store.doc('ducks/whatever').load({ optional: true });
    this.store.collection('ducks').load();

    assert.equal(ops.get('length'), 4);

    await this.store.settle();

    assert.equal(ops.get('length'), 0);

    assert.equal(foobar.get('isNew'), false);
    assert.equal(query.get('isLoaded'), true);
  });

  test('observed models are destroyed', async function(assert) {
    let foobar = this.store.doc('ducks/foobar').new({ name: 'foobar' });
    await foobar.save();
    foobar.observe();

    let query = this.store.collection('ducks').query({ type: 'array' });
    await query.load();
    query.observe();

    assert.equal(this.store.get('observed.length'), 2);

    run(() => this.store.destroy());

    assert.ok(foobar.isDestroyed);
    assert.ok(query.isDestroyed);
  });

});
