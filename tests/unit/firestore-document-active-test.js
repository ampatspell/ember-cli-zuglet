import { module, test, setupStoreTest } from '../helpers/setup';
import { defer } from 'zuglet/utils';

module('firestore / document / active', function(hooks) {
  setupStoreTest(hooks);

  test('activate saved document', async function(assert) {
    let ref = this.store.doc('ducks/yellow');
    await ref.save({ message: 'hey' });

    let doc = ref.new({ name: 'yellow' });
    await doc.save({ merge: true });

    this.activate(doc);
    await doc.promise;

    assert.deepEqual(doc.data, {
      name: 'yellow',
      message: 'hey'
    });
  });

  test('activate existing document', async function(assert) {
    let ref = this.store.doc('ducks/yellow');
    await ref.save({ name: 'yellow' });

    let doc = await ref.existing();
    this.activate(doc);

    assert.strictEqual(doc.isLoading, true);
    assert.strictEqual(doc.isLoaded, false);

    await doc.promise;

    assert.strictEqual(doc.isLoading, false);
    assert.strictEqual(doc.isLoaded, true);

    assert.deepEqual(doc.data, {
      name: 'yellow'
    });
  });

  test('activate passive existing document', async function(assert) {
    let ref = this.store.doc('ducks/yellow');
    await ref.save({ name: 'yellow' });

    let doc = await ref.existing().passive();
    this.activate(doc);

    assert.strictEqual(doc.isLoading, true);
    assert.strictEqual(doc.isLoaded, false);

    await doc.promise;

    assert.strictEqual(doc.isLoading, false);
    assert.strictEqual(doc.isLoaded, true);

    assert.deepEqual(doc.data, {
      name: 'yellow'
    });
  });

  test('activate new', async function(assert) {
    let ref = this.store.doc('ducks/yellow');
    let doc = await ref.new({ name: 'yellow' }).passive();

    this.activate(doc);

    assert.strictEqual(doc.isLoading, false);
    assert.strictEqual(doc.isLoaded, false);
  });

  test('on data', async function(assert) {
    let ref = this.store.doc('ducks/yellow');
    await ref.save({ name: 'yellow' });

    let doc = await ref.existing();
    let deferred = defer();
    doc.onData(() => {
      assert.deepEqual(doc.data, { name: 'yellow' });
      deferred.resolve();
    });

    this.activate(doc);
    await deferred.promise;
  });

  test('on delete', async function(assert) {
    let ref = this.store.doc('ducks/yellow');
    await ref.save({ name: 'yellow' });

    let doc = await ref.existing();
    let deferred = defer();
    doc.onDeleted(() => {
      assert.ok(true);
      deferred.resolve();
    });

    this.activate(doc);
    await ref.delete();
    await deferred.promise;
  });

  test('listener cancel', async function(assert) {
    let ref = this.store.doc('ducks/yellow');
    await ref.save({ name: 'yellow' });

    let doc = await ref.existing();

    let invocations = 0;
    let cancel = doc.onData(() => {
      invocations++;
    });

    this.activate(doc);
    await doc.promise;

    let snapshot;

    snapshot = invocations;
    await doc.reload();
    assert.ok(snapshot !== invocations);

    assert.ok(cancel());

    snapshot = invocations;
    await doc.reload();
    assert.ok(snapshot === invocations);

    assert.ok(!cancel());
  });

});
