import { module, test, setupStoreTest } from '../helpers/setup';

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

});
